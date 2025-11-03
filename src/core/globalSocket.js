import storage from 'store'
import { notification } from 'ant-design-vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'

const DEFAULT_WS_URL = process.env.VUE_APP_CHAT_WS || 'ws://cashmoo.cn/loans/ws/chat'
const MAX_RECONNECT_ATTEMPTS = 5
const MAX_CACHE_SIZE = 200

const listeners = new Map()
const notifiedSessions = new Set()
const notifiedMessages = new Set()

function ensureListenerBucket (event) {
  if (!listeners.has(event)) {
    listeners.set(event, new Set())
  }
  return listeners.get(event)
}

function emit (event, payload) {
  const bucket = listeners.get(event)
  if (!bucket || !bucket.size) return
  bucket.forEach(fn => {
    try {
      fn(payload)
    } catch (err) {
      /* eslint-disable no-console */
      console.error('[globalSocket] listener error', err)
      /* eslint-enable no-console */
    }
  })
}

class GlobalSocket {
  constructor () {
    this.ws = null
    this.status = 'disconnected'
    this.shouldReconnect = true
    this.reconnectAttempts = 0
    this.reconnectTimer = null
    this.lastUrl = ''
  }

  isBrowser () {
    return typeof window !== 'undefined' && typeof WebSocket !== 'undefined'
  }

  getToken () {
    return storage.get(ACCESS_TOKEN) || window.localStorage.getItem('ACCESS_TOKEN') || ''
  }

  buildWsUrl () {
    const token = this.getToken()
    const params = ['userType=2']
    if (token) params.push('token=' + encodeURIComponent(token))
    return (process.env.VUE_APP_CHAT_WS || DEFAULT_WS_URL) + (params.length ? '?' + params.join('&') : '')
  }

  setStatus (nextStatus) {
    if (this.status === nextStatus) return
    this.status = nextStatus
    emit('status', nextStatus)
  }

  getStatus () {
    return this.status
  }

  getSocket () {
    return this.ws
  }

  on (event, handler) {
    const bucket = ensureListenerBucket(event)
    bucket.add(handler)
    return () => this.off(event, handler)
  }

  off (event, handler) {
    const bucket = listeners.get(event)
    if (!bucket) return
    bucket.delete(handler)
    if (!bucket.size) {
      listeners.delete(event)
    }
  }

  ensureConnection () {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return this.ws
    }
    return this.connect()
  }

  connect (force = false) {
    if (!this.isBrowser()) return null
    const token = this.getToken()
    if (!token) {
      this.setStatus('disconnected')
      return null
    }

    if (this.ws) {
      if (!force && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
        return this.ws
      }
      this.closeSocket(false)
    }

    this.shouldReconnect = true
    this.setStatus('connecting')
    const url = this.buildWsUrl()
    this.lastUrl = url
    try {
      this.ws = new WebSocket(url)
      this.attachSocketEvents()
      emit('connect', { url })
    } catch (err) {
      this.ws = null
      this.setStatus('error')
      emit('error', err)
      this.scheduleReconnect()
      return null
    }

    return this.ws
  }

  attachSocketEvents () {
    if (!this.ws) return

    this.ws.onopen = event => {
      this.reconnectAttempts = 0
      this.setStatus('connected')
      emit('open', { event, socket: this.ws })
    }

    this.ws.onmessage = event => {
      emit('message', event)
      const parsed = this.tryParse(event.data)
      if (parsed !== undefined) {
        emit('message:parsed', { data: parsed, raw: event })
        this.handleNotification(parsed)
      }
    }

    this.ws.onerror = event => {
      this.setStatus('error')
      emit('error', event)
    }

    this.ws.onclose = event => {
      emit('close', event)
      this.setStatus('disconnected')
      if (this.shouldReconnect) {
        this.scheduleReconnect()
      }
    }
  }

  tryParse (payload) {
    if (payload == null) return undefined
    if (typeof payload === 'object') return payload
    if (typeof payload !== 'string') return undefined
    try {
      return JSON.parse(payload)
    } catch (err) {
      return undefined
    }
  }

  scheduleReconnect () {
    if (!this.shouldReconnect) return
    if (!this.isBrowser()) return
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) return
    if (this.reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      emit('reconnect:failed', { attempts: this.reconnectAttempts })
      return
    }
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer)
    const delay = Math.min(5000, 1000 * Math.pow(2, this.reconnectAttempts))
    this.reconnectAttempts += 1
    emit('reconnect:scheduled', { delay, attempts: this.reconnectAttempts })
    this.reconnectTimer = window.setTimeout(() => {
      this.reconnectTimer = null
      this.connect(true)
    }, delay)
  }

  closeSocket (force = true) {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
    if (force) this.shouldReconnect = false
    if (this.ws) {
      this.ws.onopen = null
      this.ws.onmessage = null
      this.ws.onerror = null
      this.ws.onclose = null
      try {
        this.ws.close()
      } catch (err) {
        /* ignore close errors */
      }
      this.ws = null
    }
    this.setStatus('disconnected')
  }

  disconnect () {
    this.closeSocket(true)
  }

  send (payload) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      emit('send:failed', payload)
      return false
    }
    try {
      const normalized = typeof payload === 'string' ? payload : JSON.stringify(payload)
      this.ws.send(normalized)
      return true
    } catch (err) {
      emit('error', err)
      return false
    }
  }

  handleNotification (data) {
    if (!this.isBrowser() || !data) return
    if (data.type === 'new_apply') {
      this.notifyNewApply(data)
      return
    }
    if (data && typeof data === 'object' && 'type' in data && 'session' in data) {
      const evtType = String(data.type || '').toLowerCase()
      console.log('evtType', evtType)
      if (evtType === 'new_session') {
        this.notifyNewSession(data.session)
      }
      if (data.message) {
        this.notifyMessage(data.message, data.session)
      }
      return
    }
    if (data && typeof data === 'object' && data.message) {
      this.notifyMessage(data.message, data.session)
      return
    }
    this.notifyMessage(data)
  }

  notifyNewSession (session) {
    const sessionId = this.getSessionId(session)
    if (!sessionId) return
    if (notifiedSessions.has(sessionId)) return
    notifiedSessions.add(sessionId)
    this.pruneCache(notifiedSessions)

    const user = session?.user || {}
    const name = user.userId
    notification.info({
      message: '新会话待接入',
      description: `会话编号：${sessionId}，用户：${name}`,
      duration: 0
    })
  }

  notifyMessage (message, session) {
    if (!message || typeof message !== 'object') return
    const msgType = (message.type || '').toString().toUpperCase()
    if (msgType === 'PONG' || msgType === 'PING') return

    const senderId = message.senderId != null ? String(message.senderId) : ''
    const currentUid = this.getCurrentUserId()
    if (senderId && currentUid && senderId === currentUid) return

    const sessionId = message.sessionId || message.conversationId || message.chatId || message.session_id || (session ? this.getSessionId(session) : '')
    const messageId = message.id || `${sessionId || 'unknown'}-${message.timestamp || message.createdAt || message.createTime || Date.now()}`
    if (messageId && notifiedMessages.has(messageId)) return
    if (messageId) {
      notifiedMessages.add(messageId)
      this.pruneCache(notifiedMessages)
    }

    const content = message.content || message.message || message.body || ''
    const normalized = this.normalizeContent(content)
    const preview = normalized.kind === 'image' ? '[图片]' : (normalized.text || '收到新消息')
    const title = sessionId ? `新消息 - 会话 ${sessionId}` : '新消息'

    notification.info({
      message: title,
      description: preview,
      duration: 0
    })
  }

  notifyNewApply (payload) {
    console.log('payload', payload)
    if (!payload || typeof payload !== 'object') return
    const record = payload
    const bizId = record.user.id
    const applicant = record.loansNum || ''
    const phone = record.user.phone || ''
    const trueName = record.user.trueName || ''
    const nickName = record.user.nickName || ''

    const title = '审核提醒'
    const descriptionParts = []
    if (bizId) descriptionParts.push(`用户ID：${bizId}`)
    if (nickName) descriptionParts.push(`昵称：${nickName}`)
    if (trueName) descriptionParts.push(`真实姓名：${trueName}`)
    if (phone) descriptionParts.push(`手机号：${phone}`)
    if (applicant) descriptionParts.push(`申请金额：${applicant}`)
    const description = descriptionParts.join('，') || '收到新的审核申请'

    notification.info({
      message: title,
      description,
      duration: 0
    })
  }

  normalizeContent (raw) {
    if (raw == null) return { kind: 'text', text: '' }
    if (typeof raw === 'object') {
      if (raw.kind === 'image' && raw.url) {
        return { kind: 'image', url: raw.url, name: raw.name || '', size: raw.size }
      }
      if (raw.kind === 'text' && raw.text != null) {
        return { kind: 'text', text: String(raw.text) }
      }
      if (raw.url && !raw.kind) {
        return { kind: 'image', url: raw.url, name: raw.name || '', size: raw.size }
      }
      if (raw.text != null) return { kind: 'text', text: String(raw.text) }
      return { kind: 'text', text: JSON.stringify(raw) }
    }
    if (typeof raw === 'string') {
      try {
        const obj = JSON.parse(raw)
        return this.normalizeContent(obj)
      } catch (err) {
        return { kind: 'text', text: raw }
      }
    }
    return { kind: 'text', text: String(raw) }
  }

  getSessionId (session) {
    if (!session) return ''
    return session.sessionId || session.id || session.conversationId || session.chatId || session.uuid || session.ID || ''
  }

  getCurrentUserId () {
    if (!this.isBrowser()) return ''
    try {
      const info = JSON.parse(window.localStorage.getItem('userInfo') || '{}')
      const id = info && (info.id || info.userId)
      return id ? String(id) : ''
    } catch (err) {
      return ''
    }
  }

  pruneCache (set) {
    if (!set || typeof set.size !== 'number') return
    if (set.size <= MAX_CACHE_SIZE) return
    const iterator = set.values()
    const excess = set.size - MAX_CACHE_SIZE
    for (let i = 0; i < excess; i++) {
      const next = iterator.next()
      if (next.done) break
      set.delete(next.value)
    }
  }
}

const globalSocket = new GlobalSocket()

export default globalSocket

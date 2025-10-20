<template>
  <page-header-wrapper>
    <a-card :bordered="false" class="cs-chat-card">
      <div class="cs-chat">
        <!-- 会话列表 -->
        <div class="cs-chat__sessions">
          <div class="cs-chat__sessions-header">
            <span class="cs-chat__title">待接入会话</span>
            <div class="cs-chat__sessions-actions">
              <a-button type="link" size="small" @click="fetchPendingSessions" :loading="loadingSessions">
                <a-icon type="reload" />刷新
              </a-button>
            </div>
          </div>
          <a-spin :spinning="loadingSessions">
            <div class="cs-chat__session-list">
              <template v-if="pendingSessions.length">
                <div
                  v-for="session in pendingSessions"
                  :key="getSessionId(session)"
                  :class="['cs-chat__session-item', getSessionId(session) === selectedSessionId ? 'cs-chat__session-item--active' : '']"
                  @click="handleSessionSelect(session)"
                >
                  <div class="cs-chat__session-main">
                    <div class="cs-chat__session-name">{{ getSessionName(session) }}</div>
                    <div class="cs-chat__session-time">
                      {{ formatTime(session.updatedAt || session.updateTime || session.lastMessageTime || session.createTime) }}
                    </div>
                  </div>
                  <div class="cs-chat__session-preview">
                    {{ sessionPreview(session) }}
                  </div>
                </div>
              </template>
              <a-empty v-else description="暂无待接入会话" />
            </div>
          </a-spin>
        </div>
        <!-- 对话区域 -->
        <div class="cs-chat__conversation">
          <div class="cs-chat__conversation-header">
            <div>
              <div class="cs-chat__conversation-title">
                {{ selectedSession ? getSessionName(selectedSession) : '未选择会话' }}
              </div>
              <div class="cs-chat__conversation-subtitle" v-if="selectedSession">
                会话编号：{{ selectedSessionId }}
              </div>
            </div>
            <div class="cs-chat__status">
              <span class="cs-chat__status-dot" :class="'cs-chat__status-dot--' + wsStatus"></span>
              <span>{{ statusText }}</span>
            </div>
          </div>
          <div class="cs-chat__conversation-body">
            <template v-if="selectedSession">
              <div class="cs-chat__messages" ref="messagesContainer">
                <div v-if="sessionPageState.hasMore" class="cs-chat__load-more">
                  <a-button size="small" :loading="sessionPageState.loadingMore" @click="loadMoreMessages">
                    加载更多
                  </a-button>
                </div>
                <template v-if="activeMessages.length">
                  <div
                    v-for="message in activeMessages"
                    :key="message.id"
                    :class="['cs-chat__message', message.isSelf ? 'cs-chat__message--self' : '']"
                  >
                    <div class="cs-chat__message-meta">
                      <span class="cs-chat__message-sender">{{ message.sender || (message.isSelf ? '我' : '用户') }}</span>
                      <span class="cs-chat__message-time">{{ formatTime(message.timestamp) }}</span>
                    </div>
                    <div class="cs-chat__message-content">
                      {{ message.content }}
                    </div>
                  </div>
                </template>
                <a-empty v-else description="暂无消息" />
              </div>
              <div class="cs-chat__composer">
                <a-textarea
                  :rows="3"
                  v-model="messageInput"
                  placeholder="请输入回复内容，按 Enter 发送，Shift + Enter 换行"
                  @pressEnter="handleInputEnter"
                />
                <div class="cs-chat__composer-actions">
                  <a-button type="primary" @click="sendMessage" :disabled="sending || !messageInput.trim()" :loading="sending">
                    发送
                  </a-button>
                </div>
              </div>
            </template>
            <div v-else class="cs-chat__empty-state">
              <a-empty description="请选择左侧会话开始沟通" />
            </div>
          </div>
        </div>
      </div>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { pendingMessageList, getSessionMessage } from '@/api/business'
import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'

const WS_URL = 'ws://8.133.23.44/loans/ws/chat'

export default {
  name: 'CustomerServiceChat',
  data () {
    return {
      loadingSessions: false,
      pendingSessions: [],
      selectedSession: null,
      chatMessagesMap: {},
      messageInput: '',
      sending: false,
      ws: null,
      wsStatus: 'disconnected',
      reconnectTimer: null,
      reconnectAttempts: 0,
      maxReconnectAttempts: 5,
      shouldReconnect: true,
      currentWsSessionId: null,
      lastConnectUrl: '',
      // 分页状态映射：每个 sessionId 保存 page/size/hasMore
      sessionPaginationMap: {},
      defaultPageSize: 20
    }
  },
  computed: {
    selectedSessionId () {
      return this.getSessionId(this.selectedSession)
    },
    activeMessages () {
      const sessionId = this.selectedSessionId
      if (!sessionId) return []
      return this.chatMessagesMap[sessionId] || []
    },
    statusText () {
      switch (this.wsStatus) {
        case 'connecting': return '连接中'
        case 'connected': return '已连接'
        case 'error': return '连接异常'
        default: return '已断开'
      }
    },
    sessionPageState () {
      const id = this.selectedSessionId
      return this.sessionPaginationMap[id] || { page: 0, size: this.defaultPageSize, hasMore: false, loadingMore: false }
    }
  },
  created () {
    this.fetchPendingSessions()
  },
  mounted () {
    this.connectWebSocket()
  },
  beforeDestroy () {
    this.cleanupWebSocket(true)
  },
  methods: {
    async fetchPendingSessions () {
      if (this.loadingSessions) return
      this.loadingSessions = true
      try {
        const res = await pendingMessageList()
        const list = Array.isArray(res) ? res : (res && res.data ? res.data : [])
        this.pendingSessions = list
        if (!this.selectedSessionId && list.length) {
          this.handleSessionSelect(list[0])
        }
      } catch (e) {
        this.$message.error('加载会话列表失败')
      } finally {
        this.loadingSessions = false
      }
    },
    handleSessionSelect (session) {
      const sessionId = this.getSessionId(session)
      if (!sessionId) return
      this.selectedSession = session
      if (!this.chatMessagesMap[sessionId]) {
        this.$set(this.chatMessagesMap, sessionId, [])
      }
      if (!this.sessionPaginationMap[sessionId]) {
        this.$set(this.sessionPaginationMap, sessionId, { page: 0, size: this.defaultPageSize, hasMore: true, loadingMore: false })
      }
      // 初次进入加载第一页
      if (this.sessionPaginationMap[sessionId].page === 0) {
        this.fetchSessionMessages(sessionId, 1)
      }
      if (this.currentWsSessionId !== sessionId) {
        this.currentWsSessionId = sessionId
        this.reconnectForSession()
      }
      this.$nextTick(this.scrollToBottom)
    },
    async loadMoreMessages () {
      const sessionId = this.selectedSessionId
      if (!sessionId) return
      const state = this.sessionPaginationMap[sessionId]
      if (!state || !state.hasMore || state.loadingMore) return
      this.$set(state, 'loadingMore', true)
      const nextPage = state.page + 1
      await this.fetchSessionMessages(sessionId, nextPage, true)
      this.$set(state, 'loadingMore', false)
    },
    async fetchSessionMessages (sessionId, page, append = false) {
      const state = this.sessionPaginationMap[sessionId]
      const size = state ? state.size : this.defaultPageSize
      try {
        const params = { sessionId, page: String(page), size: String(size) }
        const res = await getSessionMessage(params)
        const data = (res && res.data) ? res.data : res
        const records = Array.isArray(data?.records) ? data.records : []
        const totalPages = data?.pages != null ? data.pages : (data?.total ? Math.ceil(data.total / size) : 0)
        const hasMore = page < totalPages
        const currentUid = this.getCurrentUserId()

        const mapped = records.map(item => {
          const timeStr = item.timestamp || item.createtime || item.createTime || item.updatetime || item.updateTime
          let ts = Date.now()
          if (timeStr) {
            if (typeof timeStr === 'number') {
              ts = timeStr
            } else {
              const dt = new Date((timeStr + '').replace(/-/g, '/'))
              if (!isNaN(dt.getTime())) ts = dt.getTime()
            }
          }
          const senderId = item.senderId != null ? String(item.senderId) : ''
          const isSelf = senderId && currentUid && senderId === currentUid
          return {
            id: item.id || `${sessionId}-${ts}-${Math.random().toString(16).slice(2)}`,
            sessionId,
            content: item.content || item.message || item.body || '',
            timestamp: ts,
            sender: isSelf ? '我' : (item.sender || senderId || '用户'),
            senderId,
            isSelf,
            raw: item
          }
        })

        if (!this.chatMessagesMap[sessionId]) {
          this.$set(this.chatMessagesMap, sessionId, [])
        }
        if (append) {
          this.chatMessagesMap[sessionId] = [...mapped, ...this.chatMessagesMap[sessionId]]
        } else {
          this.chatMessagesMap[sessionId] = mapped
        }
        this.sessionPaginationMap[sessionId].page = page
        this.sessionPaginationMap[sessionId].hasMore = hasMore
        if (!append) {
          this.$nextTick(this.scrollToBottom)
        }
      } catch (e) {
        this.$message.error('加载消息失败')
      }
    },
    getSessionId (session) {
      if (!session) return null
      return session.sessionId || session.id || session.conversationId || session.chatId || session.uuid || session.ID || null
    },
    getSessionName (session) {
      if (!session) return '未知用户'
      return session.customerName || session.nickname || session.userName || session.username || session.name || session.phone || this.getSessionId(session) || '访客'
    },
    sessionPreview (session) {
      const sessionId = this.getSessionId(session)
      const list = this.chatMessagesMap[sessionId]
      if (list && list.length) {
        return list[list.length - 1].content
      }
      return session.lastMessage || session.lastContent || session.preview || '暂无消息'
    },
    formatTime (v) {
      if (!v) return ''
      const d = typeof v === 'number' ? new Date(v) : new Date((v + '').replace(/-/g, '/'))
      if (isNaN(d.getTime())) return v
      const m = (d.getMonth() + 1).toString().padStart(2, '0')
      const day = d.getDate().toString().padStart(2, '0')
      const h = d.getHours().toString().padStart(2, '0')
      const mm = d.getMinutes().toString().padStart(2, '0')
      return `${d.getFullYear()}-${m}-${day} ${h}:${mm}`
    },
    buildWsUrl (sessionId) {
      const token = storage.get(ACCESS_TOKEN) || localStorage.getItem('ACCESS_TOKEN') || ''
      const params = []
      if (token) params.push('token=' + encodeURIComponent(token))
      if (sessionId) params.push('sessionId=' + encodeURIComponent(sessionId))
      return WS_URL + (params.length ? '?' + params.join('&') : '')
    },
    reconnectForSession () {
      this.cleanupWebSocket()
      this.connectWebSocket()
    },
    connectWebSocket () {
      const sessionId = this.selectedSessionId
      if (typeof WebSocket === 'undefined') {
        this.$message.error('浏览器不支持 WebSocket')
        return
      }
      if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) return
      this.wsStatus = 'connecting'
      const url = this.buildWsUrl(sessionId)
      this.lastConnectUrl = url
      try {
        this.ws = new WebSocket(url)
        this.ws.onopen = this.handleSocketOpen
        this.ws.onmessage = this.handleSocketMessage
        this.ws.onerror = this.handleSocketError
        this.ws.onclose = this.handleSocketClose
      } catch (e) {
        this.wsStatus = 'error'
        this.scheduleReconnect()
      }
    },
    handleSocketOpen () {
      this.wsStatus = 'connected'
      this.reconnectAttempts = 0
    },
    handleSocketMessage (event) {
      let payload = event.data
      if (!payload) return
      try {
        payload = typeof payload === 'string' ? JSON.parse(payload) : payload
      } catch (e) {
        payload = { content: event.data }
      }
      const sessionId = payload.sessionId || payload.conversationId || payload.chatId || payload.session_id
      if (!sessionId) return
      if (!this.chatMessagesMap[sessionId]) {
        this.$set(this.chatMessagesMap, sessionId, [])
      }
      const currentUid = this.getCurrentUserId()
      const senderId = payload.senderId != null ? String(payload.senderId) : ''
      const isSelf = senderId && currentUid && senderId === currentUid
      const msg = {
        id: payload.id || `${sessionId}-${Date.now()}`,
        sessionId,
        content: payload.content || payload.message || payload.body || '',
        timestamp: payload.timestamp || payload.createdAt || payload.createTime || Date.now(),
        sender: isSelf ? '我' : (payload.sender || payload.from || senderId || '用户'),
        senderId,
        isSelf,
        raw: payload
      }
      this.chatMessagesMap[sessionId].push(msg)
      if (this.selectedSessionId === sessionId) {
        this.$nextTick(this.scrollToBottom)
      }
    },
    handleSocketError () {
      this.wsStatus = 'error'
    },
    handleSocketClose () {
      this.wsStatus = 'disconnected'
      if (this.shouldReconnect) this.scheduleReconnect()
    },
    scheduleReconnect () {
      if (this.reconnectAttempts >= this.maxReconnectAttempts) return
      if (this.reconnectTimer) clearTimeout(this.reconnectTimer)
      const delay = Math.min(5000, 1000 * Math.pow(2, this.reconnectAttempts))
      this.reconnectAttempts++
      this.reconnectTimer = setTimeout(() => {
        this.connectWebSocket()
      }, delay)
    },
    cleanupWebSocket (force) {
      if (force) this.shouldReconnect = false
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer)
        this.reconnectTimer = null
      }
      if (this.ws) {
        this.ws.onopen = null
        this.ws.onmessage = null
        this.ws.onerror = null
        this.ws.onclose = null
        try { this.ws.close() } catch (e) {}
        this.ws = null
      }
    },
    handleInputEnter (e) {
      if (e.shiftKey) return
      e.preventDefault()
      this.sendMessage()
    },
    sendMessage () {
      const sessionId = this.selectedSessionId
      if (!sessionId) {
        this.$message.warning('请先选择会话')
        return
      }
      const content = this.messageInput.trim()
      if (!content) return
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        this.$message.error('连接未建立')
        return
      }
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
      const senderId = userInfo.id || userInfo.userId || ''
      const payload = { sessionId, content, messageType: '1', receiverId: this.selectedSession.userId || null, senderId }
      this.sending = true
      try {
        this.ws.send(JSON.stringify(payload))
        const localMsg = {
          id: `local-${Date.now()}`,
          sessionId,
            content,
            timestamp: Date.now(),
            sender: '我',
            senderId: String(senderId),
            isSelf: true,
            raw: payload
        }
        if (!this.chatMessagesMap[sessionId]) {
          this.$set(this.chatMessagesMap, sessionId, [])
        }
        this.chatMessagesMap[sessionId].push(localMsg)
        this.messageInput = ''
        this.$nextTick(this.scrollToBottom)
      } catch (e) {
        this.$message.error('发送失败')
      } finally {
        this.sending = false
      }
    },
    scrollToBottom () {
      const el = this.$refs.messagesContainer
      if (!el) return
      el.scrollTop = el.scrollHeight
    },
    getCurrentUserId () {
      try {
        const u = JSON.parse(localStorage.getItem('userInfo') || '{}')
        return u && (u.id || u.userId) ? String(u.id || u.userId) : ''
      } catch (e) {
        return ''
      }
    }
  }
}
</script>

<style scoped lang="less">
@import url(./index.less);
</style>

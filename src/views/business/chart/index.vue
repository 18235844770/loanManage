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
                    <div class="cs-chat__session-name">
                      {{ getSessionName(session) }}
                      <span v-if="isSessionUnread(getSessionId(session))" class="cs-chat__session-unread-dot"></span>
                    </div>
                    <div class="cs-chat__session-time">
                      {{ formatTime(session.updatedAt || session.updateTime || session.lastMessageTime || session.createTime) }}
                    </div>
                  </div>
                  <div class="cs-chat__session-preview">
                    {{ session.sessionId }}
                  </div>
                  <div class="cs-chat__session-preview">
                    {{ sessionPreview(session) }}
                  </div>
                  <div class="cs-chat__session-extra">
                    <span class="cs-chat__session-phone">
                      手机：{{ (session.user && session.user.phone) || session.phone || '无' }}
                    </span>
                    <span class="cs-chat__session-nickname">
                      昵称：{{ (session.user && session.user.nickname) || session.nickname || '未设置' }}
                    </span>
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
                      <template v-if="message.contentObj && message.contentObj.kind === 'image'">
                        <img
                          :src="message.contentObj.url"
                          :alt="message.contentObj.name || '图片'"
                          class="cs-chat__img"
                          style="max-width:160px;cursor:pointer"
                          @click="previewImage(message.contentObj.url)"
                        />
                      </template>
                      <template v-else>
                        {{ message.contentObj && message.contentObj.text }}
                      </template>
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
                  <a-upload
                    :showUploadList="false"
                    accept="image/*"
                    :beforeUpload="handleBeforeUploadImage"
                  >
                    <a-button style="margin-right: 8px">
                      <a-icon type="picture" /> 发送图片
                    </a-button>
                  </a-upload>
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
import { pendingMessageList, getSessionMessage, takeSession, uploadImage } from '@/api/business'
import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { notification } from 'ant-design-vue' // 新增：通知组件

const WS_URL = 'ws://115.159.103.201/loans/ws/chat'

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
      unreadSessions: {},
      lastConnectUrl: '',
      // 分页状态缓存：每个 sessionId 保存 page/size/hasMore
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
    async fetchPendingSessions (id) {
      if (this.loadingSessions) return
      this.loadingSessions = true
      try {
        const res = await pendingMessageList(id || '')
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
    createTakeSession (sessionId) {
      takeSession(sessionId)
    },
    handleSessionSelect (session) {
      const sessionId = this.getSessionId(session)
      if (!sessionId) return
      // 只更新当前选中会话与本地数据，不触发或重建 WebSocket（全局单实例）
      this.createTakeSession(sessionId)
      this.selectedSession = session
      if (!this.chatMessagesMap[sessionId]) {
        this.$set(this.chatMessagesMap, sessionId, [])
      }
      if (!this.sessionPaginationMap[sessionId]) {
        this.$set(this.sessionPaginationMap, sessionId, { page: 0, size: this.defaultPageSize, hasMore: true, loadingMore: false })
      }
      if (this.sessionPaginationMap[sessionId].page === 0) {
        this.fetchSessionMessages(sessionId, 1)
      }
      this.clearSessionUnread(sessionId)
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
          const rawContent = item.content || item.message || item.body || ''
          const contentObj = this.normalizeContent(rawContent)
          return {
            id: item.id || `${sessionId}-${ts}-${Math.random().toString(16).slice(2)}`,
            sessionId,
            content: JSON.stringify(contentObj),
            contentObj,
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
      const u = session.user || {}
      return u.nickname || session.nickname || u.phone || session.phone || session.customerName || session.userName || session.username || session.name || this.getSessionId(session) || '客户'
    },
    sessionPreview (session) {
      const sessionId = this.getSessionId(session)
      const list = this.chatMessagesMap[sessionId]
      if (list && list.length) {
        const last = list[list.length - 1]
        if (last.contentObj?.kind === 'image') return '[图片]'
        return (last.contentObj && last.contentObj.text) || ''
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
    buildWsUrl () {
      // 单一全局连接：不再携带 sessionId，避免因切换会话而需要重建连接
      const token = storage.get(ACCESS_TOKEN) || localStorage.getItem('ACCESS_TOKEN') || ''
      const params = ['userType=2']
      if (token) params.push('token=' + encodeURIComponent(token))
      return WS_URL + (params.length ? '?' + params.join('&') : '')
    },
    connectWebSocket () {
      // 仅在首次或断开后重连时调用；handleSessionSelect 不再触发新建
      const token = storage.get(ACCESS_TOKEN) || localStorage.getItem('ACCESS_TOKEN') || ''
      if (!token) {
        console.warn('[WS] 跳过连接：token 缺失')
        return
      }
      if (typeof WebSocket === 'undefined') {
        this.$message.error('浏览器不支持 WebSocket')
        return
      }
      if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
        return
      }
      this.wsStatus = 'connecting'
      const url = this.buildWsUrl()
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
        payload = { message: { content: event.data } }
      }

      // --- 兼容新的事件结构：{ session, type, timestamp } ---
      const hasNewEnvelope = payload && typeof payload === 'object' && ('session' in payload) && ('type' in payload) && ('timestamp' in payload)
      if (hasNewEnvelope) {
        const evtType = String(payload.type || '').toLowerCase()
        const sess = payload.session || {}
        const sid = this.getSessionId(sess)
        if (sid) {
          // 1) 如果是 new_session：拉取该会话并插入到 pendingSessions 开头
          if (evtType === 'new_session') {
            // 直接按 sessionId 拉一次
            pendingMessageList(sid).then((res) => {
              const list = Array.isArray(res) ? res : (res && res.data ? res.data : [])
              // 选出对应项（接口可能返回单个或列表）
              const incoming = list.find(s => this.getSessionId(s) === sid) || list[0]
              if (incoming) {
                // 去重后插入到开头
                const existIdx = this.pendingSessions.findIndex(s => this.getSessionId(s) === sid)
                if (existIdx !== -1) this.pendingSessions.splice(existIdx, 1)
                this.pendingSessions.unshift(incoming)
                // 标记未读
                this.markSessionUnread(sid)
              }
            }).catch(() => {
              // 忽略单次失败
            })
          } else {
            // 2) 普通消息：检查是否在 pendingSessions 中；存在则标记，不存在则按要求调用 fetchPendingSessions(sid)
            const existIdx = this.pendingSessions.findIndex(s => this.getSessionId(s) === sid)
            if (existIdx !== -1) {
              this.markSessionUnread(sid)
              // 可按需更新预览时间等：
              try {
                const item = this.pendingSessions[existIdx]
                item.updatedAt = payload.timestamp || item.updatedAt
              } catch (_) {}
            } else {
              // 仅调用：传入新消息的 sessionId（该方法内部会刷新列表）
              this.fetchPendingSessions(sid)
            }
          }
        }
      }
      // --- 原有消息处理逻辑（保留向消息区追加的能力） ---
      const message = payload && payload.message ? payload.message : payload
      if (!message || typeof message !== 'object') return
      const msgType = (message.type || '').toString().toUpperCase()
      if (msgType === 'PONG' || msgType === 'PING') return
      const sessionId = message.sessionId || message.conversationId || message.chatId || message.session_id
      if (!sessionId) return
      if (!this.chatMessagesMap[sessionId]) {
        this.$set(this.chatMessagesMap, sessionId, [])
      }
      const currentUid = this.getCurrentUserId()
      const senderId = message.senderId != null ? String(message.senderId) : ''
      const isSelf = senderId && currentUid && senderId === currentUid
      const rawContent = message.content || message.message || message.body || ''
      const contentObj = this.normalizeContent(rawContent)
      const msg = {
        id: message.id || `${sessionId}-${Date.now()}`,
        sessionId,
        content: JSON.stringify(contentObj),
        contentObj,
        timestamp: message.timestamp || message.createdAt || message.createTime || Date.now(),
        sender: isSelf ? '我' : (message.sender || message.from || senderId || '用户'),
        senderId,
        isSelf,
        raw: message
      }
      this.chatMessagesMap[sessionId].push(msg)
      if (this.selectedSessionId === sessionId) {
        this.clearSessionUnread(sessionId)
        this.$nextTick(this.scrollToBottom)
      } else {
        this.markSessionUnread(sessionId)
      }
      if (!isSelf) {
        this.notifyIncomingMessage(msg) // 使用 notification
      }
    },
    normalizeContent (raw) {
      if (raw == null) return { kind: 'text', text: '' }
      if (typeof raw === 'object') {
        // 已是对象
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
        } catch (e) {
          return { kind: 'text', text: raw }
        }
      }
      return { kind: 'text', text: String(raw) }
    },
    markSessionUnread (sessionId) {
      if (!sessionId || sessionId === this.selectedSessionId) return
      if (this.unreadSessions[sessionId]) return
      this.$set(this.unreadSessions, sessionId, true)
    },
    clearSessionUnread (sessionId) {
      if (!sessionId) return
      if (this.unreadSessions[sessionId]) {
        this.$delete(this.unreadSessions, sessionId)
      }
    },
    isSessionUnread (sessionId) {
      if (!sessionId) return false
      return !!this.unreadSessions[sessionId]
    },
    handleSocketError () {
      this.wsStatus = 'error'
    },
    handleSocketClose () {
      this.wsStatus = 'disconnected'
      if (this.shouldReconnect) this.scheduleReconnect()
    },
    scheduleReconnect () {
      // 重连始终只针对这一条全局连接
      if (!this.shouldReconnect) return
      if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) return
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
      const plain = this.messageInput.trim()
      if (!plain) return
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        this.$message.error('连接未建立')
        return
      }
      const contentObj = { kind: 'text', text: plain }
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
      const senderId = userInfo.id || userInfo.userId || ''
      const payload = { sessionId, content: JSON.stringify(contentObj), messageType: 1, receiverId: Number(this.selectedSession.userId) || null, senderId }
      this.sending = true
      try {
        this.ws.send(JSON.stringify(payload))
        this.appendLocalMessage(sessionId, contentObj, senderId)
        this.messageInput = ''
      } catch (e) {
        this.$message.error('发送失败')
      } finally {
        this.sending = false
        this.$nextTick(this.scrollToBottom)
      }
    },
    getImgUrl (path) {
      if (!path) return ''
      // 已经是一个 http(s) URL，可直接返回（假设公共访问，或后端携带鉴权信息在查询参数）
      if (/^https?:\/\//i.test(path)) return path
      const proxyServer = 'http://115.159.103.201/loans'
      const url = proxyServer + '/api/file/view/' + path
      return url
    },
    appendLocalMessage (sessionId, contentObj, senderId) {
      const localMsg = {
        id: `local-${Date.now()}`,
        sessionId,
        content: JSON.stringify(contentObj),
        contentObj,
        timestamp: Date.now(),
        sender: '我',
        senderId: Number(senderId),
        isSelf: true,
        raw: contentObj
      }
      if (!this.chatMessagesMap[sessionId]) {
        this.$set(this.chatMessagesMap, sessionId, [])
      }
      this.chatMessagesMap[sessionId].push(localMsg)
    },
    handleBeforeUploadImage (file) {
      // 可在此添加大小限制等逻辑
      this.uploadImageFile(file)
      return false // 阻止默认上传
    },
    async uploadImageFile (file) {
      const sessionId = this.selectedSessionId
      if (!sessionId) {
        this.$message.warning('请先选择会话')
        return
      }
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        this.$message.error('连接未建立')
        return
      }
      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('bizType', 'chat')
        // 调用后端上传接口 /api/file/image，返回结构假设为 { data: { url: 'https://...' } }
        const res = await uploadImage(formData)
        const url = res?.data
        if (!url) {
          this.$message.error('上传失败，未返回图片地址')
          return
        }
        const contentObj = { kind: 'image', url: this.getImgUrl(url), name: file.name, size: file.size }
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
        const senderId = userInfo.id || userInfo.userId || ''
        const payload = {
          sessionId,
          content: JSON.stringify(contentObj),
          messageType: 1,
          receiverId: Number(this.selectedSession?.userId) || null,
          senderId
        }
        this.ws.send(JSON.stringify(payload))
        this.appendLocalMessage(sessionId, contentObj, senderId)
        this.$nextTick(this.scrollToBottom)
      } catch (e) {
        this.$message.error('图片发送失败')
      }
    },
    previewImage (url) {
      if (!url) return
      window.open(url, '_blank')
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
    },
    notifyIncomingMessage (msg) {
      const preview = (msg.contentObj && msg.contentObj.text) ? msg.contentObj.text.slice(0, 50) : '收到新消息'
      notification.open({
        message: `新消息 - 会话 ${msg.sessionId}`,
        description: preview,
        duration: 3
      })
    }
    }
}
</script>

<style scoped lang="less">
@import url(./index.less);

.cs-chat__img {
  border: 1px solid #eee;
  border-radius: 4px;
  display: block;
  max-width: 100%;
}
.cs-chat__session-extra {
  font-size: 12px;
  color: #666;
  display: flex;
  justify-content: space-between;
  margin-top: 4px;
}
.cs-chat__session-extra span {
  max-width: 48%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

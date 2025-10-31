import storage from 'store'
import expirePlugin from 'store/plugins/expire'
import { login } from '@/api/login'
import globalSocket from '@/core/globalSocket'
import { ACCESS_TOKEN } from '@/store/mutation-types'

storage.addPlugin(expirePlugin)
const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    }
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          const result = response
          localStorage.setItem('ACCESS_TOKEN', result.data)
          storage.set(ACCESS_TOKEN, result.data, new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
          commit('SET_TOKEN', result.data)
          globalSocket.connect(true)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default user

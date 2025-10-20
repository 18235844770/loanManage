import request from '@/utils/request'

const userApi = {
  Login: '/api/user/login',
  getMenu: '/api/menus'
}

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */
export function login (parameter) {
  return request({
    url: userApi.Login,
    method: 'post',
    data: parameter
  })
}
export function getMenuDatas (parameter) {
  return request({
    url: userApi.getMenu,
    method: 'post',
    data: parameter
  })
}

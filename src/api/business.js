import request from '@/utils/request'

const userApi = {
  user: '/api/user',
  chat: '/api/chat',
  loans: '/api/loans',
  role: '/api/roles',
  order: '/api/orders',
  driving: '/api/maps/driving',
  uploadApi: '/api/uploads/image'
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
export function getUserList (parameter) {
  return request({
    url: userApi.user + '/getAllUser',
    method: 'post',
    data: parameter
  })
}
/**
 * 入参为 {
 * phone: string
 * countyCode: string
 * }
 * */
export function sendCode (parameter) {
  return request({
    url: userApi.user + '/send-code',
    method: 'post',
    data: parameter
  })
}
export function getUserInfo (parameter) {
  return request({
    url: userApi.user + '/getUserInfo',
    method: 'post',
    data: parameter
  })
}
/**
 * 入参为 {
 * phone: string
 * password: string
 * countyCode: string
 * }
 * */
export function addUser (parameter) {
  return request({
    url: userApi.user + '/register',
    method: 'post',
    data: parameter
  })
}
/**
 * 入参为 {
 * phone: string
 * password: string
 * countyCode: string
 * }
 * */
export function pendingMessageList (parameter) {
  return request({
    url: userApi.chat + '/sessions/pending',
    method: 'post',
    data: parameter
  })
}
/**
 * 入参为 {
 * sessionId: string
 * page: string
 * size: string
 * }
 * */
export function getSessionMessage (parameter) {
  return request({
    url: userApi.chat + '/session/messages',
    method: 'post',
    data: parameter
  })
}
/**
 * 入参为 {
 *
        "roles": string[],
        "userId": string
 * }
 * */
export function setUserRole (parameter) {
  return request({
    url: userApi.user + '/setUserRole',
    method: 'post',
    data: parameter
  })
}
/**
 * 入参为 {
 *
        "loanLimit": 12001.3,
        "loansRemark": "zhehisyiduyabnbei ",
        "userId": "7",
        "loansSate": "THROUGH"
 * }
 * */
export function getReviewList (parameter) {
  return request({
    url: userApi.loans + '/getAllUser',
    method: 'post',
    data: parameter
  })
}
/**
 * 入参为 {
 *
        "roles": string[],
        "userId": string
 * }
 * */
export function setLoanLimit (parameter) {
  return request({
    url: userApi.loans + '/setLoanLimit',
    method: 'post',
    data: parameter
  })
}
/**
 * 贷款审核接口
 * 参数示例:
 * {
 *   loanLimit: 12001.3,
 *   loansRemark: '备注',
 *   userId: '7',
 *   loansSate: 'THROUGH' // REVIEW | THROUGH | REJECTED
 * }
 */
export function reviewLoan (parameter) {
  return request({
    url: userApi.loans + '/review',
    method: 'post',
    data: parameter
  })
}
export function deleteUser (parameter) {
  return request({
    url: userApi.user + '/deleteUser',
    method: 'post',
    data: parameter
  })
}
export function updateUser (id, parameter) {
  return request({
    url: userApi.user + '/' + id,
    method: 'put',
    data: parameter
  })
}
export function getRoleList (parameter) {
  return request({
    url: userApi.role,
    method: 'get',
    data: parameter
  })
}
export function getOrderList (parameter) {
  return request({
    url: userApi.order,
    method: 'get',
    params: parameter
  })
}

export function createOrder (parameter) {
  return request({
    url: userApi.order,
    method: 'post',
    data: parameter
  })
}

export function updateOrder (id, parameter) {
  return request({
    url: `${userApi.order}/${id}`,
    method: 'put',
    data: parameter
  })
}

export function deleteOrder (id) {
  return request({
    url: `${userApi.order}/${id}`,
    method: 'delete'
  })
}
export function getDrivingInfo (parameter) {
  return request({
    url: `${userApi.driving}`,
    method: 'post',
    data: parameter
  })
}

export function uploadOrderImage (formData, config = {}) {
  const requestConfig = Object.assign({
    url: userApi.uploadApi,
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }, config)
  return request(requestConfig)
}

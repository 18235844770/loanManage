import request from '@/utils/request'

const pricingApi = {
  rules: '/api/pricing/rules',
  calc: '/api/pricing/calc',
  rates: '/api/pricing/rates',
  rateCalc: '/api/pricing/rates/calc',
  rateConfigs: '/api/pricing/rate-configs',
  rateCalcTiered: '/api/pricing/rates/calc-tiered'
}

export function getPricingRules () {
  return request({
    url: pricingApi.rules,
    method: 'get'
  })
}

export function createPricingRule (payload) {
  return request({
    url: pricingApi.rules,
    method: 'post',
    data: payload
  })
}

export function calculatePricingByRule (payload) {
  return request({
    url: pricingApi.calc,
    method: 'post',
    data: payload
  })
}

export function getPricingRates () {
  return request({
    url: pricingApi.rates,
    method: 'get'
  })
}

export function updatePricingRates (payload) {
  return request({
    url: pricingApi.rates,
    method: 'put',
    data: payload
  })
}

export function calculatePricingByRates (payload) {
  return request({
    url: pricingApi.rateCalc,
    method: 'post',
    data: payload
  })
}

export function calculatePricingByTieredRates (payload) {
  return request({
    url: '/api/pricing/rates/calc-tiered',
    method: 'post',
    data: {
      distance: payload.distance,
      weight: payload.weight,
      volume: payload.volume
    }
  })
}

// Rate Configs APIs
export function getRateConfigs () {
  return request({
    url: pricingApi.rateConfigs,
    method: 'get'
  })
}

// 按最新文档: 创建 / 更新仅传 distance, weightRate
export function createRateConfig (data) {
  return request({
    url: '/api/pricing/rate-configs',
    method: 'post',
    data: {
      distance: data.distance,
      weightRate: data.weightRate,
      isPacked: data.isPacked // 新增
    }
  })
}

export function updateRateConfig (data) {
  return request({
    url: '/api/pricing/rate-configs',
    method: 'put',
    data: {
      id: data.id,
      distance: data.distance,
      weightRate: data.weightRate,
      isPacked: data.isPacked // 新增
    }
  })
}

export function deleteRateConfig (id) {
  return request({
    url: `${pricingApi.rateConfigs}/${id}`,
    method: 'delete'
  })
}

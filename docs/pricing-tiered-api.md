# 计价相关前端接口与功能说明 (清理版)

适用对象: 前端开发（运营/报价页面、下单计算）。覆盖旧逻辑 + 新“重量/体积分级”逻辑。统一前缀: /api/pricing

通用:
- 认证: Authorization: Bearer <JWT>
- Content-Type: application/json
- 错误格式:
  {
    "error": "BadRequest",
    "message": "distance must be > 0"
  }

## 1. 公式计价
POST /api/pricing/calc
请求:
{
  "ruleId": "uuid",
  "variables": { "distance": 300, "weight": 20 }
}
响应:
{ "rule": "Standard", "result": 310 }

## 2. 单位计价配置 (旧逻辑叠加)
GET /api/pricing/rates
PUT /api/pricing/rates

## 3. 旧逻辑运价计算
POST /api/pricing/rates/calc
total = distance*distanceRate + volume*volumeRate + weight*weightRate

## 4. 区间费率配置 (供旧逻辑多段 & 新分级重量单价来源)
GET  /api/pricing/rate-configs
POST /api/pricing/rate-configs
PUT  /api/pricing/rate-configs/:id
DELETE /api/pricing/rate-configs/:id

请求创建示例(现在 volumeRate 可省略):
{
  "distance": 1500,
  "weightRate": 600
}
后端会自动设置 volumeRate = distance/10 (仅展示用)

## 5. 新: 重量/体积分级计价
POST /api/pricing/rates/calc-tiered
逻辑:
- 选区间: 找 distance <= 输入值的最大起点；无则取最小起点。
- weightUnit = 区间记录 weightRate
- volumeUnit = 输入 distance / 10
- W = weight * weightUnit
- V = volume * volumeUnit
- total = max(W, V)

请求:
{
  "distance": 1450,
  "weight": 12.3,
  "volume": 18.6
}
响应:
{
  "tierApplied": { "distance": 1000, "weightUnit": 500, "volumeUnit": 145.0 },
  "weightAmount": 6150,
  "volumeAmount": 2697,
  "total": 6150,
  "mode": "tiered"
}

## 6. 校验
- distance > 0
- weight >= 0
- volume >= 0
- 无任何区间 → 400

## 7. 前端模式建议
- 下拉: 公式 | 单位叠加 | 分级(取高)
- 分级模式显示 W、V、total 并高亮来源

## 8. 常见状态码
200 成功
400 参数非法/无配置
401 未认证
403 无权限
404 规则/配置不存在

## 9. Fetch 示例
fetch('/api/pricing/rates/calc-tiered',{
  method:'POST',
  headers:{
    'Authorization':'Bearer TOKEN',
    'Content-Type':'application/json'
  },
  body: JSON.stringify({ distance:1600, weight:2, volume:12 })
}).then(r=>r.json()).then(console.log);

## 10. 变更记录
2025-10-16 分级体积单价改为 distance/10；rate-configs volumeRate 可省略自动计算。

最后更新: 2025-10-16
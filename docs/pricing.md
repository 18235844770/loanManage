## 计价模块

### 1. 公式计价

#### POST /api/pricing/calc
- 功能：根据定价公式计算运价
- 认证与权限：`admin`、`pricing_operator`、`sales_operator`
- 请求体示例：
  ```json
  {
    "ruleId": "2cc8d520-0ecb-47f4-9f2e-5a62ddb29f0d",
    "variables": {
      "base": 100,
      "weight": 20,
      "rate": 5,
      "distance": 300,
      "fuel": 0.3
    }
  }
  ```
- 成功响应：
  ```json
  {
    "rule": "Standard",
    "result": 310
  }
  ```
- 可能错误：`404`（`ruleId` 不存在）、`400`（变量缺失或格式错误）

### 2. 按单位价格计价

#### GET /api/pricing/rates
- 功能：查看当前的单位计价配置
- 认证与权限：`admin`、`pricing_operator`、`sales_operator`
- 示例响应：
  ```json
  {
    "id": "7d5d2e7c-0fb8-4b63-a2f4-16f0e37bb1d7",
    "distanceRate": 2.5,
    "volumeRate": 180,
    "weightRate": 5,
    "createdAt": "2025-09-28T10:00:00.000Z",
    "updatedAt": "2025-09-29T11:25:32.000Z"
  }
  ```

#### PUT /api/pricing/rates
- 功能：设置或更新每公里 / 每立方米 / 每千克的价格
- 认证与权限：`admin`、`pricing_operator`
- 请求体示例：
  ```json
  {
    "distanceRate": 2.8,
    "volumeRate": 185,
    "weightRate": 5.2
  }
  ```
- 成功响应：返回更新后的配置。若字段缺失或非正数，将返回 `400`。

### 2. 按单位价格区间计价（按距离分级）

#### GET /api/pricing/rate-configs
- 功能：获取所有单位计价配置列表（每条配置有一个适用起始公里数 distance）
- 认证与权限：`admin`、`pricing_operator`、`sales_operator`
- 响应示例：
  ```json
  [
    {
      "id": "b1e2c3d4-5678-4abc-9def-1234567890ab",
      "distance": 1000,
      "isPacked": false,
      "distanceRate": 2.5,
      "volumeRate": 180,
      "weightRate": 5,
      "createdAt": "2025-09-28T10:00:00.000Z",
      "updatedAt": "2025-09-29T11:25:32.000Z"
    },
    {
      "id": "c2f3e4d5-6789-4bcd-8efa-2345678901bc",
      "distance": 2000,
      "isPacked": true,
      "distanceRate": 3.0,
      "volumeRate": 200,
      "weightRate": 6,
      "createdAt": "2025-09-28T10:00:00.000Z",
      "updatedAt": "2025-09-29T11:25:32.000Z"
    }
  ]
  ```

#### POST /api/pricing/rate-configs
- 功能：新增单位计价配置
- 认证与权限：`admin`、`pricing_operator`
- 请求体示例：
  ```json
  {
    "distance": 1000,
    "isPacked": false,
    "distanceRate": 2.5,
    "volumeRate": 180,
    "weightRate": 5
  }
  ```
- 成功响应：返回新增的配置对象

#### PUT /api/pricing/rate-configs
- 功能：更新单位计价配置
- 认证与权限：`admin`、`pricing_operator`
- 请求体示例：
  ```json
  {
    "id": "b1e2c3d4-5678-4abc-9def-1234567890ab",
    "distance": 1000,
    "isPacked": false,
    "distanceRate": 2.8,
    "volumeRate": 185,
    "weightRate": 5.2
  }
  ```
- 成功响应：返回更新后的配置对象

#### DELETE /api/pricing/rate-configs/:id
- 功能：删除指定的单位计价配置
- 认证与权限：`admin`、`pricing_operator`
- 成功响应：`{"success": true}`

#### POST /api/pricing/rates/calc
- 功能：根据距离、体积、重量、包装状态，自动匹配距离不大于输入距离的最大配置进行计价
- 认证与权限：`admin`、`pricing_operator`、`sales_operator`
- 请求体示例：
  ```json
  {
    "distance": 1499,
    "volume": 1.5,
    "weight": 260,
    "isPacked": true
  }
  ```
- 成功响应：
  ```json
  {
    "appliedRates": {
      "distance": 1000,
      "isPacked": true,
      "distanceRate": 3.0,
      "volumeRate": 200,
      "weightRate": 6
    },
    "breakdown": {
      "distance": 4497,
      "volume": 300,
      "weight": 1560
    },
    "total": 6357
  }
  ```
- 可能错误：`400`（参数缺失/小于0/无匹配配置/尚未配置费率）

### 3. 新增: 重量/体积分级计价 (方案二)

#### POST /api/pricing/rates/calc-tiered
- 功能: 使用区间(距离)找到最近配置, 分别计算重量金额( weight * 重量单价 ) 与体积金额( volume * 体积单价 ), 返回二者较大者作为总价。
- 单位: weight 吨, volume 立方米
- 认证与权限: `admin`、`pricing_operator`、`sales_operator`
- 请求体示例:
```json
{
  "distance": 1450,
  "weight": 12.3,
  "volume": 18.6
}
```
- 成功响应示例:
```json
{
  "tierApplied": { "distance": 1000, "weightUnit": 500, "volumeUnit": 150 },
  "weightAmount": 6150,
  "volumeAmount": 2790,
  "total": 6150
}
```
- 逻辑说明:
  1. 选取 distance 小于等于输入距离的最大区间; 若不存在, 取大于距离的最小区间。
  2. weightUnit=区间记录的 weightRate, volumeUnit=区间记录的 volumeRate。
  3. 计算 W=weight*weightUnit, V=volume*volumeUnit, total=max(W,V)。
  4. 若无任何配置返回 400。
- 可能错误: `400` (参数非法/无配置) `401` `403`。

---

### 实现逻辑说明

#### 1. 公式计价 (POST /api/pricing/calc)
- 入口: `pricingController.calcPrice` -> `pricingService.calculatePrice` -> `evaluateFormula`。
- 校验: ruleId 为 UUID v4, variables 为对象；未通过直接 400。
- 执行: 从 `price_rules` 表获取公式字符串, 用受控 Function 动态计算，仅开放 Math 安全函数 (abs/ceil/floor/max/min/pow/round)。
- 精度: 直接返回 Number(未做额外四舍五入，由公式自行决定)。
- 失败场景: 规则不存在(404)、表达式异常/NaN(包装为 400)。

#### 2. 基础单位计价 (GET/PUT /api/pricing/rates + POST /api/pricing/rates/calc)
- 数据: `pricing_rates` 最新一条记录 (按 createdAt DESC)。
- 计算入口: `pricingService.calculateRatePrice`。
- 查找策略: 先找 distance<=输入distance 的最大一条 & isPacked 精确匹配；否则找大于输入distance 的最小一条；仍不存在则 400。
- 金额: distanceCost = distance * distanceRate; volumeCost = volume * volumeRate; weightCost = weight * weightRate；均保留两位 -> total = 三者相加。
- 场景: 适合同时叠加三种维度的老逻辑。

#### 3. 区间(距离)分级配置 CRUD (/api/pricing/rate-configs*)
- 复用 `pricing_rates` 表的多行记录作为区间起点: distance 字段为区间起点公里数；通过多条记录表达不同里程段；`is_packed` 区分包装状态。
- 新增 / 修改: `pricingService.upsertRateConfig` 按 id 是否存在决定 create/update；未做区间重叠校验(可后续加触发器或服务端检测)。

#### 4. 新增重量/体积分级计价 (POST /api/pricing/rates/calc-tiered)
- 入口: `pricingController.calcTiered` -> `pricingService.calculateTieredPrice`。
- 单位: weight=吨, volume=立方米。
- 查找策略: 与老区间逻辑类似(先 <= 最大, 再 > 最小)。仅使用找到的单条记录:
  - weightUnit = weightRate
  - volumeUnit = volumeRate
- 计算: weightAmount = weight * weightUnit; volumeAmount = volume * volumeUnit; total = max(weightAmount, volumeAmount)。
- 保留两位: 使用 toFixed(2) 再转 Number；选择最大金额时不再次四舍五入(避免重复舍入误差)。
- 返回: `{ tierApplied, weightAmount, volumeAmount, total }`。
- 不保存计算结果到数据库，纯实时计算。

#### 5. 精度与并发
- 所有金额局部采用 toFixed(2) -> Number，避免浮点长尾；若需更高精度可替换为 decimal.js。
- 区间选择查询使用单条 SELECT + ORDER; 并发下对新增记录无竞态影响(只是可能下一次请求才可见新区间)。

#### 6. 错误码总结(新增逻辑)
- 400: 无匹配区间(No tier config) / 参数校验失败。
- 404: 公式模式下 rule 不存在。

#### 7. 可扩展点 (后续可选)
- 增加区间重叠检测: 插入/更新前检查存在范围冲突。
- 独立拆分重量区间与体积区间两张表, 支持不同分段策略。
- 增加缓存层 (如 LRU) 减少频繁区间查找的数据库压力。
- 增加审计表记录每次计价请求与结果。

---

## 状态码对照
| 状态码 | 描述 |
| ------ | ---- |
| 200 | 请求成功 |
| 201 | 资源创建成功 |
| 204 | 成功但无返回内容 |
| 400 | 参数错误或校验失败 |
| 401 | 未认证 |
| 403 | 权限不足 |
| 404 | 资源不存在 |
| 413 | 请求体过大 |
| 500 | 服务器内部错误 |

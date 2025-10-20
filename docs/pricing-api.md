# 计价模块 API 文档

## 基本信息
- 基础路径：`/api/pricing`
- 返回格式：`application/json`
- 身份认证：所有接口均要求 Header `Authorization: Bearer <JWT>`
- 角色访问说明：
  - `admin` 拥有全部权限
  - `pricing_operator` 可读取、维护计价规则与费率
  - `sales_operator` 仅可查询及计算

---

## 1. 计价规则管理

### GET /api/pricing/rules
- 功能：按创建时间倒序返回全部计价规则
- 权限：`admin`、`pricing_operator`、`sales_operator`
- 响应示例：
```json
[
  {
    "id": "2cc8d520-0ecb-47f4-9f2e-5a62ddb29f0d",
    "name": "Standard",
    "formula": "base + weight * rate + distance * fuel",
    "createdAt": "2025-09-20T06:11:08.000Z",
    "updatedAt": "2025-09-20T06:11:08.000Z"
  }
]
```
- 常见错误：`401`（未认证）、`403`（无权限）

### POST /api/pricing/rules
- 功能：创建新的计价规则
- 权限：`admin`、`pricing_operator`
- 请求体（JSON）：
```json
{
  "name": "Standard",
  "formula": "base + weight * rate + distance * fuel"
}
```
- 校验规则：`name`、`formula` 为非空字符串
- 成功响应：`201 Created`，返回完整规则对象
- 常见错误：
  - `400`：校验失败（字段缺失或类型不符）
  - `401` / `403`

### POST /api/pricing/calc
- 功能：根据指定规则和变量执行公式计算
- 权限：`admin`、`pricing_operator`、`sales_operator`
- 请求体：
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
- 校验规则：`ruleId` 为 UUID v4，`variables` 为对象
- 成功响应：
```json
{
  "rule": "Standard",
  "result": 310
}
```
- 常见错误：
  - `400`：校验失败或表达式执行返回 NaN
  - `404`：找不到对应规则

---

## 2. 计费费率配置

### GET /api/pricing/rates
- 功能：查询最新一条费率配置
- 权限：`admin`、`pricing_operator`、`sales_operator`
- 响应示例：
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
- 常见错误：`401`、`403`、`404`（尚未配置费率）

### PUT /api/pricing/rates
- 功能：创建或更新费率（存在则更新最新一条，否则新建）
- 权限：`admin`、`pricing_operator`
- 请求体：
```json
{
  "distanceRate": 2.8,
  "volumeRate": 185,
  "weightRate": 5.2
}
```
- 校验规则：三个字段均为大于 0 的数值
- 成功响应：返回更新后的费率对象
- 常见错误：`400`（校验失败）、`401`、`403`

### POST /api/pricing/rates/calc
- 功能：基于当前费率和给定指标计算报价，并返回成本拆分
- 权限：`admin`、`pricing_operator`、`sales_operator`
- 请求体：
```json
{
  "distance": 320,
  "volume": 1.5,
  "weight": 260
}
```
- 校验规则：三个字段均为大于等于 0 的数值
- 成功响应：
```json
{
  "appliedRates": {
    "distanceRate": 2.5,
    "volumeRate": 180,
    "weightRate": 5
  },
  "breakdown": {
    "distance": 800,
    "volume": 270,
    "weight": 1300
  },
  "total": 2370
}
```
- 常见错误：
  - `400`：校验失败或尚未设置费率
  - `401` / `403`

---

## 3. 错误码约定
| 状态码 | 说明 |
| ------ | ---- |
| 200 | 操作成功 |
| 201 | 创建成功 |
| 400 | 请求参数校验失败或业务错误 |
| 401 | 未通过身份认证 |
| 403 | 权限不足 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

---

## 4. 附加说明
- 计价公式通过 `Math` 安全函数子集执行（abs、ceil、floor、max、min、pow、round）。
- 如果公式返回 `NaN`，系统会抛出 `400`（请求体需确保变量覆盖公式内所有符号）。
- `/api/pricing/rates` 系列接口始终基于最新一条费率记录进行读写。

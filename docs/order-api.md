# 订单 API

## 概述
- 基础路径：`/api/orders`
- 响应类型：`application/json`
- 认证方式：HTTP Header `Authorization: Bearer <JWT>`
- 权限要求：仅 `admin` 与 `sales_operator` 角色可访问

## 数据模型
| 字段              | 类型            | 说明                                                        |
| ----------------- | --------------- | ----------------------------------------------------------- |
| `id`              | String (UUIDv4) | 订单唯一标识                                                |
| `goodsInfo`       | Object (JSON)   | 货物信息对象，数据库列名 `goods_info`                       |
| `channel`         | Number          | 来源渠道：`1`=运满满，`2`=抖音/其他                          |
| `send_date`       | String          | 寄件时间，格式 `YYYY-MM-DD hh:mm:ss`，数据库列名 `send_date` |
| `expedited`       | Boolean         | 是否加急                                                    |
| `placeOfShipment` | String          | 发货地址 `place_of_shipment`                              |
| `unloadingPlace`  | String          | 卸货地址 `unloading_place`                                |
| `pickupPhone`     | String          | 取货联系电话，可为空                                        |
| `shippingPhone`   | String          | 送货联系电话，可为空                                        |
| `orderPhone`      | String          | 下单电话，数据库列名 `order_phone`                          |
| `price`           | Number          | 订单总价，保留 2 位小数的正值                               |
| `status`          | String          | 订单状态：`draft`、`confirmed`、`completed`、`cancelled`      |
| `describe`        | String          | 备注信息，可为空                                            |
| `describeImage`   | String          | 备注图片链接，可为空                                        |
| `createdAt`       | String          | ISO 8601 时间戳                                             |
| `updatedAt`       | String          | ISO 8601 时间戳                                             |
| `orderNo`         | String          | 订单编号，格式为 YDYS+数据下标，唯一，数据库列名 `order_no` |
| `pickupCost`      | Number          | 取货成本，保留 2 位小数，数据库列名 `pickup_cost`           |
| `deliveryCost`    | Number          | 送货成本，保留 2 位小数，数据库列名 `delivery_cost`         |
| `logisticsCost`   | Number          | 物流成本，保留 2 位小数，数据库列名 `logistics_cost`        |
| `extraCost`       | Number          | 额外成本，保留 2 位小数，数据库列名 `extra_cost`            |
| `totalCost`       | Number          | 总成本，等于上述四项成本之和，数据库列名 `total_cost`        |

### goodsInfo 对象结构
| 字段        | 类型   | 必填 | 说明                                         |
| ----------- | ------ | ---- | -------------------------------------------- |
| `name`      | String | 是   | 货物名称或摘要，不能为空字符串              |
| `packaging` | String | 否   | 包装方式，可缺省或为空字符串                |
| `length`    | Number | 是   | 货物长度（米），不可为 null                 |
| `width`     | Number | 是   | 货物宽度（米），不可为 null                 |
| `weight`    | Number | 是   | 货物重量（吨），不可为 null               |
| `volume`    | Number | 是   | 货物体积（立方米），不可为 null             |
| `quantity`  | Number | 是   | 货物数量（件），不可为 null                 |


> `channel`、`send_date`、`expedited`、`goodsInfo`、`placeOfShipment`、`unloadingPlace`、`orderPhone`、`price` 均为必填字段。`pickupPhone`、`shippingPhone`、`describe`、`describeImage` 可缺省或为空。

## 接口

### GET /api/orders
- 作用：按时间倒序列出全部订单
- 权限要求：`admin`, `sales_operator`
- 示例
  ```bash
  curl -H "Authorization: Bearer <jwt-token>" \
       http://localhost:3000/api/orders
  ```

成功返回 `200 OK`

```json
[
  {
    "id": "c2ef5f8b-07cf-4ce4-8c7c-2bf8bc420b17",
    "goodsInfo": {
      "name": "Electronic kits",
      "packaging": "纸箱",
      "length": 1.2,
      "width": 0.8,
      "weight": 150.5,
      "volume": 0.96,
      "quantity": 5
    },
    "channel": 1,
    "send_date": "2025-09-20 11:11:12",
    "expedited": true,
    "placeOfShipment": "上海市黄浦区中山东一路12号",
    "unloadingPlace": "北京市东城区东华门街道",
    "pickupPhone": "13800001111",
    "shippingPhone": "13900002222",
    "orderPhone": "13700003333",
    "price": "1200.50",
    "status": "confirmed",
    "describe": "需司机协助卸货",
    "describeImage": "https://cdn.example.com/order/remark.png",
    "createdAt": "2025-09-20T03:11:12.000Z",
    "updatedAt": "2025-09-20T03:15:22.000Z"
  }
]
```

### GET /api/orders/:id

- 作用：根据 ID 获取指定订单
- 权限要求：`admin`, `sales_operator`
- 路径参数：`id` (UUIDv4)
- 成功返回 `200 OK` 并附带订单详情
- 返回 `404` 表示未找到该订单

------

### POST /api/orders

- 作用：创建新订单
- 权限要求：`admin`, `sales_operator`

- 请求体：

  | 字段              | 必填 | 说明                                                         |
  | ----------------- | ---- | ------------------------------------------------------------ |
  | `goodsInfo`       | 是   | 符合 goodsInfo 对象结构的 JSON 对象                         |
  | `channel`         | 是   | 渠道编号，`1` 或 `2`                                         |
  | `send_date`       | 是   | 字符串时间戳，格式 `YYYY-MM-DD hh:mm:ss`                     |
  | `expedited`       | 是   | 是否加急，布尔值                                             |
  | `placeOfShipment` | 是   | 发货地址，字符串                                  |
  | `unloadingPlace`  | 是   | 卸货地址 字符串                                    |
  | `pickupPhone`     | 否   | 取货联系电话，字符串                                         |
  | `shippingPhone`   | 否   | 送货联系电话，字符串                                         |
  | `orderPhone`      | 是   | 下单电话，字符串                                             |
  | `price`           | 是   | 正数，支持小数                                               |
  | `status`          | 否   | 默认 `draft`，可选值与数据模型说明一致                      |
  | `describe`        | 否   | 备注信息                                                     |
  | `describeImage`   | 否   | 备注图片链接                                                 |

- 示例

  ```bash
  curl -X POST \
       -H "Authorization: Bearer <jwt-token>" \
       -H "Content-Type: application/json" \
       -d '{
             "goodsInfo": {
               "name": "Electronic kits",
               "packaging": "纸箱",
               "length": 1.2,
               "width": 0.8,
               "weight": 150.5,
               "volume": 0.96,
               "quantity": 5
             },
             "channel": 2,
             "send_date": "2025-09-22 08:00:00",
             "expedited": false,
             "placeOfShipment": "杭州市上城区",
             "unloadingPlace": "广州市越秀区",
             "pickupPhone": "13600004444",
             "shippingPhone": "13500005555",
             "orderPhone": "13400006666",
             "price": 980.75,
             "status": "draft",
             "describe": "装货前电话联系",
             "describeImage": null
           }' \
       http://localhost:3000/api/orders
  ```

- 成功返回 `201 Created` 并包含新建订单
- 返回 `400` 表示校验失败

------

### PUT /api/orders/:id

- 作用：更新订单，支持部分字段更新
- 权限要求：`admin`, `sales_operator`
- 路径参数：`id` (UUIDv4)
- 请求体：可包含 `goodsInfo`、`channel`、`send_date`、`expedited`、`placeOfShipment`、`unloadingPlace`、`pickupPhone`、`shippingPhone`、`orderPhone`、`price`、`status`、`describe`、`describeImage`，字段含义与 POST 一致
- 成功返回 `200 OK` 并附带最新订单
- 返回 `400` 表示校验失败，`404` 表示订单不存在

------

### DELETE /api/orders/:id

- 作用：删除订单
- 权限要求：`admin`, `sales_operator`
- 路径参数：`id` (UUIDv4)
- 成功返回 `204 No Content`
- 返回 `404` 表示订单不存在

------

## 状态码

| 状态 | 说明                 |
| ---- | -------------------- |
| 200  | 请求成功             |
| 201  | 资源已创建           |
| 204  | 请求成功无返回内容   |
| 400  | 请求错误 / 校验失败  |
| 401  | 缺少或无效的认证信息 |
| 403  | 权限不足             |
| 404  | 资源未找到           |
| 500  | 服务器内部错误       |

## 订单计价
- 下单前可通过 `/api/pricing/rates/calc` 接口计算订单预估价格
- 请求体需要携带 `distance`、`volume`、`weight`，单位分别为公里、立方米、吨
- 请求示例
```json
{
  "distance": 320,
  "volume": 1.5,
  "weight": 260
}
```
- 响应示例
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


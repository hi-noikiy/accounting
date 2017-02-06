## 财务

## 部门

### 获取部门列表

```
GET /departments
```

成功返回🌰:

```
HTTP Status: 200

[
  {
    "id": 1,
    "name": "测试",
    "num": "9988",
    "pid": 0,
    "orders": 0
  }
]
```

### 增加新部门

```
POST /department
```

请求参数:

名称 | 类型 | 描述
--- | --- | ---
name | string | 部门名称
num | string | 部门编号
pid | number | 部门父级 ID
order | number | 排序权重

成功返回🌰:

```
HTTP Status: 201

{
  "id": 13
}
```

### 删除部门

```
DELETE /department/:id
```

成功返回🌰:

```
HTTP Status: 204
```

## 邀请码

关联手机号
填写邀请码
完善信息

ID | 用户ID | 邀请码 | 创建日期

### 查看每天新增数量 / 查看各个邀请者总邀请数量

```
GET /invite/count
```

请求参数: `[startTime[, endTime]]`

成功返回🌰:

```
{
  "101": 90,
  "102": 100
}
```

### 用户填写邀请码

```
POST /invite
```

请求参数:

```
{
  "userID": "",
  "depID": ""
}
```

成功返回🌰:

```
HTTP Status: 204
```

备注: 当系统被整合后, 无需 userID 参数, 从 session 获取.
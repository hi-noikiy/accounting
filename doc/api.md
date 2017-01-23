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

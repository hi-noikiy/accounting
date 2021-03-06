# Z1 后端 (Node.js 版本)

## 技术

- Node.js + Koa2 + PostgreSQL
- 不同业务以模块方式分离
- [问题] 目前没有进行数据库分离, 整个应用只能使用一个数据库

## 模块与共用

- accounting 财务
- department 部门
- invite 邀请

## 文件结构

```
- src // 业务代码
  |- api // 将业务代码处理返回为 API 信息
    |- v1 // API 版本
    |- error.js // 统一处理 API 抛出的错误信息
  |- data // 数据
    |- postgresql.js // 共用数据操作
  |- route.js // 共用路由
- app.js // 入口文件, 存放所有共用中间件
```

### 模块举例:
department 部门模块结构:

```
- scr
  |- api
    |- v1
      |- department.js
  |- data
    |- department
  |- route.js (append)
```

首先在 `scr > data > department` 下写数据代码, 然后在 `src > api > v1 > department.js`
中引入数据代码并写 koa 中间件函数, 最后在 `src > route.js` 中引入 koa 中间件函数.

也就是说, 一个模块分为三部分:

1. 数据代码
2. 相应的 koa 中间件函数(处理 HTTP 请求与返回信息)
3. 路由
const co = require('co');
const error = require('./error');

module.exports = {
  out: co.wrap(function* (ctx, next) {
    const start = new Date();
    yield next();
    const ms = new Date() - start;
    ctx.body = `${ctx.method} ${ctx.url} - ${ms}ms`;
    console.log('正常输出');
    return 'hehe';
  }),

  getTitlesList: ctx => {
    const body = [
      {
        id: '1',
        name: '资产',
        pid: '0',
        level: 1,
        account: 0,
      },
      {
        id: '1001',
        name: '库存现金',
        pid: '1',
        level: 1,
        account: 1,
      },
      {
        id: '10051',
        name: '支付宝余额',
        pid: '1',
        level: 5,
        account: 1,
      },
    ];
    ctx.body = JSON.stringify(body);
  },

  newTitle: ctx => {
    ctx.response.status = 201;
    ctx.length = 0;
  },

  editTitle: (ctx, id) => {
    console.log(`请求编辑 id 为 ${id} 的科目`);
    const valid = id > 0;
    if (!valid) {
      ctx.body = JSON.stringify(error(1004));
      return;
    }
    ctx.response.status = 204;
    ctx.length = 0;
  },

  deleteTitle: (ctx, id) => {
    console.log(`请求删除 id 为 ${id} 的科目`);
    const valid = id > 0;
    if (!valid) {
      ctx.body = JSON.stringify(error());
      return;
    }
    ctx.response.status = 204;
    ctx.length = 0;
  },
};

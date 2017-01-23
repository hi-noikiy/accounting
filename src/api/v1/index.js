const co = require('co');
const accounting = require('../../accounting');
const ExpectedError = require('../error');

module.exports = {
  out: co.wrap(function* (ctx, next) {
    const start = new Date();
    yield next();
    const ms = new Date() - start;
    ctx.body = `${ctx.method} ${ctx.url} - ${ms}ms`;
    console.log('正常输出');
    return 'hehe';
  }),

  getTitlesList: ctx => accounting.titles.list().then(res => {
    ctx.body = JSON.stringify(res.rows);
  }),

  newTitle: ctx => {
    accounting.titles.create(ctx.request.body).then(res => {
      console.log(res);
    });
    ctx.response.status = 201;
    ctx.length = 0;
  },

  editTitle: (ctx, id) => {
    console.log(`请求编辑 id 为 ${id} 的科目`);
    const valid = id > 0;
    if (!valid) {
      throw new ExpectedError(1004);
    }
    ctx.response.status = 204;
    ctx.length = 0;
  },

  deleteTitle: (ctx, id) => {
    console.log(`请求删除 id 为 ${id} 的科目`);
    const valid = id > 0;
    if (!valid) {
      throw new ExpectedError();
    }
    ctx.response.status = 204;
    ctx.length = 0;
  },
};

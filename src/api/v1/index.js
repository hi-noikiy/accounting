const co = require('co');

module.exports = {
  out: co.wrap(function* (ctx, next) {
    const start = new Date();
    yield next();
    const ms = new Date() - start;
    ctx.body = `${ctx.method} ${ctx.url} - ${ms}ms`;
    console.log('正常输出');
    return 'hehe';
  }),
};

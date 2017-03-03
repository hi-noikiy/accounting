const co = require('co');

const accounting = require('./accounting');
const department = require('./department');
const invite = require('./invite');
const wxapp = require('./wxapp');
const user = require('./user');
const store = require('./store');

module.exports = Object.assign(
  accounting,
  department,
  invite,
  wxapp,
  user,
  store,
  {
    out: co.wrap(function* (ctx, next) {
      const start = new Date();
      yield next();
      const ms = new Date() - start;
      ctx.body = `${ctx.method} ${ctx.url} - ${ms}ms`;
      console.log('正常输出');
      return 'hehe';
    }),
  }
);

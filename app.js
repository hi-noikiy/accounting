const Koa = require('koa');
const co = require('co');
const bodyParser = require('koa-bodyparser');
const compress = require('koa-compress');
const zlib = require('zlib');
const routes = require('./src/route');

const app = new Koa();

// 解析 req body
app.use(bodyParser());

// res body gzip 压缩
app.use(compress({
  threshold: 1024,
  flush: zlib.Z_SYNC_FLUSH,
}));

// 修改 res headers
app.use(co.wrap(function* (ctx, next) {
  ctx.type = 'application/json; charset=utf-8';
  yield next();
}));

// 404 处理
app.use(co.wrap(function* (ctx, next) {
  yield next();
  if (ctx.body === undefined) {
    ctx.body = '默认输出.';
  }
}));

// api
routes.forEach(route => {
  app.use(route);
});

const port = process.env.PORT || 9876;
app.listen(port);

console.log(`服务开始运行于: http://localhost:${port}`);

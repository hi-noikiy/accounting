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

app.use(co.wrap(function* resHeadersMiddleware(ctx, next) {
  ctx.type = 'application/json; charset=utf-8';
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE, PATCH');
  ctx.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept');
  yield next();
}));

app.use(co.wrap(function* optionsHandleMiddleware(ctx, next) {
  if (ctx.request.method === 'OPTIONS') {
    ctx.body = '';
  } else {
    yield next();
  }
}));

app.use(co.wrap(function* defaultOutMiddleware(ctx, next) {
  yield next();
  if (ctx.body === undefined && ctx.length !== 0) {
    ctx.body = '默认输出.';
    ctx.response.status = 404;
  }
}));

app.use(co.wrap(function* errorHandlingMiddleware(ctx, next) {
  try {
    yield next();
  } catch (err) {
    if (err.expected) {
      ctx.body = JSON.stringify(err.json());
      const statusCode = err.statusCode();
      if (statusCode) {
        ctx.response.status = statusCode;
      }
    } else {
      console.log(err);
    }
  }
}));

// api
routes.forEach(route => {
  app.use(route);
});

const port = process.env.PORT || 9876;
app.listen(port);

console.log(`服务开始运行于: http://localhost:${port}`);

const _ = require('koa-route');
const api = require('./api/v1');

module.exports = [
  _.get('/api/out', api.out),
];

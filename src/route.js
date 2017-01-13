const _ = require('koa-route');
const api = require('./api/v1');

module.exports = [
  _.get('/api/out', api.out),

  _.get('/api/accounting/titles', api.getTitlesList),
  _.post('/api/accounting/title', api.newTitle),
  _.patch('/api/accounting/title/:id', api.editTitle),
  _.delete('/api/accounting/title/:id', api.deleteTitle),
];

const _ = require('koa-route');
const api = require('./api/v1');

module.exports = [
  _.get('/api/out', api.out),

  _.get('/api/accounting/titles', api.getTitlesList),
  _.post('/api/accounting/title', api.newTitle),
  _.patch('/api/accounting/title/:id', api.editTitle),
  _.delete('/api/accounting/title/:id', api.deleteTitle),

  _.get('/api/departments', api.getDepartmentsList),
  _.post('/api/department', api.newDepartment),
  _.delete('/api/department/:id', api.deleteDepartment),

  _.get('/api/invite/count', api.countInviteInfo),
  _.post('/api/invite', api.newInvite),

  _.post('/api/wxapp/login', api.wxappLogin),
];

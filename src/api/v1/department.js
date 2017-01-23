const department = require('../../department');
const ExpectedError = require('../error');

module.exports = {
  getDepartmentsList: ctx => department.list().then(res => {
    ctx.body = JSON.stringify(res.rows);
  }),

  newDepartment: ctx => {
    const b = ctx.request.body;
    const item = {
      name: b.name,
      num: b.num,
      pid: b.pid,
      orders: b.order || 0,
    };
    return department.create(item).then(res => {
      // ⬇️ 处理 PostgreSQL 返回的错误
      if (res.code === '23505') {
        throw new ExpectedError(1005);
      }
      if (res.rowCount !== 1) {
        throw new ExpectedError();
      }
      ctx.response.status = 201;
      ctx.body = JSON.stringify(res.rows[0]);
    });
  },

  deleteDepartment: (ctx, id) => department.delete(id).then(res => {
    if (res.rowCount !== 1) {
      throw new ExpectedError();
    }
    ctx.response.status = 204;
  }),
};

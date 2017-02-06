const invite = require('../../invite');
const ExpectedError = require('../error');

module.exports = {
  countInviteInfo: ctx => {
    const q = ctx.query;
    return invite.count(q.startTime, q.endTime).then(res => {
      if (res.rowCount < 1) {
        // TODO: 制定错误号
        throw new ExpectedError();
      }
      ctx.body = res.rows;
    });
  },

  newInvite: ctx => {
    const b = ctx.request.body;
    return invite.create(b.userID, b.depID).then(res => {
      if (res.rowCount !== 1) {
        // TODO: 制定错误号
        throw new ExpectedError();
      }
      ctx.response.status = 204;
    });
  }
};

const invite = require('../../data/invite');
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
    const s = ctx.session;
    if (!Object.prototype.hasOwnProperty.call(b, 'inviter') ||
        !Object.prototype.hasOwnProperty.call(s, 'unionId')) {
      throw new ExpectedError(1004);
    }
    const inviter = b.inviter;
    const invitee = s.unionId;
    return invite.create(invitee, inviter).then(res => {
      console.log(res);
      if (res.rowCount !== 1) {
        if (res.code === '23505') {
          throw new ExpectedError(1005);
        }
        throw new ExpectedError();
      }
      ctx.status = 204;
      ctx.body = '';
    });
  },

  checkInvite: ctx => {
    const s = ctx.session;
    if (!Object.prototype.hasOwnProperty.call(s, 'unionId')) {
      throw new ExpectedError();
    }
    const invitee = s.unionId;
    return invite.view(invitee).then(info => {
      if (!info) {
        throw new ExpectedError(2003);
      }
      ctx.body = info;
    });
  },
};

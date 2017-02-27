const user = require('../../data/user');
const ExpectedError = require('../error');

module.exports = {
  /**
   * 获得用户信息
   */
  getUserInfo(ctx) {
    const unionId = ctx.session.unionId;
    const userInfo = user.userInfo(unionId).then(res => {
      console.log(res);
      if (!res) {
        throw new ExpectedError(2001);
      }
      // TODO: 将 userId 写入 session 而不是传给前端
      // TODO: 将 unionId 写入 session 而不是传给前端
      ctx.body = res;
    });
    return userInfo;
  },

  // TODO: 暂时放在这里, 将来要移出
  /**
   * 发送注册验证码
   */
  sendVerifyCode(ctx) {
    const phoneNum = ctx.request.body.phoneNum;
    return user.sendVerifyCode(phoneNum).then(res => {
      if (!res) {
        throw new ExpectedError();
      }
      ctx.status = 204;
      ctx.body = '';
    });
  },

  /**
   * 绑定手机号码
   * @param ctx.request.body.phoneNum
   * @param ctx.request.body.verifyCode
   */
  bindPhoneNum(ctx) {
    const b = ctx.request.body;
    const phoneNum = b.phoneNum;
    const verifyCode = b.verifyCode;

    return user.checkVerifyCode(phoneNum, verifyCode).then(valid => {
      if (!valid) {
        throw new ExpectedError(2002);
      }
      return user.checkPhoneNum(phoneNum);
    }).then(existing => {
      const unionId = ctx.session.unionId;
      if (unionId) {
        throw new ExpectedError();
      }
      if (existing) {
        return user.bindUnionId(phoneNum, unionId);
      }
      return user.userSignup();
    }).then(binded => {
      if (!binded) {
        throw new ExpectedError();
      }
      ctx.status = 204;
      ctx.body = '';
    });
  }
};

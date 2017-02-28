const errorInfo = {
  1004: { text: '请求参数无效', statusCode: 400 },
  1005: { text: '请求参数重复', statusCode: 409 },
  2001: { text: '用户未注册' },
  2002: { text: '验证码无效', statusCode: 400 },
  2004: { text: '用户通用标识符获取失败', statusCode: 403 },
  9999: { text: '未知错误' },
};

class ExpectedError extends Error {
  id() {
    let id = this.message || 9999;
    if (errorInfo[id] === undefined) {
      id = 9999;
    }
    return id;
  }

  json() {
    const id = this.id();
    return {
      code: id,
      info: errorInfo[id].text,
    };
  }

  statusCode() {
    const id = this.id();
    return errorInfo[id].statusCode;
  }
}
ExpectedError.prototype.name = 'Expected Error';
ExpectedError.prototype.expected = true;

module.exports = ExpectedError;

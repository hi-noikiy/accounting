const errorInfo = {
  1004: '请求参数无效',
  9999: '未知错误',
};

class ExpectedError extends Error {
  json() {
    let id = this.message || 9999;
    if (errorInfo[id] === undefined) {
      id = 9999;
    }
    return {
      code: id,
      info: errorInfo[id],
    };
  }
}
ExpectedError.prototype.name = 'Expected Error';
ExpectedError.prototype.expected = true;

module.exports = ExpectedError;

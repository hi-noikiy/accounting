const errorInfo = {
  1004: { text: '请求参数无效', statusCode: 400 },
  1005: { text: '请求参数重复' },
  9999: { text: '未知错误' },
};

class ExpectedError extends Error {
  json() {
    let id = this.message || 9999;
    if (errorInfo[id] === undefined) {
      id = 9999;
    }
    return {
      code: id,
      info: errorInfo[id].text,
    };
  }

  statusCode() {
    const hasStatusCode = Object.prototype.hasOwnProperty.call(errorInfo[this.message], 'statusCode');
    if (hasStatusCode) {
      return errorInfo[this.message].statusCode;
    }
    return undefined;
  }
}
ExpectedError.prototype.name = 'Expected Error';
ExpectedError.prototype.expected = true;

module.exports = ExpectedError;

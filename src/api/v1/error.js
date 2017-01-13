/* eslint no-param-reassign: "off" */

const errorInfo = {
  1004: '请求参数无效',
  9999: '未知错误',
};

module.exports = (id = 9999) => {
  if (errorInfo[id] === undefined) {
    id = 9999;
  }
  return {
    code: id,
    info: errorInfo[id],
  };
};

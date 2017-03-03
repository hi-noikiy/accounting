const sql = require('../postgresql');
const http = require('http');
const querystring = require('querystring');

module.exports = {
  /**
   * 查询用户信息
   * @param {string} unionId
   */
  userInfo(unionId) {
    const query = {
      text: `SELECT u.user_id AS "userId", u.user_identifier AS "userIdent",
             u.wx_unionid AS "unionId", u.mobilephone, u.coin, u.grade, u.status
             FROM lm_user u WHERE u.wx_unionid = $1;`,
      values: [unionId]
    };
    return sql(query).then(res => {
      if (res.rowCount !== 1) {
        return false;
      }
      return res.rows[0];
    });
  },

  /**
   * 发送验证码
   * @param {string} phoneNum
   */
  sendVerifyCode(phoneNum) {
    const postData = querystring.stringify({
      number: phoneNum
    });
    const options = {
      hostname: process.env.GY_SERVER,
      port: 80,
      path: '/apis/message/send',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    return new Promise(resolve => {
      const req = http.request(options, res => {
        const statusCode = res.statusCode;
        if (statusCode !== 200) {
          resolve(false);
        }
        resolve(true);
      });
      req.on('error', e => {
        console.log(`problem with request: ${e.message}`);
      });
      req.write(postData);
      req.end();
    });
  },

  /**
   * 检查验证码是否正确
   * @param {string} phoneNum
   * @param {string} verifyCode
   */
  checkVerifyCode(phoneNum, verifyCode) {
    const postData = querystring.stringify({
      phoneNum,
      verfiyCode: verifyCode
    });
    const options = {
      hostname: process.env.GY_SERVER,
      port: 80,
      path: '/apis/message/verfiy/wxapp',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    return new Promise(resolve => {
      const req = http.request(options, res => {
        let rawData = '';
        res.on('data', chunk => {
          rawData += chunk;
        });
        res.on('end', () => {
          const parsedData = JSON.parse(rawData);
          if (parsedData.code !== '10000') {
            resolve(false);
          }
          resolve(true);
        });
      });
      req.on('error', e => {
        console.log(`problem with request: ${e.message}`);
      });
      req.write(postData);
      req.end();
    });
  },

  /**
   * 查看手机号是否存在
   * @param {string} phoneNum
   */
  checkPhoneNum(phoneNum) {
    const query = {
      text: `SELECT user_id FROM lm_user
             WHERE mobilephone = $1;`,
      values: [phoneNum]
    };
    return sql(query).then(res => {
      if (res.rowCount === 1) {
        return true;
      }
      return false;
    });
  },

  /**
   * 绑定 unionId
   * @param {string} phoneNum
   * @param {string} unionId
   */
  bindUnionId(phoneNum, unionId) {
    console.log(phoneNum, unionId);
    const query = {
      text: `UPDATE lm_user SET wx_unionid = $1
             WHERE mobilephone = $2;`,
      values: [unionId, phoneNum]
    };
    return sql(query).then(res => {
      if (res.rowCount !== 1) {
        return false;
      }
      return true;
    });
  },

  /**
   * 注册新用户
   * @param {string} phoneNum
   * @param {string} unionId
   * @param {string} ua
   * @param {string} ip
   */
  userSignup(phoneNum, unionId, ip = '', ua = 'wxapp') {
    // 参考 lanmiao POST user/phone 代码, 主要在 IP, UA 等信息上不同

    const postData = querystring.stringify({
      phone: phoneNum,
      wxUnionId: unionId,
      userUa: ua,
      userIp: ip,
    });
    const options = {
      hostname: process.env.GY_SERVER,
      port: 80,
      path: '/apis/wxapp/user/phone',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    return new Promise(resolve => {
      const req = http.request(options, res => {
        let rawData = '';
        res.on('data', chunk => {
          rawData += chunk;
        });
        res.on('end', () => {
          const parsedData = JSON.parse(rawData);
          if (parsedData.code !== '10000') {
            console.log('出错了, ', parsedData);
            resolve(false);
          }
          resolve(true);
        });
      });
      req.on('error', e => {
        console.log(`problem with request: ${e.message}`);
      });
      req.write(postData);
      req.end();
    });
  },
};

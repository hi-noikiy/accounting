const https = require('https');
const ExpectedError = require('../error');
const WXBizDataCrypt = require('../../lib/WXBizDataCrypt');

module.exports = {
  wxappLogin: ctx => {
    function changeSession() {
      if (ctx.session.conut) {
        ctx.session.conut += 1;
      } else {
        ctx.session.conut = 1;
      }
      ctx.body = {
        outSessionId: true
      };
    }

    if (ctx.session.unionId) {
      changeSession();
      return true;
    }

    const b = ctx.request.body;
    const code = b.code;
    const encryptedData = b.encryptedData;
    const iv = b.iv;

    const appId = process.env.WXAPP_ID;

    // TODO: 判断参数是否有效
    const getWXSession = new Promise((resolve, reject) => {
      const secret = process.env.WXAPP_KEY;
      const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${secret}&js_code=${code}&grant_type=authorization_code`;
      https.get(url, res => {
        let rawData = '';
        res.on('data', chunk => {
          rawData += chunk;
        });
        res.on('end', () => {
          const parsedData = JSON.parse(rawData);
          if (parsedData.errcode) {
            reject(parsedData);
          }
          resolve(parsedData);
        });
      }).on('error', e => {
        reject(e);
      });
    }).catch(e => {
      console.error(e);
      // TODO: 也有可能是服务器造成的 1004 错误, 目前没细分
      throw new ExpectedError(1004);
    });

    const getUnionId = getWXSession.then(sessionKeyPack => {
      const sessionKey = sessionKeyPack.session_key;
      const pc = new WXBizDataCrypt(appId, sessionKey);
      const unionId = pc.decryptData(encryptedData, iv).unionId;
      return {
        sessionKey,
        unionId,
      };
    });

    return getUnionId.then(unionPack => {
      if (ctx.session.unionId) {
        return;
      }
      ctx.session = unionPack;
      changeSession();
    });
  },
};

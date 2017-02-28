const sql = require('../postgresql');

module.exports = {
  /**
   * 统计所有邀请者情况
   * @param {number} startTime [可选] 开始时间戳
   * @param {number} endTime [可选] 截至时间戳
   */
  count(startTime = 1, endTime = Date.now()) {
    const query = {
      text: `SELECT inviter, CAST (COUNT(id) as integer) AS "countNum"
             FROM invite
             WHERE add_time > $1 AND add_time < $2
             GROUP BY inviter;`,
      values: [startTime, endTime]
    };
    return sql(query);
  },

  /**
   * 创建一则邀请
   * @param {string} invitee 被邀请者(用户 ID)
   * @param {string} inviter 邀请者(店铺 ID)
   */
  create(invitee, inviter) {
    if (!invitee || !invitee) {
      return () => false;
    }
    const query = {
      text: `INSERT INTO ${sql.prefix}invite (invitee, inviter)
             VALUES ($1, $2);`,
      values: [invitee, inviter]
    };
    return sql(query);
  },

  /**
   * 查看一则邀请
   * @param {string} invitee 被邀请者(用户 ID)
   * @param {string} inviter 邀请者(店铺 ID)
   */
  view(invitee, type = 1) {
    if (!invitee) {
      return false;
    }
    const query = {
      text: `SELECT *
             FROM ${sql.prefix}invite
             WHERE invitee = $1 AND type = $2;`,
      values: [invitee, type]
    };
    return sql(query).then(res => {
      if (res.rowCount !== 1) {
        return false;
      }
      return res.rows[0];
    });
  }
};

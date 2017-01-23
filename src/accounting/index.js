/* eslint no-multi-str: "off" */

const sql = require('../postgresql');

const vouchers = {
  list(begin = 10, end = 12) {
    console.log(this.data);
    const a = 9;
    return a + 1 + begin + end;
  },
};

const titles = {
  list() {
    const query = {
      text: 'SELECT id, name, pid, level, account FROM titles;',
    };
    return sql(query);
  },

  create(title) {
    if (!title) {
      return false;
    }
    const query = {
      text: 'INSERT INTO titles (id, name, pid, account, level)\
             VALUES ($1, $2, $3, $4, 5);',
      values: [title.id, title.name, title.pid, title.account],
    };
    return sql(query);
  },
};

module.exports = {
  vouchers,
  titles,
};

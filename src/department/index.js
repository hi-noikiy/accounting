const sql = require('../postgresql');

module.exports = {
  /**
   * 部门列表
   */
  list() {
    const query = {
      text: 'SELECT id, name, num, pid, orders FROM departments;',
    };
    return sql(query);
  },

  /**
   * 新增部门
   * @param {object} item - 要新增的部门信息, name, num, pid, order
   */
  create(item) {
    // TODO 选择性接收 id order 属性值
    const query = {
      text: 'INSERT INTO departments (name, num, pid, orders)\
             VALUES ($1, $2, $3, $4) RETURNING id;',
      values: [item.name, item.num, item.pid, item.orders],
    };
    return sql(query);
  },

  /**
   * 删除部门
   * @param {number} id - 要删除的部门 ID
   */
  delete(id) {
    if (!id) {
      return false;
    }
    const query = {
      text: 'DELETE FROM departments WHERE id = $1;',
      values: [id],
    };
    return sql(query);
  },
};

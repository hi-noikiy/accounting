const department = require('../../data/department');
const ExpectedError = require('../error');

module.exports = {
  getStoreInfo(ctx, id) {
    return department.view(id).then(info => {
      if (!info) {
        throw new ExpectedError();
      }
      ctx.body = info;
    });
  }
};

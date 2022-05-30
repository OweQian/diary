'use strict';

const Service = require('egg').Service;

class BillService extends Service {
  async add(params) {
    const { app } = this;
    try {
      return await app.mysql.insert('bill', params);
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}

module.exports = BillService;

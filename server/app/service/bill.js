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
  async list(id) {
    const { app } = this;
    const QUERY_STR = 'id, pay_type, amount, date, type_id, type_name, remark';
    const SQL = `select ${QUERY_STR} from bill where user_id = ${id}`;
    try {
      return await app.mysql.query(SQL);
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}

module.exports = BillService;

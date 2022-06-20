'use strict';

const Service = require('egg').Service;

class TypeService extends Service {
  async list(id) {
    const { app } = this;
    const QUERY_STR = 'id, name, type, user_id';
    const SQL = `select ${QUERY_STR} from bill where user_id = ${id}`;
    try {
      return await app.mysql.query(SQL);
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}

module.exports = TypeService;

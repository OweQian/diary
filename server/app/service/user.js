'use strict';

const Service = require('egg').Service;

class UserService extends Service {
  // 通过用户名获取用户信息
  async getUserByName(username) {
    const { app } = this;
    try {
      return await app.mysql.get('user', { username });
    } catch (e) {
      console.log(e);
      return null;
    }
  }
  // 注册
  async register(params) {
    const { app } = this;
    try {
      return await app.mysql.insert('user', params);
    } catch (e) {
      console.log(e);
      return null;
    }
  }
  // 修改用户信息
  async editUserInfo(params) {
    const { app } = this;
    try {
      return await app.mysql.update('user', {
        ...params,
      }, {
        id: params.id,
      });
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}

module.exports = UserService;

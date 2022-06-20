'use strict';

const Controller = require('egg').Controller;

class TypeController extends Controller {
  async list() {
    const { ctx, app } = this;
    try {
      const token = ctx.request.headers.authorization;
      const decode = app.jwt.verify(token, app.config.jwt.secret);
      if (!decode) return;
      const {
        id: user_id,
      } = decode;
      const list = await ctx.service.bill.list(user_id);
      ctx.body = {
        code: 200,
        msg: '请求成功',
        data: {
          list,
        },
      };
    } catch (e) {
      ctx.body = {
        code: 500,
        msg: '系统错误',
        data: null,
      };
    }
  }
}

module.exports = TypeController;

'use strict';

module.exports = secret => {
  return async function jwtErr(ctx, next) {
    const token = ctx.request.headers.authorization;
    if (token) {
      try {
        // 在ctx中拿到全局对象app
        ctx.app.jwt.verify(token, secret);
        await next();
      } catch (e) {
        console.log('error', e);
        ctx.status = 200;
        ctx.body = {
          code: 401,
          data: null,
          msg: 'token已过期，请重新登录',
        };
        return;
      }
    } else {
      ctx.status = 200;
      ctx.body = {
        code: 401,
        data: null,
        msg: 'token不存在',
      };
      return;
    }
  };
};

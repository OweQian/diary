'use strict';

const Controller = require('egg').Controller;
const defaultAvatar = 'http://s.yezgea02.com/1615973940679/WeChat77d6d2ac093e247c361f0b8a7aeb6c2a.png';

class UserController extends Controller {
  // 注册
  async register() {
    const { ctx } = this;
    const { username, password } = ctx.request.body;
    // 判空
    if (!username || !password) {
      ctx.body = {
        code: 500,
        msg: '账号或密码不能为空',
        data: null,
      };
      return;
    }
    // 验证数据库是否已经有该账户名
    const userInfo = await ctx.service.user.getUserByName(username);
    if (userInfo && userInfo.id) {
      ctx.body = {
        code: 500,
        msg: '账户名已被注册，请重新输入',
        data: null,
      };
      return;
    }
    // 注册
    const result = await ctx.service.user.register({
      username,
      password,
      signature: '世界和平。',
      avatar: defaultAvatar,
      ctime: +new Date(),
    });
    if (result) {
      ctx.body = {
        code: 200,
        msg: '注册成功',
        data: null,
      };
    } else {
      ctx.body = {
        code: 500,
        msg: '注册失败',
        data: null,
      };
    }
  }
  // 登录
  async login() {
    const { ctx, app } = this;
    const { username, password } = ctx.request.body;
    // 根据用户名查找id
    const userInfo = await ctx.service.user.getUserByName(username);
    if (!userInfo || !userInfo.id) {
      ctx.body = {
        code: 500,
        msg: '账号不存在',
        data: null,
      };
      return;
    }
    // 找到用户，验证输入密码与数据库中的密码是否相同
    if (userInfo && password !== userInfo.password) {
      ctx.body = {
        code: 500,
        msg: '账号或密码错误',
        data: null,
      };
      return;
    }
    /**
     * 生成token
     * app.jwt.sign 接受两个参数
     * 第一个为对象，对象内是需要加密的内容
     * 第二个为加密字符串 app.config.jwt.secret
     * */
    const token = app.jwt.sign({
      id: userInfo.id,
      username: userInfo.username,
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60),
    }, app.config.jwt.secret);
    ctx.body = {
      code: 200,
      msg: '登录成功',
      data: {
        token,
      },
    };
  }
  // 获取用户信息
  async getUserInfo() {
    const { ctx, app } = this;
    const token = ctx.request.headers.authorization;
    const decode = await app.jwt.verify(token, app.config.jwt.secret);
    if (!decode) return;
    const {
      id,
      username,
      signature = '',
      avatar = defaultAvatar,
    } = await ctx.service.user.getUserByName(decode.username);
    ctx.body = {
      code: 200,
      msg: '请求成功',
      data: {
        id,
        username,
        signature,
        avatar,
      },
    };
  }
  // 修改用户信息
  async editUserInfo() {
    const { ctx, app } = this;
    const { signature = '', avatar = '' } = ctx.request.body;
    try {
      const token = ctx.request.headers.authorization;
      const decode = await app.jwt.verify(token, app.config.jwt.secret);
      if (!decode) return;
      const {
        username,
      } = decode;
      const userInfo = await ctx.service.user.getUserByName(username);
      const {
        id,
      } = userInfo;
      await ctx.service.user.editUserInfo({
        ...userInfo,
        signature,
        avatar,
      });
      ctx.body = {
        code: 200,
        msg: '请求成功',
        data: {
          id,
          signature,
          username,
          avatar,
        },
      };
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = UserController;

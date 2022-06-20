'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;
  const __jwt = middleware.jwtErr(app.config.jwt.secret);
  router.post('/api/user/register', controller.user.register); // 注册
  router.post('/api/user/login', controller.user.login); // 登录
  router.get('/api/user/getUserInfo', __jwt, controller.user.getUserInfo); // 获取用户信息
  router.post('/api/user/editUserInfo', __jwt, controller.user.editUserInfo); // 编辑用户信息
  router.post('/api/bill/add', __jwt, controller.bill.add); // 添加账单
  router.get('/api/bill/list', __jwt, controller.bill.list); // 获取账单列表
  router.get('/api/bill/detail', __jwt, controller.bill.detail); // 获取账单详情
  router.post('/api/bill/update', __jwt, controller.bill.update); // 账单更新
  router.post('/api/bill/delete', __jwt, controller.bill.delete); // 删除账单
  router.get('/api/bill/data', __jwt, controller.bill.data);
  router.get('/api/type/list', __jwt, controller.type.list);
};

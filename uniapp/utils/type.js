// +----------------------------------------------------------------------
// | multshop开源商城系统
// +----------------------------------------------------------------------
// | 欢迎阅读学习系统程序代码，建议反馈是我们前进的动力
// | gitee下载：https://gitee.com/multshop_gitee
// | github下载：https://github.com/multshop-github
// | 访问官网：https://www.multshop.cn
// | 访问社区：https://home.multshop.cn
// | 访问手册：http://doc.multshop.cn
// | 微信公众号：multshop技术社区
// | multshop系列产品在gitee、github等公开渠道开源版本可免费商用，未经许可不能去除前后端官方版权标识
// |  multshop系列产品收费版本务必购买商业授权，购买去版权授权后，方可去除前后端官方版权标识
// | 禁止对系统程序代码以任何目的，任何形式的再发布
// | multshop团队版权所有并拥有最终解释权
// +----------------------------------------------------------------------
// | author: multshop.cn.team
// +----------------------------------------------------------------------

//分页状态
export const loadingType = {
  LOADING: "loading",
  FINISHED: "finished",
  ERROR: "error",
  EMPTY: "empty",
};

//支付方式
export const payWay = {
  WECHAT: 1,
  BALANCE: 3,
};

export const orderType = {
  ALL: "all",
  //全部
  PAY: "pay",
  //待付款
  DELIVERY: "delivery",
  //待收货
  FINISH: "finish",
  //待收货
  CLOSE: "close", //待收货
};
// 售后状态
export const afterSaleType = {
  // 售后申请
  NORMAL: "normal",
  // 处理中
  HANDLING: "apply",
  // 已处理
  FINISH: "finish",
};

// 售后退款操作
export const refundOptType = {
  // 仅退款
  ONLY_REFUND: 0,
  // 退货退款
  REFUNDS: 1,
};

// 短信发送
export const SMSType = {
  // 注册
  REGISTER: "ZCYZ",
  // 找回密码
  FINDPWD: "ZHMM",
  // 登陆
  LOGIN: "YZMDL",
  // 更换手机号
  CHANGE_MOBILE: "BGSJHM",
  // 绑定手机号
  BIND: "BDSJHM",
  // 商家入驻申请验证
  SJSQYZ: "SJSQYZ",
};

// 分销订单状态
export const distributionOrder = {
  ALL: 0,
  WAIT_RETURN: 1,
  HANDLED: 2,
  INVALED: 3,
};

// 排序类型
export const sortType = {
  NONE: "",
  ASC: "asc",
  DESC: "desc",
};

export const groupType = {
  ALL: -1,
  PROGESS: 0,
  SUCCESS: 1,
  FAIL: 2,
};

export const bargainType = {
  ALL: -1,
  BARGINNING: 0,
  SUCCESS: 1,
  FAIL: 2,
};

// 发票类型
export const invoiceType = {
  SETTLEMENT: 0,
  ORDERDETAILEdit: 1,
  ORDERDETAILADD: 2,
};
//系统端
export const Client = {
  ANDROID: "android",
  IOS: "ios",
};

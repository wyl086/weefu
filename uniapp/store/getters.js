export default {
  userInfo: state => state.app.userInfo || {},
  token: state => state.app.token,
  isLogin: state => !!state.app.token,
  cartNum: state => state.app.cartNum,
  inviteCode: state => state.app.userInfo.distribution_code || "",
  appConfig: state => state.app.config,
  sysInfo: state => state.app.sysInfo,
  cityInfo: state => state.city.cityInfo
};

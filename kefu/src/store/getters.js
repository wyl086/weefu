export default {
    // 获取Token
    token: (state) => state.user.token || null,
    // 店铺id
    shopId:(state) => state.user.userInfo?.shop_id || 0,
    // 用户信息
    userInfo: state => state.user.userInfo,
    baseUrl:  state => state.app.config.base_domain,
    copyright: state => state.app.config.company_name,
    wsUrl: state =>  state.app.config.ws_domain
}

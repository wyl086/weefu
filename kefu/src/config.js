// 开发环境域名

const host_development = 'https://multshopb2b2c.yixiangonline.com'

export default {
    // 版本
    version: '2.5.0.20230403',
    baseURL: process.env.NODE_ENV == 'production' ? '' : host_development
    // ChatWss: 'wss://multshopb2b2cchat.yixiangonline.com'
}

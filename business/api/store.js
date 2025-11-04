import request from '@/utils/request'

// 商城首页
export const apiIndex = () => request.get('Statistics/workbench')

// 设置店铺信息
export const apiSetShopInfo = (params) => request.post('shop/shopSet', params)

// 商品交易分析
export const apiStatisticsGoodslist = () => request.get('Statistics/goodslist')

// 交易分析
export const apiStatisticsTrading = () => request.get('Statistics/trading')

// 商品交易分析
export const apiStatisticsVisit = () => request.get('Statistics/visit')
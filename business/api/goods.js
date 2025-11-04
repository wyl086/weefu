import request from '@/utils/request'

/** S 商品 **/

// 商品搜索记录
export const apiGoodsLists = (params) => request.get('goods/lists', {params})

// 清空商品搜索记录
export const apiGoodsOperation = (params) => request.post('goods/operation', params)

// 商品详情
export const apiGoodsDetail = (params) => request.get('goods/detail', {params})

// 商品编辑
export const apiGoodsEdit = (params) => request.post('goods/edit', params)


/** E 商品 **/
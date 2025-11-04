import request from '@/utils/request'

/** S 订单 **/ 

// 订单列表
export const apiOrderList = params => request.get('order/lists', { params })

// 订单详情
export const apiOrderDetail = params => request.get('order/detail', { params })

// 取消订单
export const apiOrderClose = params => request.post('order/cancel', params)

// 确认订单收货
export const apiOrderConfirm = params => request.post('order/confirm', params)

// 订单发货
export const apiOrderDelivery = params => request.post('order/delivery', params)

// 订单详情
export const apiOrderExpress = params => request.get('order/getExpress', { params })

// 订单查看物流
export const apiOrderLogistics = params => request.get('order/logistics', {params})

// 获取地址
export const apiOrderGetAddress = params => request.get('order/getAddress', {params})

// 删除订单
export const apiOrderDelete = params => request.post('order/del', params)

// 修改订单地址
export const apiOrderEditAddress = params => request.post('order/editAddress', params)

/** E 订单 **/ 


// 核销订单列表
export const apiVerificationOrderList = params => request.get('verification/lists', {params})

// 核销订单详情
export const apiVerificationOrderDetail = params => request.get('verification/detail', {params})

// 确认核销
export const apiVerificationOrderConfirm = params => request.post('verification/confirm', params)


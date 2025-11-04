import request from '@/utils/request'
import {client} from '@/utils/tools'




//获取店铺列表
export function getShopList(params) {
	return request.get('shop/getShopList', {params})
}

//获取附近店铺列表
export function getNearbyShops(params) {
	return request.get('shop/getNearbyShops', {params})
}


//获取主营类目列表
export function getShopCategory() {
	return request.get('shop_category/getList')
}


//获取店铺信息
export function getShopInfo(params) {
	return request.get('shop/getShopInfo', {params})
}


//获取店铺商品分类

export function getShopGoodsCategory(params) {
	return request.get('shop_goods_category/getShopGoodsCategory', {params})
}

//店铺关注/取消关注
export function changeShopFollow(data) {
	return request.post('shop_follow/changeStatus', data)
}


// 商家入驻
export function shopApply(data) {
	return request.post('ShopApply/apply', data)
}


// 申请记录
export function shopApplyRecord(params) {
	return request.get('ShopApply/record', {params})
}

// 申请记录详情
export function shopApplyDetail(id) {
	return request.get('ShopApply/detail', {params:{id}})
}


// 入住协议
export function getTreaty() {
	return request.get('ShopApply/getTreaty')
}

//客服
export function getShopService(id) {
    return request.get("setting/getShopCustomerService", {params:{shop_id: id}})
}

// 商家发票设置
export function getInvoiceSetting(params) {
    return request.get("order_invoice/setting", { params })
}

// 发票提交
export function apiInvoiceAdd(params) {
    return request.post("order_invoice/add", params)
}

// 发票编辑
export function apiInvoiceEdit(params) {
    return request.post("order_invoice/edit", params)
}

// 发票详情
export function apiInvoiceDetail(params) {
    return request.get("order_invoice/detail", { params })
}

// 订单发票详情
export function apiOrderInvoiceDetail(params) {
    return request.get("order/invoice", { params })
}
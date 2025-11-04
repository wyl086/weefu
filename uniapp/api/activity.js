import request from '@/utils/request'
import {client} from '@/utils/tools'


//领券中心
export function getCouponList(params) {
	return request.get("coupon/getCouponList", {params});
}

//用户领取优惠券
export function getCoupon(id) {
    return request.post('coupon/getCoupon', {coupon_id:id})
}


// 下单优惠券
export function getOrderCoupon(data) {
  return request.post("coupon/getBuyCouponList", data);
} 


//我的优惠券
export function getMyCoupon(params) {
    return request.get('coupon/myCouponList', {
        params
    })
}

// 获取活动专区商品列表
export function getActivityGoodsLists(data) {
    return request.get("activity_area/activityGoodsList", {params: data})
}


// 获取秒杀时间段
export function getSeckillTime() {
	return request.get("seckill_goods/getSeckillTime");
}

// 获取秒杀商品
export function getSeckillGoods(params) {
	return request.get("seckill_goods/getSeckillGoods", {params})
}

// 拼团列表
export function getGroupList(params) {
  return request.get('team/activity', {params});
} 

//拼团记录
export function getUserGroup(params) {
  return request.get('team/record', {params});
} 

//拼团详情
export function getTeamInfo(params) {
  return request.get('team/teamInfo', {params});
}

//开团｜结算
export function teamKaiTuan(data) {
  return request.post('team/kaituan', data);
}

//参与拼团验证
export function teamCheck(data) {
  return request.post('team/check', data);
}

 //拼团下单
export function teamBuy(data) {
  return request.post("team/buy",data);
}

// 获取砍价列表
export function getBargainList(data) {
    return request.get('bargain/lists', {params: data})
}

// 获取砍价详情
export function getBargainDetail(data) {
    return request.get('bargain/detail', {params: data})
}

// 获取砍价成功人数
export function getBargainNumber() {
    return request.get("bargain/barginNumber")
}

// 发起砍价
export function launchBargain(data) {
    return request.post('bargain/sponsor', data)
}

// 获取砍价活动商品列表
export function getBargainActivityList(data) {
    return request.get('bargain/orderList', {params: data})
}

// 砍价详情
export function getBargainActivityDetail(data) {
    return request.get("bargain/bargainDetail", {params: data})
}

// 砍价海报
export function getBargainPost(data) {
    return request.get("share/shareBargain", {params: data})
}

// 好友助力
export function helpBargain(data) {
    return request.post('bargain/knife', data)
}

// 关闭结算订单
export function closeBargainOrder(data) {
    return request.get("bargain/closeBargain", {params: data})
}


// 获取签到列表
export function getSignLists() {
    return request.get("sign/lists")
}

// 获取签到列表
export function getSignRule() {
    return request.get("sign/rule")
}

// 	签到
export function userSignIn() {
    return request.get("sign/sign")
}

// 积分商城
export function getIntegralGoods(params) {
    return request.get("integral_goods/lists", { params })
}

// 积分商品详情
export function getIntegralGoodsDetail(params) {
    return request.get("integral_goods/detail", { params })
}

// 积分兑换订单结算
export function integralSettlement(params) {
    return request.get("integral_order/settlement", { params })
}

// 积分兑换提交订单
export function integralSubmitOrder(params) {
    return request.post("integral_order/submitOrder", params)
}

// 积分兑换订单列表
export function getIntegralOrder(params) {
    return request.get("integral_order/lists", {params})
}

//删除积分兑换订单
export function delIntegralOrder(id) {
    return request.post('integral_order/del', {id})
}

//积分兑换订单订单详情
export function getIntegralOrderDetail(id) {
    return request.get('integral_order/detail', {params: {id}})
}

//取消积分兑换订单
export function cancelIntegralOrder(id) {
    return request.post('integral_order/cancel', {id})
}

//确认收货积分兑换订单
export function confirmIntegralOrder(id) {
    return request.post("integral_order/confirm", {id})
}
// 查看物流
export function getIntegralOrderTraces(id) {
    return request.get("integral_order/orderTraces", {params: {id}})
}

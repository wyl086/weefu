import request from "@/utils/request";

import { client } from "@/utils/tools";

//订单结算页
export function orderInfo(data) {
  return request.post("order/settlement", data);
}
// 下单
export function orderBuy(data) {
  return request.post("order/submitOrder", data);
}
//删除订单
export function delOrder(id) {
  return request.post("order/del", { id });
}
//订单列表
export function getOrderList(data) {
  return request.get("order/lists", { params: data });
}
//订单详情
export function getOrderDetail(id) {
  return request.get("order/getOrderDetail", { params: { id } });
}

//取消订单
export function cancelOrder(id) {
  return request.post("order/cancel", { id });
}

//物流
export function orderTraces(id) {
  return request.get("order/orderTraces", { params: { id } });
}

//确认收货
export function confirmOrder(id) {
  return request.post("order/confirm", { id });
}

// 支付结果
export function getPayResult(params) {
  return request.get("order/pay_result", { params });
}
//确认收货组件
export function getwxReceiveDetail(params) {
  return request.get("order/wxReceiveDetail", { params });
}
//查询确认收货
export function getwechatSyncCheck(params) {
  return request.get("order/wechatSyncCheck", { params });
}

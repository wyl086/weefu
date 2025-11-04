import request from '../utils/request'
import { client } from '@/utils/tools'
//个人中心
export function getUser() {
    return request.get('user/center')
}

// 地址列表
export function getAddressLists() {
    return request.get('user_address/lists')
}
// 商品的增添取消收藏
export function collectGoods(data) {
    return request.post('goods_collect/changeStatus', data)
}

// 添加编辑地址
export function editAddress(data) {
    return request.post('user_address/update', data)
}

export function addAddress(data) {
    return request.post('user_address/add', data)
}

// 删除地址
export function delAddress(id) {
    return request.post('user_address/del', { id })
}

// 获取单个地址
export function getOneAddress(id) {
    return request.get('user_address/detail', { params: { id } })
}

// 获取默认地址
export function getDefaultAddress(id) {
    return request.get('user_address/getDefault', { params: { id } })
}

// 设置默认地址
export function setDefaultAddress(id) {
    return request.post('user_address/setDefault', { id })
}

//传省市区字符串判读是否有code
export function hasRegionCode(data) {
    return request.post('user_address/handleRegion', data)
}

// 获取评价信息
export function getCommentInfo(params) {
    return request.get('goods_comment/getCommentPage', { params })
}

// 未评价列表
export function getUnComment(params) {
    return request.get('goods_comment/getUnCommentOrder', { params })
}

// 校验商品
export function apiCheckGoods(params) {
    return request.get('goods_comment/checkGoods', { params })
}

// 已评价列表
export function getComment(params) {
    return request.get('goods_comment/getCommentOrder', { params })
}

//商品评价
export function goodsComment(data) {
    return request.post('goods_comment/addGoodsComment', data)
}

// 获取抽奖配置
export function getPrize(data) {
    return request.get('Luckdraw/prize', data)
}

// 抽奖记录
export function getUserRecord(data) {
    return request.get('Luckdraw/record', data)
}

// 获取个人详情
export function getUserInfo() {
    return request.get('user/info')
}

// 获取资质信息
export function getCopyright(data) {
    return request.get('index/copyright', { data })
}

// 设置个人信息
export function setUserInfo(data) {
    return request.post('user/setInfo', data)
}

// 获取手机号
export function getWxMnpMobile(data) {
    return request.post('user/getMobile', data)
}

//更新微信信息

export function setWechatInfo(data) {
    return request.post('user/setWechatInfo', data)
}

// 更换手机号
export function changeUserMobile(data) {
    return request.post('user/changeMobile', { ...data, client })
}
//会员中心
export function getLevelList() {
    return request.get('user/getUserLevelInfo')
}

// 用户钱包
export function getWallet() {
    return request.get('user/myWallet')
}
// 账户流水

export function getAccountLog(params) {
    return request.get('user/accountLog', { params })
}

// 充值模板
export function rechargeTemplate() {
    return request.get('recharge/rechargeTemplate')
}

//充值
export function recharge(data) {
    return request.post('recharge/recharge', data)
}

//充值记录
export function getRechargeRecord(params) {
    return request.post('recharge/rechargeRecord', { params })
}

// 填写邀请码(绑定上级)
export function bindSuperior(data) {
    return request.post('distribution/code', data)
}

// 分销会员申请
export function applyDistribute(data) {
    return request.post('distribution/apply', data)
}

// 分销入口验证
export function veryfiyDistribute() {
    return request.post('distribution/check')
}

// 最新分销会员申请详情
export function applyDetail() {
    return request.post('distribution/applydetail')
}

// 邀请人信息
export function getSuperiorInfo() {
    return request.get('distribution/myLeader')
}
// 分销主页
export function getDistribution() {
    return request.get('distribution/index')
}

// 分销订单列表
export function getDistributionOrder(params) {
    return request.get('distribution/order', { params })
}
// 我的粉丝
export function getUserFans(data) {
    return request.get('user/fans', { params: data })
}

// 佣金明细
export function getCommission(params) {
    return request.get('distribution/commission', { params })
}

// 月度账单
export function getMonthBill(params) {
    return request.get('distribution/monthbill', { params })
}

// 月度账单明细
export function getMonthOrderDetail(params) {
    return request.get('distribution/monthDetail', { params })
}

// 获取商品的收藏列表
export function getCollectGoods(params) {
    return request.get('goods_collect/lists', { params })
}

// 获取店铺的收藏列表
export function getCollectShop(params) {
    return request.get('shop_follow/lists', { params })
}

// 获取售后列表
export function getAfterSaleList(params) {
    return request.get('after_sale/lists', { params })
}

// 申请售后
export function applyAfterSale(data) {
    return request.post('after_sale/add', data)
}

// 获取商品信息
export function getGoodsInfo(params) {
    return request.get('after_sale/goodsInfo', { params })
}

// 填写快递信息
export function inputExpressInfo(data) {
    return request.post('after_sale/express', data)
}

// 撤销申请
export function cancelApply(data) {
    return request.post('after_sale/cancel', data)
}

// 售后详情
export function afterSaleDetail(params) {
    return request.get('after_sale/detail', { params })
}

// 重新申请
export function applyAgain(data) {
    return request.post('after_sale/again', data)
}

// 佣金提现
export function applyWithdraw(data) {
    return request.post('withdraw/apply', data)
}

// 提现记录列表
export function getWithdrawRecords(params) {
    return request.get('withdraw/records', { params })
}

// 提现详情
export function getWithdrawDetail(params) {
    return request.get('withdraw/info', { params })
}

// 提现页信息
export function getWithdrawConfig() {
    return request.get('withdraw/config')
}

// 邀请海报
export function getUserPoster(data) {
    return request.get('share/userPoster', { params: data })
}

// 退出登录
export function userLogout(data) {
    return request.post('account/logout', data)
}

// 海报背景
export function apiDistributionPoster(data) {
    return request.get('distribution/getPoster', { params: data })
}

// 聊天记录
export function chatRecord(data) {
    return request.get('user/chatRecord', { params: data })
}
//注销账号
export const apiuserDelete = (params) => request.post('userDelete/delete', params)

//检测注销
export const apiuserDeletecheck = (params) => request.post('userDelete/check', params)
//绑定小程序
export const apibindMp = (params) => request.post('account/mnpAuthLogin', params)
//绑定公众号
export const apibindOa = (params) => request.post('account/oaAuthLogin', params)

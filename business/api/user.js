import request from '@/utils/request'

// 个人中心
export const apiUserCentre = () => request.get('shop/getShopInfo')


// S 个人设置
// 获取用户信息
export const apiGetUserInfo = () => request.get('user/info')

// 退出u登录
export const apiLogout = () => request.post('account/logout')

// 设置用户登录登录密码
export const apiSetPassword = params => request.post('shop/changePwd', params)
//  E 个人设置

// 账户明细
export const userBill = (params) => request.get('account_log/lists', {
	params
})
// E 转账


// S  地址
// 获取地址列表
export const apiAddressLists = () => request.get('user_address/lists')

// 获取地址详情
export const apiAddressDetail = params => request.get('user_address/detail', {
	params
})

// 添加收货地址
export const apiAddressAdd = params => request.post('user_address/add', params)

// 编辑收货地址
export const apiAddressEdit = params => request.post('user_address/edit', params)

// 设置默认收货地址
export const apiAddressEditDefault = params => request.post('user_address/setDefault', params)

// 删除收货地址
export const apiAddressDel = params => request.post('user_address/del', params)

// 微信导入收货地址转ID
export const apiAddresshandleRegion = params => request.get('user_address/handleRegion', {
	params
})
// E 地址


// S 提现

// 提现记录列表
export const apiWithdrawLog = () => request.get('shop/withdrawLog')

// 提现数据
export const apiGetWithdrawInfo = () => request.get('shop/getWithdrawInfo')

// 添加银行卡
export const apiAddBank = (params) => request.post('shop/addBank', params)

// 删除银行卡
export const apiDelBank = (params) => request.post('shop/delBank', params)

// 编辑银行卡
export const apiEditBank = (params) => request.post('shop/editBank', params)

// 银行卡详情
export const apigetBankDetail = (params) => request.get('shop/getBank', {params})

// 提现申请
export const apiWithdrawApply = (params) => request.post('shop/withdraw', params)

// E 提现
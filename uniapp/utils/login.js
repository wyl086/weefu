// +----------------------------------------------------------------------
// | multshop开源商城系统
// +----------------------------------------------------------------------
// | 欢迎阅读学习系统程序代码，建议反馈是我们前进的动力
// | gitee下载：https://gitee.com/multshop_gitee
// | github下载：https://github.com/multshop-github
// | 访问官网：https://www.multshop.cn
// | 访问社区：https://home.multshop.cn
// | 访问手册：http://doc.multshop.cn
// | 微信公众号：multshop技术社区
// | multshop系列产品在gitee、github等公开渠道开源版本可免费商用，未经许可不能去除前后端官方版权标识
// |  multshop系列产品收费版本务必购买商业授权，购买去版权授权后，方可去除前后端官方版权标识
// | 禁止对系统程序代码以任何目的，任何形式的再发布
// | multshop团队版权所有并拥有最终解释权
// +----------------------------------------------------------------------
// | author: multshop.cn.team
// +----------------------------------------------------------------------

import {
	silentLogin
} from '@/api/app';
import {
	isWeixinClient,
	currentPage,
	trottle
} from './tools'
import store from '@/store'
import Cache from './cache'
import {
	BACK_URL,
	INVITE_CODE
} from '@/config/cachekey'
import {bindSuperior} from '@/api/user'
import wechath5 from './wechath5'
import {router} from '@/router'

// 获取登录凭证（code）

export function getWxCode() {
	return new Promise((resolve, reject) => {
		uni.login({
			success(res) {
				resolve(res.code);
			},

			fail(res) {
				reject(res);
			}

		});
	});
}
//小程序获取用户信息
export function getUserProfile() {
	return new Promise((resolve, reject) => {
		uni.getUserProfile({
			desc: '获取用户信息，完善用户资料 ',
			success: (res) => {
				resolve(res);
			},
			fail(res) {}

		})
	})

}

//小程序静默授权

export async function wxMnpLogin() {
	const code = await getWxCode()
	const {
		code: loginCode,
		data: loginData
	} = await silentLogin({
		code
	})
	const {
		options,
		onLoad,
		onShow,
		route
	} = currentPage()
	if (loginCode != 1) return
	if (loginData.token && !loginData.is_new_user) {
		store.commit('login', loginData)
		// 绑定邀请码
		const inviteCode = Cache.get(INVITE_CODE)
		if (inviteCode) {
			bindSuperior({code: inviteCode})
			Cache.remove(INVITE_CODE)
		} 
		// 刷新页面
		onLoad && onLoad(options)
		onShow && onShow()
	} 
}
export const toLogin = trottle(_toLogin, 1000)
function _toLogin() {
	//#ifdef  MP-WEIXIN
	wxMnpLogin()
	// #endif
	
	//#ifndef MP-WEIXIN
	const {currentRoute} = router
	if(currentRoute.meta.auth) {
		router.push('/pages/login/login')
	}
	// #endif
} 
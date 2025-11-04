import {
    getUser
} from '@/api/user'
import {
    getCartNum
} from '@/api/store';
import {
    USER_INFO,
    TOKEN,
    CONFIG
} from '@/config/cachekey';
import Cache from '@/utils/cache'
import wechath5 from '@/utils/wechath5'
import {
    isWeixinClient
} from '@/utils/tools'
import {
    baseURL,
    basePath
} from '@/config/app'

const state = {
    config: Cache.get(CONFIG) || {
		app_agreement: 1,
        center_setting: {},
        index_setting: {},
        navigation_menu: [],
        navigation_setting: {},
        share: {}
    },
    userInfo: {
        user_money: 0,
        user_integral: 0,
        coupon: 0
    },
    token: Cache.get(TOKEN) || null,
    cartNum: "",
    sysInfo: {}
};

const mutations = {
    login(state, opt) {
        state.token = opt.token;
        Cache.set(TOKEN, opt.token, 59 * 24 * 60 * 60);
        this.dispatch('getUser')
    },
    logout(state) {
        state.token = undefined;
        state.userInfo = {
            user_money: 0,
            user_integral: 0,
            coupon: 0
        }
        Cache.remove(TOKEN);
    },
    setCartNum(state, num) {
        state.cartNum = num
    },
    setUserInfo(state, user) {
        state.userInfo = user
    },
    setConfig(state, data) {
        state.config = Object.assign(state.config, data)
        Cache.set(CONFIG, state.config);
    },
    setSystemInfo(state, data) {
        state.sysInfo = data
    }
};

const actions = {
    getCartNum({
        state,
        commit
    }) {
        return new Promise(resolve => {
            if (!state.token) return uni.removeTabBarBadge({
                index: 3
            })
            getCartNum().then(res => {
                if (res.code == 1) {
                    commit('setCartNum', res.data.num)
                    resolve()
                }
            })
        })
    },
    getUser({
        state,
        commit
    }) {
        return new Promise(resolve => {
            getUser().then(res => {
                if (res.code == 1) {
                    commit('setUserInfo', res.data)
                }
                resolve()
            })
        })
    },
    getSystemInfo({
        state,
        commit
    }) {
        uni.getSystemInfo({
            success: res => {
                let {
                    statusBarHeight,
                    platform,
                } = res;
                let navHeight;
                if (platform == 'ios' || platform == 'devtools') {
                    navHeight = statusBarHeight + 44;
                } else {
                    navHeight = statusBarHeight + 48;
                }
                commit('setSystemInfo', {
                    ...res,
                    navHeight,
                })
                console.log(state)
            },
            fail(err) {
                console.log(err);
            }
        });
    },
    wxShare({
        state
    }, opt) {
        // #ifdef H5
        const shareInfo = state.config.share
        const inviteCode = state.userInfo.distribution_code
        const href = window.location.href
        const sym = href.includes('?') ? '&' : '?'
        const option = {
            shareTitle: shareInfo.h5_share_title,
            shareLink: inviteCode ? `${href}${sym}invite_code=${inviteCode}` : href,
            shareImage: shareInfo.h5_share_image,
            shareDesc: shareInfo.h5_share_intro
        }
        wechath5.share(Object.assign(option, opt))
        // #endif

    }
};

export default {
    state,
    mutations,
    actions
};

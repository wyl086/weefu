
import cookieparser from 'cookieparser'
import Cookies from 'js-cookie'
export const state = () => ({
    token: '',
    category: [],
    publicData: {},
    config: {}
})

export const mutations = {
    setToken(state, token) {
        state.token = token
    },
    logout() {
        state.token = ''
        Cookies.remove('token')
    },
    setCategory(state, data) {
        state.category = data
    },
    setConfig(state, data) {
        state.config = data
    },
    setPublic(state, data) {
        state.publicData = data
    },
}

export const getters = {
    isLogin:(state) => !!state.token,
    headTitle: (state) =>  state.config.name,
    favicon: (state) =>  state.config.web_favicon
}

export const actions = {
    async nuxtServerInit({dispatch, commit}, {req, app}) {
        let cookie = req.headers.cookie;
        if (cookie) {
            const parsed = cookieparser.parse(cookie)
            commit('setToken', parsed.token || "")
        }
        await dispatch('getCategory')
        await dispatch('getConfig')
        await dispatch('getPublicData')
    },
     // 获取分类
    async getCategory({commit}) {
        const { data, code } = await this.$get("pc/category");
        if (code == 1) {
          commit('setCategory', data)
        }
    },
    // 获取配置
    async getConfig({commit}) {
        const { data, code } = await this.$get("index/config");
        if (code == 1) {
            console.log(data)
            commit('setConfig', data)
        }
    },
    async getPublicData({commit}) {
        const { data, code } = await this.$get("pc/commonData");
        if (code == 1) {
          commit('setPublic', data)
        }
    },
}
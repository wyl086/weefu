import wechath5 from '@/utils/wechath5'
import {
    isWeixinClient
} from '@/utils/tools'
import {
    baseURL,
    basePath
} from '@/config/app'

const state = {
    communityItem: {}
};

const mutations = {
    setCommunity(state, data) {
        state.communityItem = data
    }
};

const actions = {
    // 分享种草文章
    communityShare({
        state,
        commit
    }) {
        const item = state.communityItem;
        console.log(item)
        // #ifdef H5
        if (isWeixinClient()) {
            const option = {
                shareTitle: `${item.user.nickname}，TA的内容超级棒`,
                shareLink: `${baseURL}${basePath}/${item.url}?id=${item.id}`,
                shareImage: item.image,
                shareDesc: item.content
            }
            wechath5.share(option)
        }
        // #endif
        // #ifdef APP-PLUS
        uni.share({
            provider: "weixin",
            scene: "WXSceneSession",
            type: 0,
            href: `${baseURL}${basePath}/${item.url}?id=${item.id}`,
            title: `${item.user.nickname}，TA的内容超级棒`,
            summary: item.content,
            imageUrl: item.image,
            success: (res) => {
                console.log('分享成功');
            },
            fail: (err) => {
                console.log(err)
                uni.showToast({
                    icon: 'none',
                    title: err.errMsg
                })
            }
        });
        // #endif
    }
};

export default {
    state,
    mutations,
    actions
};


import {
	mapGetters,
	mapMutations
} from 'vuex'
import wechath5 from '@/utils/wechath5'

import {isWeixinClient, currentPage, paramsToStr} from '@/utils/tools'
import Cache from "@/utils/cache"
import color from '@/config/color'
export default {
	data() {
		return {
			colorConfig: color
		};
	},
	async onLoad(option) {
   
	},
	methods: {
		
	},
	computed: {
		...mapGetters(['isLogin','inviteCode','appConfig'])
	},
    
    // 全局配置分享
    onShareAppMessage() {
    	const { h5_share_image, share_intro, share_title, mnp_share_title, mnp_share_image } = this.appConfig.share
    	
        // #ifdef H5
        const share = {
        	title: share_title,
        	path: `/pages/index/index?invite_code=${this.inviteCode}`,
        	imageUrl: h5_share_image
        }
        // #endif
        
        // #ifdef MP-WEIXIN
        const share = {
        	title: mnp_share_title,
        	path: `/pages/index/index?invite_code=${this.inviteCode}`,
        	imageUrl: mnp_share_image
        }
        // #endif
        
    	return share
    },
    
    onShareTimeline() {
    	const { h5_share_image, share_intro, share_title } = this.appConfig.share
        
        // #ifdef H5
        const share = {
        	title: share_title,
        	imageUrl: h5_share_image
        }
        // #endif
        
        // #ifdef MP-WEIXIN
        const share = {
        	title: mnp_share_title,
        	imageUrl: mnp_share_image
        }
        // #endif
        
    	return share
    }
};

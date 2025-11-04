<template>
	<view class="live-room">
		<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :up="upOption">
			<view class="p-20 flex flex-wrap" style="margin: 0 -8rpx;">
				<template  v-for="(live, index ) in liveLists" >
					<view :key="live.id" class="m-b-20 p-l-8 p-r-8" style="width: 100%;"  v-if="live.live_status == 101">
					
						<live-item :data="live"></live-item>
					</view>
					<view :key="live.id"  style="width: 50%;" class="m-b-20 p-l-8 p-r-8" v-else>
					
						<live-item :data="live"></live-item>
					</view>
				</template>
			</view>
		</mescroll-body>

	</view>
</template>

<script>
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins";
	import { getLiveLists } from '@/api/live'
	export default {
		mixins: [MescrollMixin],
		data() {
			return {
				upOption: {
					auto: false,
					empty: {
						icon: '/static/images/goods_null.png',
						tip: "暂无数据～",
					},
				},
				liveLists: []
			}
		},
	
		onShareAppMessage() {
			const shareInfo = this.appConfig.share
			return {
				title: shareInfo.mnp_share_title,
				path: "/bundle_b/pages/live-room/live-room?invite_code=" + this.inviteCode
			};
		},
		methods: {
			async downCallback() {
				this.mescroll.resetUpScroll();
			},
			
			onReflesh() {
				this.liveLists = []
				this.mescroll.resetUpScroll();
			},
		
			upCallback(page) {

				let pageNum = page.num;
				let pageSize = page.size;
				getLiveLists({
					page_no: pageNum,
					page_size: pageSize,
				}).then(res => {
					if (res.code == 1) {
						let curPageData = res.data.list;
						let curPageLen = curPageData.length;
						let hasNext = !!res.data.more;
						if (page.num == 1) {
							this.liveLists = [];
						}
						this.liveLists = this.liveLists.concat(curPageData);
						this.mescroll.endSuccess(curPageLen, hasNext);
					}
				}).catch(err => {
					this.mescroll.endErr()
				})
			},
		}
	}
</script>

<style>
</style>

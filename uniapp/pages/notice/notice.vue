<template>
	<view class="notice">
		<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :up="upOption">
			<view v-for="(item, index) in lists" :key="index" class="notice-item bg-white">
				<view class="flex row-between item-header">
					<view class="header-title md bold">{{item.title}}</view>
					<view class="header-time muted xs">{{item.create_time}}</view>
				</view>
				<view class="item-main m-t-24">
					<view class="content sm lighter">{{item.content}}</view>
				</view>
			</view>
		</mescroll-body>
	</view>
</template>

<script>
	import {
		getNoticeLists
	} from '@/api/store';
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins";
	export default {
		mixins: [MescrollMixin],
		data() {
			return {
				lists: [],
				upOption: {
					empty: {
						icon: '/static/images/news_null.png',
						tip: "暂无消息通知~",
					}
				},
			};
		},
		onLoad() {
			this.type = this.$Route.query.type;

			switch (this.type) {
				case "system":
					uni.setNavigationBarTitle({
						title: '系统通知'
					});
					break;

				case "earning":
					uni.setNavigationBarTitle({
						title: '收益通知'
					});
					break;
			}
		},


		methods: {
			upCallback(page) {
				getNoticeLists({
					page_size: page.size,
					page_no: page.num,
					type: this.type
				}).then(({
					data
				}) => {
					if (page.num == 1) this.lists = [];
					const curPageData = data.list;
					const curPageLen = curPageData.length;
					const hasNext = !!data.more;
					this.lists = this.lists.concat(curPageData);
					this.mescroll.endSuccess(curPageLen, hasNext);
				}).catch(() => {
					this.mescroll.endErr()
				})
			},
		}
	};
</script>
<style lang="scss">
	.notice {
		overflow: hidden;
		.notice-item {
			padding: 0 20rpx 30rpx;
			border-radius: 10rpx;
			margin: 20rpx 20rpx 0;
			.item-header {
				padding: 19rpx 0;
				border-bottom: $-solid-border;
			}
		}

	}
</style>

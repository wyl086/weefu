

<template>
	<mescroll-body ref="mescrollRef" @init="mescrollInit" @up="upCallback" :up="upOption" @down="downCallback">
		<view class="activity-detail">
			<view class="header" v-if="goodsList.length">
				<image class="header-bg" src="/bundle/static/activity_detail_bg.png"></image>
				<view class="header-con flex-col col-center">
					<view class="title white">{{name}}</view>
					<view class="desc white sm br60">{{title}}</view>
				</view>
			</view>
			<view class="content">
				<view class="goods-container">
					<goods-list :list="goodsList" type="activity"></goods-list>
				</view>
			</view>
		</view>
	</mescroll-body>
</template>

<script>
	import {
		getActivityGoodsLists
	} from "@/api/activity";
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";

	export default {
		mixins: [MescrollMixin], // 使用mixin
		data() {
			return {
				upOption: {
					empty: {
						icon: '/static/images/goods_null.png',
						tip: '暂无商品', // 提示
					}
				},
				goodsList: [],
				name: '',
				title: ''
			};
		},
		onLoad: function(options) {
			const {
				id,
				title,
				name
			} = this.$Route.query
			this.id = id;
			this.title = title
			this.name = name
			uni.setNavigationBarTitle({
				title: name
			});
		},
		methods: {
			upCallback(page) {
				const pageNum = page.num; // 页码, 默认从1开始
				const pageSize = page.size; // 页长, 默认每页10条
				getActivityGoodsLists({
					page_size: pageSize,
					page_no: pageNum,
					id: this.id
				}).then(({
					data
				}) => {
					if (page.num == 1) this.goodsList = [];
					const curPageData = data.list;
					const curPageLen = curPageData.length;
					const hasNext = !!data.more;
					this.goodsList = this.goodsList.concat(curPageData);
					this.mescroll.endSuccess(curPageLen, hasNext);
				}).catch(() => {
					this.mescroll.endErr()
				})
			
			},

		}
	};
</script>
<style lang="scss">
	.activity-detail {
		overflow: hidden;
		.header {
			height: 410rpx;
			width: 100%;
			position: relative;

			.header-bg {
				position: absolute;
				width: 100%;
				height: 100%;
			}

			.header-con {
				position: relative;
				padding-top: 50rpx;

				.title {
					font-size: 60rpx;
				}

				.desc {
					margin-top: 30rpx;
					background-color: rgba(256, 203, 203, 0.5);
					padding: 4rpx 40rpx;
				}
			}
		}

		.content {
			position: relative;
			margin-top: -140rpx;
			padding: 0 20rpx;
		}
	}
</style>

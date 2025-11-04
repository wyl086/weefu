

<template>
	<view class="hot-list">
		<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback">
			<view class="header">
                <ad-swipers v-if="type == 'hot'" :pid="12" height="340rpx">
                </ad-swipers>
				<ad-swipers v-if="type == 'new'" :pid="13" height="340rpx">
				</ad-swipers>
            </view>
			<view class="main">
				<view class="list-title flex row-center">
					<u-divider v-if="type == 'hot'" :color="colorConfig.normal" bg-color="transparent" :font-size="38">热销榜单</u-divider>
					<u-divider v-if="type == 'new'" :color="colorConfig.normal" bg-color="transparent" :font-size="38">新品推荐</u-divider>
				</view>
				<view class="hot">
					<goods-list v-if="type == 'hot'" :list="goodsList" type="hot"></goods-list>
				</view>
				<view class="news">
					<goods-list v-if="type == 'new'" :list="goodsList" type="double"></goods-list>
				</view>
			</view>
		</mescroll-body>
	</view>
</template>

<script>
	import {
		getGoodsList
	} from '@/api/store';
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins";
	export default {
		mixins: [MescrollMixin],
		data() {
			return {
				upOption: {
					empty: {
						icon: "/static/images/goods_null.png",
						tip: "暂无商品～"
					}
				},
				goodsList: [],
				type: ''
			};
		},
		onLoad() {
			this.type = this.$Route.query.type
			switch(this.type) {
				case 'hot': uni.setNavigationBarTitle({
					title: '热销榜单'
				})
				break;
				case 'new': uni.setNavigationBarTitle({
					title: '新品推荐'
				})
				break;
			}
		},
		methods: {
			upCallback(page) {
				let pageNum = page.num;
				let pageSize = page.size;
				const params = {
					page_no: pageNum,
					page_size: pageSize,
				}
				switch(this.type) {
					case 'hot': params.sort_by_sales = 'desc'
					break;
					case 'new': params.sort_by_create = 'desc'
					break;
				}
				getGoodsList(params).then(res => {
					if (res.code == 1) {
						let curPageData = res.data.lists;
						let curPageLen = curPageData.length;
						let hasNext = !!res.data.more;
						if (page.num == 1) {
							this.goodsList = [];
						}
						this.goodsList = this.goodsList.concat(curPageData);
						this.mescroll.endSuccess(curPageLen, hasNext);
					}
				}).catch(err => {
					this.mescroll.endErr()
				})
			},
		}
	};
</script>
<style lang="scss">
	.hot-list {
		.main {

			.list-title {
				margin: 27rpx 0 30rpx;
			}
			.hot {
				padding: 0 30rpx;
			}
		}

	}
</style>

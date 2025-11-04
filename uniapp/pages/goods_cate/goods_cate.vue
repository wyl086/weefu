<template>
	<view class="goods-cate">
		<router-link to="/pages/goods_search/goods_search">
			<view class="header">
				<u-search bg-color="#F4F4F4" :disabled="true"></u-search>
			</view>
		</router-link>
		<view class="content" v-if="appConfig.cate_style == 1 || appConfig.cate_style == 4">
			<cate-two :cate-list="cateList"></cate-two>
		</view>
		<view class="content bg-body" v-if="appConfig.cate_style == 3 || appConfig.cate_style == 2">
			<cate-one :cate-list="cateList"></cate-one>
		</view>
		<tabbar></tabbar>
	</view>
</template>

<script>
	import {
		getLevelOneList,
		getGoodsList,
		getListByLevelOne
	} from '@/api/store';
	import {
		getRect,
		trottle,
		arraySlice
	} from '@/utils/tools';
	import {
		mapGetters,
		mapActions
	} from 'vuex'
	import Cache from '@/utils/cache'
	export default {
		data() {
			return {
				cateList: [],
				cateTwoList: [],
				selectIndex: 0
			};
		},
		async onLoad(options) {
			this.getLevelOneListFun();
			// this.getListByLevelOneFun()
		},
		onShow() {
			this.getCartNum()
		},
		methods: {
			...mapActions(['getCartNum']),
		

			async getLevelOneListFun() {
				const {
					code,
					data
				} = await getLevelOneList();
				if (code == 1) {
					this.cateList = data
				}
			},
			
		},
		computed: {
			...mapGetters(['inviteCode', 'appConfig']),
		}
	};
</script>
<style lang="scss" scoped>
	$header-height: 94rpx;

	page {
		background-color: #fff;
		height: 100%;
		.goods-cate {
			height: 100%;
			.header {
				box-sizing: border-box;
				height: $header-height;
				border-bottom: $-solid-border;

				.search {
					flex: 1;
					height: 60rpx;

					input {
						flex: 1;
						height: 100%;
					}
				}
			}

			.content {
				height: calc(100vh - #{$header-height} - var(--window-top) - var(--window-bottom) - 50px - env(safe-area-inset-bottom));
			}
		}
	}
</style>

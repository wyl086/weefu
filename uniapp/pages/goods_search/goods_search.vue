<template>
	<view class="goods-search flex-col">
		<view class="header-wrap">
			<view class="search">
				<u-search v-model="keyword" @focus="showHistory = true" :focus="showHistory" @search="onSearch"
					bg-color="#F4F4F4"></u-search>
			</view>
			<sort-nav v-model="sortConfig" v-show="!showHistory"></sort-nav>
		</view>
		<view v-show="showHistory" class="search-content bg-white">
			<scroll-view :scroll-y="true" style="height: 100%">
				<view v-if="hotList.length" class="search-words">
					<view class="title">热门搜索</view>
					<view class="words flex flex-wrap">
						<view v-for="(item, index) in hotList" :key="index"
							class="item br60  m-r-20 m-b-20 lighter sm line-1" @tap="onChangeKeyword(item)">{{item}}</view>
					</view>
				</view>
				<view v-if="historyList.length" class="search-words">
					<view class="title flex row-between">
						<view>历史搜索</view>
						<view class="xs muted m-r-20" style="padding: 10rpx 20rpx" @tap="clearSearchFun">清空</view>
					</view>
					<view class="words flex flex-wrap">
						<view v-for="(item, index) in historyList" :key="index"
							class="item br60  m-r-20 m-b-20 lighter sm line-1" @tap="onChangeKeyword(item)">{{item}}</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="content">
			<mescroll-uni ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback"
				:up="upOption" :down="{auto: false}" :fixed="false">
				<view class="goods-list">
					<view v-show="sortConfig.goodsType == 'double'" class="double">
						<goods-list type="double" :list="goodsList"></goods-list>
					</view>
					<view v-show="sortConfig.goodsType == 'one'" class="one">
						<goods-list :list="goodsList" type="one"></goods-list>
					</view>
				</view>
			</mescroll-uni>
		</view>
	</view>
</template>

<script>
	import {
		getGoodsList,
		getSearchpage,
		clearSearch
	} from '@/api/store';
	import {
		mapGetters
	} from 'vuex';
	import {
		loadingType
	} from '@/utils/type';
	import {
		getRect,
		trottle
	} from '@/utils/tools';

	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins";
	export default {
		mixins: [MescrollMixin],
		data() {
			return {
				upOption: {
					auto: false,
					empty: {
						icon: '/static/images/goods_null.png',
						tip: "暂无商品",
					}
				},
				keyword: '',
				status: loadingType.LOADING,
				page: 1,
				sortConfig: {
					goodsType: 'double',
					priceSort: '',
					saleSort: '',
				},
				goodsList: [],
				showHistory: false,
				hotList: [],
				historyList: []
			};
		},

		watch: {
			// 监听属性
			keyword(value, old) {
				if (!value && !this.id) {
					this.showHistory = true
				}
			},
			showHistory(value) {
				if (value) {
					this.getSearchpageFun();
				}
			},
			'sortConfig.saleSort'() {
				this.onSearch()
			},
			'sortConfig.priceSort'() {
				this.onSearch()
			}

		},

		onLoad(options) {
			this.onSearch = trottle(this.onSearch, 500, this);
			this.init(options);

		},

		computed: {
			...mapGetters(['sysInfo'])
		},
		methods: {
			downCallback() {
				this.onRefresh()
			},
			upCallback(page) {
				let pageNum = page.num; // 页码, 默认从1开始
				let pageSize = page.size; // 页长, 默认每页10条
				let {
					goodsList,
					keyword,
					sortConfig: {
						priceSort,
						saleSort,
					}
				} = this;
				const params = {
					page_size: pageSize,
					page_no: pageNum,
					platform_cate_id: this.type == 1 ? this.id : '',
					brand_id: this.type == 0 ? this.id : '',
					keyword,
					sort_by_price: priceSort,
					sort_by_sales: saleSort
				}
				getGoodsList(params).then(({
					data
				}) => {
					if (page.num == 1) this.goodsList = [];
					let curPageData = data.lists;
					let curPageLen = curPageData.length;
					let hasNext = !!data.more;
					this.goodsList = this.goodsList.concat(curPageData);
					this.mescroll.endSuccess(curPageLen, hasNext);
				}).catch(() => {
					this.mescroll.endErr()
				})
			},
			onChange(e) {
				this.keyword = e.value
			},


			clearSearchFun() {
				clearSearch().then(res => {
					if (res.code == 1) {
						this.getSearchpageFun();
					}
				});
			},



			init(option) {
				const {
					id,
					name,
					type
				} = this.$Route.query
				this.type = type
				if (id) {
					uni.setNavigationBarTitle({
						title: name
					});
					this.id = id;
					this.$nextTick(() => {
						this.onRefresh()
					})
				} else {
					uni.setNavigationBarTitle({
						title: '商品搜索'
					});
					this.showHistory = true
					
				}
			},

			getSearchpageFun() {
				getSearchpage().then(res => {
					if (res.code == 1) {
						let {
							history_lists,
							hot_lists
						} = res.data;
						this.hotList = hot_lists
						this.historyList = history_lists
					}
				});
			},

			onClear() {
				if (this.id) {
					this.onRefresh();
				}
			},
			onSearch() {
				this.showHistory = false
				this.$nextTick(() => {
					this.onRefresh()
				})
			},
			onRefresh() {
				this.goodsList = []
				this.mescroll.resetUpScroll();
			},

			onChangeKeyword(item) {
				this.keyword = item
				this.showHistory = false
				this.onRefresh();
			},
		}
	};
</script>
<style lang="scss">
	page {
		height: 100%;
		padding: 0;
	}
	.goods-search {
		height: 100%;
		position: relative;
		.header-wrap {
			position: relative;
			z-index: 999;
			.search {
				box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.03);
				position: relative;
				z-index: 1;
			}
		}
		.search-content {
			position: absolute;
			width: 100%;
			height: 100%;
			padding-top: 100rpx;
			z-index: 100;
			.search-words {
				padding-left: 24rpx;
				padding-bottom: 20rpx;
			
				.title {
					padding: 26rpx 0;
				}
			
				.words {
					.item {
						line-height: 52rpx;
						height: 52rpx;
						padding: 0 24rpx;
						background-color: #F5F5F5;
					}
				}
			}
		}

		.content {
			flex: 1;
			min-height: 0;

			.goods-list {
				overflow: hidden;
			}
		}
	}
</style>

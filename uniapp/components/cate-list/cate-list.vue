<template>
	<view class="cate-list">
		<mescroll-uni :ref="'mescrollRef'+i" :top="positionTop"  bottom="50px" :safearea="true" @init="mescrollInit"
			@down="downCallback" @up="upCallback" :up="upOption" :down="downOption">
			<view class="content">
				<view style="margin: 0 20rpx" v-if="appConfig.cate_style == 3">
					<cate-nav :list="cateTwoList"></cate-nav>
				</view>
				<ad-swipers :pid="11" height="268rpx"  padding="20rpx 20rpx 0" radius="10rpx">
				</ad-swipers>
				<view class="sort-nav-wrap">
					<sort-nav v-model="sortConfig"></sort-nav>
				</view>
				<view class="goods">
					<view v-show="sortConfig.goodsType == 'double'" class="double">
						<goods-list type="double" :list="goodsList"></goods-list>
					</view>
					<view v-show="sortConfig.goodsType == 'one'" class="one">
						<goods-list :list="goodsList" type="one"></goods-list>
					</view>
				</view>
			</view>
		</mescroll-uni>
	</view>
</template>
<script>
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import MescrollMoreItemMixin from "@/components/mescroll-uni/mixins/mescroll-more-item.js";

	import {
		getGoodsList,
		getListByLevelOne
	} from "@/api/store"
	import {
		mapGetters,
		mapActions
	} from 'vuex'
	const app = getApp()
	export default {
		mixins: [MescrollMixin, MescrollMoreItemMixin],
		name: "cate-list",
		props: {
			top: {
				type: [Number, String]
			},
			cate: {
				type: Object,
				default: () => ({})
			}
		},
		data() {
			return {
				goodsList: [],
				cateTwoList: [],
				upOption: {
					auto: false, // 不自动加载
					noMoreSize: 1, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
					empty: {
						icon: '/static/images/goods_null.png',
						tip: '暂无商品~', // 提示
					}
				},
				sortConfig: {
					goodsType: 'double',
					priceSort: '',
					saleSort: '',
				},
			};

		},
		computed: {
			...mapGetters(['appConfig']),
			positionTop() {
				return this.top
			}
		},
		methods: {
			onRefresh() {
				this.mescroll.resetUpScroll(true);
			},
			async downCallback() {
				await this.getListByLevelOneFun()
				this.mescroll.resetUpScroll();
			},
			upCallback(page) {
				const {sortConfig: {
					priceSort,
					saleSort,
				}} = this
				getGoodsList({
					page_size: page.size,
					page_no: page.num,
					platform_cate_id: this.cate.id,
					sort_by_price: priceSort,
					sort_by_sales: saleSort
				}).then(({
					data
				}) => {
					const curPageData = data.lists;
					const curPageLen = curPageData.length;
					const hasNext = !!data.more;
					if (page.num == 1) this.goodsList = [];
					this.goodsList = this.goodsList.concat(curPageData);
					this.mescroll.endSuccess(curPageLen, hasNext);
				})
			},
			async getListByLevelOneFun() {
				const {
					id
				} = this.cate
				const {
					code,
					data
				} = await getListByLevelOne({
					id
				})
				if (code == 1) {
					this.cateTwoList = data
				}
			}
		},
		watch: {
			'sortConfig.saleSort'() {
				this.onRefresh()
			},
			'sortConfig.priceSort'() {
				this.onRefresh()
			}
		}
	}
</script>

<style lang="scss">
	.cate-list {
		border-radius: 20rpx 20rpx 0 0;
		overflow: hidden;

		.contain {
			padding: 20rpx 30rpx 0;
		}
		.sort-nav-wrap {
			margin: 20rpx 20rpx 0;
			border-radius: 14rpx;
			overflow: hidden;
		}
		.title-img {
			width: 100%;
			height: 120rpx;
		}

	}
</style>

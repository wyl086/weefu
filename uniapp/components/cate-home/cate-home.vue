<template>
	<view class="cate-home">
		<mescroll-uni :ref="'mescrollRef'+i" bg-color="#f4f4f4" :top="positionTop" @init="mescrollInit" bottom="50px" :safearea="true"
			@down="downCallback" @up="upCallback" :down="downOption" :up="upOption">
			<view class="content">
				<view style="margin: 0 30rpx">
					<cate-nav :list="navList"></cate-nav>
				</view>
				<view class="contain" v-if="hotGoods.length">
					<active-area :list="hotGoods" type="hot" title="品类热销"></active-area>
				</view>
				<view class="contain" v-if="newGoods.length">
					<active-area :list="newGoods" type="new" title="品类推荐"></active-area>
				</view>
				<view class="goods">
					<image src="/static/images/category_title.png" class="title-img"></image>
					<u-waterfall ref="uWaterfall" v-model="goodsList" :add-time="20">
						<template v-slot:left="{leftList}">
							<view style="padding:0 9rpx 0 30rpx">
								<goods-list width="336rpx" type="waterfall" :list="leftList"></goods-list>
							</view>
						</template>
						<template v-slot:right="{rightList}">
							<view style="padding:0 30rpx 0 9rpx;">
								<goods-list width="336rpx" type="waterfall" :list="rightList"></goods-list>
							</view>
						</template>
					</u-waterfall>
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
		getListByLevelOne,
		getIndexCategory
	} from "@/api/store"
	const app = getApp()
	export default {
		mixins: [MescrollMixin, MescrollMoreItemMixin],
		name: "cate-home",
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
				navList: [],
				hotGoods: [],
				newGoods: [],
				downOption: {
					auto: false // 不自动加载 (mixin已处理第一个tab触发downCallback)
				},
				upOption: {
					auto: false, // 不自动加载
					noMoreSize: 1, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
					empty: {
						icon: '/static/images/goods_null.png',
						tip: '暂无商品~', // 提示
					}
				},
			};

		},
		created() {

		},
		computed: {
			positionTop() {
				return this.top
			}
		},
		methods: {
			async downCallback() {
				await this.getIndexCategory()
				this.$refs.uWaterfall.clear && this.$refs.uWaterfall.clear();
				this.mescroll.resetUpScroll();
			},
			upCallback(page) {
				let pageNum = page.num; // 页码, 默认从1开始
				let pageSize = page.size; // 页长, 默认每页10条
				getGoodsList({
					page_size: pageSize,
					page_no: pageNum,
					platform_cate_id: this.cate.id
				}).then(({
					data
				}) => {
					let curPageData = data.lists;
					let curPageLen = curPageData.length;
					let hasNext = !!data.more;
					if (page.num == 1) this.goodsList = [];
					this.goodsList = this.goodsList.concat(curPageData);
					this.mescroll.endSuccess(curPageLen, hasNext);
				})
			},
			async getIndexCategory() {
				const {
					id
				} = this.cate
				const {
					code,
					data
				} = await getIndexCategory({
					platform_category_id: id
				})
				if (code == 1) {
					const {level_two, category_hots, category_recommend} = data
					this.navList = level_two
					this.hotGoods = category_hots
					this.newGoods = category_recommend
				}
			}
		}
	}
</script>

<style lang="scss">
	.cate-home {
		border-radius: 20rpx 20rpx 0 0;
		overflow: hidden;

		.contain {
			padding: 20rpx 30rpx 0;
		}

		.title-img {
			width: 100%;
			height: 120rpx;
		}

	}
</style>

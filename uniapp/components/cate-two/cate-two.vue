<template>
	<view class="cate-two flex" style="height: 100%;">
		<view class="aside bg-white">
			<scroll-view style="height: 100%" scroll-y="true" scroll-with-animation="true" >
				<block v-for="(item, index) in cateList" :key="index">
					<view :class="'one-item sm ' + (index == selectIndex ? 'active' : '')" @click="changeActive(index)">
						<text class="name">{{ item.name }}</text>
						<view v-if="index == selectIndex" class="active-line bg-primary"></view>
					</view>
				</block>
			</scroll-view>
		</view>
		<view class="main bg-body">
			<scroll-view style="height: 100%" scroll-y="true" scroll-with-animation="true" @scrolltolower="getGoodsListFun">
				<view class="main-wrap">
					<ad-swipers :pid="11" height="200rpx" previous-margin="0" padding="0 0 20rpx" radius="10rpx">
					</ad-swipers>
					<view class="cate-two" v-if="appConfig.cate_style == 4">
						<view v-for="(sitem, sindex) in cateTwoList" :key="sindex" class="two-item bg-white m-b-20">
							<router-link :to="{path: '/pages/goods_search/goods_search', query: {
								id: sitem.id,
								name: sitem.name,
								type: 1
							}}">
								<view class="title flex row-between">
									<text class="name bold sm">{{sitem.name}}</text>
									<u-icon name="arrow-right"></u-icon>
								</view>
							</router-link>
							<view class="three-list flex flex-wrap">
								<router-link class="three-item" v-for="(titem, tindex) in sitem.children" :key="tindex"
									:to="{path: '/pages/goods_search/goods_search', query: {
									id: titem.id,
									name: titem.name,
									type: 1
								}}">
									<view class=" flex-col col-center m-b-20">
										<u-image mode="aspectFit" width="150rpx" height="150rpx" :src="titem.image">
										</u-image>
										<view class="text m-t-20 xs">{{ titem.name }}</view>
									</view>
								</router-link>
							</view>
						</view>
					</view>
					<view class="goods" v-if="appConfig.cate_style == 1 && hasData">
						<view class="sort-nav-wrap">
							<sort-nav v-model="sortConfig" :show-type="false"></sort-nav>
						</view>
						<view class="goods">
							<view class="goods-list">
								<router-link v-for="(item, index) in goodsList" :key="index"
									:to="`/pages/goods_details/goods_details?id=${item.id}`">
									<view class="flex item bg-white m-t-20">
										<u-image width="200rpx" height="200rpx" border-radius="14rpx" :src="item.image">
										</u-image>
										<view class="flex-1 m-l-20 m-r-10">
											<view class="line-2">{{item.name}}</view>
											<view class="muted">
												<text class="xxs">原价</text>
												<price-format :subscript-size="22" :first-size="22" :second-size="22"
													:price="item.market_price"></price-format>
											</view>
											<view class="primary mt10">
												<price-format :price="item.min_price" :subscript-size="22" :first-size="34"
													:second-size="26"></price-format>
											</view>
										</view>
									</view>
								</router-link>
							</view>
							<loading-footer :status="status" :slot-empty="true">
								<view slot="empty" class="flex-col col-center" style="padding: 200rpx 0 0">
									<image class="img-null" src="/static/images/goods_null.png"></image>
									<text class="lighter sm">暂无商品</text>
								</view>
							</loading-footer>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import {
		getListByLevelOne,
		getGoodsList
	} from '@/api/store'
	import {
		mapGetters,
		mapActions
	} from 'vuex'
	import {
		loadingType
	} from '@/utils/type.js'
	export default {
		name: "cate-two",
		props: {
			cateList: {
				type: Array,
				default: () => ([])
			}
		},
		data() {
			return {
				selectIndex: 0,
				cateTwoList: [],
				goodsList: [],
				sortConfig: {
					goodsType: 'double',
					priceSort: '',
					saleSort: '',
				},
				status: loadingType.LOADING,
				hasData: true
			};
		},
		methods: {
			changeActive(index) {
				this.selectIndex = index
			},
			async getListByLevelOneFun() {
				const {
					selectIndex,
					cateList
				} = this
				if(!cateList.length) return
				const id = cateList[selectIndex].id
				const {
					code,
					data
				} = await getListByLevelOne({
					id
				})
				if (code == 1) {
					this.cateTwoList = data
				}
			},
			getGoodsListFun() {
				let {
					page,
					cateList,
					status,
					selectIndex,
					goodsList,
					sortConfig: {
						priceSort,
						saleSort,
					}
				} = this;
				if(!cateList.length) return
				const id = cateList[selectIndex].id
				if (status == loadingType.FINISHED || this.appConfig.cate_style == 4) return;
				getGoodsList({
					page_no: page,
					platform_cate_id: id,
					sort_by_price: priceSort,
					sort_by_sales: saleSort,
				}).then(res => {
					if (res.code == 1) {
						let {
							more,
							lists,
						} = res.data;
						goodsList.push(...lists);
						this.page++;
						if (!more) {
							this.status = loadingType.FINISHED;
						}
						if (goodsList.length <= 0) {
							this.status = loadingType.EMPTY
							return;
						}
					} else {
						this.status = loadingType.ERROR
					}
				});
			},
			onRefresh() {
				this.status = loadingType.LOADING
				this.page = 1
				this.goodsList = []
				this.getGoodsListFun()
			},
		},
		
		
		watch: {
			selectIndex() {
				this.appConfig.cate_style == 1 ? this.onRefresh() : this.getListByLevelOneFun()
			},
			cateList: {
				immediate: true,
				handler(val) {
					this.hasData = val.length ? true : false
					this.appConfig.cate_style == 1 ? this.onRefresh() : this.getListByLevelOneFun()
				}
			},
			'sortConfig.saleSort'() {
				this.onRefresh()
			},
			'sortConfig.priceSort'() {
				this.onRefresh()
			}
		},
		computed: {
			...mapGetters(['appConfig']),
		}
	}
</script>

<style lang="scss" scoped>
	.cate-two {
		.aside {
			width: 180rpx;
			flex: none;
			height: 100%;

			.one-item {
				position: relative;
				text-align: center;
				padding: 26rpx 10rpx;

				&.active {
					color: $-color-primary;
					font-size: 26rpx;
					font-weight: bold;
				}

				.active-line {
					position: absolute;
					width: 6rpx;
					height: 30rpx;
					left: 4rpx;
					top: 50%;
					transform: translateY(-50%);
				}
			}
		}

		.main {
			height: 100%;
			flex: 1;

			.main-wrap {
				position: relative;

				padding: 20rpx 20rpx 0;

				.two-item {
					border-radius: 10rpx;

					.title {
						height: 90rpx;
						padding: 0 20rpx;

						.line {
							width: 40rpx;
							height: 1px;
							background-color: #BBBBBB;
						}
					}

					.three-list {
						align-items: flex-start;
						padding: 0 10rpx;

						.three-item {
							width: 33%;

							.text {
								text-align: center;
							}
						}
					}

				}
			}
			.goods .item {
				border-radius: 14rpx;
			}
		}
	}
</style>

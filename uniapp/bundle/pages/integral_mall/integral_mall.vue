<template>
	<view class="integral-mall">

		<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :up="upOption">
			<view class="header bg-primary flex row-between white">
				<router-link to="/bundle/pages/integral_sign/integral_sign">
					<view class="user-integral flex">
						<u-icon class="m-r-16" :name="require('@/bundle/static/icon_integral.png')" :size="44"></u-icon>
						我的积分：<text class="xxl bold">{{ integral }}</text>
					</view>
				</router-link>
				<router-link to="/bundle/pages/exchange_order/exchange_order">
					兑换订单 <u-icon name="arrow-right"></u-icon>
				</router-link>
			</view>
			<view class="main">
				<view class="sort-bar flex bg-white">
					<view class="sort-bar-item flex-2 flex row-center" v-for="(item, index) in sortConfig" :key="index"
						@tap="handleSort(item)">
						<text :class="item.value ? 'primary' : ''">{{ item.name }}</text>
						<view class="arrow-icon flex-col col-center row-center" v-if="!item.setValue">
							<u-icon name="arrow-up-fill"
								:color="item.value == 'asc' ? colorConfig.primary : colorConfig.normal"></u-icon>
							<u-icon name="arrow-down-fill"
								:color="item.value == 'desc' ? colorConfig.primary : colorConfig.normal"></u-icon>
						</view>
					</view>
					<view class="flex-1 flex row-center" @tap="changeGoodsType">
						<image class="icon-sm"
							:src="goodsType === 'one' ? '/static/images/icon_double.png' : '/static/images/icon_one.png'">
						</image>
					</view>
				</view>
				<view class="goods-lists" :class="{
					'goods-lists--one': goodsType === 'one'
				}">
					<view class="goods-item" v-for="(item, index) in goodsLists" :key="index">
						<router-link :to="`/bundle/pages/integral_goods_details/integral_goods_details?id=${item.id}`">
							<view class="goods-item-info">
								<view class="goods-image">
									<view class="image-wrap">
										<u-image :src="item.image" width="100%" height="100%"></u-image>
									</view>
								</view>
								<view class="goods-info">
									<view class="goods-name line-2">
										{{ item.name }}
									</view>
									<view class="goods-price primary m-t-10">
										<price-format :color="colorConfig.primary" :show-subscript="false"
											:first-size="36" :second-size="24" :price="item.need_integral" />
										<text class="xs">积分</text>
										<block v-if="item.exchange_way === 2">
											<text>+</text>
											<price-format :color="colorConfig.primary" :show-subscript="false"
												:first-size="36" :second-size="24" :price="item.need_money" />
											<text class="xs">元</text>
										</block>
									</view>
								</view>
							</view>
						</router-link>
					</view>
				</view>
			</view>

		</mescroll-body>
	</view>
</template>

<script>
	import {
		getIntegralGoods
	} from '@/api/activity'
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins";
	import {trottle} from '@/utils/tools'
	export default {
		mixins: [MescrollMixin],
		data() {
			return {
				sortConfig: [{
						name: '最新',
						type: 'sort_by_new',
						value: 'desc',
						setValue: 'desc'
					},
					{
						name: '积分',
						type: 'sort_by_integral',
						value: ''
					},
					{
						name: '兑换量',
						type: 'sort_by_sales',
						value: '',
						setValue: 'desc'
					}
				],
				goodsType: 'double',
				upOption: {
					noMoreSize: 2,
					auto: false,
					empty: {
						icon: '/static/images/goods_null.png',
						tip: "暂无商品",
					}
				},
				goodsLists: [],
				integral: ''
			}
		},
		methods: {
			changeGoodsType() {
				this.goodsType = this.goodsType === 'one' ? 'double' : 'one'
			},
			handleSort(current) {
				this.sortConfig.forEach((item) => {
					if(current.type != item.type) {
						item.value = ''
						return
					}
					if(item.setValue) {
						item.value = item.setValue
						return 
					}
					if(item.value == 'asc') {
						item.value = 'desc'
					}else{
						item.value ='asc'
					}
				})
				
			},
			upCallback(page) {
				const pageNum = page.num; // 页码, 默认从1开始
				const pageSize = page.size; // 页长, 默认每页10条
				const sort = this.sortConfig.find((item) => item.value) || {}
				getIntegralGoods({
					[sort.type]: sort.value,
					page_no: pageNum,
					page_size: pageSize
				}).then(res => {
					if (res.code == 1) {
						const {
							goods,
							integral
						} = res.data
						this.integral = integral
						let curPageData = goods.lists;
						let curPageLen = curPageData.length;
						let hasNext = !!goods.more;
						if (pageNum == 1) this.goodsLists = [];
						this.goodsLists = this.goodsLists.concat(curPageData);
						this.mescroll.endSuccess(curPageLen, hasNext);
					}else{
						this.mescroll.endErr();
					}
				}).catch(() => {
					this.mescroll.endErr();
				})
			},
		},
		watch: {
			sortConfig: {
				handler(val) {
					this.goodsLists = []
					this.mescroll.resetUpScroll()
				},
				deep: true
			}
		},
		onLoad() {
			this.handleSort = trottle(this.handleSort, 500, this);
		}

	}
</script>

<style lang="scss">
	page {
		padding: 0;
	}
	$goods-margin: 8rpx;

	.integral-mall {
		.header {
			padding: 22rpx 24rpx;
		}

		.main {
			.sort-bar {
				height: 80rpx;

				.sort-bar-item {
					height: 100%;
				}

				.arrow-icon {
					transform: scale(0.4);
				}
			}

			.goods-lists {
				padding: 20rpx 20rpx 0;
				margin: -$goods-margin;
				display: flex;
				flex-wrap: wrap;
				.goods-item {

					width: 50%;

					.goods-item-info {
						margin: $goods-margin;
						border-radius: 14rpx;
						background: #fff;
						overflow: hidden;

						.goods-image {
							flex: none;
							position: relative;
							height: 0;
							padding-top: 100%;

							.image-wrap {
								position: absolute;
								top: 0;
								left: 0;
								right: 0;
								bottom: 0;
							}
						}

						.goods-info {
							padding: 14rpx;

							.goods-name {
								line-height: 40rpx;
								height: 80rpx;
							}
						}
					}
				}

				&--one {
					.goods-item {
						width: 100%;

						.goods-item-info {
							display: flex;

							.goods-image {
								width: 200rpx;
								padding-top: 200rpx;
							}

							.goods-info {
								padding: 24rpx 20rpx;
							}
						}
					}
				}
			}
		}
	}
</style>

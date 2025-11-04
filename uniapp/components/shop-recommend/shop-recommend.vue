<template>
	<view class="shop-recommend" :class="type">
		<view class="flex row-between" style="padding: 26rpx 20rpx" v-if="title">
			<view class="bold xl">{{ title }}</view>
			<router-link :to="url" v-if="url">
				<view  class="sm">更多 <u-icon name="arrow-right" size="22"></u-icon>
				</view>
			</router-link>
		</view>
		<view>
			<swiper :style="'height:' + swiperH + 'rpx;'" @change="swiperChange">
				<swiper-item v-for="(items, index) in shopList" :key="index">
					<view class="shop-list flex flex-wrap">
						<router-link class="item-link" :to="{path: '/pages/store_index/store_index', query: {id: item.id}}"  v-for="(item, index2) in items" :key="index2" >
							<view class="flex-col col-center m-l-24">
								<view class="shop-item bg-white">
									<u-image width="100%" height="140rpx" mode="aspectFill" :src="item.background"></u-image>
									<view class="flex-col col-center" style="margin-top: -34rpx">
										<u-image width="68rpx" height="68rpx" border-radius="50%" :src="item.logo"></u-image>
										<view class="text flex-col col-center">
											<view class="line-1 name">{{item.name}}</view>
											<view class="br60 muted sale xxs m-t-10 line-1">共{{item.on_sales_count}}件商品</view>
										</view>
									</view>
								</view>
							</view>
						</router-link>
					</view>
				</swiper-item>
			</swiper>
			<view class="dots flex row-center m-t-20" v-if="shopList.length > 1">
				<view v-for="(item, index) in shopList" :key="index"
					:class="'dot ' + (index == currentSwiper ? 'active' : '')"></view>
			</view>
		</view>
	</view>
</template>

<script>
	import {arraySlice} from '@/utils/tools'
	export default {
		name: "shop-recommend",
		props: {
			type: {
				type: String,
				default: ''
			},
			title: {
				type: String,
				default: ''
			},
			url: {
				type: String,
				default: ''
			},
			list: {
				type: Array,
				default: () => ([])
			}
		},
		data() {
			return {
				swiperH: 0,
				currentSwiper: 0,
				shopList: []
			};
		},
		methods: {
			swiperChange(e) {
				this.currentSwiper = e.detail.current
			}
		},
		watch: {
			list: {
				handler(val) {
					if (val.length <= 3) {
						this.swiperH = 320
					} else {
						this.swiperH = 606
					}
					this.shopList = arraySlice(val, [], 6)
				},
				immediate: true,
			}
		}
	}
</script>

<style lang="scss">
	.nearby-shops {
        background-image: url(../../static/images/index_community_bg.png);
	}
	.shop-recommends {		
		background: url(../../static/images/index_shop_bg.png) no-repeat;
	}
	.shop-recommend {
		background-size: cover;
		background-repeat: no-repeat;
		.shop-list {
			.item-link {
				width: 33.3%;
			}
			.shop-item {
				width: 220rpx;
				border-radius: 16rpx;
				margin-bottom: 16rpx;
				overflow: hidden;

				// &:not(:nth-of-type(3n)) {
				// 	margin-right: 15rpx;
				// }

				.text {
					padding: 8rpx 8rpx 19rpx;
					text-align: center;

					.name {
						width: 200rpx;
					}

					.sale {
						background-color: #F4F4F4;
						padding: 4rpx 16rpx;
						display: inline-block;
					}
				}
			}

		}

		.dots {

			.dot {
				width: 12rpx;
				height: 12rpx;
				border-radius: 50%;
				margin-right: 10rpx;
				background-color: #E5E5E5;

				&.active {
					width: 12rpx;
					background-color: $-color-primary;
				}
			}

		}
	}
</style>

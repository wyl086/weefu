<template>
	<view class="p-t-20"  v-if="navList.length">
		<view class="cate-nav bg-white">
			<swiper :style="'height:' + navSwiperH + 'rpx;'" @change="swiperChange">
				<swiper-item v-for="(items, index) in navList" :key="index">
					<view class="nav-list flex flex-wrap">
						<router-link v-for="(item, index2) in items" :key="index2" :to="{path: '/pages/goods_search/goods_search', query: {
							id: item.id,
							name: item.name,
							type: 1
						}}"
							class="nav-item m-t-30">
							<view class="flex-col col-center">
								<u-image width="82rpx" height="82rpx" :src="item.image" border-radius="50%"></u-image>
								<view style="width: 90%;" class="m-t-14 xs line-1 text-center">{{item.name}}</view>
							</view>
						</router-link>
					</view>
				</swiper-item>
			</swiper>
			<view class="dots" v-if="navList.length > 1">
				<view v-for="(item, index) in navList" :key="index"
					:class="'dot ' + (index == currentSwiper ? 'active' : '')"></view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		arraySlice
	} from '@/utils/tools';
	export default {
		name: "cate-nav",
		props: {
			list: {
				type: Array,
			}
		},
		data() {
			return {
				navSwiperH: 0,
				navList: [],
				currentSwiper: 0
			};
		},
		watch: {
			list: {
				handler(val) {
					if (val.length <= 5) {
						this.navSwiperH = 200
					} else {
						this.navSwiperH = 374
					}
					this.navList = arraySlice(val)
				},
				immediate: true,
			}
		},
		methods: {
			swiperChange(e) {
				this.currentSwiper = e.detail.current
			}
		}
	}
</script>

<style lang="scss" scoped>
	.cate-nav {
		position: relative;
		border-radius: 20rpx;

		.nav-item {
			width: 20%;
		}

		.dots {
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
			bottom: 20rpx;
			display: flex;

			.dot {
				width: 10rpx;
				height: 6rpx;
				border-radius: 6rpx;
				margin-right: 10rpx;
				background-color: rgba(255, 44, 60, 0.4);

				&.active {
					width: 20rpx;
					background-color: $-color-primary;
				}
			}

		}

	}
</style>

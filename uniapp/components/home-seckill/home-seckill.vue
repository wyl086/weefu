<template>
	<view class="home-seckill bg-white">
		<view class="seckill-hd flex row-between">
			<view class="white xxl bold">超值秒杀</view>
			<view>
				<view class="white" v-show="currentStatus == 0">未开始</view>
				<view class="white" v-show="currentStatus == 2">已结束</view>
				<view class="white xs flex" v-if="currentTime > 0" v-show="currentStatus==1">
					<view class="m-r-10">距本场结束</view>
					<u-count-down :timestamp="currentTime" @end="refresh" :color="colorConfig.primary"
						bg-color="#fff" separator-color="#fff" font-size="24"
						height="36" separator-size="26"></u-count-down>
				</view>
			</view>
		</view>
		<scroll-view style="height: 120rpx; white-space: nowrap;" :scroll-into-view="'item-' + (active - 2)"
			scroll-x="true" scroll-with-animation="true">
			<view v-for="(item, index) in list" :key="index" :id="'item-' + index"
				class="time-item flex-col row-center col-center" :class="{active: index == active}"
				@tap="exchangeTime(index)">
				<view :class="'xl bold time'">{{ item.start_time }}</view>
				<view :class="'sm br60 state ' + ( item.status === 2 ? 'muted': '' )">
					{{ item.tips }}
				</view>
			</view>
		</scroll-view>
		<view v-if="goodsList.length" class="goods-seckill">
			<router-link v-for="(item, index) in goodsList" :key="index"
				:to="{path: '/pages/goods_details/goods_details', query: {id: item.goods_id || item.id}}">
				<view class="item bg-white flex">
					<view class="goods-img">
						<u-image width="214rpx" height="214rpx" :border-radius="10" :src="item.goods_image"></u-image>
					</view>
					<view class="goods-info m-l-20 flex-1">
						<view class="goods-name line-2">{{item.goods_name}}</view>
						<view class="price m-t-20 flex row-between">
							<view class="muted xxs">原价<price-format :first-size="22" :second-size="22"
									:subscript-size="22" :price="item.goods_min_price"></price-format>
							</view>
							<view class="muted xxs">{{item.seckill_total}}人购买</view>
						</view>
						<view class="btn flex row-between m-t-20">
							<price-format :color="colorConfig.primary" class="mr10" :first-size="38" :second-size="26"
								:subscript-size="26" :price="item.seckill_price" :weight="500"></price-format>
							<button :class="'br60 white ' + (currentStatus == 2? ' bg-gray' : currentStatus == 1
									? 'bg-primary' : 'border-btn' )" size="xs">
								{{currentStatus == 2? '已结束': currentStatus == 1 ? '立即抢购' : '未开始'}}</button>
						</view>
					</view>
				</view>
			</router-link>
		</view>
		<router-link :to="'/bundle/pages/goods_seckill/goods_seckill'">
			<view class="xs flex row-center more">查看更多 <u-icon name="arrow-right"></u-icon>
			</view>
		</router-link>
	</view>
</template>

<script>
	export default {
		name: "home-seckill",
		props: {
			list: {
				type: Array,
				default: () => ([])
			}
		},
		data() {
			return {
				active: -1,
				goodsList: []
			};
		},
		methods: {
			exchangeTime(index) {
				this.active = index
				this.goodsList = this.list[index].goods
			},
			refresh() {
				uni.$emit('refreshhome')
			}
		},
		watch: {
			list: {
				handler(val) {
					// 抢购中
					let index = val.findIndex(item => item.status == 1);
					if (index == -1) {
						// 未开始
						index = val.findIndex(item => item.status == 0);
					}
					if (index == -1) {
						// 全部结束选中最后一个
						index = val.length - 1
					}
					this.active = index
					this.goodsList = val[index].goods
				},
				immediate: true,
			}
		},
		computed: {
			currentStatus() {
				const {
					active,
					list
				} = this
				return list[active] && list[active].status
			},
			currentTime() {
				const {
					active,
					list
				} = this
				if(list[active]) {
					return list[active].end_time_int - Date.now()/1000
				}
				return 0
			}
 		}

	}
</script>

<style lang="scss">
	.home-seckill {
		border-radius: 14rpx;
		overflow: hidden;
		.seckill-hd {
			padding: 0 20rpx;
			height: 100rpx;
			background: url(../../static/images/index_bg_seckill.png) no-repeat;
			background-size: 100%;
		}

		.time-item {
			display: inline-flex;
			width: 160rpx;
			height: 100%;

			&.active {
				.time {
					color: $-color-primary;
				}

				.state {
					color: $-color-white;
					background-color: $-color-primary;
				}
			}

			.state {
				padding: 0 10rpx;
			}
		}

		.goods-seckill .item {
			padding: 20rpx;
			.border-btn {
				border: 1px solid $-color-primary;
				color: $-color-primary;
			}
		}

		.more {
			height: 80rpx;
			border-top: $-solid-border;
		}
	}
</style>

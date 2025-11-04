<template>
	<mescroll-body ref="mescrollRef" @init="mescrollInit" :up="upOption" @down="downCallback" @up="upCallback">
		<view class="goods-seckill">
			<view class="banner">
				<ad-swipers :pid="20" height="340rpx"></ad-swipers>
			</view>
			<view class="time-list">
				<scroll-view style="height: 120rpx; white-space: nowrap;" :scroll-into-view="'item-' + (active - 2)"
					scroll-x="true" scroll-with-animation="true">
					<view v-for="(item, index) in seckillTime" :key="index" :id="'item-' + index"
						class="time-item flex-col row-center col-center" :class="{active: index == active}"
						@tap="exchangeTime(index)">
						<view :class="'xl bold time'">{{ item.start_time }}</view>
						<view :class="'sm br60 state ' + ( item.status === 2 ? 'muted': '' )">
							{{ item.tips }}
						</view>
					</view>
				</scroll-view>
			</view>
			<view class="goods-list">
				<router-link v-for="(item, index) in seckillGoods" :key="index"
					:to="{path: '/pages/goods_details/goods_details', query: {id: item.goods_id}}">
					<view class="goods-item flex bg-white">
						<u-image width="180rpx" height="180rpx" border-radius="10rpx" :src="item.goods_image" />
						<view class="goods-info m-l-20">
							<view style="width: 490rpx" class="goods-name line-2 m-b-10">{{item.goods_name}}</view>
							<label class="sale-info xs primary br60">
								已抢{{item.seckill_total}}件
							</label>
							<view class="info-footer flex row-between m-t-5">
								<view class="price">
									<price-format class="m-r-10" :price="item.seckill_price"
										:color="colorConfig.primary" :first-ize="34" :second-ize="26"
										:subscript-ize="26" />
									<price-format class="line-through" :price="item.goods_min_price"
										:color="colorConfig.muted" :first-ize="24" :second-ize="24"
										:subscript-ize="24" />
								</view>
								<button :class="'br60 white ' + (currentStatus == 2? ' bg-gray' : currentStatus == 1
									? 'primary-btn' : 'border-btn' )" size="sm">
									{{currentStatus == 2? '已结束': currentStatus == 1 ? '立即抢购' : '未开始'}}</button>
							</view>
						</view>
					</view>
				</router-link>
			</view>
		</view>
	</mescroll-body>
</template>

<script>
	import {
		getSeckillTime,
		getSeckillGoods
	} from "@/api/activity";
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins";
	export default {
		mixins: [MescrollMixin],
		data() {
			return {
				active: 0,
				upOption: {
					auto: false,
					empty: {
						use: true,
						icon: '/static/images/goods_null.png',
						tip: "暂无秒杀商品～",
					},
				},
				seckillTime: [],
				seckillGoods: []

			};
		},
		methods: {
			async downCallback(page) {
				this.seckillGoods = []
				await this.getSeckillTimeFun()
				this.mescroll.resetUpScroll();
			},
			upCallback(page) {
				let pageNum = page.num;
				let pageSize = page.size;
				const {seckillTime, active} = this
				if(!seckillTime.length) return this.mescroll.endSuccess(0,false)
				let id =  seckillTime[active].id
				getSeckillGoods({
					page_no: pageNum,
					page_size: pageSize,
					seckill_id:id
				}).then(res => {
					let curPageData = res.data.lists;
					let hasNext = !!res.data.more;
					let curPageLen = curPageData.length;
					if (pageNum == 1) this.seckillGoods = [];
					this.seckillGoods = this.seckillGoods.concat(curPageData);
					this.mescroll.endSuccess(curPageLen, hasNext);
				}).catch(() => {
					this.mescroll.endErr()
				})
			},
			// 获取秒杀时间段
			getSeckillTimeFun() {
				return new Promise((resolve) => {
					getSeckillTime().then(({code, data}) => {
						if (code == 1) {
							// 抢购中
							let index = data.findIndex(item => item.status == 1);
							if (index == -1) {
								// 未开始
								index = data.findIndex(item => item.status == 0);
							}
							if(index == -1) {
								// 全部结束选中最后一个
								index = data.length - 1
							}
							this.seckillTime = data;
							this.$nextTick(function(){
								this.active = index
								resolve()
							})
						}
					})
				})
				
			},


			// 查看其他时间段
			exchangeTime(index) {
				this.active = index
				this.seckillGoods = []
				this.mescroll.resetUpScroll();
			},
		},
		computed: {
			currentStatus() {
				const {active, seckillTime} = this
				return seckillTime[active] && seckillTime[active].status
			}
		}
	};
</script>
<style lang="scss">
	.bg-gray {
		background-color: #CCCCCC !important;
	}

	.goods-seckill {

		.time-list {
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
		}

		.endtime-box {
			height: 100rpx;

			.line {
				width: 100rpx;
				height: 2rpx;
				background-color: #CCC;
			}
		}

		.goods-list {
			.goods-item {
				padding: 30rpx;

				.goods-info {
					flex: 1;
					width: 470rpx;

					.sale-info {
						padding: 4rpx 16rpx;
						background-color: #FFE9EB;
					}

					.info-footer {
						.btn {
							padding: 0 30rpx;
						}
					}
				}
			}
		}
	}

	.primary-btn {
		padding: 0 30rpx;
		background: linear-gradient(270deg,
				rgba(255, 44, 60, 1) 0%,
				rgba(249, 95, 47, 1) 100%);
	}

	.border-btn {
		padding: 0 30rpx;
		border: 1px solid $-color-primary;
		color: $-color-primary;
	}
</style>

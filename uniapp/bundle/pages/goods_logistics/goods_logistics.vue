


<template>
	<view>
		<view class="goods-logistics p-t-20">
			<view class="header flex bg-white">
				<view class="goods m-r-20">
					<image class="goods-img" :src="order.image"></image>
					<view class="count xs white br60">共{{order.count}}件商品</view>
				</view>
				<view class="info sm">
					<view class="bold lg">{{order.tips}}</view>
					<view class="black m-t-10 m-b-10">物流公司：{{order.shipping_name}}</view>
					<view class="row">
						<text class="black">快递单号：{{order.invoice_no}}</text>
						<text class="primary m-l-20" @tap="onCopy">复制</text>
					</view>
				</view>
			</view>
			<view class="main m-t-20 bg-white column">
				<!-- 物流时间轴 -->
				<view class="express">
					<!-- 顶部收货地址 -->
					<view class="express-address row" v-if="take.contacts">
						<view class="express-left flex-col col-center">
							<image class="express-icon" :src="finish.tips ? '/bundle/static/logistics_address.png' : '/bundle/static/logistics_address_gray.png'"></image>
							<view class="express-line"></view>
						</view>
						<view class="express-right">
							<view class="name bold mb10 sm">{{take.contacts}} {{take.mobile}}</view>
							<view class="address sm lighter line2">{{take.address}}</view>
						</view>
					</view>
					<view class="express-item row" v-if="finish.tips">
						<view class="express-left flex-col col-center">
							<image class="express-icon" src="/bundle/static/logistics_success.png"></image>
							<view class="express-line"></view>
						</view>
						<view class="express-right">
							<view class="title bold sm">{{finish.title}}</view>
							<view class="dec sm">{{finish.tips}}</view>
							<view class="time xs muted">{{finish.time}}</view>
						</view>
					</view>
					<view class="express-item row" v-if="delivery.traces && delivery.traces.length">
						<view class="express-left flex-col col-center">
							<image class="express-icon" src="/bundle/static/logistics_transit.png"></image>
							<view class="express-line"></view>
						</view>
						<view class="express-right muted">
							<view class="title bold sm ">{{delivery.title}}</view>
							<view class="xs" v-if="delivery.traces[0][0]">
								{{delivery.traces[0][0]}}
							</view>
							<view class="xs" v-if="delivery.traces[0][1]">
								{{delivery.traces[0][1]}}
							</view>
							<view class="xs" v-if="delivery.traces[0][2]">
								{{delivery.traces[0][2]}}
							</view>
						</view>
					</view>
					<block v-for="(item, index) in delivery.traces" :key="index">
						<view class="express-item row" v-if="index >= 1">
							<view class="express-left flex-col col-center">
								<view class="express-doted"></view>
								<view class="express-line"></view>
							</view>
							<view class="express-right muted">
								<view class="sm" v-if="item[0]">{{item[0]}}</view>
								<view class="sm" v-if="item[1]">{{item[1]}}</view>
								<view class="sm" v-if="item[2]">{{item[2]}}</view>
							</view>
						</view>
					</block>
					<view class="express-item row" v-if="shipment.tips">
						<view class="express-left flex-col col-center">
							<image class="express-icon" src="/bundle/static/logistics_delivered.png"></image>
							<view class="express-line"></view>
						</view>
						<view class="express-right muted">
							<view class="title bold sm">{{shipment.title}}</view>
							<view class="dec xs">{{shipment.tips}}</view>
							<view class="time xs muted">{{shipment.time}}</view>
						</view>
					</view>
					<view class="express-item row" v-if="buy.tips">
						<view class="express-left flex-col col-center">
							<image class="express-icon" src="/bundle/static/logistics_pay.png"></image>
							<view class="express-line"></view>
						</view>
						<view class="express-right muted">
							<view class="title bold sm">{{buy.title}}</view>
							<view class="dec xs">{{buy.tips}}</view>
							<view class="time xs muted">{{buy.time}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<recommend></recommend>
		<loading-view v-if="isFirstLoading"></loading-view>
	</view>
</template>

<script>
	import {
		orderTraces
	} from '@/api/order';
	import { getIntegralOrderTraces } from '@/api/activity'
	import {copy} from '@/utils/tools'
	export default {
		data() {
			return {
				shipment: {},
				buy: {},
				delivery: {},
				finish: {},
				order: {},
				take: {},
				isFirstLoading: true
			};
		},
		onLoad () {
			this.id = this.$Route.query.id
			this.type = this.$Route.query.type
			this.orderTracesFun();
		},

		methods: {
			async orderTracesFun() {
				const {
					code,
					data: {
						shipment,
						buy,
						delivery,
						finish,
						order,
						take
					}
				} =  this.type == 'integral' ? await getIntegralOrderTraces(this.id) : await orderTraces(this.id)
				if (code == 1) {
					this.shipment = shipment
					this.buy = buy
					this.delivery = delivery
					this.finish = finish
					this.order = order
					this.take = take
					this.isFirstLoading = false
				} else {
					setTimeout(() => uni.navigateBack(), 1000);
				}
			},

			onCopy() {
				copy(this.order.invoice_no)
			}

		}
	};
</script>
<style lang="scss">
	.goods-logistics {
		padding-top: 20rpx;
		.header {
			padding: 20rpx;
			.goods-img {
				width: 160rpx;
				height: 160rpx;
				flex: none;
				border-radius: 10rpx;
			}
		}
		.goods {
			position: relative;
			.count {
				position: absolute;
				bottom: 0;
				width: 100%;
				text-align: center;
				background-color: rgba(0, 0, 0, 0.6);
				padding: 4rpx 0;
			}
		}
		.express {
			width: 700rpx;
			padding-top: 30rpx;
			padding-bottom: 100rpx;
			margin: 0 auto;
			border-radius: 10rpx;
		}
		.express-address,
		.express-item {
			align-items: flex-start;
			position: relative;
			padding: 20rpx 0;
		}
		.express-left {
			margin-top: 10rpx;
			margin-right: 24rpx;
			height: 100%;
			position: absolute;
			width: 40rpx;
			flex: none;
			.express-icon {
				width: 40rpx;
				height: 40rpx;
			}
			.express-line {
				flex: 1;
				border-left: 1px dotted #E5E5E5;
			}
			.express-doted {
				width: 16rpx;
				height: 16rpx;
				border-radius: 50%;
				background-color: #E5E5E5;
			}

		}
		.express-right {
			padding-left: 60rpx;
			& .title,
			& .dec {
				margin-bottom: 5rpx;
			}
		}
		.express-item:last-of-type .express-left .express-line {
			border: none;
		}
	}






</style>
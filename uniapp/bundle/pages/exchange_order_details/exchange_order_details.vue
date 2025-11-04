<template>
	<view>
		<view class="order-details">
			<view class="header-bg"></view>
			<view class="main">
				<view class="header">
					<view class="item" v-if="orderDetail.order_status == 0">
						<view class="white lg m-b-10">等待买家付款</view>
					</view>
					<view class="item" v-if="orderDetail.order_status == 1">
						<view class="white lg m-b-10">待发货</view>
						<view class="white sm">您的商品正在打包中，请耐心等待…</view>
					</view>
					<view class="item" v-if="orderDetail.order_status == 2">
						<view class="white lg m-b-10">待收货</view>
						<view class="white sm">您的商品正在路中，请耐心等待…</view>
					</view>
					<view class="item" v-if="orderDetail.order_status == 3">
						<view class="white lg m-b-10">已完成</view>
						<view class="white sm">商品已签收，期待再次购买！</view>
					</view>
					<view class="item" v-if="orderDetail.order_status == 4">
						<view class="white lg m-b-10">订单已关闭</view>
						<!-- <view class="white sm">原因：超时未支付</view> -->
					</view>
				</view>
				<view class="address-wrap flex contain">
					<image class="icon-md m-r-20" src="/static/images/icon_address.png"></image>
					<view class="address">
						<view>
							<text class="name md m-r-10">{{orderDetail.consignee}}</text>
							<text class="phone md">{{orderDetail.mobile}}</text>
							<view class="area sm m-t-10 lighter">{{orderDetail.delivery_address}}</view>
						</view>
					</view>
				</view>



				<view class="goods contain">
					<view class="flex">
						<u-image :src="orderDetail.goods.image" border-radius="10" width="160" height="160"></u-image>
						<view class="goods-info flex-1 m-l-20">
							<view class="goods-name line-2">{{ orderDetail.goods.name }}</view>
							<view class="flex row-between">
								<view class="goods-price primary m-t-10">
									<price-format :show-subscript="false" :first-size="36" :second-size="24"
										:price="orderDetail.goods.need_integral" />
									<text class="xs">积分</text>
									<block v-if="orderDetail.goods.exchange_way === 2">
										<text>+</text>
										<price-format :show-subscript="false" :first-size="36" :second-size="24"
											:price="orderDetail.goods.need_money" />
										<text class="xs">元</text>
									</block>
								</view>
								<view class="lighter">×{{orderDetail.total_num}}</view>
							</view>
						</view>
					</view>
				</view>
				<view class="price contain">
					<view class="flex row-between">
						<view>商品金额</view>
						<view class="black">
							<price-format :show-subscript="false" :price="orderDetail.order_integral" />
							<text class="xs">积分</text>
							<block v-if="orderDetail.goods_price > 0">
								<text>+</text>
								<price-format :show-subscript="false" :price="orderDetail.goods_price" />
								<text class="xs">元</text>
							</block>
						</view>
					</view>
					<view class="flex row-between" v-if="orderDetail.shipping_price">
						<view>运费</view>
						<view class="black">+
							<price-format :price="orderDetail.shipping_price"></price-format>
						</view>
					</view>
					<view class="flex row-right">
						<view class="lighter">实付金额：</view>
						<view class="primary">
							<price-format :show-subscript="false" :first-size="36" :second-size="24"
								:price="orderDetail.order_integral" />
							<text class="xs">积分</text>
							<block v-if="orderDetail.order_amount > 0">
								<text>+</text>
								<price-format :show-subscript="false" :first-size="36" :second-size="24"
									:price="orderDetail.order_amount" />
								<text class="xs">元</text>
							</block>
						</view>
					</view>
				</view>
				<view class="order-info contain">
					<view class="item flex" style="align-items: flex-start;">
						<view class="title">买家留言</view>
						<view class="black">{{orderDetail.user_remark || '无'}}</view>
					</view>
				</view>
				<view class="order-info contain">
					<view class="item flex">
						<view class="title">订单编号</view>
						<view class="black">{{orderDetail.order_sn}}</view>
					</view>

					<view class="item flex">
						<view class="title">支付方式</view>
						<view class="black">{{orderDetail.pay_way}}</view>
					</view>
					<view class="item flex">
						<view class="title">下单时间</view>
						<view class="black">{{orderDetail.create_time}}</view>
					</view>
					<view v-if="orderDetail.pay_time" class="item flex">
						<view class="title">付款时间</view>
						<view class="black">{{orderDetail.pay_time}}</view>
					</view>
					<view v-if="orderDetail.shipping_time" class="item flex">
						<view class="title">发货时间</view>
						<view class="black">{{orderDetail.shipping_time }}</view>
					</view>
					<view v-if="orderDetail.confirm_take_time" class="item flex">
						<view class="title">成交时间</view>
						<view class="black">{{orderDetail.confirm_take_time }}</view>
					</view>
					<view v-if="orderDetail.cancel_time" class="item flex">
						<view class="title">关闭时间</view>
						<view class="black">{{orderDetail.cancel_time}}</view>
					</view>

				</view>
				<view class="footer bg-white flex fixed"
					v-if="orderDetail.btns.cancel_btn || orderDetail.btns.delivery_btn || orderDetail.btns.confirm_btn || orderDetail.btns.del_btn || orderDetail.btns.pay_btn">
					<view class="flex-1"></view>
					<view v-if="orderDetail.btns.cancel_btn">
						<button size="sm" class="plain br60" hover-class="none" @tap="handleOrder(0)">取消订单</button>
					</view>
					<router-link
						v-if="orderDetail.btns.delivery_btn"
						:to="{path: '/bundle/pages/goods_logistics/goods_logistics', query: {id: orderDetail.id, type: 'integral'}}">
						<button size="sm" class="plain br60" hover-class="none">查看物流</button>
					</router-link>
					<view v-if="orderDetail.btns.confirm_btn" class="m-l-20">
						<button size="sm" class="plain br60 primary red" hover-class="none"
							@tap.stop="handleOrder(2)">确认收货</button>
					</view>
					<view v-if="orderDetail.btns.del_btn">
						<button size="sm" class="plain br60" hover-class="none" @tap="handleOrder(1)">删除订单</button>
					</view>
					<view class="m-l-20" v-if="orderDetail.btns.pay_btn">
						<button size="sm" class="bg-primary br60 white" @tap="payNow">立即付款</button>
					</view>
				</view>
			</view>
		</view>
		<loading-view v-if="isFirstLoading"></loading-view>
		<order-dialog ref="orderDialog" :orderId="orderDetail.id" :type="type" @confirm="confirmDialog"></order-dialog>
		<float-tab></float-tab>
	</view>
</template>

<script>
	import {
		getIntegralOrderDetail,
		cancelIntegralOrder,
		delIntegralOrder,
		confirmIntegralOrder
	} from '@/api/activity';

	export default {
		data() {
			return {
				orderDetail: {
					goods: {},
					btns: {}
				},
				team: {},
				isFirstLoading: true,
				type: 0,
				showCancel: "",
				showLoading: false
			};
		},

		onLoad: function(options) {
			const {
				id
			} = this.$Route.query;
			this.id = id;
			this.getOrderDetailFun();
			uni.$on('payment', this.payCallback)
		},
		onUnload() {
			uni.$off('payment', this.payCallback)
		},
		methods: {
			payCallback(params) {
				setTimeout(() => {
					if (params.result) {
						this.$toast({
							title: "支付成功"
						})
						this.getOrderDetailFun()
					} else {
						this.$toast({
							title: "支付失败"
						})
					}
				}, 500)
			},
			async confirmDialog() {
				const {
					type,
					id
				} = this
				let res = null
				switch (type) {
					case 0:
						res = await cancelIntegralOrder(id);
						break;

					case 1:
						res = await delIntegralOrder(id);
						break;

					case 2:
						res = await confirmIntegralOrder(id);
						break;
				}
				if (res.code == 1) {
					uni.$emit("refreshorder")

					if ([0, 2].includes(type)) {
						this.getOrderDetailFun();
					} else if (type == 1) {
						setTimeout(() => {
							uni.navigateBack()
						}, 2000)
					}
				}

			},
			dialogOpen() {
				this.$refs.orderDialog.open()
			},

			handleOrder(type) {
				this.type = type
				this.$nextTick(() => {
					this.dialogOpen();
				});
			},
			payNow() {
				this.$Router.push({
					path: '/pages/payment/payment',
					query: {
						from: 'integral',
						order_id: this.id
					}
				})
			},

			getOrderDetailFun() {
				getIntegralOrderDetail(this.id).then(res => {
					if (res.code == 1) {
						this.orderDetail = res.data
						this.$nextTick(() => {
							this.isFirstLoading = false
						});
					} else {
						setTimeout(() => uni.navigateBack(), 1500)
					}
				});
			},
		},
		computed: {

		}
	};
</script>
<style lang="scss">
	.order-details {
		position: relative;
		padding-bottom: calc(120rpx + env(safe-area-inset-bottom));

		.contain {
			margin: 0 20rpx 20rpx;
			border-radius: 14rpx;
			background-color: #fff;
		}

		.header-bg {
			position: absolute;
			top: 0;
			width: 100%;
			height: 200rpx;
			background-color: $-color-primary;
			z-index: 0;

		}

		.header {
			padding: 24rpx 40rpx;
		}

		.main {
			position: relative;
			z-index: 1;
		}

		.goods {
			padding: 30rpx 24rpx;

			.goods-name {
				line-height: 40rpx;
				height: 80rpx;
			}
		}

		.address-wrap {
			height: 164rpx;
			padding: 0 24rpx;
		}

		.order-info {
			padding: 12rpx 0;

			.item {
				padding: 12rpx 24rpx;

				.title {
					width: 180rpx;
					flex: none;
				}
			}
		}

		.price {
			padding: 24rpx 0;

			&>view {
				height: 60rpx;
				padding: 0 24rpx;
			}
		}

		.footer {
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			height: 100rpx;
			padding: 0 24rpx;
			box-sizing: content-box;
			padding-bottom: env(safe-area-inset-bottom);

			.plain {
				border: 1px solid #BBBBBB;

				&.red {
					border: 1px solid $-color-primary;
				}
			}
		}

	}
</style>

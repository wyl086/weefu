<template>
	<view class="integral-settlement">
		<view class="settlement-main">
			<router-link to="/bundle/pages/user_address/user_address?type=1">
				<view class="address flex contain">
					<image class="icon-md m-r-20" src="/static/images/icon_address.png"></image>
					<view class="flex-1 m-r-20">
						<view class="black md" v-if="!address.contact">设置收货地址</view>
						<view v-else>
							<text class="name md m-r-10">{{address.contact}}</text>
							<text class="phone md">{{address.telephone}}</text>
							<view class="area sm m-t-10 lighter">
								{{address.province}} {{address.city}} {{address.district}} {{address.address}}
							</view>
						</view>
					</view>
					<u-icon name="arrow-right"></u-icon>
				</view>
			</router-link>
			<view class="order-goods contain">
				<view class="flex goods">
					<u-image :src="goods.image" border-radius="10" width="160" height="160"></u-image>
					<view class="goods-info flex-1 m-l-20">
						<view class="goods-name line-2">{{ goods.name }}</view>
						<view class="flex row-between">
							<view class="goods-price primary m-t-10">
								<price-format :show-subscript="false" :first-size="36" :second-size="24"
									:price="goods.need_integral" />
								<text class="xs">积分</text>
								<block v-if="goods.exchange_way === 2">
									<text>+</text>
									<price-format :show-subscript="false" :first-size="36" :second-size="24"
										:price="goods.need_money" />
									<text class="xs">元</text>
								</block>
							</view>
							<view class="lighter">×{{orderInfo.total_num}}</view>
						</view>
					</view>
				</view>
				<view class="buyer-message">
					<u-field v-model="remark" type="textarea" :border-bottom="false" :auto-height="false" label="买家留言"
						placeholder="请添加备注（150字以内）" maxlength="150" :field-style="{ height: '240rpx' }">
					</u-field>
				</view>
			</view>
			<view class="total-goods contain">
				<view class="flex row-between ">
					<view>商品总额</view>
					<view class="primary">
						<price-format :show-subscript="false" :first-size="36" :second-size="24"
							:price="orderInfo.order_integral" />
						<text class="xs">积分</text>
						<block v-if="orderInfo.exchange_way === 2">
							<text>+</text>
							<price-format :show-subscript="false" :first-size="36" :second-size="24"
								:price="orderInfo.goods_price" />
							<text class="xs">元</text>
						</block>
					</view>
				</view>
				<view class="flex row-between m-t-20">
					<view>运费</view>
					<view>
						<price-format :first-size="28" :subscript-size="24" :second-size="24"
							:price="orderInfo.shipping_price" />
					</view>
				</view>
			</view>

		</view>
		<view class="settlement-footer bg-white flex row-between">
			<view class="all-price lg flex">
				<text>合计：</text>
				<view class="primary">
					<price-format :show-subscript="false" :first-size="36" :second-size="24"
						:price="orderInfo.order_integral" />
					<text class="xs">积分</text>
					<block v-if="orderInfo.order_amount > 0">
						<text>+</text>
						<price-format :show-subscript="false" :first-size="36" :second-size="24"
							:price="orderInfo.order_amount" />
						<text class="xs">元</text>
					</block>
				</view>
			</view>
			<button type="primary" class="br60" size="md" hover-class="none" @tap="orderBuy">
				提交订单
			</button>
		</view>
		<loading-view v-show="showLoading" :background-color="hasBg ? '#fff' : ''"></loading-view>
	</view>
</template>

<script>
	import {
		integralSettlement,
		integralSubmitOrder
	} from '@/api/activity'
	export default {
		data() {
			return {
				showLoading: true,
				hasBg: true,
				address: {},
				goods: {},
				orderInfo: {},
				addressId: '',
				remark: ''
			}
		},
		methods: {
			// 订单信息
			getOrderInfo() {
				integralSettlement({
					id: this.goodsId,
					num: this.count,
					address_id: this.addressId
				}).then(res => {
					if (res.code == 1) {
						const {
							address,
							goods
						} = res.data
						this.address = address
						this.orderInfo = res.data
						this.goods = goods
					}
				}).finally(() => {
					this.showLoading = false
				})
			},
			// 提交订单
			orderBuy() {
				this.hasBg = false
				this.showLoading = true
				const address_id = this.addressId || this.address.id
				integralSubmitOrder({
					id: this.goodsId,
					num: this.count,
					address_id,
					user_remark: this.remark
				}).then(res => {
					if (res.code == 1) {
						const {
							type,
							order_id
						} = res.data
						if(!this.orderInfo.need_pay) {
							this.$Router.replace({
								path: '/pages/pay_result/pay_result',
								query: {
									id: order_id,
									from: type
								}
							})
							return 
						}
						uni.$on('payment', params => {
							setTimeout(() => {
								if (params.result) {
									this.$Router.replace({
										path: '/pages/pay_result/pay_result',
										query: {
											id: params.order_id,
											from: params.from
										}
									})
								}else {
									this.$Router.replace({
										path: '/bundle/pages/exchange_order/exchange_order',
										query: {
											id: params.order_id,
											from: params.from
										}
									})
								}
							}, 1 * 1000)
						})
						this.$Router.push({
							path: '/pages/payment/payment',
							query: {
								order_id: order_id,
								from: type
							}
						})
					}
				}).finally(() => {
					setTimeout(() => {
						this.showLoading = false
					}, 200)
				})
			}
		},
		onLoad(options) {
			uni.$on("selectaddress", (e) => {
				this.addressId = e.id
			})
		},
		onUnload() {
			uni.$off("selectaddress")
			uni.$off("payment")
		},
		onShow() {
			const {
				count,
				id
			} = this.$Route.query

			this.goodsId = id
			this.count = count
			this.getOrderInfo()
		}
	}
</script>

<style lang="scss">
	.integral-settlement {
		overflow: hidden;
		padding-bottom: calc(120rpx + env(safe-area-inset-bottom));

		.contain {
			background-color: #fff;
			border-radius: 14rpx;
			margin: 20rpx 20rpx 0;
		}

		.settlement-main {
			.address {
				min-height: 164rpx;
				padding: 20rpx 24rpx;
			}

			.order-goods {
				.goods {
					padding: 30rpx 24rpx;
					border-bottom: $-solid-border;

					.goods-info {
						.goods-name {
							line-height: 40rpx;
							height: 80rpx;
						}
					}
				}

				.buyer-message {}
			}

			.total-goods {
				padding: 20rpx 24rpx;
			}
		}

		.settlement-footer {
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			height: 100rpx;
			padding: 0 30rpx;
			box-sizing: content-box;
			padding-bottom: env(safe-area-inset-bottom);
		}
	}
</style>

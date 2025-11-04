

<template>
	<mescroll-uni ref="mescrollRef" top="80rpx" @init="mescrollInit" @down="downCallback" @up="upCallback"
		:down="downOption" :up="upOption">
		<view class="order-list">
			<view v-for="(item, index) in orderList" :key="index" class="order-item bg-white m-t-20">
				<router-link :to="{path: '/bundle/pages/exchange_order_details/exchange_order_details', query: {id: item.id}}">
					<view class="order-header flex row-between">
						<view class="flex">
							<view class="m-r-10">
								{{ item.create_time }}
							</view>
						</view>
						<view class="primary">
							{{ item.order_status }}
						</view>
					</view>
					<view class="order-con">
						<view class="order-goods flex">
							<u-image :src="item.goods.image" border-radius="10" width="160" height="160"></u-image>
							<view class="goods-info flex-1 m-l-20">
								<view class="goods-name line-2">{{ item.goods.name }}</view>
								<view class="flex row-between">
									<view class="goods-price primary m-t-10">
										<price-format :show-subscript="false" :first-size="36" :second-size="24"
											:price="item.goods.need_integral" />
										<text class="xs">积分</text>
										<block v-if="item.goods.exchange_way === 2">
											<text>+</text>
											<price-format :show-subscript="false" :first-size="36" :second-size="24"
												:price="item.goods.need_money" />
											<text class="xs">元</text>
										</block>
									</view>
									<view class="lighter">×{{item.total_num}}</view>
								</view>
							</view>
						</view>
						<view class="all-price flex row-right">
							<text class="muted xs">共{{item.total_num}}件商品，实付款：</text>
							<view class="">
								<price-format :show-subscript="false" :first-size="36" :second-size="24"
									:price="item.order_integral" :weight="500" />
								<text class="xs">积分</text>
								<block v-if="item.order_amount > 0">
									<text>+</text>
									<price-format :show-subscript="false" :first-size="36" :second-size="24"
										:price="item.order_amount" :weight="500" />
									<text class="xs">元</text>
								</block>
							</view>
						</view>
					</view>
					<view class="order-footer flex row-right"
						v-if="item.btns.cancel_btn || item.btns.delivery_btn || item.btns.confirm_btn || item.btns.del_btn || item.btns.pay_btn">
						
						<view v-if="item.btns.cancel_btn">
							<button size="sm" class="plain br60 lighter" hover-class="none"
								@tap.stop="handleOrder(item.id, 0)">
								取消订单
							</button>
						</view>
						<view v-if="item.btns.delivery_btn" @tap.stop="">
							<router-link
								:to="{path: '/bundle/pages/goods_logistics/goods_logistics', query: {id: item.id, type: 'integral'}}">
								<button size="sm" class="btn plain br60 lighter" hover-class="none">查看物流</button>
							</router-link>
						</view>
						<view v-if="item.btns.del_btn">
							<button size="sm" class="btn plain br60 lighter" hover-class="none"
								@tap.stop="handleOrder(item.id, 1)">删除订单</button>
						</view>
						<view v-if="item.btns.pay_btn" class="m-l-20">
							<router-link
								:to="{path: '/pages/payment/payment', query: {from: 'integral', order_id: item.id}}">
							<button size="sm" class="btn bg-primary br60 white">
								立即付款
							</button>
							</router-link>
						</view>
						<view v-if="item.btns.confirm_btn" class="m-l-20">
							<button size="sm" class="btn plain br60 primary red" hover-class="none"
								@tap.stop="handleOrder(item.id, 2)">确认收货</button>
						</view>
					</view>
				</router-link>
			</view>
		</view>
		<order-dialog ref="orderDialog" :order-id="orderId" :type="type" @confirm="confirmDialog"></order-dialog>
	</mescroll-uni>
</template>


<script>
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins";
	import MescrollMoreItemMixin from "@/components/mescroll-uni/mixins/mescroll-more-item";
	import {
		getIntegralOrder,
		cancelIntegralOrder,
		delIntegralOrder,
		confirmIntegralOrder
	} from '@/api/activity';
	export default {
		mixins: [MescrollMixin, MescrollMoreItemMixin],
		data() {
			return {
				orderList: [],
				downOption: {
					auto: false // 不自动加载 (mixin已处理第一个tab触发downCallback)
				},
				upOption: {
					auto: false, // 不自动加载
					noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
					empty: {
						icon: '/static/images/order_null.png',
						tip: '暂无订单~', // 提示
						fixed: true
					}
				},
				showCancel: false,
				type: 0,
				orderId: "",
				showLoading: false
			};
		},
		props: {
			orderType: {
				type: [Number, String]
			}
		},
		created() {
			uni.$on("refreshorder", () => {
				this.refresh()
			})
			
			uni.$on('payment', params => {
				setTimeout(() => {
					console.log(params)
					if (params.result) {
						this.$toast({ title: "支付成功" })
						this.refresh()
					} else {
						this.$toast({ title: "支付失败" })
					}
				}, 500)
			})
		},
		destroyed() {
			uni.$off("payment")
			uni.$off("refreshorder")
		},
		methods: {
			async confirmDialog() {
				const { type, orderId } = this
				let res = null
				switch (type) {
					case 0:
						res = await cancelIntegralOrder(orderId);
						break;
				
					case 1:
						res = await delIntegralOrder(orderId);
						break;
				
					case 2:
						res = await confirmIntegralOrder(orderId);
						break;
				}
				
				if (res.code == 1) {
					this.refresh()
					this.$toast({
						title: res.msg
					});
				}
			},
			dialogOpen() {
				this.$refs.orderDialog.open()
			},
			refresh() {
				this.mescroll.resetUpScroll() 
			},
			handleOrder(id, type) {
				this.orderId = id
				this.type = type
				this.$nextTick(() => {
					this.dialogOpen();
				});
			},
			upCallback(page) {
				let pageNum = page.num; // 页码, 默认从1开始
				let pageSize = page.size; // 页长, 默认每页10条
				let {
					orderType,
				} = this;
				getIntegralOrder({
					page_size: pageSize,
					page_no: pageNum,
					type: orderType
				}).then(({
					data
				}) => {
					let curPageData = data.list;
					let curPageLen = curPageData.length;
					let hasNext = !!data.more;
					if (page.num == 1) this.orderList = [];
					this.orderList = this.orderList.concat(curPageData);
					this.mescroll.endSuccess(curPageLen, hasNext);
				})
			},
		},
		computed: {
			
		}
	};
</script>
<style lang="scss">
	.order-list {
		padding: 0 20rpx;
		overflow: hidden;

		.order-item {
			border-radius: 10rpx;

			.order-header {
				height: 80rpx;
				padding: 0 24rpx;
				border-bottom: 1px dotted #E5E5E5;
			}
			.order-goods {
				padding: 30rpx 24rpx;
				.goods-name {
					line-height: 40rpx;
					height: 80rpx;
				}
			}
			.all-price {
				text-align: right;
				padding: 0 24rpx 20rpx;
			}

			.order-footer {
				height: 100rpx;
				border-top: $-solid-border;
				padding: 0 24rpx;

				.plain {
					border: 1px solid #BBBBBB;

					&.red {
						border-color: $-color-primary;
					}

				}
			}
		}
	}
</style>

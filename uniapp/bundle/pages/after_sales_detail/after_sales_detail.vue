<template>
	<view>
		<view class="after-sales-detail">
			<view class="after-sales-header">
				<view class="after-sales-status white lg">
					{{afterSale.status_text}}
				</view>
			</view>
			<view class="return-address-contain flex bg-white m-t-20">
				<view class="address-title">退货地址：</view>
				<view class="sm address flex-1">{{afterSale.shop.address}}, {{afterSale.shop.contact}},
					{{afterSale.shop.mobile}}</view>
				<view class="xs copy-btn flex-none row-center" @tap="onCopy">复制</view>
			</view>
			<view class="goods-container bg-white m-t-20">
				<view class="m-l-20">
					<shop-title :shop="{name: afterSale.shop_name, id: afterSale.sid}"></shop-title>
				</view>
				<view class="goods-item flex">
					<view class="goods-img">
						<u-image width="180rpx" height="180rpx" border-radius="10rpx"
							:src="afterSale.order_goods.image"></u-image>
					</view>
					<view class="goods-info flex-1 m-l-24">
						<view class="line-2">{{afterSale.order_goods.goods_name}}</view>
						<view class="m-t-10 xs line-1 muted">{{afterSale.order_goods.spec_value}}</view>
						<view class="flex row-between m-t-20">
							<price-format :price="afterSale.order_goods.goods_price" :first-size="30" :second-size="30"
								:subscript-size="30" />
							<view>x{{afterSale.order_goods.goods_num}}</view>
						</view>
					</view>
				</view>
			</view>
			<view class="return-goods-container bg-white m-t-20">
				<view class="return-goods-item flex sm">
					<view class="return-title">退款方式：</view>
					<view class="return-explain">{{afterSale.refund_type_text}}</view>
				</view>
				<view class="return-goods-item flex sm m-t-20">
					<view class="return-title">退款原因：</view>
					<view class="return-explain">{{afterSale.refund_reason}}</view>
				</view>
				<view class="return-goods-item flex sm m-t-20">
					<view class="return-title">退款金额：</view>
					<view class="return-explain primary">¥{{afterSale.refund_price}}</view>
				</view>
				<view class="return-goods-item flex sm m-t-20">
					<view class="return-title">退款编号：</view>
					<view class="return-explain">{{afterSale.sn}}</view>
				</view>
				<view class="return-goods-item flex sm m-t-20">
					<view class="return-title">申请时间：</view>
					<view class="return-explain">{{afterSale.create_time}}</view>
				</view>
			</view>
			<view class="btn-group fixed bg-white flex row-right" v-if="afterSale.status != 6">
				<view class="m-r-20 btn br60" @tap="confirmDialog=true">撤销申请</view>
				<router-link :to="{path: '/bundle/pages/apply_refund/apply_refund', query: {after_sale_id: afterSale.id, 
								order_id: afterSale.order_goods.order_id,
								item_id: afterSale.order_goods.item_id}}">
					<view class="m-r-20 btn br60 primary" v-if="(afterSale.status == 4 || afterSale.status == 1)">重新申请
					</view>
				</router-link>
				<router-link
					:to="{path: '/bundle/pages/input_express_info/input_express_info', query: {id: afterSale.id}}">
					<view class="m-r-20 btn br60" v-if="afterSale.status == 2">
						填写快递单号
					</view>
				</router-link>
			</view>
		</view>
		<u-modal v-model="confirmDialog" confirm-text="确定" :showCancelButton="true" :confirm-color="colorConfig.primary"
			@confirm="cancelApplyFun">
			<view class="flex-col col-center tips-dialog" style="padding: 30rpx 0;">
				<image class="icon-lg" src="/static/images/icon_warning.png"></image>
				<view class="m-t-30">是否要撤销申请？</view>
			</view>
		</u-modal>
	</view>
</template>

<script>
	import {
		afterSaleDetail,
		cancelApply
	} from "@/api/user";
	import {
		trottle,
		copy
	} from "@/utils/tools.js";

	export default {
		data() {
			return {
				afterSale: {
					shop: {},
					order_goods: {}
				},
				confirmDialog: false
			};
		},
		onLoad(options) {

		},

		onShow() {
			this.id = this.$Route.query.id
			this.afterSaleDetailFun();
		},

		methods: {
			onCopy() {
				const {
					afterSale
				} = this;
				const {
					address,
					contact,
					mobile
				} = afterSale.shop;
				copy(`${address},${contact},${mobile}`)
			},


			cancelApplyFun() {
				cancelApply({
					id: this.id
				}).then(res => {
					if (res.code == 1) {
						
						uni.$emit("refreshsale")
						this.$toast({
							title: res.msg
						}, {
							tab: 3,
							url: 1
						});
					}
				});
			},

			afterSaleDetailFun() {
				afterSaleDetail({
					id: this.id
				}).then(res => {
					if (res.code == 1) {
						this.afterSale = res.data
					}
				});
			}

		}
	};
</script>
<style lang="scss">
	.after-sales-detail {
		padding-bottom: calc(120rpx + env(safe-area-inset-bottom));

		.after-sales-header {
			.after-sales-status {
				padding: 48rpx 30rpx;
				background-color: #555555;
			}

			.after-sales-explain {
				padding: 20rpx 30rpx 24rpx;
			}
		}

		.return-goods-container {
			padding: 20rpx 24rpx 55rpx;
			
			.return-goods-item {
				line-height: 40rpx;
			}
		}

		.btn-group {
			padding: 0rpx 24rpx;
			position: fixed;
			left: 0;
			right: 0;
			bottom: 0;
			height: 100rpx;
			padding-bottom: env(safe-area-inset-bottom);
			box-sizing: content-box;
			.btn {
				padding: 10rpx 34rpx;
				border: 1px solid #999999;

				&.primary {
					border-color: $-color-primary;
				}
			}
		}

		.goods-container {
			.goods-item {
				padding: 25rpx 24rpx;
				.goods-info {
					min-width: 500rpx;
				}
			}
		}
	}

	.return-address-contain {
		padding: 20rpx 24rpx 28rpx 30rpx;

		.address {
			flex: 1;
			line-height: 38rpx;
		}

		.address-title {
			width: 150rpx;
			align-self: flex-start;
			line-height: 40rpx;
		}

		.copy-btn {
			background-color: #F4F4F4;
			color: #555555;
			padding: 3rpx 16rpx;
			margin-left: 12rpx;
			border-radius: 4rpx;
		}
	}

	.tips-dialog {
		height: 230rpx;
		width: 100%;
	}
</style>

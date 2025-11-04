<template>
	
	<view class="coupon-order flex-col">
		<scroll-view style="background-color: #F6F6F6" scroll-y="true" :style="{height: type == 0 ? '750rpx' : '852rpx'}">
			<view class="coupon-list">
				<view v-for="(item, index) in coupons" :key="index" class="m-b-20 bg-white" @tap="onSelect(item.id)">
					<view class="coupon-item flex">
						<view class="price white flex-col col-center">
							<view class="xl">
								<price-format :subscript-size="34" :first-size="60" :second-size="50"
									:price="item.money" :weight="500"></price-format>
							</view>
							<view>{{item.condition_type_desc}}</view>
						</view>
						<view class="flex row-between flex-1">
							<view class="info m-l-20">
								<view class="bold md bold m-b-10 line-1">{{item.coupon_name}}</view>
								<view class="xxs lighter m-b-10">{{item.user_time_desc}}</view>
								<view class="xxs lighter">{{item.use_scene_desc}}</view>
							</view>
							<u-checkbox shape="circle" v-if="type == 0" :value="selectId == item.id"></u-checkbox>
						</view>
					</view>
					<view class="xs" v-if="item.use_goods_desc && type == 1" style="padding: 14rpx 20rpx">
						{{item.use_goods_desc}}
					</view>
				</view>
			</view>
			<view v-if="coupons.length == 0" class="flex-col col-center" style="padding-top: 50rpx">
				<image class="img-null" src="/static/images/coupon_null.png"></image>
				<text class="muted">暂无优惠券～</text>
			</view>
		</scroll-view>
		<view v-if="type == 0">
			<view class="bg-primary btn white flex row-center br60 mb10 lg" @tap="onConfirmCoupon">
				确定
			</view>
		</view>
	</view>

</template>

<script>
	export default {
		data() {
			return {
				coupons: [],
				selectId: ""
			};
		},


		props: {
			list: {
				type: Array,
				default: () => []
			},
			type: {
				type: Number
			},
			couponId: [Number, String]
		},
		watch: {
			list: {
				handler(val) {
					this.coupons = val
				},
				immediate: true,
			},
			couponId: {
				handler(val) {
					this.selectId = val
				},
				immediate: true,
			}
		},
		methods: {
			onSelect(id) {
				const {
					coupons,
					type,
					selectId
				} = this;
				if (type == 1) return;
				this.selectId = id == selectId ? "" : id

			},
			onConfirmCoupon() {
				this.$emit("change", this.selectId)
			}

		}
	};
</script>
<style scoped>
	.coupon-order .coupon-list {
		padding: 20rpx 24rpx;
	}

	.coupon-order .coupon-item {
		position: relative;
		height: 200rpx;
		background-image: url(../../static/images/coupon_bg.png);
		background-size: 100% 100%;
	}

	.coupon-order .coupon-item .price {
		width: 200rpx;
	}

	.coupon-order .btn {
		margin: 10rpx 20rpx;
		height: 82rpx;
	}
</style>

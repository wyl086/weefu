<template>
	<view class="integral-goods-details">
		<!-- 商品图片 -->
		<view class="goods-image" @tap="previewImage(goodsDetails.image)">
			<u-image :src="goodsDetails.image" width="100%" height="750rpx"></u-image>
		</view>
		<!-- 商品信息 -->
		<view class="goods-info bg-white">
			<view class="info-header flex">
				<view class="price flex flex-1">
					<view class="primary m-r-10">
						<price-format :first-size="38" :second-size="24" :price="goodsDetails.need_integral"
							:weight="500" :show-subscript="false"></price-format>
						<text class="xs">积分</text>
						<block v-if="goodsDetails.exchange_way === 2">
							<text>+</text>
							<price-format :show-subscript="false" :first-size="38"
								:second-size="24" :weight="500" :price="goodsDetails.need_money" />
							<text class="xs">元</text>
						</block>
					</view>
					<view class="muted xs" v-if="goodsDetails.market_price > 0">
						市场价 <price-format :first-size="24" :second-size="24" :subscript-size="24"
							:price="goodsDetails.market_price"></price-format>
					</view>
				</view>
				<view class="muted xs">
					已兑换：{{ goodsDetails.sales }}
				</view>
			</view>
			<view class="name lg bold">{{ goodsDetails.name }}</view>
		</view>
		<!-- 商品规格选择 -->
		<view class="goods-spec flex bg-white m-t-20" @tap="showSpec = true">
			<view class="label muted">已选</view>
			<view class="line-1 m-r-20 flex-1">数量x{{ count }}</view>
			<u-icon name="arrow-right" :color="colorConfig.muted"></u-icon>
		</view>
		<!-- 商品详情 -->
		<view class="goods-details m-t-20 bg-white">
			<view class="details-title lg">商品详情</view>
			<view class="details-content">
				<u-parse :html="goodsDetails.content" :lazy-load="true" :show-with-animation="true"></u-parse>
			</view>
		</view>
		<!-- 底部按钮 -->
		<view class="goods-footer bg-white flex">
			<button type="primary" class="right-btn flex-1 br60" :disabled="!goodsDetails.stock" @tap="toSettlement">
				立即兑换
			</button>
		</view>
		<!-- 悬浮按钮 -->
		<float-tab></float-tab>
		<!-- 规格弹窗 -->
		<view class="spec-popup">
			<u-popup v-model="showSpec" mode="bottom" border-radius="14" :closeable="true"
				:safe-area-inset-bottom="true">
				<view class="bg-white spec-contain">
					<view class="spec-header flex">
						<u-image width="160rpx" height="160rpx" class="m-r-20" border-radius="10rpx"
							@click="previewImage(goodsDetails.image)" :src="goodsDetails.image"></u-image>
						<view class="goods-info">
							<view class="primary flex">
								<price-format :first-size="38" :second-size="24" :price="goodsDetails.need_integral"
									:weight="500" :show-subscript="false">
								</price-format>
								<text class="xs">积分</text>
								<block v-if="goodsDetails.exchange_way === 2">
									<text>+</text>
									<price-format :show-subscript="false" :weight="500" :first-size="38" :second-size="24"
										:price="goodsDetails.need_money" />
									<text class="xs">元</text>
								</block>
							</view>
							<view class="sm">
								库存：{{goodsDetails.stock}}件
							</view>
						</view>
					</view>
					<view class="spec-main" style="height: 400rpx;">
						<view class="good-num flex row-between m-l-20 m-r-20">
							<view class="label">数量</view>
							<u-number-box :disabled="!goodsDetails.stock" v-model="count" :min="1" :max="goodsDetails.stock">
							</u-number-box>
						</view>
					</view>
					<view class="spec-footer">
						
						<button type="primary" class="right-btn flex-1 br60" :disabled="!goodsDetails.stock" @tap="toSettlement">
							立即兑换
						</button>
					</view>
				</view>
			</u-popup>
		</view>
		<loading-view v-if="isFirstLoading"></loading-view>
	</view>
</template>

<script>
	import {
		getIntegralGoodsDetail
	} from '@/api/activity'
	export default {
		data() {
			return {
				isFirstLoading: true,
				goodsDetails: {},
				count: 1,
				showSpec: false
			}
		},
		methods: {
			// 获取商品详情
			getGoodsDetails() {
				getIntegralGoodsDetail({
					id: this.id
				}).then((res) => {
					if (res.code == 1) {
						this.goodsDetails = res.data
					}
				}).finally(() => {
					this.isFirstLoading = false
				})
			},
			// 图片预览
			previewImage(current) {
				uni.previewImage({
				    current,
				    urls: [current] // 需要预览的图片http链接列表
				});
			},
			// 前往结算页面
			toSettlement() {
				this.$Router.push({
					path: '/bundle/pages/integral_settlement/integral_settlement',
					query: {
						id: this.id,
						count: this.count
					}
				})
			}
			
		},
		onLoad() {
			this.id = this.$Route.query.id
			this.getGoodsDetails()
		},
		onShareAppMessage() {
			const {
				goodsDetails
			} = this;
			return {
				title: goodsDetails.name,
				imageUrl: goodsDetails.image,
				path: '/bundle/pages/integral_goods_details/integral_goods_details?id=' + this.id + "&invite_code=" + this.$store.getters.inviteCode
			};
		},

	}
</script>

<style lang="scss">
	.integral-goods-details {
		padding-bottom: calc(120rpx + env(safe-area-inset-bottom));

		.goods-info {
			position: relative;

			.info-header {
				padding: 20rpx 24rpx 0;

				.price {
					align-items: baseline;
				}
			}

			.name {
				padding: 20rpx 24rpx;
				flex: 1;
			}
		}

		.goods-details {

			// overflow: hidden;
			.details-title {
				line-height: 88rpx;
				text-align: center;
			}

			&>.details-content {
				padding: 0 20rpx 20rpx;

				::v-deep image {
					vertical-align: middle;
				}

				// #ifdef H5
				::v-deep img {
					vertical-align: middle;
				}

				// #endif
				// #ifdef MP-WEIXIN || APP-PLUS
				::v-deep ._img {
					display: block;
				}

				// #endif
			}
		}

		.goods-spec {
			padding: 24rpx 24rpx;

			.label {
				width: 100rpx;
			}
		}

		.goods-footer {
			height: 100rpx;
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			box-sizing: content-box;
			padding: 0 24rpx;
			padding-bottom: env(safe-area-inset-bottom);
		}

		.spec-popup {
			.spec-contain {
				overflow: hidden;
				position: relative;

				.spec-header {
					padding: 30rpx;
					padding-right: 70rpx;
					align-items: flex-start;
					border: $-solid-border;
				}

				.spec-main, .spec-footer {
					padding: 24rpx;
				}
			}

		}
		.right-btn {
			height: 80rpx;
			line-height: 80rpx;
		}
	}
</style>

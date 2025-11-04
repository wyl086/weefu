<template>
	<view class="apply-refund">
		<view class="goods bg-white m-t-20">
			<view class="flex">
				<u-image width="160rpx" height="160rpx" border-radius="6rpx" lazy-load :src="goods.image" />
				<view class="goods-info">
					<view class="line-2">{{goods.goods_name}}</view>
					<view class="xs muted m-t-10">{{goods.spec_value}}</view>
				</view>
			</view>
		</view>
		<view class="opt-box m-t-20 bg-white">
			<view v-show="!hiddenOpt">
				<view class="opt-item flex row-between border-line" @tap="onlyRefund">
					<view>
						<view class="lg">仅退款</view>
						<view class="muted xs m-t-10">未收到货，与卖家协商同意无需退货只需退款</view>
					</view>
					<u-icon class="m-l-10" name="arrow-right" size="28" />
				</view>
				<view class="opt-item flex row-between" @tap="allRefunds">
					<view>
						<view class="lg">退货退款</view>
						<view class="muted xs m-t-10">已收到货，需退还收到的实物</view>
					</view>
					<u-icon class="m-l-10" name="arrow-right" size="28" />
				</view>
			</view>
			<view v-show="hiddenOpt">
				<view class="refund-info flex row-between m-t-20">
					<view class="lable">数量</view>
					<view>{{goods.goods_num}}</view>
				</view>
				<view class="refund-info flex row-between">
					<view class="lable">退款金额</view>
					<price-format :color="colorConfig.primary" :price="goods.total_pay_price" />
				</view>
				<view class="refund-info flex row-between" @tap="showPop=true">
					<view class="lable">退款原因</view>
					<view class="flex">
						<text :class="{muted: !reasonString}">{{reasonString ? reasonString : '请选择' }}</text>
						<u-icon class="m-l-10" name="arrow-right" size="28" />
					</view>
				</view>
				<view class="refund-info flex col-top">
					<view class="label">备注说明</view>
					<view class="flex-1" style="background-color: #F8F8F8;">
						<u-input v-model="remark" type="textarea" placeholder="请描述申请售后的具体原因，100字以内" :border="false"
							:height="160" />
					</view>
				</view>
				<view class="upload bg-white">
					<view class="title flex row-between">
						<view>上传凭证</view>
						<view class="muted">（选填，最多可上传1张）</view>
					</view>
					<u-upload ref="uUpload" :show-progress="false" :header="{token: $store.getters.token}"
						:max-count="1" width="160" height="160" :action="action" upload-text="上传图片"
						@on-success="onSuccess" @on-remove="onRemove" />
				</view>
			</view>
		</view>

		<button v-show="hiddenOpt" class="btn br60" type="primary" size="lg" @tap="onSubmit">申请退款</button>

		<u-select v-model="showPop" mode="single-column" value-name="index" label-name="name" :list="reason"
			@confirm="confirmSelect"></u-select>
	</view>

</template>

<script>
	import {
		refundOptType
	} from "@/utils/type";
	import {
		baseURL
	} from '@/config/app';
	import {
		getGoodsInfo,
		applyAfterSale,
		applyAgain
	} from "@/api/user";
	import {
		uploadFile,
		trottle
	} from '@/utils/tools.js';

	export default {
		data() {
			return {
				action: baseURL + '/api/file/formimage',
				hiddenOpt: false,
				optTyle: refundOptType.ONLY_REFUND,
				goods: {},
				reason: [],
				showPop: false,
				reasonString: '',
				fileList: [],
				remark: ""
			};
		},
		onLoad(options) {
			const {
				order_id,
				item_id,
				after_sale_id
			} = this.$Route.query
			this.orderId = order_id;
			this.itemId = item_id;
			this.afterSaleId = after_sale_id;
			this.getGoodsInfoFun();
			this.onSubmit = trottle(this.onSubmit, 1000, this)
		},

		methods: {
			confirmSelect(e) {
				this.reasonString = e[0].label
			},

			onlyRefund() {
				this.optTyle = refundOptType.ONLY_REFUND
				this.hiddenOpt = true
			},

			allRefunds() {
				this.optTyle = refundOptType.REFUNDS;
				this.hiddenOpt = true;
			},
			onSuccess(e) {
				this.fileList.push(e.data.base_uri)
			},
			onRemove(index) {
				this.fileList.splice(index, 1)
				console.log(index)
			},
			async onSubmit() {
				const {
					reason,
					reasonString,
					optTyle,
					remark,
					fileList
				} = this;
				if (!reasonString) {
					return this.$toast({
						title: '请选择退款原因'
					});
				}
				const params = {
					reason: reasonString,
					refund_type: optTyle,
					remark: remark,
					img: fileList.length ? fileList[0] : ''
				};
				if (this.afterSaleId) {
					params.id = this.afterSaleId
				} else {
					params.item_id = this.itemId
					params.order_id = this.orderId
				}
				const {
					data,
					code,
					msg
				} = this.afterSaleId ? await applyAgain(params) : await applyAfterSale(params)
				if (code == 1) {
					this.$toast({
						title: msg
					});
					uni.$emit("refreshsale")
					setTimeout(() => {
						this.$Router.replace({
							path: '/bundle/pages/after_sales_detail/after_sales_detail',
							query: {
								id: data.after_sale_id
							}
						})
					}, 1000)
				}

			},

			getGoodsInfoFun() {
				let {
					orderId,
					itemId
				} = this;
				getGoodsInfo({
					order_id: orderId,
					item_id: itemId
				}).then(res => {
					if (res.code == 1) {
						this.goods = res.data.goods;
						this.reason = res.data.reason.map((item, index) => ({
							name: item,
							index
						}));
					}
				});
			}

		}
	};
</script>
<style lang="scss">
	.apply-refund {
		padding-bottom: 50rpx;

		.goods {
			padding: 20rpx 24rpx;

			.goods-info {
				margin-left: 24rpx;
				flex: 1;
			}
		}

	}

	.opt-box {
		.opt-item {
			padding: 20rpx 20rpx 30rpx;
		}
	}



	.apply-refund {
		.refund-info {
			padding: 24rpx 20rpx;
			border-bottom: $-solid-border;

			.label {
				width: 140rpx;
				margin-top: 19rpx;
			}

			textarea {
				flex: 1;
				height: 172rpx;
				border-radius: 10rpx;
				padding: 20rpx;
				box-sizing: border-box;
			}
		}

		.upload {
			padding: 0 20rpx 30rpx;

			.title {
				padding: 24rpx 0;
			}
		}

		.btn {
			margin: 30rpx 26rpx
		}
	}
</style>

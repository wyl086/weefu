<template>
	<view class="settled-result">
		<view class="result-box">
			<!-- Header -->
			<view class="result-header bg-white flex-col col-center">
				<u-image width="165rpx" height="165rpx" class="m-t-42" :src="getStatus.img" />
				<view class="m-t-32 lg bold">{{getStatus.text}}</view>
				<view>
					<!-- 地址、账号 -->
					<view v-if="applyDetail.audit_status == 2">
						<view class="m-t-40 flex flex-wrap">
							<view class="m-r-20">PC管理后台地址：<text class="lighter">{{applyDetail.admin_address}}</text>
							</view>
							<view class="btn-copy br60 text-center" @tap="onCopy(applyDetail.admin_address)">复制</view>
						</view>
						<view class="m-t-30 flex flex-wrap">
							<view class="m-r-20">商家账号：<text class="lighter">{{applyDetail.account}}</text></view>
							<view class="btn-copy br60 text-center" @tap="onCopy(applyDetail.account)">复制</view>
						</view>
					</view>
					<view class="m-t-20 muted sm text-center">{{getStatus.desc}}</view>
					<view class="flex" v-if="applyDetail.audit_status !=2">
						<router-link v-if="applyDetail.audit_status == 3"  class="flex-1 m-r-20" to="/bundle/pages/store_settled/store_settled" >
							<view class="br60 flex row-center primary back-btn m-t-60 md">重新提交</view>
						</router-link>
						<router-link class="flex-1" to="/pages/index/index" navType="pushTab">
							<view class="br60 flex row-center back-btn m-t-60 md">返回首页</view>
						</router-link>
					</view>
				</view>
			</view>

			<!-- Content -->
			<view class="result-content bg-white m-t-20 p-20">
				<view class="apply-form-item flex row-between">
					<view><text class="primary m-r-10">*</text>商家名称</view>
					<view>{{applyDetail.name}}</view>
				</view>

				<!-- 主营行业 -->
				<view class="apply-form-item flex row-between">
					<view><text class="primary m-r-10">*</text>主营类目</view>
					<view>{{applyDetail.cid_desc}}</view>
				</view>

				<!-- 联系人姓名 -->
				<view class="apply-form-item flex row-between">
					<view><text class="primary m-r-10">*</text>联系人姓名</view>
					<view>{{applyDetail.nickname}}</view>
				</view>

				<!-- 手机号码 -->
				<view class="apply-form-item flex row-between">
					<view><text class="primary m-r-10">*</text>手机号码</view>
					<view>{{applyDetail.mobile}}</view>
				</view>
				<!-- 商家账号 -->
				<view class="apply-form-item flex row-between">
					<view><text class="primary m-r-10">*</text>商家账号</view>
					<view>{{applyDetail.account}}</view>
				</view>

				<!-- 图片 -->
				<view class="apply-form-item">
					<view><text class="primary m-r-10">*</text>营业执照</view>
					<view class="license-list flex m-t-10 flex-wrap">
						<view v-for="(item,index) in license" class="m-r-14 m-t-20" @tap="previewImage(index)"
							:key="index">
							<u-image width="152rpx" height="152rpx" :src="item" />
						</view>
					</view>
				</view>
			</view>

		</view>
	</view>
</template>

<script>
	import {
		shopApplyDetail
	} from '@/api/shop'
	import {copy} from '@/utils/tools'
	export default {
		data() {
			return {
				applyDetail: {},
				license: []
			}
		},

		methods: {
			async getShopApplyDetail() {
				const {
					data,
					code
				} = await shopApplyDetail(this.id)
				if (code == 1) {
					this.applyDetail = data
					this.license = data.license
				}
			},
			previewImage(current) {
				uni.previewImage({
					current,
					urls: this.license
				})
			},
			onCopy(text) {
				copy(text)
			}
		},

		onLoad(options) {
			this.id = this.$Route.query.id
			this.getShopApplyDetail()
		},
		computed: {
			getStatus() {
				const {
					applyDetail: {
						audit_status
					}
				} = this
				switch (audit_status) {
					case 1:
						return {
							img: '/static/images/img_store_submit.png',
								text: '恭喜您，资料提交成功！',
								desc: '预计在3个工作日内审核完毕，如通过我们将会发送短信通知您，请注意查收！'
						}
						case 2:
							return {
								img: '/static/images/img_store_success.png',
									text: '恭喜您，审核已通过！',
									desc: '温馨提示：密码是您在创建账号时设置的登录密码，如忘记密码可联系官方客服进行修改！'
							}
							case 3:
								return {
									img: '/static/images/img_store_fail.png',
										text: '很遗憾，审核不通过！',
										desc: '请尽量完善您的资料信息再重新提交！'
								}
								default:
									return {}
				}

			}
		}
	}
</script>

<style lang="scss" scoped>
	.settled-result {
		padding: 20rpx;

		.result-box {
			.result-header {
				padding: 0 75rpx 50rpx;
				border-radius: 10rpx;

				.btn-copy {
					width: 96rpx;
					height: 42rpx;
					line-height: 42rpx;
					border: $-solid-border;
				}
			}

			.back-btn {
				height: 88rpx;
				border: 1px solid #CCC;
				&.primary {
					border-color: $-color-primary;
					color: $-color-primary;
				}
			}

			.result-content {
				border-radius: 10rpx;

				.apply-form-item {
					padding: 30rpx 0;

					&:not(:last-of-type) {
						border-bottom: $-solid-border;
					}
				}
			}
		}
	}
</style>

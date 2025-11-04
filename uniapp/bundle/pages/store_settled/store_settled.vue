<template>
	<view class="store-settled">
		<view class="content">
			<view class="apply-form bg-white">
				<!-- 商家名称 -->
				<view class="apply-form-item">
					<u-field label="商家名称" v-model="form.name" label-width="160" placeholder="请输入商家名称" required />
				</view>

				<!-- 主营行业 -->
				<view class="apply-form-item" @tap="showPop=true">
					<u-field label="主营类目" v-model="form.clabel" label-width="160" style="flex: 1;" placeholder="请选择行业类目"
						required disabled>
						<u-icon name="arrow-right" slot="right" size="28" />
					</u-field>
				</view>

				<!-- 联系人姓名 -->
				<view class="apply-form-item">
					<u-field label="联系人姓名" v-model="form.nickname" label-width="160" placeholder="请输入联系人姓名" required />
				</view>

				<!-- 手机号码 -->
				<view class="apply-form-item">
					<u-field label="手机号码" v-model="form.mobile" label-width="160" placeholder="请输入手机号码" required />
				</view>

				<!-- 验证码 -->
				<view class="apply-form-item">
					<u-field label="验证码" label-width="160" placeholder="请输入验证码" required v-model="form.code">
						<view slot="right" class="primary send-code-btn br60 flex row-center" @tap="sendSmsFun">
							<u-verification-code unique-key="store-settled" ref="uCode" @change="codeChange">
							</u-verification-code>
							<view class="xs">{{codeTips}}</view>
						</view>
					</u-field>
				</view>

				<!-- 验证码 -->
				<view class="apply-form-item">
					<u-field label="创建账号" v-model="form.account" label-width="160" placeholder="请设置登录账号(可用手机号代替)"
						required />
				</view>

				<!-- 设置密码 -->
				<view class="apply-form-item">
					<u-field label="设置密码" :password="true" v-model="form.password" label-width="160"
						placeholder="请设置登录密码" required />
				</view>

				<!-- 上传图片 -->
				<view class="apply-form-item">
					<u-field label="营业执照" label-width="160" placeholder="请上传营业执照及行业相关资质证明" :border-bottom="false"
						required disabled />
					<view>
						<u-upload ref="uUpload" :show-progress="false" :header="{token: $store.getters.token}"
							:max-count="10" width="150" height="150" :action="action" upload-text="上传图片"
							@on-success="onSuccess"  @on-remove="onRemove" />
					</view>
					<view class="muted m-t-20 m-b-30">支持jpg、png、jpeg格式的图片，最多可上传10张</view>
				</view>

				<!-- 同意协议 -->
				<view class="apply-form-item flex">
					<u-checkbox shape="circle" :active-color="colorConfig.primary" v-model="isAgree">
						<text class="sm">已阅读并同意</text>
					</u-checkbox>
					<router-link :to="{path: '/bundle/pages/server_explan/server_explan', query: {type: 3}}">
					<text class="primary sm">《入驻协议》</text>
					</router-link>
				</view>

				<!-- 提交申请 -->
				<view style="padding: 30rpx 20rpx 30rpx 0;">
					<button type="primary" size="lg" class="br60" @tap="onSubmit">提交申请</button>
				</view>

				<!-- 查阅记录 -->
				<router-link to="/bundle/pages/settled_recode/settled_recode">
					<view class="flex row-center muted">
						<u-icon name="order" size="32" />
						<view class="m-l-10">查看提交记录</view>
					</view>
				</router-link>
			</view>
		</view>
		<u-select v-model="showPop" mode="single-column" value-name="id" label-name="name" :list="shopCategory"
			@confirm="confirmSelect"></u-select>
	</view>
</template>

<script>
	import {
		getShopCategory,
		shopApply
	} from "@/api/shop"
	import {
		baseURL
	} from '@/config/app'
	import {
		sendSms
	} from '@/api/app'
	import {
		SMSType
	} from '@/utils/type'
	export default {
		data() {
			return {
				isAgree: false,
				// 表单数据
				form: {
					cid: '',
					clabel: '',
					name: '',
					nickname: '',
					mobile: '',
					account: '',
					password: '',
					code: ''
				},
				codeTips: '',
				shopCategory: [],
				showPop: false,
				action: baseURL + '/api/file/formimage',
				fileList: []
			}
		},
		onLoad() {
			this.getShopCategoryFun()
		},
		methods: {
			async getShopCategoryFun() {
				const {
					code,
					data
				} = await getShopCategory()
				if (code == 1) {
					this.shopCategory = data
				}
			},
			sendSmsFun() {
				if(!this.$refs.uCode.canGetCode) return
				if (!this.form.mobile) {
					this.$toast({
						title: '请填写手机号信息'
					})
					return;
				}
				sendSms({mobile: this.form.mobile, key: SMSType.SJSQYZ}).then(res => {
				    if(res.code == 1) {
				        this.$toast({title:res.msg});
				        this.$refs.uCode.start();
				    }
				})
			},
			codeChange(tip) {
				this.codeTips = tip
			},
			// 提交表单
			async onSubmit() {
				const {
					form,
					isAgree,
					fileList
				} = this
				const submitObj = {
					...form,
					license: fileList
				}
				delete submitObj.clabel
				if (!isAgree) return this.$toast({
					title: '请先同意《入驻协议》'
				})
				const {
					data,
					code,
					msg
				} = await shopApply(submitObj)
				if(code == 1) {
					this.$toast({
						title: msg
					})
					setTimeout(() => {
						this.$Router.replace({
							path: '/bundle/pages/settled_result/settled_result',
							query: {
								id: data.id
							}
						})
					},1000)
					
				}
			},
			confirmSelect(e) {
				const {
					value,
					label
				} = e[0]
				this.form.cid = value
				this.form.clabel = label
			},
			onSuccess(e) {
				this.fileList.push(e.data.base_uri)
			},
			onRemove(index) {
				this.fileList.splice(index, 1)
				console.log(index)
			},
		},

	}
</script>

<style lang="scss">
	.store-settled {
		background-color: #FA844C;
		min-height: 100vh;
		background-image: url(../../static/store_recruitment_bg.png);
		background-repeat: no-repeat;
		background-size: 100% auto;
		overflow: hidden;

		.content {
			margin-top: 320rpx;
			padding: 0 20rpx 31rpx;

			.apply-form {
				border-radius: 8px;
				padding: 20rpx 0 30rpx 26rpx;

				.apply-form-item {
					.send-code-btn {
						height: 56rpx;
						width: 188rpx;
						border: 1rpx solid $-color-primary;
					}
				}

				.primary-btn {
					width: 100%;
					height: 88rpx;
					background-color: $-color-primary;
				}
			}
		}

		// .pop-categories {
		// 	.reason-item {
		// 		padding: 24rpx 20rpx;

		// 		.reason-desc {
		// 			line-height: 46rpx;
		// 		}
		// 	}
		// }
	}
</style>

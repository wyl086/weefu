<template>
	<view class="input-express-info p-t-20">
		<view class="input-contain bg-white">
			<u-field v-model="formInfo.express" :border-bottom="false" label="物流公司" placeholder="请输入物流公司名称">
			</u-field>
			<u-field v-model="formInfo.number" :border-bottom="false" label="快递单号" placeholder="请输入快递单号">
			</u-field>
			<u-field v-model="formInfo.remark" :border-bottom="false" label="备注说明" placeholder="选填">
			</u-field>
		</view>
		<view class="upload-contain bg-white m-t-20">
			<view class="header flex">
				<view class="normal">上传凭证</view>
				<view class="sm muted m-l-20">(请上传快递单号凭证）</view>
			</view>
			<view class="upload">
				<u-upload ref="uUpload" :show-progress="false" :header="{token: $store.getters.token}"
					:max-count="1" width="160" height="160" :action="action" upload-text="上传图片"
					@on-success="onSuccess" @on-remove="onRemove" />
			</view>
		</view>
		<view class="submit-btn">
			<button size="lg" class=" br60 bg-primary white lg" @tap="formSubmit">提交</button>
		</view>
	</view>
</template>

<script>
	import {
		inputExpressInfo
	} from '@/api/user';
	import {
		baseURL
	} from '@/config/app.js';



	export default {
		data() {
			return {
				action: baseURL + '/api/file/formimage',
				fileList: [],
				formInfo: {
					express: '',
					number: '',
					remark: ''
				}
			};
		},

		onLoad() {

			this.id = this.$Route.query.id
		},


		methods: {
			onSuccess(e) {
				this.fileList.push(e.data.base_uri)
			},
			onRemove(index) {
				this.fileList.splice(index, 1)
			},

			formSubmit(e) {
				const {
					fileList,
					formInfo: {
						express,
						number,
						remark
					}
				} = this;
				if (!express) return this.$toast({
					title: '请填写物流公司名称'
				});
				if (!number) return this.$toast({
					title: '请填写快递单号'
				});
				let data = {
					id: this.id,
					express_name: express,
					invoice_no: number,
					express_remark: remark,
					express_image: fileList.length ? fileList[0] : ''
				};
				inputExpressInfo(data).then(res => {
					if (res.code == 1) {
						this.$toast({
							title: '提交成功'
						}, {
							tab: 3,
							url: 1
						});
						uni.$emit("refreshsale")
					}
				});
			},
		}
	};
</script>
<style>
	.input-contain .input-item {
		padding: 24rpx;
	}

	.input-item .label {
		width: 152rpx;
	}

	.input-item .input {
		flex: 1;
	}

	.upload-contain {
		padding: 24rpx 20rpx 44rpx;
	}

	.upload-contain .header {
		margin-bottom: 30rpx;
	}

	.submit-btn {
		margin-top: 50rpx;
		margin-left: 26rpx;
		margin-right: 26rpx;
	}
</style>

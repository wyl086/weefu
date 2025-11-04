<!-- 提现 -->

<template>
	<view class="user-withdraw">
		<!-- Tabs -->
		<view class="withdraw-tabs">
			<u-tabs :list="tabsList" :is-scroll="true" :current="currentTab" :bold="true" height="100"
				font-size="30rpx" active-color="#333333" inactive-color="#666666" :bar-style="styleTabsBarStyle"
				@change="changeTab" />
		</view>


		<!-- 微信钱包 -->
		<view v-if="currentValue == 3" class="withdraw-wechat m-t-20 bg-white">
			<!-- Account -->
			<u-field label-width="160" label="微信账号" v-model="form.account" placeholder="请输入微信账号" />
			<!-- Name -->
			<u-field label-width="160" label="真实姓名" v-model="form.real_name" placeholder="请输入真实姓名" />
			<!-- Remark -->
			<u-field label-width="160" label="备注" v-model="form.remark" placeholder="(选填)" />

			<!-- 上传图片 -->
			<view class="flex-col m-t-20">
				<u-upload ref="uUpload"  :header="{token: $store.getters.token}" :auto-upload="true" :show-progress="false" max-count="1" width="142" height="142" :custom-btn="true" :action="action" @on-success="onSuccess"  @on-remove="onRemove" >
					<view slot="addBtn" class="flex-col col-center row-center">
						<view  class="upload-image flex-col col-center row-center" >
							<u-icon name="/bundle/static/icon_camera_line.png" width="54" />
						</view>
						
						<view class="xs m-t-10">微信收款码</view>
					</view>
				</u-upload>
			</view>
		</view>

		<!-- 支付宝 -->
		<view v-else-if="currentValue == 4" class="withdraw-alipay m-t-20 bg-white">
			<!-- Account -->
			<u-field label-width="160" label="支付宝账号" v-model="form.account" placeholder="请输入支付宝账号" />
			<!-- Name -->
			<u-field label-width="160" label="真实姓名" v-model="form.real_name" placeholder="请输入真实姓名" />
			<!-- Remark -->
			<u-field label-width="160" label="备注" v-model="form.remark" placeholder="(选填)" />

			<!-- 上传图片 -->
			<view class="flex-col m-t-20">
				<u-upload ref="uUpload"  :header="{token: $store.getters.token}" :auto-upload="true" :show-progress="false" max-count="1" width="142" height="142" :custom-btn="true" :action="action" @on-success="onSuccess"  @on-remove="onRemove" >
					<view slot="addBtn" class="flex-col col-center row-center">
						<view  class="upload-image flex-col col-center row-center" >
							<u-icon name="/bundle/static/icon_camera_line.png" width="54" />
						</view>
						
						<view class="xs m-t-10">支付宝收款码</view>
					</view>
				</u-upload>
			</view>
		</view>
		
		<!-- 银行卡 -->
		<view v-else-if="currentValue == 5" class="withdraw-alipay m-t-20 bg-white">
			<!-- Account -->
			<u-field label-width="160" label="银行卡账号" v-model="form.account" placeholder="请输入银行卡账号" />
			<!-- Name -->
			<u-field label-width="160" label="持卡人姓名" v-model="form.real_name" placeholder="请输入持卡人姓名" />
			<!-- Name -->
			<u-field label-width="160" label="提现银行" v-model="form.bank" placeholder="请输入银行名称" />
			<!-- Remark -->
			<u-field label-width="160" label="银行支行" v-model="form.subbank" placeholder="如：金湾支行" />
			<!-- Remark -->
			<u-field label-width="160" label="备注" v-model="form.remark" placeholder="(选填)" />
		</view>
		
		<!-- 提现金额 -->
		<view class="withdraw-money-wrap m-t-20 bg-white">
			<view class="flex withdraw-money p-b-20">
				<view class="flex flex-1">
					<text class="font-size-46 m-r-10 normal">¥</text>
					<u-input v-model="form.money" placeholder="0.00" :custom-style="{
							'font-size': '66rpx'
						}" />
				</view>
				<view class="flex-col flex-1 text-right">
					<text class="xs primary" @tap="form.money=widthDrawConfig.able_withdraw">全部提现</text>
					<text class="xs muted m-t-10">可提现金额 ¥ {{widthDrawConfig.able_withdraw}}</text>
				</view>
			</view>
			<view class="muted xs m-t-30" v-if="widthDrawConfig.poundage_percent && currentValue != 1">提示：提现需扣除服务费{{widthDrawConfig.poundage_percent}}%</view>
		</view>

		<!-- 确认提交 -->
		<button class="withdraw-submit m-t-30 white br60" @tap="onSubmit" size="lg">确认提交</button>

		<!-- 提现记录 -->
		<router-link to="/bundle/pages/user_withdraw_code/user_withdraw_code">
			<view class="withdraw-log m-t-40 text-center muted">提现记录</view>
		</router-link>

	</view>
</template>


<script>
	import {
		applyWithdraw,
		getWithdrawConfig
	} from "@/api/user";
	import {
		trottle
	} from "@/utils/tools";
	import {
		baseURL
	} from '@/config/app';
	export default {
		data() {
			return {
				action: baseURL + '/api/file/formimage',
				currentTab: 0, // Tabs当前位置
				// Tabs 列表
				tabsList: [],
				// Tabs滑块样式
				styleTabsBarStyle: {
					bottom: '12rpx',
					width: '50rpx',
					height: '6rpx',
					background: 'green',
					borderRadius: '50px',
					backgroundImage: 'linear-gradient(to right, \#F79C0C, \#FF2C3C)'
				},
				// 表单数据
				form: {
					money: '', // 提现金额
					account: '', // 账户名称
					real_name: '', // 真实姓名
					money_qr_code: '', // 收款二维码
					bank: '', // 银行
					subbank: '', // 支行
					remark: '', // 备注
				},
				widthDrawConfig: {}
			}
		},
		onLoad() {
			this.getWithdrawConfigFun();
			this.onSubmit = trottle(this.onSubmit, 1000, this)
		},
		methods: {
			// 改变当前的Tabs位置
			changeTab(index) {
				this.currentTab = index;
				this.form = {
					money: '', 
					account: '', 
					real_name: '',
					money_qr_code: '', 
					remark: '',
					bank: '', 
					subbank: ''
				};
			},
			async getWithdrawConfigFun() {
				const {
					code,
					data
				} = await getWithdrawConfig()

				if (code == 1) {
					this.widthDrawConfig = data
					this.tabsList = data.type
				}
			},
			// 提交表单
			onSubmit() {
				const data = {
					...this.form
				} 
				data.type = this.currentValue
				if (!data.money) {
				  this.$toast({
				    title: '请输入提现金额'
				  });
				  return;
				}
				applyWithdraw(data).then(res => {
				  if (res.code == 1) {
				    this.$toast({
				      title: '提交成功'
				    }, {
				      tab: 2,
				      url: '/bundle/pages/widthdraw_result/widthdraw_result?id=' + res.data.id
				    });
				  }
				});
			},
			onSuccess(e) {
				console.log(e)
				this.form.money_qr_code = e.data.base_uri
			},
			onRemove(index) {
				this.form.money_qr_code = ""
			},
		},
		computed: {
			currentValue(val) {
				const {currentTab, tabsList} = this
				return tabsList[currentTab] ? tabsList[currentTab].value : ''
			}
		}
	}
</script>


<style lang="scss" scoped>
	.user-withdraw {
		padding: 20rpx 30rpx;

		.withdraw-tabs {
			border-radius: 10px;
			overflow: hidden;
		}

		.withdraw-money-wrap {
			padding: 50rpx 66rpx;
			border-radius: 10px;

			.withdraw-money {
				border-bottom: $-solid-border;
			}
		}

		.withdraw-wechat,
		.withdraw-alipay {
			padding: 0 36rpx 20rpx;
			border-radius: 10px;
		}

		.upload-image {
			width: 142rpx;
			height: 142rpx;
			border: 2rpx dashed #CCCCCC;
			border-radius: 5px;
		}

		.withdraw-submit {
			background: linear-gradient(11deg, #F95F2F, #FF2C3C);
		}
		::v-deep .u-field {
			padding: 26rpx 0;
		}
	}
</style>

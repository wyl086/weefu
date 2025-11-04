<template>
	<view class="contact-offical" v-show="isShow" :class="{'shop-contact': shopId}">
		<template v-if="shopId">
			<view class="header white" >
				<view class="title font-size-50 text-center">店铺客服</view>
				<view class="line m-t-36"></view>
			</view>
			<view class="content flex-col col-center">
				<view class="content-view flex-col col-center bg-white text-center">
					<view class="flex col-center m-b-40 m-l-40" style="align-self: flex-start;">
						<u-image width="88rpx" height="88rpx" border-radius="50%" :src="server.shop.logo" />
						<view class="lg m-l-20">{{server.shop.name}}</view>
					</view>
					<u-image width="360rpx" height="360rpx" :src="server.config.image" />
					<view v-if="server.config.wechat" class="flex row-center copy-btn white lg br60 m-t-50 m-b-40" @click="onCopy(server.config.wechat)">
						复制去微信添加
					</view>
					<view class="lighter xs">营业时间：{{server.config.business_time}}</view>
					<view class="xs lighter m-t-10 flex">
						客服电话：{{server.config.phone}}
						<view class="phone-btn m-l-30" @tap="showPhoneCall=true">拨打</view>
					</view>
				</view>
			</view>
			<u-modal :content="'即将打电话给'+ server.config.phone" v-model="showPhoneCall" show-cancel-button confirm-text='呼叫'
				:confirm-color="colorConfig.primary" @confirm="onCall">
			</u-modal>
		</template>
		<template v-else>
			<view class="header white" >
				<view class="title font-size-50 text-center">平台客服</view>
				<view class="line m-t-36"></view>
			</view>
			<view class="content flex-col col-center">
				<view class="content-view flex-col col-center bg-white text-center">
					<u-image width="360rpx" height="360rpx" :src="server.image" />
					<view v-if="server.wechat" class="flex row-center copy-btn lg br60 white m-t-50 m-b-40"  @click="onCopy(server.wechat)">
						复制去微信添加
					</view>
					<view class="lighter xs">营业时间：{{server.business_time}}</view>
					<view class="xs lighter m-t-10 flex">
						平台电话：{{server.phone}}
						<view class="phone-btn m-l-30" @tap="showPhoneCall=true">拨打</view>
					</view>
				</view>
			</view>
			<u-modal :content="'即将打电话给'+ server.phone" v-model="showPhoneCall" show-cancel-button confirm-text='呼叫'
				:confirm-color="colorConfig.primary" @confirm="onCall">
			</u-modal>
		</template>
		
	</view>
</template>

<script>
	import {
		getService,
		getChatConfig
	} from "@/api/app"
	import {
		getShopService
	} from "@/api/shop"
	import {
		copy
	} from '@/utils/tools'
	export default {
		name: 'contactOffical',
		data() {
			return {
				server: {
					config: {},
					shop: {}
				},
				showPhoneCall: false,
				shopId: 0,
				isShow: false
			}
		},

		onLoad() {
			this.shopId = Number(this.$Route.query.id)
			this.getServiceFun()
		},

		methods: {
			async getServiceFun() {
				const {data, code} = this.shopId ? await getShopService(this.shopId) : await getService()
				if(code == 1) {
					this.server = data
					this.isShow = true
				}
			},
			onCopy(str) {
				copy(str);
			},
			onCall() {
				wx.makePhoneCall({
					phoneNumber: String(this.server.config && this.server.config.phone || this.server.phone),
					success(e) {
						console.log('成功', e)
					},
					fail(err) {
						console.log('失败', err)
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		padding: 0;
	}
	.contact-offical {
		min-height: 100vh;
		background-image: url(../../static/contact_official_bg.png);
		background-position: center;
		background-size: cover;
		background-repeat: no-repeat;
		&.shop-contact {
			background-image: url(../../static/shop_official_bg.png);
			
			.header{
				.line {
					background:#3A67E4;
				}
			}
		}
		.header {
			padding: 80rpx 50rpx 0;
			.line {
				height: 25rpx;
				background: #BE000E;
				border-radius: 20rpx;
			}
		}
		.content {
			margin-top: -10rpx;
			.content-view {
				width: 620rpx;
				padding: 80rpx 20rpx 40rpx;
			}

			.phone-btn {
				padding: 2rpx 19rpx;
				border: 1px solid #D7D7D7;
				border-radius: 10rpx;
			}
			.copy-btn {
				background: linear-gradient(#12c96e 0%, #0abd57 50.76%, #03b240 100%);
				width: 460rpx;
				height: 84rpx;
				box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
			}
		}
	}
</style>

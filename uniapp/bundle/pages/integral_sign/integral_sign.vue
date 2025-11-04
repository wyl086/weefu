<template>
	<view class="integral-sign" v-show="user.id">
		<view class="user-sgin">
			<view class="header">
				<view class="flex">
					<!-- 头像 -->
					<view class="flex m-l-40">
						<u-avatar :src="user.avatar" :size="110"></u-avatar>
					</view>
					<!-- 积分和明细按钮 -->
					<view class="m-l-30 flex row-between flex-1">
						<!-- 积分 -->
						<view>
							<view class="white" style="font-size: 56rpx">{{user.user_integral}}</view>
							<router-link to="/bundle/pages/sign_rule/sign_rule">
								<view class="sm flex white">
									我的积分
									<image src="../../static/jifen_icon_help.png" class="m-l-10"
										style="height: 30rpx; width: 30rpx;"></image>
								</view>
							</router-link>
						</view>
						<!-- 明细按钮 -->
						<router-link to="/bundle/pages/integral_details/integral_details">
							<view class="score-detail-entry flex">
								<image style="width: 26rpx;height: 26rpx;flex: none; margin-right: 7rpx"
									src="../../static/jifen_icon_data.png"></image>
								<text class="sm white">积分明细</text>
							</view>
						</router-link>
					</view>
				</view>
			</view>
			<view class="main">
				<!-- 签到列表 -->
				<view class="contain bg-white">
					<view class="title">已累积签到 {{user.days}}天</view>
					<view class="day-list flex flex-wrap">
						<view v-for="(item, index) in signList" :key="index"
							class="item flex-col col-center">
							<view :class="'circle flex row-center ' + (item.status == 1 ? 'active-circle' : '')">
								<view class="num xs lighter" v-if="item.status == 0">+{{item.integral}}</view>
								<image class="num" src="../../static/jifen_icon_select.png" v-if="item.status == 1">
								</image>
							</view>
							<view class="day m-t-10 lighter sm">{{item.day}}</view>
						</view>
					</view>
					<view class="right-sgin">
						<button :class="'lighter br60 ' + (user.today_sign ? 'gray' : 'primary-button')"
							@tap="userSignFun" size="md">{{user.today_sign ? '已签到' : '立即签到' }}</button>
					</view>
				</view>
				<!-- 赚积分 -->
				<view class="contain bg-white m-t-20" v-if="integralTips.length > 0">
					<view class="title flex">
						<view class="line br60 m-r-20"></view>
						<view class="bold xl">赚积分</view>
					</view>
					<view class="task">
						<view v-for="(item, index) in integralTips" :key="index" class="item flex">
							<image class="img m-r-20" :src="item.image">
							</image>
							<view class="con">
								<view class="md">{{item.name}}</view>
							</view>
							<button hover-class="none" :class="'btn br60 ' + (item.status ? 'muted' : 'primary' )"
								:style="'border-color: ' + (item.status ? '#BBBBBB' : '#FF2C3C') + ';'"
								size="xs">{{item.status ? '已完成' : '未完成'}}</button>
						</view>
					</view>
				</view>
			</view>
		</view>

		<u-popup v-model="showPop" mode="center">
			<view class="pop-container">
				<view class="header-score flex row-center">+{{signInfo.integral}}</view>
				<view class="box column-center">
					<view class="desc m-t-20 sm flex row-center">
						<view class="">
							获得
						</view>
						<image style="width: 28rpx; height: 30rpx;margin-right: 8rpx; margin-left: 8rpx"
							src="../../static/icon_jifen.png"></image>
						<view class="">
							{{signInfo.integral}}
						</view>
						<view class="m-l-20 flex" v-if="signInfo.growth">
							+ {{ signInfo.growth }}成长值
						</view>
					</view>
					<view class="bottom-box">
						<view class="md" style="line-height: 36rpx">
							您已累积签到 <text style="font-size: 36rpx; color: #FF2C3C;">{{signInfo.days}}</text>天
						</view>
					</view>
					<view class="white br60 primary-btn" style="margin-top: 26rpx" @tap="showPop = false">确定</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		getSignLists,
		userSignIn
	} from "@/api/activity";
	import {
		trottle
	} from "@/utils/tools"
	export default {
		data() {
			return {
				// 用户信息
				user: {

				},
				// 签到天数列表
				signList: [],
				// 每日签到
				integralTips: [],
				// 显示签到结果弹窗
				showPop: false,
				// 签到结果
				signInfo: {
				}
			};
		},

		onLoad() {
			this.getSignListsFun()
			this.userSignFun = trottle(this.userSignFun, 1000, this)
		},

		methods: {
			// 获取签到数据
			getSignListsFun() {
				getSignLists()
					.then((res) => {
						if (res.code == 1) {
							const {
								user,
								sign_list,
								integral_tips
							} = res.data
							this.user = user
							this.signList = sign_list
							this.integralTips = integral_tips
						}
					}).catch((err) => {

					})
			},
			// 点击签到
			userSignFun() {
				if(this.user.today_sign) return
				userSignIn().then((res) => {
					if(res.code == 1) {
						this.showPop = true;
						this.signInfo = res.data
						this.getSignListsFun()
					}
				})
			}
		}
	};
</script>
<style lang="scss">
	.user-sgin {
		padding-bottom: 100rpx;
	}

	.user-sgin .header {
		background-image: url(../../static/bg_sgin.png);
		background-repeat: no-repeat;
		background-size: 100%;
		height: 400rpx;
		width: 750rpx;
		padding-top: 40rpx;
		box-sizing: border-box;
	}

	.user-sgin .header .avatar {
		border-radius: 50%;
		border: 4rpx solid #fff;
	}

	.user-sgin .main {
		z-index: 100;
		margin-top: -200rpx;
		width: 100%;
		top: 186rpx;
		padding: 0 20rpx;
		box-sizing: border-box;
	}

	.user-sgin .main .contain {
		border-radius: 10rpx;
	}

	.user-sgin .main .contain .title {
		padding: 24rpx 30rpx;
	}

	.user-sgin .main .contain .title .line {
		width: 6rpx;
		height: 34rpx;
		background-color: #ff2c3c;
	}

	.user-sgin .main .day-list {
		width: 100%;
	}

	.user-sgin .main .day-list .item {
		width: 14.2%;
		margin-bottom: 10rpx;
	}

	.user-sgin .main .day-list .item .num {
		width: 68rpx;
		height: 68rpx;
		line-height: 58rpx;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #f2f2f2;
	}

	.user-sgin .main .day-list .item .circle {
		position: relative;
	}

	.user-sgin .main .day-list .item .circle::before {
		content: "";
		height: 6rpx;
		background-color: #f2f2f2;
		width: 34rpx;
		position: absolute;
		right: 68rpx;
		top: 34rpx;
	}

	.user-sgin .main .day-list .item:nth-of-type(7n+1) .circle::before {
		background-color: rgba(0, 0, 0, 0);
	}

	.user-sgin .main .day-list .item .active-circle::before {
		background-color: #FFBD40;
	
	}


	.user-sgin .main .right-sgin {
		padding: 35rpx 145rpx;
	}

	.user-sgin .main .right-sgin .primary-button {
		color: #fff;
		background: linear-gradient(270deg, rgba(249, 95, 47, 1) 0%, rgba(252, 67, 54, 1) 55%, rgba(255, 44, 60, 1) 100%);
	}

	.user-sgin .main .contain .task {
		border-top: 1px solid $-color-border;
	}

	.user-sgin .main .contain .task .item {
		padding: 23rpx 30rpx;
	}

	.user-sgin .main .contain .task .item .img {
		width: 74rpx;
		height: 74rpx;
		border-radius: 22rpx;
	}

	.user-sgin .main .contain .task .item .con {
		flex: 1;
	}

	.user-sgin .main .contain .task .item .btn {
		width: 154rpx;
		border: 1px solid #FF2C3C;
	}

	.user-sgin .main .contain .task .item .con .num {
		color: #FF2C3C;
	}

	.user-sgin .main .contain .task .item .primary {
		color: #FF2C3C;
	}

	.score-detail-entry {
		background-color: rgba(255, 255, 255, 0.3);
		border-radius: 100rpx 0rpx 0rpx 100rpx;
		padding: 12rpx 19rpx 12rpx 16rpx;
		align-self: flex-end;
	}

	.van-popup {
		background-color: rgba(0, 0, 0, 0) !important;
	}

	.pop-container {
		background-repeat: no-repeat;
		background-size: 100%;
		height: 626rpx;
		width: 560rpx;
		position: relative;
		background-image: url('../../static/jifen_popBg.png');
	}

	.u-mode-center-box {
		background-color: rgba(0, 0, 0, 0) !important;
	}

	.header-score {
		font-size: 46rpx;
		line-height: 36rpx;
		font-weight: bold;
		padding-top: 90rpx;
		padding-bottom: 150rpx;
		// color: #FF2C3C;
		color: #FF8412;
	}

	.desc {
		color: white;
		background: linear-gradient(82deg, rgba(250, 81, 50, 1) 0%, rgba(236, 60, 34, 1) 49%, rgba(250, 83, 50, 1) 100%);
		padding: 16rpx 22rpx 16rpx 42rpx;
		text-align: center;
	}


	.bottom-box {
		margin-top: 84rpx;
		text-align: center;
	}

	.primary-btn {
		margin: 0 60rpx;
		width: 440rpx;
		height: 74rpx;
		border-radius: 37rpx;
		padding: 16rpx 190rpx;
		// background: linear-gradient(#f95f2f 0%, #ff2c3c 100%);
		background: linear-gradient(#f95f2f 0%, #ff2c3c 100%);
	}

	.gray {
		background-color: #f2f2f2 !important;
	}
</style>

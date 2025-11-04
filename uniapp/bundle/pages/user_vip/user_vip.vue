<template>
	<view>
		<view class="user-vip">
			<view class="header">
				<view class="user-vip-info flex">
					<u-image width="110rpx" height="110rpx" border-radius="50%" :src="userInfo.avatar"></u-image>
					<view class="m-l-20">
						<view class="user-text white xxl flex">{{userInfo.nickname}}</view>
						<view class="flex">
							<view class="user-level white xs flex row-center m-t-10">当前等级：{{userInfo.level_name || "无"}}</view>
						</view>
					</view>
				</view>
			</view>
			<view class="content m-t-50">
				<view class="vip-swiper-container">
					<swiper class="swiper" style="height: 360rpx" previous-margin="30rpx"
					 :current="currentIndex" @change="bindchange">
						<swiper-item v-for="(item, index) in levelList" :key="index">
							<view class="vip-card-item" :style="'background-image: url(' + item.background_image + ');'">
								<view class="flex row-between">
									<view class="flex grade white sm">
										{{item.lock_desc}}
										<!-- <view v-if="item.current_level_status == 1" class="flex grade white sm">当前等级</view>
										<view v-else-if="item.current_level_status == -1" class="flex white sm ml20">未解锁</view>
										<view v-else-if="item.current_level_status == 0" class="flex white sm ml20">已解锁</view> -->
									</view>
									<image class="grade-icon m-r-34" :src="item.image"></image>
								</view>
								<view class="flex row-between vip-name white">
									<view class="bold">{{item.name}}</view>
									<!-- <view class="sm">{{item.tips2}}</view> -->
								</view>
								<view class="flex row-center m-l-30 m-r-30" v-if="item.diff_growth_percent">
									<view class="vip-progress bg-white flex">
										<view class="vip-progress-bar" :style="'width: ' + (item.diff_growth_percent*100) + '%'"></view>
									</view>
								</view>
								<view class="flex row-between m-t-30" style="padding: 0 30rpx">
									<view class="sm white" style="line-height: 36rpx" v-if="item.current_level_status == 0">
										{{item.tips1}}
									</view>
									<router-link to="/bundle/pages/user_growth/user_growth" class="flex" v-else>
										<view class="sm white" style="line-height: 36rpx">
											<!-- {{item.current_level_status == 0 ? '当前高于该等级' : item.current_growth_tips}} -->
											{{item.tips1}}  <u-icon name="arrow-right"></u-icon>
										</view>
									</router-link>
									<view class="white">{{item.tips2}}</view>
								</view>
							</view>
						</swiper-item>
					</swiper>
				</view>
				<view class="vip-grade-rule">
					<view class="title flex">
						<view class="line br60"></view>
						<view class="xl m-l-20 bold">说明</view>
					</view>
					<view class="p-t-20"> 
						<text class="rule-content column lighter">
							{{growthRule}}
						</text>
					</view>
				</view>
				<!-- <view class="vip-rights">
					<view class="title flex">
						<view class="line br60"></view>
						<view class="xl ml20 bold">会员权益</view>
					</view>
					<view class="rights-list flex">
						<view v-for="(item, index) in privilegeList" :key="index" class="rights-item column-center">
							<image class="mb10" :src="item.image"></image>
							<view class="sm">{{item.name}}</view>
						</view>
					</view>
				</view> -->
			</view>
		</view>
		<loading-view v-if="!userInfo.nickname"></loading-view>
	</view>
</template>

<script>
	import {
		getLevelList
	} from '@/api/user';

	export default {
		data() {
			return {
				userInfo: {},
				currentIndex: 0,
				levelList: [],
				growthRule: "",
				privilegeList: []
			};
		},


		onLoad() {
			this.getLevelListFun();
		},


		methods: {
			bindchange(e) {
				let {
					current
				} = e.detail;
				let currentLevel = this.levelList[current];
				this.currentIndex = current
			},

			getLevelListFun() {
				getLevelList().then(res => {
					const {
						code,
						data
					} = res;
					if (code != 1) return;
					const {
						user,
						level_intro,
						level
					} = data;
					let index = level.findIndex(item => item.current_level_status == 1);
					if (index == -1) index = 0;
					this.userInfo = user
					this.growthRule = level_intro
					this.levelList = level
					this.currentIndex = index
				});
			},
		}
	};
</script>
<style lang="scss">
	page {
		background-color: #fff;
		background-image: url(../../static/vip_grade_bg.png);
		background-size: 100% auto;
		background-repeat: no-repeat;
		.user-vip {
			.header {
				padding-top: 40rpx;
				.user-vip-info {
					padding-left: 30rpx;

					.user-level {
						border: 1px solid white;
						border-radius: 100rpx;
						padding: 4rpx 20rpx;
						line-height: 30rpx;
					}

					.user-text {
						line-height: 50rpx;
						font-weight: bold;
					}
				}
			}

			.content {

				.vip-card-item {
					height: 360rpx;
					width: 690rpx;
					position: relative;
					background-size: 100% 100%;

					.grade {
						line-height: 36rpx;
						background-color: rgba(0, 0, 0, 0.5);
						border-top-right-radius: 100rpx;
						border-bottom-right-radius: 100rpx;
						height: 50rpx;
						padding: 0 28rpx;
					}

					.user-grade {
						line-height: 36rpx;
						margin-left: 30rpx;
					}

					.grade-icon {
						width: 160rpx;
						height: 145rpx;
					}

					.vip-name {
						padding: 10rpx 30rpx;
						font-size: 46rpx;
						text-align: center;
						align-items: flex-end;
						margin-bottom: 30rpx;
						margin-top: -20rpx;
					}

					.vip-progress {
						height: 8rpx;
						border-radius: 8rpx;
						width: 100%;
						overflow: hidden;
						.vip-progress-bar {
							background-color: #f8d07c;
							height: 100%;
						}
					}

				}

				.vip-grade-rule {
					margin: 24rpx 40rpx;

					.title {
						.line {
							width: 8rpx;
							height: 34rpx;
							background-color: #f79c0c;
						}
					}
				}

				.vip-rights {
					margin: 24rpx 40rpx;

					.title {
						padding: 28rpx 0;

						.line {
							width: 8rpx;
							height: 34rpx;
							background-color: #f79c0c;
						}
					}

					.rights-item {
						width: 25%;
						padding-bottom: 30rpx;

						image {
							width: 82rpx;
							height: 82rpx;
						}
					}
				}

			}

		}
	}
</style>

<template>
	<view class="live-item" :class="{ 
		'live-item--row': type == 'row'
	}" @click="toLivePlayer">
	
		<view class="live-item__status" :class="{ 
			'live-item__status--not-started': data.live_status == 102,
			'live-item__status--closed': data.live_status == 103,
			'live-item__status--expired': data.live_status == 107
		}">
			<template v-if="data.live_status == 101">
				<u-icon name="/static/images/live.gif" :size="24" />
				<text class="status__text">{{ data.live_status_text }}</text>
			</template>
			<template v-else-if="data.live_status == 103">
				<u-icon name="play-circle" :size="28" />
				<text class="status__text">回放</text>
			</template>
			<template v-else-if="data.live_status == 102">
				<u-icon name="clock" :size="28" />
				<text class="status__text"> {{ data.start_time_tips }}</text>
			</template>
			<template v-else>
				<u-icon name="error-circle" :size="28" />
				<text class="status__text"> {{ data.live_status_text }}</text>
			</template>
		</view>
		<template v-if="type == 'column'">
			<view class="live-item__image">
				<view class="live-item__image-content">
					<u-image :src="data.feeds_img" width="100%" height="100%" mode="aspectFill" />
				</view>
			</view>
			
			<view class="live-item__content">
				<view class="shop-logo m-l-20" style="margin-top: -32rpx;">
					<u-avatar :src="data.shop.logo" :size="64"></u-avatar>
				</view>
				<view class="shop-name bold">
					{{ data.shop.name }}
				</view>
				<view class="line-2 xxs">
					{{ data.name }}
				</view>
			</view>
		</template>
		<template v-if="type == 'row'">
			<u-image :src="data.feeds_img" width="240rpx" height="240rpx" mode="aspectFill" />
			<view class="flex-1 m-l-20" style="min-width: 0;">
				<view class="line-2 xxl bold">
					{{ data.name }}
				</view>
				<view class="m-t-10">
					主播：{{ data.anchor_name }}
				</view>
				<view class="live-item__btn live-item__btn--start" v-if="data.live_status == 102">
					开播提醒
				</view>
				<view class="live-item__btn live-item__btn--ing" v-if="data.live_status == 101">
					立即观看
				</view>
			</view>
		</template>
	</view>
</template>

<script>
	import {
		toLivePlayer
	} from '@/utils/tools'
	export default {
		name: "live-item",
		props: {
			data: {
				type: Object,
				default: () => ({})
			},
			type: {
				type: String,
				default: 'column'
			}
		},
		data() {
			return {

			};
		},
		methods: {
			toLivePlayer() {
				toLivePlayer([this.data.wx_room_id])
			}
		}
	}
</script>

<style lang="scss">
	.live-item {
		width: 100%;
		position: relative;
		background-color: #fff;
		border-radius: 20rpx;
		overflow: hidden;
		&--row {
			border-radius: 0rpx;
			display: flex;
			padding: 20rpx;
			.live-item__status {
				top: 40rpx;
				left: 40rpx;
			}
		}

		&__image {
			padding-top: 80%;
			height: 0;
			position: relative;

			&-content {
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
			}
		}

		&__content {
			padding: 0 20rpx 14rpx;
		}

		&__status {
			position: absolute;
			top: 20rpx;
			left: 24rpx;
			z-index: 1;
			display: flex;
			align-items: center;
			background-color: $-color-primary;
			color: #fff;
			padding: 8rpx 20rpx;
			border-radius: 100rpx;
			&--not-started {
				background-color: #06AEE4;;
			}
			&--closed {
				background-color: #46B89B;;
			}
			&--expired {
				background-color: #fa3534;
			}
			& .status__text {
				margin-left: 4rpx;
				font-size: 22rpx;
			}
		}

		&__btn {
			width: 300rpx;
			border: 1px solid currentColor;
			padding: 10rpx 0;
			border-radius: 100rpx;
			text-align: center;
			margin-top: 20rpx;
			&--start {
				color: #06AEE4;
			}
			&--ing {
				color: $-color-primary;
			}
		}
	}
</style>

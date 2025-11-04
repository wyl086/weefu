<template>
	<view class="swiper-wrap">
		<swiper class="swiper" ref="swiper" :autoplay="autoplay" :circular="circular"
			:interval="interval" :duration="duration" @change="swiperChange">
			<swiper-item v-if="video">
				<view  class="video-wrap">
					<j-video :url="video" height="750rpx" width="750rpx" :poster="poster"></j-video>
				</view>
			</swiper-item>
			<block v-for="(item, index) in urls" :key="index">
				<swiper-item @tap="previewImage(index)">
					<u-image width="100%" height="750rpx" :src="item.url" :borderRadius="borderRadius"></u-image>
				</swiper-item>
			</block>
		</swiper>
		<view class="dots black sm bg-white br60">{{currentSwiper + 1}}/{{swiperLength}}</view>
	</view>
</template>

<script>
	var app = getApp();

	export default {
		data() {
			return {
				currentSwiper: 0,
				urls: [],
				showPlay: true,
				showControls: false,
				

			};
		},
		props: {
			imgUrls: {
				type: Array,
				default: () => [],
			},
			circular: {
				type: Boolean,
				default: true,
			},
			interval: {
				type: Number,
				default: 3000,
			},
			duration: {
				type: Number,
				default: 500,
			},
			video: {
				type: String,
			},
            autoplay: {
				type: Boolean,
                default: true
			},
            borderRadius: {
				type: [Number, String],
				default: 0,
            }
		},
		watch: {
			imgUrls: {
				handler(val) {
					this.urls = val.map(item => {
						return {
							url: item.uri || item.image,
						}
					});
				},
                immediate: true
			},
		},
		methods: {
			swiperChange(e) {
				this.currentSwiper = e.detail.current
			},
			
			previewImage(current) {
				uni.previewImage({
					current,
					urls: this.imgUrls.map((item) => item.uri)
				})
			},
		},
		computed: {
			poster() {
				return this.urls[0] ?  this.urls[0].url : ''
			},
			swiperLength() {
				let length = this.urls.length
				return this.video ? (++length) : length
			}
		}
	};
</script>
<style>
	.swiper-wrap {
		width: 100%;
		height: 750rpx;
		position: relative;
	}

	.swiper-wrap .swiper {
		width: 100%;
		height: 100%;
		position: relative;
	}

	.swiper-wrap .swiper .slide-image {
		width: 100%;
		height: 100%;
	}

	.swiper-wrap .dots {
		position: absolute;
		right: 24rpx;
		bottom: 24rpx;
		display: flex;
		height: 34rpx;
		padding: 0 15rpx;
	}

	.swiper-wrap .video-wrap {
		width: 100%;
		height: 100%;
		position: relative;
		overflow: hidden;
	}

	.swiper-wrap .my-video {
		width: 100%;
		height: 100%;
	}

	.swiper-wrap .icon-play {
		width: 90rpx;
		height: 90rpx;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 999;
	}
</style>

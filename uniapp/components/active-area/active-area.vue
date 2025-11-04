<template>
	<view :class="['active-area bg-white', type]">
		<view class="active-hd flex row-between" v-if="title">
			<view class="xxl bold">{{title}}</view>
			<router-link :to="url" v-if="url && type == 'hot'">
				<view  class="sm">更多 <u-icon name="arrow-right"></u-icon>
				</view>
			</router-link>
		</view>

		<view class="active-con">
			<scroll-view style="white-space: nowrap;" :scroll-x="true" v-if="type == 'hot'">
				<view class="goods-wrap">
					<goods-list :show-bg="false" type="row-hot" :list="list"></goods-list>
				</view>
			</scroll-view>
			<goods-list v-if="type == 'new'" type="new" :list="list" :show-bg="false"></goods-list>
		</view>
		<router-link :to="url" v-if="url && type == 'new'">
			<view class="bg-white xs flex row-center more">查看更多 <u-icon name="arrow-right">
				</u-icon>
			</view>
		</router-link>
	</view>
</template>

<script>
	export default {
		name: "active-area",
		props: {
			title: String,
			url: String,
			list: {
				type: Array,
				default: () => ([])
			},
			type: String
		},
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss" scoped>
	.active-area {
		background-size: 100% auto;
		background-repeat: no-repeat;
		border-radius: 14rpx;
		overflow: hidden;

		&.new {
			background-image: url(../../static/images/index_new_bg.png);
		}

		&.hot {
			background-image: url(../../static/images/index_hot_bg.png);
		}

		.active-hd {
			padding: 24rpx 20rpx;
		}

		.goods-wrap {
			padding: 0 20rpx 20rpx;
			display: inline-block;
		}

		.more {
			height: 80rpx;
			border-top: $-solid-border;
		}
	}
</style>

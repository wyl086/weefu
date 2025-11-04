<template>
	<view class="shop-item" :style="{'background-image': `url(${item.background})`}">
		<view class="shop-hd flex row-between m-l-20">
		    <view>                        
		        <view class="flex">                        
		            <u-image width="68rpx" height="68rpx" border-radius="60rpx" :src="item.logo" />
		            <view class="white md m-l-20 bold">{{item.name}}</view>
					<view class="store-tag xxs m-t-10 m-l-20 white" v-if="item.type == 1">
					    自营
					</view>
		        </view>
		        <router-link :to="{path: '/pages/store_index/store_index', query: {id: item.id} }">
					<view class="enter-btn flex row-center bg-white xxs">
						进店看看 >
					</view>
		        </router-link>
		    </view>
		    <view>
		    	<view class="shop-tips white flex row-center xxs">
		    	    {{item.visited_num}}人进店
		    	</view>
		    	<view class="m-t-30 white flex row-center xs m-r-10" v-if="item.distance">
		    	    <u-icon name="map" size="30"></u-icon>
					<text class="m-l-4">距离{{item.distance}}</text>
		    	</view>
		    </view>
		</view>
		<scroll-view style="white-space: nowrap;" :scroll-x="true">
			<view class="goods">
				<goods-list type="row" :list="item.goods_list"></goods-list>
			</view>
		</scroll-view>

	</view>
</template>

<script>
	export default {
		name: "shop-item",
		props: {
			item: {
				type: Object,
				defalut: () => ({})
			}
		},
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss">
	.shop-item {
		padding-top: 30rpx;
		background-repeat: no-repeat;
		background-size: cover;
		background-position: center;
		border-radius: 20rpx;
		background-color: #fff;
		.shop-hd {
			.store-tag {
				background: linear-gradient(267deg, #FF2C3C 0%, #F52E99 100%);
				border-radius: 6rpx;
				padding: 4rpx 9rpx;
			}
			.enter-btn {
			    height: 48rpx;
			    width: 148rpx;
			    margin-top: 30rpx;
			    border-radius: 50rpx;
			}
			.shop-tips {
			    background-color: rgba($color: #000000, $alpha: 0.6);
			    border-radius: 50rpx 0rpx 0rpx 50rpx;
			    height: 50rpx;
			    min-width: 152rpx;
				padding: 0 10rpx;
			}
		}
		.goods {
			padding: 20rpx;
			display: inline-block;
		}
	}
</style>

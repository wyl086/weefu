<template>
	<view class="shop-title flex" @tap.stop="toShop">
		<view class="xxs tag white m-r-10 flex-none" v-if="shop.type == 1">自营</view>
		<view class="shop-name line-1 bold">{{shop.shop_name || shop.name || name}}</view>
		<u-icon v-if="isLink" class="m-l-10 m-r-20" name="arrow-right" size="28" />
	</view>
</template>

<script>
	export default {
		name:"shop-title",
		options: {
		    virtualHost: true
		},
		props: {
            name: {
                type: String
            },
			shop: {
				type: Object
			},
			isLink: {
				type: Boolean,
				default:true
			}
		},
		data() {
			return {
				
			};
		},
        
		methods: {
			toShop() {
				const {isLink, shop} = this
				if(!isLink) return
				this.$Router.push({
					path: '/pages/store_index/store_index',
					query: {
						id: shop.shop_id ||  shop.id
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.shop-title {
	height: 80rpx;
	flex: 1;
	min-width: 0;
	.tag {
		background: linear-gradient(267deg, #FF2C3C 0%, #F52E99 100%);
		border-radius: 6rpx;
		padding: 5rpx 9rpx;
	}
}
</style>

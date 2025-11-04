<template>
	<view class="brand-list">
		<view v-if="hasData">
			<view class="p-t-30" v-for="(item, index) in brandList" :key="index">
				<view class="title muted m-b-10 m-l-30">{{item.letter}}</view>
				<view class="list flex flex-wrap bg-white col-top">
					<router-link class="item"  v-for="(titem, tindex) in item.list" :key="tindex" :to="{path: '/pages/goods_search/goods_search', query: {
						id: titem.id,
						name: titem.name,
						type: 0
					}}">
						<view class="flex-col col-center m-b-30">
							<u-image mode="aspectFit" width="150rpx" height="150rpx" :src="titem.image">
							</u-image>
							<view class="text-center m-t-10 xs">{{ titem.name }}</view>
						</view>
					</router-link>
				</view>
			</view>
		</view>
		<view class="details-null flex-col col-center" style="padding-top: 200rpx" v-else>
			<image class="img-null" src="/static/images/goods_null.png"></image>
			<view class="xs muted">暂无品牌~</view>
		</view>
	</view>
</template>

<script>
	import {
		getBrandList
	} from '@/api/store'
	export default {
		data() {
			return {
				brandList: [],
				hasData: true
			}
		},
		onLoad() {
			this.getBrandListFun()
		},
		methods: {
			async getBrandListFun() {
				const {
					data,
					code
				} = await getBrandList()
				if (code == 1) {
					if(!data.length) this.hasData = false
					this.brandList = data
				}
			}
		}
	}
</script>

<style lang="scss">
.brand-list {
	.list {
		margin: 0 20rpx;
		padding: 30rpx 20rpx 0;
		border-radius: 10rpx;
		.item {
			width: 25%;
		}
	}
}
</style>

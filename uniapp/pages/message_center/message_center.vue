<template>
	<view class="message-center p-t-10">
		<view class="bg-white">
			<view class="message-item" v-for="(item, index) in list" :key="index" >
				<router-link :to="{path: '/pages/notice/notice', query: {type: item.type}}">
					<view class="flex item-cell">
						<u-image width="76rpx" height="76rpx" :src="item.img"></u-image>
						<view class="item-info m-l-20 col">
							<view class="item-title lg">{{item.title}}</view>
							<view class="item-desc line-1 muted sm m-t-10">{{item.content}}</view>
						</view>
					</view>
				</router-link>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getNoticeLists,
		getMessageLists
	} from '@/api/store';

	export default {
		data() {
			return {
				list: []
			};
		},

		onLoad() {
			this.getMessageListsFun();
		},

		methods: {
			getMessageListsFun() {
				getMessageLists().then(res => {
					if (res.code == 1) {
						this.list = res.data;
					}
				});
			}

		}
	};
</script>
<style lang="scss">
	.message-center {
		.message-item {
			&:not(:last-of-type) {
				border-bottom: $-solid-border;
			}
			.item-cell {
				padding: 30rpx 20rpx;
				.item-desc {
					width: 610rpx; 
				}
			}
		}
	}
</style>

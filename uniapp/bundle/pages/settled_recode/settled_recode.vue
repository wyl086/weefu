<template>
	<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :down="downOption"
		:up="upOption">
		<view class="settled-recode">
			<view class="settled-list">
				<router-link v-for="(item, index) in list" :key="index" :to="{path: '/bundle/pages/settled_result/settled_result', query: {id: item.id}}">
					<view class="settled-item bg-white m-t-20">
						<!-- Title -->
						<view class="settled-title md bold">{{item.name}}</view>
						<view class="settled-info">
							<!-- Time -->
							<view class="sm muted m-t-26">
								提交时间：{{item.apply_time}}
							</view>
							<!-- Status -->
							<view class="flex row-between m-t-20">
								<view class="muted sm" style="align-self: flex-end;">
									<text>申请状态：</text>
									<text :class="{primary: item.audit_status == 3}">{{item.audit_status_desc}}</text>
								</view>
								<view class="watch-btn br60 flex row-center" @tap="onShowDetail">查看</view>
							</view>
						</view>
					</view>
				</router-link>
			</view>
		</view>
	</mescroll-body>
</template>

<script>
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins";
	import {
		shopApplyRecord
	} from '@/api/shop'
	export default {
		mixins: [MescrollMixin],
		data() {
			return {
				upOption: {
					empty: {
						icon: '/static/images/order_null.png',
						tip: "暂无记录",
					}
				},
				list: []
			};
		},
		methods: {
			upCallback(page) {
				shopApplyRecord({
					page_size: page.size,
					page_no: page.num
				}).then(({
					data
				}) => {
					if (page.num == 1) this.list = [];
					let curPageData = data.lists;
					let curPageLen = curPageData.length;
					let hasNext = !!data.more;
					this.list = this.list.concat(curPageData);
					this.mescroll.endSuccess(curPageLen, hasNext);
				}).catch(() => {
					this.mescroll.endErr()
				})
			},
		}
	}
</script>

<style lang="scss">
	.settled-recode {

		.settled-list {
			padding: 20rpx;

			.settled-item {
				border-radius: 10rpx;
				padding: 20rpx 30rpx 30rpx;

				.settled-title {
					padding: 21rpx 0 25rpx;
					border-bottom: $-solid-border;
				}

				.settled-info {

					.watch-btn {
						border: $-solid-border;
						height: 52rpx;
						width: 124rpx;
					}
				}
			}
		}
	}
</style>

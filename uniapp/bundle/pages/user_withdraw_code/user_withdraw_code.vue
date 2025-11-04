<!-- 账户明细 -->

<template>
	<view class="user-withdraw-code">
		<mescroll-body ref="mescrollRef" @init="mescrollInit" @up="upCallback" :up="upOption"
			@down="downCallback">
			<view class="list p-t-20">
				<view class="item bg-white" v-for="(item,index) in list" :key="index">
					<router-link :to="{path: '/bundle/pages/widthdraw_result/widthdraw_result', query: {id: item.id}}">
						<view class="flex row-between">
							<view class="md ">{{item.desc}}</view>
							<view>
								<text class="xxl">-{{item.money}}</text>
							</view>
						</view>
						<view class="flex row-between">
							<view class="xs muted">{{item.create_time}}</view>
							<view class="xs" :style="{color: [styleWithdrawStatus(item.status)]}">{{item.status_text}}</view>
						</view>
						<view class="m-t-10 sm primary" v-if="item.description && item.status == 4">
							{{item.description}}
						</view>
					</router-link>
				</view>
			</view>
		</mescroll-body>
	</view>
</template>

<script>
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import {
		getWithdrawRecords
	} from "@/api/user"
	export default {
		mixins: [MescrollMixin], // 使用mixin
		data() {
			return {
				upOption: {
					empty: {
						icon: '/static/images/order_null.png',
						tip: '暂无记录', // 提示
					}
				},
				list: [], // 列表数据--全部
			};
		},

		methods: {
		
			// 上拉加载 
			upCallback(page) {
				const pageNum = page.num; // 页码, 默认从1开始
				const pageSize = page.size; // 页长, 默认每页10条
				getWithdrawRecords({
					page_size: pageSize,
					page_no: pageNum,
				}).then(({
					data
				}) => {
					if (page.num == 1) this.list = [];
					const curPageData = data.list;
					const curPageLen = curPageData.length;
					const hasNext = !!data.more;
					this.list = this.list.concat(curPageData);
					this.mescroll.endSuccess(curPageLen, hasNext);
				}).catch(() => {
					this.mescroll.endErr()
				})

			},
			styleWithdrawStatus(status) {
			    switch(status) {
			        case 1: return '#0CC21E';
			        case 2: return '#666666';
			        case 3: return '#FF2C3C';
					case 4: return '#FF2C3C';
			    }
			}
		},

		onLoad(options) {
		
		}
	}
</script>

<style lang="scss" scoped>
.user-withdraw-code {
	.item {
	    padding: 22rpx 30rpx;
		&:not(:last-of-type) {
			border-bottom: $-solid-border;
		}
	}
}
</style>

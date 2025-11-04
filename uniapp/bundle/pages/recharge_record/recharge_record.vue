<!-- 账户明细 -->

<template>
	<view class="user-growth">
		<mescroll-body ref="mescrollRef" @init="mescrollInit" @up="upCallback" :up="upOption" @down="downCallback">
			<view class="p-t-20" >
				<view class="bg-white" v-for="(item, index) in list" :key="index" >
					<record-cell :remark="item.desc" :date="item.create_time" :money="item.total" :type="1" />
				</view>
			</view>
		</mescroll-body>
	</view>
</template>

<script>
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import {getRechargeRecord} from "@/api/user"
	export default {
		mixins: [MescrollMixin], // 使用mixin
		data() {
			return {
				// Tabs 列表
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
				getRechargeRecord({
					page_size: pageSize,
					page_no: pageNum
				}).then(({
					data
				}) => {
					if (page.num == 1) this.list = [];
					const curPageData = data.lists;
					const curPageLen = curPageData.length;
					const hasNext = !!data.more;
					this.list = this.list.concat(curPageData);
					this.mescroll.endSuccess(curPageLen, hasNext);
				}).catch(() => {
					this.mescroll.endErr()
				})

			}
		},
	}
</script>

<style scoped>
	
</style>
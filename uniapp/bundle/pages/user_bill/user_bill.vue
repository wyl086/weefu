<!-- 账户明细 -->

<template>
	<view class="user-bill">
		<mescroll-body ref="mescrollRef" @init="mescrollInit" @up="upCallback" :up="upOption"  @down="downCallback">
			<u-tabs :list="tabsList" :is-scroll="false" :current="currentTab" :bold="false" :active-color="colorConfig.primary"
				@change="changeTab" />
			<view class="p-t-20" >
				<view class="bg-white" v-for="(item, index) in list" :key="index" >
					<record-cell :remark="item.source_type" :date="item.create_time_format" :money="item.change_amount_format" :type="item.change_type" />
				</view>
			</view>
		</mescroll-body>
	</view>
</template>

<script>
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import {getAccountLog} from "@/api/user"
	export default {
		mixins: [MescrollMixin], // 使用mixin
		data() {
			return {
				// Tabs 列表
				tabsList: [{
					name: '全部'
				}, {
					name: '收入'
				}, {
					name: '支出'
				}],
				upOption: {
					empty: {
						icon: '/static/images/order_null.png',
						tip: '暂无记录', // 提示
					}
				},
				currentTab: 0,
				list: [], // 列表数据--全部
			};
		},

		methods: {
			// 改变当前的Tabs位置
			changeTab(index) {
				this.currentTab = index;
				this.list = []
				this.mescroll.resetUpScroll();
			},

			// 上拉加载 
			upCallback(page) {
				const pageNum = page.num; // 页码, 默认从1开始
				const pageSize = page.size; // 页长, 默认每页10条
				getAccountLog({
					page_size: pageSize,
					page_no: pageNum,
					source: 1,
					type: this.currentTab
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

			}
		},

		onLoad(options) {
			console.log(options, "option")
			this.currentTab = options.mode || 0;
		}
	}
</script>

<style scoped>
	
</style>

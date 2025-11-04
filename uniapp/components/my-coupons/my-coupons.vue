<template>
	<mescroll-uni ref="mescrollRef" top="80rpx" @init="mescrollInit" @down="downCallback" @up="upCallback"
		:down="downOption" :up="upOption">
		<view class="my-coupons">
			<coupon-list :list="couponList" :btnType="btnType"></coupon-list>
		</view>
	</mescroll-uni>
</template>

<script>
	import {
		getMyCoupon
	} from '@/api/activity';
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import MescrollMoreItemMixin from "@/components/mescroll-uni/mixins/mescroll-more-item.js";
	export default {
		mixins: [MescrollMixin, MescrollMoreItemMixin],
		data() {
			return {
				couponList: [],
				downOption: {
					auto: false // 不自动加载 (mixin已处理第一个tab触发downCallback)
				},
				upOption: {
					auto: false, // 不自动加载
					noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
					empty: {
						icon: '/static/images/coupon_null.png',
						tip: '暂无优惠券', // 提示
						fixed: true
					}
				},
			};
		},

		props: {
			type: {
				type: String
			},
			btnType: {
				type: Number
			}
		},
		methods: {
			upCallback(page) {
				const {
					type
				} = this;
				const pageNum = page.num; // 页码, 默认从1开始
				const pageSize = page.size; // 页长, 默认每页10条
				getMyCoupon({
					page_size: pageSize,
					page_no: pageNum,
					type
				}).then(({
					data
				}) => {
					let curPageData = data.lists;
					let curPageLen = curPageData.length;
					let hasNext = !!data.more;
					if (page.num == 1) this.couponList = [];
					this.couponList = this.couponList.concat(curPageData);
					this.mescroll.endSuccess(curPageLen, hasNext);
				})
			},
		
		}
	};
</script>
<style>

</style>

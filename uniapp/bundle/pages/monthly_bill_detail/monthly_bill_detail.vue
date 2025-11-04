<template>
	<view class="monthly-bill-detail">
		<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback"
			:up="upOption">
			<view class="content">
				<view class="order-container">
					<view v-for="(item, index) in orderList" :key="index" class="order-item bg-white m-t-20">
						<view class="order-header flex row-between">
							<view>订单编号：{{item.order_sn}}</view>
						</view>
						<view class="order-content flex">
							<view>
								<u-image width="180rpx" height="180rpx" border-radius="6px" :src="item.goods_image" />
							</view>
							<view class="order-goods-info flex-1 m-l-20">
								<view class="name sm line-2">{{item.goods_name}}</view>
								<view class="flex row-between m-t-6">
									<view class="xs muted"> 
									<text class="m-r-10">
										数量
									</text>
									<text class="normal nr">{{item.goods_num}}</text></view>
									<view class="xs">
										<text class="muted m-r-10">付款金额</text>
										<price-format  :subscript-size="28" :first-size="28" :second-size="28"
										 :price="item.pay_price" />
									</view>
								</view>
								<view class="pre-income muted sm m-t-10">
									<text class="m-r-10">预估收益</text>
									<price-format :subscript-size="28" :first-size="28" :second-size="28"
										:color="colorConfig.primary" :price="item.money" />
								</view>
							</view>
						</view>
						<view class="order-footer flex row-between">
							<view class="time muted">{{item.create_time}}</view>
							<view class="static sm" :style="'color: ' + (item.status == 1 ? '#F95F2F' : '#07CE1B')">
								{{item.statusDesc}}</view>
						</view>
					</view>
				</view>
			</view>
			<u-select v-model="showPop" :list="months" mode="single-column" @confirm="changeMonths"></u-select>
		</mescroll-body>
	</view>
</template>

<script>
	// +----------------------------------------------------------------------
// | multshop开源商城系统
// +----------------------------------------------------------------------
// | 欢迎阅读学习系统程序代码，建议反馈是我们前进的动力
// | gitee下载：https://gitee.com/multshop_gitee
// | github下载：https://github.com/multshop-github
// | 访问官网：https://www.multshop.cn
// | 访问社区：https://home.multshop.cn
// | 访问手册：http://doc.multshop.cn
// | 微信公众号：multshop技术社区
// | multshop系列产品在gitee、github等公开渠道开源版本可免费商用，未经许可不能去除前后端官方版权标识
// |  multshop系列产品收费版本务必购买商业授权，购买去版权授权后，方可去除前后端官方版权标识
// | 禁止对系统程序代码以任何目的，任何形式的再发布
// | multshop团队版权所有并拥有最终解释权
// +----------------------------------------------------------------------
// | author: multshop.cn.team
// +----------------------------------------------------------------------
	import {
		getMonthOrderDetail
	} from "@/api/user";
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins";
	
	export default {
			mixins: [MescrollMixin],
		data() {
			return {
				orderList: [],
				upOption: {
					empty: {
						icon: '/static/images/order_null.png',
						tip: '暂无数据~', // 提示
					}
				},
			};
		},

		onLoad() {
			const {month, year} = this.$Route.query
			this.year = year;
			this.month = Number(month)
			uni.setNavigationBarTitle({
				title: this.month + '月账单明细'
			})
		},


		methods: {
			upCallback(page) {
				let pageNum = page.num; // 页码, 默认从1开始
				let pageSize = page.size; // 页长, 默认每页10条
				let {
					year,
					month
				} = this;
				getMonthOrderDetail({
					page_size: pageSize,
					page_no: pageNum,
					year: year,
					month: month
				}).then(({
					data
				}) => {
					if (page.num == 1) this.orderList = [];
					let curPageData = data.list;
					let curPageLen = curPageData.length;
					let hasNext = !!data.more;
					this.orderList = this.orderList.concat(curPageData);
					this.mescroll.endSuccess(curPageLen, hasNext);
				}).catch(() => {
					this.mescroll.endErr()
				})
			},

		}
	};
</script>
<style lang="scss">

	.monthly-bill-detail .content {
		padding: 0 20rpx;
		.order-item {
			border-radius: 14rpx;
			.order-header {
				padding: 20rpx 30rpx;
				border-bottom: $-solid-border;
				.guide-shop-btn {
					background: linear-gradient(80deg, #F95F2F 0%, #FF2C3C 100%);
					border-radius: 4rpx;
					width: 134rpx;
					height: 42rpx;
				}
			}
			.order-content {
				padding: 20rpx 30rpx 20rpx 20rpx;
				border-bottom: $-solid-border;
			}
			.order-footer {
				padding: 20rpx 30rpx 20rpx 20rpx;
				.static {
					color: #F95F2F;
				}
				
			}
		}
	}

</style>

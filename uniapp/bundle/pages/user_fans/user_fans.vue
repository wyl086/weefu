<template>
	<mescroll-body ref="mescrollRef" @init="mescrollInit" @up="upCallback" :up="upOption" :down="downOption"
		@down="downCallback">
		<view class="user-fans">
			<view class="header">
				<u-search v-model="keyword" shape="round" background="white" placeholder="请输入搜索关键词" @search="changeTab"
					@custom="changeTab" />
				<view class="top-bar flex bg-white md">
					<view class="bar-item flex" :class="{'item-active': active == 'all'}" @tap="changeTab('all')">全部粉丝
					</view>
					<view class="bar-item flex" :class="{'item-active': active == 'first'}" @tap="changeTab('first')">
						一级粉丝</view>
					<view class="bar-item flex" :class="{'item-active': active == 'second'}" @tap="changeTab('second')">
						二级粉丝</view>
				</view>
				<view class="sort-bar flex bg-white">
					<view class="sort-bar-item flex row-center" @tap="sortChange(0)">
						<view :class="sortType == 0 ? 'item-active' : ''">团队排序</view>
						<view class="arrow-icon flex-col col-center row-center">
							<u-icon name="arrow-up-fill"
								:color="fansSort == 'asc' ? colorConfig.primary : colorConfig.normal"></u-icon>
							<u-icon name="arrow-down-fill"
								:color="fansSort == 'desc' ? colorConfig.primary : colorConfig.normal"></u-icon>
						</view>
					</view>
					<view class="sort-bar-item flex row-center" @tap="sortChange(1)">
						<view :class="sortType == 1 ? 'item-active' : ''">金额排序</view>
						<view class="arrow-icon flex-col col-center row-center">
							<u-icon name="arrow-up-fill"
								:color="moneySort == 'asc' ? colorConfig.primary : colorConfig.normal"></u-icon>
							<u-icon name="arrow-down-fill"
								:color="moneySort == 'desc' ? colorConfig.primary : colorConfig.normal"></u-icon>
						</view>
					</view>
					<view class="sort-bar-item flex row-center" @tap="sortChange(2)">
						<view :class="sortType == 2 ? 'item-active' : ''">订单排序</view>
						<view class="arrow-icon flex-col col-center row-center">
							<u-icon name="arrow-up-fill"
								:color="orderSort == 'asc' ? colorConfig.primary : colorConfig.normal"></u-icon>
							<u-icon name="arrow-down-fill"
								:color="orderSort == 'desc' ? colorConfig.primary : colorConfig.normal"></u-icon>
						</view>
					</view>
				</view>
			</view>
			<view class="content">
				<view class="card-box p-t-20">
					<view v-for="(item, index) in fansList" :key="index" class="card-item flex row-between bg-white p-20">
						<view class="flex">
							<u-image :src="item.avatar" border-radius="50%" width="100rpx" height="100rpx" />
							<view class="fans-info m-l-20">
								<view class="fans-name bold line-1">{{item.nickname}}</view>
								<view class="flex lighter m-t-20">
									<view v-if="item.mobile" class="m-r-20">{{item.mobile}}</view>
									<view>{{item.create_time}}</view>
								</view>
							</view>
						</view>
						<view class="flex-col xs flex-none m-l-20">
							<view class="msg"><span class="primary">{{item.fans_team}} </span>人</view>
							<view class="m-t-5 msg"><span>{{item.fans_order}} </span>单</view>
							<view class="m-t-5 msg"><span>{{item.fans_money}} </span>元</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</mescroll-body>
</template>

<script>
	import {
		sortType,
	} from '@/utils/type';
	import {
		getUserFans
	} from '@/api/user';
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	export default {
		mixins: [MescrollMixin], // 使用mixin
		data() {
			return {
				upOption: {
					empty: {
						icon: '/static/images/order_null.png',
						tip: '暂无相关数据', // 提示
					}
				},
				active: 'all',
				sortType: -1,
				keyword: "",
				fansSort: sortType.NONE,
				moneySort: sortType.NONE,
				orderSort: sortType.NONE,
				fansList: []
			};
		},
		methods: {
			onRefresh() {
				this.fansList = []
				this.mescroll.resetUpScroll();
			},

			// 上拉加载 
			upCallback(page) {
				const {
					fansSort,
					moneySort,
					orderSort,
					active,
					keyword,
				} = this;
				const params = {
					type: active,
					keyword,
					fans: fansSort,
					money: moneySort,
					order: orderSort,
					page_size: page.size,
					page_no: page.num,
				};
				getUserFans(params).then(({
					data
				}) => {
					if (page.num == 1) this.fansList = [];
					const curPageData = data.list;
					const curPageLen = curPageData.length;
					const hasNext = !!data.more;
					this.fansList = this.fansList.concat(curPageData);
					this.mescroll.endSuccess(curPageLen, hasNext);
				}).catch(() => {
					this.mescroll.endErr()
				})

			},

			changeTab(val) {
				this.active = val
				this.onRefresh()
			},

			// 排序状态变化 
			sortChange(type) {
				let {
					fansSort,
					moneySort,
					orderSort
				} = this;

				this.sortType = parseInt(type)

				switch (this.sortType) {
					case 0:
						// 团队排序
						if (fansSort == sortType.DESC || fansSort == sortType.NONE) {
							this.fansSort = sortType.ASC;
							this.moneySort = sortType.NONE
							this.orderSort = sortType.NONE
						} else if (fansSort == sortType.ASC) {
							this.fansSort = sortType.DESC;
							this.moneySort = sortType.NONE;
							this.orderSort = sortType.NONE;
						}
						break;

					case 1:
						// 金额排序
						if (moneySort == sortType.DESC || moneySort == sortType.NONE) {
							this.moneySort = sortType.ASC;
							this.fansSort = sortType.NONE;
							this.orderSort = sortType.NONE
						} else if (moneySort == sortType.ASC) {
							this.moneySort = sortType.DESC;
							this.fansSort = sortType.NONE;
							this.orderSort = sortType.NONE;
						}

						break;
					case 2:
						// 订单排序
						if (orderSort == sortType.DESC || orderSort == sortType.NONE) {
							this.orderSort = sortType.ASC;
							this.moneySort = sortType.NONE;
							this.fansSort = sortType.NONE;
						} else if (orderSort == sortType.ASC) {
							this.orderSort = sortType.DESC;
							this.moneySort = sortType.NONE;
							this.fansSort = sortType.NONE;
						}

						break;
				}

				this.onRefresh()
			}
		}
	};
</script>
<style lang="scss">
	.user-fans {
		.header {
			.top-bar {
				padding: 18rpx 50rpx;
				height: 100rpx;

				.bar-item {
					flex: 1;
					padding: 0 30rpx;
					height: 58rpx;

					&:not(:last-of-type) {
						margin-right: 54rpx;
					}
				}

				.item-active {
					color: white;
					background-color: $-color-primary;
					border-radius: 100rpx;
				}
			}

			.sort-bar {
				height: 80rpx;

				.sort-bar-item {
					flex: 1;

					.arrow-icon {
						transform: scale(0.36);
					}

					.item-active {
						color: $-color-primary;
					}
				}
			}
		}
	}

	.content {
		.card-box {
			.card-item {
				.fans-name {
					width: 500rpx;
				}
				&:not(:last-of-type) {
					border-bottom: $-solid-border;
				}
			}
		}
	}
</style>

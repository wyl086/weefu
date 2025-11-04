<template>
	<mescroll-uni ref="mescrollRef" top="80rpx" @init="mescrollInit" @down="downCallback" @up="upCallback"
		:down="downOption" :up="upOption">
		<view class="sale-list" v-if="type == 'normal'">
			<view v-for="(items, index) in lists" :key="index" class="sale-item bg-white m-t-20">
				<view class="sale-header">
					<shop-title :shop="{name: items.shop_name, id: items.sid}"></shop-title>
				</view>
				<view v-for="(item, index2) in items.order_goods" :key="index2" class="goods-item">
					<view class="sale-content flex row">
						<view class="goods-img">
							<u-image width="160rpx" height="160rpx" border-radius="6rpx" :src="item.image" />
						</view>
						<view class="goods-desc flex-1 m-l-24">
							<view class="goods-name line-2">{{item.goods_name}}</view>
							<view class="m-t-10 line-1 muted">{{item.spec_value_str}}</view>
							<view class="flex row-between m-t-20">
								<price-format class="sm" :first-size="30" :second-size="30" :subscript-size="26"
									:price="item.goods_price" />
								<view>x{{item.goods_num}}</view>
							</view>
						</view>
					</view>
					<view class="sale-footer flex row-right">
						<view class="btn row-center primary br60"
							:class="{'gray-btn': items.after_sale.able_apply == 0}" @tap="applyRefund(items,item)">
							申请售后
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="sale-list" v-else-if="type == 'apply'">
			<view v-for="(items, index) in lists" :key="index" class="sale-item bg-white m-t-20">
				<view class="sale-header flex row-between">
					<shop-title :shop="{name: items.shop_name, id: items.sid}"></shop-title>
					<view class="primary flex-none m-l-20">{{items.after_sale.type_text}}</view>
				</view>
				<view  v-for="(item, index2) in items.order_goods" :key="index2"> 
					<router-link :to="{path: '/bundle/pages/after_sales_detail/after_sales_detail',
						query: { id: items.after_sale.after_sale_id,}}">
						<view class="sale-content">
							<view class="flex">
								<view class="goods-img">
									<u-image width="160rpx" height="160rpx" border-radius="6rpx" :src="item.image" />
								</view>
								<view class="goods-desc m-l-24">
									<view class="goods-name line-2">{{item.goods_name}}</view>
									<view class="m-t-10 xs line-1 muted">{{item.spec_value_str}}</view>
									<view class="flex row-between m-t-20">
										<price-format class="sm" :first-size="30" :second-size="30" :subscript-size="26"
											:price="item.goods_price" />
										<view>x{{item.goods_num}}</view>
									</view>
								</view>
							</view>
							<view class="sale-status m-t-20 flex">
								<view class="bold">申请状态</view>
								<view class="m-l-20">{{items.after_sale.desc}}</view>
							</view>
						</view>
					</router-link>
					<view class="sale-footer flex row-right">
						<view class="row-center flex br60 m-r-20 btn black-btn"
							@tap="onShowDialog(items.after_sale.after_sale_id)">
							撤销申请
						</view>
						<router-link :to="{path: '/bundle/pages/apply_refund/apply_refund',
								query: { 
								after_sale_id: items.after_sale.after_sale_id, 
								order_id: items.order_id,
								item_id: item.item_id}}" v-if="items.after_sale.status == 4 || items.after_sale.status == 1">
							<view class="row-center flex br60 m-r-20 btn primary">重新申请</view>
						</router-link>
						<router-link
							:to="{path: '/bundle/pages/input_express_info/input_express_info', query: { id: items.after_sale.after_sale_id}}"
							v-if="items.after_sale.status == 2">
							<view class="row-center flex br60 m-r-20 btn black-btn">
								填写快递单号
							</view>
						</router-link>
					</view>
				</view>
			</view>
		</view>
		<view class="sale-list" v-else>
			<view v-for="(items, index) in lists" :key="index" class="sale-item bg-white m-t-20">
				<view class="sale-header flex row-between">
					<shop-title :shop="{name: items.shop_name, id: items.sid}"></shop-title>
					<view class="primary flex-none m-l-20">{{items.after_sale.type_text}}</view>
				</view>
				<view  v-for="(item, index2) in items.order_goods" :key="index2"> 
					<router-link :to="{path: '/bundle/pages/after_sales_detail/after_sales_detail',
						query: { id: items.after_sale.after_sale_id,}}">
						<view class="sale-content">
							<view class="flex">
								<view class="goods-img">
									<u-image width="160rpx" height="160rpx" border-radius="6rpx" :src="item.image" />
								</view>
								<view class="goods-desc m-l-24">
									<view class="goods-name line-2">{{item.goods_name}}</view>
									<view class="m-t-10 line-1 muted">{{item.spec_value_str}}</view>
									<view class="flex row-between m-t-20">
										<price-format class="sm" :first-size="30" :second-size="30" :subscript-size="26"
											:price="item.goods_price" />
										<view>x{{item.goods_num}}</view>
									</view>
								</view>
							</view>
							<view class="sale-status m-t-20 flex">
								<view class="bold">申请状态</view>
								<view class="m-l-20">{{items.after_sale.desc}}</view>
							</view>
						</view>
					</router-link>
				</view>
			</view>
		</view>
		<u-modal v-model="showDialog" confirm-text="确定" :showCancelButton="true" :confirm-color="colorConfig.primary"
			@confirm="cancelApplyFun">
			<view class="flex-col col-center tips-dialog" style="padding: 30rpx 0;">
				<image class="icon-lg" src="/static/images/icon_warning.png"></image>
				<view class="m-t-30">是否要撤销申请？</view>
			</view>
		</u-modal>
	</mescroll-uni>
</template>

<script>
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import MescrollMoreItemMixin from "@/components/mescroll-uni/mixins/mescroll-more-item.js";
	import {
		afterSaleType
	} from "@/utils/type";
	import {
		getAfterSaleList,
		cancelApply,
		afterSaleDetail,
		applyAgain
	} from "@/api/user";

	export default {
		mixins: [MescrollMixin, MescrollMoreItemMixin],

		props: {
			type: {
				type: String,
				default: afterSaleType.NORMAL
			}
		},
		data() {
			return {
				lists: [],
				downOption: {
					auto: false // 不自动加载 (mixin已处理第一个tab触发downCallback)
				},
				upOption: {
					auto: false, // 不自动加载
					noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
					empty: {
						icon: '/static/images/order_null.png',
						tip: '暂无售后~', // 提示
						fixed: true
					}
				},
				showDialog: false
			};
		},

		created() {
			uni.$on("refreshsale", () => {
				this.downCallback()
			})
		},
		destroyed() {
			uni.$off("refreshsale")
		},
		methods: {
			applyRefund(items, item) {
				const {
					after_sale: {
						able_apply
					},
					order_id
				} = items
				const {
					item_id
				} = item
				if (able_apply != 1) {
					return
				}
				this.$Router.push({
					path: '/bundle/pages/apply_refund/apply_refund',
					query: {
						order_id,
						item_id
					}
				})
			},
			cancelApplyFun() {
				cancelApply({
					id: this.id
				}).then(res => {
					if (res.code == 1) {
						this.$toast({
							title: res.msg
						});
						uni.$emit("refreshsale")
					}
				});
			},

			async upCallback(page) {
				const {
					type,
				} = this;
				const params = {
					page_size: page.size,
					page_no: page.num,
					type
				}
				const {
					data,
					code
				} = await getAfterSaleList(params)
				if (code == 1) {
					const curPageData = data.list;
					const curPageLen = curPageData.length;
					const hasNext = !!data.more;
					if (page.num == 1) this.lists = [];
					this.lists = this.lists.concat(curPageData);
					this.mescroll.endSuccess(curPageLen, hasNext);
				}
			},

			onShowDialog(id) {
				this.id = id;
				this.showDialog = true
			}

		}
	};
</script>
<style lang="scss">
	.sale-list {
		overflow: hidden;

		.sale-item {
			.sale-header {
				padding: 0 20rpx;
			}

			.sale-content {
				padding: 20rpx 24rpx;

				.sale-status {
					padding: 20rpx 40rpx;
					background-color: #F6F6F6;
					border-radius: 6rpx;
				}

				.goods-desc {
					min-width: 500rpx;
				}
			}

			.sale-footer {
				padding: 0 24rpx 22rpx;

				.btn {
					padding: 9rpx 34rpx;
					border: 1px solid $-color-primary;

					&.gray-btn {
						border-color: $-color-border;
						color: $-color-muted;
					}

					&.black-btn {
						border-color: $-color-border;
						color: $-color-normal;
					}
				}
			}
		}
	}
</style>

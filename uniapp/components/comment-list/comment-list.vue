<template>
	<mescroll-uni ref="mescrollRef" top="80rpx" @init="mescrollInit" @down="downCallback" @up="upCallback"
		:down="downOption" :up="upOption">
		<view class="comment-list">
			<view v-for="(item, index) in list" :key="index" class="comment-item bg-white m-t-20">
				<view v-if="type == 1">
					<view class="m-l-20">
						<shop-title :shop="item.shop"></shop-title>
					</view>
					<view v-for="(gitem, gindex) in item.order_goods_un_comment" :key="gindex">
						<router-link :to="{path: '/pages/goods_details/goods_details', query: {id: gitem.goods_id}}">
							<view class="comment-goods flex">
								<u-image width="160rpx" height="160rpx" border-radius="6rpx"
									:src="gitem.goods_item.image"></u-image>
								<view class="goods-desc flex-1 m-l-24">
									<view class="goods-name line-2">{{gitem.goods_name}}</view>
									<view class="m-t-10 xs muted line-1">{{gitem.goods_item.spec_value_str}}</view>
									<view class="flex row-between m-t-20">
										<price-format :price="gitem.goods_price" :subscript-size="26" :first-size="30"
											:second-size="30" />
										<view class="nr">x{{gitem.goods_num}}</view>
									</view>
								</view>
							</view>
						</router-link>
						<view class="evaluate-footer flex row-right" @click="checkGoods(gitem.goods_id, gitem.id)">
							<view class="btn flex row-center primary br60">评价商品</view>
						</view>
					</view>
				</view>
				<view v-if="type == 2">
					<view class="p-20">
						<view class="p-b-20 time">
							<view class="muted xs">评价时间: {{item.create_time}}</view>
						</view>
						<view v-if="item.comment" class="m-t-20">
							{{item.comment}}
						</view>
						<view v-if="item.goods_comment_image_arr && item.goods_comment_image_arr.length" class="flex flex-wrap m-t-20">
							<view v-for="(iitem, idx) in item.goods_comment_image_arr" :key="idx" class="comment-img"
								@tap="previewImage(item.goods_comment_image_arr, idx, $event)">
								<u-image width="160rpx" height="160rpx" border-radius="6rpx" :src="iitem" />
							</view>
						</view>
						<view class="comment-goods flex bg-body m-t-20">
							<u-image width="160rpx" height="160rpx" border-radius="6rpx" :src="item.goods_item.image">
							</u-image>
							<view class="goods-desc flex-1 m-l-24">
								<view class="goods-name line-2">{{item.goods.name}}</view>
								<view class="m-t-10 xs muted line-1">{{item.goods_item.spec_value_str}}</view>
								<view  class="flex m-t-10">
									<view class="sm m-r-10 muted">评分</view>
									<u-rate :disabled="true" :value="item.goods_comment" :active-color="colorConfig.primary"
										:size="36" />
								</view>
						
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		</view>
	</mescroll-uni>
</template>

<script>
	import {
		getUnComment,
		getComment,
		apiCheckGoods
	} from "@/api/user";
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import MescrollMoreItemMixin from "@/components/mescroll-uni/mixins/mescroll-more-item.js";
	export default {
		mixins: [MescrollMixin, MescrollMoreItemMixin],
		data() {
			return {
				list: [],
				downOption: {
					auto: false // 不自动加载 (mixin已处理第一个tab触发downCallback)
				},
				upOption: {
					auto: false, // 不自动加载
					noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
					empty: {
						icon: '/static/images/goods_null.png',
						tip: '暂无评价~', // 提示
						fixed: true
					}
				},
			};
		},

		props: {
			type: {
				type: Number | String
			}
		},
		created() {
			uni.$on("refreshcomment", () => {
				this.downCallback()
			})
		},
		destroyed() {
			uni.$off("refreshcomment")
		},

		methods: {
			checkGoods(goods_id, order_goods_id) {
				apiCheckGoods({  goods_id: goods_id }).then((res) => {
					if(res.code == 1) {
						this.$Router.push({
							path: '/bundle/pages/goods_reviews/goods_reviews',
							query: {
								id: order_goods_id
							}
						})
					}
				})
			},
			
			async upCallback(page) {
				const {
					type,
				} = this;
				const params = {
					page_size: page.size,
					page_no: page.num
				}
				console.log(type)
				const {
					data,
					code
				} = type == 1 ? await getUnComment(params) : await getComment(params)
				if (code == 1) {
					const curPageData = data.lists;
					const curPageLen = curPageData.length;
					const hasNext = !!data.more;
					if (page.num == 1) this.list = [];
					this.list = this.list.concat(curPageData);
					this.mescroll.endSuccess(curPageLen, hasNext);
				}
			},
			previewImage(urls, current) {
				console.log(urls, current)
				uni.previewImage({
					current,
					// 当前显示图片的http链接
					urls // 需要预览的图片http链接列表

				});
			}

		}
	};
</script>
<style lang="scss" scoped>
	.comment-list {
		.comment-goods {
			padding: 20rpx 24rpx;

			.goods-desc {
				min-width: 500rpx;
			}
			
		}
		.time {
			border-bottom: $-solid-border;
		}
	}

	.comment-item {
		.comment-img {
			margin-bottom: 20rpx;

			&:not(:nth-last-of-type(4n+1)) {
				margin-right: 20rpx;
			}
		}

		.evaluate-footer {
			padding: 0 24rpx 28rpx;

			.btn {
				width: 178rpx;
				height: 52rpx;
				border: 1px solid $-color-primary;
			}
		}
	}


	
</style>

<template>
	<view>
		<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :up="upOption">
			<view class="all-comments">
			<view class="header bg-white" v-if="!isEmpty">
				<view class="title xs">
					<text class="lighter m-r-10">商品好评率</text>
					<text class="primary">{{percent}}</text>
				</view>
				<view class="tab flex flex-wrap">
					<view v-for="(item, index) in categoryList"
						:class="'tab-item xs m-r-10  br60 m-b-20 ' + (type == item.id ?  'bg-primary white' : 'bg-gray' )"
						:key="index" @tap="onChangType(index)" v-show="item.count">
						{{item.name}}({{item.count}})
					</view>
				</view>
			</view>
			<view class="main bg-white">
				<view class="evaluation-list">
					<view v-for="(item, index) in commentList" :key="index" class="evaluation-item">
						<view class="user-info flex">
							<image class="avatar m-r-20" :src="item.avatar"></image>
							<view class="user-name md m-r-10">{{item.nickname}}</view>
							<u-rate disabled size="26rpx" :color="colorConfig.primary" v-model="item.goods_comment">
							</u-rate>
						</view>
						<view class="muted xs m-t-10">
							<text class="m-r-20">{{item.create_time}}</text>
							<text v-show="item.spec_value_str">{{item.spec_value_str}}</text>
						</view>
						<view v-if="item.comment" class="dec m-t-20">{{item.comment}}</view>
						<view class="img m-t-20 flex flex-wrap" v-if="item.image.length">
							<view v-for="(imgitem, imgindex) in item.image" :key="imgindex"
								class="img-item m-r-20 m-b-20" :data-current="imgitem" :data-uri="item.image"
								@tap="previewImage">
								<u-image width="160rpx" fit="cover" height="160rpx" radius="6rpx" lazy-load
									class="goods-img" :src="imgitem" />
							</view>
						</view>
						<view class="seller-recall-container bg-gray m-t-10" v-if="item.reply">
							<view class="lighter">
								商家回复：
								<text class="normal">{{item.reply}}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
	</view>
	</mescroll-body>
	</view>
</template>

<script>

	import {
		getCommentList,
		getCommentCategory
	} from '@/api/store';
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins";
	export default {
		mixins: [MescrollMixin],
		data() {
			return {
				active: 0,
				type: '',
				commentList: [],
				categoryList: [],
				percent: '',
				isEmpty: true,
				upOption:{
					auto: false,
					empty: {
						icon: '/static/images/goods_null.png',
						tip : "暂无评价",
					}
				},
			};
		},

		onLoad(options) {
			this.id = this.$Route.query.id;
		},
		onShow() {
			this.id = this.$Route.query.id;
		},
		methods: {
			async downCallback(page) {
				
				await this.getCommentCategoryFun()
				this.mescroll.resetUpScroll();
			},
			upCallback(page) {
				let pageNum = page.num; // 页码, 默认从1开始
				let pageSize = page.size; // 页长, 默认每页10条
				getCommentList({
					type: this.type,
					goods_id: this.id,
					page_no: pageNum,
					page_size: pageSize
				}).then(res => {
					if (res.code == 1) {
						let curPageData = res.data.lists;
						let curPageLen = curPageData.length;
						let hasNext = !!res.data.more;
						if (page.num == 1) this.commentList = [];
						this.commentList = this.commentList.concat(curPageData);
						this.mescroll.endSuccess(curPageLen, hasNext);
					}
				})
			},
			onChangType(index) {
				this.active = index
				this.type = this.categoryList[index].id
				this.commentList = []
				this.mescroll.resetUpScroll();
			},

			getCommentCategoryFun() {
				return new Promise(resolve => {
					getCommentCategory(this.id).then(res => {
						let {
							code,
							data: {
								comment,
								percent
							}
						} = res;
						if (code == 1) {
							this.categoryList = comment;
							this.percent = percent;
							this.type = comment[this.active].id
							this.isEmpty = !comment[0].count
							this.$nextTick(() => resolve());
						}
					});
				});
			},

			previewImage(e) {
				const {
					current,
					uri
				} = e.currentTarget.dataset;
				let urls = uri;
				uni.previewImage({
					current,
					// 当前显示图片的http链接
					urls // 需要预览的图片http链接列表

				});
			}

		}
	};
</script>
<style lang="scss">
	.all-comments {
		padding-top: 20rpx;

		.header {
			.title {
				padding: 24rpx 26rpx;
				border-bottom: var(--border);
			}

			.tab {
				padding: 30rpx 0 10rpx 20rpx;
				flex-wrap: wrap;

				.tab-item {
					padding: 9rpx 29rpx;
				}
			}
		}

		.main {
			.evaluation-list {
				.evaluation-item {
					padding: 20rpx;

					&:not(:last-of-type) {
						border-bottom: $-solid-border;
					}

					.avatar {
						width: 60rpx;
						height: 60rpx;
						border-radius: 50%;
					}

					.seller-recall-container {
						padding: 24rpx 20rpx;
						border-radius: 12rpx;
					}
				}
			}
		}
	}
</style>

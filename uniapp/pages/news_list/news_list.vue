<template>
	<view class="news-list">
		<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback"
			:up="upOption">
			<view class="contain">
				<view class="banner">
					<ad-swipers v-if="type == 0" :pid="14" height="340rpx">
					</ad-swipers>
					<ad-swipers v-if="type == 1" :pid="15" height="340rpx">
					</ad-swipers>
				</view>
				<tabs :current="active" @change="changeActive" :bar-width="60">
					<tab name="全部"></tab>
					<tab v-for="(item, index) in categoryList" :key="index" :name="item.name"></tab>
				</tabs>
				<view class="main">
					<view class="article-list">
						<view class="article-item bg-white"  v-for="(item, index) in newsList" :key="index" >
							<router-link :to="{path: '/pages/news_details/news_details', query: {id: item.id, type}}">
								<view class="flex col-top">
									<view class="info flex-1">
										<view class="title lg line-2 m-b-20">{{ item.title }}</view>
										<view class="lighter line-2">
											<view>{{ item.intro }}</view>
										</view>
									</view>
									<u-image width="240rpx" height="180rpx" class="img m-l-20" :src="item.image" />
								</view>
								<view class="flex row-between m-t-20">
									<view class="xs muted">发布时间: {{item.create_time}}</view>
									<view class="flex">
										<image class="icon-sm" src="/static/images/icon_see.png"></image>
										<view class="m-l-10 xs muted">{{ item.visit }}人浏览</view>
									</view>
								</view>
							</router-link>
						</view>
					</view>
				</view>
			</view>

		</mescroll-body>
	</view>
</template>

<script>
	import {
		getCategoryList,
		getArticleList
	} from '@/api/store';
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins";
	export default {
		mixins: [MescrollMixin],
		data() {
			return {
				active: 0,
				upOption: {
					auto: false,
					empty: {
						icon: '/static/images/news_null.png',
						tip: "暂无数据",
					}
				},
				categoryList: [],
				newsList: [],
				type: -1,
			};
		},

		onLoad(options) {
			this.type = this.$Route.query.type || 0;
			if (this.type) {
				uni.setNavigationBarTitle({
					title: '帮助中心'
				});
			} else {
				uni.setNavigationBarTitle({
					title: '商城资讯'
				});
			}

		},

		methods: {
			changeActive(e) {
				this.active = e;
				this.newsList = [] // 先置空列表,显示加载进度
				this.mescroll.resetUpScroll() // 再刷新列表数据
			},
			async downCallback() {
				await this.getCategoryListFun();
				this.mescroll.resetUpScroll();
			},
			upCallback(page) {
				const { type, active, categoryList } = this
				getArticleList({
					type: this.type,
					cid: this.active ? categoryList[active - 1].id : '',
					page_size:page.size,
					page_no:page.num
				}).then(({
					data
				}) => {
					if (page.num == 1) this.newsList = [];
					let curPageData = data.list;
					let curPageLen = curPageData.length;
					let hasNext = !!data.more;
					this.newsList = this.newsList.concat(curPageData);
					this.mescroll.endSuccess(curPageLen, hasNext);
				}).catch(() => {
					this.mescroll.endErr()
				})
			},
			async getCategoryListFun() {
				const {
					code,
					data
				} = await getCategoryList({
					type: this.type
				})
				if (code == 1) {
					this.categoryList = data
				}
			},
		}
	};
</script>
<style lang="scss">
	.news-list {
		.main {
			.article-list {
				padding-top: 20rpx;

				.article-item {
					padding: 20rpx;
					align-items: flex-start;
					&:not(:last-of-type){
						border-bottom: $-solid-border;
					}
				}
			}
		}
	}
</style>

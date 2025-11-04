<template>
    <view class="topic">
        <view class="header flex row-between">
            <view class="normal lg bold"># {{ topicName }}</view>
            <view class="flex">
                <image src="/bundle_b/static/icon_see.png"></image>
                <text class="lighter sm m-l-10">{{ click }}</text>
            </view>
        </view>

        <!-- Menu -->
        <view class="menu flex">
            <view class="menu--item" :class="{'active': sortHot}" @click="handleSortHot">最热</view>
            <view class="menu--item" :class="{'active': sortNew}" @click="handleSortNew">最新</view>
        </view>

        <view>
            <view v-if="lists.length">
                <u-waterfall ref="uWaterfall" v-model="lists" :add-time="200">
                    <template v-slot:left="{leftList}">
                        <view style="padding:0 9rpx 0 30rpx">
                            <community-list width="336rpx" type="waterfall" :list="leftList"></community-list>
                        </view>
                    </template>
                    <template v-slot:right="{rightList}">
                        <view style="padding:0 30rpx 0 9rpx;">
                            <community-list width="336rpx" type="waterfall" :list="rightList"></community-list>
                        </view>
                    </template>
                </u-waterfall>
            </view>
            <view class="p-t-60" v-else>
                <view class="flex row-center m-t-40">
                    <u-image width="300" height="300" :src="'/bundle_b/static/works_null.png'"></u-image>
                </view>
                <view class="text-center muted m-t-40">
                    暂无话题文章～
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    import {
        getCommunityTopicArticle
    } from "@/api/community.js"
    export default {
        data() {
            return {
                topicId: '',
                topicName: '',
                sortHot: true,
                sortNew: false,
                lists: [],
                click: 0, //查看｜点击数
                page: 1,
                more: 1,
                pageSize: 10
            }
        },
        onLoad() {
            const options = this.$Route.query;
            this.topicId = options.id || '';
            this.topicName = options.name || '';
        },
        onShow() {
            this.getCommunityTopic()
        },
        // 触底加载
        onReachBottom() {
            console.log('触底')
            if (this.more) {
                this.getCommunityTopic()
            }
        },
        methods: {
            handleSortHot() {
                this.sortHot = !this.sortHot
                this.page = 1;
                this.getCommunityTopic()
            },
            handleSortNew() {
                this.sortNew = !this.sortNew
                this.page = 1;
                this.getCommunityTopic()
            },
            // 获取
            getCommunityTopic() {
                getCommunityTopicArticle({
                    topic_id: this.topicId,
                    sort_hot: this.sortHot ? 'desc' : 'asc',
                    sort_new: this.sortNew ? 'desc' : 'asc',
                    page_no: this.page,
                    page_size: this.pageSize,
                }).then(res => {
                   // 如果是第一页需手动置空列表
                   if (this.page == 1) {
                       if('uWaterfall' in this.$refs) this.$refs.uWaterfall.clear()
                       this.lists = []
                   }
                   if (res.data.more === 1) {
                       this.page += 1
                   }
                   this.click = res.data.click
                   this.more = res.data.lists.more;
                   // 异步：让vue能够监听到数据改变过了
                   setTimeout(() => {
                       this.lists = [...this.lists, ...res.data.lists.list]
                   }, 0)
                })
            },
        }
    }
</script>

<style lang="scss">
    page {
        background-color: #FFFFFF;
    }

    .topic {
        .header {
            padding: 40rpx 40rpx 30rpx 30rpx;
            border-top: 1px solid $-color-body;
            border-bottom: 1px solid $-color-body;

            image {
                width: 42rpx;
                height: 42rpx;
            }
        }

        .menu {
            padding: 0 30rpx;

            &--item {
                margin: 20rpx 0;
                font-size: 28rpx;
                color: $-color-muted;
                margin-right: 50rpx;
            }

            .active {
                color: $-color-primary;
                font-weight: 500;
            }
        }
    }
</style>

<template>
    <mescroll-uni ref="mescrollRef" top="80rpx" @init="mescrollInit" @down="downCallback" @up="upCallback"
        :down="downOption" :up="upOption">
        <view class="collection-list">
            <view class="goods-list p-t-20" v-show="type == 1">
                <view v-for="(item, index) in collectionList" :key="item.id">
                    <u-swipe-action :show="selectIndex == item.id" :index="item.id" bg-color="transparent"
                        :btn-width="130" @click="clickBtn" @open="open" :options="options">
                        <view class="collection-item flex bg-white" @tap="toGoods(item)">
                            <u-image width="160rpx" height="160rpx" border-radius="6rpx" lazy-load class="m-r-20"
                                :src="item.image" />
                            <view class="info flex-1">
                                <view class="flex row-between">
                                    <view class="name line-2">{{item.name}}</view>
                                </view>
                                <view class="flex row-between m-t-20">
                                    <price-format :first-size="30" :second-size="26" :price="item.min_price"
                                        :weight="400" :subscript-size="30" :color="colorConfig.primary" />
                                    <view class="btn primary flex row-center br60 sm"
                                        :class="{'valid muted': item.is_valid == 0}">
                                        {{ item.is_valid == 0 ? '已失效' : '去购买'}}
                                    </view>
                                </view>
                            </view>
                        </view>
                    </u-swipe-action>
                </view>
            </view>

            <view class="store-list" v-show="type == 2">
                <view class="m-t-20" v-for="(item, index) in collectionList" :key="item.id">
                    <u-swipe-action :show="selectIndex == item.id" :index="item.id" bg-color="transparent"
                        :btn-width="130" @click="clickBtn" @open="open" :options="options">
                        <view class="store-item bg-white flex" @tap="toShop(item)">
                            <u-image width="80rpx" height="80rpx" border-radius="60rpx" :src="item.logo" />
                            <view class="flex-1 m-l-10">
                                <view class="store-name lg">
                                    {{item.name}}<text class="xxs tag white m-l-10 line-1"
                                        v-if="item.type == 1">自营</text>
                                </view>
                                <view class="m-t-12 xs muted flex row-between">
                                    主营行业：{{item.cid_desc}}
                                    <view class="xs" v-if="item.score!=0">
                                        评分:
                                        <text style="color: #ffa200">
                                            {{item.score}}
                                        </text>
                                    </view>
                                </view>
                            </view>
                            <!-- <view class="flex muted xs">
                					评分：<view style="color: #FFA200;">{{item.score}}</view>
                				</view> -->
                        </view>
                    </u-swipe-action>
                </view>
            </view>
        </view>
    </mescroll-uni>
</template>

<script>
    import {
        getCollectGoods,
        getCollectShop,
        collectGoods
    } from '@/api/user'
    import {
        changeShopFollow
    } from '@/api/shop'
    import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
    import MescrollMoreItemMixin from "@/components/mescroll-uni/mixins/mescroll-more-item.js";
    export default {
        mixins: [MescrollMixin, MescrollMoreItemMixin],
        name: "collection-list",
        props: {
            type: {
                type: [String, Number]
            }
        },
        data() {
            return {
                collectionList: [],
                downOption: {
                    auto: false // 不自动加载 (mixin已处理第一个tab触发downCallback)
                },
                upOption: {
                    auto: false, // 不自动加载
                    noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
                    empty: {
                        icon: '/static/images/goods_null.png',
                        tip: '暂无收藏~', // 提示
                        fixed: true
                    }
                },
                options: [{
                    text: '取消收藏',
                    style: {
                        backgroundColor: '#FF2C3C'
                    }
                }],
                selectIndex: -1
            };
        },
        methods: {
            async upCallback(page) {
                let pageNum = page.num; // 页码, 默认从1开始
                let pageSize = page.size; // 页长, 默认每页10条
                let {
                    type,
                } = this;
                const {
                    data,
                    code
                } = type == 1 ? await getCollectGoods({
                    page_size: pageSize,
                    page_no: pageNum
                }) : await getCollectShop({
                    page_size: pageSize,
                    page_no: pageNum
                })
                if (code == 1) {
                    let curPageData = data.lists;
                    let curPageLen = curPageData.length;
                    let hasNext = !!data.more;
                    if (page.num == 1) this.collectionList = [];

                    this.collectionList = this.collectionList.concat(curPageData);
                    this.mescroll.endSuccess(curPageLen, hasNext);
                }
            },
            toGoods(item) {
                if (item.is_valid) {
                    this.$Router.push({
                        path: '/pages/goods_details/goods_details',
                        query: {
                            id: item.id
                        }
                    })
                }
            },
            toShop(item) {
                this.$Router.push({
                    path: '/pages/store_index/store_index',
                    query: {
                        id: item.id
                    }
                })
            },
            open(index) {
                // 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
                // 原本为'false'，再次设置为'false'会无效
                this.selectIndex = index;
                // }
            },
            async clickBtn(index) {
                const {
                    code,
                    data,
                    msg
                } = this.type == 1 ? await collectGoods({
                    goods_id: index
                }) : await changeShopFollow({
                    shop_id: index
                })
                if (code == 1) {
                    this.$toast({
                        title: msg
                    })
                    this.downCallback()
                }
            }
        },
    }
</script>

<style lang="scss">
    .collection-list {
        width: 100%;

        .goods-list {
            .collection-item {
                padding: 20rpx;

                &:not(:last-of-type) {
                    border-bottom: $-solid-border;
                }

                .btn {
                    width: 148rpx;
                    height: 52rpx;
                    border: 1px solid $-color-primary;

                    &.valid {
                        background-color: #f2f2f2;
                        border-color: transparent;
                    }
                }
            }
        }

        .store-list {
            margin: 0 20rpx;

            .store-item {
                padding: 15rpx 20rpx;
                border-radius: 16rpx;

                .store-name {}

                .tag {
                    background: linear-gradient(267deg, #FF2C3C 0%, #F52E99 100%);
                    border-radius: 6rpx;
                    padding: 0 9rpx;
                    vertical-align: 5rpx;
                }
            }
        }
    }
</style>

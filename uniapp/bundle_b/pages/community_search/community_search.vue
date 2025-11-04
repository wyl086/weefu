<template>
    <view class="goods-search flex-col">
        <view class="header-wrap">
            <view class="search">
                <u-search v-model="keyword" @focus="showHistory = true" :focus="showHistory" @search="onSearch"
                    bg-color="#F4F4F4"></u-search>
            </view>
        </view>
        <view v-show="showHistory" class="search-content bg-white">
            <scroll-view :scroll-y="true" style="height: 100%">
                <view v-if="hotList.length" class="search-words">
                    <view class="title">热门搜索</view>
                    <view class="words flex flex-wrap">
                        <block v-for="(item, index) in hotList" :key="index">
                            <navigator hover-class="none" class="" 
                                :url="'/bundle_b/pages/community_topic/community_topic?id=' + item.id +'&name=' + item.name">
                                <view class="item br60  m-r-20 m-b-20 lighter sm line-1">
                                    {{item.name}}
                                </view>
                            </navigator>
                        </block>
                    </view>
                </view>
                <view v-if="historyList.length" class="search-words">
                    <view class="title flex row-between">
                        <view>历史搜索</view>
                        <view class="xs muted m-r-20" style="padding: 10rpx 20rpx" @tap="clearSearchFun">清空</view>
                    </view>
                    <view class="words flex flex-wrap">
                        <view v-for="(item, index) in historyList" :key="index"
                            class="item br60  m-r-20 m-b-20 lighter sm line-1" @tap="onChangeKeyword(item)">{{item}}
                        </view>
                    </view>
                </view>
            </scroll-view>
        </view>
        <view class="content">
            <mescroll-uni ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :up="upOption"
                :down="{auto: false}" :fixed="false">
                <view class="goods-list" v-if="goodsList.length">
                    <u-waterfall ref="uWaterfall" v-model="goodsList" :add-time="20">
                        <template v-slot:left="{leftList}">
                            <view style="padding:0 9rpx 0 30rpx">
                                <community-list width="336rpx" type="waterfall" :list="leftList"></community-list>
                            </view>
                        </template>
                        <template v-slot:right="{rightList}">
                            <view style="padding:0 30rpx 0 9rpx;">
                                <!-- {{ JSON.stringify(rightList) }} -->
                                <community-list width="336rpx" type="waterfall" :list="rightList"></community-list>
                            </view>
                        </template>
                    </u-waterfall>
                </view>
            </mescroll-uni>
        </view>
    </view>
</template>

<script>
    import {
        getCommunityArticleLists,
        getCommunitySearchHistory,
        apiCommunityClearSearchHistory
    } from '@/api/community.js';
    import {
        mapGetters
    } from 'vuex';
    import {
        getRect,
        trottle
    } from '@/utils/tools';
    import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins";
    export default {
        mixins: [MescrollMixin],
        data() {
            return {
                upOption: {
                    auto: false,
                    empty: {
                        icon: '/static/images/news_null.png',
                        tip: "暂无种草文章",
                    }
                },
                keyword: '',
                sortConfig: {
                    goodsType: 'double',
                    priceSort: '',
                    saleSort: '',
                },
                goodsList: [],
                showHistory: false,
                hotList: [],
                historyList: []
            };
        },

        watch: {
            // 监听属性
            keyword(value, old) {
                if (!value && !this.id) {
                    this.showHistory = true
                }
            },
            showHistory(value) {
                if (value) {
                    this.getSearchpageFun();
                }
            },
            'sortConfig.saleSort'() {
                this.onSearch()
            },
            'sortConfig.priceSort'() {
                this.onSearch()
            }

        },

        onLoad(options) {
            this.onSearch = trottle(this.onSearch, 500, this);
            this.init(options);

            uni.$on('changeItem', (event) => {
                const index = this.goodsList.findIndex(el => el.id == event.id)
                if (index == -1) return
                this.$refs.uWaterfall.modify(event.id, 'like', event.like)
                this.$refs.uWaterfall.modify(event.id, 'is_like', event.is_like)
            })
        },
        
        onUnload() {
        	uni.$off("changeItem")
        },
        
        computed: {
            ...mapGetters(['sysInfo'])
        },
        methods: {
            downCallback() {
                this.onRefresh()
            },
            upCallback(page) {
                let pageNum = page.num; // 页码, 默认从1开始
                let pageSize = page.size; // 页长, 默认每页10条
                let {
                    goodsList,
                    keyword,
                    sortConfig: {
                        priceSort,
                        saleSort,
                    }
                } = this;
                const params = {
                    page_size: pageSize,
                    page_no: pageNum,
                    platform_cate_id: this.type == 1 ? this.id : '',
                    brand_id: this.type == 0 ? this.id : '',
                    keyword,
                    sort_by_price: priceSort,
                    sort_by_sales: saleSort
                }
                getCommunityArticleLists(params).then(({
                    data
                }) => {
                    if (page.num == 1) this.goodsList = [];
                    let curPageData = data.list;
                    let curPageLen = curPageData.length;
                    let hasNext = !!data.more;
                    this.goodsList = this.goodsList.concat(curPageData);
                    this.mescroll.endSuccess(curPageLen, hasNext);
                }).catch(() => {
                    this.mescroll.endErr()
                })
            },
            onChange(e) {
                this.keyword = e.value
            },


            clearSearchFun() {
                apiCommunityClearSearchHistory().then(res => {
                    if (res.code == 1) {
                        this.getSearchpageFun();
                    }
                });
            },



            init(option) {
                const {
                    id,
                    name,
                    type
                } = this.$Route.query
                this.type = type
                if (id) {
                    uni.setNavigationBarTitle({
                        title: name
                    });
                    this.id = id;
                    this.$nextTick(() => {
                        this.onRefresh()
                    })
                } else {
                    uni.setNavigationBarTitle({
                        title: '种草搜索'
                    });
                    this.showHistory = true

                }
            },

            getSearchpageFun() {
                getCommunitySearchHistory().then(res => {
                    if (res.code == 1) {
                        let {
                            history,
                            topic
                        } = res.data;
                        this.hotList = topic
                        this.historyList = history
                    }
                });
            },

            onClear() {
                if (this.id) {
                    this.onRefresh();
                }
            },
            onSearch() {
                this.showHistory = false
                this.$nextTick(() => {
                    this.onRefresh()
                })
            },
            onRefresh() {
                this.goodsList = []
                this.mescroll.resetUpScroll();
            },

            onChangeKeyword(item) {
                this.keyword = item
                this.showHistory = false
                this.onRefresh();
            },
        }
    };
</script>
<style lang="scss">
    page {
        height: 100%;
        padding: 0;
    }

    .goods-search {
        height: 100%;
        position: relative;

        .header-wrap {
            position: relative;
            z-index: 999;

            .search {
                box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.03);
                position: relative;
                z-index: 1;
            }
        }

        .search-content {
            position: absolute;
            width: 100%;
            height: 100%;
            padding-top: 100rpx;
            z-index: 100;

            .search-words {
                padding-left: 24rpx;
                padding-bottom: 20rpx;

                .title {
                    padding: 26rpx 0;
                }

                .words {
                    .item {
                        line-height: 52rpx;
                        height: 52rpx;
                        padding: 0 24rpx;
                        background-color: #F5F5F5;
                    }
                }
            }
        }

        .content {
            flex: 1;
            min-height: 0;

            .goods-list {
                overflow: hidden;
            }
        }
    }
</style>

<template>
    <view class="index-home p-t-20">
        <!-- 轮播 -->
        <ad-swipers :pid="7" height="312rpx" padding="0 30rpx" radius="20rpx"></ad-swipers>

        <bubble-tips top="280rpx" :discharge="isDischarge"></bubble-tips>

        <view class="content">
            <!-- 导航入口 -->
            <view class="nav bg-white m-t-20" v-if="newNavList.length">
                <swiper :style="'height:' + navSwiperH + 'rpx;'" @change="swiperChange">
                    <swiper-item v-for="(items, index) in newNavList" :key="index">
                        <view class="nav-list flex flex-wrap">
                            <view
                                v-for="(item, index2) in items"
                                :key="index2"
                                class="nav-item m-t-30"
                                @tap="menuJump(item)"
                            >
                                <view class="flex-col col-center">
                                    <image class="nav-icon m-b-15" :src="item.image"></image>
                                    <view class="name xs">{{ item.name }}</view>
                                </view>
                            </view>
                        </view>
                    </swiper-item>
                </swiper>
                <view class="dots" v-if="newNavList.length > 1">
                    <view
                        v-for="(item, index) in newNavList"
                        :key="index"
                        :class="'dot ' + (index == currentSwiper ? 'active' : '')"
                    ></view>
                </view>
            </view>
            <!-- 中部广告 -->
            <ad-swipers
                :pid="8"
                height="165rpx"
                :is-swiper="false"
                padding="20rpx 0 0"
                radius="20rpx"
            >
            </ad-swipers>
            <!-- 资讯 -->
            <router-link
                v-if="newsList.length"
                class=""
                :to="{ path: '/pages/news_list/news_list' }"
            >
                <view class="information bg-white flex m-t-20">
                    <image class="icon-toutiao" src="/static/images/icon_toutiao.png"></image>
                    <text class="gap-line"></text>
                    <view class="news flex-1 flex">
                        <view class="shade"></view>
                        <swiper
                            class="flex-1"
                            autoplay="true"
                            style="height: 76rpx"
                            vertical="true"
                            circular="true"
                            :interval="3000"
                        >
                            <swiper-item
                                v-for="(item, index) in newsList"
                                :key="index"
                                class="flex"
                            >
                                <view class="flex-none">
                                    <u-tag
                                        v-if="item.is_new"
                                        shape="circle"
                                        text="最新"
                                        size="mini"
                                        type="primary"
                                        mode="plain"
                                    />
                                </view>
                                <view class="text-swiper m-l-10 line-1">{{ item.title }}</view>
                            </swiper-item>
                        </swiper>
                    </view>
                    <u-icon name="arrow-right"></u-icon>
                </view>
            </router-link>
            <!-- 活动专区 -->
            <view class="activity-zone m-t-20" v-if="activityArea.length">
                <view class="flex p-20 row-center xxl bold white"> 活动专区 </view>
                <view class="list flex flex-wrap row-between">
                    <router-link
                        :to="{
                            path: '/bundle/pages/activity_detail/activity_detail',
                            query: { name: item.name, title: item.title, id: item.id }
                        }"
                        v-for="(item, index) in activityArea"
                        :key="index"
                    >
                        <view class="item flex bg-white m-b-20">
                            <u-image width="120rpx" height="120rpx" :src="item.image"></u-image>
                            <view class="m-l-20 flex-1">
                                <view class="bold lg line-1 desc">{{ item.name }}</view>
                                <view class="primary sm m-t-5 line-1 desc">{{ item.title }}</view>
                                <view class="br60 bg-primary white xxs m-t-10 btn">前往查看</view>
                            </view>
                        </view>
                    </router-link>
                </view>
            </view>
            <!-- #ifdef MP-WEIXIN -->
            <view class="live m-t-20" v-if="appConfig.index_setting.live_room && liveList.length">
                <view class="live-header flex row-between">
                    <view class="xxl bold">直播间</view>
                    <router-link to="/bundle_b/pages/live_room/live_room">
                        <view class="sm">更多 <u-icon name="arrow-right"></u-icon> </view>
                    </router-link>
                </view>
                <view class="live-lists">
                    <scroll-view scroll-x="true">
                        <view class="inline">
                            <view class="flex p-l-20">
                                <view
                                    v-for="item in liveList"
                                    class="m-r-20"
                                    style="width: 286rpx"
                                    :key="item.id"
                                >
                                    <live-item :data="item"></live-item>
                                </view>
                            </view>
                        </view>
                    </scroll-view>
                </view>
            </view>
            <!-- #endif -->
            <!-- 秒杀 -->
            <view class="seckill m-t-20" v-if="seckillGoods.length">
                <home-seckill :list="seckillGoods"></home-seckill>
            </view>

            <!-- 附近店铺 -->
            <view class="m-t-20" v-if="nearbyShop.length">
                <shop-recommend
                    type="nearby-shops"
                    title="附近店铺"
                    :list="nearbyShop"
                    url="/bundle_b/pages/nearby_shops/nearby_shops"
                ></shop-recommend>
            </view>

            <view class="m-t-20" v-if="appConfig.index_setting.host_show && hotGoods.length">
                <active-area
                    :list="hotGoods"
                    type="hot"
                    title="热销榜单"
                    url="/pages/active_list/active_list?type=hot"
                ></active-area>
            </view>
            <view class="m-t-20" v-if="appConfig.index_setting.new_show && newGoods.length">
                <active-area
                    :list="newGoods"
                    type="new"
                    title="新品推荐"
                    url="/pages/active_list/active_list?type=new"
                ></active-area>
            </view>

            <!-- 种草社区  -->
            <view
                class="m-t-20"
                v-if="appConfig.index_setting.community_show && communityArticle.length"
            >
                <community-recommend
                    :list="communityArticle"
                    title="种草社区"
                    url="/pages/community/community"
                ></community-recommend>
            </view>

            <!-- 店铺 -->
            <view class="m-t-20" v-if="appConfig.index_setting.shop_show && shopLists.length">
                <shop-recommend
                    type="shop-recommends"
                    title="店铺推荐"
                    :list="shopLists"
                ></shop-recommend>
            </view>

            <view
                class="m-t-20"
                v-if="appConfig.index_setting.shop_show && shopRecommend.length"
                v-for="(item, index) in shopRecommend"
                :key="index"
            >
                <shop-item :item="item"></shop-item>
            </view>
        </view>
    </view>
</template>

<script>
import { arraySlice, menuJump } from '@/utils/tools'
import { mapGetters } from 'vuex'
export default {
    props: {
        navList: {
            type: Array,
            default: () => []
        },
        list: {
            type: Array,
            default: () => []
        },
        homeData: {
            type: Object,
            default: () => ({})
        },
        liveList: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            newNavList: [],
            navSwiperH: '',
            currentSwiper: 0,
            isDischarge: false,
            goodsList: []
        }
    },
    mounted() {
        this.isDischarge = false
    },
    destroyed() {
        this.isDischarge = true
    },
    methods: {
        swiperChange(e) {
            console.log(e)
            this.currentSwiper = e.detail.current
        },
        menuJump(item) {
            menuJump(item)
        }
    },
    watch: {
        navList(val) {
            if (val.length <= 5) {
                this.navSwiperH = 200
            } else {
                this.navSwiperH = 374
            }
            this.newNavList = arraySlice(val)
        },
        list(val) {
            this.goodsList = val
        }
    },
    computed: {
        ...mapGetters(['appConfig']),
        newsList() {
            return this.homeData.headlines || []
        },
        nearbyShop() {
            return this.homeData.nearby_shops || []
        },
        hotGoods() {
            return this.homeData.hots || []
        },
        newGoods() {
            return this.homeData.news || []
        },
        communityArticle() {
            return this.homeData.community_article || []
        },
        activityList() {
            return this.homeData.activity_area || []
        },
        shopRecommend() {
            return this.homeData.shop_recommend || []
        },
        shopLists() {
            return this.homeData.shop_lists || []
        },
        seckillGoods() {
            return this.homeData.seckill_goods || []
        },
        activityArea() {
            return this.homeData.activity_area || []
        }
    }
}
</script>

<style lang="scss" scoped>
.index-home {
    .content {
        padding: 0 30rpx 20rpx;

        .nav {
            position: relative;
            border-radius: 20rpx;

            .nav-item {
                width: 20%;

                .nav-icon {
                    width: 82rpx;
                    height: 82rpx;
                }
            }

            .dots {
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
                bottom: 20rpx;
                display: flex;

                .dot {
                    width: 10rpx;
                    height: 6rpx;
                    border-radius: 6rpx;
                    margin-right: 10rpx;
                    background-color: rgba(255, 44, 60, 0.4);

                    &.active {
                        width: 20rpx;
                        background-color: $-color-primary;
                    }
                }
            }
        }

        .information {
            height: 76rpx;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.06);
            padding: 0 20rpx;
            border-radius: 20rpx;

            .news {
                position: relative;

                .shade {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    z-index: 100;
                }
            }

            .icon-toutiao {
                width: 114rpx;
                height: 34rpx;
            }

            .gap-line {
                height: 28rpx;
                width: 1px;
                background-color: #dcdddc;
                margin: 0 30rpx;
            }
        }

        .title-iamge {
            width: 200rpx;
            height: 100rpx;
        }

        .activity-zone {
            background-image: url(data:image/png;base64,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);
            background-size: 100% auto;
            padding: 0 15rpx;
            border-radius: 14rpx;
            .item {
                border-radius: 14rpx;
                width: 324rpx;
                padding: 20rpx 16rpx;
                .desc {
                    width: 160rpx;
                }
                .btn {
                    display: inline-block;
                    padding: 2rpx 20rpx;
                }
            }
        }
        .live {
            background: linear-gradient(
                180deg,
                rgba(255, 233, 233, 1) 0%,
                rgba(255, 255, 255, 1) 74%
            );
            padding-bottom: 28rpx;
            border-radius: 14rpx;
            .live-header {
                padding: 28rpx 24rpx;
            }
        }
    }
}
</style>

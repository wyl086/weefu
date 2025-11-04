<template>
    <view>
        <view v-if="shopInfo.is_freeze === 1 || shopInfo.is_expire === 1 || shopInfo.is_run === 0">
            <shop-stop
                :is_freeze="shopInfo.is_freeze"
                :is_expire="shopInfo.is_expire"
                :is_run="shopInfo.is_run"
            ></shop-stop>
        </view>
        <view class="store-index" v-else>
            <view
                class="store-header"
                :style="{
                    'background-image': `url(${
                        shopInfo.background
                            ? shopInfo.background
                            : $getImageUri('/static/common/image/default/shopindex.png')
                    })`
                }"
            >
                <u-navbar
                    :border-bottom="false"
                    :background="{
                        'background-image': `url(${shopInfo.background})`,
                        'background-repeat': 'no-repeat',
                        'background-size': '100% auto'
                    }"
                    :back-bg="'rgba(255, 255, 255, 0.45)'"
                    :back-icon-color="'rgb(255,255,255)'"
                    :is-fixed="true"
                >
                    <view class="store-search flex-1" @click="handleSerach">
                        <u-search
                            v-model="keyword"
                            bg-color="white"
                            shape="round"
                            placeholder="搜索店内商品"
                            wrap-bg-color="transparent"
                            @search="refresh"
                        >
                        </u-search>
                    </view>
                </u-navbar>
                <view
                    class="store-info m-t-20"
                    :style="{ 'padding-bottom': tabbarcurrent == 0 ? '200rpx' : '200rpx' }"
                >
                    <view class="flex row-between">
                        <view class="flex">
                            <u-image
                                width="100rpx"
                                height="100rpx"
                                border-radius="50%"
                                :src="shopInfo.logo"
                            />
                            <view class="m-l-20 flex-col col-top">
                                <router-link
                                    :to="{
                                        path: '/pages/store_detail/store_detail',
                                        query: { id: shopInfo.id }
                                    }"
                                >
                                    <view class="lg white line-1 bold" style="width: 420rpx">
                                        {{ shopInfo.name }}
                                        <u-icon name="arrow-right"></u-icon>
                                    </view>
                                </router-link>
                                <view class="flex m-t-10">
                                    <view class="store-tag xxs white" v-if="shopInfo.type == 1">
                                        自营
                                    </view>
                                    <view class="white xs m-l-5">
                                        {{ shopInfo.visited_num }}人进店
                                    </view>
                                </view>
                            </view>
                        </view>
                        <view
                            class="flex row-center white br60 sm flex-none subscribe-btn"
                            :class="{ gray: shopInfo.shop_follow_status === 1 }"
                            @tap="changeShopFollowFun"
                        >
                            {{ shopInfo.shop_follow_status === 1 ? '已关注' : '+ 关注' }}
                        </view>
                    </view>
                    <view class="p-t-20 p-b-20" v-if="tabbarcurrent == 0">
                        <u-tabs
                            :current="tabcurrent"
                            :list="[{ name: '精选' }, { name: '商品' }, { name: '领券' }]"
                            :is-scroll="false"
                            @change="tabChange"
                            bg-color="transparent"
                            active-color="white"
                            inactive-color="white"
                        ></u-tabs>
                    </view>
                </view>
            </view>
            <!-- 精选商城 -->
            <view class="content" v-if="tabcurrent == 0 && tabbarcurrent == 0">
                <view v-if="shopInfo.ad.mobile.length">
                    <u-swiper
                        :list="shopInfo.ad.mobile"
                        height="700"
                        @click="handleAdclick"
                    ></u-swiper>
                </view>
                <view class="content-wrap" v-if="shopInfo.goods_list.length">
                    <view class="store-hot-goods bg-white m-t-20">
                        <view class="store-hot-header flex">
                            <view class="column-line m-r-20" />
                            <view class="md" style="font-weight: 500"> 店铺推荐 </view>
                            <view class="md" style="margin-left: auto" @click="handlemore">
                                更多</view
                            >
                        </view>
                        <view class="store-hot-content">
                            <scroll-view :scroll-x="true">
                                <view class="goods p-l-20 p-r-20">
                                    <goods-list :list="shopInfo.goods_list" type="row"></goods-list>
                                </view>
                            </scroll-view>
                        </view>
                    </view>
                </view>
                <view class="goods-display flex bg-body">
                    <view class="category-row flex-1">
                        <u-sticky
                            bg-color="rgba(255, 255, 255, 0)"
                            :enable="enableFix"
                            :offset-top="navHeight"
                            :h5-nav-height="0"
                        >
                            <sort-nav
                                v-model="sortConfig"
                                :show-type="false"
                                :showCreate="true"
                            ></sort-nav>
                        </u-sticky>
                        <mescroll-body
                            ref="mescrollRef"
                            @init="mescrollInit"
                            :height="meScrollH"
                            @down="downCallback"
                            @up="upCallback"
                            :up="upOption"
                            :down="{ use: false }"
                        >
                            <view class="bg-white">
                                <goods-list :list="goodsList" width="315rpx"></goods-list>
                            </view>
                        </mescroll-body>
                    </view>
                </view>
            </view>
            <!-- 商城商品 -->
            <view v-if="tabcurrent == 1 && tabbarcurrent == 0" style="margin-top: -200rpx">
                <view class="goods-display flex bg-body">
                    <view class="category-row flex-1">
                        <u-sticky
                            bg-color="rgba(255, 255, 255, 0)"
                            :enable="enableFix"
                            :offset-top="navHeight"
                            :h5-nav-height="0"
                        >
                            <sort-nav v-model="sortConfig" :show-type="false"></sort-nav>
                        </u-sticky>
                        <mescroll-body
                            ref="mescrollRef"
                            @init="mescrollInit"
                            :height="meScrollH"
                            @down="downCallback"
                            @up="upCallback"
                            :up="upOption"
                            :down="{ use: false }"
                        >
                            <view class="bg-white">
                                <goods-list :list="goodsList"></goods-list>
                            </view>
                        </mescroll-body>
                    </view>
                </view>
            </view>
            <!-- 优惠券 -->
            <view v-if="tabcurrent == 2 && tabbarcurrent == 0" style="margin-top: -200rpx">
                <coupon-list
                    :list="couponlists"
                    @refresh="getGoodsCouponFun"
                    :btn-type="3"
                    v-if="couponlists.length"
                ></coupon-list>
                <view class="coupon-container" v-else>
                    <view style="font-weight: 500">优惠券</view>
                    <view class="muted coupon"> 当前暂无可领取的优惠券 </view>
                </view>
            </view>
            <!-- 分类 -->

            <view v-if="tabbarcurrent == 1" class="category">
                <view class="goods-display bg-body" style="display: flex; border-radius: 20rpx">
                    <view class="category-aside">
                        <u-sticky
                            bg-color="rgba(255, 255, 255, 0)"
                            :enable="enableFix"
                            :offset-top="navHeight"
                            :h5-nav-height="0"
                        >
                            <scroll-view
                                :scroll-y="true"
                                :style="{ height: aslideH + 'px', padding: '10rpx' }"
                            >
                                <view
                                    class="aside-item flex row-center"
                                    :class="{ active: active == -1 }"
                                    @click="changeActive(-1)"
                                >
                                    <view
                                        class="xs text-center"
                                        style="width: 60rpx"
                                        :class="{ primary: active == -1 }"
                                        >全部商品</view
                                    >
                                </view>
                                <view
                                    class="aside-item flex row-center"
                                    :class="{ active: active == index }"
                                    v-for="(item, index) in category"
                                    :key="index"
                                    @click="changeActive(index)"
                                >
                                    <view
                                        class="xs text-center"
                                        style="width: 60rpx"
                                        :class="{ primary: active == index }"
                                        >{{ item.name }}</view
                                    >
                                </view>
                            </scroll-view>
                        </u-sticky>
                    </view>
                    <view class="category-row flex-1">
                        <mescroll-body
                            ref="mescrollRef"
                            @init="mescrollInit"
                            :height="meScrollH"
                            @down="downCallback"
                            @up="upCallback"
                            :up="upOption"
                            :down="{ use: false }"
                        >
                            <view class="bg-white">
                                <goods-list :list="goodsList" type="one"></goods-list>
                            </view>
                        </mescroll-body>
                    </view>
                </view>
            </view>
            <loading-view v-if="isFirstLoading"></loading-view>
        </view>
        <u-tabbar
            v-model="tabbarcurrent"
            :list="tabbarLists"
            active-color="#1679fc"
            @change="tabbarChange"
        ></u-tabbar>
    </view>
</template>

<script>
import { mapGetters } from 'vuex'
import { getShopInfo, getShopGoodsCategory, changeShopFollow } from '@/api/shop'
import { getShopLive } from '@/api/live'
import { getGoodsList } from '@/api/store'
import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins.js'
import { getCouponList } from '@/api/activity'

export default {
    mixins: [MescrollMixin], // 使用mixin
    data() {
        return {
            tabbarcurrent: 0,
            tabcurrent: 0,
            isFirstLoading: true,
            navOpacity: 0,
            shopInfo: {
                goods_list: [],
                ad: {
                    mobile: []
                }
            },
            category: [],
            active: -1,
            upOption: {
                auto: false,
                empty: {
                    icon: '/static/images/goods_null.png',
                    tip: '暂无商品'
                }
            },
            goodsList: [],
            categoodsList: [],
            sortConfig: {
                priceSort: '',
                saleSort: '',
                sort_by_create: ''
            },
            couponlists: [],
            keyword: '',
            sys: {},
            enableFix: true,
            id: '',
            shopLive: {},

            tabbarLists: [
                {
                    iconPath: 'home',
                    selectedIconPath: 'home-fill',
                    text: '首页'
                },
                {
                    iconPath: 'grid',
                    selectedIconPath: 'grid-fill',
                    text: '分类'
                }
            ]
        }
    },
    async onLoad() {
        this.id = this.$Route.query.id
        this.sys = uni.getSystemInfoSync()
        await this.getShopInfoFun()
        await this.getShopGoodsCategoryFun()
        // #ifdef MP-WEIXIN
        this.getShopLiveFun()
        // #endif
        this.isFirstLoading = false
        this.mescroll.resetUpScroll()
    },
    onHide() {
        // #ifdef H5
        this.enableFix = false
        // #endif
    },
    onShow() {
        // #ifdef H5
        this.enableFix = true
        // #endif
    },
    onShareAppMessage() {
        return {
            title: this.shopInfo.name,
            path: `pages/store_index/store_index?invite_code=${this.inviteCode}&id=${this.id}`
        }
    },
    methods: {
        handleAdclick(index) {
            const { link, link_query } = this.shopInfo.ad.mobile[index]
            console.log(link)
            this.$Router.push({
                path: link,
                query: link_query
            })
        },
        tabbarChange(val) {
            this.mescroll.resetUpScroll()
            this.tabbarcurrent = val
        },
        async getGoodsCouponFun() {
            console.log(this.goodsId)
            const { data, code } = await getCouponList({
                shop_id: this.id
            })
            console.log(data)
            if (code == 1) {
                this.couponlists = data.lists
            }
        },
        tabChange(value) {
            this.tabcurrent = value
            if (value == 2) {
                this.getGoodsCouponFun()
            }
        },
        // #ifdef MP-WEIXIN
        async getShopLiveFun() {
            const { data, code } = await getShopLive({
                shop_id: this.id
            })
            if (code == 1) {
                this.shopLive = data
            }
        },
        //#endif
        async changeShopFollowFun() {
            if (!this.isLogin) return this.$Router.push('/pages/login/login')
            const { code, msg } = await changeShopFollow({
                shop_id: this.id
            })
            if (code == 1) {
                this.$toast({
                    title: msg
                })
                this.getShopInfoFun()
            }
        },
        async getShopInfoFun() {
            const { data, code } = await getShopInfo({
                shop_id: this.id
            })

            if (code == 1) {
                this.shopInfo = data
            }
        },
        async getShopGoodsCategoryFun() {
            const { data, code } = await getShopGoodsCategory({
                shop_id: this.id
            })
            if (code == 1) {
                this.category = data
            }
        },
        changeActive(index) {
            this.active = index
            this.refresh()
        },
        refresh() {
            this.goodsList = []
            if (
                !(
                    this.shopInfo.is_freeze === 1 ||
                    this.shopInfo.is_expire === 1 ||
                    this.shopInfo.is_run === 0
                )
            ) {
                this.mescroll.resetUpScroll()
            }
        },
        handleSerach() {
            this.$Router.push({
                path: '/bundle/pages/shop_search/shop_search',
                query: { id: this.id, is_recommend: 0 }
            })
        },
        handlemore() {
            this.$Router.push({
                path: '/bundle/pages/shop_search/shop_search',
                query: { id: this.id, is_recommend: 1 }
            })
        },
        /*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
        upCallback(page) {
            //联网加载数据
            let {
                goodsList,
                keyword,
                sortConfig: { priceSort, saleSort, sort_by_create },
                active,
                category
            } = this
            const pageNum = page.num // 页码, 默认从1开始
            const pageSize = page.size // 页长, 默认每页10条
            const cateId = active == -1 ? '' : category[active].id
            setTimeout(() => {
                console.log(this.tabbarcurrent, '----')

                getGoodsList({
                    page_size: pageSize,
                    page_no: pageNum,
                    shop_id: this.id,
                    shop_cate_id: this.tabbarcurrent == 1 ? cateId : '',
                    sort_by_price: this.tabbarcurrent == 1 ? '' : priceSort,
                    sort_by_sales: this.tabbarcurrent == 1 ? '' : saleSort,
                    sort_by_create: this.tabbarcurrent == 1 ? '' : sort_by_create,
                    keyword
                }).then(({ data }) => {
                    let curPageData = data.lists
                    let curPageLen = curPageData.length
                    let hasNext = !!data.more
                    if (page.num == 1) this.goodsList = []
                    this.goodsList = this.goodsList.concat(curPageData)
                    this.mescroll.endSuccess(curPageLen, hasNext)
                })
            }, 100)
        }
    },
    computed: {
        ...mapGetters(['sysInfo']),
        navHeight() {
            return this.sysInfo.navHeight + 'px'
        },
        aslideH() {
            const { windowHeight, navHeight, safeArea } = this.sys
            if (!safeArea) return 0
            console.log(this.sysInfo)
            return windowHeight - this.sysInfo.navHeight - 100
        },
        meScrollH() {
            return this.aslideH - uni.upx2px(80) + 'px'
        },
        // 获取图片域名
        $getImageUri() {
            return (url) => this.$store.state.app.config.base_domain + url
        }
    },
    watch: {
        sortConfig: {
            deep: true,
            handler(val) {
                console.log(val)
                this.refresh()
            }
        }
    }
}
</script>

<style lang="scss">
page {
    padding: 0;
}
.category {
    margin-top: -150rpx;
    margin-left: 20rpx;
    margin-right: 20rpx;
    background-color: white;
    border-radius: 20rpx;
    .category-aside {
        width: 150rpx;
        align-self: flex-start;
        .aside-item {
            width: 120rpx;
            padding: 20rpx 0;
            &.active {
                position: relative;
                background-color: $-color-white;

                &::before {
                    content: '';
                    width: 3rpx;
                    height: 80rpx;
                    background-color: $-color-primary;
                    position: absolute;
                    left: 0;
                }
            }
        }
    }
}
.store-index {
    .store-header {
        // padding-bottom: 60rpx;
        background-repeat: no-repeat;
        background-size: 100% auto;
        .store-info {
            padding-right: 30rpx;
            padding-left: 24rpx;

            .store-tag {
                background: linear-gradient(267deg, #ff2c3c 0%, #f52e99 100%);
                border-radius: 6rpx;
                padding: 4rpx 9rpx;
            }

            .subscribe-btn {
                background: linear-gradient(97deg, #ff5784 0%, #ff2c3c 100%);
                height: 52rpx;
                width: 128rpx;
                &.gray {
                    background: #ccc;
                }
            }
        }
    }

    .content {
        margin-top: -200rpx;
        margin-left: 20rpx;
        margin-right: 20rpx;
        .content-wrap {
            // margin-top: 30rpx;
            border-radius: 20rpx;
            overflow: hidden;
            margin-bottom: 30rpx;
        }
        .store-hot-goods {
            overflow: hidden;
            .store-hot-header {
                padding: 20rpx;

                .column-line {
                    width: 6rpx;
                    height: 32rpx;
                    background-color: $-color-primary;
                }
            }

            .store-hot-content {
                .goods {
                    display: inline-block;
                }
                .hot-goods-item {
                    width: 200rpx;

                    .hot-goods-info {
                        .hot-goods-price {
                            margin-top: 5rpx;
                        }
                    }
                }
            }
        }

        .goods-display {
            .category-row {
                align-self: flex-start;
                width: 630rpx;

                .sort-tool-bar {
                    .sort-item {
                        flex: 1;
                        height: 80rpx;
                    }
                }

                .goods-lists {
                    padding: 20rpx;

                    .item {
                        width: 285rpx;
                        border-radius: 10rpx;
                        overflow: hidden;

                        &:nth-of-type(2n) {
                            margin-left: 20rpx;
                        }

                        .goods-info {
                            padding: 10rpx;
                        }
                    }
                }
            }
        }
    }
}
.coupon-container {
    background-color: white;
    height: 1000rpx;
    margin: 0 20rpx;
    border-radius: 20rpx;
    padding: 20rpx;
    .coupon {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
</style>

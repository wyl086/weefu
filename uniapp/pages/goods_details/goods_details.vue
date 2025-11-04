<template>
    <view class="goods-details">
        <u-navbar
            id="navbar"
            :border-bottom="false"
            :background="{
                background: 'rgba(256,256,256, ' + navStyle.backgroundBg + ')'
            }"
            :back-bg="'rgba(0,0,0,' + navStyle.backBg + ')'"
            :back-icon-color="navStyle.backColor"
            :immersive="true"
        >
            <tabs
                sticky-bg-color="transparent"
                v-if="navStyle.backgroundBg > 0.1"
                :show-bar="true"
                :bar-width="60"
                :is-scroll="false"
                :current="active"
                bg-color="transparent"
                :style="{ width: '100%', opacity: navStyle.backgroundBg }"
                @change="changeActive"
            >
                <tab name="商品"></tab>
                <tab name="评价"></tab>
                <tab name="详情"></tab>
            </tabs>
        </u-navbar>

        <view class="contain" v-if="!isNull" id="goods" @touchstart="isTouchStart = true">
            <bubble-tips top="200rpx"></bubble-tips>

            <product-swiper :imgUrls="swiperList" :video="goodsDetail.video"></product-swiper>
            <!-- 秒杀 -->
            <view class="seckill flex row-between" v-if="goodsType == 1">
                <view class="price flex">
                    <view class="flex white info">
                        <view class="flex col-baseline m-l-20">
                            <view class="m-r-10">秒杀价</view>
                            <price-format
                                :subscript-size="32"
                                :first-size="46"
                                :second-size="32"
                                :price="checkedGoods.price || goodsDetail.price"
                                :weight="500"
                            ></price-format>
                            <view class="m-l-10">
                                <price-format
                                    :subscript-size="30"
                                    :line-through="true"
                                    :first-size="30"
                                    :second-size="30"
                                    :price="checkedGoods.market_price || goodsDetail.market_price"
                                >
                                </price-format>
                            </view>
                        </view>
                    </view>
                </view>
                <view class="down flex-col col-center">
                    <view class="xxs primary m-b-10">距活动结束仅剩</view>
                    <u-count-down
                        :timestamp="countTime"
                        @end="getGoodsDetailFun"
                        color="#fff"
                        :bg-color="colorConfig.primary"
                        :separator-color="colorConfig.primary"
                        font-size="24"
                        height="36"
                        separator-size="26"
                    ></u-count-down>
                </view>
            </view>

            <!-- 拼团 -->
            <view class="group" v-show="goodsType == 2">
                <view class="row info" style="height: 100%">
                    <view class="row-between ml20 white" style="flex: 1">
                        <view style="align-items: baseline" class="row">
                            <view class="mr10">拼团价</view>
                            <price-format
                                :subscript-size="32"
                                :first-size="46"
                                :second-size="32"
                                :price="
                                    checkedGoods.team_price || team.team_min_price
                                        ? team.team_min_price
                                        : ''
                                "
                                :weight="500"
                            ></price-format>
                        </view>
                        <view class="mr20 row group-num">
                            <view class="group-icon">
                                <image src="/static/images/icon_group.png" class="icon-sm"></image>
                            </view>
                            <view class="xxs ml10 mr10">{{ team.people_num }}人团</view>
                        </view>
                    </view>
                    <view class="down column-center">
                        <view class="xxs primary mb10">距活动结束仅剩</view>
                        <u-count-down
                            :timestamp="countTime"
                            color="#fff"
                            bg-color="#FF2C3C"
                            separator-color="#FF2C3C"
                            font-size="24"
                            height="36"
                            separator-size="26"
                            @end="getGoodsDetailFun"
                        ></u-count-down>
                    </view>
                </view>
            </view>

            <view class="goods-info bg-white">
                <view class="info-header flex" v-if="goodsType != 1">
                    <view class="price flex flex-1">
                        <view class="primary m-r-10">
                            <price-format
                                :first-size="46"
                                :second-size="32"
                                :subscript-size="32"
                                :price="goodsDetail.min_price"
                                :weight="500"
                            ></price-format>
                        </view>
                        <view class="line-through muted md">
                            <price-format
                                :price="goodsDetail.market_price"
                                v-if="goodsDetail.market_price != 0"
                            ></price-format>
                        </view>
                        <view
                            class="vip-price flex"
                            v-if="goodsType == 0 && goodsDetail.member_price"
                        >
                            <view class="price-name xxs">会员价</view>
                            <view style="padding: 0 11rpx">
                                <price-format
                                    :price="checkedGoods.member_price"
                                    :first-size="22"
                                    :second-size="22"
                                    :subscript-size="22"
                                    :weight="500"
                                    color="#7B3200"
                                />
                            </view>
                        </view>
                    </view>
                    <image
                        class="icon-share"
                        src="/static/images/icon_share.png"
                        @tap="showShareBtn = true"
                    ></image>
                </view>
                <view class="flex">
                    <view class="name lg bold">{{ goodsDetail.name }}</view>
                    <image
                        class="icon-share"
                        src="/static/images/icon_share.png"
                        @tap="showShareBtn = true"
                        v-if="goodsType == 1"
                    ></image>
                </view>
                <view class="flex row-between xs lighter" style="padding: 0 24rpx 20rpx">
                    <text v-if="goodsDetail.is_show_stock"
                        >库存: {{ checkedGoods.stock || goodsDetail.stock }}</text
                    >
                    <text>销量: {{ goodsDetail.sales_sum }}</text>
                    <text>浏览量: {{ goodsDetail.clicks }}</text>
                </view>
            </view>

            <!-- 拼团的玩法说明 -->
            <view class="group-play bg-white mt20" v-if="goodsType == 2">
                <view class="title">拼团玩法</view>
                <view class="steps row">
                    <view class="row step">
                        <view class="number xxs">1</view>
                        <view class="sm">开团/参团</view>
                    </view>
                    <view class="line"></view>
                    <view class="row step">
                        <view class="number xxs">2</view>
                        <view class="sm">团满即成新团</view>
                    </view>
                    <view class="line"></view>
                    <view class="row step">
                        <view class="number xxs">3</view>
                        <view class="sm">满员发货</view>
                    </view>
                </view>
            </view>

            <view class="group-play bg-white mt20" v-if="teamFound.length">
                <!-- 已经发起拼团的列表 -->
                <view class="title">正在拼团中</view>
                <swiper
                    v-if="teamFound.length"
                    class="mt20 bg-white"
                    autoplay="true"
                    style="height: 240rpx"
                    vertical="true"
                    circular="true"
                    :interval="5000"
                >
                    <swiper-item v-for="(sitem, index) in teamFound" :key="index">
                        <view class="group-list">
                            <view
                                v-for="(item, index2) in sitem"
                                :key="index2"
                                class="group-item bg-white row-between"
                            >
                                <view class="row" style="max-width: 280rpx">
                                    <u-image
                                        :src="item.avatar"
                                        width="80rpx"
                                        height="80rpx"
                                        border-radius="50%"
                                    >
                                    </u-image>
                                    <view class="ml20 line1 normal">{{ item.nickname }}</view>
                                </view>
                                <view class="row ml20" style="flex: none">
                                    <view class="column-center">
                                        <text class="sm normal">
                                            还差
                                            <text class="primary">{{
                                                item.people - item.join
                                            }}</text>
                                            人成团
                                        </text>
                                        <view class="muted xs">
                                            剩余
                                            <u-count-down
                                                :timestamp="getTeamCountTime(item.invalid_time)"
                                                separator-color="#999"
                                                color="#999"
                                                :separator-size="24"
                                                :font-size="24"
                                                bg-color="transparent"
                                                @end="getGoodsDetailFun"
                                            ></u-count-down>
                                        </view>
                                    </view>
                                    <view
                                        class="group-btn br60 white row-center"
                                        @tap="showSpecFun(3, item.id)"
                                        >去参团
                                    </view>
                                </view>
                            </view>
                        </view>
                    </swiper-item>
                </swiper>
            </view>
            <view>
                <get-coupon
                    :wrap-style="{ 'margin-top': '20rpx' }"
                    :goods-id="goodsDetail.id"
                ></get-coupon>
            </view>
            <view v-if="!goodsType" class="spec flex bg-white m-t-20" @tap="showSpecFun(0)">
                <view class="text muted">已选</view>
                <view class="line-1 m-r-20 flex-1">{{
                    checkedGoods.spec_value_str || '默认'
                }}</view>
                <u-icon name="arrow-right"></u-icon>
            </view>
            <view class="evaluation bg-white m-t-20" id="evaluation">
                <router-link
                    :to="{
                        path: '/bundle/pages/all_comments/all_comments',
                        query: { id: goodsDetail.id }
                    }"
                >
                    <view class="title flex row-between">
                        <view>
                            <text class="balck md m-r-10">用户评价</text>
                            <text class="primary sm">好评率{{ comment.percent || '0%' }}</text>
                        </view>
                        <view class="flex">
                            <text class="lighter">查看全部</text>
                            <u-icon name="arrow-right"></u-icon>
                        </view>
                    </view>
                </router-link>
                <view class="con" v-if="comment.one && comment.one.nickname">
                    <view class="user-info flex">
                        <image class="avatar m-r-20" :src="comment.one.avatar"></image>
                        <view class="user-name md m-r-10">{{ comment.one.nickname }}</view>
                    </view>
                    <view class="muted xs m-t-10">
                        <text class="m-r-20">{{ comment.one.create_time }}</text>
                    </view>
                    <view v-if="comment.one.comment" class="dec m-t-20">{{
                        comment.one.comment
                    }}</view>
                </view>
                <view class="con flex row-center muted" v-else>暂无评价</view>
            </view>

            <view class="goods-shop m-t-20 bg-white" v-if="appConfig.shop_hide_goods == 1">
                <goods-shop :shop="shop"></goods-shop>
            </view>
            <view class="details m-t-20 bg-white" id="details">
                <view class="title lg">商品详情</view>
                <view class="content">
                    <u-parse
                        :html="goodsDetail.content"
                        :lazy-load="true"
                        :show-with-animation="true"
                    ></u-parse>
                </view>
            </view>
            <view class="footer flex bg-white fixed">
                <router-link
                    :to="{
                        path: '/bundle/pages/chat/chat',
                        query: {
                            shop_id: shop.id,
                            goods_id: id
                        }
                    }"
                >
                    <view class="btn flex-col col-center row-center">
                        <image class="icon-md" src="/static/images/icon_contact.png"></image>
                        <text class="xxs lighter">客服</text>
                    </view>
                </router-link>

                <button
                    class="btn flex-col col-center row-center"
                    hover-class="none"
                    @tap="collectGoodsFun"
                >
                    <image
                        class="icon-md"
                        :src="
                            goodsDetail.is_collect == 1
                                ? '/static/images/icon_collection_s.png'
                                : '/static/images/icon_collection.png'
                        "
                    >
                    </image>
                    <text class="xxs lighter">收藏</text>
                </button>
                <router-link nav-type="pushTab" to="/pages/shop_cart/shop_cart">
                    <view class="flex-col btn cart col-center row-center">
                        <image class="icon-md" src="/static/images/icon_cart.png"></image>
                        <text class="xxs lighter">购物车</text>
                        <u-badge
                            v-if="cartNum"
                            :bgColor="colorConfig.primary"
                            :offset="[8, 10]"
                            :count="cartNum"
                        >
                        </u-badge>
                    </view>
                </router-link>
                <template v-if="shop.is_pay">
                    <!-- goodsDetail.type == 0 是虚拟商品时购物车不显示 -->
                    <view
                        v-if="btnText.yellow && goodsDetail.type == 0"
                        class="add-cart br60 white m-r-10 md m-l-20"
                        @tap="showSpecFun(1)"
                    >
                        {{ btnText.yellow }}
                    </view>
                    <view class="right-buy br60 white m-r-20 m-l-10 md" @tap="showSpecFun(2)">{{
                        btnText.red
                    }}</view>
                </template>
                <view v-else class="consult-btn br60 white m-r-20 md m-l-20" @tap="handleConsult">
                    咨询商家
                </view>
            </view>
        </view>
        <view v-else>
            <view class="details-null flex-col col-center">
                <image class="img-null" src="/static/images/goods_null.png"></image>
                <view class="xs muted">该商品已下架或不存在，去逛逛别的吧~</view>
            </view>
            <goods-column></goods-column>
        </view>
        <!-- 规格 -->
        <spec-popup
            :show="showSpec"
            :is-seckill="goodsType == 1"
            :goods="goodsDetail"
            @close="showSpec = false"
            :show-add="popupType == 1 || popupType == 0"
            :show-buy="popupType == 2 || popupType == 0"
            :show-stock="goodsDetail.is_show_stock == 1"
            :show-confirm="popupType == 3"
            @buynow="onBuy"
            :type="goodsDetail.type"
            :group="!!isGroup"
            @addcart="onAddCart"
            @change="onChangeGoods"
            :red-btn-text="btnText.red"
            :yellow-btn-text="btnText.yellow"
            @confirm="onConfirm"
        ></spec-popup>

        <!-- 分享海报 -->
        <share-popup
            v-model="showShareBtn"
            :share-id="id"
            pagePath="pages/goods_details/goods_details"
            type="1"
            :config="{
                avatar: userInfo.avatar,
                nickname: userInfo.nickname,
                image: goodsDetail.poster || goodsDetail.image,
                price: goodsDetail.min_price,
                marketPrice: goodsDetail.market_price,
                name: team.share_title || goodsDetail.name
            }"
        />

        <share-popup
            :show="showShareBtn"
            @close="showShareBtn = false"
            :goods-id="id"
            :img-url="goodsDetail.image"
            :summary="goodsDetail.remark"
            :share-title="goodsDetail.name"
        ></share-popup>
        <!-- 悬浮按钮 -->
        <float-tab></float-tab>
        <!-- 佣金显示 -->
        <view class="share-money" :class="{ show: showCommission && enableCommission }">
            <view class="row-end">
                <view class="share-close row-center" @tap="showCommission = false">
                    <u-icon name="close" size="16" color="#fff"></u-icon>
                </view>
            </view>
            <view class="share-con mt10" @tap="showShareBtn = true">
                <view class="primary" style="font-size: 45rpx">
                    {{ distribution.earnings }}<text class="xs">元</text>
                </view>
                <view class="lighter xxs"> 好友下单最高可赚 </view>
            </view>
        </view>
        <loading-view v-if="isFirstLoading"></loading-view>
    </view>
</template>
<script>
import { getGoodsDetail, addCart } from '@/api/store'
import { collectGoods } from '@/api/user'
import { getCouponList, teamCheck } from '@/api/activity'
import { mapActions, mapGetters } from 'vuex'
import { toLogin } from '@/utils/login'
import Cache from '@/utils/cache'
import { strToParams, arraySlice, getRect, getcu } from '@/utils/tools'
const app = getApp()
export default {
    data() {
        return {
            active: 0,
            isTouchStart: false,
            topArr: [],
            isFirstLoading: true,
            isNull: false,
            isGroup: 0,
            showSpec: false,
            showCoupon: false,
            showShareBtn: false,
            showCommission: true,
            popupType: '',
            swiperList: [],
            goodsDetail: {},
            goodsType: 0,
            checkedGoods: {},
            comment: {},
            countTime: 0,
            team: {},
            teamFound: [],
            navStyle: {
                backBg: 0.4,
                backgroundBg: 0,
                backColor: 'rgba(256,256,256,1)'
            },
            id: '',
            shop: {},
            // 分销
            distribution: {}
        }
    },
    onLoad() {
        const options = this.$Route.query
        if (options && options.scene) {
            const scene = strToParams(decodeURIComponent(options.scene))
            options.id = scene.id
        }
        this.id = options.id
        this.getGoodsDetailFun()
        this.getCartNum()
    },
    onPageScroll(e) {
        const top = uni.upx2px(500)
        const { scrollTop } = e
        const percent = scrollTop / top
        this.navStyle.backgroundBg = percent
        this.navStyle.backBg = 0.4 * (0.5 - percent)
        this.navStyle.backColor =
            percent < 0.5
                ? 'rgba(256,256,256,' + (0.5 - percent) * 2 + ')'
                : 'rgba(0,0,0,' + (percent - 0.5) * 2 + ')'
        if (!this.isTouchStart) return
        const topList = this.topArr
            .map((item, index) => ({
                index,
                top: item
            }))
            .filter((item) => item.top <= scrollTop)

        if (topList.length) {
            const index = topList.sort((a, b) => b.top - a.top)[0].index
            if (this.active == index) return
            this.active = index
        }
    },
    methods: {
        ...mapActions(['getCartNum', 'wxShare']),
        changeActive(index) {
            this.isTouchStart = false

            uni.pageScrollTo({
                scrollTop: this.topArr[index],
                duration: 200
            })
        },
        getRectInfo() {
            if (this.topArr.length) return
            getRect('#goods').then((res) => {
                this.topArr[0] = res.top - this.navHeight
            })
            getRect('#evaluation').then((res) => {
                this.topArr[1] = res.top - this.navHeight
            })
            getRect('#details').then((res) => {
                this.topArr[2] = res.top - this.navHeight
            })
        },
        async getGoodsDetailFun() {
            const { data, code } = await getGoodsDetail({
                goods_id: this.id
            })
            console.log('detail', data)
            if (code == 1) {
                const { goods_image, content, comment, like, activity, shop, distribution } = data
                let { info, type, team, found, end_time } = activity //秒杀时间
                console.log(activity)
                // 拼团的结束时间-现在的时间 = 剩余的时间
                let time = end_time
                    ? end_time - Date.now() / 1000
                    : info
                    ? info.activity_end_time - Date.now() / 1000
                    : 0

                if (found) {
                    found = arraySlice(found, [], 2)
                }
                this.distribution = distribution || {}
                this.shop = shop
                this.goodsDetail = data
                this.swiperList = goods_image
                this.comment = comment || {}
                this.countTime = time
                this.goodsType = type
                this.team = info ? info : {}
                this.teamFound = found ? found : []

                this.$nextTick(() => {
                    // 滚动到顶部，防止h5端出现问题
                    uni.pageScrollTo({
                        scrollTop: 0,
                        duration: 0
                    })
                    this.isFirstLoading = false
                    this.getRectInfo()
                })
                // #ifdef H5
                const options = {
                    shareTitle: this.team.share_title || data.name,
                    shareImage: data.image,
                    shareDesc: this.team.share_intro || data.remark
                }
                this.wxShare(options)
                // #endif
            } else {
                this.isNull = true
                this.isFirstLoading = false
            }
        },

        async collectGoodsFun() {
            if (!this.isLogin) return this.$Router.push('/pages/login/login')
            const {
                goodsDetail: { is_collect }
            } = this
            const { msg, code } = await collectGoods({
                goods_id: this.id
            })
            if (code == 1) {
                {
                    this.$toast({
                        title: msg
                    })
                }
                this.getGoodsDetailFun()
            }
        },
        showCouponFun() {
            if (!this.isLogin) return toLogin()
            this.showCoupon = true
        },
        onChangeGoods(e) {
            this.checkedGoods = e.detail
        },
        showSpecFun(type, id) {
            if (this.goodsType == 2 && [2, 3].includes(type)) {
                this.isGroup = 1
                this.foundId = id
            } else {
                this.isGroup = 0
                this.foundId = ''
            }
            this.popupType = type
            this.showSpec = true
        },
        onBuy(e) {
            if (!this.isLogin) return this.$Router.push('/pages/login/login')
            const { id, goodsNum } = e.detail
            const params = {
                goods: [
                    {
                        item_id: id,
                        num: goodsNum,
                        goods_id: this.id,
                        shop_id: this.shop.id,
                        delivery_type: this.goodsDetail.default_delivery_type
                    }
                ],
                type: 'buy',
                goodsType: this.goodsDetail.type
            }
            this.showSpec = false
            this.goodsType == 2 ? (params.teamId = this.team.id) : ''
            this.foundId ? (params.foundId = this.foundId) : ''
            console.log(params, 2222)
            this.$Router.push({
                path: '/pages/confirm_order/confirm_order',
                query: {
                    data: params
                }
            })
        },

        onConfirm(e) {
            const {
                team: { team_id }
            } = this

            teamCheck({
                team_id: this.foundId,
                // found_id: this.foundId,
                goods_id: e.detail.goods_id,
                item_id: e.detail.id,
                count: e.detail.goodsNum
            }).then((res) => {
                if (res.code == 1) {
                    this.onBuy(e)
                }
            })
        },

        async onAddCart(e) {
            if (!this.isLogin) return this.$Router.push('/pages/login/login')

            if (this.goodsType == 2) {
                // 拼团单独购买
                const params = {
                    goods: [
                        {
                            item_id: e.detail.id,
                            num: e.detail.goodsNum,
                            delivery_type: this.goodsDetail.default_delivery_type,
                            goods_id: this.id,
                            shop_id: this.shop.id
                        }
                    ],
                    type: 'buy',
                    goodsType: this.goodsDetail.type
                }
                this.$Router.push({
                    path: '/pages/confirm_order/confirm_order',
                    query: {
                        data: params
                    }
                })
                return
            }

            const { id, goodsNum } = e.detail
            const { code, data, msg } = await addCart({
                item_id: id,
                goods_num: goodsNum
            })
            if (code == 1) {
                this.getCartNum()
                this.$toast({
                    title: msg,
                    icon: 'success'
                })
                this.showSpec = false
            }
        },
        handleConsult() {
            uni.makePhoneCall({
                phoneNumber: this.shop.mobile.toString() //仅为示例
            })
        }
    },
    async onShareAppMessage() {
        const { goodsDetail, inviteCode, team } = this
        return {
            title: team.share_title || goodsDetail.name,
            imageUrl: goodsDetail.image,
            path: '/pages/goods_details/goods_details?id=' + this.id + '&invite_code=' + inviteCode
        }
    },
    computed: {
        ...mapGetters(['cartNum', 'inviteCode', 'sysInfo', 'appConfig', 'userInfo']),
        btnText() {
            const { goodsType } = this
            switch (goodsType) {
                case 1:
                    return {
                        red: '立即抢购',
                        yellow: ''
                    }
                case 2:
                    return {
                        red: '立即开团',
                        yellow: '单独购买'
                    }
                default:
                    return {
                        red: '立即购买',
                        yellow: '加入购物车'
                    }
            }
        },
        getTeamCountTime() {
            return (time) => time - Date.now() / 1000
        },
        navHeight() {
            return this.sysInfo.navHeight
        },
        enableCommission() {
            const {
                goodsType,
                distribution: { earnings, is_show }
            } = this
            return goodsType == 0 && earnings > 0 && is_show == 1
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/styles/base.scss';

.goods-details {
    padding-bottom: calc(120rpx + env(safe-area-inset-bottom));

    .seckill {
        height: 100rpx;
        background: #ffd4d8;

        .price {
            width: 504rpx;
            height: 100%;
            background: url(../../static/images/bg_seckill.png) no-repeat;
            background-size: 100%;
        }

        .down {
            flex: 1;
        }
    }

    .group {
        height: 100rpx;
        width: 100%;
        background-image: url(../../static/images/pintuan_bg.png);
        background-size: 100%;

        .group-num {
            border: 1px solid #ffffff;
            border-radius: 4rpx;

            .group-icon {
                background: #fff;
                padding: 3rpx 7rpx;
            }
        }

        .down {
            height: 100%;
            background-color: #fff5e1;
            padding: 0 20rpx;
        }
    }

    .goods-info {
        position: relative;

        .info-header {
            padding: 20rpx 0 0rpx 24rpx;

            .price {
                align-items: baseline;
            }
        }

        .name {
            padding: 20rpx 24rpx;
            flex: 1;
        }

        .icon-share {
            width: 134rpx;
            height: 60rpx;
        }
        .vip-price {
            margin: 0 24rpx;
            background-color: #ffe9ba;
            line-height: 36rpx;
            border-radius: 6rpx;
            overflow: hidden;

            .price-name {
                background-color: #101010;
                padding: 3rpx 12rpx;
                color: #ffd4b7;
                position: relative;
                overflow: hidden;

                &::after {
                    content: '';
                    display: block;
                    width: 20rpx;
                    height: 20rpx;
                    position: absolute;
                    right: -15rpx;
                    background-color: #ffe9ba;
                    border-radius: 50%;
                    top: 50%;
                    transform: translateY(-50%);
                    box-sizing: border-box;
                }
            }
        }
    }

    .details-null {
        padding-top: 140rpx;
        margin-bottom: 100rpx;
    }

    .spec {
        padding: 24rpx 24rpx;

        .text {
            width: 100rpx;
        }
    }

    .evaluation {
        .title {
            height: 100rpx;
            border-bottom: $-solid-border;
            padding: 0 24rpx;
        }

        .con {
            padding: 30rpx 24rpx;
        }

        .user-info .avatar {
            width: 60rpx;
            height: 60rpx;
            border-radius: 50%;
        }
    }

    .details {
        // overflow: hidden;
        .title {
            line-height: 88rpx;
            text-align: center;
        }

        & > .content {
            padding: 0 20rpx 20rpx;

            ::v-deep image {
                vertical-align: middle;
            }

            // #ifdef H5
            ::v-deep img {
                vertical-align: middle;
            }

            // #endif
            // #ifdef MP-WEIXIN || APP-PLUS
            ::v-deep ._img {
                display: block;
            }

            // #endif
        }
    }

    .footer {
        height: 100rpx;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        box-sizing: content-box;
        padding-bottom: env(safe-area-inset-bottom);

        .btn {
            width: 100rpx;
            height: 100rpx;
            position: relative;
            line-height: 1.3;
        }

        .cart-num {
            position: absolute;
            left: 60rpx;
            top: 6rpx;
        }

        .add-cart,
        .right-buy,
        .consult-btn {
            flex: 1;
            text-align: center;
            padding: 16rpx 0;
        }

        .add-cart {
            background-color: #ffa630;
        }

        .right-buy {
            background-color: $-color-primary;
        }
        .consult-btn {
            background: linear-gradient(to right, #ff8e00 0%, #ff2c3c 100%);
        }
    }

    .group-play {
        .title {
            padding: 20rpx 28rpx;
            border-bottom: $-solid-border;
        }

        .steps {
            padding: 20rpx 28rpx;

            .step {
                flex: none;
            }

            .line {
                flex: 1;
                border: 1px dashed #999999;
                margin: 0 20rpx;
            }

            .number {
                border: 1rpx solid #707070;
                width: 28rpx;
                height: 28rpx;
                border-radius: 50%;
                line-height: 28rpx;
                text-align: center;
                margin-right: 6rpx;
            }
        }
    }

    .group-list {
        .group-item {
            padding: 20rpx 24rpx;

            &:not(:last-of-type) {
                border-bottom: $-solid-border;
            }

            .group-btn {
                background: linear-gradient(90deg, #f95f2f 0%, #ff2c3c 100%);
                height: 58rpx;
                padding-left: 28rpx;
                padding-right: 28rpx;
                margin-left: 30rpx;
                box-shadow: 0px 6rpx 12rpx rgba(249, 47, 138, 0.4);
            }
        }
    }

    .share-money {
        position: fixed;
        left: 20rpx;
        bottom: calc(130rpx + env(safe-area-inset-bottom));
        transform: scale(0);
        transition: all 0.3s;

        &.show {
            transform: scale(1);
        }

        .share-close {
            width: 34rpx;
            height: 34rpx;
            background: #a7a7a7;
            border-radius: 50%;
        }

        .share-con {
            background: url('../../static/images/bg_packet_img.png');
            width: 241rpx;
            height: 208rpx;
            background-size: 100%;
            padding-top: 20rpx;
            text-align: center;
        }
    }
}
</style>

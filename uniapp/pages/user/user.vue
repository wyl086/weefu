<template>
    <view class="user" :style="[background]">
        <!-- #ifndef  H5 -->
        <u-sticky offset-top="0" h5-nav-height="0" bg-color="transparent">
            <u-navbar
                :is-back="false"
                title="个人中心"
                :title-bold="true"
                :is-fixed="false"
                :border-bottom="false"
                :background="{ background: 'rgba(256,256, 256,' + navBg + ')' }"
                :title-color="navBg > 0.5 ? '#000' : '#fff'"
            ></u-navbar>
        </u-sticky>
        <!-- #endif -->
        <view class="header">
            <view class="hd-wrap bg-white">
                <view class="user-info flex row-between">
                    <router-link to="/bundle/pages/user_profile/user_profile">
                        <view class="info flex">
                            <image
                                class="avatar m-r-20 flex-none"
                                :src="
                                    isLogin ? userInfo.avatar : '/static/images/portrait_empty.png'
                                "
                            />
                            <view v-if="isLogin">
                                <view class="name flex">
                                    <view class="xxl bold line-2">{{ userInfo.nickname }}</view>
                                    <view
                                        class="level br60 m-l-10 flex-none flex"
                                        v-if="userInfo.vip"
                                    >
                                        <text class="m-r-10">
                                            <text class="v xxl m-r-4">v</text>
                                            <text class="xxs">{{ userInfo.vip }}</text>
                                        </text>
                                        <text class="xxs">{{ userInfo.level_name }}</text>
                                    </view>
                                </view>
                                <view class="flex m-t-10" v-if="userInfo.sn">
                                    <view class="user-id xs m-r-20">会员ID: {{ userInfo.sn }}</view>
                                    <view class="xs primary row-center m-l-5" @tap.stop="onCopy"
                                        >复制</view
                                    >
                                </view>
                            </view>
                            <view v-else>
                                <view style="font-size: 42rpx">点击登录</view>
                                <view class="sm m-t-10 lighter">登录体验更多功能</view>
                            </view>
                        </view>
                    </router-link>
                    <view class="flex m-l-20">
                        <router-link to="/bundle/pages/user_set/user_set">
                            <view class="user-opt">
                                <image
                                    style="width: 58rpx; height: 58rpx"
                                    src="/static/images/icon_my_setting.png"
                                >
                                </image>
                            </view>
                        </router-link>
                    </view>
                </view>
                <view class="user-assets flex m-t-20 m-b-20">
                    <router-link
                        class="user-assests-item"
                        to="/bundle/pages/user_wallet/user_wallet"
                    >
                        <view class="flex-col col-center">
                            <view class="xl primary">
                                {{ userInfo.user_money || 0 }}
                            </view>
                            <view class="sm m-t-10"> 余额 </view>
                        </view>
                    </router-link>
                    <router-link
                        class="user-assests-item"
                        to="/bundle/pages/user_collection/user_collection"
                    >
                        <view class="flex-col col-center">
                            <view class="xl primary">
                                {{ userInfo.collect || 0 }}
                            </view>
                            <view class="sm m-t-10"> 收藏 </view>
                        </view>
                    </router-link>
                    <router-link
                        class="user-assests-item"
                        to="/bundle/pages/user_coupon/user_coupon"
                    >
                        <view class="flex-col col-center">
                            <view class="xl primary">
                                {{ userInfo.coupon || 0 }}
                            </view>
                            <view class="sm m-t-10"> 优惠券 </view>
                        </view>
                    </router-link>
                </view>
            </view>
        </view>

        <view class="order-nav bg-white">
            <router-link to="/bundle/pages/user_order/user_order">
                <view class="title flex row-between">
                    <view class="lg">我的订单</view>
                    <view class="muted sm row">
                        全部订单
                        <u-icon name="arrow-right" size="28rpx" />
                    </view>
                </view>
            </router-link>
            <view class="nav flex">
                <router-link
                    class="item"
                    :to="{
                        path: '/bundle/pages/user_order/user_order',
                        query: { type: 'pay' }
                    }"
                >
                    <view class="flex-col col-center m-b-20">
                        <view class="icon-contain">
                            <view
                                v-if="userInfo.wait_pay"
                                class="badge xs flex row-center bg-white"
                            >
                                {{ userInfo.wait_pay }}
                            </view>
                            <image
                                class="nav-icon"
                                src="/static/images/icon_my_payment.png"
                            ></image>
                        </view>
                        <view class="sm m-t-10">待付款</view>
                    </view>
                </router-link>
                <router-link class="item" to="/bundle/pages/user_order/user_order?type=delivery">
                    <view class="flex-col col-center m-b-20">
                        <view class="icon-contain">
                            <view
                                v-if="userInfo.wait_delivery"
                                class="badge xs flex row-center bg-white"
                            >
                                {{ userInfo.wait_delivery }}
                            </view>
                            <image
                                class="nav-icon m-b-10"
                                src="/static/images/icon_my_fahuo.png"
                            ></image>
                        </view>
                        <view class="sm">待发货</view>
                    </view>
                </router-link>
                <router-link class="item" to="/bundle/pages/user_order/user_order?type=delivery">
                    <view class="flex-col col-center m-b-20">
                        <view class="icon-contain">
                            <view
                                v-if="userInfo.wait_take"
                                class="badge xs flex row-center bg-white"
                            >
                                {{ userInfo.wait_take }}
                            </view>
                            <image
                                class="nav-icon"
                                src="/static/images/icon_my_shouhuo.png"
                            ></image>
                        </view>
                        <view class="sm m-t-10">待收货</view>
                    </view>
                </router-link>
                <router-link class="item" to="/bundle/pages/user_comment/user_comment">
                    <view class="flex-col col-center m-b-20">
                        <view class="icon-contain">
                            <view
                                v-if="userInfo.wait_comment"
                                class="badge xs flex row-center bg-white"
                            >
                                {{ userInfo.wait_comment }}
                            </view>
                            <image
                                class="nav-icon"
                                src="/static/images/icon_my_pingjia.png"
                            ></image>
                        </view>
                        <view class="sm m-t-10">商品评价</view>
                    </view>
                </router-link>
                <router-link class="item" to="/bundle/pages/after_sales/after_sales">
                    <view class="flex-col col-center m-b-20">
                        <view class="icon-contain">
                            <view
                                v-if="userInfo.after_sale"
                                class="badge xs flex row-center bg-white"
                            >
                                {{ userInfo.after_sale }}
                            </view>
                            <image
                                class="nav-icon"
                                src="/static/images/icon_my_shouhou.png"
                            ></image>
                        </view>
                        <view class="sm m-t-10">退款/售后</view>
                    </view>
                </router-link>
            </view>
        </view>
        <view class="server-nav bg-white" v-if="menuList && menuList.length > 0">
            <view>
                <view class="title flex row-between">
                    <view class="lg">我的功能</view>
                </view>
            </view>
            <view class="nav flex flex-wrap">
                <view
                    v-for="(item, index) in menuList"
                    :key="index"
                    class="item flex-col col-center m-b-20"
                    style="width: 25%"
                    @tap="menuJump(item)"
                >
                    <image class="nav-icon" :src="item.image"></image>
                    <view class="sm m-t-10">{{ item.name }}</view>
                </view>
            </view>
        </view>
        <goods-column ref="mescrollItem"></goods-column>
        <tabbar></tabbar>
    </view>
</template>

<script>
import MescrollCompMixin from '@/components/mescroll-uni/mixins/mescroll-comp'
import { mapGetters, mapActions } from 'vuex'
import { getMenu } from '@/api/store'
import { toLogin } from '@/utils/login'
import { menuJump, copy } from '@/utils/tools'
import Cache from '@/utils/cache'
const app = getApp()
export default {
    mixins: [MescrollCompMixin],
    data() {
        return {
            showNav: false,
            navBg: 0,
            menuList: []
        }
    },

    onLoad(options) {
        this.getMenuFun()
    },

    onShow() {
        this.getUser()
        this.getCartNum()
        console.log(this.userInfo)
    },

    onPageScroll(e) {
        const top = uni.upx2px(100)
        const { scrollTop } = e
        let percent = scrollTop / top > 1 ? 1 : scrollTop / top
        this.navBg = percent
    },
    onPullDownRefresh() {
        this.getUser().then(() => {
            uni.stopPullDownRefresh()
        })
        this.getMenuFun()
    },
    methods: {
        ...mapActions(['getCartNum', 'getUser']),
        goLogin() {
            let { isLogin } = this
            if (isLogin) {
                uni.navigateTo({
                    url: '/bundle/pages/user_profile/user_profile'
                })
                return
            }
            uni.navigateTo({
                url: '/pages/login/login'
            })
        },

        goPage(url) {
            if (!this.isLogin) return toLogin()
            uni.navigateTo({
                url
            })
        },
        async getMenuFun() {
            const { data, code } = await getMenu({
                type: 2
            })
            if (code == 1) {
                this.menuList = data
            }
        },
        onCopy(e) {
            copy(this.userInfo.sn)
        },
        menuJump(item) {
            menuJump(item)
        }
    },
    computed: {
        ...mapGetters(['userInfo', 'inviteCode', 'appConfig']),
        background() {
            const { center_setting } = this.appConfig
            return center_setting.top_bg_image
                ? {
                      'background-image': `url(${center_setting.top_bg_image})`
                  }
                : {}
        }
    }
}
</script>
<style lang="scss" scoped>
.user {
    background-image: url(../../static/images/my_topbg.png);
    background-size: 100% auto;
    background-repeat: no-repeat;

    .header {
        margin: 0 20rpx;
        padding-top: 20rpx;

        .hd-wrap {
            padding-bottom: 20rpx;
            border-radius: 20rpx;
        }

        .user-info {
            padding: 30rpx;

            .avatar {
                height: 110rpx;
                width: 110rpx;
                border-radius: 50%;
                overflow: hidden;
            }

            .name {
                text-align: left;
                margin-bottom: 5rpx;
            }

            .user-id {
                border: $-solid-border;
                border-radius: 100rpx;
                padding: 2rpx 15rpx;
            }

            .user-opt {
                position: relative;

                .dot {
                    position: absolute;
                    background-color: #ee0a24;
                    border: 2rpx solid #ffffff;
                    color: $-color-primary;
                    border-radius: 100%;
                    top: 6rpx;
                    right: 0rpx;
                    font-size: 22rpx;
                    min-width: 16rpx;
                    height: 16rpx;
                }
            }

            .level {
                background: #333;
                padding: 0 15rpx;
                color: #ffdea5;
                line-height: 40rpx;

                .v {
                    font-style: italic;
                }
            }
        }

        .user-assets {
            flex: 1;

            .user-assests-item {
                flex: 1;
            }
        }
    }

    .order-nav {
        .icon-contain {
            position: relative;
        }
    }

    .order-nav,
    .my-assets {
        margin: 20rpx 20rpx 0;
        border-radius: 8rpx;
    }

    .server-nav {
        margin: 20rpx;
        border-radius: 8rpx;
    }

    .title {
        height: 88rpx;
        padding: 0 30rpx;
        border-bottom: $-dashed-border;
    }

    .nav {
        padding: 26rpx 0 0;

        .assets-item {
            flex: 1;
        }

        .item {
            width: 25%;
        }

        .badge {
            padding: 0 6rpx;
            min-width: 28rpx;
            height: 28rpx;
            border-radius: 28rpx;
            box-sizing: border-box;
            border: 1rpx solid $-color-primary;
            color: $-color-primary;
            position: absolute;
            left: 33rpx;
            top: -10rpx;
            z-index: 2;
        }

        .nav-icon {
            width: 52rpx;
            height: 52rpx;
        }
    }
}
</style>

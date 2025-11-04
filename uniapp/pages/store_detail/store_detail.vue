<template>
    <view
        :style="{
            'background-image': `url(${$getImageUri(
                '/static/common/image/default/shopdetial.png'
            )})`
        }"
    >
        <!-- #ifndef  H5 -->

        <u-sticky offset-top="0" h5-nav-height="0" bg-color="transparent">
            <u-navbar
                :is-back="true"
                title="店铺信息"
                :title-bold="true"
                :is-fixed="false"
                :border-bottom="false"
                :background="{ background: 'rgba(256,256, 256,0)' }"
            ></u-navbar>
        </u-sticky>
        <!-- #endif -->
        <view class="store-detail" v-show="shopInfo.name">
            <view class="store-header">
                <view class="store-info">
                    <u-image
                        width="150rpx"
                        height="150rpx"
                        border-radius="50%"
                        :src="shopInfo.logo"
                    />
                    <view class="flex-col m-l-20">
                        <view class="lg bold m-t-20 flex">
                            <view class="tag xxs m-r-10 white" v-if="shopInfo.type == 1">
                                自营
                            </view>
                            {{ shopInfo.name }}
                        </view>
                    </view>
                    <view
                        class="column white br60 sm flex-none subscribe-btn m-t-20"
                        :class="{ gray: shopInfo.shop_follow_status === 1 }"
                        @tap="changeShopFollowFun"
                    >
                        <view>
                            {{ shopInfo.shop_follow_status === 1 ? '已关注' : '关注' }}
                        </view>
                        <view class="xxs m-t-5"> {{ shopInfo.follow_num }}人关注 </view>
                    </view>
                </view>
            </view>
            <view class="store-header bg-white">
                <view class="store-row flex row-between" @click="showcodePopup = true">
                    <view class="m-r-20"> 店铺二维码 </view>
                    <image
                        style="height: 40rpx; width: 40rpx"
                        src="../../static/images/shop.png"
                    ></image>
                </view>
                <view class="store-row flex row-between" @tap="goLicense">
                    <view class="m-r-20"> 资质证明 </view>
                    <image
                        style="height: 40rpx; width: 40rpx"
                        src="../../static/images/Certificate.png"
                    ></image>
                </view>
                <router-link
                    :to="{ path: '/bundle/pages/chat/chat', query: { shop_id: shopInfo.id } }"
                >
                    <view class="store-row flex row-between">
                        <view class="">联系客服</view>
                        <!-- <u-icon name="arrow-right" /> -->
                        <image
                            style="height: 40rpx; width: 40rpx"
                            src="../../static/images/service.png"
                        ></image>
                    </view>
                </router-link>
            </view>
            <view class="store-header m-t-20 bg-white">
                <view class="store-row flex row-between" @click="showPopup = true">
                    <view class="m-r-20 flex-none"> 店铺简介 </view>
                    <view class="flex">
                        <view class="nr line-1">
                            {{ shopInfo.intro }}
                        </view>
                        <u-icon name="arrow-right" />
                    </view>
                </view>

                <view class="store-row flex row-between">
                    <view class="m-r-20 flex-none"> 所在地址 </view>
                    <view class="nr line-1">
                        {{ shopInfo.province }}
                        {{ shopInfo.city }}
                        {{ shopInfo.district }}
                        {{ shopInfo.address }}
                    </view>
                </view>

                <view class="store-row flex row-between">
                    <view class="m-r-20 flex-none"> 开业时间 </view>
                    <view class="nr line-1">
                        {{ shopInfo.create_time }}
                    </view>
                </view>
            </view>

            <!-- <router-link
            :to="{ path: '/pages/store_index/store_index', query: { shop_id: shopInfo.id } }"
        > -->
            <view class="contact-offical flex row-center bg-white m-t-20" @click="handleClick">
                查看全部商品
            </view>
            <!-- </router-link> -->
            <u-popup
                v-model="showPopup"
                mode="bottom"
                border-radius="14"
                :closeable="true"
                :safe-area-inset-bottom="true"
                mask-close-able
            >
                <view style="padding: 0 30rpx">
                    <view class="store-desc">店铺简介</view>
                    <scroll-view scroll-y="true" class="scroll-Y" style="height: 600rpx">
                        {{ shopInfo.intro }}
                    </scroll-view>
                </view>
            </u-popup>
            <u-popup
                v-model="showcodePopup"
                mode="center"
                border-radius="14"
                :closeable="false"
                mask-close-able
            >
                <view
                    style="padding: 30rpx; width: 600rpx"
                    class="bg-white flex flex-col row-center"
                >
                    <view class="store-desc bold xxl"> {{ shopInfo.name }}</view>
                    <view style="text-align: center"> 邀请好友来扫一扫分享店铺给TA</view>
                    <u-image
                        class="image-code"
                        width="250rpx"
                        height="250rpx"
                        :src="shopInfo.qr_code"
                    />
                </view>
            </u-popup>
        </view>
    </view>
</template>

<script>
import { getShopInfo, changeShopFollow } from '@/api/shop'
export default {
    data() {
        return {
            shopInfo: {},
            showPopup: false,
            id: '',
            showcodePopup: false
        }
    },
    onLoad() {
        this.getShopInfoFun()
    },
    methods: {
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
            const { id } = this.$Route.query
            this.id = id
            const { data, code } = await getShopInfo({
                shop_id: id,
                //#ifdef MP-WEIXIN
                terminal: 1,
                //#endif
                //#ifndef MP-WEIXIN
                terminal: 2
                //#endif
            })
            if (code == 1) {
                this.shopInfo = data
            }
        },

        goLicense() {
            this.$Router.push({
                path: '/bundle/pages/license/license',
                query: {
                    id: this.shopInfo.id
                }
            })
        },
        handleClick() {
            this.$Router.back()
        }
    },
    computed: {
        // 获取图片域名
        $getImageUri() {
            return (url) => this.$store.state.app.config.base_domain + url
        }
    }
}
</script>

<style lang="scss">
.store-detail {
    .store-header {
        margin-left: 20rpx;
        margin-right: 20rpx;
        padding: 0rpx 20rpx;
        border-radius: 20rpx;
        .store-info {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 100%;
            padding: 40rpx 0;
            border-bottom: 1rpx solid #e5e5e5;

            .tag {
                background: linear-gradient(267deg, #ff2c3c 0%, #f52e99 100%);
                border-radius: 6rpx;
                padding: 2rpx 9rpx;
            }
            .subscribe-btn {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background: linear-gradient(97deg, #ff5784 0%, #ff2c3c 100%);
                height: 78rpx;
                width: 228rpx;
                &.gray {
                    background: #ccc;
                }
            }
        }

        .store-row {
            padding: 24rpx 15rpx;
        }
    }

    .store-desc {
        padding: 20rpx 30rpx;
        text-align: center;
    }
    .image-code {
        margin: 40rpx auto;
    }
    .contact-offical {
        height: 88rpx;
    }
}
</style>

<template>
    <view class="get-coupon" :style="[wrapStyle]">
        <view class="coupons flex bg-white" @tap="showCoupon = true" v-if="list.length">
            <view class="text muted">领券</view>
            <view class="flex-1 flex">
                <view class="con flex flex-1">
                    <view v-for="(item, index) in list" :key="index" class="coupons-item m-r-20">
                        <view v-if="index < 2" class="flex xs">
                            <view class="line-1">
                                {{ item.condition_type_desc }}
                            </view>
                        </view>
                    </view>
                </view>
                <u-icon name="arrow-right"></u-icon>
            </view>
        </view>
        <!-- 领券 -->
        <u-popup v-model="showCoupon" closeable mode="bottom" border-radius="14">
            <view>
                <view class="p-30">
                    <view class="title md bold">领券</view>
                </view>
                <view class="content bg-body">
                    <scroll-view scroll-y="true" style="height: 700rpx">
                        <coupon-list
                            :list="list"
                            @refresh="getGoodsCouponFun"
                            :btn-type="3"
                        ></coupon-list>
                    </scroll-view>
                </view>
            </view>
        </u-popup>
    </view>
</template>

<script>
import { getCouponList } from '@/api/activity'
export default {
    name: 'get-coupon',
    props: {
        goodsId: {
            type: [Number, String]
        },
        shopId: {
            type: [Number, String]
        },
        type: {
            type: String
        },
        wrapStyle: Object
    },
    data() {
        return {
            showCoupon: false,
            list: []
        }
    },
    watch: {
        goodsId(val) {
            this.getGoodsCouponFun()
        },
        shopId() {
            this.getGoodsCouponFun()
        }
    },
    methods: {
        async getGoodsCouponFun() {
            console.log(this.goodsId)
            const { data, code } = await getCouponList({
                goods_id: this.goodsId,
                shop_id: this.shopId
            })
            console.log(data)
            if (code == 1) {
                this.list = data.lists
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.get-coupon {
    .coupons {
        padding: 24rpx 24rpx;

        .text {
            width: 100rpx;
            flex: none;
        }

        .con {
            width: 400rpx;
        }

        .coupons-item {
            overflow: hidden;

            & > view {
                position: relative;
                height: 40rpx;
                line-height: 40rpx;
                padding: 0 18rpx;
                border-radius: 6rpx;
                box-sizing: border-box;
                background-color: $-color-primary;
                color: #fff;
                white-space: nowrap;
                overflow: hidden;

                &::after,
                &::before {
                    content: '';
                    display: block;
                    width: 20rpx;
                    height: 20rpx;
                    position: absolute;
                    left: -14rpx;
                    background-color: #fff;
                    border-radius: 50%;
                    border: 1px solid currentColor;
                    box-sizing: border-box;
                }

                &::after {
                    right: -14rpx;
                    left: auto;
                }
            }
        }
    }
}
</style>

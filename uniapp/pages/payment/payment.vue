<template>
    <view class="payment-pages">
        <view class="payment u-skeleton">
            <!-- Header -->
            <view class="payment-header">
                <price-format
                    class="u-skeleton-fillet"
                    :subscript-size="40"
                    :first-size="56"
                    :second-size="40"
                    :price="amount"
                    :weight="500"
                />
                <template v-if="timeout > 0">
                    <view class="payment-count-down">
                        <text>支付剩余时间</text>
                        <u-count-down
                            :timestamp="timeout"
                            :show-days="false"
                            :show-hours="false"
                            :font-size="22"
                        />
                    </view>
                </template>
            </view>

            <!-- Main -->
            <view class="payment-main">
                <view class="payway-container u-skeleton-fillet flex">
                    <!-- Payway -->
                    <u-radio-group v-model="payway" class="flex-1">
                        <view class="payway">
                            <view
                                class="payway-item"
                                v-for="(item, index) in paywayList"
                                :key="item.id"
                                @click="changePayway(item.pay_way)"
                            >
                                <u-image
                                    :src="item.image"
                                    width="48"
                                    height="48"
                                    mode="scaleToFill"
                                />
                                <view class="payway-item-content">
                                    <text class="payway-item-content-name">{{ item.name }}</text>
                                    <text class="payway-item-content-tips">{{ item.extra }}</text>
                                </view>
                                <u-radio
                                    shape="circle"
                                    :name="item.pay_way"
                                    :active-color="colorConfig.primary"
                                />
                            </view>
                        </view>
                    </u-radio-group>
                    <template v-if="!paywayList.length">
                        <view class="payway-empty">暂无支付方式</view>
                    </template>
                </view>
            </view>

            <!-- Footer -->
            <view class="payment-footer">
                <view
                    :class="['payment-submit', { 'payment-submit--disabled': loadingPay }]"
                    @tap="handlePrepay"
                >
                    <u-loading mode="circle" :show="loadingPay" />
                    <text v-show="!loadingPay">立即支付</text>
                </view>
            </view>
        </view>

        <u-skeleton :loading="loadingSkeleton" :animation="true" bgColor="#FFF" />
    </view>
</template>

<script>
/**
 * @description 支付页面
 * @query {String} from 订单来源: order-商品订单; recharge-充值订单;
 * @query {Number} order_id	订单ID
 */
import { prepay, getPayway } from '@/api/app'
import { wxpay, alipay } from '@/utils/pay'
import { getPayResult } from '@/api/order'
export default {
    name: 'Payment',

    data() {
        return {
            from: '', // 订单来源
            order_id: '', // 订单ID
            amount: 0, // 支付金额
            timeout: 0, // 倒计时间戳
            payway: '', // 支付方式
            paywayList: [], // 支付方式列表
            showAgain: false,
            loadingSkeleton: true, // 骨架屏Loading
            loadingPay: false // 支付处理中Loading
        }
    },

    methods: {
        // 更改支付方式
        changePayway(value) {
            this.$set(this, 'payway', value)
        },

        // 初始化页面数据
        initPageData() {
            // 获取支付方式
            getPayway({
                from: this.from,
                order_id: this.order_id
            })
                .then((res) => {
                    if (res.code != 1) throw new Error(res.msg)
                    return res.data
                })
                .then((data) => {
                    this.loadingSkeleton = false
                    this.amount = data.order_amount
                    this.paywayList = data.pay_way
                    this.payway = this.paywayList[0]?.pay_way
                    // 倒计时
                    const startTimestamp = new Date().getTime()
                    const endTimestamp = data.cancel_time
                    this.timeout = endTimestamp - startTimestamp / 1000
                })
                .catch((err) => {
                    throw new Error(err)
                })
        },

        // 预支付处理
        handlePrepay() {
            if (this.loadingPay) return
            this.loadingPay = true
            prepay({
                from: this.from,
                order_id: this.order_id,
                pay_way: this.payway
            })
                .then(({ code, data, pay_way }) => {
                    switch (code) {
                        case 1:
                            this.handleWechatPay(data)
                            break
                        case 10001:
                            this.handleAlipayPay(data, pay_way)
                            break
                        case 20001:
                            this.handleWalletPay()
                            break
                    }
                })
                .catch((err) => {})
                .finally(() => {
                    setTimeout(() => {
                        this.loadingPay = false
                    }, 500)
                })
        },

        // 微信支付
        handleWechatPay(data) {
            wxpay(data)
                .then((res) => {
                    console.log(res)
                    this.handPayResult(res)
                })
                .catch((err) => {
                    console.log(err)
                })
        },

        // 支付宝支付
        handleAlipayPay(data, pay_way) {
            alipay(data, pay_way)
                .then((res) => {
                    console.log(res)
                    this.handPayResult(res)
                })
                .catch((err) => {
                    console.log(err)
                })
        },

        // 钱包余额支付
        handleWalletPay() {
            console.log('支付成功')
            //余额支付成功
            this.handPayResult('success')
        },

        // 支付后处理
        handPayResult(result) {
            // 页面出栈
            //记录支付结果
            this.result = result
            // uni.navigateBack()
            this.$Router.back(1)
        }
    },

    onLoad() {
        const options = this.$Route.query
        const from = options?.from || 'trade'
        const order_id = options?.order_id

        try {
            if (!from && !order_id) throw new Error('页面参数有误')
            this.from = from
            this.order_id = order_id
            this.initPageData()
        } catch (err) {
            console.log(err)
            // uni.navigateBack()
            this.$Router.back()
        }
    },
    onShow() {
        if (this.showAgain) {
            getPayResult({
                from: this.from,
                order_id: this.order_id,
                id: this.order_id
            }).then(({ data }) => {
                if (data.pay_status) {
                    console.log(456789)

                    this.result = 'success'
                } else {
                    this.result = 'fail'
                }
                this.$Router.back(1)
            })
        }
    },
    onHide() {
        this.showAgain = true
    },

    onUnload() {
        switch (this.result) {
            case 'success':
                uni.$emit('payment', {
                    result: true,
                    order_id: this.order_id,
                    from: this.from
                })
                break
            case 'fail':
            default:
                uni.$emit('payment', {
                    result: false,
                    order_id: this.order_id,
                    from: this.from
                })
        }
    }
}
</script>

<style lang="scss">
page {
    height: 100%;
    padding: 0;
}
.payment-pages {
    height: 100%;
    .payment {
        display: flex;
        flex-direction: column;
        height: calc(100% - env(safe-area-inset-bottom));

        &-header {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 300rpx;
            background: linear-gradient(270deg, #ff2c3c 0%, #f95f2f 100%);
            color: #ffffff;
        }

        &-main {
            flex: 1;
            margin-top: -40rpx;
            padding: 0 20rpx;
            overflow: hidden;
        }

        &-footer {
            display: flex;
            align-items: center;
            height: 100rpx;
            padding: 0 20rpx;
            background-color: #ffffff;
        }

        .payway-container {
            padding: 0 20rpx;
            border-radius: 7px;
            background-color: #ffffff;

            .payway-empty {
                width: 100%;
                display: flex;
                justify-content: center;
                padding: 20rpx 0;
                font-size: 26rpx;
                color: $-color-muted;
            }
        }

        .payway {
            width: 100%;

            &-item {
                display: flex;
                align-items: center;
                height: 120rpx;
                &:nth-child(n + 2) {
                    border-top: $-dashed-border;
                }

                &-content {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    margin-left: 16rpx;

                    &-name {
                        font-size: 28rpx;
                        color: $-color-black;
                    }

                    &-tips {
                        font-size: 22rpx;
                        color: $-color-muted;
                    }
                }
            }
        }

        &-count-down {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 7rpx 25rpx;
            border-radius: 60px;
            margin-top: 10rpx;
            font-size: 22rpx;
            background-color: #ffffff;
            color: $-color-normal;
        }

        &-submit {
            flex: 1;
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 74rpx;
            font-size: 28rpx;
            border-radius: 60px;
            background: linear-gradient(270deg, #ff2c3c 0%, #f95f2f 100%);
            color: #ffffff;

            &--disabled::before {
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                height: 100%;
                display: block;
                content: '';
                background: rgba(255, 255, 255, 0.3) !important;
            }
        }
    }
}
</style>

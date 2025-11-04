<template>
    <view class="verification-list">
        <!-- Tabs -->
        <u-tabs
            :list="tabsList"
            :is-scroll="false"
            :height="80"
            :bar-style="{ top: '100%' }"
            :current="tabsIndex"
            @change="changeCurrentTab"
        />

        <!-- Order Lists -->
        <block v-for="(tabItem, tabIndex) in tabsList" :key="tabItem['sign']">
            <mescroll-uni
                v-if="currentTab['sign'] === tabItem['sign']"
                top="80rpx"
                :ref="'scroll' + '-' + tabItem['sign']"
                @init="mescrollInit"
                :up="{
                    noMoreSize: 5,
                    empty: {
                        icon: '/static/images/empty/order.png',
                        tip: '暂无订单~',
                        fixed: true
                    }
                }"
                @up="upCallback($event, tabItem['sign'])"
                @down="downCallback"
            >
                <view class="order-contain">
                    <view
                        class="order"
                        v-for="orderItem in tabsList[tabIndex].list"
                        :key="orderItem.id"
                    >
                        <!-- Order Header -->
                        <view class="order-header">
                            <view class="order-sn">联系人: {{ orderItem.consignee }}</view>
                            <view
                                :class="[
                                    'order-status',
                                    `order-status--${orderStatus[tabItem['sign']]['style']}`
                                ]"
                                >{{ orderStatus[tabItem['sign']]['name'] }}</view
                            >
                        </view>

                        <!-- Order Main -->
                        <view class="order-main">
                            <view
                                class="goods"
                                v-for="(goodsItem, goodsIndex) in orderItem.order_goods"
                            >
                                <view class="goods-wrap flex">
                                    <view class="image">
                                        <u-image
                                            :src="goodsItem.image"
                                            width="160"
                                            height="160"
                                        ></u-image>
                                    </view>

                                    <view class="m-l-16 line-1">
                                        <!-- 商品名称 -->
                                        <view class="goods-name line-1 m-t-10">{{
                                            goodsItem.goods_name
                                        }}</view>
                                        <!-- 规格数量 -->
                                        <view class="muted flex row-between xs m-t-10">
                                            <view>{{ goodsItem.spec_value }}</view>
                                            <view>x {{ goodsItem.goods_num }}</view>
                                        </view>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
            </mescroll-uni>
        </block>

        <view class="operation">
            <view
                class="operation-button"
                style="background-color: #ffffff; color: #000000"
                @click="showInputCode = true"
            >
                <u-icon class="xxl m-r-10" name="edit-pen" />
                <text>手动输入核销码</text>
            </view>
            <!-- #ifdef MP -->

            <view class="operation-button" @click="onScanQRCode">
                <u-icon class="xxl m-r-10" name="scan" />
                <text>扫码核销</text>
            </view>
            <!-- #endif -->

            <!-- 手动输入核销码MODAL -->
            <u-modal
                ref="uModalInput"
                v-model="showInputCode"
                show-cancel-button
                confirm-text="确定"
                @confirm="inputOrderCode"
                title="手动核销"
            >
                <view class="slot-content row-center" style="padding: 40rpx">
                    <u-input
                        type="number"
                        v-model="code"
                        :border="true"
                        placeholder="请输入核销码"
                        style="width: 100%"
                    />
                </view>
            </u-modal>
        </view>
    </view>
</template>

<script>
import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins.js'
import { apiVerificationOrderList } from '@/api/order'
// import OrderMixin from '@/mixins/order'
import { isWeixinClient } from '@/utils/tools'
import wechath5 from '@/utils/wechath5'

export default {
    name: 'OrderList',
    mixins: [MescrollMixin],
    // mixins: [OrderMixin],

    data() {
        return {
            // Tabs列表
            tabsList: [
                {
                    sign: 0,
                    name: '待核销',
                    list: []
                },
                {
                    sign: 1,
                    name: '已核销',
                    list: []
                }
            ],
            tabsIndex: 0, // Tabs索引

            // 订单状态
            orderStatus: {
                0: {
                    name: '待核销',
                    style: 'primary'
                },
                1: {
                    name: '已核销',
                    style: 'muted'
                }
            },

            code: '', // 核销码
            showInputCode: false // 显示(输入核销码)：是 | 否
        }
    },

    computed: {
        // 当前Tab项
        currentTab() {
            return this.tabsList[this.tabsIndex]
        },

        // 映射Tabs项
        mapTabsItem() {
            return (sign) => this.tabsList.find((item) => item['sign'] === sign)
        }
    },

    methods: {
        // 更改当前Tab页
        changeCurrentTab(index) {
            this.tabsIndex = index
        },

        // 刷新订单数据 @Mixins【/src/mixins/order.js】内调用，请勿删除
        refreshOrderData() {
            const ref = this.$refs['scroll' + '-' + this.currentTab['sign']][0]
            ref.downCallback()
        },

        // 上拉加载更多
        upCallback({ num, size }, sign) {
            const ref = this.$refs['scroll' + '-' + sign][0]

            apiVerificationOrderList({
                status: sign,
                page_no: num,
                page_size: size
            })
                .then(({ list, page_size, count }) => {
                    console.log(ref)
                    const tab = this.mapTabsItem(sign)
                    if (num === 1) tab.list = []
                    tab.list = [...tab.list, ...list]
                    ref.mescroll.endSuccess(list.length, count)
                })
                .catch((err) => {
                    console.log(err)
                    ref.mescroll.endErr()
                })
        },

        // 去订单详情
        goOrderDetail(code) {
            this.$Router.push({
                path: '/pages/verification_detail/verification_detail',
                query: { code }
            })
        },

        // 扫描二维码
        onScanQRCode() {
            // #ifdef H5
            this.$toast({ title: 'h5暂不支持扫码' })
            // if(!isWeixinClient()) return
            // wechath5.scanQRCode().then(code => this.goOrderDetail(code))
            // #endif

            // #ifndef H5
            uni.scanCode({
                scanType: ['qrCode'],
                success: (data) => {
                    console.log(data)
                    this.goOrderDetail(data.result)
                },
                fail: (err) => {
                    console.log(err)
                }
            })
            // #endif
        },

        // 手动输入核销码
        inputOrderCode() {
            if (this.code === '') return this.$toast({ title: '请输入核销码' })
            this.goOrderDetail(this.code)
        }
    },

    watch: {
        // 输入核销码弹窗
        showInputCode() {
            this.$set(this, 'code', '')
        }
    }
}
</script>

<style lang="scss" scoped>
.verification-list {
    display: flex;
    flex-direction: column;
    // max-height: 100vh;
    // overflow: hidden;
    padding-bottom: 200rpx;
}

.goods {
    width: 100%;
    padding: 20rpx;
    margin-bottom: 20rpx;
    &-wrap {
        width: 100%;
        .goods-name {
            color: #101010;
            font-size: $-font-size-nr;
        }
        .goods-price {
            color: #ff0000;
            font-size: $-font-size-nr;
        }
        > view {
            width: 100%;
        }

        .image {
            flex: 0;
        }
    }
}

.order-contain {
    padding: 0 20rpx;

    .order {
        padding-left: 20rpx;
        margin-top: 20rpx;
        border-radius: 5px;
        background-color: #ffffff;

        &-header {
            display: flex;
            height: 80rpx;
            align-items: center;
            padding-right: 20rpx;
            border-bottom: $-dashed-border;

            .order-sn {
                font-size: $-font-size-nr;
            }

            .order-status {
                margin-left: auto;
                font-size: $-font-size-sm;

                &--primary {
                    @include font_color();
                }

                &--muted {
                    color: $-color-muted;
                }
            }
        }

        &-main {
            &__spec {
                display: flex;
                justify-content: space-between;
                height: 100%;
            }
        }
    }
}

.operation {
    position: fixed;
    z-index: 99;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    padding: 0 20rpx calc(20rpx + constant(safe-area-inset-bottom)) 20rpx;
    padding: 0 20rpx calc(20rpx + env(safe-area-inset-bottom)) 20rpx;

    &-button {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 82rpx;
        border-radius: 60px;
        font-size: $-font-size-nr;
        background-color: $-color-primary;
        color: #ffffff;

        &:nth-child(n + 2) {
            margin-left: 20rpx;
        }
    }
}
</style>

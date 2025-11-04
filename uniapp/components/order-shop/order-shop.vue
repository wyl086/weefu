<template>
    <view class="order-shop">
        <view class="m-l-20">
            <shop-title :shop="{ shop_name: item.shop_name }" :is-link="false"></shop-title>
        </view>
        <view class="order-goods">
            <order-goods :list="item.goods"></order-goods>
        </view>
        <view class="item flex row-between" @tap="onShowCoupon" v-if="orderType == 0">
            <view>店铺优惠券</view>
            <view class="flex">
                <text class="primary" v-if="item.discount_amount"
                    >-￥{{ item.discount_amount }}</text
                >
                <text v-else class="muted">请选择</text>
                <u-icon name="arrow-right muted" size="24" class="m-l-10"></u-icon>
            </view>
        </view>
        <view class="item flex" @click="chengeDelivery">
            <view>配送方式</view>
            <view class="flex-1 m-l-20 muted">
                <template v-if="item.delivery_type == 1">
                    快递费
                    <price-format :price="item.shipping_price"></price-format>
                </template>
            </view>
            <!-- TODO -->
            <view>
                <!-- {{ deliveryType.delivery_type_text || "" }} -->
                {{ item.delivery_types_arr[delivery_type_index].delivery_type_text }}
                <u-icon name="arrow-right muted" size="24" class="m-l-10"></u-icon>
            </view>
        </view>

        <view
            class="flex pickCard"
            @click="openLocation"
            v-if="item.delivery_types_arr[delivery_type_index].delivery_type_text == '线下自提'"
        >
            <view>
                <image class="icon-md m-r-20" src="/static/images/icon_address.png"></image
            ></view>
            <view class="text"
                ><view
                    >{{ item.province }} {{ item.city }}{{ item.district }} {{ item.address }}
                </view>
                <view class="muted">
                    营业时间:{{ item.run_start_time }} ~ {{ item.run_end_time }}
                </view></view
            >
            <!-- <u-icon
                name="arrow-right muted"
                size="24"
                class="m-t-10 m-l-10"
                style="margin-left: auto"
            ></u-icon> -->
        </view>
        <view
            class="item flex row-between col-top m-t-20"
            @tap="handleInvoice(item.shop_id)"
            v-if="item.open_invoice"
        >
            <view>开具发票</view>
            <view class="invoice col-top">
                <text class="muted invoice--text">{{ getCurrentShopInvoice }}</text>
                <u-icon name="arrow-right muted" size="24" class="m-t-10 m-l-10"></u-icon>
            </view>
        </view>
        <view class="item flex row-between">
            <view>买家留言</view>
            <u-input
                v-model="remark"
                class="flex-1 m-l-20"
                :clearable="false"
                placeholder="请添加备注（150字以内）"
            ></u-input>
        </view>
        <view class="item flex row-right">
            共{{ item.total_num || (item.goods && item.goods[0].count) }}件，合计：
            <price-format
                weight="500"
                :color="colorConfig.primary"
                :first-size="36"
                :second-size="36"
                :price="item.total_amount || (item.goods && item.goods[0].team_price)"
            ></price-format>
        </view>

        <u-modal
            v-model="showDelivery"
            title="请选择配送方式"
            showCancelButton
            @confirm="changeDeliveryType"
            :confirm-color="colorConfig.primary"
            :z-index="9999"
        >
            <view
                class="delivery nr"
                v-for="(item2, index) in item.delivery_types_arr"
                :key="index"
            >
                <view
                    class="flex row-between bg-body delivery-item"
                    @click="delivery_type = item2.delivery_type"
                >
                    <text>{{ item2.delivery_type_text }}</text>
                    <u-checkbox
                        :value="item2.delivery_type == delivery_type"
                        shape="circle"
                    ></u-checkbox>
                </view>
            </view>
        </u-modal>

        <u-popup
            v-if="orderType == 0"
            v-model="showCoupon"
            border-radius="14"
            mode="bottom"
            closeable
            :safe-area-inset-bottom="true"
        >
            <view class="p-30">
                <view class="title">优惠券</view>
            </view>
            <view v-if="showCoupon">
                <tabs :current="active" :bar-width="100" :is-scroll="false">
                    <tab :name="'可使用优惠券 (' + usableCoupon.length + ')'">
                        <coupon-order
                            :list="usableCoupon"
                            :type="0"
                            @change="onSelectCoupon"
                            :coupon-id="couponId"
                        >
                        </coupon-order>
                    </tab>
                    <tab :name="'不可用优惠券 (' + unusableCoupon.length + ')'">
                        <coupon-order
                            :list="unusableCoupon"
                            :type="1"
                            @change="showCoupon = false"
                        ></coupon-order>
                    </tab>
                </tabs>
            </view>
        </u-popup>
    </view>
</template>

<script>
import { getOrderCoupon } from '@/api/activity'
import { invoiceType } from '@/utils/type.js'
export default {
    name: 'order-shop',
    props: {
        item: {
            type: [Object, Array]
        },
        teamId: {
            type: [Number, undefined]
        },
        bargainLaunchId: {
            type: [Number, undefined]
        },
        orderType: {
            type: Number
        },
        invoice: {
            type: [Object, Array]
        }
    },
    data() {
        return {
            active: 0,
            remark: '',
            showCoupon: false,
            showDelivery: false,
            delivery_type: this.item.delivery_type,
            delivery_type_index: 0,
            usableCoupon: [],
            unusableCoupon: [],
            usableCouponL: 0,
            unusableCouponL: 0,
            isRequest: false,
            couponId: '',
            invoiceInfo: {} // 发票内容
        }
    },
    computed: {
        // 获取当前发票选择显示在视图上
        getCurrentShopInvoice() {
            const invoice = this.invoiceInfo
            if (invoice.name) {
                return `${invoice.type == 0 ? '普通发票' : '专用发票'} - ${
                    invoice.header_type == 0 ? '个人' : '企业'
                } - ${invoice.name}`
            } else {
                return '不开发票'
            }
        }
        // deliveryType() {
        //   console.log(this.item, 1234);
        //   return this.item.delivery_types_arr.find((i) => {
        //     return i.delivery_type == this.delivery_type;
        //   });
        // },
    },
    methods: {
        openLocation(row) {
            uni.openLocation({
                //?使用微信内置地图查看位置。
                latitude: Number(row.latitude), //要去地点的纬度
                longitude: Number(row.longitude), ///要去地点的经度-地址
                name: row.name, //地点名称
                address: row.address_detail //详细地点名称
            })
        },
        onShowCoupon() {
            if (!this.isRequest) {
                uni.showLoading({
                    title: '加载中...'
                })
                this.getCoupon()
            } else {
                this.showCoupon = true
            }
        },
        async getCoupon() {
            const {
                item: { goods, shop_id }
            } = this
            const params = goods.map(({ item_id, num, goods_id }) => ({
                item_id,
                num,
                goods_id
            }))
            const { data, code } = await getOrderCoupon({
                goods: params,
                shop_id: shop_id
            })
            if (code == 1) {
                this.isRequest = true
                this.usableCoupon = data.suit
                this.usableCouponL = data.suit.length
                this.unusableCoupon = data.un_suit
                this.unusableCouponL = data.un_suit.length
                this.showCoupon = true
                uni.hideLoading()
            }
        },
        chengeDelivery() {
            // if (this.item.delivery_type == 1) return;
            this.showDelivery = true
        },
        changeDeliveryType() {
            this.delivery_type_index = this.item.delivery_types_arr.findIndex(
                (iten) => iten.delivery_type === this.delivery_type
            )
            this.$emit('changeDeliveryType', this.delivery_type)
        },
        // 选择发票
        handleInvoice(shopId) {
            this.$Router.push({
                path: '/bundle/pages/invoice/invoice',
                query: {
                    shop_id: shopId,
                    invoice: JSON.stringify(this.invoiceInfo),
                    type: invoiceType['SETTLEMENT']
                }
            })
        },
        onSelectCoupon(e) {
            this.couponId = e
            this.$emit('changecoupon', e)
            this.showCoupon = false
        }
    },
    watch: {
        remark(val) {
            this.$emit('changeremark', {
                shop_id: this.item.shop_id,
                remark: val
            })
        },
        invoice(val) {
            const res = val.filter((el) => el.shop_id == this.item.shop_id)
            if (res.length) {
                this.invoiceInfo = res[0]
            } else {
                this.invoiceInfo = {}
            }
        }
    }
}
</script>

<style lang="scss">
.order-shop {
    .order-goods {
        border-top: $-solid-border;
    }

    .item {
        height: 88rpx;
        padding: 0 24rpx;

        .invoice {
            display: flex;
            &--text {
                width: 300rpx;
                text-align: right;
            }
        }
    }
}

.delivery {
    &-item {
        padding: 24rpx 14rpx;
        margin: 0 40rpx 30rpx;
        border-radius: 10rpx;
    }
}
.pickCard {
    padding: 24rpx;
    height: 100rpx;
    background-color: #ffefe9;
    margin: 0 24rpx;
    border-radius: 20rpx;
    .text {
        font-size: 24rpx;
    }
}
</style>

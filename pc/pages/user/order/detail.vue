<template>
    <div class="order-detail">
        <div class="detail-hd row-between">
            <div class="lg">订单详情</div>
            <div
                :class="[
                    'status lg',
                    { primary: orderDetail.order_status == 0 },
                ]"
            >
                {{ orderDetail.order_status_desc }}
            </div>
        </div>

        <div class="address" v-if="orderDetail.delivery_type != 1">
            <div class="address-item">
                <div class="lighter address-item-label">收件人：</div>
                <div>{{ orderDetail.consignee }}</div>
            </div>
            <div class="address-item">
                <div class="lighter address-item-label">联系方式：</div>
                <div>{{ orderDetail.mobile }}</div>
            </div>

            <div class="address-item">
                <div class="lighter address-item-label">收货地址：</div>
                <div>{{ orderDetail.delivery_address }}</div>
            </div>
        </div>

        <div class="detail-con">
            <div class="title flex">
                <nuxt-link
                    class="flex-1 lighter sm line-1 m-r-20"
                    style="min-width: 0"
                    :to="`/shop_street_detail?id=${orderDetail.shop.id}`"
                >
                    {{ orderDetail.shop.name }}
                </nuxt-link>
                <div class="flex-1 lighter sm">
                    下单时间：{{ orderDetail.create_time }}
                </div>
                <div class="flex-1 lighter sm">
                    订单编号：{{ orderDetail.order_sn }}
                </div>
                <div
                    :class="[
                        'status sm',
                        { primary: orderDetail.order_status == 0 },
                    ]"
                >
                    {{ getOrderStatus(orderDetail.order_status) }}
                </div>
            </div>
            <div class="goods">
                <div class="goods-hd lighter flex">
                    <div class="info flex-1">商品信息</div>
                    <div class="price flex row-center">商品价格</div>
                    <div class="num flex row-center">数量</div>
                    <div class="total flex row-center">合计</div>
                </div>
                <div class="goods-list">
                    <div
                        class="goods-item flex"
                        v-for="(item, index) in orderDetail.order_goods"
                        :key="index"
                    >
                        <nuxt-link
                            :to="`/goods_details/${item.goods_id}`"
                            class="info flex flex-1"
                        >
                            <el-image
                                class="goods-img"
                                :src="item.image"
                                alt=""
                            />
                            <div class="goods-info flex-1">
                                <div class="goods-name line-2">
                                    <el-tag
                                        size="mini"
                                        effect="plain"
                                        v-if="item.is_seckill"
                                        >秒杀</el-tag
                                    >
                                    {{ item.goods_name }}
                                </div>
                                <div class="sm lighter m-t-8">
                                    {{ item.spec_value }}
                                </div>
                            </div>
                        </nuxt-link>
                        <div class="price">
                            <price-formate :price="item.goods_price" />
                        </div>
                        <div class="num flex row-center">
                            {{ item.goods_num }}
                        </div>
                        <div class="total flex row-center">
                            <price-formate :price="item.sum_price" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="m-t-16" v-if="orderDetail.user_remark">
                <span class="lighter m-r-8">买家留言：</span>
                <span>{{ orderDetail.user_remark }}</span>
            </div>
            <div class="m-t-16" v-if="orderDetail.delivery_content">
                <span class="lighter m-r-8">发货内容：</span>
                <span>{{ orderDetail.delivery_content }}</span>
            </div>
        </div>
        <div class="detail-footer flex">
            <div>
                <div class="flex-col" style="align-items: flex-end">
                    <div class="money flex m-b-8">
                        <div class="lighter">商品总价：</div>
                        <div>
                            <price-formate :price="orderDetail.goods_price" />
                        </div>
                    </div>
                    <div class="money flex m-b-8">
                        <div class="lighter">运费：</div>
                        <div>
                            <price-formate
                                :price="orderDetail.shipping_price"
                            />
                        </div>
                    </div>
                    <div class="money flex m-b-8">
                        <div class="lighter">会员抵扣：</div>
                        <div class="primary">
                            -<price-formate
                                :price="orderDetail.member_amount"
                                color="#FF0808"
                            />
                        </div>
                    </div>
                    <div
                        class="money flex m-b-16"
                        v-if="orderDetail.discount_amount != 0"
                    >
                        <div class="lighter">优惠券：</div>
                        <div>
                            -
                            <price-formate
                                :price="orderDetail.discount_amount"
                            />
                        </div>
                    </div>
                    <div class="money flex">
                        <div class="lighter">实付金额：</div>
                        <div class="primary">
                            <price-formate
                                :price="orderDetail.order_amount"
                                :subscript-size="14"
                                :first-size="28"
                                :second-size="28"
                            />
                        </div>
                    </div>
                </div>
                <div class="oprate-btn flex row-right m-t-16">
                    <div
                        class="btn plain flex row-center lighter"
                        v-if="orderDetail.cancel_btn"
                        @click="handleOrder(0)"
                    >
                        取消订单
                    </div>
                    <div
                        class="btn plain flex row-center m-l-8 lighter"
                        v-if="orderDetail.delivery_btn"
                        @click="showDeliverPop = true"
                    >
                        物流查询
                    </div>
                    <div
                        class="btn bg-primary flex row-center white m-l-8"
                        v-if="orderDetail.take_btn"
                        @click="handleOrder(2)"
                    >
                        确认收货
                    </div>
                    <div
                        class="btn plain flex row-center lighter m-l-8"
                        v-if="orderDetail.del_btn"
                        @click="handleOrder(1)"
                    >
                        删除订单
                    </div>
                    <nuxt-link
                        :to="`/payment?id=${orderDetail.id}&from=order`"
                        class="btn bg-primary flex row-center white m-l-8"
                        v-if="orderDetail.pay_btn"
                    >
                        <span class="mr8">去付款</span>
                        <count-down
                            v-if="
                                getCancelTime(orderDetail.order_cancel_time) > 0
                            "
                            :time="getCancelTime(orderDetail.order_cancel_time)"
                            format="hh:mm:ss"
                            @finish="getOrderDetail"
                        />
                    </nuxt-link>
                </div>
            </div>
        </div>
        <deliver-search v-model="showDeliverPop" :aid="id" />
    </div>
</template>

<script>
import { copyClipboard } from "@/utils/tools";

export default {
    head() {
        return {
            title: this.$store.getters.headTitle,
            link: [
                {
                    rel: "icon",
                    type: "image/x-icon",
                    href: this.$store.getters.favicon,
                },
            ],
        };
    },
    layout: "user",
    async asyncData({ $get, query }) {
        const { data, code } = await $get("order/getOrderDetail", {
            params: {
                id: query.id,
            },
        });

        if (code == 1) {
            return {
                orderDetail: data,
                id: query.id,
            };
        }
    },
    data() {
        return {
            orderDetail: {},
            showDeliverPop: false,
        };
    },

    mounted() {
        if (this.orderDetail.delivery_type === 2) {
            this.creatQrCode(this.orderDetail.pickup_code);
        }
    },

    methods: {
        async getOrderDetail() {
            const { data, code } = await this.$get("order/getOrderDetail", {
                params: {
                    id: this.id,
                },
            });
            if (code == 1) {
                this.orderDetail = data;
            }
        },
        handleOrder(type) {
            this.type = type;
            this.$confirm(this.getTipsText(type), {
                title: "温馨提示",
                center: true,
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                width: "300px",
                callback: (action) => {
                    if (action == "confirm") {
                        this.postOrder();
                    }
                },
            });
        },
        async postOrder() {
            const { type, id } = this;
            let url = "";
            switch (type) {
                case 0:
                    url = "order/cancel";
                    break;
                case 1:
                    url = "order/del";
                    break;
                case 2:
                    url = "order/confirm";
                    break;
            }
            let { code, data, msg } = await this.$post(url, { id });
            if (code == 1) {
                this.$message({
                    message: msg,
                    type: "success",
                });
                if (type == 1) {
                    setTimeout(() => {
                        this.$router.go(-1);
                    }, 1500);
                } else {
                    this.getOrderDetail();
                }
            }
        },
        getTipsText(type) {
            switch (type) {
                case 0:
                    return "确认取消订单吗？";
                case 1:
                    return "确认删除订单吗?";
                case 2:
                    return "确认收货吗?";
            }
        },
    },
    computed: {
        getOrderStatus() {
            return (status) => {
                let text = "";
                switch (status) {
                    case 0:
                        text = "待支付";
                        break;
                    case 1:
                        text = "待发货";
                        break;
                    case 2:
                        text = "待收货";
                        break;
                    case 3:
                        text = "已完成";
                        break;
                    case 4:
                        text = "订单已关闭";
                        break;
                }
                return text;
            };
        },
        getCancelTime() {
            return (time) => time - Date.now() / 1000;
        },
    },
};
</script>

<style lang="scss" scoped>
.order-detail {
    padding: 0 16px 20px;

    .detail-hd {
        padding: 14px 5px;
        border-bottom: 1px solid #e5e5e5;
    }

    .address {
        padding: 16px 0;

        > div {
            margin-bottom: 10px;
        }

        &-item {
            display: flex;

            &-label {
                width: 70px;
                text-align: justify;
                text-align-last: justify;
            }
        }
    }

    .detail-con {
        .title {
            height: 40px;
            background: #f2f2f2;
            border: 1px solid #e5e5e5;
            padding: 0 20px;
        }

        .goods {
            .goods-hd,
            .goods-list {
                padding: 10px 20px;
                border: 1px solid #e5e5e5;
                border-top-width: 0;

                .goods-item {
                    padding: 10px 0;

                    .goods-name {
                        line-height: 1.5;
                    }
                }
            }

            .info {
                .goods-img {
                    width: 72px;
                    height: 72px;
                    margin-right: 10px;
                }
            }

            .price,
            .num,
            .total {
                width: 150px;
            }
        }
    }

    .detail-footer {
        padding: 25px 20px;
        justify-content: flex-end;

        .money {
            > div {
                text-align: right;

                &:first-of-type {
                    width: 80px;
                }

                &:last-of-type {
                    width: 120px;
                    display: flex;
                    justify-content: flex-end;
                }
            }
        }

        .oprate-btn {
            .btn {
                width: 152px;
                height: 44px;
                cursor: pointer;
                border-radius: 2px;

                &.plain {
                    border: $--border-base;
                }
            }
        }
    }

    .qr-container {
        width: 120px;
        height: 120px;
        padding: 6px;
        border: $--border-base;
        border-radius: 6px;
    }
}
</style>

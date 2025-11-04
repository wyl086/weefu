<template>
    <div class="payment bg-white">
        <div class="payment-hd flex">
            <template v-if="order.pay_status == 0">
                <img src="~/static/images/pay_wait.png" alt="" />
                <div class="status m-l-8 m-r-16 weight-500">
                    {{ getOrderStatus(order.order_status) }}
                </div>
                <div v-if="getCancelTime(order.cancel_time) > 0" class="flex">
                    请在
                    <count-down
                        :time="getCancelTime(order.cancel_time)"
                        format="hh时mm分ss秒"
                        :style="{ color: '#FF2C3C' }"
                        @finish="getOrder"
                    />
                    完成支付, 超时后将取消订单
                </div>
            </template>
            <template v-if="order.pay_status == 1">
                <img src="~/static/images/pay_success.png" alt="" />
                <div class="status m-l-8 m-r-16 weight-500">支付成功</div>
            </template>
        </div>
        <div class="payment-con">
            <div class="item flex m-b-16">订单编号：{{ order.order_sn }}</div>
            <div class="item flex m-b-16">
                订单价格：<span class="primary"
                    >￥{{ order.total_amount }}</span
                >
            </div>
            <div class="item flex m-b-16">
                收货地址：
                <div>
                    {{ address.contact }} {{ address.mobile }}
                    <span class="m-l-16">{{ address.delivery_address }}</span>
                </div>
            </div>
            <div class="item flex m-b-16">
                商品名称：
                <div>
                    <div
                        v-for="(item, index) in order.order_goods"
                        :key="index"
                    >
                        <div class="flex lin-1">
                            【商品{{ index + 1 }}】- {{ item.goods_name }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="payment-footer">
            <template v-if="order.pay_status == 0 && order.order_status == 0">
                <div class="title lg weight-500">请选择支付方式</div>
                <div class="flex m-t-16">
                    <div
                        class="pay-way flex row-center"
                        v-for="(item, index) in payWayArr"
                        :key="index"
                        @click="orderPay(item.pay_way)"
                    >
                        <img :src="item.image" alt="" />
                        <div class="m-l-16">
                            <span class="md">{{ item.short_name }}</span>
                            <div class="muted m-t-2 sm">{{ item.extra }}</div>
                        </div>
                    </div>
                </div>
            </template>
            <nuxt-link v-else class="btn flex row-center" to="/user/order"
                >查看订单</nuxt-link
            >
        </div>
        <el-dialog
            title="微信支付"
            :visible.sync="showWxpay"
            width="700px"
            center
            @close="clearTimer"
        >
            <div class="flex-col col-center black">
                <img class="pay-code" :src="payInfo" alt="" />
                <div class="m-t-8" style="font-size: 18px">
                    微信扫一扫，完成支付
                </div>
                <div class="pay-money flex">
                    <span>需支付金额：</span>
                    <span class="primary">
                        <price-formate
                            :price="order.total_amount"
                            :subscript-size="18"
                            :first-size="28"
                            :second-size="28"
                        />
                    </span>
                </div>
            </div>
        </el-dialog>
        <el-dialog
            title="汇付斗拱(支付宝)"
            :visible.sync="showAlipay"
            width="700px"
            center
            @close="clearTimer"
        >
            <div class="flex-col col-center black">
                <img class="pay-code" :src="payInfo" alt="" />
                <div class="m-t-8" style="font-size: 18px">
                    支付宝扫一扫，完成支付
                </div>
                <div class="pay-money flex">
                    <span>需支付金额：</span>
                    <span class="primary">
                        <price-formate
                            :price="order.total_amount"
                            :subscript-size="18"
                            :first-size="28"
                            :second-size="28"
                        />
                    </span>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { client } from "@/utils/type";
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
    async asyncData({ query, $get }) {
        const { data } = await $get("order/getPayStatus", {
            params: {
                id: query.id,
                from: query.from,
            },
        });
        return { order: data, address: data.address };
    },
    data() {
        return {
            showWxpay: false,
            showAlipay: false,
            payWayArr: [],
            payInfo: {},
            cancelTime: 0,
            alipayHtml: "",
            address: {},
        };
    },
    created() {
        this.id = this.$route.query.id;
        this.from = this.$route.query.from;
        this.getPayway();
    },
    beforeDestroy() {
        clearInterval(this.timer);
    },
    methods: {
        async getPayway() {
            const { code, data } = await this.$get("order/getPayWay", {
                params: { from: "order", order_id: this.id },
            });
            if (code == 1) {
                this.payWayArr = data.pay_way;
                if (!this.payWayArr.length)
                    this.$message({
                        message: "请联系管理员配置支付方式",
                        type: "error",
                    });
            }
        },
        async orderPay(payWay) {
            const { data, code, msg, pay_way } = await this.$post(
                "pay/unifiedpay",
                {
                    order_id: this.id,
                    pay_way: payWay,
                    from: this.from,
                }
            );
            if (code == 1) {
                this.payInfo = data;
                this.showWxpay = true;
                this.createTimer();
            } else if (code == 10001) {
                if (pay_way == "66") {
                    this.showAlipay = true;
                    this.payInfo = data;
                    this.createTimer();
                } else {
                    let divForm = document.getElementsByTagName("divform");
                    if (divForm.length) {
                        document.body.removeChild(divForm[0]);
                    }
                    const div = document.createElement("divform");
                    div.innerHTML = data; // data就是接口返回的form 表单字符串
                    document.body.appendChild(div);
                    document.forms[0].submit();
                }
            } else if (code == 20001) {
                this.$message({
                    message: msg,
                    type: "success",
                });
                this.getOrder();
            }
        },
        clearTimer() {
            clearInterval(this.timer);
        },
        createTimer() {
            if (this.timer) clearInterval(this.timer);
            this.timer = setInterval(() => {
                this.getOrder();
            }, 2000);
        },
        async getOrder() {
            const { data, code, msg } = await this.$get("order/getPayStatus", {
                params: {
                    id: this.id,
                    from: this.from,
                },
            });
            if (code == 1) {
                this.order = data;
                if (data.pay_status == 1) {
                    clearInterval(this.timer);
                    if (this.showWxpay) {
                        this.showWxpay = false;
                    } else {
                        this.showAlipay = false;
                    }
                }
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
.payment {
    margin: 16px 0;
    padding: 0 40px;

    .payment-hd {
        > img {
            width: 32px;
            height: 32px;
        }
        .status {
            font-size: 24px;
        }
    }
    .payment-con,
    .payment-hd {
        padding: 32px 0;
        border-bottom: 1px dashed $--border-color-base;
    }
    .payment-con {
        .item {
            align-items: flex-start;
        }
    }
    .payment-footer {
        padding: 32px 0;
        .pay-way {
            min-width: 200px;
            padding: 0 20px;
            height: 68px;
            cursor: pointer;
            margin-right: 32px;
            border: 1px dashed $--border-color-base;
            img {
                width: 30px;
                height: 30px;
            }
        }
        .btn {
            width: 134px;
            height: 40px;
            border: 1px solid $--border-color-base;
        }
    }
    .el-dialog {
        .pay-code {
            width: 270px;
            height: 270px;
        }
        .pay-money {
            font-size: 18px;
            margin-top: 24px;
            align-items: baseline;
        }
    }
}
</style>

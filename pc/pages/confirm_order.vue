<template>
    <div class="confirm-order">
        <!-- 配送方式 -->
        <div class="order-hd bg-white m-b-16">
            <!-- 快递配送 -->
            <div>
                <div class="title lg">收货地址</div>
                <div class="address flex row-between">
                    <div class="address-con" v-show="address.contact">
                        <div>
                            <span class="weight-500">{{
                                address.contact
                            }}</span>
                            {{ address.telephone }}
                            <el-tag
                                size="mini"
                                type="warning"
                                effect="dark"
                                v-if="address.is_default"
                                >默认</el-tag
                            >
                        </div>
                        <div class="lighter m-t-8">
                            {{ address.province }} {{ address.city }}
                            {{ address.district }}
                            {{ address.address }}
                        </div>
                        <div class="oprate primary flex">
                            <div
                                class="m-r-16"
                                @click="editAddress(address.id)"
                            >
                                修改
                            </div>
                            <div @click="showAddress = true">更换地址</div>
                        </div>
                    </div>
                    <div
                        class="address-add flex row-center"
                        @click="editAddress('')"
                    >
                        + 添加地址
                    </div>
                </div>
            </div>
        </div>

        <div class="order-con bg-white">
            <div class="goods m-b-16">
                <div class="title lg">商品明细</div>
                <div class="goods-hd flex lighter">
                    <div class="info text-center">商品信息</div>
                    <div class="price text-center">商品价格</div>
                    <div class="num text-center">数量</div>
                    <div class="money text-center">合计</div>
                </div>
                <div class="shop">
                    <div
                        class="shop-item flex-col flex-1"
                        v-for="(item, index) in orderInfo.shop"
                        :key="index"
                    >
                        <div
                            class="shop-name p-l-10 m-b-10 flex flex-1"
                            style="width: 1140px"
                        >
                            {{ item.shop_name }}
                        </div>
                        <div
                            class="goods-list flex flex-wrap flex-1"
                            style="width: 1140px"
                        >
                            <div
                                :class="['flex', 'item']"
                                v-for="(gitem, gindex) in item.goods"
                                :key="gindex"
                            >
                                <div class="info flex">
                                    <div class="pictrue flex-none">
                                        <el-image :src="gitem.image"></el-image>
                                    </div>
                                    <div>
                                        <div class="name line-2">
                                            {{ gitem.name }}
                                        </div>
                                        <div class="muted m-t-10 xs">
                                            {{ gitem.spec_value }}
                                        </div>
                                    </div>
                                </div>
                                <div class="price" style="padding-left: 70px">
                                    <price-formate :price="gitem.price" />
                                    <div
                                        class="flex m-t-6"
                                        v-if="gitem.member_amount"
                                    >
                                        <span class="xs primary">会员价:</span>
                                        <price-formate
                                            :price="gitem.member_amount"
                                            color="#FF0808"
                                        />
                                    </div>
                                </div>
                                <div class="num text-center">
                                    {{ gitem.num }}
                                </div>
                                <div class="money flex row-center">
                                    <price-formate :price="gitem.sum_price" />
                                </div>
                            </div>
                        </div>
                        <div
                            class="flex flex-1 col-top m-t-20 row-between"
                            style="width: 1140px"
                        >
                            <div class="flex flex-1">
                                <div class="remark flex flex-1 m-r-40">
                                    <div style="width: 70px">买家备注：</div>
                                    <div class="textarea" style="width: 280px">
                                        <el-input
                                            size="small"
                                            v-model="userRemark[index].remark"
                                            placeholder="选填，给商家备注留言，100字以内"
                                            resize="none"
                                        >
                                        </el-input>
                                    </div>
                                </div>
                                <div
                                    class="coupon flex flex-1 m-r-10"
                                    v-if="orderInfo.order_type == 0"
                                >
                                    <div>店铺优惠：</div>
                                    <el-select
                                        size="small"
                                        v-model="selecteCoupon[index]"
                                        placeholder="请选择"
                                        @change="orderBuy"
                                    >
                                        <el-option label="不使用" :value="0">
                                        </el-option>
                                        <el-option
                                            v-for="item in item.coupon_list"
                                            :key="item.value"
                                            :label="item.coupon_name"
                                            :value="item.id"
                                        >
                                        </el-option>
                                    </el-select>
                                </div>
                                <div class="remark flex flex-1">
                                    <div>配送方式：</div>
                                    <span>{{ item.delivery_type_text }}</span>
                                </div>
                            </div>
                            <div class="flex-col">
                                <div
                                    class="flex coupon m-b-10 flex-1 row-right"
                                    v-if="item.discount_amount"
                                >
                                    <div>优惠：</div>
                                    <div>-￥{{ item.discount_amount }}</div>
                                </div>
                                <div
                                    class="flex remark m-b-10 flex-1 row-right"
                                >
                                    <div>运费：</div>
                                    <div>￥{{ item.shipping_price }}</div>
                                </div>
                                <div class="flex m-b-20 flex-1 row-right">
                                    <span class="m-r-10">店铺合计</span>
                                    <price-formate
                                        color="#FF2C3C"
                                        :price="item.total_amount"
                                        :firstSize="17"
                                        :subscriptSize="12"
                                        :secondSize="12"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="order-footer flex bg-white">
            <div class="flex col-center">
                <div class="money flex m-r-16">
                    <div class="lighter">实付金额：</div>
                    <div class="primary" style="font-size: 20px">
                        <span class="xxs">¥</span>{{ orderInfo.total_amount }}
                    </div>
                </div>
                <div
                    class="white bg-primary lg btn flex row-center"
                    @click="submitOrder"
                >
                    去结算
                </div>
            </div>
        </div>
        <address-add
            v-model="showAddressAdd"
            :aid="editId"
            @success="orderBuy"
        />
        <address-list v-model="showAddress" @confirm="changeAddress" />
    </div>
</template>

<script>
import { mapActions } from "vuex";

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

    async asyncData({ query, $post, $get }) {
        let { goods, carts } = JSON.parse(decodeURIComponent(query.data));
        carts = carts || [];
        const asyncData = {};
        await $post("order/settlement", {
            goods: JSON.stringify(goods),
            cart_id: carts.join(),
        }).then(({ code, data, msg }) => {
            if (code == 1) {
                asyncData.orderInfo = data;
                asyncData.address = data?.address;
                asyncData.userRemark = data.shop.map((item) => ({
                    shop_id: item.shop_id,
                    remark: "",
                }));
                asyncData.selecteCoupon = data.shop.map(() => "");
            }
        });

        return asyncData;
    },

    data() {
        return {
            orderInfo: {},
            address: {},
            carts: [],
            active: 0,
            userRemark: [],
            selecteCoupon: [],
            showAddress: false,
            showAddressAdd: false,
            addressId: "",
            editId: "",
            isEdit: false,
            shopPage: 1,
        };
    },
    watch: {
        address: {
            handler(val) {
                this.addressId = val.id;
            },
            immediate: true,
        },
    },
    methods: {
        ...mapActions(["getPublicData"]),

        editAddress(id) {
            this.editId = id;
            this.showAddressAdd = true;
        },

        changeAddress(val) {
            this.addressId = val;
            this.orderBuy();
        },
        async submitOrder() {
            const { carts, goods, selecteCoupon } = this;
            const {
                orderInfo: { shop },
            } = this;
            const delivery_type = shop[0]?.delivery_type;

            goods[0].delivery_type = shop[0]?.delivery_type;
            const submitObj = {
                goods: JSON.stringify(goods),
                address_id: this.addressId,
                cart_id: carts.join(),
                coupon_id: selecteCoupon.filter((item) => item),
                delivery_type,
                remark: this.userRemark.length
                    ? JSON.stringify(this.userRemark)
                    : "",
            };
            const { data, code } = await this.$post(
                "order/submitOrder",
                submitObj
            );
            if (code == 1) {
                this.getPublicData();
                this.$router.replace({
                    path: "/payment",
                    query: {
                        id: data.trade_id,
                        from: data.type,
                    },
                });
            }
        },

        async orderBuy() {
            console.log(this.selecteCoupon);
            const { data, code } = await this.$post("order/settlement", {
                goods: JSON.stringify(this.goods),
                address_id: this.addressId,
                cart_id: this.carts.join(),
                coupon_id: this.selecteCoupon.filter((item) => item),
            });

            if (code == 1) {
                let { address } = data;
                this.orderInfo = data;
                this.address = address;
            }
        },
    },
    created() {
        const { goods, type, carts } = JSON.parse(
            decodeURIComponent(this.$route.query.data)
        );

        this.goods = goods;
        this.type = type;
        this.carts = carts || [];
    },
};
</script>

<style lang="scss" scoped>
.confirm-order {
    padding: 16px 0;

    .title {
        padding: 12px 20px;
        font-weight: bold;

        > i {
            cursor: pointer;
        }
    }

    .contact {
        padding: 10px 20px 22px;

        &-item {
            display: flex;
            align-items: center;
            height: 36px;

            &-label {
                width: 72px;
                color: #999;
            }
        }
    }

    .order-hd {
        .address {
            padding: 10px 20px 22px;

            .address-con {
                position: relative;
                cursor: pointer;
                padding: 16px 20px;
                width: 800px;
                height: 100px;
                padding-right: 150px;
                border: 1px solid $--color-primary;
                border-radius: 2px;

                &:hover {
                    .oprate {
                        display: flex;
                    }
                }

                .oprate {
                    display: none;
                    position: absolute;
                    right: 20px;
                    bottom: 9px;
                }
            }

            .address-add {
                cursor: pointer;
                width: 320px;
                height: 100px;
                border: 1px dashed $--border-color-base;
            }
        }
    }

    .order-con {
        .shop {
            padding: 0 20px;

            .shop-name {
                height: 40px;
                background-color: #f6f6f6;
                line-height: 40px;
            }
        }

        .goods {
            border-bottom: 1px dashed $--border-color-base;

            .goods-hd {
                height: 40px;
                padding: 0 20px;
            }

            .goods-list {
                .item {
                    padding: 10px 0;

                    &-disabled {
                        position: relative;

                        &::before {
                            z-index: 9;
                            position: absolute;
                            top: 0;
                            left: 0;
                            bottom: 0;
                            right: 0;
                            height: 100%;
                            display: block;
                            content: "";
                            background-color: rgba(
                                $color: #ffffff,
                                $alpha: 0.5
                            );
                        }
                    }
                }
            }

            .info {
                width: 500px;

                .pictrue {
                    margin-right: 10px;

                    .el-image {
                        width: 72px;
                        height: 72px;
                    }
                }

                .name {
                    margin-bottom: 10px;
                }

                .delivery-support {
                    font-size: 12px;
                    padding: 4px 15px;
                    border-radius: 60px;
                    margin-left: 20px;
                    background-color: #f4f4f4;
                    color: #666666;
                }
            }

            .price {
                width: 200px;
            }

            .num {
                width: 250px;
            }

            .money {
                width: 200px;
            }
        }

        .input {
            .textarea {
                margin: 0 20px;
                width: 1000px;
            }
        }

        .integral {
            .check-box {
                padding: 0 20px 12px;
            }
        }
    }

    .order-footer {
        margin-top: 2px;
        padding: 25px 20px;
        justify-content: flex-end;

        .btn {
            width: 152px;
            height: 44px;
            border-radius: 6px;
            cursor: pointer;
        }
    }
}
</style>

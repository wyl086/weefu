<template>
    <div class="shop-cart">
        <div class="cart-list">
            <div v-show="!isDataNull">
                <div class="cart-hd flex bg-white">
                    <div class="check-box">
                        <!-- 更改选中状态 type为1选中店铺/2选中商品/3全选 -->
                        <el-checkbox
                            v-model="isSelectedAll"
                            @change="onBoxClick($event, 3, '')"
                            >全选</el-checkbox
                        >
                    </div>
                    <div class="info flex row-center">商品信息</div>
                    <div class="price flex row-center">单价</div>
                    <div class="num flex row-center">数量</div>
                    <div class="money flex row-center">合计</div>
                    <div class="operate flex row-center">操作</div>
                </div>

                <div class="cart-con bg-white">
                    <div
                        class="m-b-10 bg-white"
                        v-for="(item, index) in shopCartList"
                        :key="index"
                    >
                        <div class="flex shop">
                            <!-- 更改选中状态 type为1选中店铺/2选中商品/3全选 -->
                            <el-checkbox
                                :value="item.is_selected == 1"
                                @change="onBoxClick($event, 1, index)"
                            >
                            </el-checkbox>

                            <div class="xs normal m-l-10">
                                {{ item.shop.shop_name }}
                            </div>
                        </div>
                        <div
                            class="item flex"
                            v-for="(item2, index2) in item.cart"
                            :key="index2"
                        >
                            <div class="check-box">
                                <!-- 更改选中状态 type为1选中店铺/2选中商品/3全选 -->
                                <el-checkbox
                                    :value="item2.selected == 1"
                                    @change="
                                        onBoxClick($event, 2, item2.cart_id)
                                    "
                                >
                                </el-checkbox>
                            </div>
                            <nuxt-link
                                class="info flex"
                                :to="'/goods_details/' + item2.goods_id"
                            >
                                <div class="pictrue flexnone">
                                    <img :src="item2.image" alt="" />
                                </div>
                                <div>
                                    <div class="name line2">
                                        {{ item2.goods_name }}
                                    </div>
                                    <div class="muted">
                                        {{ item2.spec_value_str }}
                                    </div>
                                </div>
                            </nuxt-link>
                            <div class="price flex row-center">
                                ¥{{ item2.price }}
                            </div>
                            <div class="num flex row-center">
                                <number-box
                                    :min="1"
                                    v-model="item2.goods_num"
                                    @change="
                                        changeShopCartCount(
                                            $event,
                                            item2.cart_id
                                        )
                                    "
                                    async-change
                                />
                            </div>
                            <div class="money flex row-center">
                                ¥{{ item2.sub_price }}
                            </div>
                            <el-popconfirm
                                title="确定删除该商品吗？"
                                confirm-button-text="确定"
                                cancel-button-text="取消"
                                icon="el-icon-info"
                                icon-color="red"
                                @confirm="goodsDelete(item2.cart_id)"
                            >
                                <div
                                    class="operate flex row-center delete-btn"
                                    slot="reference"
                                >
                                    <img
                                        src="~/static/images/icon_cart_del.png"
                                    />
                                </div>
                            </el-popconfirm>
                        </div>
                    </div>
                </div>
                <div class="cart-footer flex row-between bg-white">
                    <div class="lighter flex">
                        <div class="check-box">
                            <el-checkbox
                                v-model="isSelectedAll"
                                @change="onBoxClick($event, 3, '')"
                                >全选</el-checkbox
                            >
                        </div>
                        <div style="margin: 0 24px"></div>
                        <el-popconfirm
                            title="确定删除选中商品吗？"
                            confirm-button-text="确定"
                            cancel-button-text="取消"
                            icon="el-icon-info"
                            icon-color="red"
                            @confirm="deleteSelectedGoods"
                        >
                            <div
                                class="xs normal"
                                style="cursor: pointer"
                                slot="reference"
                            >
                                删除选中商品
                            </div>
                        </el-popconfirm>
                        <el-popconfirm
                            title="确定清空吗？"
                            confirm-button-text="确定"
                            cancel-button-text="取消"
                            icon="el-icon-info"
                            icon-color="red"
                            @confirm="deleteAlldGoods"
                        >
                            <div
                                class="m-l-14 xs muted"
                                style="cursor: pointer"
                                slot="reference"
                            >
                                清空购物车
                            </div>
                        </el-popconfirm>
                    </div>
                    <div class="total flex">
                        <div class="flex m-r-14">
                            <div class="xs">已选{{ selected }}件商品</div>
                            <div class="primary m-l-20" style="font-size: 22px">
                                ¥{{ totalAmount }}
                            </div>
                        </div>
                        <div
                            class="white lg btn flex row-center"
                            :style="{
                                background:
                                    selected == 0 ? '#A4ADB3' : '#FF2C3C',
                            }"
                            @click="toOrderBuy"
                        >
                            去结算
                        </div>
                    </div>
                </div>
            </div>
            <div class="column-center data-null" v-show="isDataNull">
                <img
                    src="@/static/images/cart_null.png"
                    style="width: 150px; height: 150px"
                />
                <div class="muted xs m-t-10">购物车是空的～</div>
                <div class="m-t-30">
                    <el-button
                        round
                        type="primary"
                        size="medium"
                        @click="toIndex"
                        >去逛逛～</el-button
                    >
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
    head() {
        return {
            title: this.$store.getters.headTitle,
            link: [
                {
                    rel: 'icon',
                    type: 'image/x-icon',
                    href: this.$store.getters.favicon,
                },
            ],
        }
    },
    data() {
        return {
            shopCartList: [],
            totalAmount: 0,
            totalNum: 0,
            isDataNull: false,
        }
    },
    mounted() {},
    computed: {
        // 是否全选
        isSelectedAll: {
            get() {
                if (!this.shopCartList.length) return false
                if (this.allInvalid()) return false
                let index = this.shopCartList.findIndex(
                    (item) => item.is_selected == 0
                )
                return index == -1 ? true : false
            },
            set(val) {
                return val
            },
        },
        // 已经选择的数量
        selected: {
            get() {
                return this.shopCartList.reduce((pre, item) => {
                    return pre.concat(item.cart.filter((i) => i.selected == 1))
                }, []).length
            },
        },
    },
    methods: {
        ...mapActions(['getPublicData']),
        async getCartList() {
            let res = await this.$get('cart/lists')
            if (res.code == 1) {
                this.shopCartList = Object.assign([], res.data.lists)
                this.totalAmount = res.data.total_amount
                this.totalNum = res.data.total_num

                if (this.shopCartList.length > 0) {
                    this.isDataNull = false
                } else {
                    this.isDataNull = true
                }
            }
        },

        // 更改选中状态 type为1选中店铺/2选中商品/3全选
        onBoxClick(e, type, number) {
            let cartId = []
            switch (type) {
                case 1:
                    cartId = this.shopCartList[number].cart.map(
                        (item) => item.cart_id
                    )
                    break
                case 2:
                    cartId.push(number)
                    break
                case 3:
                    cartId = this.shopCartList.reduce((pre, item) => {
                        return pre.concat(item.cart.map((i) => i.cart_id))
                    }, cartId)
                    break
            }
            this.changeSelected(cartId, e == true ? 1 : 0)
        },
        cartInvalid(item) {
            return item.goods_status == 0 || item.goods_del != 0 ? true : false
        },
        shopInvalid(item) {
            return item.cart.every((citem) => this.cartInvalid(citem))
        },
        allInvalid() {
            return this.shopCartList.every((item) => this.shopInvalid(item))
        },

        // 选中/取消选中购物车
        async changeSelected(id, selected) {
            let res = await this.$post('cart/selected', {
                cart_id: id,
                selected: selected,
            })
            if (res.code == 1) {
                this.getCartList()
            }
        },

        // 修改购物车商品数量
        async changeShopCartCount(number, cartId) {
            let res = await this.$post('cart/change', {
                cart_id: cartId,
                goods_num: number,
            })
            if (res.code == 1) {
                this.getCartList()
                this.getPublicData()
            }
        },
        // 删除购物车商品
        async goodsDelete(cartId) {
            let res = await this.$post('cart/del', {
                cart_id: cartId,
            })
            if (res.code == 1) {
                this.getPublicData()
                this.getCartList()
                this.$message({
                    message: '删除商品成功',
                    type: 'success',
                })
            }
        },
        // 删除选中购物车
        deleteSelectedGoods() {
            let selectedGoodsArr = this.shopCartList.reduce((pre, item) => {
                return pre.concat(item.cart.filter((i) => i.selected == 1))
            }, [])
            if (selectedGoodsArr.length <= 0) {
                this.$message({
                    message: '没有选择商品',
                    type: 'error',
                })
                return
            }
            let cartIdArr = selectedGoodsArr.map((item) => item.cart_id)
            this.goodsDelete(cartIdArr)
        },
        // 清空购物车
        deleteAlldGoods() {
            let allGoodsArr = this.shopCartList.reduce((pre, item) => {
                return pre.concat(item.cart.filter((i) => i.cart_id))
            }, [])
            if (allGoodsArr.length <= 0) {
                this.$message({
                    message: '没有商品',
                    type: 'error',
                })
                return
            }
            let cartIdArr = allGoodsArr.map((item) => item.cart_id)
            this.goodsDelete(cartIdArr)
        },
        getSelectCart() {
            const { shopCartList } = this
            return shopCartList.reduce((pre, item) => {
                return pre.concat(
                    item.cart
                        .filter((i) => i.selected && !this.cartInvalid(i))
                        .map((i) => i.cart_id)
                )
            }, [])
        },
        // 去购买商品
        toOrderBuy() {
            let { shopCartList } = this
            let goods = []
            let carts = this.getSelectCart()
            if (carts.length == 0) return this.$message.err('您还没有选择商品哦')
            // 处理出商品数组数据
            shopCartList.forEach((item) => {
                if (item.cart.length != 0) {
                    item.cart.forEach((el, i) => {
                        // 选中的商品才能进入
                        if (el.selected == 1) {
                            goods.push({
                                item_id: el.item_id,
                                num: el.goods_num,
                                goods_id: el.goods_id,
                                shop_id: item.shop.shop_id,
                            })
                        }
                    })
                }
            })
            const params = {
                carts: carts,
                goods: goods,
                type: 'cart',
            }
            this.$router.push({
                path: '/confirm_order',
                query: {
                    data: encodeURIComponent(JSON.stringify(params)),
                },
            })
        },
        toIndex() {
            this.$router.push('/')
        },
    },

    created() {
        this.getCartList()
    },
}
</script>

<style lang="scss" scoped>
.shop-cart {
    padding: 24px 0;
    .cart-list {
        min-height: 600px;
        .cart-hd {
            height: 50px;
            color: #101010;
            padding: 10px 10px;
            margin-bottom: 10px;
        }
        .cart-con {
            padding: 0 10px;
            .shop {
                padding: 20px 10px;
                border-bottom: 1px solid #d7d7d7;
            }
            .item {
                padding: 20px 10px;
                border-bottom: 1px dashed #e5e5e5;
            }
            .item:last-child {
                border-bottom: 0;
            }
        }
        .check-box {
            padding-left: 10px;
            width: 40px;
        }
        .info {
            width: 450px;
            .pictrue {
                margin-right: 10px;
                img {
                    width: 72px;
                    height: 72px;
                }
            }
            .name {
                margin-bottom: 10px;
            }
        }
        .price {
            width: 150px;
        }
        .num {
            width: 250px;
        }
        .money {
            width: 150px;
        }
        .delete-btn {
            cursor: pointer;
        }
    }
    .cart-footer {
        padding: 20px;
        .total {
            .btn {
                width: 152px;
                height: 50px;
                cursor: pointer;
                border-radius: 4px;
            }
        }
    }
    .data-null {
        text-align: center;
        padding-top: 170px;
    }
}
</style>
<template>
    <view class="shop-cart">
        <view class="main " :style="{'padding-bottom':  (cartType == 1 ?  '100rpx' : 0)}">
            <view class="cart-list m-b-20" v-show="cartType==1">
                <view class="cart-item bg-white" v-for="(items, index) in cartLists" :key="index">
                    <view class="flex select">
                        <u-checkbox :disabled="shopInvalid(items)" @change="changeSelect($event, 1, index)"
                            shape="circle" :value="items.is_selected == 1">
                        </u-checkbox>
                        <shop-title :shop="items.shop"></shop-title>
						<view class="xs muted flex-none" v-if="items.shop.is_pay == 0">该店铺未开启支付功能</view>
                    </view>
                    <view>
                        <u-swipe-action :show="openCartId == item.cart_id" btn-width="150" v-for="item in items.cart"
                            :key="item.cart_id" :index="item.cart_id" @click="deleteOneCart($event, item.cart_id)"
                            :options="options" @open="openSwipe">
                            <view class="flex p-20">
                                <u-checkbox :disabled="cartInvalid(item)"
                                    @change="changeSelect($event, 2, item.cart_id)" shape="circle"
                                    :value="item.selected == 1">
                                </u-checkbox>
                                <router-link class="flex-1"
                                    :to="{path: '/pages/goods_details/goods_details', query: {id: item.goods_id}}">
                                    <view class="flex">
                                        <view class="goods-img m-r-20">
                                            <u-image width="180rpx" height="180rpx" border-radius="10rpx"
                                                :src="item.image" />
                                            <view v-if="item.goods_status == 0 || item.goods_del == 1 || !item.stock" class="invalid sm white text-center">已失效
                                            </view>
                                        </view>
                                        <view class="info flex-1">
                                            <view class="line-2 nr">{{item.goods_name}}</view>
                                            <view class="muted line-1 xs m-t-10">
                                                {{item.spec_value_str}}
                                            </view>
                                            <view class="flex row-between m-t-20">
                                                <view class="price flex primary">
                                                    <price-format :price="item.price" :first-size="32" :second-size="32"
                                                        :subscript-size="24" :weight="500">
                                                    </price-format>
                                                </view>
                                                <view class="cartNum" @tap.stop="">
                                                    <u-number-box :disabled="cartInvalid(item)" :value="item.goods_num"
                                                        :min="1" :max="item.stock"
                                                        @change="countChange($event, item.cart_id)" />
                                                </view>
                                            </view>
                                        </view>
                                    </view>
                                </router-link>
                            </view>
                        </u-swipe-action>
                    </view>
                </view>
            </view>
            <view class="cart-null flex-col col-center row-center bg-white m-b-20" style="padding: 80rpx 0 50rpx"
                v-show="cartType == 2">
                <image class="img-null" src="/static/images/cart_null.png"></image>
                <view class="muted m-b-20">购物车暂无任何商品~</view>
                <router-link to="/pages/index/index" navType="pushTab">
                    <view class="primary br60 btn flex row-center">去逛逛</view>
                </router-link>
            </view>
            <view v-if="!isLogin" class="login flex-col col-center row-center">
                <image class="img-null" src="/static/images/cart_null.png"></image>
                <view class="muted mt20">登录后才能查看购物车哦</view>
                <router-link to="/pages/login/login">
                    <view class="white br60 flex row-center btn">
                        <image class="mr10" src="/static/images/icon_wechat.png"></image>
                        <text>去登录</text>
                    </view>
                </router-link>
            </view>
            <goods-column v-if="showMoreGoods" ref="mescrollItem"></goods-column>
        </view>

        <view class="footer flex bg-white" v-show="cartType == 1">
            <u-checkbox :disabled="allInvalid()" @change="changeSelect($event,3)" shape="circle" :value="isSelectedAll">
                全选
            </u-checkbox>
            <view class="primary" @tap="deleteSelectCart">删除</view>
            <view class="all-price flex lg m-r-20 row-right">
                <view>合计：</view>
                <view class="primary">￥{{totalPrice || 0}}</view>
            </view>
            <view class="right-btn br60 white" :style="' ' + (nullSelect ? 'background: #d7d7d7' : '')"
                @tap="goToConfirm">去结算</view>
        </view>
        <u-modal v-model="showDelTips" :show-cancel-button="true" comfirm-text="狠心删除"
            :confirm-color="colorConfig.primary" :show-title="false" @confirm="deleteCart">
            <view class="flex-col col-center tips-dialog" style="padding-top: 40rpx">
                <image class="icon-lg" src="/static/images/icon_warning.png" />
                <view style="margin:30rpx 0;">确认删除选中商品吗？</view>
            </view>
        </u-modal>
		<tabbar></tabbar>
    </view>
</template>

<script>
    import {
        getCartList,
        changeCartSelect,
        changeGoodsCount,
        deleteGoods
    } from '@/api/store';
    import {
        getUser
    } from '@/api/user';
    import {
        mapGetters,
        mapActions
    } from 'vuex'
    import Cache from '@/utils/cache'
    import MescrollCompMixin from "@/components/mescroll-uni/mixins/mescroll-comp";
    export default {
        mixins: [MescrollCompMixin],
        data() {
            return {
                //购物车状态 1为有 2为空 0则什么都不显示
                cartType: 0,
                showMoreGoods: false,
                cartLists: [],
                showDelTips: false,
                totalPrice: '',
                options: [{
                    text: '删除',
                    style: {
                        backgroundColor: '#FF2C3C'
                    }
                }],
                openCartId: 0
            };
        },

        computed: {
            ...mapGetters(['cartNum', 'inviteCode']),
            // 一个都没有选中
            nullSelect() {
                const {
                    cartLists
                } = this
                let nullS = true
                cartLists.forEach((item) => {
                    item.cart.forEach(goods => {
                        if (goods.selected) nullS = false
                    })
                })
                return nullS
            },
            // 判断全选状态
            isSelectedAll() {
                const {
                    cartLists
                } = this
                if (!cartLists.length) return false
                if (this.allInvalid()) return false
                let index = cartLists.findIndex(item => item.is_selected == 0);
                return index == -1 ? true : false
            },

        },
        onLoad() {

        },
        onShow() {
            this.getCartListFun();
        },
        methods: {
            ...mapActions(['getCartNum']),
            // 删除购物车
            deleteCart() {
				// console.log(this.cartId)
				if(!this.cartId) return this.$toast({ title: '请选择商品' })
                this.showDelTips = false
                deleteGoods({
                    cart_id: this.cartId
                }).then(res => {
                    if (res.code == 1) {
                        this.getCartListFun();
                    }
                });
            },
            openSwipe(index) {
                this.openCartId = index
            },
            cartInvalid(item) {
                return item.goods_status == 0 || item.goods_del == 1 || item.is_pay == 0 || item.has_item == 0 ? true : false || item.stock == 0
            },
            shopInvalid(item) {
                return item.cart.every(citem => this.cartInvalid(citem)) 
            },
            allInvalid() {
                return this.cartLists.every(item => this.shopInvalid(item))
            },
            // 删除选中购物车
            deleteSelectCart() {
                this.cartId = this.getSelectCart()
                this.showDelTips = !this.showDelTips;
            },
            // 删除单个购物车
            deleteOneCart(e, cartId) {
                if (cartId) {
                    this.cartId = cartId;
                }
                this.showDelTips = !this.showDelTips;
            },

            async getCartListFun() {
                const {
                    data: {
                        lists,
                        total_amount
                    },
                    code
                } = await getCartList()
                if (code == 1) {
                    let cartType = 0;
                    if (lists.length == 0) {
                        cartType = 2;
                    } else {
                        cartType = 1;
                    }
                    this.showMoreGoods = true
                    this.cartLists = lists;
                    this.cartType = cartType;
                    this.totalPrice = total_amount;
                    this.getCartNum()
                } else {
                    this.cartType = 0
                }
            },
            // 更改选中状态 type为1选中店铺/2选中商品/3全选
            changeSelect({
                value
            }, type, number) {
                let cartId = []
                const {
                    cartLists
                } = this
                switch (type) {
                    case 1:
                        cartId = cartLists[number].cart.map(item => item.cart_id)
                        break;
                    case 2:
                        cartId.push(number)
                        break;
                    case 3:
                        cartId = cartLists.reduce((pre, item) => {
                            return pre.concat(item.cart.map(i => i.cart_id))
                        }, cartId)
                        break;

                }
                this.changeCartSelectFun(cartId, value);
            },

            changeCartSelectFun(cartId, selected) {
                changeCartSelect({
                    cart_id: cartId,
                    selected: selected ? 1 : 0
                }).then(res => {
                    if (res.code == 1) {
                        this.getCartListFun();
                    }
                });
            },
            // 数量改变
            countChange({
                value
            }, cartId) {
                console.log(value)
                let cartid = cartId;
                changeGoodsCount({
                    cart_id: cartid,
                    goods_num: value
                }).then(res => {
                    this.getCartListFun();
                })
            },
            getSelectCart() {
                const {
                    cartLists
                } = this
                return cartLists.reduce((pre, item) => {
                    return pre.concat(item.cart.filter(i => i.selected && !this.cartInvalid(i)).map(i => i
                        .cart_id))
                }, [])
            },
            goToConfirm() {
                let {
                    cartLists
                } = this;
                let goods = [];
                let carts = this.getSelectCart()
                if (carts.length == 0) return this.$toast({
                    title: '您还没有选择商品哦'
                });
                // 处理出商品数组数据
                cartLists.forEach(item => {
                    if (item.cart.length != 0) {
                        item.cart.forEach((el, i) => {
                            // 选中的商品才能进入
                            if(el.selected == 1) {
                                goods.push({
                                    item_id: el.item_id,
                                    num: el.goods_num,
                                    goods_id: el.goods_id,
                                    shop_id: item.shop.shop_id,
                                    delivery_type: 0
                                })
                            }
                        })
                    }
                })
                const params = {
                    carts: carts,
                    goods: goods,
                    type: 'cart'
                };
                this.$Router.push({
                	path: '/pages/confirm_order/confirm_order',
                	query: {
                		data: params
                	}
                })
            },
        },
    };
</script>
<style lang="scss">
    .shop-cart {
        .main {
            padding-bottom: 100rpx;
        }

        .cart-list {
            .cart-item {
                margin: 20rpx 20rpx 0;
                border-radius: 10rpx;

                .goods-img {
                    position: relative;
                    border-radius: 10rpx;
                    overflow: hidden;

                    .invalid {
                        position: absolute;
                        width: 100%;
                        bottom: 0;
                        background-color: rgba(0, 0, 0, 0.4);
                    }
                }

                .info {
                    max-width: 400rpx;
                }
            }

            .select {
                height: 80rpx;
                padding: 0 20rpx;
                border-bottom: $-solid-border;
            }
        }

        .cart-null {
            .btn {
                border: 1px solid $-color-primary;
                width: 184rpx;
                margin-left: auto;
                margin-right: auto;
                padding: 8rpx 24rpx;
            }
        }

        .footer {
            position: fixed;
            padding: 0 24rpx;
            width: 100%;
            height: 100rpx;
            box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.1);
            bottom: calc(var(--window-bottom) + 50px);
			margin-bottom: env(safe-area-inset-bottom);    
            z-index: 20;

            .all-price {
                text-align: right;
                flex: 1;
            }

            .right-btn {
                padding: 13rpx 45rpx;
                background: linear-gradient(90deg, rgba(249, 95, 47, 1) 0%, rgba(255, 44, 60, 1) 100%);
            }
        }

        .login {
            height: calc(100vh - var(--window-bottom));
            background: #fff;
            text-align: center;

            .btn {
                background-color: #09BB07;
                width: 280rpx;
                line-height: 70rpx;
                margin: 40rpx auto 0;

                image {
                    width: 50rpx;
                    height: 50rpx;
                }
            }
        }
    }
</style>

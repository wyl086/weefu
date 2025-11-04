<template>
    <header>
        <div class="header-wrap">
            <div class="header-con xs">
                <div class="wrapper1180 flex row-between">
                    <div class="flex" style="height: 100%">
                        <template
                            v-if="
                                publicData.article && publicData.article.length
                            "
                        >
                            <img
                                style="
                                    width: 16px;
                                    height: 16px;
                                    margin-right: 10px;
                                "
                                src="~/static/images/header_notice.png"
                            />
                            <client-only>
                                <swiper
                                    ref="headerSwiper"
                                    :options="swiperOptions"
                                >
                                    <swiper-slide
                                        class="swiper-item"
                                        v-for="(
                                            item, index
                                        ) in publicData.article"
                                        :key="index"
                                    >
                                        <nuxt-link
                                            class="flex-col row-center"
                                            style="height: 100%"
                                            :to="
                                                '/news_list/news_list_detail?id=' +
                                                item.id
                                            "
                                        >
                                            <div class="line1">
                                                {{ item.title }}
                                            </div>
                                        </nuxt-link>
                                    </swiper-slide>
                                </swiper>
                            </client-only>
                        </template>
                    </div>
                    <div class="user flex flex-none">
                        <div v-if="publicData.name">
                            您好，欢迎来到 {{ publicData.name }}！
                        </div>
                        <ul class="flex flex-none">
                            <li v-if="publicData.nickname">
                                <el-popover placement="bottom" trigger="hover">
                                    <div class="user-nav">
                                        <nuxt-link
                                            class="lighter xs item"
                                            to="/user/user_wallet"
                                            >我的钱包</nuxt-link
                                        >
                                        <nuxt-link
                                            class="lighter xs item"
                                            to="/user/coupons"
                                            >优惠券({{
                                                publicData.coupon_num
                                            }})</nuxt-link
                                        >
                                        <nuxt-link
                                            class="lighter xs item"
                                            to="/user/collection"
                                            >我的收藏</nuxt-link
                                        >
                                        <div
                                            class="lighter xs item"
                                            @click="onLogout"
                                        >
                                            退出登录
                                        </div>
                                    </div>
                                    <nuxt-link
                                        slot="reference"
                                        to="/user/profile"
                                    >
                                        {{ publicData.nickname }}
                                        <i class="el-icon-arrow-down"></i>
                                    </nuxt-link>
                                </el-popover>
                            </li>
                            <li v-else>
                                <nuxt-link to="/account/login">登录</nuxt-link>
                                ｜
                                <nuxt-link to="/account/register"
                                    >注册</nuxt-link
                                >
                            </li>
                            <li>
                                <nuxt-link to="/user/order">我的订单</nuxt-link>
                            </li>
                            <li>
                                <nuxt-link to="/user/profile"
                                    >个人中心</nuxt-link
                                >
                            </li>
                            <li>
                                <nuxt-link to="/help_center"
                                    >帮助中心</nuxt-link
                                >
                            </li>
                            <li>
                                <nuxt-link to="/store_settled"
                                    >商家入驻</nuxt-link
                                >
                            </li>
                            <li
                                id="tel-phone-block"
                                v-if="
                                    publicData.mnp_qr_code ||
                                    publicData.oa_qr_code
                                "
                            >
                                <nuxt-link to="/"
                                    >手机端
                                    <i class="el-icon-arrow-down"></i>
                                </nuxt-link>
                                <div class="float-code flex bg-white">
                                    <div
                                        class="flex-col col-center bg-white"
                                        v-if="publicData.mnp_qr_code"
                                    >
                                        <img
                                            style="width: 100px; height: 100px"
                                            :src="publicData.mnp_qr_code"
                                            alt=""
                                        />
                                        <div class="lighter m-t-10">
                                            官方小程序
                                        </div>
                                    </div>
                                    <div
                                        class="flex-col col-center"
                                        style="margin-left: 30px"
                                        v-if="publicData.oa_qr_code"
                                    >
                                        <img
                                            style="width: 100px; height: 100px"
                                            :src="publicData.oa_qr_code"
                                            alt=""
                                        />
                                        <div class="lighter m-t-10">公众号</div>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <nuxt-link to="/">返回官网</nuxt-link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="header-main bg-white">
                <div class="wrapper1180">
                    <div class="search-wrap flex row-between">
                        <nuxt-link to="/" class="flex row-center">
                            <img
                                :src="config.shop_login_logo"
                                class="logo"
                                alt="logo"
                            />
                        </nuxt-link>
                        <div class="flex">
                            <div class="search flex">
                                <input
                                    type="text"
                                    v-model="name"
                                    placeholder="请输入要搜索的商品名称"
                                    @keyup.enter="toSearch"
                                />
                                <el-button
                                    class="search-btn"
                                    type="primary"
                                    @click="toSearch"
                                >
                                    搜索
                                </el-button>
                            </div>
                            <el-button type="primary" plain class="cart">
                                <nuxt-link to="/shop_cart"
                                    >购物车({{
                                        publicData.cart_num
                                    }})</nuxt-link
                                >
                            </el-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>

<script>
import { directive } from 'vue-awesome-swiper'
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
    directives: {
        swiper: directive,
    },
    data() {
        return {
            name: '',
            swiperOptions: {
                direction: 'vertical',
                // autoHeight: true,
                height: 40,
                initialSlide: 0,
                autoplay: true,
            },
        }
    },

    methods: {
        ...mapMutations(['logout']),
        ...mapActions(['getPublicData']),
        toSearch() {
            if (!this.name) return this.$message.error('请输入商品名称')
            this.$router.push({
                path: '/goods_list',
                query: {
                    name: this.name,
                },
            })
        },
        onLogout() {
            this.logout()
            this.$message({
                message: '退出成功',
                type: 'success',
            })
            setTimeout(() => location.reload(), 1500)
        },
    },
    watch: {
        $route: {
            immediate: true,
            handler: function (val) {
                console.log(val)
                if (val.path == '/goods_list') {
                    this.name = val.query.name
                } else {
                    this.name = ''
                }
            },
        },
    },
    computed: {
        ...mapState(['publicData', 'config']),
    },
}
</script>

<style lang="scss" scoped>
.header-wrap {
    min-width: 1180px;
    position: relative;
    z-index: 1000;
    ::v-deep .swiper-container {
        margin-left: 0;
        margin-right: 0;
        height: 100%;
        width: 400px;
    }
    .swiper-item {
        color: #ccc;
        height: 17px;
    }
    .header-con {
        background-color: #101010;
        height: 40px;
        color: #f2f2f2;
        > div {
            height: 100%;
            color: #cccccc;
            a {
                color: #cccccc;
                &:hover {
                    color: #fff;
                }
            }
            ul {
                li {
                    margin-left: 20px;
                }

                #tel-phone-block {
                    position: relative;
                    &:hover .float-code {
                        display: flex;
                        box-shadow: 0 2px 8px 0 rgb(0 0 0 / 10%);
                    }
                    .float-code {
                        display: none;
                        position: absolute;
                        padding: 22px 16px;
                        background-color: white;
                        top: 24px;
                        right: -20px;
                        &::after {
                            content: '';
                            width: 8px;
                            box-shadow: 0 2px 8px 0 rgb(0 0 0 / 10%);
                            transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
                            right: 35px;
                            top: -4px;
                            height: 8px;
                            background-color: #fff;
                            position: absolute;
                        }
                    }
                }
            }
        }
    }
    .header-main {

        .search-wrap {
            height: 80px;
            .logo {
                height: 48px;
                width: auto;
            }
            .search {
                width: 460px;
                height: 42px;
                overflow: hidden;
                input {
                    flex: 1;
                    height: 100%;
                    border-radius: 4px 0 0 4px;
                    border: 1px solid $--color-primary;
                    border-right-width: 0;
                    padding: 0 10px;
                }
                .search-btn {
                    width: 82px;
                    height: 42px;
                    cursor: pointer;
                    border-radius: 0 4px 4px 0;
                }
            }
            .cart {
                cursor: pointer;
                border-radius: 4px;
                width: 108px;
                height: 42px;
                margin-left: 16px;
            }
        }
    }
   
}
.user-nav {
    .item {
        text-align: center;
        line-height: 34px;
        display: block;
        cursor: pointer;
        &:not(:last-child) {
            border-bottom: 1px solid #e5e5e5;
        }
        &:hover {
            color: $--color-primary;
        }
    }
}
</style>

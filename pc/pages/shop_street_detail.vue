<template>
    <div class="">
        <!-- 顶部 -->
        <div class="bg-white">
            <div
                class="flex flex-1 row-center col-center"
                style="width: 100%; height: 150px"
                v-if="shopInfo.banner"
            >
                <el-image
                    :src="shopInfo.banner"
                    fit="cover"
                    style="height: 100%; width: 100%; max-width: 1920px"
                >
                </el-image>
            </div>
            <div
                class="wrapper1180 flex flex-1 col-center row-between"
                style="height: 40px"
            >
                <div
                    class="h-item flex row-center"
                    :class="xuanIndex == '' ? 'h-item-x' : ''"
                    @click="changeXuan('')"
                >
                    店铺首页
                </div>

                <div class="flex row-left flex-1">
                    <div
                        class="h-item flex row-center"
                        :class="xuanIndex == 'all' ? 'h-item-x' : ''"
                        @click="changeXuan('all')"
                    >
                        全部商品
                    </div>
                    <!-- <div class="" v-for="(item, index) in goodsClassList" :key="index">
                        <div class="h-item flex row-center" :class="xuanIndex == item.id ? 'h-item-x':''"
                            @click="changeXuan(item.id)">
                            {{item.name}}
                        </div>
                    </div> -->
                    <!-- 商品分类 -->
                    <swiper
                        class="swiper flex row-left"
                        ref="mySwiper"
                        :options="swiperOptions"
                        style="
                            width: 672px;
                            display: flex;
                            justify-content: flex-start;
                            margin: 0;
                        "
                    >
                        <swiper-slide
                            class="swiper-item flex row-left"
                            v-for="(itemd, indexd) in goodsClassListGroup"
                            :key="indexd"
                        >
                            <div class="flex">
                                <div
                                    class=""
                                    v-for="(item, index) in itemd"
                                    :key="index"
                                >
                                    <div
                                        class="h-item flex row-center"
                                        :class="
                                            xuanIndex == item.id
                                                ? 'h-item-x'
                                                : ''
                                        "
                                        @click="changeXuan(item.id)"
                                    >
                                        {{ item.name }}
                                    </div>
                                </div>
                            </div>
                        </swiper-slide>
                    </swiper>
                </div>

                <div class="search">
                    <el-input
                        v-model="keyword"
                        placeholder="店铺搜索"
                        @change="search"
                        size="mini"
                    ></el-input>
                </div>
            </div>
        </div>

        <div class="shop-details flex col-top wrapper1180 flex-1">
            <!-- left -->
            <div class="left">
                <!-- 店铺介绍 -->
                <div class="shop bg-white">
                    <div class="shop-logo flex-col col-center">
                        <el-image
                            class="logo-img"
                            :src="shopInfo.logo"
                        ></el-image>
                        <div class="m-t-10">
                            <el-tag size="mini" v-if="shopInfo.type == 1"
                                >自营</el-tag
                            >
                            <span class="weight-500">{{ shopInfo.name }}</span>
                        </div>
                        <div class="xs muted m-t-10 line-5">
                            {{ shopInfo.intro }}
                        </div>
                    </div>
                    <div class="flex m-t-30">
                        <div class="flex-1 text-center">
                            <div class="xxl m-b-10">
                                {{ shopInfo.on_sale_count }}
                            </div>
                            <div>全部商品</div>
                        </div>
                        <div class="flex-1 text-center">
                            <div class="xxl m-b-10">
                                {{ shopInfo.follow_num }}
                            </div>
                            <div>关注人数</div>
                        </div>
                    </div>
                    <el-divider></el-divider>
                    <div class="flex xs m-b-16">
                        <div class="m-r-12">店铺星级</div>
                        <div class="m-t-5">
                            <el-rate v-model="shopInfo.star" disabled>
                            </el-rate>
                        </div>
                    </div>
                    <div class="flex xs m-b-16">
                        <div class="m-r-12">店铺评分</div>
                        <div class="">{{ shopInfo.score }}分</div>
                    </div>
                    <div class="flex row-center row-between">
                        <div class="flex row-center">
                            <el-button size="mini" @click="shopFollow">{{
                                shopInfo.shop_follow_status == 1
                                    ? "已关注"
                                    : "关注店铺"
                            }}</el-button>
                        </div>
                        <el-popover
                            placement="bottom"
                            width="200"
                            trigger="hover"
                        >
                            <div>
                                <el-image
                                    style="width: 100%"
                                    :src="shopInfo.customer_image"
                                ></el-image>
                                <div
                                    class="line-1 m-t-5 text-center"
                                    v-if="shopInfo.customer_phone"
                                >
                                    客服电话:{{ shopInfo.customer_phone }}
                                </div>
                                <div
                                    class="line-1 m-t-5 text-center"
                                    v-if="shopInfo.customer_wechat"
                                >
                                    客服微信号:{{ shopInfo.customer_wechat }}
                                </div>
                            </div>

                            <div
                                slot="reference"
                                class="xs lighter text-center"
                            >
                                <i class="el-icon-chat-dot-round nr"></i>
                                <span>联系客服</span>
                            </div>
                        </el-popover>
                    </div>
                </div>

                <!-- 商品分类 -->
                <div class="m-t-10 bg-white">
                    <div
                        class="l-fen flex row-center"
                        @click="getClassGoods('')"
                        :class="gClassId == '' ? 'l-fen-select' : ''"
                    >
                        全部商品
                    </div>
                    <div
                        class=""
                        v-for="(item, index) in goodsClassList"
                        :key="index"
                        @click="getClassGoods(item.id)"
                    >
                        <div
                            class="l-fen flex row-center"
                            v-show="index < 4"
                            :class="gClassId == item.id ? 'l-fen-select' : ''"
                        >
                            {{ item.name }}
                        </div>
                    </div>
                </div>
            </div>
            <!-- right -->

            <div class="right m-l-15">
                <div class="m-b-10" v-if="shopInfo.ad.pc.length">
                    <client-only>
                        <el-carousel height="440px" autoplay>
                            <el-carousel-item
                                v-for="(item, index) in shopInfo.ad.pc"
                                :key="index"
                                class="swiper-item"
                            >
                                <shopad-item :item="item" />
                            </el-carousel-item>
                        </el-carousel>
                    </client-only>
                </div>
                <!-- 领券 -->
                <div
                    class="bg-white"
                    v-if="couponsList.length && xuanIndex == ''"
                >
                    <div class="coupon-list">
                        <div class="m-b-10 flex row-between">
                            <div class="">领券</div>
                            <div
                                class="flex row-center coupons-more"
                                @click="more = !more"
                                v-if="couponsList.length > 3"
                            >
                                <div class="m-r-5">更多</div>
                                <i
                                    :class="
                                        more
                                            ? 'el-icon-arrow-up'
                                            : 'el-icon-arrow-down'
                                    "
                                ></i>
                            </div>
                        </div>
                        <div
                            class="flex"
                            :class="more ? 'swiper-item-zk' : 'swiper-item-c'"
                        >
                            <div
                                class="item"
                                v-for="(item, index) in couponsList"
                                :key="index"
                            >
                                <div
                                    :class="[
                                        'info white',
                                        {
                                            gray: false,
                                            // item.is_get &&
                                            // !(
                                            //     item.is_get &&
                                            //     item.can_continue_get
                                            // ),
                                        },
                                    ]"
                                >
                                    <div class="info-hd flex">
                                        <div>
                                            <price-formate
                                                :price="item.money"
                                                :first-size="38"
                                                :second-size="38"
                                            />
                                        </div>
                                        <div class="m-l-8 flex1">
                                            <div class="line1">
                                                {{ item.name }}
                                            </div>
                                            <div class="xs line1">
                                                {{ item.condition_type_desc }}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="info-time xs">
                                        {{ item.user_time_desc }}
                                    </div>
                                </div>
                                <div class="flex row-between coupon-button">
                                    <div class="tips-con xs lighter">
                                        {{ item.use_scene_desc }}
                                    </div>
                                    <div
                                        class="primary sm"
                                        @click="hqCoupon(item.id, item)"
                                        v-if="!item.is_get"
                                    >
                                        立即领取
                                    </div>
                                    <div
                                        class="primary sm"
                                        @click="hqCoupon(item.id, item)"
                                        v-if="
                                            item.is_get && item.can_continue_get
                                        "
                                    >
                                        继续领取
                                    </div>
                                    <div
                                        class="primary sm"
                                        v-if="
                                            item.is_get &&
                                            !item.can_continue_get
                                        "
                                    >
                                        去使用
                                    </div>
                                </div>
                                <img
                                    v-if="item.is_get"
                                    class="receice"
                                    src="~/static/images/coupons_img_receive.png"
                                    alt=""
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 店铺推荐 -->
                <div class="shop-list" v-if="recommend && xuanIndex == ''">
                    <div class="m-b-10">店铺推荐</div>
                    <el-carousel
                        arrow="never"
                        indicator-position="outside"
                        trigger="click"
                        height="300px"
                        :autoplay="false"
                    >
                        <el-carousel-item
                            v-for="(itemd, indexd) in recommend"
                            :key="indexd"
                        >
                            <div class="flex">
                                <div
                                    class="shop-item"
                                    v-for="(itemg, indexg) in itemd"
                                    :key="indexg"
                                >
                                    <nuxt-link
                                        :to="`/goods_details/${itemg.id}`"
                                    >
                                        <div class="">
                                            <div class="">
                                                <el-image
                                                    :src="itemg.image"
                                                    style="
                                                        height: 200px;
                                                        width: 200px;
                                                    "
                                                >
                                                </el-image>
                                            </div>
                                            <div class="name m-l-10 line-1">
                                                {{ itemg.name }}
                                            </div>
                                            <div class="m-l-10 flex">
                                                <div class="primary m-r-8">
                                                    <price-formate
                                                        :price="itemg.min_price"
                                                        :first-size="16"
                                                    />
                                                </div>
                                                <div
                                                    class="muted sm line-through"
                                                >
                                                    <price-formate
                                                        :price="
                                                            itemg.market_price
                                                        "
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </nuxt-link>
                                </div>
                            </div>
                        </el-carousel-item>
                    </el-carousel>
                </div>
                <!-- 分类商品 -->
                <div :class="xuanIndex == '' ? 'm-t-10' : ''">
                    <div
                        class="sort m-b-16 flex bg-white col-top"
                        id="goods-sort"
                    >
                        <div class="sort-title">排序方式：</div>
                        <div class="sort-name m-l-16 flex">
                            <div
                                :class="['item', { active: sortType == '' }]"
                                @click="changeSortType('')"
                            >
                                综合
                            </div>
                            <div
                                :class="[
                                    'item',
                                    { active: sortType == 'price' },
                                ]"
                                @click="changeSortType('price')"
                            >
                                价格
                                <i
                                    v-show="priceSort == 'desc'"
                                    class="el-icon-arrow-down"
                                ></i>
                                <i
                                    v-show="priceSort == 'asc'"
                                    class="el-icon-arrow-up"
                                ></i>
                            </div>
                            <div
                                :class="[
                                    'item',
                                    { active: sortType == 'sales_sum' },
                                ]"
                                @click="changeSortType('sales_sum')"
                            >
                                销量
                                <i
                                    v-show="saleSort == 'desc'"
                                    class="el-icon-arrow-down"
                                ></i>
                                <i
                                    v-show="saleSort == 'asc'"
                                    class="el-icon-arrow-up"
                                ></i>
                            </div>
                        </div>
                    </div>
                    <template v-if="goodsList.length">
                        <goods-list :list="goodsList" :num="4" />
                        <div
                            class="pagination flex m-t-30 row-center"
                            style="padding-bottom: 38px"
                            v-if="count"
                        >
                            <el-pagination
                                background
                                layout="prev, pager, next"
                                :total="count"
                                prev-text="上一页"
                                next-text="下一页"
                                hide-on-single-page
                                :page-size="20"
                                @current-change="changePage"
                            >
                            </el-pagination>
                        </div>
                    </template>
                    <null-data
                        v-else
                        :img="require('~/static/images/goods_null.png')"
                        text="暂无商品~"
                    ></null-data>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { trottle } from "~/utils/tools";
import { Message } from "element-ui";
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

    layout: "street",

    components: {},
    async asyncData({ $get, query }) {
        // 店铺信息
        const shopData = await $get("shop/getShopInfo", {
            params: {
                shop_id: query.id,
            },
        });
        if (shopData.code == 1) {
            if (shopData.data.goods_list.length > 0) {
                var num = [];
                for (
                    var i = 0;
                    i < Math.ceil(shopData.data.goods_list.length / 4);
                    i++
                ) {
                    var start = i * 4;
                    var end = start + 4;
                    num.push(shopData.data.goods_list.slice(start, end));
                }
            }
        }
        console.log("num", num);

        // 获取优惠券
        const coupon = await $get("coupon/getCouponList", {
            params: {
                shop_id: query.id,
            },
        });

        // 商品分类
        const goodsClass = await $get(
            "shop_goods_category/getShopGoodsCategory",
            {
                params: {
                    shop_id: query.id,
                },
            }
        );

        if (goodsClass.code == 1) {
            if (goodsClass.data.length > 0) {
                var group = [];
                for (
                    var i = 0;
                    i < Math.ceil(goodsClass.data.length / 6);
                    i++
                ) {
                    var start = i * 6;
                    var end = start + 6;
                    group.push(goodsClass.data.slice(start, end));
                }
            }
        }
        console.log("group", group);

        return {
            recommend: num, // 推荐列表
            shopInfo: shopData.data, // 商家信息
            goodsClassList: goodsClass.data, // 商品分类列表
            goodsClassListGroup: group, // 商品分类切割列表
            couponsList: coupon.data.lists, // 优惠券列表
        };
    },
    data() {
        return {
            goodsClassListGroup: [],
            recommend: [],
            couponsList: [],
            gClassId: "",
            shopInfo: [],
            goodsClassList: [],
            swiperOptions: {
                pagination: {
                    el: ".swiper-pagination",
                    clickable: true,
                },
                navigation: {
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev",
                },
                preventClicks: true,
                slidesPerView: "auto",
                autoplay: true,
            },

            sortType: "",
            saleSort: "desc",
            priceSort: "desc",
            page: 1,
            count: 0,
            goodsList: [],

            more: false,

            keyword: "",
            xuanIndex: "",
        };
    },

    created() {
        this.getGoods();
        this.changeSortType = trottle(this.changeSortType, 500, this);
    },

    methods: {
        // 搜索商品
        search() {
            this.getGoods();

            // 搜索后跳转到商品列表位置
            if (this.xuanIndex == "") {
                setTimeout(() => {
                    document.getElementById("goods-sort").scrollIntoView();
                }, 500);
            }
        },

        // 顶部商品分类选择事件
        changeXuan(id) {
            this.xuanIndex = id;
            if (id == "all") {
                this.gClassId = "";
                this.getGoods();
            } else {
                this.gClassId = id;
                this.getGoods();
            }
        },

        // 店铺信息
        async getShopData() {
            const shopData = await this.$get("shop/getShopInfo", {
                params: {
                    shop_id: this.$route.query.id,
                },
            });

            if (shopData.code == 1) {
                this.shopInfo = shopData.data;
                // 切割推荐列表
                if (shopData.data.goods_list.length > 0) {
                    var num = [];
                    for (
                        var i = 0;
                        i < Math.ceil(shopData.data.goods_list.length / 4);
                        i++
                    ) {
                        var start = i * 4;
                        var end = start + 4;
                        num.push(shopData.data.goods_list.slice(start, end));
                    }
                }

                console.log("num", num);
                this.recommend = num;
            }
        },

        // 关注店铺
        shopFollow() {
            const a = this.$post("shop_follow/changeStatus", {
                shop_id: this.$route.query.id,
            });
            this.getShopData();
        },

        // 领取优惠券
        async hqCoupon(id, item) {
            const { msg, code } = await this.$post("coupon/getCoupon", {
                coupon_id: id,
            });
            item.is_get = 1;
            item.can_continue_get = 0;
            if (code == 1) {
                this.$message({
                    message: msg,
                    type: "success",
                });
            }
            // this.getCouponList();
        },

        // 获取优惠券列表
        async getCouponList() {
            const coupon = await this.$get("coupon/getCouponList", {
                params: {
                    shop_id: this.$route.query.id,
                },
            });
            this.couponsList = coupon.data.lists;
        },

        // 点击商品分类
        getClassGoods(id) {
            this.gClassId = id;

            if (id == "") {
                this.xuanIndex = "all";
            } else {
                this.xuanIndex = id;
            }

            this.getGoods();
        },

        changeSortType(type) {
            this.sortType = type;
            switch (type) {
                case "price":
                    if (this.priceSort == "asc") {
                        this.priceSort = "desc";
                    } else if (this.priceSort == "desc") {
                        this.priceSort = "asc";
                    }
                    break;
                case "sales_sum":
                    if (this.saleSort == "asc") {
                        this.saleSort = "desc";
                    } else if (this.saleSort == "desc") {
                        this.saleSort = "asc";
                    }
                    break;
                default:
            }
            this.getGoods();
        },
        changePage(current) {
            this.page = current;
            this.getGoods();
        },
        async getGoods() {
            const { name } = this.$route.query;
            const { priceSort, sortType, saleSort } = this;
            let sort = "";
            switch (sortType) {
                case "price":
                    sort = priceSort;
                    break;
                case "sales_sum":
                    sort = saleSort;
                    break;
            }
            const {
                data: { list, count },
            } = await this.$get("pc/goodsList", {
                params: {
                    page_size: 20,
                    page_no: this.page,
                    sort_type: sortType,
                    sort,
                    category_id: this.gClassId,
                    shop_id: this.$route.query.id,
                    name: this.keyword,
                },
            });
            this.count = count;
            this.goodsList = list;
        },
    },
};
</script>

<style lang="scss">
.shop {
    width: 227px;
    padding: 15px;

    .logo-img {
        width: 62px;
        height: 62px;
        border-radius: 50%;
        overflow: hidden;
    }

    .el-rate__icon {
        font-size: 16px;
    }
}

.h-item {
    width: 82px;
    height: 24px;
    margin-right: 30px;
    cursor: pointer;
}

.h-item-x {
    border-radius: 100px;
    background-color: #ff2c3c;
    color: #ffffff;
}

.search {
    width: 240px;

    ::v-deep .el-input {
        width: 240px;
        border-radius: 10px;
    }
}

.shop-details {
    margin-top: 10px;

    .left {
        .l-border {
            padding-bottom: 27px;
            border-bottom: 1px solid #eeeeee;
            margin-bottom: 27px;
        }

        .desc {
            color: #101010;
            font-size: 12px;
        }

        .desc-b {
            color: #ffffff;
            font-size: 12px;
        }

        .desc-n {
            color: #ffffff;
            font-size: 18px;
        }

        .desc-n {
            color: #101010;
            font-size: 14px;
        }

        .left-btn {
            width: 82px;
            height: 29px;
            border-radius: 4px;
            border: 1px solid rgba(187, 187, 187, 100);
        }

        .left-shop {
            background-color: #ffffff;
            padding: 20px 15px;
            width: 210px;
            height: 364px;
        }

        .r-color-h {
            background-color: #a4adb3;
            color: #ffffff;
        }

        .l-tips {
            padding: 1px 2px;
        }

        .l-fen {
            width: 210px;
            height: 44px;
            line-height: 20px;
            color: rgba(16, 16, 16, 100);
            font-size: 14px;
            text-align: center;
            cursor: pointer;
        }

        .l-fen-select {
            color: #ff2c3c;
        }
    }

    .right {
        width: 961px;
        .swiper-item {
            width: 961px;
        }
        .coupon-list {
            background-color: #ffffff;
            padding: 20px 0;
            margin: 0 20px;
            border-bottom: 1px solid #eeeeee;

            .coupons-more {
                cursor: pointer;
            }

            .swiper-item-c {
                width: 760px;
                // height: 120px;

                flex-wrap: nowrap;
                overflow: hidden;
            }

            .swiper-item-zk {
                width: 770px;
                flex-wrap: wrap;
            }
        }

        .shop-list {
            background-color: #ffffff;
            height: 360px;
            padding: 0 20px;
            padding-top: 10px;

            .shop-item {
                width: 200px;
                height: 298px;
                background-color: #ffffff;
                margin-right: 12px;

                .name {
                    color: rgba(16, 16, 16, 100);
                    font-size: 14px;
                    text-align: left;
                    margin-bottom: 18px;
                }
            }
        }
    }

    .sort {
        padding: 16px 16px 0;

        .sort-name {
            .item {
                margin-right: 30px;
                cursor: pointer;

                &.active {
                    color: #ff2c3c;
                }
            }
        }
    }

    .swiper {
    }

    .swiper-item {
        width: 672px;
        // box-sizing: content-box;
    }

    .item {
        margin-bottom: 20px;
        margin-right: 16px;
        position: relative;
        cursor: pointer;

        .coupon-button {
            background-color: #f2f2f2;
            width: 240px;
            height: 30px;
            padding: 0 8px;
        }

        .info {
            padding: 0 10px;
            background: url("~/static/images/bg_coupon_s.png") no-repeat;
            width: 240px;
            height: 80px;
            background-size: 100%;

            &.gray {
                background-image: url("~/static/images/bg_coupon.png");
            }

            .info-hd {
                overflow: hidden;
            }
        }

        .tips {
            position: relative;
            background-color: #f2f2f2;
            height: 30px;
            padding: 0 8px;

            .tips-con {
                width: 100%;
                left: 0;
                background-color: #f2f2f2;
                position: absolute;
                top: 30px;
                padding: 10px;
                z-index: 99;
            }
        }

        .receice {
            position: absolute;
            top: 0;
            right: 0px;
            width: 58px;
            height: 45px;
        }

        .choose {
            position: absolute;
            top: 0;
            right: 0;
            background-color: #ffe72c;
            color: $--color-primary;
            padding: 1px 5px;
        }
    }

    .more {
        position: absolute;
        bottom: 20px;
        cursor: pointer;
        right: 30px;
    }
}
</style>

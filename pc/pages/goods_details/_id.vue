<template>
    <div class="goods-details" v-if="goodsDetails.id">
        <div class="goods-info flex col-stretch">
            <div class="goods-swiper bg-white flex-col">
                <el-image
                    class="current-img"
                    :preview-src-list="goodsImage.map((item) => item.uri)"
                    :src="goodsImage[swiperIndex].uri"
                ></el-image>
                <client-only>
                    <swiper
                        class="swiper"
                        ref="mySwiper"
                        :options="swiperOptions"
                    >
                        <swiper-slide
                            :class="{
                                'swiper-item': true,
                                active: index === swiperIndex,
                            }"
                            v-for="(item, index) in goodsImage"
                            :key="index"
                        >
                            <div
                                style="width: 100%; height: 100%"
                                @mouseover="swiperIndex = index"
                            >
                                <el-image
                                    style="width: 100%; height: 100%"
                                    :src="item.uri"
                                ></el-image>
                            </div>
                        </swiper-slide>
                        <div
                            class="swiper-button-prev"
                            slot="button-prev"
                        ></div>
                        <div
                            class="swiper-button-next"
                            slot="button-next"
                        ></div>
                    </swiper>
                </client-only>
            </div>

            <!-- 右侧商品信息 -->
            <div class="info-wrap bg-white flex-1">
                <div class="name weight-500 m-b-16">
                    {{ goodsDetails.name }}
                </div>
                <!--  -->
                <div class="seckill flex white" v-if="activity.type == 1">
                    <div class="xxl">限时秒杀</div>
                    <div class="flex">
                        <div class="white m-r-16">距离结束还有</div>
                        <count-down
                            :time="countTime"
                            :is-slot="true"
                            @change="onChangeDate"
                        >
                            <div class="flex row-center count-down xxl">
                                <div class="item white">
                                    {{ timeData.hours }}
                                </div>
                                <div class="white" style="margin: 0 4px">:</div>
                                <div class="item white">
                                    {{ timeData.minutes }}
                                </div>
                                <div class="white" style="margin: 0 4px">:</div>
                                <div class="item white">
                                    {{ timeData.seconds }}
                                </div>
                            </div>
                        </count-down>
                    </div>
                </div>
                <!--  -->
                <!--  -->
                <div class="price-wrap lighter">
                    <div class="flex row-between">
                        <div class="price">
                            <div
                                class="flex"
                                v-if="
                                    Number(
                                        checkedGoods.market_price ||
                                            goodsDetails.market_price
                                    )
                                "
                            >
                                {{ activity.type == 1 ? "日常价" : "原价" }}
                                <span class="m-l-20">
                                    <price-formate
                                        :price="
                                            checkedGoods.market_price ||
                                            goodsDetails.market_price
                                        "
                                        :weight="400"
                                    />
                                </span>
                            </div>
                            <div class="flex m-t-10">
                                {{ activity.type == 1 ? "秒杀价" : "价格" }}
                                <div class="primary m-l-20">
                                    <price-formate
                                        :price="
                                            checkedGoods.price ||
                                            goodsDetails.min_price
                                        "
                                        :subscript-size="16"
                                        :first-size="26"
                                        :second-size="16"
                                    />
                                </div>
                                <div
                                    class="member-price m-l-10 flex xs"
                                    v-if="
                                        activity.type != 1 &&
                                        (checkedGoods.member_price ||
                                            goodsDetails.member_price)
                                    "
                                >
                                    会员价
                                    <price-formate
                                        :price="
                                            checkedGoods.member_price ||
                                            goodsDetails.member_price
                                        "
                                        :weight="400"
                                    />
                                </div>
                            </div>
                        </div>

                        <div class="rate flex-col row-right">
                            <div class="primary" style="font-size: 20px">
                                {{ comment.percent }}
                            </div>
                            <div class="lighter">好评率</div>
                        </div>
                    </div>
                </div>
                <!--  -->

                <div class="sales-click muted sm">
                    <span class="m-6">
                        销量：{{ goodsDetails.sales_sum }}件
                    </span>
                    ｜
                    <span class="m-6">
                        浏览量：{{ goodsDetails.clicks }}次
                    </span>
                </div>

                <div class="spec-wrap">
                    <div
                        class="spec flex m-b-16"
                        v-for="(item, index) in goodsSpec"
                        :key="index"
                    >
                        <div class="lighter spec-name">{{ item.name }}</div>
                        <div class="spec-list flex flex-wrap">
                            <div
                                :class="[
                                    'spec-item lighter',
                                    { active: specitem.checked },
                                ]"
                                v-for="(specitem, sindex) in item.spec_value"
                                :key="sindex"
                                @click="onChoseSpecItem(item.id, specitem.id)"
                            >
                                {{ specitem.value }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="goods-num flex">
                    <div class="num lighter">数量</div>
                    <number-box
                        v-model="goodsNum"
                        :min="1"
                        :max="checkedGoods.stock"
                    />
                    <div class="m-l-10" v-if="goodsDetails.is_show_stock">
                        库存: {{ checkedGoods.stock }}
                    </div>
                </div>
                <div class="goods-btns flex lg">
                    <el-button
                        type="primary"
                        class="btn white"
                        @click="onBuyNow"
                    >
                        立即购买
                    </el-button>
                    <el-button
                        type="primary"
                        plain
                        class="btn addcart"
                        @click="onAddCart"
                        v-if="goodsDetails.type == 0 && activity.type != 1"
                    >
                        加入购物车
                    </el-button>
                    <div
                        class="btn collection flex row-center"
                        @click="onCollectionGoods"
                    >
                        <img
                            class="start-icon m-r-8"
                            :src="
                                goodsDetails.is_collect
                                    ? require('~/static/images/icon_star_s.png')
                                    : require('~/static/images/icon_star.png')
                            "
                        />
                        <span>{{
                            goodsDetails.is_collect ? "取消收藏" : "收藏商品"
                        }}</span>
                    </div>
                </div>
            </div>
            <div class="shop m-l-16 bg-white">
                <div class="shop-logo flex-col col-center">
                    <el-image class="logo-img" :src="shop.logo"></el-image>
                    <nuxt-link
                        class="m-t-10"
                        :to="`/shop_street_detail?id=${shop.id}`"
                    >
                        <el-tag size="mini" v-if="shop.type == 1">自营</el-tag>
                        <span class="weight-500">{{ shop.name }}</span>
                    </nuxt-link>
                    <div class="xs muted m-t-10 line-5">
                        {{ shop.intro }}
                    </div>
                </div>
                <div class="flex m-t-20">
                    <div class="flex-1 text-center">
                        <div class="xxl m-b-10">{{ shop.goods_on_sale }}</div>
                        <div class="xs">全部商品</div>
                    </div>
                    <div class="flex-1 text-center">
                        <div class="xxl m-b-10">{{ shop.follow_num }}</div>
                        <div class="xs">关注人数</div>
                    </div>
                </div>
                <el-divider></el-divider>
                <div class="flex xs m-b-16">
                    <div class="m-r-12">店铺星级</div>
                    <div class="m-t-5">
                        <el-rate v-model="shop.star" disabled> </el-rate>
                    </div>
                </div>
                <div class="flex xs m-b-16">
                    <div class="m-r-12">店铺评分</div>
                    <div class="">{{ shop.score }}分</div>
                </div>
                <div>
                    <el-button
                        type="primary"
                        size="mini"
                        @click="
                            $router.push(`/shop_street_detail?id=${shop.id}`)
                        "
                        >进入店铺</el-button
                    >
                    <el-button size="mini" @click="changeShopFollow">{{
                        shop.shop_follow_status == 1 ? "已关注" : "关注店铺"
                    }}</el-button>
                </div>
                <div class="flex m-t-30">
                    <el-popover placement="top" width="200" trigger="hover">
                        <div>
                            <el-image
                                style="width: 100%"
                                :src="shop.customer_image"
                            ></el-image>
                        </div>

                        <div
                            slot="reference"
                            class="xs lighter text-center cursor-pointer m-r-24"
                        >
                            <i class="el-icon-chat-dot-round nr"></i>
                            <span>联系客服</span>
                        </div>
                    </el-popover>
                    <el-popover placement="top" trigger="hover">
                        <div>
                            <vue-qr
                                style="width: 100px; height: 100px"
                                class="bicode"
                                :logoScale="20"
                                :margin="0"
                                :dotScale="1"
                                :text="shopLink"
                            ></vue-qr>
                        </div>

                        <div
                            slot="reference"
                            class="xs lighter cursor-pointer text-center"
                        >
                            <i class="el-icon-mobile-phone nr"></i>
                            <span>访问店铺</span>
                        </div>
                    </el-popover>
                </div>
            </div>
        </div>
        <div class="details-wrap flex m-t-16">
            <div class="goods-like" v-if="shop.goods_list.length">
                <div class="title bg-white flex p-l-15">店铺推荐</div>
                <div class="goods-list">
                    <template v-for="(item, index) in shop.goods_list">
                        <nuxt-link
                            :to="`/goods_details/${item.id}`"
                            class="item bg-white"
                            v-if="index < 5"
                            :key="index"
                        >
                            <el-image
                                class="goods-img"
                                :src="item.image"
                            ></el-image>
                            <div class="goods-name line-2">
                                {{ item.name }}
                            </div>
                            <div class="price flex m-t-8">
                                <div class="primary m-r-8">
                                    <price-formate
                                        :price="item.min_price"
                                        :first-size="16"
                                    />
                                </div>
                                <div class="muted sm line-through">
                                    <price-formate :price="item.market_price" />
                                </div>
                            </div>
                        </nuxt-link>
                    </template>
                </div>
            </div>
            <div class="details bg-white flex-1">
                <el-tabs v-model="active">
                    <el-tab-pane label="商品详情">
                        <div
                            class="rich-text"
                            v-html="goodsDetails.content"
                        ></div>
                    </el-tab-pane>
                    <el-tab-pane label="商品评价">
                        <div class="evaluation">
                            <div class="evaluation-hd flex">
                                <div class="rate flex">
                                    <div class="lighter m-r-8">好评率</div>
                                    <div
                                        class="primary"
                                        style="font-size: 30px"
                                    >
                                        {{ goodsDetails.comment.percent }}
                                    </div>
                                </div>
                                <div class="score flex">
                                    <span class="m-r-8 lighter">评分</span>
                                    <el-rate
                                        :value="
                                            goodsDetails.comment.goods_comment
                                        "
                                        disabled
                                        allow-half
                                    ></el-rate>
                                </div>
                            </div>
                            <div class="evaluation-tab flex">
                                <div
                                    :class="[
                                        'item',
                                        { active: commentActive == item.id },
                                    ]"
                                    v-for="(item, index) in comment.comment"
                                    :key="index"
                                    @click="commentActive = item.id"
                                >
                                    {{ item.name }}({{ item.count }})
                                </div>
                            </div>
                        </div>
                        <div>
                            <template v-for="(item, index) in comment.comment">
                                <comment-list
                                    v-if="commentActive == item.id"
                                    :goods-id="id"
                                    :type="item.id"
                                    :key="index"
                                ></comment-list>
                            </template>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
            <div class="mobile-code">
                <div class="bg-white p-b-16">
                    <div class="title flex row-center">手机端访问</div>

                    <div class="flex-col col-center m-t-20">
                        <vue-qr
                            style="width: 100px; height: 100px"
                            class="bicode"
                            :logoScale="20"
                            :margin="0"
                            :dotScale="1"
                            :text="mobileLink"
                        ></vue-qr>
                        <div class="lighter m-t-10">公众号H5</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { Message } from "element-ui";
import VueQr from "vue-qr";
export default {
    components: {
        VueQr,
    },
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
    async asyncData({ params, $get, app }) {
        const { data, code, msg } = await $get("goods/getGoodsDetail", {
            params: { goods_id: params.id },
        });
        if (code == 0) {
            setTimeout(() => app.router.back(), 1500);
        }
        return {
            goodsDetails: data,
            goodsImage: data.goods_image,
            activity: data.activity,
            shop: data.shop,
        };
    },

    data() {
        return {
            goodsDetails: {},
            goodsImage: [],
            activity: {},
            shop: {
                goods_list: [],
            },
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
            },
            active: "0",
            commentActive: 0,
            swiperIndex: 0,
            checkedGoods: {},
            comment: {},
            goodsNum: 1,
            goodsSpec: [],
            id: "",
            timeData: {},
        };
    },
    created() {
        this.id = this.$route.params.id;
        this.getComment(this.id);
    },
    methods: {
        ...mapActions(["getPublicData"]),
        onClickSlide(e) {
            this.swiperIndex = e;
        },
        onChoseSpecItem(id, specid) {
            const { goodsSpec } = this;
            goodsSpec.forEach((item) => {
                if (item.spec_value && item.id == id) {
                    item.spec_value.forEach((specitem) => {
                        specitem.checked = 0;
                        if (specitem.id == specid) {
                            specitem.checked = 1;
                        }
                    });
                }
            });
            this.goodsSpec = [...goodsSpec];
        },
        async onAddCart() {
            const {
                goodsNum,
                checkedGoods: { id },
            } = this;
            const { code, data, msg } = await this.$post("cart/add", {
                item_id: id,
                goods_num: goodsNum,
            });
            if (code == 1) {
                this.getPublicData();
                this.$message({
                    message: msg,
                    type: "success",
                });
            }
        },
        async changeShopFollow() {
            const { code, msg } = await this.$post("shop_follow/changeStatus", {
                shop_id: this.shop.id,
            });
            if (code == 1) {
                this.$message({
                    message: msg,
                    type: "success",
                });
                this.getGoodsDetail();
            }
        },
        onBuyNow() {
            const {
                goodsNum,
                checkedGoods: { id },
            } = this;
            const goods = [
                {
                    item_id: id,
                    num: goodsNum,
                    goods_id: this.id,
                    shop_id: this.shop.id,
                },
            ];
            this.$router.push({
                path: "/confirm_order",
                query: {
                    data: encodeURIComponent(
                        JSON.stringify({
                            goods,
                            type: "buy",
                        })
                    ),
                },
            });
        },
        async getGoodsDetail() {
            const { data, code } = await this.$get("goods/getGoodsDetail", {
                params: { goods_id: this.id },
            });
            if (code == 1) {
                this.goodsDetails = data;
                this.shop = data.shop;
            }
        },
        async onCollectionGoods() {
            const { data, code, msg } = await this.$post(
                "goods_collect/changeStatus",
                {
                    goods_id: this.id,
                }
            );
            if (code == 1) {
                this.$message({
                    message: msg,
                    type: "success",
                });
                this.getGoodsDetail();
            }
        },
        async getComment() {
            const { data, code } = await this.$get("/goods_comment/category", {
                params: { goods_id: this.id },
            });
            if (code == 1) {
                this.comment = data;
                this.commentActive = data.comment[0].id;
            }
        },
        onChangeDate(e) {
            let timeData = {};
            for (let prop in e) {
                if (prop !== "milliseconds")
                    timeData[prop] = ("0" + e[prop]).slice(-2);
            }
            this.timeData = timeData;
        },
    },
    watch: {
        goodsSpec: {
            immediate: true,
            handler(value) {
                const { goods_item } = this.goodsDetails;
                let keyArr = [];
                value.forEach((item) => {
                    if (item.spec_value) {
                        item.spec_value.forEach((specitem) => {
                            if (specitem.checked) {
                                keyArr.push(specitem.id);
                            }
                        });
                    }
                });
                if (!keyArr.length) return;
                let key = keyArr.join(",");
                let index = goods_item.findIndex((item) => {
                    return item.spec_value_ids == key;
                });
                if (index == -1) {
                    index = 0;
                }
                this.checkedGoods = goods_item[index];
                console.log(this.checkedGoods);
            },
        },
        goodsDetails: {
            immediate: true,
            handler(value) {
                if (!value.goods_spec) return;
                value.goods_spec.forEach((item) => {
                    item.spec_value.forEach((specitem, specindex) => {
                        if (specindex == 0) {
                            specitem.checked = 1;
                        } else {
                            specitem.checked = 0;
                        }
                    });
                });
                this.goodsSpec = [...value.goods_spec];
            },
        },
    },
    computed: {
        countTime() {
            const end_time = this.activity.end_time;
            return end_time ? end_time - Date.now() / 1000 : 0;
        },
        ...mapState(["config"]),
        mobileLink() {
            return `${this.config?.base_domain}mobile/pages/goods_details/goods_details?id=${this.id}`;
        },
        shopLink() {
            return `${this.config?.base_domain}mobile/pages/store_index/store_index?id=${this.shop.id}`;
        },
    },
};
</script>

<style lang="scss">
.goods-details {
    padding: 16px 0 44px;

    .goods-info {
        .goods-swiper {
            width: 400px;
            border-radius: 4px;

            .swiper {
                margin: 10px 0;
                padding: 0 25px;
                --swiper-navigation-size: 15px;
                --swiper-navigation-color: #888;

                .swiper-button-next,
                .swiper-button-prev {
                    top: 0;
                    width: 25px;
                    height: 100%;
                    margin-top: 0;
                    background-size: 12px 22px;
                }

                .swiper-button-prev {
                    left: 0;
                }

                .swiper-button-next {
                    right: 0;
                }

                .swiper-item {
                    cursor: pointer;
                    height: 66px;
                    width: 66px;
                    border: 2px solid transparent;

                    & ~ .swiper-item {
                        margin-left: 10px;
                    }

                    &.active {
                        border-color: $--color-primary;
                    }
                }
            }

            .current-img {
                width: 100%;
                height: 400px;
                padding: 15px;
            }
        }

        .info-wrap {
            min-height: 486px;
            min-width: 504px;
            border-radius: 4px;
            padding: 20px;

            .name {
                font-size: 20px;
            }

            .seckill {
                background-color: $--color-primary;
                padding: 6px 10px;

                .count-down {
                    .item {
                        width: 30px;
                        height: 30px;
                        background: rgba(0, 0, 0, 0.3);
                        text-align: center;
                        line-height: 30px;
                        border-radius: 4px;
                    }
                }
            }

            .price-wrap {
                background: #f6f6f6;
                background-size: 100%;
                padding: 16px 16px;

                .member-price {
                    background-color: #482406;
                    color: #fdebd5;
                    border-radius: 100px 100px 100px 0px;
                    padding: 0 6px;
                }
            }

            .sales-click {
                border-bottom: 1px dashed $--border-color-base;
                line-height: 28px;
                padding: 6px;

                & > div:first-of-type {
                    border-right: 1px solid $--border-color-base;
                }
            }

            .spec-wrap {
                margin-top: 20px;

                .spec {
                    align-items: flex-start;

                    .spec-name {
                        margin-right: 20px;
                        margin-top: 6px;
                        flex: none;
                    }

                    .spec-item {
                        padding: 0 20px;
                        line-height: 32px;
                        border: $--border-base;
                        border-radius: 2px;
                        margin-right: 10px;
                        margin-bottom: 10px;
                        cursor: pointer;

                        &.active {
                            color: $--color-primary;
                            background-color: #ffeeef;
                            border-color: currentColor;
                        }
                    }
                }
            }

            .goods-num {
                margin-bottom: 30px;

                .num {
                    margin-right: 20px;
                }
            }

            .goods-btns {
                .btn {
                    margin-right: 14px;
                    text-align: center;
                    width: 120px;
                    font-size: 16px;

                    &.collection {
                        width: 146px;
                        line-height: 42px;
                        border: 1px solid rgba(229, 229, 229, 0.89804);
                        background-color: #fff;
                        border-radius: 4px;
                        cursor: pointer;
                        color: #666;

                        &:hover {
                            color: $--color-primary;
                        }

                        .start-icon {
                            width: 18.5px;
                            height: 18px;
                        }
                    }
                }
            }
        }

        .shop {
            width: 210px;
            padding: 16px;

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
    }

    .details-wrap {
        align-items: stretch;

        .details {
            padding: 10px 0;
            overflow: hidden;

            .rich-text {
                padding: 0 10px;
                width: 100%;
                overflow: hidden;

                img {
                    width: 100%;
                    display: block;
                }

                p {
                    margin: 0;
                }
            }

            .evaluation {
                .evaluation-hd {
                    height: 80px;
                    margin: 0 10px;

                    .rate {
                        height: 60px;
                        width: 220px;
                        border-right: 1px solid #e5e5e5;
                        padding-left: 10px;
                        margin-right: 40px;
                    }
                }

                .evaluation-tab {
                    margin: 16px 20px;

                    .item {
                        border-radius: 2px;
                        cursor: pointer;
                        height: 32px;
                        padding: 6px 20px;
                        color: #666;
                        background-color: #f2f2f2;
                        margin-right: 10px;

                        &.active {
                            color: #fff;
                            background-color: $--color-primary;
                        }
                    }
                }
            }
        }
    }
    .mobile-code {
        width: 210px;
        margin-left: 16px;
        .title {
            border-bottom: $--border-base;
            height: 55px;
        }
    }
    .goods-like {
        width: 210px;
        border-right: $--border-base;
        .title {
            border-bottom: $--border-base;
            height: 55px;
        }

        .goods-list {
            .item {
                padding: 10px;
                display: block;
                .goods-img {
                    width: 190px;
                    height: 190px;
                    margin-bottom: 10px;
                }
            }
        }
    }
}
</style>

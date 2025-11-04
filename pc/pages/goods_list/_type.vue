<template>
    <div class="goods-list">
        <div class="banner m-t-16">
            <!-- <ad-item :item="ad" v-if="ad.image"></ad-item> -->
            <client-only>
                <swiper ref="mySwiper" :options="swiperOptions">
                    <swiper-slide
                        class="swiper-item"
                        v-for="(item, index) in ad"
                        :key="index"
                    >
                        <ad-item :item="item"></ad-item>
                    </swiper-slide>
                </swiper>
            </client-only>
        </div>
        <div class="sort m-b-16 flex bg-white">
            <div class="sort-title">排序方式：</div>
            <div class="sort-name m-l-16 flex">
                <div
                    :class="['item', { active: sortType == 'create_time' }]"
                    @click="changeSortType('create_time')"
                >
                    综合
                </div>
                <div
                    :class="['item', { active: sortType == 'price' }]"
                    @click="changeSortType('price')"
                >
                    价格
                    <i
                        v-show="priceSort == 'desc'"
                        class="el-icon-arrow-down"
                    ></i>
                    <i v-show="priceSort == 'asc'" class="el-icon-arrow-up"></i>
                </div>
                <div
                    :class="['item', { active: sortType == 'sales_sum' }]"
                    @click="changeSortType('sales_sum')"
                >
                    销量
                    <i
                        v-show="saleSort == 'desc'"
                        class="el-icon-arrow-down"
                    ></i>
                    <i v-show="saleSort == 'asc'" class="el-icon-arrow-up"></i>
                </div>
            </div>
        </div>
        <template v-if="goodsList.length">
            <goods-list :list="goodsList" />
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
</template>

<script>
import { trottle } from "~/utils/tools";
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
    async asyncData({ $get, params, query }) {
        const { type } = params;
        let pid = 0;
        let ad = [];
        switch (type) {
            case "1":
                pid = 25;
                break;
            case "2":
                pid = 26;
                break;
        }
        const { data } = await $get("ad_content/lists", {
            params: {
                pid: pid,
                terminal: 2,
            },
        });

        if (!data.length) return;
        ad = data;
        return { ad };
    },
    components: {},
    data() {
        return {
            sortType: "create_time",
            swiperOptions: {
                width: 1180,
            },
            saleSort: "desc",
            priceSort: "desc",
            page: "",
            count: 0,
            ad: "",
            goodsList: [],
        };
    },
    created() {
        this.getGoods();
        this.changeSortType = trottle(this.changeSortType, 500, this);
    },
    methods: {
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
                case "create_time":
                    this.saleSort = "desc";

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
                case "create_time":
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
                    name,
                },
            });
            this.count = count;
            this.goodsList = list;
        },
    },
    watch: {
        "$route.query.name"() {
            this.getGoods();
        },
    },
};
</script>

<style lang="scss">
.goods-list {
    .banner {
        img {
            width: 100%;
            display: block;
        }
    }
    .sort {
        padding: 15px 16px;
        .sort-name {
            .item {
                margin-right: 30px;
                cursor: pointer;
                &.active {
                    color: $--color-primary;
                }
            }
        }
    }
}
</style>

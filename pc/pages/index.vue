<template>
    <div class="index">
        <!-- 广告位 -->
        <div class="banner">
            <client-only>
                <el-carousel height="440px" autoplay>
                    <el-carousel-item
                        v-for="(item, index) in bannerList"
                        :key="index"
                        class="swiper-item"
                    >
                        <ad-item :item="item" />
                    </el-carousel-item>
                </el-carousel>
            </client-only>
        </div>
        <!-- 活动专区 -->
        <div
            class="activity-area flex flex-wrap"
            v-if="indexData.activity_area && indexData.activity_area.length"
        >
            <nuxt-link
                class="activity-item flex"
                v-for="(item, index) in indexData.activity_area"
                :key="index"
                :to="`/special_area?id=${item.id}&name=${item.name}&title=${item.title}`"
            >
                <div class="flex-1 m-r-16" style="min-width: 0">
                    <div class="xxl m-b-10 line-1">{{ item.name }}</div>
                    <div class="m-b-6 line-2">{{ item.title }}</div>

                    <el-button size="mini">前往查看</el-button>
                </div>
                <el-image
                    class="activity-img"
                    lazy
                    :src="item.image"
                    alt=""
                ></el-image>
            </nuxt-link>
        </div>
        <home-seckill :list="indexData.seckill_goods" @refreshhome="getIndex" />
        <div class="active-goods flex">
            <activity-area
                class="flex-1 m-r-16"
                :list="indexData.hots"
                title="热销榜单"
                url="/goods_list/1"
            />
            <activity-area
                class="flex-1"
                :list="indexData.news"
                title="新品推荐"
                url="/goods_list/2"
            />
        </div>
        <div
            class="shop-recommend card m-t-16"
            v-if="indexData.shop_lists.length"
        >
            <div class="title flex row-between">
                <div class="font-size-20">店铺推荐</div>
            </div>

            <div class="shop-list m-t-16">
                <client-only>
                    <swiper
                        class="swiper"
                        ref="mySwiper"
                        :options="swiperOptions"
                    >
                        <swiper-slide
                            class="swiper-item"
                            v-for="(item, index) in indexData.shop_lists"
                            :key="index"
                        >
                            <shop-item
                                :cover="item.cover"
                                :shopId="item.id"
                                :logo="item.logo"
                                :type="item.type"
                                :name="item.name"
                                :sales="item.on_sales_count"
                            />
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
        </div>
        <div class="goods-column bg-white" v-if="columnList.length">
            <div class="column-wrap flex">
                <div
                    class="item flex-col col-center muted flex-none"
                    v-for="(item, index) in columnList"
                    :key="index"
                    @click="changeTab(index)"
                >
                    <div class="item-con flex-col col-center">
                        <div
                            class="xxl normal title line-1"
                            :class="{ 'weight-500': active == index }"
                        >
                            {{ item.name }}
                        </div>
                        <div
                            class="m-t-8 xs line-1"
                            :class="{ normal: active == index }"
                        >
                            {{ item.remark }}
                        </div>

                        <div v-if="active == index" class="line"></div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="hasData" class="m-t-16">
            <goods-list :list="goodsList" />
            <div
                class="pagination flex m-t-30 row-center"
                style="padding-bottom: 38px"
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
        </div>
        <null-data
            v-else
            :img="require('~/static/images/goods_null.png')"
            text="暂无商品~"
        ></null-data>

        <!-- 服务协议 -->
        <server-explan></server-explan>
    </div>
</template>

<script>
import HomeSeckill from '../components/home-seckill.vue'
import ServerExplan from '../components/server-explan.vue'
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
    components: { HomeSeckill, ServerExplan },
    async asyncData({ $get }) {
        const { data } = await $get('index/index',{params: {terminal:'pc'}})
        const { data: banner } = await $get('ad_content/lists', {
            params: { pid: 23, terminal: 2 },
        })
        const { data: columnList } = await $get(
            'goods_column/getGoodsColumnList'
        )

        return {
            indexData: data,
            columnList,
            bannerList: banner,
        }
    },
    data() {
        return {
            page: 1,
            count: 0,
            goodsList: [],
            active: 0,
            bannerList: [],
            columnList: [],
            hasData: true,
            indexData: {
                activity_area: [],
                shop_recommend: [],
                hots: [],
                news: [],
                shop_lists: [],
            },
            swiperOptions: {
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                // loopedSlides: 5,
                preventClicks: true,
                slidesPerView: 'auto',
                autoplay: false
            },
        }
    },
    watch: {
        columnList: {
            immediate: true,
            handler() {
                this.getGoodsLists()
            },
        },
    },
    methods: {
        async getGoodsLists() {
            const { columnList, active, page } = this
            if (!columnList.length) return
            const columnId = columnList[active].id
            const { data } = await this.$get('goods/getGoodsListByColumnId', {
                params: {
                    page_size: 10,
                    page_no: page,
                    column_id: columnId,
                },
            })
            if (!data.lists.length) {
                this.hasData = false
            } else {
                this.hasData = true
            }
            this.goodsList = data.lists
        },
        changePage(page) {
            this.page = page
            this.getGoodsLists()
        },
        changeTab(index) {
            this.active = index
            this.getGoodsLists()
        },
        async getIndex() {
            const { data } = await $get('index/index',{
                params: {
                    terminal: 'pc'
                }
            })
            this.indexData = data
        },
    },
}
</script>

<style lang="scss">
.index {
    .banner {
        margin-left: 160px;
        margin-bottom: 16px;
        height: 440px;
    }
    .activity-area {
        .activity-item {
            border-radius: 6px;
            padding: 28px 16px;
            background-color: #fff;
            width: 280px;
            margin-bottom: 20px;
            &:not(:nth-of-type(4n)) {
                margin-right: 20px;
            }
            .activity-img {
                width: 104px;
                height: 104px;
            }
        }
    }
    .card {
        padding: 16px;
        border-radius: 6px;
        background-color: #fff;
    }
    .shop-recommend {
        padding: 16px 20px;
    }
    .shop-list {
        .swiper {
            --swiper-navigation-size: 18px;
            --swiper-navigation-color: #fff;
            .swiper-button-next,
            .swiper-button-prev {
                width: 40px;
                height: 40px;
                background-color: rgba(0, 0, 0, 0.3);
                border-radius: 50%;
            }
        }
        .swiper-item {
            width: 270px;
            height: 400px;
            padding-right: 20px;
            box-sizing: content-box;
            &:last-of-type {
                padding-right: 0;
            }
        }
    }
    .goods-column {
        overflow-y: auto;
        .column-wrap {
            height: 100px;
            .item {
                padding: 0 25px;
                cursor: pointer;
                overflow: hidden;
                .item-con {
                    position: relative;
                    .title {
                        position: relative;
                        z-index: 1;
                    }
                    .line {
                        position: absolute;
                        top: 16px;
                        left: 0;
                        width: 100%;
                        height: 6px;
                        background: linear-gradient(
                            90deg,
                            #{$--color-primary} 0%,
                            rgba(255, 44, 60, 0) 100%
                        );
                        border-radius: 60px;
                    }
                }
            }
        }
        margin-top: 16px;
    }
}
</style>

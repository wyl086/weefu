<template>
    <div class="activity-area m-t-16" v-if="list.length">
        <div class="title flex row-between">
            <div class="font-size-20">{{ title }}</div>
            <nuxt-link :to="url" class="more lighter"
                >更多 <i class="el-icon-arrow-right"></i
            ></nuxt-link>
        </div>
        <div class="activity-goods m-t-16">
            <client-only>
                <swiper ref="headerSwiper" :options="swiperOptions">
                    <swiper-slide
                        class="swiper-item"
                        v-for="(item, index) in swiperSize"
                        :key="index"
                    >
                        <div class="goods-list flex row-between">
                            <nuxt-link
                                class="goods-item"
                                :to="`/goods_details/${gitem.id}`"
                                v-for="(gitem, gindex) in getSwiperList(index)"
                                :key="gindex"
                            >
                                <div class="goods-img">
                                    <el-image
                                        lazy
                                        :src="gitem.image"
                                        fit="cover"
                                        alt=""
                                    ></el-image>
                                </div>
                                <div class="name line-2 m-t-10">{{ gitem.name }}</div>
                                    <div class="price flex col-baseline m-t-10">
                                        <div class="primary m-r-8">
                                            <price-formate
                                                :price="gitem.min_price"
                                                :first-size="16"
                                            />
                                        </div>
                                        <div class="muted sm line-through ">
                                            <price-formate
                                                :price="gitem.market_price"
                                            />
                                        </div>
                                    </div>
                                    <div class="muted xs m-t-10">
                                        {{ gitem.sales_total }}人购买
                                    </div>
                            </nuxt-link>
                        </div>
                    </swiper-slide>
                </swiper>
            </client-only>
        </div>
    </div>
</template>

<script>
export default {
    components: {},
    props: {
        url: {
            type: String,
            default: '',
        },
        title: {
            type: String,
        },
        list: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            swiperOptions: {
                direction: 'vertical',
                initialSlide: 0,
                height: 280,
                autoplay: true,
            },
            pageSize: 3,
        }
    },
    computed: {
        swiperSize() {
            return Math.ceil(this.list.length / this.pageSize)
        },
        getSwiperList() {
            return (index) => {
                return this.list.slice(
                    index * this.pageSize,
                    (index + 1) * this.pageSize
                )
            }
        },
    },
}
</script>

<style lang="scss" scoped>
.activity-area {
    padding: 16px;
    border-radius: 6px;
    background-color: #fff;
    ::v-deep .swiper-container {
        width: 100%;
        height: 280px;
    }
    .goods-list {
        .goods-item {
            width: 31.5%;
            .goods-img {
                width: 100%;
                height: 0;
                padding-top: 100%;
                position: relative;
                .el-image {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    left: 0;
                    top: 0;
                }
            }
            .name {
                line-height: 20px;
                height: 40px;
            }
        }
    }
}
</style>
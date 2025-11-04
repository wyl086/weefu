<template>
    <div class="seckill card" v-if="goodsList.length">
        <div class="seckill-header flex">
            <div class="title font-size-20">限时秒杀</div>
            <div class="flex-1 flex">
                <i
                    class="
                        el-icon-alarm-clock
                        primary
                        font-size-24
                        m-l-20 m-r-10
                    "
                ></i>
                <count-down
                    :time="countTime"
                    :is-slot="true"
                    @change="onChangeDate"
                    @finish="refresh"
                >
                    <div class="flex row-center count-down xs">
                        <div class="item white">{{ timeData.hours }}时</div>
                        <div class="white" style="margin: 0 4px">:</div>
                        <div class="item white">{{ timeData.minutes }}分</div>
                        <div class="white" style="margin: 0 4px">:</div>
                        <div class="item white">{{ timeData.seconds }}秒</div>
                    </div>
                </count-down>
            </div>
           
            <nuxt-link to="/seckill" class="more lighter"
                >更多 <i class="el-icon-arrow-right"></i
            ></nuxt-link>
        </div>
        <div class="seckill-list m-t-16">
            <el-carousel :interval="3000" arrow="never" height="320px" indicator-position="outside">
                <el-carousel-item
                    v-for="(item, index) in swiperSize"
                    :key="index"
                >
                    <div class="goods-list flex">
                        <nuxt-link
                            class="goods-item"
                            :to="`/goods_details/${gitem.goods_id}`"
                            v-for="(gitem, gindex) in getSwiperList(index)"
                            :key="gindex"
                        >
                            <div class="goods-img">
                                <el-image
                                    :src="gitem.goods_image"
                                    fit="cover"
                                    alt=""
                                ></el-image>
                            </div>
                            <div class="name line-2 m-t-10">
                                {{ gitem.goods_name }}
                            </div>
                            <div class="price flex col-baseline">
                                <div class="primary m-r-8">
                                    <price-formate
                                        :price="gitem.seckill_price"
                                        :first-size="16"
                                    />
                                </div>
                                <div class="muted sm line-through">
                                    <price-formate
                                        :price="gitem.seckill_total"
                                    />
                                </div>
                            </div>
                            <div class="muted xs m-t-10">
                                {{ gitem.seckill_total }}人购买
                            </div>
                        </nuxt-link>
                    </div>
                </el-carousel-item>
            </el-carousel>
        </div>
    </div>
</template>

<script>
export default {
    components: {},
    props: {
        list: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            active: -1,
            goodsList: [],
            countTime: 0,
            timeData: {},
            pageSize: 5,
        }
    },
    methods: {
        refresh() {
            this.$emit('refreshhome')
        },
        onChangeDate(e) {
            let timeData = {}
            for (let prop in e) {
                if (prop !== 'milliseconds')
                    timeData[prop] = ('0' + e[prop]).slice(-2)
            }
            this.timeData = timeData
        },
    },
    watch: {
        list: {
            handler(val) {
                // 抢购中
                if(!val.length) {
                    return
                }
                let index = val.findIndex((item) => item.status == 1)
                if (index == -1) {
                    // 未开始
                    index = val.findIndex((item) => item.status == 0)
                }
                if (index == -1) {
                    // 全部结束选中最后一个
                    index = val.length - 1
                }
                this.active = index
                this.goodsList = val[index].goods
                this.countTime = val[index].end_time_int - Date.now() / 1000
            },
            immediate: true,
        },
    },
    computed: {
        swiperSize() {
            console.log(Math.ceil(this.goodsList.length / this.pageSize))
            return Math.ceil(this.goodsList.length / this.pageSize)
        },
        getSwiperList() {
            return (index) => {
                return this.goodsList.slice(
                    index * this.pageSize,
                    (index + 1) * this.pageSize
                )
            }
        },
    },
}
</script>

<style lang="scss" scoped>
.seckill {
    .seckill-header {
        .count-down {
            .item {
                width: 38px;
                height: 20px;
                background: $--color-primary;
                text-align: center;
                line-height: 20px;
                border-radius: 4px;
            }
        }
    }
    ::v-deep .el-carousel__indicator {
        & .el-carousel__button {
            background-color: #E5E5E5;
        }
        &.is-active .el-carousel__button{
            background-color: $--color-primary;
        }
    }
    .goods-list {
        .goods-item {
            width: 216px;
            & ~ .goods-item  {
                margin-left: 16px;
            }
            .goods-img {
                width: 100%;
                height: 0;
                padding-top: 100%;
                position: relative;
                ::v-deep .el-image {
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
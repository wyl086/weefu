<!-- 专区内页 -->
<template>
    <div class="special-area">
        <div class="header-top">
            <el-breadcrumb style="flex: 1;" separator="/">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item class="line1" style="max-width: 800px;">{{ name }}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="m-b-20 header-img">
            <!-- <el-image :src="require('@/static/images/special_area_bg.jpg')" style="height: 240px; width: 1180px;"></el-image> -->
            <div class="header-img-tile flex-col col-center row-center">
                <div class="max-title white">
                    {{ name }}
                </div>
                <div class="m-t-22 min-title white">
                    {{ title }}
                </div>
            </div>
        </div>
        <template v-if="goodsList.length">
            <goods-list :list="goodsList" />
            <div class="pagination flex m-t-30 row-center" style="padding-bottom: 38px" v-if="count">
                <el-pagination background layout="prev, pager, next" :total="count" prev-text="上一页" next-text="下一页"
                    hide-on-single-page :page-size="20" @current-change="changePage">
                </el-pagination>
            </div>
        </template>
        <null-data v-else :img="require('~/static/images/goods_null.png')" text="暂无商品~"></null-data>
    </div>
</template>

<script>
    export default {
        head() {
            return {
                title: this.$store.getters.headTitle,
                link: [{
                    rel: 'icon',
                    type: 'image/x-icon',
                    href: this.$store.getters.favicon,
                }, ],
            }
        },

        async asyncData({ query }) {

            return {
               name: query.name,
               title: query.title,
            }
        },

        data() {
            return {
                goodsList: [],
                page: 1,
                count: 0,
            }
        },

        methods: {
            // 获取商品
            async getGoods() {
                const id = this.$route.query.id
                let {
                    code,
                    data: {
                        list,
                        count
                    }
                } = await this.$get("activity_area/activityGoodsList", {
                    params: {
                        id: id,
                        page_no: this.page,
                        page_size: 20,
                    },
                })

                if (code == 1) {
                    this.goodsList = list
                    this.count = count
                }
            },

            changePage(current) {
                this.page = current;
                this.getGoods();
            },
        },

        created() {
            this.getGoods()
        },

    }
</script>

<style lang="scss" scoped>
    .special-area {
        .header-top {
            margin: 16px 0;
        }

        .header-img {
            width: 1180px;
            height: 240px;
            background: url(../static/images/special_area_bg.jpg);

            .header-img-tile {

                .max-title {
                    margin-top: 65px;
                    font-size: 32px;
                    text-align: center;
                }

                .min-title {
                    padding: 5px 27px;
                    font-size: 14px;
                    text-align: center;
                    border-radius: 100px;
                    background-color: rgba(186, 122, 246);
                }
            }
        }
    }
</style>

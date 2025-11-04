<template>
    <div class="help-center-container">
        <div class="help-center-banner">
            <client-only>
                <swiper ref="mySwiper" :options="swiperOptions">
                    <swiper-slide class="swiper-item" v-for="(item, index) in bannerList" :key="index">
                        <ad-item :item="item"></ad-item>
                    </swiper-slide>
                </swiper>
            </client-only>
        </div>
        <div class="help-center-box">
            <div class="help-center-aside bg-white">
                <ul class="nav flex-col col-center">
                    <li class="flex" :class="{'active-item': currentId <= 0}" @click="changeList(0)">全部</li>
                    <li class="flex" v-for="(item) in categoryList" :key="item.id"
                        :class="{'active-item': item.id == currentId}" @click="changeList(item.id)">{{item.name}}</li>
                </ul>
            </div>
            <div class="article-lists-container m-l-16 bg-white">
                <div v-show="!dataNull">
                    <div>
                        <nuxt-link :to="'/help_center/help_center_detail?id=' + item.id"
                            class="article-item flex row-between bg-white" v-for="(item) in articleList" :key="item.id">
                            <div>
                                <div class="lg article-name line2">{{item.title}}</div>
                                <div class="lighter">{{item.intro}}</div>
                                <div class="flex" style="margin-top: 56px;">
                                    <div class="sm muted">发布时间：{{item.create_time}}</div>
                                    <div class="flex m-l-16">
                                        <i class="el-icon-view muted"></i>
                                        <div class="muted" style="margin-left: 3px;">{{item.visit}} 人浏览</div>
                                    </div>
                                </div>
                            </div>
                            <el-image style="width: 200px; height: 150px;border-radius: 6px;" fit="cover"
                                :src="item.image" />
                        </nuxt-link>
                    </div>
                    <div class="help-center-pagination row-center">
                        <el-pagination background hide-on-single-page layout="prev, pager, next" :total="count"
                            prev-text="上一页" next-text="下一页" :page-size="10" @current-change="changePage" />
                    </div>
                </div>
                <div class="data-null column-center" v-show="dataNull">
                    <img style="width: 150px;height: 150px;" src="~/static/images/news_null.png" />
                    <div class="xs muted">
                        暂无消息记录～
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        head() {
            return {
                title: this.$store.getters.headTitle,
                link: [{
                    rel: "icon",
                    type: "image/x-icon",
                    href: this.$store.getters.favicon
                }],
            };
        },
        async asyncData({
            $get,
            $post
        }) {
            let categoryList = [];
            let currentId = 0;
            let articleList = [];
            let count = 0;
            let dataNull = true;
            const banner = $get("ad_content/lists", {
                params: {
                    pid: 29,
                    terminal: 2
                }
            });
            let res = await $get("help/category");
            const {
                data: bannerList
            } = await banner;
            if (res.code == 1) {
                categoryList = res.data;
                currentId = 0
                let listsRes = await $get("help/lists", {
                    params: {
                        cid: currentId,
                        page_size: 10
                    }
                });
                if (listsRes.code == 1) {
                    articleList = listsRes.data.list;
                    count = listsRes.data.count
                    if (count <= 0) {
                        dataNull = true;
                    } else {
                        dataNull = false
                    }
                }
            }
            return {
                categoryList,
                articleList,
                count,
                currentId,
                bannerList,
                dataNull,
            }
        },
        data() {
            return {
                categoryList: [],
                articleList: [],
                currentId: -1,
                count: 0,
                swiperOptions: {
                    width: 1180,
                }
            }
        },
        mounted() {
            console.log(this.articleList, 'articleList')
        },
        methods: {
            async changePage(current) {
                let res = await this.$get("help/lists", {
                    params: {
                        cid: this.currentId,
                        page_no: current,
                        page_size: 10
                    }
                });
                if (res.code == 1) {
                    this.articleList = res.data.list;
                    if (this.articleList.length <= 0) {
                        dataNull = true;
                    } else {
                        dataNull = false
                    }
                }
            },
            changeList(id) {
                this.currentId = id;
                this.changePage(1)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .help-center-container {
        .help-center-banner {
            margin-top: 16px;
        }

        .help-center-box {
            margin-top: 16px;
            display: flex;
            flex-direction: row;

            .help-center-aside {
                width: 160px;
                // min-height: 635px;
                padding-top: 20px;
                padding-bottom: 20px;
                padding: 20px 30px;

                .nav {
                    li {
                        margin: 10px 0px;
                        padding: 0px 30px;
                        cursor: pointer;
                    }

                    .active-item {
                        padding-left: 27px;
                        color: $--color-primary;
                        border-left: 3px solid $--color-primary;
                    }
                }
            }

            .article-lists-container {
                width: 1004px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;

                .article-item {
                    margin: 0px 20px;
                    padding: 15px 0px;
                    border-bottom: 1px solid #E5E5E5;
                    cursor: pointer;

                    .article-name {
                        margin-bottom: 11px;
                        margin-top: 13px;
                        max-width: 720px;
                    }
                }

                .help-center-pagination {
                    padding-top: 38px;
                    margin-bottom: 30px;
                }

                .data-null {
                    padding-top: 150px;
                }
            }
        }
    }

    ::v-deep .el-pagination.is-background .btn-prev {
        background: #fff;
        padding: 0 10px;
    }

    ::v-deep .el-pagination.is-background .btn-next {
        background: #fff;
        padding: 0 10px;
    }

    ::v-deep .el-pagination.is-background .el-pager li {
        background: #fff;
        padding: 0 10px;
    }
</style>

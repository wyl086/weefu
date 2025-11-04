<template>
    <div class="user-evaluate">
        <el-tabs v-model="type" @tab-click="handleClick">
            <el-tab-pane v-for="(item, index) in evaluate" :key="index" :label="item.name" :name="item.type">
                <template v-if="item.lists.length">
                    <evaluation-list :list="item.lists" :type="item.type" :userInfo="userInfo"/>
                    <div class="pagination flex row-center" v-if="item.count">
                        <el-pagination hide-on-single-page background layout="prev, pager, next" :total="item.count"
                            prev-text="上一页" next-text="下一页" :page-size="10" @current-change="changePage">
                        </el-pagination>
                    </div>
                </template>
                <null-data v-else :img="require('~/static/images/news_null.png')" text="暂无评价~"></null-data>
            </el-tab-pane>
        </el-tabs>
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
                    href: this.$store.getters.favicon,
                }, ],
            };
        },
        layout: "user",

        watchQuery: true,
        async asyncData({
            $get,
            query
        }) {
            const type = query.type || "1";
            let {
                data: {
                    lists,
                    count
                }
            } = await $get("goods_comment/getUnCommentOrder", { // 未评价列表
                params: {
                    page_size: 10
                },
            });

            let {
                data: userInfo
            } = await $get("user/info"); // 用户信息

            return {
                commentList: {
                    lists,
                    count
                },
                type,
                userInfo,
            };
        },
        components: {},
        data() {
            return {
                evaluate: [{
                        type: "1",
                        lists: [],
                        name: "待评价",
                        count: 0,
                        page: 1,
                    },
                    {
                        type: "2",
                        lists: [],
                        name: "已评价",
                        count: 0,
                        page: 1,
                    },
                ],
            };
        },
        methods: {
            handleClick() {
                this.getEvaluateList();
            },
            async getEvaluateList() {
                const {
                    type,
                    evaluate
                } = this;
                const item = evaluate.find((item) => item.type == type);
                const {
                    data: {
                        lists,
                        count
                    },
                    code,
                } = type == 1 ? await this.$get("goods_comment/getUnCommentOrder", { // 未评价列表
                    params: {
                        page_size: 10,
                        page_no: item.page,
                    },
                }) : await this.$get("goods_comment/getCommentOrder", { // 已评价列表
                    params: {
                        page_size: 10,
                        page_no: item.page,
                    },
                });

                if (code == 1) {
                    this.commentList = {
                        lists,
                        count
                    };
                }
            },
            changePage(val) {
                this.evaluate.some((item) => {
                    if (item.type == this.type) {
                        item.page = val;
                    }
                });
                this.getEvaluateList();
            },
        },
        watch: {
            commentList: {
                immediate: true,
                handler(val) {
                    this.evaluate.some((item) => {
                        if (item.type == this.type) {
                            Object.assign(item, val);
                            console.log(item);
                            return true;
                        }
                    });
                },
            },
        }
    };
</script>

<style lang="scss" scoped>
    .user-evaluate {
        width: 1000px;
        padding: 20px 0;
    }
</style>

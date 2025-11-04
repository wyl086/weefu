<template>
    <div class="user-collection-container">
        <div class="user-collection-content">
            <el-tabs v-model="activeName" class="mt10" @tab-click="handleClick">
                <el-tab-pane v-for="(item, index) in userCollection" :label="item.name" :name="item.type+''"
                    :key="index">
                    <div v-if="index == activeName">

                        <template v-if="userCollection[activeName].lists.length">
                            <!-- 商品收藏 -->
                            <template v-if="activeName == 0">
                                <div @click.stop="$router.push({
                                                path: '/goods_details/'+item2.id
                                            })" class="goods"
                                    v-for="(item2, index2) in item.lists" :key="index2">
                                    <div class="goods-image">
                                        <el-image style="width: 180px; height: 180px" :src="item2.image" fit="fit">
                                        </el-image>
                                        <div class="goods-image-wrap flex">
                                            <div @click.stop="cancelColl(item2.id)">取消收藏</div>
                                            <div @click.stop="$router.push({
                                                path: '/shop_street_detail',
                                                query: {
                                                    id: item2.shop_id
                                                }
                                            })">进入店铺</div>
                                        </div>
                                    </div>
                                    <div class="goods-name m-t-10">
                                        <div class="line-2">{{item2.name}}</div>
                                    </div>
                                    <div class="m-t-14">
                                        <span class="primary xl">¥{{item2.min_price}}</span>
                                    </div>
                                </div>
                            </template>

                            <!-- 店铺收藏 -->
                            <template v-if="activeName == 1">
                                <div class="shop flex" style="width:100%" v-for="(item2, index2) in item.lists" :key="index2">
                                    <!-- 店铺 -->
                                    <div class="shop-item flex-col row-right" :style="{
                                    'background-image': `url(${item2.cover})`,
                                }">
                                        <div class="shop-wrap xs flex">
                                            <div @click.stop="cancelColl(item2.id)">取消收藏</div>
                                            <div @click.stop="$router.push({
                                                path: '/shop_street_detail',
                                                query: {
                                                    id: item2.shop_id
                                                }
                                            })">进入店铺</div> 
                                        </div>
                                        <div class="bg-white shop-info text-center">
                                            <el-image class="logo" :src="item2.logo"></el-image>
                                            <div class="m-t-12 line-1 lg">
                                                {{ item2.name }}
                                            </div>
                                        </div>
                                    </div>

                                    <!-- 店铺下的商品 -->
                                    <div style="width: 100%" class="flex-1 m-l-20" v-if="item2.goods_list.length >= 1">
                                        <div class="shop-title flex row-between">
                                            <span>店铺推荐</span>
                                            <div class="pointer" @click.stop="$router.push({
                                                path: '/shop_street_detail',
                                                query: {
                                                    id: item2.shop_id
                                                }
                                            })">
                                                进入店铺<i class="el-icon-arrow-right"></i>
                                            </div>
                                        </div>

                                        <div class="m-t-20 flex">
                                            <div class="m-r-16" @click.stop="$router.push({
                                                path: '/goods_details/'+item3.id
                                            })" v-for="(item3, index3) in item2.goods_list" :key="index3">
                                                <el-image style="width: 150px; height: 150px" :src="item3.image"
                                                    fit="fit">
                                                </el-image>
                                                <div class="primary flex row-center m-t-10">
                                                    ¥{{item3.min_price}}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </template>

                        <template v-else>
                            <null-data :img="require('~/static/images/profit_null.png')" text="暂无收藏~"></null-data>
                        </template>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
        <!-- <null-data
      style="padding: 150px"
      img-style="width: 94px;height:118px"
      :img="require('~/assets/images/img_null.png')"
      text="请前往移动端进行查看"
    ></null-data> -->
    </div>
</template>

<script>
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
    layout: "user",
    data() {
        return {
            activeName: 0,
            recodeList: {},
            userCollection: [
                {
                    type: 0,
                    lists: [],
                    name: "商品",
                    count: 0,
                    page: 1,
                },
                {
                    type: 1,
                    lists: [],
                    name: "店铺",
                    count: 0,
                    page: 1,
                },
            ],
        };
    },
    fetch() {
        this.handleClick();
    },
    mounted() {
        this.getRecodeList();
    },
    methods: {
        handleClick() {
            this.getRecodeList();
        },

        changePage(val) {
            this.userCollection.some((item) => {
                if (item.type == this.activeName) {
                    item.page = val;
                }
            });
            this.getRecodeList();
        },

        async getRecodeList() {
            const { activeName, userCollection } = this;
            const item = userCollection.find((item) => item.type == activeName);
            const {
                data: { lists, count },
                code,
            } =
                activeName == 0
                    ? await this.$get("goods_collect/lists", {
                          params: {
                              page_size: 10,
                              page_no: item.page,
                          },
                      })
                    : await this.$get("pc/shopFollowList", {
                          params: {
                              page_size: 10,
                              page_no: item.page,
                          },
                      });
            if (code == 1) {
                this.recodeList = { lists, count };
            }
        },

        async cancelColl(id) {
            const { code, msg } =
                this.activeName == 0
                    ? await this.$post("goods_collect/changeStatus", {
                          goods_id: id,
                      })
                    : await this.$post("shop_follow/changeStatus", {
                          shop_id: id,
                      });

            if (code == 1) {
                this.$message.success("取消成功");
            }
            this.getRecodeList();
        },
    },
    watch: {
        recodeList: {
            immediate: true,
            handler(val) {
                console.log("val:", val);
                this.userCollection.some((item) => {
                    if (item.type == this.activeName) {
                        Object.assign(item, val);
                        return true;
                    }
                });
            },
        },
    },
};
</script>

<style lang="scss" scoped>
.user-collection-container {
    width: 980px;
    padding: 10px 10px 60px 10px;

    ::v-deep .el-tabs__header {
        margin-left: 10px;
    }

    ::v-deep .el-tabs .el-tabs__nav-scroll {
        padding: 0;
    }

    .user-collection-content {
        // margin-top: 17px;
        .goods {
            width: 180px;
            height: 260px;
            margin-right: 15px;
            margin-bottom: 30px;
            float: left;
            &-image {
                width: 180px;
                height: 180px;
                cursor: pointer;
                position: relative;
            }
            &-image:hover .goods-image-wrap {
                opacity: 1;
            }
            &-image-wrap {
                left: 0;
                bottom: 0;
                width: 180px;
                height: 26px;
                padding: 8px 0;
                color: #fff;
                text-align: center;
                position: absolute;
                opacity: 0;
                transition: opacity 0.2s linear;
                background-color: rgba(0, 0, 0, 0.2);
                > div {
                    width: 90px;
                    cursor: pointer;
                }
                > div:first-child {
                    border-right: 1px solid #fff;
                }
            }
        }
        .goods:nth-child(5n) {
            margin-right: 0;
        }
        .goods-name {
            height: 36px;
            color: #101010;
        }

        .shop {
            padding: 20px 0;
            border-bottom: 1px solid #e5e5e5;

            .shop-item:hover .shop-wrap {
                opacity: 1;
            }
            .shop-item {
                width: 148px;
                height: 220px;
                background-size: cover;
                background-position: center;
                padding: 10px;
                border-radius: 6px;
                position: relative;
                .shop-wrap {
                    top: 0;
                    left: 0;
                    position: absolute;
                    width: 148px;
                    height: 26px;
                    padding: 8px 0;
                    color: #fff;
                    opacity: 0;
                    text-align: center;
                    transition: opacity 0.2s linear;
                    background-color: rgba(0, 0, 0, 0.2);
                    > div {
                        width: 74px;
                        cursor: pointer;
                    }
                    > div:first-child {
                        border-right: 1px solid #fff;
                    }
                }
                .shop-info {
                    border-radius: 6px;
                    padding: 18px 15px;

                    .logo {
                        width: 70px;
                        height: 70px;
                        border-radius: 50%;
                        margin-top: -45px;
                    }
                }
            }
        }
        .shop:last-child {
            border-bottom: 0;
        }
    }
}
</style>
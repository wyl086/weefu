<template>
    <div class="evaluation-list">
        <div class="list1" v-if="type == 1">
            <div class="item flex" v-for="(item, index) in list" :key="index">
                <div class="goods">
                    <!-- 店铺信息 -->
                    <div class="flex shop-info">
                        <div class="flex" style="margin-right: 100px;">

                            <div class="m-r-8" style="width: 16px; height: 16px;">
                                <el-image :src="item.shop.logo" style="height: 100%; width: 100%" fit="contain">
                                </el-image>
                            </div>
                            <div class="xs">
                                {{item.shop.name}}
                            </div>
                        </div>
                        <div class="xs muted" style="margin-right: 100px;">
                            下单时间：{{item.create_time}}
                        </div>
                        <div class="xs muted">
                            订单编号：{{item.order_sn}}
                        </div>
                    </div>
                    <div class="goods-all">
                        <div class="goods-item flex" v-for="(zitem, zindex) in item.order_goods_un_comment">
                            <nuxt-link :to="`/goods_details/${zitem.goods_id}`">
                                <el-image class="goods-img" :src="zitem.goods_item.image" alt="" />
                            </nuxt-link>
                            <div class="goods-info flex-col flex-1">
                                <div class="goods-name  flex row-between" style="align-items: flex-start;">
                                    <div class="line1" style="width: 600px">
                                        {{ zitem.goods_name }}
                                    </div>
                                    <div class="operate flex row-end">
                                        <nuxt-link :to="`/user/evaluation/evaluate?id=${zitem.id}`"
                                            class="btn sm flex row-center white">去评价</nuxt-link>
                                    </div>
                                </div>
                                <div class="sm lighter m-b-8">{{zitem.goods_item.spec_value_str}}</div>
                                <!-- 价格 -->
                                <div class="primary">
                                    <price-formate :price="zitem.goods_price" />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
        <div class="list2 flex-col" v-if="type == 2">
            <div class="item flex" v-for="(item, index) in list" :key="index">
                <div class="user">
                    <el-image :src="userInfo.avatar" style="height: 44px; width: 44px; border-radius: 50%;"></el-image>
                </div>
                <div class="">
                    <div class="user_name m-b-5" style="font-size: 14px; color: #101010;">
                        {{ userInfo.nickname }}
                    </div>
                    <div class="muted sm">评价时间：{{ item.create_time }}</div>
                    <!-- 用户评价 -->
                    <div class="m-t-10">
                        {{ item.comment }}
                    </div>
                    <!-- 用户展示商品图片 -->
                    <div class="comment-imglist flex">
                        <div class="item" v-for="(img, index) in item.goods_comment_image_arr" :key="index">
                            <el-image :preview-src-list="item.goods_comment_image_arr" :src="img"
                                style="height: 100%; width: 100%" fit="contain">
                            </el-image>
                        </div>
                    </div>
                    <!-- 商家回复 -->
                    <div class="flex reply mt16" v-if="item.reply">
                        <div class="primary">商家回复：</div>
                        <div class="lighter">
                            {{ item.reply }}
                        </div>
                    </div>


                    <!-- 商品信息 -->
                    <nuxt-link :to="`/goods_details/${item.goods.id}`">
                        <div class="goods flex m-t-16">
                            <el-image class="goods-img" :src="item.goods.image" alt="" />
                            <div class="goods-info m-l-10">
                                <div class="flex m-b-8">
                                    <div class="flex" style="width: 451px;">
                                        <div class="xs line-1 m-r-5">{{item.goods.name}}</div>
                                        <div class="xs">{{item.goods_item.spec_value_str}}</div>
                                    </div>

                                    <div class="flex">
                                        <el-image :src="item.shop_logo" style="height: 16px; width: 16px" fit="contain">
                                        </el-image>
                                        <div class="m-l-5 xs">
                                            {{item.shop_name}}
                                        </div>
                                    </div>
                                </div>

                                <div class="m-t-8 primary">
                                    <price-formate :price="item.order_goods.total_pay_price" />
                                </div>
                            </div>
                        </div>
                    </nuxt-link>



                </div>

            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            list: {
                type: Array,
                default: () => [],
            },
            type: {
                type: String,
            },

            userInfo: {
                type: Object,
                default: () => {},
            }
        },
        data() {
            return {
                lists: [{
                    image: "fdasf",
                    goods_name: "hsdfsafsa",
                    id: " ",
                    spec_value_str: " spec_value_str",
                    goods_price: '100',
                }]
            }
        }
    };
</script>

<style lang="scss" scoped>
    .evaluation-list {
        padding: 0 10px;

        .list1 {
            .shop-info {
                padding: 10px 16px;
                background-color: #F6F6F6;
            }

            .item {


                .item-hd {
                    height: 40px;
                    background: #f2f2f2;
                    padding: 0 20px;

                    .status {
                        width: 300px;
                        text-align: right;
                    }
                }

                align-items: stretch;

                .goods {
                    padding-bottom: 16px;

                    .goods-all {
                        border: 1px solid #e5e5e5;
                        padding-top: 16px;
                    }

                    .goods-item {
                        padding: 0 16px 16px 16px;

                        .goods-img {
                            margin-right: 10px;
                            width: 72px;
                            height: 72px;
                        }
                    }
                }

                .operate {
                    width: 200px;

                    .btn {
                        background-color: $--color-primary;
                        width: 104px;
                        height: 32px;
                        border: 1px solid $--border-base;
                        border-radius: 2px;
                        cursor: pointer;
                    }
                }
            }
        }

        .list2 {
            .user {
                margin-right: 14px;
            }

            &>.item {
                width: 920px;
                padding: 15px 0px;
                border-bottom: 1px dashed #e5e5e5;
                align-items: flex-start;

                .avatar {
                    img {
                        border-radius: 50%;
                        width: 44px;
                        height: 44px;
                    }
                }

                .comment-imglist {
                    margin-top: 10px;

                    .item {
                        width: 80px;
                        height: 80px;
                        margin-right: 6px;
                    }
                }

                .reply {
                    background-color: #F6F6F6;
                    align-items: flex-start;
                    padding: 10px;
                }

                .goods {
                    width: 922px;
                    background-color: #F6F6F6;
                    padding: 14px;

                    .goods-img {
                        width: 72px;
                        height: 72px;
                    }
                }
            }
        }
    }
</style>

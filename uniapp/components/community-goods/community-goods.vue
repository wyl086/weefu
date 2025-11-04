<template>
    <u-popup v-model="show" mode="bottom" height="900" closeable border-radius="14">


        <view class="xl p-24 text-center bold">TA提到的商品</view>

        <navigator v-for="(goodsItem, index) in lists" :key="index" hover-class="none"
            :url="'/pages/goods_details/goods_details?id=' + goodsItem.id">
            <view class="goods flex">
                <u-image width="160" height="160" :src="goodsItem.image"></u-image>
                <view class="m-l-20 goods-info">
                    <view class="line-2 nr normal">
                        {{ goodsItem.name }}
                    </view>
                    <view class="primary xl p-t-30">￥{{ goodsItem.goods_price }}</view>
                </view>
            </view>
        </navigator>


    </u-popup>
</template>

<script>
    import {
        getCommunityGoodsLists
    } from "@/api/community.js"
    export default {
        name: "community-goods",
        props: {
            value: {
                type: Boolean
            },
            communityId: {
                type: [String, Number],
                default: ''
            }
        },
        data() {
            return {
                lists: []
            }
        },
        computed: {
            // 弹窗Popup显示状态
            show: {
                get: function() {
                    return this.value
                },
                set: function(value) {
                    value ? this.initRecommendGoods() : ''
                    this.$emit('input', value)
                }
            }
        },
        methods: {
            // 获取
            initRecommendGoods() {
                getCommunityGoodsLists({
                    id: this.communityId
                }).then(res => {
                    this.lists = res.data
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .goods {
        padding: 20rpx;
        border-top: 1px solid $-color-body;

        .goods-info {
            height: 160rpx;
        }
    }
</style>

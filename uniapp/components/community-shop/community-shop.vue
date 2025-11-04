<template>
    <u-popup v-model="show" mode="bottom" height="900" closeable border-radius="14">


        <view class="xl p-24 text-center bold">TA提到的店铺</view>

        <navigator v-for="(shopItem, shopIndex) in lists" :key="shopIndex" hover-class="none"
            :url="'/pages/store_index/store_index?id=' + shopItem.id">
            <view class="shop flex">
                <u-image width="160" height="160" :src="shopItem.logo"></u-image>
                <view class="m-l-20 shop-info">
                    <view class="line-2 nr normal">
                        {{ shopItem.name }}
                    </view>
                </view>
            </view>
        </navigator>


    </u-popup>
</template>

<script>
    import {
        getCommunityShopLists
    } from "@/api/community.js"
    export default {
        name: "community-shop",
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
                    value ? this.initRecommendShop() : ''
                    this.$emit('input', value)
                }
            }
        },
        methods: {
            // 获取
            initRecommendShop() {
                getCommunityShopLists({
                    id: this.communityId
                }).then(res => {
                    this.lists = res.data
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .shop {
        padding: 20rpx;
        border-top: 1px solid $-color-body;

        .shop-info {
            height: 160rpx;
            line-height: 160rpx;
        }
    }
</style>

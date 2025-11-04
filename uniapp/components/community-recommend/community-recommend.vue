<template>
    <view :class="['community-recommend bg-white']">
        <view class="active-hd flex row-between" v-if="title">
            <view class="xxl bold">{{title}}</view>
            <router-link :to="url" navType="pushTab">
                <view class="sm">发现好物 <u-icon name="arrow-right"></u-icon>
                </view>
            </router-link>
        </view>

        <scroll-view style="white-space: nowrap;" :scroll-x="true">
            <view class="community-wrap">
                <community-list type="index" :list="list"></community-list>
            </view>
        </scroll-view>
    </view>
</template>

<script>
    export default {
        name: "community-recommend",
        props: {
            title: String,
            url: String,
            list: {
                type: Array,
                default: () => ([])
            },
        }
    }
</script>

<style lang="scss" scoped>
    .community-recommend {
        background-size: 100% auto;
        background-repeat: no-repeat;
        border-radius: 14rpx;
        overflow: hidden;
        background-image: url(../../static/images/index_community_bg.png);

        .active-hd {
            padding: 24rpx 20rpx;
        }

        .community-wrap {
            padding: 0 20rpx 20rpx;
            display: inline-block;
        }

        .more {
            height: 80rpx;
            border-top: $-solid-border;
        }
    }
</style>

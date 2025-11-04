<template>
    <view class="header flex row-between">
        <router-link class="photo" to="/bundle_b/pages/published_works/published_works">
            <u-image src="/static/images/icon_photo.png" width="60" height="60" borderRadius="50%"></u-image>
        </router-link>
        <view class="mainnav flex">
            <view class="mainnav--item" :class="{'active': current === 0}" @click="changeNav(0)">
                <text>关注</text>
                <text v-if="hasNew" class="new"></text>
            </view>
            <view class="mainnav--item" :class="{'active': current === 1}" @click="changeNav(1)">
                <text>发现</text>
            </view>
        </view>
        <view class="user flex row-right">
            <router-link to="/bundle_b/pages/community_search/community_search">
                <u-icon v-if="current==0" name="search" size="34" class="m-r-20"></u-icon>
            </router-link>
            <router-link to="/bundle_b/pages/community_user/community_user">
                <u-image :src="userInfo.avatar?userInfo.avatar:'/static/images/portrait_empty.png'" width="60" height="60" borderRadius="50%"></u-image>
            </router-link>
        </view>
    </view>
</template>

<script>
    import {
        mapGetters
    } from "vuex"
    export default {
        name: 'like-header',
        props: {
            current: {
                type: Number,
                default: 1
            }
        },
        data() {
            return {
                hasNew: false
            }
        },
        created() {
            uni.$on('hasNew', item => {
                this.hasNew = item
            })
        },
        methods: {
            changeNav(index) {
                if(!this.isLogin) return this.$Router.push('/pages/login/login')
                this.$emit('change', index);
            }
        },
        computed: {
            ...mapGetters(['userInfo'])
        }
    }
</script>

<style lang="scss" scoped>
    .header {
        padding: 16rpx 24rpx;
        background-color: $-color-white;
        .photo {
            width: 120rpx;
        }

        .mainnav {
            &--item {
                width: 120rpx;
                font-size: 32rpx;
                font-weight: 500;
                text-align: center;
                color: #BBBBBB;
                transition: all .2s linear;

                .new {
                    width: 10rpx;
                    height: 10rpx;
                    border-radius: 50%;
                    display: inline-block;
                    margin-bottom: 24rpx;
                    background-color: $-color-primary;
                }
            }

            .active {
                color: #000000;
            }
        }
        
        .user {
            width: 120rpx;
        }
    }
</style>

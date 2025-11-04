<template>
    <view class="">
        <!-- 普通瀑布流 -->
        <view class="community-list" v-if="type == 'waterfall'">
            <router-link v-for="(item, index) in list" :key="index" class=""
                :to="'/bundle_b/pages/community_detail/community_detail?id=' + item.id">
                <view class="community-list--item bg-white m-t-20">
                    <view class="community-img">
                        <u-lazy-load threshold="0" border-radius="10" :image="item.image" :index="index"></u-lazy-load>
                    </view>
                    <view class="community-info">
                        <view class="community-title line-2">{{item.content}}</view>
                        <view class="m-t-10 flex">
                            <u-image width="50" height="50" border-radius="50%" :src="item.avatar"></u-image>
                            <view class="user-name flex-1 line-2">{{ item.nickname }}</view>
                            <view class="likes">
                                <image
                                    :src="item.is_like?'/static/images/icon_collection_s.png':'/static/images/icon_likes.png'">
                                </image>
                                <text class="xs muted m-l-6">{{ item.like }}</text>
                            </view>
                        </view>
                    </view>
                </view>
            </router-link>
        </view>

        <!-- 用户作品瀑布流 -->
        <view class="community-list" v-if="type == 'works'">

            <router-link v-for="(item, index) in list" :key="index" class=""
                :to="'/bundle_b/pages/community_detail/community_detail?id=' + item.id">
                <view class="community-list--item bg-white m-t-20">
                    <view class="community-img">
                        <!-- 审核 Start -->
                        <view class="works flex row-center " v-if="item.status === 0 || item.status === 2">
                            <view class="text-center nr white">
                                <view>{{ item.status_desc }}</view>
                                <view class="m-t-10">{{ item.audit_remark_desc }}</view>
                            </view>
                        </view>
                        <!-- 审核 End -->
                        <u-lazy-load threshold="0" border-radius="10" :image="item.image" :index="index"></u-lazy-load>
                    </view>
                    <view class="community-info">
                        <view class="community-title line-2">{{item.content}}</view>
                        <view class="m-t-20 flex">
                            <view class="user-name flex-1 line-2">{{ item.create_time }}</view>

                            <view class="likes">
                                <image
                                    :src="item.is_like?'/static/images/icon_collection_s.png':'/static/images/icon_likes.png'">
                                </image>
                                <text class="xs muted m-l-6">{{ item.like }}</text>
                            </view>
                        </view>
                    </view>
                </view>
            </router-link>
        </view>

        <!-- 首页list -->
        <view class="community-list flex" v-if="type == 'index'">
            <router-link v-for="(item, index) in list" :key="index" class="community-list--item bg-white m-r-20"
                :to="'/bundle_b/pages/community_detail/community_detail?id=' + item.id">
                <view class="community-index">
                    <view class="wrap white sm p-l-10">
                        <view class="index-title line-1">{{ item.content }}</view>
                        <view class="flex m-t-10">
                            <u-lazy-load threshold="0" border-radius="10" :image="item.image" :index="index"></u-lazy-load>
                            <view class="index-name line-1 m-l-6">
                                {{ item.nickname }}
                            </view>
                        </view>
                    </view>
                    <u-image width="240" height="240" :src="item.image" borderRadius="14"></u-image>
                </view>
            </router-link>

        </view>
    </view>


</template>

<script>
    export default {
        props: {
            list: {
                type: Array,
                default: () => []
            },
            // 两行时有效
            width: {
                type: String,
                default: '347rpx'
            },
            type: {
                type: String
            }
        },
        data() {
            return {

            };
        }
    }
</script>

<style lang="scss" scoped>
    .community-list {
        &--item {
            border-radius: 14rpx;

            // 个人中心审核作品
            .community-img {
                width: 336rpx;
                position: relative;

                .works {
                    width: 100%;
                    height: 100%;
                    z-index: 10;
                    border-radius: 14rpx;
                    background-color: rgba(0, 0, 0, 0.4);
                    position: absolute;
                }
            }

            .community-index {
                width: 240rpx;
                position: relative;

                .wrap {
                    width: 100%;
                    height: 100%;
                    z-index: 10;
                    border-radius: 14rpx;
                    background-color: rgba(0, 0, 0, 0.4);
                    position: absolute;
                    padding-top: 140rpx;

                    .index-title {
                        width: 210rpx;
                    }

                    .index-name {
                        width: 160rpx;
                    }
                }
            }

            .community-info {
                padding: 10rpx;

                .community-title {
                    font-size: 28rpx;
                    line-height: 40rpx;
                    color: $-color-normal;
                }

                .user-name {
                    color: $-color-muted;
                    font-size: 24rpx;
                    margin: 0 10rpx;
                }

                .likes {
                    image {
                        width: 32rpx;
                        height: 32rpx;
                        vertical-align: middle;
                    }
                }
            }
        }
    }
</style>

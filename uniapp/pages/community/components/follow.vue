<template>
    <view class="follow">
        <mescroll-uni ref="mescrollRef" top="0" :height="height" @init="initMescroll" @down="downCallback"
            @up="upCallback" :down="downOption" :up="upOption">

            <block v-for="(item, index) in lists" :key="index">
                <view class="content-box">
                    <!-- 内容头部信息 -->
                    <router-link :to="'/bundle_b/pages/community_user/community_user?id=' + item.user.id">
                        <view class="header flex row-between">
                            <view class="flex">
                                <!-- 头像 -->
                                <u-image width="70" height="70" :src="item.user.avatar" borderRadius="50%"></u-image>
                                <!-- 昵称 -->
                                <text class="normal bold m-l-16">{{ item.user.nickname }}</text>
                            </view>
                            <view>
                                <text class="muted">{{ item.create_time }}</text>
                            </view>
                        </view>
                    </router-link>
                    <!-- 内容媒体信息 -->
                    <view class="swiper-container">
                        <product-swiper :imgUrls="item.images" :autoplay="false" borderRadius="14"></product-swiper>
                    </view>

                    <!-- 提到的宝贝( 商品 ) -->
                    <view class="goods-box bb flex row-between" @click="handleOpenGoods(item.id)"
                        v-if="item.goods_data.length">
                        <text class="nr lighter">查看TA提到的宝贝({{item.goods_data.length}})</text>
                        <!-- <text class="tips xs">300+人评价</text> -->
                        <view class="goods flex">
                            <block v-for="(goodsItem, goodsIndex) in item.goods_data" :key="goodsItem.id">
                                <u-image v-if="goodsIndex <= 2" :src="goodsItem.image" width="58" height="58"
                                    class="m-l-6"></u-image>
                            </block>
                            <u-icon name="arrow-right" class="m-l-10"></u-icon>
                        </view>
                    </view>

                    <!-- 提到的店铺( 店铺 ) -->
                    <view class="goods-box bb flex row-between" @click="handleOpenShop(item.id)"
                        v-if="item.shop_data.length">
                        <text class="nr lighter">查看TA提到的店铺({{item.shop_data.length}})</text>
                        <!-- <text class="tips xs">300+人评价</text> -->
                        <view class="goods flex">
                            <block v-for="(shopItem, shopIndex) in item.shop_data" :key="shopIndex">
                                <u-image v-if="shopIndex <= 2" :src="shopItem.logo" width="58" height="58"
                                    class="m-l-6"></u-image>
                            </block>
                            <u-icon name="arrow-right" class="m-l-10"></u-icon>
                        </view>
                    </view>

                    <!-- 内容文字 -->
                    <view class="content ">
                        <view class="text" v-if="item.show">
                            {{ item.beforeContent }}...
                            <text class="primary nr m-l-20" @click="handleShowContent(index)">展开</text>
                        </view>
                        <view class="text" v-else>
                            {{ item.content }}
                        </view>
                        <view class="tags" v-if="item.topic">
                            <navigator hover-class="none"
                                :url="'/bundle_b/pages/community_topic/community_topic?id=' + item.topic.id +'&name=' + item.topic.name">
                                <text class="sm"># {{ item.topic.name }}</text>
                            </navigator>
                        </view>
                    </view>
                    <!-- 底部 -->
                    <view class="footer flex row-between">
                        <view>
                            <button open-type="share" @click="handleShare(item)" class="flex-col col--center"
                                hover-class="none">
                                <image src="/static/images/icon_forward.png"></image>
                            </button>
                        </view>
                        <view class="flex nr lighter">
                            <view class="flex likes-box">
                                <view class="likes" :class="item.is_like==0 ? 'leave':'entry'"
                                    @click="handleCommunityLike(item.is_like, item)">
                                </view>
                                <image class="m-l-30"></image>
                                <text>{{ item.like }}</text>
                            </view>
                            <view class=" m-l-40" @click="handleOpenComment(item.id)">
                                <image src="/static/images/icon_evaluate.png"></image>
                                <text>{{ item.comment }}</text>
                            </view>
                        </view>
                    </view>
                </view>
            </block>

        </mescroll-uni>

        <!-- 提到的商品 -->
        <community-goods v-model="showGoodsPopup" v-if="showGoodsPopup" :communityId="communityId"></community-goods>

        <!-- 提到的店铺 -->
        <community-shop v-model="showShopPopup" :communityId="communityId"></community-shop>

        <!-- 评论 -->
        <community-comment-popup v-model="showComment" v-if="showComment" :communityId="communityId">
        </community-comment-popup>

        <!-- #ifdef H5 -->
        <u-popup :custom-style="{'background': 'none'}" class="share-tips" v-model="showTips" mode="top">
            <view style="overflow: hidden;">
                <image src="/static/images/share_arrow.png" class="share-arrow" />
                <view class="white" style="text-align: center;margin-top: 280rpx;">
                    <view class="bold lg">立即分享给好友吧</view>
                    <view class="sm m-t-10">点击屏幕右上角将本页面分享给好友</view>
                </view>
            </view>
        </u-popup>
        <!-- #endif -->
    </view>
</template>

<script>
    import {
        getCommunityFollow,
        apiCommunityCommentLike
    } from '@/api/community.js';
    import {
        debounce
    } from "@/utils/tools.js"
    import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
    import MescrollMoreItemMixin from "@/components/mescroll-uni/mixins/mescroll-more-item.js";
    export default {
        mixins: [MescrollMixin, MescrollMoreItemMixin],
        props: {
            active: {
                type: Number
            }
        },
        data() {
            return {
                height: '',
                canReset: true,
                isLikes: false,
                communityId: '',
                upOption: {
                    empty: {
                        icon: '/static/images/follow_null.png',
                        tip: '暂未关注任何种草官哦~', // 提示
                        fixed: true,
                        top: "200rpx",
                    }
                },
                lists: [],
                show: false,
                showGoodsPopup: false,
                showShopPopup: false,
                showTips: false,
                showComment: false
            }
        },
        watch: {
            active() {
                uni.$emit('hasNew', 0)
                this.mescroll.resetUpScroll()
            }
        },
        created() {
            this.handleCommunityLike = debounce(this.handleCommunityLike, 100)
            uni.getSystemInfo({
                success: (res) => {
                    this.height = res.windowHeight - 46 + 'px';
                }
            });
        },
        methods: {
            initMescroll(event) {
                this.isInit = true; // 标记为true
                this.mescroll = event;
            },
            // 获取
            async upCallback(page) {
                const index = this.current;
                const pageNum = page.num
                const pageSize = page.size

                getCommunityFollow({
                    page_no: pageNum,
                    page_size: pageSize,
                }).then(res => {
                    // 如果是第一页需手动置空列表
                    if (pageNum == 1) this.lists = []
                    // 重置列表数据
                    const hasNext = !!res.data.more;
                    res.data.list = this.handleContent(res.data.list)
                    this.lists = [...this.lists, ...res.data.list]
                    this.mescroll.endSuccess(res.data.list.length, hasNext);
                }).catch((err) => {
                    this.mescroll.endErr()
                })
            },
            // 处理打开商品推荐
            handleOpenGoods(id) {
                this.communityId = id;
                this.showGoodsPopup = true;
            },
            // 处理打开获取店铺推荐
            handleOpenShop(id) {
                this.communityId = id;
                this.showShopPopup = true;
            },
            // 处理内容超过固定长度或换行的就显示展开
            handleContent(list) {
                return list.filter(item => {
                    if (item.content.indexOf('\n') > -1) {
                        const arr = item.content.split('\n')
                        if (arr.length >= 3) {
                            item.show = true
                            if (arr[0].length >= 25 || arr[1].length >= 25 || arr[2].length > 20) {
                                item.beforeContent = item.content.slice(0, arr[0].length + arr[1].length + arr[2].length - 10)
                            } else {
                                item.beforeContent = item.content.slice(0, arr[0].length + arr[1].length + arr[
                                    2].length - 10)
                            }
                        } else {
                            if (item.content.length >= 70) {
                                item.show = true
                                item.beforeContent = item.content.slice(0, 70)
                            }
                        }
                    } else {
                        if (item.content.length >= 70) {
                            item.show = true
                            item.beforeContent = item.content.slice(0, 70)
                        }
                    }

                    return true
                })
            },
            // 展开内容
            handleShowContent(index) {
                this.$set(this.lists[index], 'show', false)
            },
            // 处理分享
            handleShare(item) {
                // #ifdef MP
                this.$emit('share', item)
                // #endif
                // #ifdef H5
                this.showTips = true
                // #endif
                // #ifndef MP
                this.$store.commit('setCommunity', {
                    ...item,
                    url: 'bundle_b/pages/community_detail/community_detail'
                })
                this.$store.dispatch('communityShare')
                // #endif
            },
            // 点赞
            handleCommunityLike(status, item) {
                switch (status) {
                    case 0:
                        this.$set(item, 'like', item.like + 1)
                        this.$set(item, 'is_like', 1)
                        break;
                    case 1:
                        this.$set(item, 'like', item.like - 1)
                        this.$set(item, 'is_like', 0)
                        break;
                }
                apiCommunityCommentLike({
                    id: item.id,
                    status: status ? 0 : 1,
                    type: 1
                }).then(res => {
                    if (res.code === 1) {
                        // 点赞文章时 其他页面的状态也需要更改
                        uni.$emit('changeItem', {
                            like: item.like,
                            is_like: item.is_like,
                            id: item.id
                        })
                    } else {
                        // 不成功把它们改回去
                        switch (status) {
                            case 0:
                                this.$set(item, 'like', item.like - 1)
                                this.$set(item, 'is_like', 0)
                                break;
                            case 1:
                                this.$set(item, 'like', item.like + 1)
                                this.$set(item, 'is_like', 1)
                                break;
                        }
                        this.$toast({
                            title: res.msg
                        })
                    }
                })
            },
            // 打开评论
            handleOpenComment(id) {
                this.communityId = id;
                this.showComment = true;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .content-box {
        padding-bottom: 20rpx;
        background-color: $-color-white;

        .bb {
            border-bottom: 1px solid #f2f2f2;
        }

        .header {
            font-size: 28rpx;
            padding: 20rpx 24rpx;
        }

        .swiper-container {
            padding: 0 20rpx;
        }

        .goods-box {
            padding: 15rpx 24rpx;

            .tips {
                padding: 0 10rpx;
                color: $-color-primary;
                border-radius: 20rpx;
                border: 1px solid $-color-primary;
            }
        }

        .content {
            padding: 24rpx;
            padding-bottom: 0;

            .text {
                white-space: pre-line;
                line-height: 48rpx;
                font-size: 28rpx;
                color: $-color-normal;
            }

            .tags {
                padding-top: 24rpx;

                text {
                    margin-right: 20rpx;
                    border-radius: 26rpx;
                    padding: 8rpx 24rpx;
                    color: $-color-primary;
                    background: rgba($-color-primary, .1);
                }
            }
        }

        .footer {
            padding: 0 24rpx;

            image {
                width: 44rpx;
                height: 44rpx;
                vertical-align: middle;
                margin: 24rpx 6rpx;
            }

            // 点赞动画
            .likes-box {
                position: relative;

                .likes {
                    z-index: 99;
                    left: -36rpx;
                    width: 120rpx;
                    height: 120rpx;
                    margin-right: 6rpx;
                    position: absolute;
                    background: url('@/static/images/likes.png') no-repeat;
                    background-position: left;
                    background-size: cover;
                }

                // 没点赞
                .leave {
                    background-position: left;
                }

                // 点赞
                .entry {
                    background-position: right;
                    transition: background .6s steps(28);
                }
            }
        }

    }

    .share-tips .share-arrow {
        width: 140rpx;
        height: 250rpx;
        float: right;
        margin: 15rpx 31rpx 0 0;
    }
</style>

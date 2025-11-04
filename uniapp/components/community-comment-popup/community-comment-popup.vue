<template>
    <view>
        <u-popup v-model="show" mode="bottom" height="900rpx" :duration="100" closeable border-radius="14" :customStyle="{
			'bottom': tabbarBottom
		}">
            <view class="content">
                <!-- 评论头 -->
                <view class="xl p-24 text-center bold bb">评论</view>

                <!-- 评论内容 -->
                <view class="content-wrapper">
                    <scroll-view scroll-y="true" @scrolltolower="toLower">
                        <template v-if="isFirstLoading">
                            <view class="text-center flex row-center p-50">
                                <u-loading :color="colorConfig.primary" :size="40" mode="circle"></u-loading>
                                <text class="m-l-20">加载中</text>
                            </view>
                        </template>

                        <template v-else>
                            <view class="text-center p-50" v-if="!commentData.length">
                                <view class="flex row-center">
                                    <u-image :src="'/static/images/news_null.png'" width="300" height="300"></u-image>
                                </view>
                                <view class="muted m-t-40">
                                    还没有人评论呢, 快来抢沙发～
                                </view>
                            </view>
                            <template v-else>
                                <view
                                	v-for="(commentItem, commentIndex) in commentData"
                                	:key="commentItem.id"
                                	@click="onSelectComment(commentIndex)"
                                >
                                    <community-comment-list
                                	 :comment="commentItem"
                                	  @reply="onReply">
                                    </community-comment-list>
                                </view>
                                <!-- 加载 -->
                                <view class="flex row-center primary nd p-50" v-if="more === 1 && loading">
                                    <u-loading :color="colorConfig.primary" :size="40" mode="circle"></u-loading>
                                    <text class="m-l-20">加载中</text>
                                </view>
                                <!-- 加载底部 -->
                                <view class="text-center muted nd p-50" v-else>
                                    <text>没有更多了~</text>
                                </view>
                            </template>
                        </template>
                    </scroll-view>
                </view>

                <!-- 评论输入 -->
                <view class="comment-footer m-t-8 flex row-between">
                    <view class="flex-1 flex" @click="showCommentPopup=true">
                        <u-image :src="userInfo.avatar" width="60" height="60" borderRadius="50%"></u-image>
                        <view class="input nr muted">发表你的想法吧</view>
                    </view>
                </view>

            </view>
        </u-popup>


        <!-- 一级评论 -->
        <community-comment v-model="showCommentPopup" :communityId="id" @change="changeComment" :safeAreaInsetBottom="true"> 
        </community-comment>

        <!-- 二级评论 -->
        <community-comment v-model="showCommentChildPopup" :communityId="id" :pid="childPid"
            @change="changeCommentChild" :placeholder="childPlaceholder" :safeAreaInsetBottom="true">
        </community-comment>
    </view>
</template>

<script>
    import {
        mapGetters
    } from "vuex"
    import {
        getCommunityCommentLists
    } from '@/api/community.js';
    import CommunityCommentList from "../community-comment-list/community-comment-list.vue"
    export default {
        name: "community-comment-popup",
        components: {
            CommunityCommentList
        },
        props: {
            value: {
                type: Boolean
            },
            communityId: {
                type: [Number, String]
            }
        },
        data() {
            return {
                id: '',
                commentData: [],
                page: 1, // 评论分页页数
                pageSize: 10, // 评论分页数量
                more: 0, // 是否有下一页分页
                loading: false, // 加载动画 底部
                showCommentPopup: false, // 一级评论
                showCommentChildPopup: false, // 二级评论
                childPid: '', // 选择二级评论回复ID
                childIndex: '', // 选择的二级评论第几条
                childPlaceholder: '', // 选择的二级评论回复人名字: 回复@xxx
                // 是否初始化加载中
                isFirstLoading: true
            }
        },
        computed: {
            ...mapGetters(['userInfo', 'sysInfo']),
            // 弹窗Popup显示状态
            show: {
                get: function() {
                    return this.value
                },
                set: function(value) {
                    !value ? this.showCommentPopup = false : '';
                    this.$emit('input', value)
                }
            },
			tabbarBottom() {
				// #ifdef MP
				let safeArea = this.sysInfo.safeArea
				let bottom = this.sysInfo.screenHeight - safeArea.bottom
				// 获取菜单按钮的位置信息
				let rect = uni.getMenuButtonBoundingClientRect()
				// 计算底部tab栏的高度
				return bottom + rect.bottom - rect.top + 15 + 'px'
				// #endif
				// #ifndef MP
				return 50 + 'px'
				// #endif
			},
        },
        watch: {
            communityId: {
                handler: function(val) {
                    this.id = val
                    this.page = 1;
                    this.commentData = []
                    this.getCommentData()
                },
                immediate: true
            }
        },
        methods: {
            // 评论
            changeComment(event) {
                if (!event.hasOwnProperty('child')) {
                    event.child = []
                }
                this.commentData.unshift(event)
            },
            // 选择第几条评论区回复
            onSelectComment(index) {
            	this.childIndex = index
            },
            // 回复评论
            onReply(event) {
            	// console.log(event)
                this.childPid = event.parentId
                this.childPlaceholder = '回复@' + event.commentUserName;
                this.showCommentChildPopup = true
            },
            // 子评论
            changeCommentChild(event) {
                this.commentData[this.childIndex].child.push(event)
            },
            // 获取评论
            getCommentData() {
                getCommunityCommentLists({
                    article_id: this.communityId,
                    page_no: this.page,
                    page_size: this.pageSize,
                }).then(res => {
                    setTimeout(() => this.isFirstLoading = false, 1000)
                    if(res.code == 1) {
                        res.data.list.forEach(item => item.loading = false)
                        if (res.data.more === 1) {
                            this.page += 1
                        }
                        this.commentData.push(...res.data.list)
                        this.more = res.data.more
                        this.loading = false
                    } else {
                        this.$toast({ title: res.msg })
                    }
                })
            },
            // 触底加载
            toLower() {
                if (this.more) {
                    this.loading = true
                    this.getCommentData()
                }
            },
        }
    }
</script>

<style lang="scss" scoped>
    .bb {
        border-bottom: 1px solid $-color-body;
    }

    .content {
        width: 100%;
        height: 100%;
        position: relative;
		padding-bottom: calc(100rpx + env(safe-area-inset-bottom));

        >view {
            width: 100%;
            position: fixed;
        }

        .content-wrapper {
            top: 46px;
            /* #ifdef H5 */
            height: 600rpx;
            /* #endif */
            /* #ifndef H5 */
            height: 700rpx;

            /* #endif */
            scroll-view {
                height: 100%;
            }
        }

        .comment-footer {
            bottom: var(--window-bottom);
            height: 92rpx;
            padding: 0 30rpx;
            box-shadow: 0 -4rpx 10rpx rgba(#000000, .1);

            .input {
                width: 100%;
                margin-left: 16rpx;
                border-radius: 30rpx;
                background: #f8f8f8;
                padding: 10rpx 30rpx;
            }

            image {
                width: 44rpx;
                height: 44rpx;
            }
        }
    }
</style>

<template>
    <view class="user" :style="[background]">
        <u-navbar id="navbar" :border-bottom="false"
            :background="{ background: 'rgba(256,256,256, '+ navStyle.backgroundBg +')', }"
            :back-bg="'rgba(0,0,0,' + navStyle.backBg + ')'" :back-icon-color="navStyle.backColor" :immersive="false">
        </u-navbar>

        <!-- Header Start -->
        <view class="header">
            <!-- 用户信息 -->
            <view class="user_info flex row-between">
                <view class="flex">
                    <view class="user-avatar flex row-center">
                        <u-image :src="userInfo.avatar" width="106" height="106" borderRadius="50%"></u-image>
                    </view>
                    <view class="m-l-30">
                        <view class="user-name xxl white bold line-1">{{ userInfo.nickname }}</view>
                        <view class="user-id m-t-14 xs white">会员ID: {{ userInfo.sn }}</view>
                    </view>
                </view>
                <!-- 去用户设置 -->
                <navigator v-if="userInfo.is_self" url="/bundle_b/pages/community_user_profile/community_user_profile"
                    hover-class="none">
                    <image src="/bundle_b/static/icon_my_setting.png" class="user-setting"></image>
                </navigator>
            </view>

            <!-- 用户简介 -->
            <view class="user-intro line-3 white sm">
                {{ userInfo.signature || '暂无简介~' }}
            </view>

            <!-- 用户数据底部 -->
            <view class="user-footer flex">
                <!-- 统计 -->
                <view class="user-statistics">
                    <view class="user-statistics--item">
                        <view class="xl bold">{{ userInfo.follow }}</view>
                        <view class="sm">关注</view>
                    </view>
                    <view class="user-statistics--item">
                        <view class="xl bold">{{ userInfo.fans }}</view>
                        <view class="sm">粉丝</view>
                    </view>
                    <view class="user-statistics--item">
                        <view class="xl bold">{{ userInfo.like }}</view>
                        <view class="sm">获赞</view>
                    </view>
                </view>
                <!-- 操作 -->
                <view class="user-operation flex">
                    <!-- 发布 -->
                    <navigator url="/bundle_b/pages/published_works/published_works" hover-class="none">
                        <button class="btn-primary br60 xs white" v-if="userInfo.is_self">
                            <image src="/bundle_b/static/icon_publish.png"></image>
                            <text class="m-l-6">发布</text>
                        </button>
                    </navigator>
                    <!-- 关注 -->
                    <button class="btn-primary br60 xs white" v-if="userInfo.is_self==0 && userInfo.is_follow==0"
                        @click="handleCommunityFollow(1)">
                        <image src="/bundle_b/static/icon_follow.png"></image>
                        <text class="m-l-6">关注</text>
                    </button>
                    <!-- 已关注 -->
                    <button class="followed-btn br60 xs primary bold"
                        v-if="userInfo.is_self==0 && userInfo.is_follow==1" @click="showFollowTips = true">已关注</button>

                    <button open-type="share" @click="handleShare" class="flex-col col--center" hover-class="none">
                        <image src="/bundle_b/static/icon_share.png" class="share"></image>
                    </button>
                </view>
            </view>
        </view>
        <!-- Header End -->

        <!-- Main Start -->
        <view class="main">
            <view class="nav-title">
                <tabs :current="active" @change="changeTabs" bgColor="transparent" stickyBgColor="transparent"
                    height="100" fontSize="34" :is-scroll="false" width="400rpx" borderRadius="20rpx 20rpx 0 0">
                    <tab name="作品">
                        <community-works v-if="!isFirstLoading" :worksNum="worksNum" :i="0" :index="active"
                            ref="mescoll1" :userId="userId"></community-works>
                    </tab>
                    <tab name="赞过">
                        <community-like v-if="!isFirstLoading" :likeNum="likeNum" :i="1" :index="active" ref="mescoll2"
                            :userId="userId"></community-like>
                    </tab>
                </tabs>
            </view>
            <!-- </u-sticky> -->

        </view>
        <!-- Main End -->

        <!-- 加载 -->
        <loading-view v-if="isFirstLoading"></loading-view>

        <!-- 取消关注 -->
        <u-modal v-model="showFollowTips" :show-cancel-button="true" comfirm-text="取消关注" cancelText="再想想"
            :confirm-color="colorConfig.primary" :show-title="false" @confirm="handleCommunityFollow(0)">
            <view class="flex-col col-center tips-dialog" style="padding-top: 40rpx">
                <image class="icon-lg" src="/static/images/icon_warning.png" />
                <view style="margin:30rpx 0;">确认取消关注？</view>
            </view>
        </u-modal>

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
        getCommunityUserCenter,
        apiCommunityFollow,
    } from "@/api/community.js"
    import CommunityLike from "./components/community-like.vue"
    import CommunityWorks from "./components/community-works.vue"
    export default {
        components: {
            CommunityLike,
            CommunityWorks
        },
        data() {
            return {
                isFirstLoading: true,

                worksNum: 0, // 用于子组件监听触底
                likeNum: 0, // 用于子组件监听触底

                navStyle: {
                    backBg: 0.4,
                    backgroundBg: 0,
                    backColor: 'rgba(256,256,256,1)'
                },
                active: 0,
                userId: '', //用户ID（不传为当前用户

                showFollowTips: false, // 取消关注
                showTips: false, // 分享弹窗H5

                userInfo: {
                    id: '', //	int	用户id
                    sn: '', //string	用户编号
                    nickname: '', //string	用户昵称
                    avatar: '', //string	用户头像
                    image: '', //string	背景图
                    signature: '', //string	签名
                    follow: 0, //int	关注人数
                    fans: 0, //int	粉丝数
                    like: 0, //int	点赞数
                    is_self: 0, //	int	是否为当前登录者 0-不是 1-是
                    is_follow: 0, //	int	登录者是否关注获取信息目标 0-未关注 1-关注
                }
            }
        },
        computed: {
            background() {
                const {
                    image
                } = this.userInfo
                return image ? {
                    'background-image': `url(${image})`
                } : {
                    
                }
            },
        },
        onLoad() {
            const options = this.$Route.query;
            this.userId = options.id;
        },
        onShow() {
            if (this.active == 0) {
                this.worksNum += 1
            } else if (this.active == 1) {
                this.likeNum += 1
            }
            this.initCommunityUserCenter()
        },
        onUnload() {
            uni.$off("changeItem")
        },
        onPageScroll(e) {
            const top = uni.upx2px(500)
            const {
                scrollTop
            } = e

            const percent = scrollTop / top;
            this.navStyle.backgroundBg = percent
            this.navStyle.backBg = 0.4 * (0.5 - percent)
            this.navStyle.backColor = percent < 0.5 ? 'rgba(256,256,256,' + (0.5 - percent) * 2 + ')' : 'rgba(0,0,0,' +
                (
                    percent - 0.5) * 2 + ')'
        },
        // 触底加载
        onReachBottom() {
            console.log('触底')
            if (this.active == 0) {
                this.worksNum += 1
            } else if (this.active == 1) {
                this.likeNum += 1
            }
        },
        methods: {
            changeTabs(event) {
                this.active = event
            },
            // 分享处理
            handleShare() {
                // #ifdef H5
                this.showTips = true
                // #endif
                // #ifndef MP
                this.$store.commit('setCommunity', {
                    user: {
                        nickname: this.userInfo.nickname,
                    },
                    image: this.userInfo.avatar,
                    content: this.userInfo.signature,
                    url: 'bundle_b/pages/community_user/community_user'
                })
                this.$store.dispatch('communityShare')
                // #endif
            },
            // 初始化个人中心
            initCommunityUserCenter() {
                getCommunityUserCenter({
                    user_id: this.userId
                }).then(res => {
                    this.userInfo = res.data
                    setTimeout(() => {
                        this.isFirstLoading = false;
                    }, 600)
                })
            },
            // 关注 / 取消关注
            handleCommunityFollow(status) {
                apiCommunityFollow({
                    follow_id: this.userId,
                    status
                }).then(res => {
                    if (res.code === 1) this.initCommunityUserCenter()
                    this.$toast({
                        title: res.msg
                    })
                })
            },
        },

        async onShareAppMessage() {
            return {
                title: `${ this.userInfo.nickname }，TA的内容超级棒`,
                path: '/bundle_b/pages/community_user/community_user?id=' + this.userId
            };
        },
    }
</script>

<style lang="scss">
    .user {
        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
		background-image: url('../../static/community_user_bg.png');
        .header {
            padding: 20rpx 24rpx;

            // 用户信息
            .user_info {
                .user-avatar {
                    width: 110rpx;
                    height: 110rpx;
                    border-radius: 50%;
                    border: 2px solid #FFFFFF;
                }

                .user-name {
                    width: 450rpx
                }

                .user-id {
                    display: inline-block;
                    padding: 4rpx 16rpx;
                    border-radius: 20rpx;
                    border: 1px solid #fff;
                }

                .user-setting {
                    width: 58rpx;
                    height: 58rpx;
                }
            }

            // 用户简介
            .user-intro {
                padding: 20rpx 14rpx 20rpx 0;
                line-height: 40rpx;
                height: 140rpx;
            }

            // 用户数据底部
            .user-footer {

                // 统计数据
                .user-statistics {
                    display: flex;

                    &--item {
                        width: 160rpx;
                        color: #FFFFFF;
                    }
                }

                // 操作
                .user-operation {
                    margin-left: 24rpx;

                    .btn-primary {
                        padding: 0;
                        width: 126rpx;
                        height: 52rpx;
                        line-height: 52rpx;
                        background: linear-gradient(90.00deg, #f95f2f 0%, #ff2c3c 100%);

                        image {
                            width: 28rpx;
                            height: 28rpx;

                            vertical-align: middle;
                        }
                    }

                    // 已关注按钮
                    .followed-btn {
                        width: 126rpx;
                        height: 52rpx;
                        line-height: 52rpx;
                        padding: 0;
                        background-color: #FFFFFF;
                    }

                    .share {
                        width: 36rpx;
                        height: 36rpx;
                        margin: 20rpx 0;
                        margin-left: 20rpx;
                    }
                }
            }
        }

        .main {
            .nav-title {
                width: 100%;
                height: 92rpx;
                border-radius: 20rpx 20rpx 0 0;
                background-color: #FFFFFF;
            }
        }

        .share-tips .share-arrow {
            width: 140rpx;
            height: 250rpx;
            float: right;
            margin: 15rpx 31rpx 0 0;
        }
    }
</style>

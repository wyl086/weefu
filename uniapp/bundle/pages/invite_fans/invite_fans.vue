<template>
    <view class="pages">
        <view class="invite-fans flex-col col-center">
            <image :src="path" mode="widthFix" class="poster"></image>
            <invite-poster v-if="showPoster" :config="{
    avatar: userInfo.avatar,
    nickname: userInfo.nickname,
    code: inviteCode,
    link: link,
    qrCode: qrCode,
    poster: poster
   }" @success="handleSuccess" />
            <view class="bg-white footer flex-1">
                <view class="m-b-40">
                    <view class="m-b-10 sm lighter">我的邀请码</view>
                    <view class="flex row-between">
                        <view class="font-size-44">{{inviteCode}}</view>
                        <view class="sm m-r-30 copy-btn" @tap="onCopy(inviteCode)">点击复制</view>
                    </view>
                </view>
                <!-- #ifndef H5  -->
                <button class="save-btn br60" size="lg" @tap="saveImageToAlbum">保存到相册</button>
                <!-- #endif -->
                <!-- #ifdef H5 -->
                <button class="save-btn br60" size="lg">长按保存到相册</button>
                <!-- #endif -->
            </view>
        </view>
        <loading-view v-show="loading"></loading-view>
    </view>
</template>

<script>
    import {
        apiMnpQrCode
    } from '@/api/app'
    import {
        baseURL,
        basePath
    } from '@/config/app'
    import {
        mapGetters
    } from 'vuex'

    import {
        apiDistributionPoster
    } from '@/api/user'
	import {
		copy
	} from '@/utils/tools.js'
    export default {
        data() {
            return {
                path: '',
                qrCode: '',
                loading: true,
                showPoster: false,
                poster: ''
            };
        },

        async onLoad() {
            await this.getPoster()
            // #ifdef MP-WEIXIN
            this.getMnpQrCode()
            // #endif


            // #ifdef APP-PLUS || H5
            this.showPoster = true
            // #endif

        },

        methods: {
			onCopy(text) {
				copy(text)
			},
            async getPoster() {
                const res = await apiDistributionPoster()
                this.poster = res.data.poster
            },
            getMnpQrCode() {
                apiMnpQrCode({
                    type: 0,
                    url: 'pages/index/index'
                }).then(res => {
                    console.log(res)
                    this.qrCode = res.data.qr_code
                    this.showPoster = true
                })
            },
            saveImageToAlbum() {
                // #ifndef H5
                uni.saveImageToPhotosAlbum({
                    filePath: this.path,
                    success: res => {
                        this.$toast({
                            title: "保存成功"
                        });
                    },
                    fail: err => {
                        this.$toast({
                            title: '保存失败'
                        });
                    }
                });
                // #endif

                // #ifdef H5
                this.$toast({
                    title: '请长按图片保存'
                })
                // #endif

            },
            handleSuccess(val) {
                this.path = val
                this.loading = false
            }
        },
        computed: {
            ...mapGetters(['inviteCode', 'userInfo']),
            link() {
                return `${baseURL}${basePath}?invite_code=${this.inviteCode}`
            }
        }
    };
</script>
<style lang="scss">
    page {
        padding: 0
    }

    .invite-fans {
        min-height: 100vh;
        overflow: hidden;

        .poster {
            width: 600rpx;
            margin: 40rpx 0;
        }

        .footer {
            padding: 30rpx;
            width: 100%;
        }

        .copy-btn {
            color: $-color-primary;
        }

        .save-btn {
            color: #fff;

            background-color: $-color-primary;
            ;
        }
    }
</style>

<template>
    <view class="container" :style="{'padding-bottom': pageHeight+'px'}">
        <view class="main">
            <!-- 上传图片 -->
            <view class="uploader-container flex wrap">
                <u-upload @on-change="change" :action="action" :header="{'token': token,'version': version}" deletable
                    :max-count="9" @on-remove="remove" multiple custom-btn :width="160" :height="160" ref="upload"
                    :fileList="fileList" :show-progress="false">
                    <view slot="addBtn" class="uplader-upload" hover-class="slot-btn__hover" hover-stay-time="150">
                        <u-icon size="56" color="#b1b1b1" name="camera" />
                    </view>
                </u-upload>
            </view>

            <!-- 评论内容 -->
            <view class="content">
                <textarea v-model="formData.content" id="" maxlength="999" placeholder="说说你的购物体验和心得，我们都很期待呢~"
                    :disable-default-padding="true" @focus="handleFocus" @blur="pageHeight = 0" :show-confirm-bar="false"></textarea>
                <view class="muted text-right">
                    {{ formData.content.length }}/999
                </view>
            </view>

            <!-- 宝贝推荐 ｜｜ 店铺推荐-->
            <view class="item flex row-between recommend" @click="showRecommend">
                <view class="flex nr normal">
                    <image src="/bundle_b/static/icon_recommend.png" class="image m-r-10"></image>
                    <text v-if="formData.shop.length===0 && formData.goods.length===0">宝贝/店铺</text>
                    <text v-if="formData.shop.length!==0">店铺</text>
                    <text v-if="formData.goods.length!==0">宝贝</text>
                </view>
                <view class="nr flex">
                    <text class="muted m-r-10"
                        v-if="formData.shop.length===0 && formData.goods.length===0">选择购买过的商品</text>
                    <template v-if="formData.goods.length!==0">
                        <block v-for="(item, index) in formData.goods" :key="index">
                            <u-image v-if="index<=2" :src="item.image" width="58" height="58" class="m-l-6">
                            </u-image>
                        </block>
                    </template>
                    <template v-if="formData.shop.length!==0">
                        <block v-for="(item, index) in formData.shop" :key="index">
                            <u-image v-if="index<=2" :src="item.logo" width="58" height="58" class="m-l-6">
                            </u-image>
                        </block>
                    </template>
                    <u-icon name="arrow-right" size="22" color="#707070" class="m-l-10" />
                </view>
            </view>

            <!-- 话题 -->
            <view class="item flex row-between topic" @click="showTopicPopup=true">
                <view class="flex nr normal">
                    <image src="/bundle_b/static/icon_topic.png" class="image m-r-10"></image>
                    <text>话题</text>
                </view>
                <view class="nr flex">
                    <view class="tags primary-tags m-r-10" v-if="formData.topic_id">
                        <text>#{{ formData.topic_id.name }}</text>
                    </view>
                    <u-icon name="arrow-right" size="22" color="#707070"></u-icon>
                </view>
            </view>

            <!-- 初始化热门标签 -->
            <view class="tags m-t-10 gary-tags" v-show="!formData.topic_id">
                <block v-for="topicItem in recommendTopic" :key="topicItem.id">
                    <text @click="handleTopic(topicItem)">#{{ topicItem.name }}</text>
                </block>
            </view>
        </view>

        <!-- 底部 -->
        <view class="footer">
            <button class="br60 white btn lg" @click="onSubmit">{{ !formData.id ? '发布' : '编辑' }}</button>
        </view>

        <!-- 组件 选择宝贝推荐 ｜｜ 店铺推荐 -->
        <recommend v-model="showRecommendPopup" :shop="formData.shop" :goods="formData.goods" @change="handleRecommend">
        </recommend>

        <!-- 组件 话题 -->
        <topic v-model="showTopicPopup" @change="handleTopic"></topic>
    </view>
</template>

<script>
    import store from '@/store'
    import {
        baseURL,
        version
    } from '@/config/app.js'
    import {
        uploadFile,
        trottle
    } from "@/utils/tools.js"
    import {
        apiCommunityAdd,
        apiCommunityEdit,
        getCommunityRecommendTopic,
        getCommunityDetail,
    } from "@/api/community.js"
    import Recommend from "./components/recommend.vue"
    import Topic from "./components/topic.vue"
    export default {
        components: {
            Recommend,
            Topic
        },
        data() {
            return {
                action: '',
                token: '',
                version: version,

                showRecommendPopup: false,
                showTopicPopup: false,
                
                pageHeight: '',

                fileList: [],
                formData: {
                    id: '',
                    image: [],
                    content: '',
                    shop: [],
                    goods: [],
                    topic_id: ''
                },

                recommendTopic: []
            }
        },
        mounted() {
            this.action = baseURL + '/api/file/formimage';
            this.token = store.getters.token
            this.$toast = trottle(this.$toast, 3000, this)
        },
        onLoad() {
            const options = this.$Route.query;
            if (options.id) {
                this.formData.id = options.id
                this.initCommunityDetail()
            }
            this.initRecommendTopic();
        },
        methods: {
            // 初始化文章详情
            initCommunityDetail() {
                try {
                    getCommunityDetail({
                        id: this.formData.id
                    }).then(res => {
                        if (res.code == 1) {
                            const {
                                id,
                                content,
                                shop_data,
                                goods_data,
                                topic,
                                images
                            } = res.data;
                            this.formData.id = id
                            this.formData.content = content
                            this.formData.shop = shop_data
                            this.formData.goods = goods_data
                            this.formData.topic_id = topic
                            this.formData.image = images.filter(item => {
                                item.url = item.image
                                return 1
                            })
                            this.fileList = JSON.parse(JSON.stringify(this.formData.image))
                        }
                    })
                } catch (err) {
                    this.$nextTick(() => {
                        this.isFirstLoading = false;
                    });
                }
            },
            // 初始化获取推荐话题
            initRecommendTopic() {
                getCommunityRecommendTopic().then(res => {
                    this.recommendTopic = res.data;
                })
            },
            // 上传，不管成不成功都返回数据｜提示
            change(event) {
                this.$toast({
                    title: JSON.parse(event.data).msg
                })
                if (JSON.parse(event.data).code == 1) {
                    this.formData.image.push({
                        url: JSON.parse(event.data).data.uri
                    })
                }
            },
            // 删除一个图片
            remove(event) {
                this.formData.image.splice(event, 1);
            },
            
            showRecommend() {
                this.showRecommendPopup = true
            },
            // 处理宝贝或店铺推荐
            handleRecommend(event) {
                const {
                    type,
                    data
                } = event;
                if (type == 0) {
                    this.formData.goods = data;
                    this.formData.shop = []
                } else {
                    this.formData.goods = [];
                    this.formData.shop = data
                }
            },
            // 处理选择话题
            handleTopic(event) {
                this.formData.topic_id = event;
            },
            onSubmit() {
                let params = {
                    ...this.formData
                }
                params.goods = params.goods.map(item => item.goods_id)
                params.shop = params.shop.map(item => item.id)
                if (params.topic_id != null) params.topic_id = this.formData.topic_id.id
                params.image = this.formData.image.map(item => item.url)
                if (params.id) {
                    this.handleCommunityEdit(params)
                } else {
                    this.handleCommunityAdd(params)
                }
            },
            // 新增
            handleCommunityAdd(params) {
                apiCommunityAdd({
                    ...params
                }).then(res => {
                    this.$toast({
                        title: res.msg
                    })
                    if (res.code == 1) {
                        setTimeout(() => this.$Router.back(), 500)
                    }
                })
            },
            // 编辑
            handleCommunityEdit(params) {
                apiCommunityEdit({
                    ...params
                }).then(res => {
                    this.$toast({
                        title: res.msg
                    })
                    if (res.code == 1) {
                        setTimeout(() => this.$Router.back(), 500)
                    }
                })
            },
            // 处理文字和图片多时滚动条问题
            handleFocus(event) {
                this.pageHeight = event.detail.height * 1.5
                setTimeout(() => {
                    uni.pageScrollTo({
                        scrollTop: 160,
                    })
                }, 50)
                
            }
        }
    }
</script>

<style lang="scss">
    page {
        background-color: #FFFFFF;
    }

    .container {

        .main {
            padding: 20rpx;
            background-color: #FFFFFF;

            // 上传图片
            .uploader-container {
                .uplader-upload {
                    position: relative;
                    width: 160rpx;
                    height: 160rpx;
                    line-height: 160rpx;
                    text-align: center;
                    margin: 11rpx;
                    border: 2px solid #f0f0f0;
                    border-radius: 14rpx;
                    background-color: #f0f0f0;

                    >view {
                        color: #b1b1b1;
                    }
                }
            }

            // 文章内容
            .content {
                padding: 20rpx;
                margin: 10rpx 0;
                border-radius: 10rpx;

                // background: #f8f8f8;
                textarea {
                    width: 100%;
                    min-height: 230rpx;
                }
            }

            .item {
                height: 88rpx;

                .image {
                    width: 40rpx;
                    height: 40rpx;
                }
            }

            // 推荐 宝贝 ｜ 店铺
            .recommend {
                border-bottom: 1px solid #F2F2F2;
            }

            // 标签
            .tags {
                // padding-bottom: 14rpx;
                // border-bottom: 1px solid #F2F2F2;
            }

            .tags text {
                display: inline-block;
                margin-bottom: 10rpx;
                margin-right: 20rpx;
                border-radius: 26rpx;
                padding: 8rpx 24rpx;
            }

            // 标签主题颜色
            .primary-tags text {
                color: $-color-primary;
                margin-bottom: 0;
                background: rgba($-color-primary, .1);
            }

            // 标签主题颜色
            .gary-tags text {
                color: $-color-lighter;
                background: #f4f4f4;
            }
        }

        .footer {
            left: 0%;
            bottom: 50rpx;
            width: 100%;
            padding: 0 24rpx;
            position: fixed;

            .btn {
                height: 84rpx;
                line-height: 84rpx;
                background-color: rgba($-color-primary, .8);
            }
        }
    }
</style>

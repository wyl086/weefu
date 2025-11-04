<template>
    <view class="user-profile">

        <view class="form bg-white m-t-20">

            <view class="form--item bb">
                <view class="label normal nr">签名</view>
                <view class="flex-1">
                    <input type="text" v-model="formData.signature" placeholder="请输入个性签名">
                </view>
            </view>

            <view class="form--item ">
                <view class="label normal nr">背景</view>
                <view class="flex-1">
                    <u-upload @on-change="change" :action="action" :header="{'token': token,'version': version}"
                        deletable :max-count="1" @on-remove="remove" custom-btn :width="264"
                        :height="200" ref="upload" :file-list="fileList" :show-progress="false">
                        <view slot="addBtn" class="uplader-upload" hover-class="slot-btn__hover" hover-stay-time="150">
                            <u-icon size="48" color="#dcdee0" name="camera" />
                            <view class="xs m-t-10">
                                上传背景图
                            </view>
                        </view>
                    </u-upload>
                </view>
            </view>
        </view>

        <view class="footer">
            <button class="bg-primary br60 white lg" @click="onSubmit">确定</button>
        </view>

    </view>
</template>

<script>
    import store from '@/store'
    import {
        baseURL,
        version
    } from '@/config/app.js'
    import {
        uploadFile
    } from "@/utils/tools.js"
    import {
        getCommunitySetting,
        apiCommunitySetSetting
    } from "@/api/community.js"
    export default {
        data() {
            return {
                action: '',
                token: '',
                version: version,

                formData: {
                    signature: '',
                    image: ''
                },
            }
        },
        computed: {
            fileList() {
                const { image } = this.formData;
                return image ? [{url: image}] : []
            }
        },
        onLoad() {
            this.action = baseURL + '/api/file/formimage';
            this.token = store.getters.token
            this.initCommunitySetting()
        },
        methods: {
            // 初始化设置
            initCommunitySetting() {
                getCommunitySetting().then(res => {
                    Object.keys(this.formData).map(item => {
                        this.$set(this.formData, item, res.data[item])
                    })
                    
                })
            },
            // 上传，不管成不成功都返回数据｜提示
            change(event) {
                this.$toast({
                    title: JSON.parse(event.data).msg
                })
                if (JSON.parse(event.data).code == 1) {
                    this.formData.image = JSON.parse(event.data).data.uri
                }
            },
            // 删除
            remove(event) {
                this.formData.image = '';
            },
            // 提交
            onSubmit() {
                apiCommunitySetSetting({
                    ...this.formData
                }).then(res => {
                    this.$toast({
                        title: res.msg
                    })
                    setTimeout(() => this.$Router.back(), 500)
                })
            }
        }
    }
</script>

<style lang="scss">
    .user-profile {

        .bb {
            border-bottom: 1px solid #f2f2f2;
        }

        .form {
            padding-left: 24rpx;

            &--item {
                display: flex;
                padding: 30rpx 0;

                .label {
                    width: 100rpx;
                }
            }
        }

        // 上传图片
        .uplader-upload {
            position: relative;
            width: 264rpx;
            height: 200rpx;
            padding-top: 40rpx;
            text-align: center;
            margin: 11rpx;
            border: 2px dashed #e5e5e5;
            background-color: #FFFFFF;

            >view {
                color: #BBB;
            }
        }

        .footer {
            padding: 50rpx 26rpx;
        }
    }
</style>

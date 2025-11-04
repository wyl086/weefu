<template>
    <u-popup v-model="show" mode="bottom" closeable border-radius="14" safe-area-inset-bottom :duration="100">
        <view class="content-wrapper">
            <!-- 头部 -->
            <u-sticky>
                <view class="sticky">
                    <view class="sticky-title xl normal bold">话题</view>
                    <u-search :hideRight="true" :show-action="true" action-text="取消" :animation="true" @focus="hideRight=false"
                        @blur="hideRight=true" @custom="handleCancel" placeholder="请输入搜索内容" height="64" @change="mescroll.resetUpScroll()"
                        v-model="keyword"></u-search>
                </view>
                
            </u-sticky>
            
            <!-- 内容 -->
            <view class="container">
                <!-- 左侧菜单 -->
                <scroll-view scroll-y="true" class="left-menu">
                    <block v-for="(menuItem, menuIndex) in topicData" :key="menuIndex">
                        <view class="submenu normal" :class="{'active': menuIndex === menuCurrentIndex}" @click="selectMenu(menuIndex)">{{ menuItem.name }}</view>
                    </block>
                </scroll-view>
                
                <!-- 右侧内容 -->
                <view class="right-content">
                    <mescroll-uni ref="mescrollRef" top="0" height="712rpx" bgColor="#f5f5f5" @init="mescrollInit" @down="downCallback"
                        @up="upCallback" :down="downOption" :up="upOption">
                    
                        <view class="tags">
                            
                            <view class="tags-item flex" @click="unSelectTopic">
                                <u-image width="120" height="120" :src="'/bundle_b/static/icon_unselect_tags.png'" borderRadius="50%"></u-image>
                                <text class="m-l-16 nr bold normal">不添加任何话题</text>
                            </view>
                            
                            <template v-if="topicData[menuCurrentIndex]">
                                <block v-for="(topicItem, topicIndex) in topicData[menuCurrentIndex].topic" :key="topicIndex">
                                    <view class="tags-item flex" @click="selectTopic(topicItem)">
                                        <image :src="topicItem.image" mode="aspectFill"></image>
                                        <view class="m-l-16">
                                            <view class="nr bold normal">{{ topicItem.name }}</view>
                                            <view class="m-t-10 xxs muted">{{ topicItem.click }}人在看</view>
                                        </view>
                                    </view>
                                </block>
                            </template>
                            
                        </view>
                    
                    </mescroll-uni>
                </view>
            </view>
        </view>
    </u-popup>
</template>

<script>
    import { getCommunityTopicLists } from "@/api/community.js"
    import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
    import MescrollMoreItemMixin from "@/components/mescroll-uni/mixins/mescroll-more-item.js";
    export default {
        mixins: [MescrollMixin, MescrollMoreItemMixin],
        name: "topic",
        props: {
            value: {
                type: Boolean
            },
        },
        data() {
            return {
                keyword: '',
                hideRight: true,
                menuCurrentIndex: 0,
                topicData: []
            }
        },
        computed: {
        	// 弹窗Popup显示状态
        	show: {
        		get: function() {
        			return this.value
        		},
        		set: function(value) {
                    // #ifdef H5
                    this.$nextTick(() => {
                        this.mescroll.resetUpScroll()
                    })
                    // #endif
        			this.$emit('input', value)
        		}
        	}
        },
        methods: {
            handleCancel() {
                this.keyword = '';
                this.mescroll.resetUpScroll()
            },
            // 选择菜单
            selectMenu(index) {
                this.menuCurrentIndex = index
            },
            // 选择话题
            selectTopic(item) {
        		this.$emit('input', false)
                this.$emit('change', item)
            },
            // 不选择话题
            unSelectTopic() {
        		this.$emit('input', false)
                this.$emit('change', '')
            },
            // 获取
            async upCallback(page) {            
                getCommunityTopicLists({
                    name: this.keyword,
                }).then(res => {
                    this.topicData = res.data
                    this.mescroll.endSuccess(10, 0);
                }).catch((err) => {
                    this.mescroll.endErr()
                })
            },
        }
    }
</script>

<style lang="scss" scoped>
    .bb {
        border-bottom: 1px solid $-color-body;
    }

    .content-wrapper {
        height: 900rpx;
        
        .sticky {
            width: 100vw;
        }
        
        .sticky-title {
            padding: 24rpx 0;
            text-align: center;
        }
        
        .container {
            height: 712rpx;
            display: flex;
            
            // 左侧菜单
            .left-menu {
                width: 160rpx;
                .submenu {
                    height: 90rpx;
                    line-height: 90rpx;
                    text-align: center;
                    font-size: 26rpx;
                }
                
                // 菜单选中
                .active {
                    font-weight: 500;
                    color: $-color-primary;
                    position: relative;
                    background-color: rgba($-color-primary, 0.1);
                }
                .active::before {
                    content: '';
                    width: 6rpx;
                    height: 30rpx;
                    position: absolute;
                    left: 10rpx;
                    top: 50%;
                    transform: translateY(-50%);
                    background-color: $-color-primary;
                }
            }
        
            // 右侧内容
            .right-content {
                width: 100%;
                .tags {
                    padding: 20rpx;
                    .tags-item {
                        margin-bottom: 30rpx;
                    }
                    
                    image {
                        width: 120rpx;
                        height: 120rpx;
                        border-radius: 50%;
                        position: relative;
                    }
                    
                    image::after {
                        content: '';
                        color: #FFFFFF;
                        font-size: 50rpx;
                        font-weight: 500;
                        text-align: center;
                        line-height: 120rpx;
                        width: 120rpx;
                        height: 120rpx;
                        position: absolute;
                        border-radius: 50%;
                        left: 0;
                        top: 0;
                        background: rgba(0, 0, 0, 0.1) url('/bundle_b/static/icon_tags.png') no-repeat center center;
                        background-size: 40rpx;
                    }
                }
            }
        }
    }
</style>

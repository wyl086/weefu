<template>
    <view class="explore">
        <!-- 搜索 -->
        <view>
            <router-link
            	:to="{path: '/bundle_b/pages/community_search/community_search'}">
                <u-search disabled
                    placeholder="请输入搜索内容" height="64"
                    ></u-search>
            </router-link>
        </view>

        <view class="content">
            <tabs :current="current" @change="changeTabs" height="100" >
                <tab v-for="(item, index) in tabList" :key="index" :name="item.name">
                    <lists :cateId="item.id" :i="index" :index="current"></lists>
                </tab>
            </tabs>
        </view>
    </view>
</template>

<script>
    import {
        getCommunityCate,
        getCommunityArticleLists
    } from '@/api/community.js';
    import Lists from "./lists.vue"
    export default {
        components: {
            Lists
        },
        data() {
            return {
                tabList: [{
                    name: '全部',
                    id: ''
                }],
                current: 0
            }
        },
        created() {
            this.initRecommendTopic()
        },
        methods: {
            initMescroll(event) {
                this.isInit = true; // 标记为true
                this.mescroll = event;
            },
            handleCancel() {
                this.keyword = '';
            },
            // 切换标签导航
            changeTabs(event) {
                this.current = event;
            },
            // 初始化获取话题
            initRecommendTopic() {
                getCommunityCate().then(res => {
                    if( res.code === 1 ) {
                        this.tabList = [{
                            name: '全部',
                            id: ''
                        }, ...res.data]
                    } else {
                        this.$toast({ title: res.msg })
                    }
                })
            },
            
        }
    }
</script>

<style lang="scss" scoped>
    .explore {
        
        // pb
        .content {
            height: calc(100vh - 92px - var(--window-bottom));
            overflow: hidden;
        }
    }
</style>

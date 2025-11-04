<template>
    <view>
        <view v-if="lists.length"> 
            <u-waterfall ref="uWaterfall" v-model="lists" :add-time="50">
                <template v-slot:left="{leftList}">
                    <view style="padding:0 9rpx 0 30rpx">
                        <community-list width="336rpx" type="works" :list="leftList"></community-list>
                    </view>
                </template>
                <template v-slot:right="{rightList}">
                    <view style="padding:0 30rpx 0 9rpx;">
                        <community-list width="336rpx" type="works" :list="rightList"></community-list>
                    </view>
                </template>
            </u-waterfall>
        </view>
        <view class="p-t-60" v-else>
            <view class="flex row-center m-t-40">
                <u-image width="300" height="300" :src="'/bundle_b/static/works_null.png'"></u-image>
            </view>
            <view class="text-center muted m-t-40">
                暂未发布作品哦～
            </view>
        </view>
    </view>
</template>

<script>
    import {
        getCommunityWorksLists
    } from "@/api/community.js"
    export default {
        name: 'community-works',
        props: {
            userId: {
                type: Number
            },
            worksNum: {
                type: Number
            }
        },
        data() {
            return {
                lists: [],
                page: 1,
                more: 1,
                pageSize: 10
            }
        },
        watch: {
            worksNum: {
                handler(value) {
                    if( this.more ) {
                        this.getCommunityWorks()
                    }
                },
                immediate: true
            }
        },
        mounted() {
            uni.$on('changeItem', (event) => {
                const index = this.lists.findIndex(el => el.id == event.id)
                if (index == -1) return
                this.$refs.uWaterfall.modify(event.id, 'like', event.like)
                this.$refs.uWaterfall.modify(event.id, 'is_like', event.is_like)
            })
        },
        methods: {
            // 获取
            getCommunityWorks() {
                getCommunityWorksLists({
                    user_id: this.userId,
                    page_no: this.page,
                    page_size: this.pageSize,
                }).then(res => {
                    if( res.code == 1 ) {
                        // 如果是第一页需手动置空列表
                        if (this.page == 1) {
                            if('uWaterfall' in this.$refs) this.$refs.uWaterfall.clear()
                            this.lists = []
                        }
                        if (res.data.more === 1) {
                            this.page += 1
                        }
                        this.more = res.data.more;
                        // 异步：让vue能够监听到数据改变过了
                        setTimeout(() => {
                            this.lists = [...this.lists, ...res.data.list]
                        }, 0)
                    } else {
                        this.$toast({ title: res.msg })
                    }
                })
            },
        }
    }
</script>

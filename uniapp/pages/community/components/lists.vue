<template>
    <view class="">
        <mescroll-uni ref="mescrollRef" top="0" bottom="200rpx" :height="height" @init="mescrollInit"
            @down="downCallback" @up="upCallback" :down="downOption" :up="upOption">
            <u-waterfall ref="uWaterfall" v-model="lists" :add-time="50">
                <template v-slot:left="{leftList}">
                    <view style="padding:0 9rpx 0 30rpx">
                        <community-list width="336rpx" type="waterfall" :list="leftList"></community-list>
                    </view>
                </template>
                <template v-slot:right="{rightList}">
                    <view style="padding:0 30rpx 0 9rpx;">
                        <community-list width="336rpx" type="waterfall" :list="rightList"></community-list>
                    </view>
                </template>
            </u-waterfall>
        </mescroll-uni>
    </view>
</template>

<script>
    import {
        getCommunityArticleLists
    } from '@/api/community.js';
    import {
        trottle
    } from "@/utils/tools.js"
    import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
    import MescrollMoreItemMixin from "@/components/mescroll-uni/mixins/mescroll-more-item.js";
    export default {
        mixins: [MescrollMixin, MescrollMoreItemMixin],
        props: {
            cateId: {
                type: [String, Number]
            }
        },
        data() {
            return {
                height: '',
                upOption: {
                    empty: {
                        icon: '/static/images/news_null.png',
                        tip: '暂无任何内容...', // 提示
                        fixed: true,
                        top: "0",
                    }
                },
                lists: []
            }
        },
        mounted() {
            uni.$on('changeItem', (event) => {
                const index = this.lists.findIndex(el => el.id == event.id)
                if (index == -1) return
                this.$refs.uWaterfall.modify(event.id, 'like', event.like)
                this.$refs.uWaterfall.modify(event.id, 'is_like', event.is_like)
            })

            uni.getSystemInfo({
                success: (res) => {
                    this.height = res.windowHeight - 46 + 'px';
                }
            });
        },
        methods: {
            // 获取
            async upCallback(page) {
                const pageNum = page.num
                const pageSize = page.size

                getCommunityArticleLists({
                    cate_id: this.cateId,
                    page_no: pageNum,
                    page_size: pageSize,
                }).then(res => {
                    // 如果是第一页需手动置空列表
                    if (pageNum == 1) {
                        this.$refs.uWaterfall.clear()
                        this.lists = []
                    }
                    // 重置列表数据
                    const hasNext = !!res.data.more;
                    // 异步：让vue能够监听到数据改变过了
                    
                    // has_new 是通知父组件将关注右上角的是否新更新小点显示或隐藏
                    uni.$emit('hasNew', res.data.has_new)
                    
                    setTimeout(() => {
                        this.lists = [...this.lists, ...res.data.list]
                    }, 0)
                    this.mescroll.endSuccess(res.data.list.length, hasNext);
                })
            }
        }
    }
</script>

<style>
</style>

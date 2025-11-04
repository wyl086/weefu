<template>
    <view class="goods-bargain-container">
        <view class="row-center" style="height: 100rpx;">
            <view class="bLine" />
            <view class="lg bold" style="margin: 0 30rpx;">
                更多砍价商品
            </view>
            <view class="bLine" />
        </view>
        <goods-list type="double" :list="lists" :isBargain="true"></goods-list>
    </view>
</template>

<script>
    import {
        getBargainList
    } from '@/api/activity'
    import {
        loadingType
    } from '@/utils/type'
    import {
        loadingFun
    } from '@/utils/tools'
    export default {
        data() {
            return {
                page: 1,
                loadingStatus: loadingType.LOADING,
                lists: []
            }
        },
        mounted() {
            this.$getBargainList()
            console.log(this.lists);
        },
        methods: {
            $getBargainList() {
                console.log('下拉')
            	getBargainList({
            		page_size:10,
            		page_no:1
            	}).then(res => {
                    console.log(res)
                    // this.page = res.data.page;
                    this.lists = res.data.list;
                    console.log(this.lists)
                    // this.loadingStatus = res.status
            	})
            }
        }
    }
</script>

<style lang="scss">
    .goods-bargain-container {
        padding-bottom: 40rpx;

        .bLine {
            height: 2rpx;
            background-color: #CCCCCC;
            width: 58rpx;
        }
    }
</style>

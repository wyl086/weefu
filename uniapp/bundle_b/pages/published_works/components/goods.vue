<template>
    <view class="goods-box">
        <view class="search">
            <u-search :hideRight="true" :show-action="true" action-text="取消" :animation="true" @focus="hideRight=false"
                @blur="hideRight=true" @custom="handleCancel" placeholder="请输入搜索内容" height="64" @change="mescroll.resetUpScroll()"
                v-model="keyword"></u-search>
        </view>
        <view class="tab-control">
            <view v-for="(item, index) in tabsList" :key="index" :class="{'active': currentTabs == index}"
                @click="changeTabs(index)">{{ item.label }}</view>
        </view>

        <mescroll-uni ref="mescrollRef" top="0" height="620rpx" @init="mescrollInit" @down="downCallback"
            @up="upCallback" :down="downOption" :up="upOption">

            <block v-for="(goodsItem, index) in lists" :key="index">
                <view class="goods-item flex row-between" @click="selectCurrentGoods(goodsItem)">
                    <u-image :src="goodsItem.image" width="160" height="160"></u-image>
                    <view class="m-l-20 flex-1">
                        <view class="goods-name line-1 m-b-12 nr normal">{{ goodsItem.goods_name }}</view>
                        <view class="m-b-16 muted sm">{{ goodsItem.shop_name }}</view>
                        <price-format :subscript-size="32" :first-size="32" :second-size="32"
                            :price="goodsItem.goods_price" :color="colorConfig.primary"></price-format>
                    </view>
                    <image :src="getCurrentSelect(goodsItem)"></image>
                </view>
            </block>

        </mescroll-uni>
    </view>
</template>
<script>
    import {
        getCommunityGoods
    } from '@/api/community.js';
    import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
    import MescrollMoreItemMixin from "@/components/mescroll-uni/mixins/mescroll-more-item.js";
    export default {
        mixins: [MescrollMixin, MescrollMoreItemMixin],
        props: {
            value: {
                type: [Object, Array]
            }
        },
        data() {
            return {
                keyword: '',
                hideRight: true,

                height: '', // 高度
                upOption: {
                    empty: {
                        icon: '/static/images/goods_null.png',
                        tip: '暂无商品！', // 提示
                        fixed: true,
                        top: "0",
                    }
                },

                tabsList: [{
                    label: '全部',
                    type: 'all'
                }, {
                    label:  '已购宝贝',
                    type: 'buy'
                }],
                currentTabs: 0,

                lists: [],

                selectData: []
            }
        },
        computed: {
            getCurrentSelect() {
                return (row) => {
                    return this.selectData.filter(item => item.goods_id == row.goods_id || item.id == row.goods_id).length ? '/bundle_b/static/icon_select.png' :
                        '/bundle_b/static/icon_unselect.png'
                }
            }
        },
        watch: {
            value: {
                handler(val) {
                    console.log(val)
                    this.selectData = val
                },
                immediate: true
            }
        },
        methods: {
            handleCancel() {
                this.keyword = '';
                this.mescroll.resetUpScroll()
            },
            // 切换标签导航
            changeTabs(event) {
                this.currentTabs = event;
                uni.showLoading({title: '加载中'})
                this.mescroll.resetUpScroll()
            },
            // 选择当前商品
            selectCurrentGoods(event) {
                const index = this.selectData.findIndex(item => item.goods_id == event.goods_id || item.id == event.goods_id)
                if (index === -1) this.selectData = [...this.selectData, event]
                else this.selectData.splice(index, 1)
                this.$emit('change', this.selectData)
            },
            // 获取
            async upCallback(page) {
                const index = this.currentTabs;
                const pageNum = page.num
                const pageSize = page.size

                getCommunityGoods({
                    keyword: this.keyword,
                    type: this.tabsList[index].type,
                    page_no: pageNum,
                    page_size: pageSize,
                }).then(res => {
                    uni.hideLoading()
                    // 如果是第一页需手动置空列表
                    if (pageNum == 1 || this.keyword) this.lists = []
                    // 重置列表数据
                    const hasNext = !!res.data.more;
                    this.lists = [...this.lists, ...res.data.list]
                    this.mescroll.endSuccess(res.data.list.length, hasNext);
                }).catch((err) => {
                    this.mescroll.endErr()
                    uni.hideLoading()
                })
            },
        }
    }
</script>

<style lang="scss" scoped>
    .goods-box {
        width: 100%;
        height: 700rpx;

        .search {
            width: 100%;
            height: 90rpx;
        }

        .tab-control {
            border-top: 1px solid $-color-body;
            border-bottom: 1px solid $-color-body;

            view {
                width: 200rpx;
                height: 90rpx;
                text-align: center;
                line-height: 90rpx;
                display: inline-block;
                color: $-color-normal;
                transition: all .2s;
            }

            .active {
                color: $-color-primary;
            }
        }

        .goods-item {
            padding: 20rpx;
            border-bottom: 1px solid $-color-body;

            .goods-name {
                width: 460rpx;
            }

            image {
                width: 34rpx;
                height: 34rpx;
            }
        }
    }
</style>

<template>
    <mescroll-uni ref="mescrollRef" top="80rpx" @down="downCallback" @up="upCallback" :down="downOption" :up="upOption">
        <view class="group-list">
            <navigator v-for="(item, index) in groupList" :key="index" class="item bg-white mt20" hover-class="none"
                :url="'/bundle/pages/order_details/order_details?id=' + item.order_id">
                <view class="group-header row-between">
                    <view>
                        <view v-if="item.team_end_time">{{item.team_end_time}}</view>
                        <view v-else>
                            <view class="row" v-if="getTeamCountTime(item) >= 0">
                                <view class="sm mr10">{{item.shop_name}}</view>
                               <!-- <u-count-down :timestamp="getTeamCountTime(item)" color="#fff" bg-color="#FF2C3C"
                                    separator-color="#FF2C3C" font-size="24" height="36" separator-size="26"
                                    @end="reflesh"></u-count-down> -->
                            </view>
                        </view>
                    </view>
                    <view :class="item.status == 2 ? 'muted' : 'primary'">{{getGroupStatus(item.status)}}
                    </view>
                </view>
                <view class="group-con">
                    <view v-if="item.identity_text" class="team-chief xs white">{{item.identity_text}}</view>
                    <order-goods :team="{need: item.need}"
                        :list="[{people_num: item.people_num,name: item.name, spec_value_str: item.spec_value_str,image: item.image,goods_num: item.count, goods_id: item.goods_id, goods_price: item.order_amount}]">
                    </order-goods>
                    <view class="all-price row-end">
                        <text class="muted xs">共{{item.count}}件商品，总金额：</text>
                        <price-format show-subscript :subscript-size="30" :first-size="30" :second-size="30"
                            :price="item.order_amount"></price-format>
                    </view>
                </view>
                <view class="group-footer row" v-if="item.pay_status == 0">
                    <view style="flex: 1"></view>
                    <view>
                        <navigator v-if="item.pay_status == 0" hover-class="none"
                            :url="'/pages/order_details/order_details?id=' + item.order_id">
                            <button size="sm" class="br60 lighter btn" type="primary" hover-class="none">
                                去付款
                            </button>
                        </navigator>
                    </view>
                </view>
            </navigator>
        </view>
    </mescroll-uni>
</template>


<script>
    import {getUserGroup} from '@/api/activity';
    import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
    import MescrollMoreItemMixin from "@/components/mescroll-uni/mixins/mescroll-more-item.js";
    export default {
        mixins: [MescrollMixin, MescrollMoreItemMixin],
        data() {
            return {
                groupList: [],
                downOption: {
                    auto: false // 不自动加载 (mixin已处理第一个tab触发downCallback)
                },
                upOption: {
                    auto: true, // 不自动加载
                    noMoreSize: 1, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
                    empty: {
                        icon: '/static/images/goods_null.png',
                        tip: '暂无拼团~', // 提示
                        fixed: true
                    }
                },
            };
        },

        props: {
            groupType: {
                type: Number
            }
        },
        
        mounted() {
            // this.$getUserGroup();
        },
        
        methods: {
            // 触底加载
            upCallback(page) {
                this.$getUserGroup(page.num, page.size);
            },
            $getUserGroup(pageNum = 1, pageSize = 10) {
                let {groupType} = this;

                getUserGroup({
                    'type': groupType,
                    'page_no': pageNum,
                    'page_size': pageSize
                }).then(res => {
                    if (res) {
                        let curPageData = res.data.list;
                        let curPageLen = curPageData.length;
                        let hasNext = !!res.data.more;
                        if (pageNum == 1) this.lists = [];
                        console.log(hasNext)
                        this.groupList = this.lists.concat(curPageData);
                        this.mescroll.endSuccess(curPageLen, hasNext);
                    }
                }).catch(() => {
                    this.mescroll.endErr()
                })
            }
        },
        computed: {
            // 计算属性，如果拼团状态等于某个值就返回某个值的文字状态
            getGroupStatus() {
                return (status) => {
                    var text = ''
                    switch (status) {
                        case 0:
                            text = '拼团中';
                            break;
                        case 1:
                            text = '拼团成功';
                            break;
                        case 2:
                            text = '拼团失败';
                            break;
                    }
                    return text
                }
            },
            getTeamCountTime() {
                return (item) => item.count_time = Math.min(item.found_end_time, item.end_time) - Date.now() / 1000
            }
        }
    };
</script>
<style lang="scss">
    @import  '@/styles/base.scss';
    
    .group-list {
        min-height: calc(100vh - 80rpx);
        padding: 0 20rpx;
        overflow: hidden;

        .item {
            border-radius: 10rpx;
            position: relative;

            .group-header {
                height: 80rpx;
                padding: 0 24rpx;
                border-bottom: 1px dotted #E5E5E5;
            }

            .team-chief {
                position: absolute;
                z-index: 100;
                top: 105rpx;
                padding: 4rpx 20rpx;
                border-radius: 0 60rpx 60rpx 0;
                background: linear-gradient(87deg, #F95F2F 0%, #FF2C3C 100%);
            }

            .all-price {
                text-align: right;
                padding: 0 24rpx 20rpx;
            }

            .group-footer {
                height: 100rpx;
                border-top: $-solid-border;
                padding: 0 24rpx;

                .btn {
                    width: 244rpx;
                }
            }
        }
    }
</style>

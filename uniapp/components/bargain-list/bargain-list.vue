<template>
    <mescroll-uni ref="mescrollRef" top="80rpx" @down="downCallback" @up="upCallback" :down="downOption" :up="upOption">
        <view class="bargain-list-container">
            <view class="bargain-list mt20" v-for="(item, index) in lists" :key="item.id">
                <view class="header row-between">
                    <view class="count-down-container row">
                        <text class="muted xs" style="margin-left: 8rpx;">{{item.shop_name}}</text>
                    </view>
                    <view class="primary sm">
                        {{item.status_text}}
                    </view>
                </view>
                <navigator class="content row" hover-class="none"
                    :url="'/pages/bundle/bargain_process/bargain_process?bargainId='+item.id">
                    <custom-image width="180rpx" height="180rpx" :src="item.image" radius="10rpx" />
                    <view class="goods-info">
                        <view class="goods-name line2 nr normal">
                            {{item.name}}
                        </view>
                        <view class="mt10 row">
                            <view class="sm primary">
                                已砍至<text class="sm" style="font-weight: 500;line-height: 48rpx;">￥<text
                                        class="xl">{{item.current_price}}</text></text>
                            </view>
                            <view class="xs muted ml20">
                                原价<text style="text-decoration: line-through;"> ¥{{item.price}}</text>
                            </view>
                        </view>
                        <view class="xxs" style="color: #FFA200;line-height: 30rpx;margin-top: 4rpx;">
                            {{item.bargain_tips}}
                        </view>
                    </view>
                </navigator>
                <view class="footer row-between">
                    <!--                <view hover-class="none" class="purchase-btn primary row-center br60 footer-btn" v-if="item.buy_btn" @click="onPurchaseClick(item.id, item.item_id)">
                    直接购买
                </view> -->
                    <view class="count-down-container row">
                        <text class="muted xs" style="margin-left: 8rpx;">发起时间：{{item.create_time}}</text>
                    </view>
                
                    <navigator hover-class="none"
                        :url="'/bundle/pages/bargain_process/bargain_process?bargainId='+item.id"
                        class="bargain-btn footer-btn white row-center br60" v-if="item.btn_tips != ''">
                        {{item.btn_tips}}
                    </navigator>
                    <!--  navigator hover-class="none" class="bargain-btn white row-center br60 footer-btn" v-if="item.pay_btn" :url="'/pages/order_details/order_details?id=' + item.order_id">
                    去支付
                </navigator> -->
                </view>
            </view>
        </view>
    </mescroll-uni>
</template>

<script>
    import {getBargainActivityList} from "@/api/activity"
    import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
    import MescrollMoreItemMixin from "@/components/mescroll-uni/mixins/mescroll-more-item.js";
    export default {
        mixins: [MescrollMixin, MescrollMoreItemMixin],
        data() {
            return {
                lists: [],
                downOption: {
                    auto: false // 不自动加载 (mixin已处理第一个tab触发downCallback)
                },
                upOption: {
                    auto: true, // 不自动加载
                    noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
                    empty: {
                        icon: '/static/images/goods_null.png',
                        tip: '暂无砍价记录~', // 提示
                        fixed: true
                    }
                },
            }
        },
        props: {
            bargainType: {
                type: Number,
                default: -1
            }
        },
        mounted() {
            this.$getBargainActivityList()
        },
        methods: {
            // 触底加载
            upCallback(page) {
                this.$getBargainActivityList(page.num, page.size);
            },
            $getBargainActivityList(pageNum = 1, pageSize = 10) {
                let {bargainType} = this;

                getBargainActivityList({
                    'type': bargainType,
                    'page_no': pageNum,
                    'page_size': pageSize
                }).then(res => {
                    if (res) {
                        let curPageData = res.data.list;
                        let curPageLen = curPageData.length;
                        let hasNext = !!res.data.more;
                        if (pageNum == 1) this.lists = [];
                        console.log(hasNext)
                        this.lists = this.lists.concat(curPageData);
                        this.mescroll.endSuccess(curPageLen, hasNext);
                    }
                }).catch(() => {
					this.mescroll.endErr()
				})
            }
        }
    }
</script>

<style lang="scss">
    @import '@/styles/base.scss';

    .bargain-list-container {
        .bargain-list {
            background-color: $-color-white;

            .header {
                height: 80rpx;
                padding: 20rpx 20rpx;
            }

            .content {
                padding: 30rpx 24rpx 18rpx;

                .goods-info {
                    margin-left: 24rpx;
                    flex: 1;

                    .goods-name {
                        line-height: 40rpx;
                    }
                }
            }

            .footer {
                padding: 19rpx 24rpx;

                .bargain-btn {
                    // 继续砍价 按钮
                    height: 62rpx;
                    padding: 0 44rpx;
                    background-color: $-color-primary;
                }

                .purchase-btn {
                    // 直接购买
                    height: 62rpx;
                    padding: 0 44rpx;
                    background-color: rgba(255, 44, 60, 0.1);
                }

                .footer-btn {
                    &:not(:last-child) {
                        margin-right: 20rpx;
                    }
                }
            }
        }

        .data-null {
            margin-top: 150rpx;
        }
    }
</style>

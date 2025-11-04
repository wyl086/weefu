<template>
    <mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :up="{use: false}">
        <view class="index">
            <view class="index-wrap">
                <!-- Header -->
                <view class="index-header flex row-between">
                    <view class="md" style="font-weight: 400;">Hi，{{pagesData.shop_name||'-'}}</view>
                    <view class="xs">{{time}}</view>
                </view>

                <!-- Section -->
                <view style="height: 130vh;"></view>
                <view class="index-section">
                    <!-- Section today Data -->
                    <view class="today-data flex">
                        <block v-for="(item, index) in todayObj" :key="index">
                            <view class="item-data">
                                <view>{{item.name}}</view>
                                <view>{{item.val}}</view>
                            </view>
                        </block>
                    </view>
					
					<view class="today-data flex m-t-30">
					    <block v-for="(item, index) in orderObj" :key="index">
					        <view class="item-data">
					            <view>{{item.name}}</view>
					            <view>{{item.val}}</view>
					        </view>
					    </block>
					</view>
					
					<view class="">
						<navigator url="/pages/verification_order/verification_order" hover-class="none">
							<button class="btn solid br60 flex row-center normal"
							    >核销订单</button>
						</navigator>
					</view>

                    <!-- Section turnover echarts Data -->
                    <view class="e-data m-t-30">
                        <view class="e-title">营业额趋势图</view>

                        <view class="e-content m-t-20">
                            <charts ids="canvasColumn" width="100%" height="544rpx" :chartData="turnoverData"></charts>
                        </view>
                    </view>

                    <!-- Section visit echarts Data -->
                    <view class="e-data m-t-30 m-b-50">
                        <view class="e-title">进店人数趋势图</view>

                        <view class="e-content m-t-20">
                            <charts ids="canvasColumn2" width="100%" height="544rpx" :chartData="visitData"></charts>
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </mescroll-body>
</template>
<script>
    import {
        apiIndex
    } from '@/api/store'

    import {
        apiVisit
    } from '@/api/app'
    import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins";
    export default {
        mixins: [MescrollMixin,],
        data() {
            return {
                pagesData: [],
                loading: true,

                time: '',

                todayObj: [{
                        name: '今日营业额',
                        val: '0.00'
                    },
                    {
                        name: '今日成交订单',
                        val: '0'
                    },
                    {
                        name: '今日进店人数',
                        val: '0'
                    },
                ],
				orderObj: [{
				        name: '自提订单',
				        val: '0.00'
				    },
				    {
				        name: '待核销',
				        val: '0'
				    },
				    {
				        name: '已核销',
				        val: '0'
				    },
				],

                turnoverData: {},

                visitData: {},
            }
        },

        methods: {
            async downCallback() {
            	await this.getPageInfo()
            	this.mescroll.endSuccess(0, false)
            },
            
            async getPageInfo() {
                const res = await apiIndex()
                this.todayObj[0].val = res.order_amount
                this.todayObj[1].val = res.order_num
                this.todayObj[2].val = res.shop_user
				
				this.orderObj[0].val = res.self_order
				this.orderObj[1].val = res.is_verification
				this.orderObj[2].val = res.no_verification
                const turnover = {
                    categories: res.dates,
                    series: [{
                        "name": "营业额",
                        data: res.echarts_order_amount
                    }]
                }
                const visit = {
                    categories: res.dates,
                    series: [{
                        "name": "进店人数",
                        data: res.echarts_user_visit
                    }]
                }
                this.turnoverData = turnover
                this.visitData = visit
                this.pagesData = res;
            },

            showTime() {
                var d = new Date();
                var year = d.getFullYear();
                var month = d.getMonth() + 1; //0~11
                var date = d.getDate();

                var hour = Number(d.getHours()) <=9 ? '0'+Number(d.getHours()):Number(d.getHours());
                var min = Number(d.getMinutes()) <=9 ? '0'+Number(d.getMinutes()):Number(d.getMinutes());
                var sec = Number(d.getSeconds()) <=9 ? '0'+ Number(d.getSeconds()):Number(d.getSeconds());

                var str = year + '-' + month + '-' + date + "  " + hour + ":" + min + ":" + sec;
                this.time = str
            }
        },
        onLoad() {
            setInterval(this.showTime, 1000)
        },
    }
</script>

<style lang="scss">
    .index {
        overflow: hidden;

        &-wrap {

            // 头部
            .index-header {
                color: $-color-white;
                padding: 30rpx 24rpx;
                background-repeat: no-repeat;
                background-size: 100% 100rpx;
                background-color: #40AFFA;
                padding-bottom: 200rpx;
            }

            .index-section {
                padding: 0 24rpx;
                width: 100%;
                position: absolute;
                top: 100rpx;

                // 今日数据卡片
                .today-data {
                    padding: 60rpx 30rpx 40rpx 30rpx;
                    border-radius: 14rpx;
                    background-color: $-color-white;

                    .item-data {
                        width: 220rpx;

                        view:first-child {
                            color: $-color-muted;
                            font-size: 24rpx;
                        }

                        view:last-child {
                            color: $-color-normal;
                            font-size: 44rpx;
                            font-weight: 500;
                            margin-top: 6rpx;
                            height: 50px;
                            word-wrap: break-word;
                            word-break: break-all;
                        }
                    }

                    .item-data:first-child {
                        width: 260rpx !important;
                    }
                }
				
				.btn {
					margin: 30rpx 0;
				    margin-top: 20rpx;
				    height: 88rpx;
					color: $-color-white;
				    font-size: $-font-size-lg;
					background-color: $-color-primary;
				}

                // 数据图
                .e-data {
                    .e-title {
                        font-size: 30rpx;
                        font-weight: 500;
                    }

                    .e-content {
                        padding: 20rpx 0;
                        border-radius: 14rpx;
                        background-color: $-color-white;
                    }
                }
            }
        }
    }
</style>

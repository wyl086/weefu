<template>
    <view class="invoice-detail">
        
        <!-- Header Start -->
        <view class="header white text-center flex-col row-center">
            <view class="flex row-center lg bold">
                <image v-if="!invoiceInfo.status" src="../../static/invoice_wait.png" mode=""></image>
                <image v-else src="../../static/invoice_success.png" mode=""></image>
                {{ invoiceInfo.status_text || '' }}
            </view>
            <view class="sm m-t-10" v-if="!invoiceInfo.status">正在开具发票中，请耐心等候…</view>
            <view class="sm m-t-10" v-else>已开发票金额：{{ invoiceInfo.invoice_amount }}</view>
        </view>
        <!-- Header End -->
        
        <!-- Main Start -->
        <view class="main">
            <view class="card bg-white">
                <view class="lg bold p-l-30 p-b-18">发票信息</view>
                
                <view class="form-item">
                    <view class="label">发票金额</view>
                    <view class="content">{{ invoiceInfo.invoice_amount || '' }}</view>
                </view>
                
                <view class="form-item">
                    <view class="label">发票类型</view>
                    <view class="content">{{ invoiceInfo.type == 0 ? '普通' : '专用' }}</view>
                </view>
                
                <view class="form-item">
                    <view class="label">抬头类型</view>
                    <view class="content">{{ invoiceInfo.header_type_text }}</view>
                </view>
                
                <view class="form-item">
                    <view class="label">抬头名称</view>
                    <view class="content">{{ invoiceInfo.name || '' }}</view>
                </view>
                
                <view class="form-item" v-if="invoiceInfo.duty_number">
                    <view class="label">税号</view>
                    <view class="content">{{ invoiceInfo.duty_number || '' }}</view>
                </view>
                
                <view class="form-item">
                    <view class="label">邮箱</view>
                    <view class="content">{{ invoiceInfo.email || '' }}</view>
                </view>
                
                <view class="form-item" v-if="invoiceInfo.address">
                    <view class="label">企业地址</view>
                    <view class="content">{{ invoiceInfo.address || '' }}</view>
                </view>
                
                <view class="form-item" v-if="invoiceInfo.mobile">
                    <view class="label">企业电话</view>
                    <view class="content">{{ invoiceInfo.mobile || '' }}</view>
                </view>
                
                <view class="form-item" v-if="invoiceInfo.bank">
                    <view class="label">开户银行</view>
                    <view class="content">{{ invoiceInfo.bank || '' }}</view>
                </view>
                
                <view class="form-item" v-if="invoiceInfo.bank_account">
                    <view class="label">银行账号</view>
                    <view class="content">{{ invoiceInfo.bank_account || '' }}</view>
                </view>
                
                <view class="form-item">
                    <view class="label">申请时间</view>
                    <view class="content">{{ invoiceInfo.create_time || '' }}</view>
                </view>
            </view>
            
            <view class="card bg-white m-t-20">
                <view class="m-l-20">
                    <shop-title :shop="shopInfo" :is-link="false"></shop-title>
                </view>
                <order-goods :list="goodsInfo"></order-goods>
                
                <view class="form-item">
                    <view class="label">订单状态</view>
                    <view class="content">{{ order_status_text }}</view>
                </view>
                
                <view class="form-item">
                    <view class="label">订单编号</view>
                    <view class="content">{{ order_sn }}</view>
                </view>
                
                <view class="form-item">
                    <view class="label">下单时间</view>
                    <view class="content">{{ create_time }}</view>
                </view>
            </view>
        </view>
        <!-- Main End -->
        
        <!-- Footer Start -->
        <view class="footer" v-if="!invoiceInfo.status">
            <view class="btn br60">
                <button class="btn br60" size="lg" @click="toEditInvoice">编辑发票</button>
            </view>
        </view>
        <!-- Footer End -->
    </view>
</template>

<script>
    import { apiOrderInvoiceDetail } from "@/api/shop.js"
    import { invoiceType } from "@/utils/type.js"
    export default {
        data() {
            return {
                invoiceInfo: {},// 发票信息
                goodsInfo: {},  // 商品信息
                shopInfo: {},   // 店铺信息
                orderId: '',    // 订单ID
                create_time: '',
                order_status_text: '',
                order_sn: ''
            }
        },
        
        methods: {
            // 获取订单发票详情
            initInvoiceInfoFunc() {
                apiOrderInvoiceDetail({ id: this.orderId }).then(res => {
                    this.invoiceInfo = res.data.invoice;
                    this.goodsInfo = res.data.order_goods;
                    this.shopInfo = res.data.shop;
                    this.create_time = res.data.create_time;
                    this.order_status_text = res.data.order_status_text;
                    this.order_sn = res.data.order_sn;
                })
            },
            // 去编辑发票
            toEditInvoice() {
                this.$Router.push({
                    path: '/bundle/pages/invoice/invoice',
                    query: {
                        invoice_id: this.invoiceInfo.id,
                        shop_id: this.shopInfo.id,
                        type: invoiceType['ORDERDETAILEdit']
                    }
                })
            }
        },
        
        onLoad() {
            const query = this.$Route.query;
            this.orderId = query.id || ''
        },
        
        onShow() {
            this.initInvoiceInfoFunc();
        }
    }
</script>

<style lang="scss">
    .invoice-detail {
        padding-bottom: 120rpx;
        background: linear-gradient(to bottom, $-color-primary 230rpx, transparent 0);
        
        .header {
            height: 140rpx;
            image {
                width: 44rpx;
                height: 44rpx;
            }
        }
        
        .main {
            .card {
                padding: 24rpx 0 30rpx 0;
                border-radius: 14rpx;
            }
            
            .form-item {
                display: flex;
                padding: 12rpx 30rpx;
                color: $-color-normal;
                font-size: 28rpx;
                
                .label {
                    width: 120rpx;
                    text-align: right;
                    margin-right: 40rpx;
                }
                .content {
                    flex: 1;
                }
            }
        }
        
        .footer {
            left: 0;
            bottom: 20rpx;
            width: 100%;
            padding: 24rpx;
            position: fixed;
            .btn {
                height: 88rpx;
                color: $-color-white;
                background-color: $-color-primary;
            }
        }
    }
</style>

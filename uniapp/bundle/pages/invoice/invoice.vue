<template>
    <view class="invoice">
        <view class="box bg-white">

            <!-- 发票类型 -->
            <view class="item flex row-between" @click="handleOpenInvoiceType">
                <view class="label">发票类型</view>
                <view class="content flex-1 flex row-right">
                    <text>{{ type == 0 ? '增值税电子普通发票' : '增值税专用发票' }}</text>
                    <u-icon name="arrow-right" size="22" v-if="formData.header_type == 1"></u-icon>
                </view>
            </view>

            <!-- 抬头类型 -->
            <view class="item flex row-between">
                <view class="label">抬头类型</view>
                <view class="content flex-1 flex row-right">
                    <u-radio-group v-model="formData.header_type">
                        <u-radio v-for="(item, index) in list" :key="index" :name="item.header_type"
                            :disabled="item.disabled" :active-color="colorConfig.primary">
                            {{item.name}}
                        </u-radio>
                    </u-radio-group>
                </view>
            </view>

            <!-- 发票抬头 -->
            <view class="item flex row-between">
                <view class="label">发票抬头</view>
                <view class="content">
                    <u-input v-model="formData.name" input-align="right" placeholder="填写需要开具发票的姓名" />
                </view>
            </view>

            <!-- 税号 -->
            <view class="item flex row-between" v-show="formData.header_type === 1">
                <view class="label">税号</view>
                <view class="content flex-1 flex row-right">
                    <u-input v-model="formData.duty_number" input-align="right" placeholder="纳税人识别号" />
                </view>
            </view>

            <!-- 邮箱 -->
            <view class="item flex row-between">
                <view class="label">邮箱</view>
                <view class="content flex-1 flex row-right">
                    <u-input v-model="formData.email" input-align="right" placeholder="您的联系邮箱" />
                </view>
            </view>

            <!-- 企业地址 -->
            <view class="item flex row-between" v-show="type == 1 && formData.header_type == 1">
                <view class="label">企业地址</view>
                <view class="content flex-1 flex row-right">
                    <u-input v-model="formData.address" input-align="right" placeholder="必填" />
                </view>
            </view>

            <!-- 企业电话 -->
            <view class="item flex row-between" v-show="type == 1 && formData.header_type == 1">
                <view class="label">企业电话</view>
                <view class="content flex-1 flex row-right">
                    <u-input v-model="formData.mobile" input-align="right" placeholder="必填" />
                </view>
            </view>

            <!-- 开户银行 -->
            <view class="item flex row-between" v-show="type == 1 && formData.header_type == 1">
                <view class="label">开户银行</view>
                <view class="content flex-1 flex row-right">
                    <u-input v-model="formData.bank" input-align="right" placeholder="必填" />
                </view>
            </view>

            <!-- 银行账号 -->
            <view class="item flex row-between" v-show="type == 1 && formData.header_type == 1">
                <view class="label">银行账号</view>
                <view class="content flex-1 flex row-right">
                    <u-input v-model="formData.bank_account" input-align="right" placeholder="必填" />
                </view>
            </view>

        </view>
        
        <view class="footer">
            <view class="" v-if="order_id && shop_id">
                <button class="submit-btn br60 white btn" size="lg" @click="handleInvoiceAdd">提交申请</button>
            </view>
            <view class="" v-if="invoice_id && shop_id">
                <button class="submit-btn br60 white btn" size="lg" @click="handleInvoiceEdit">提交编辑</button>
            </view>
            <view class="" v-if="shop_id && !invoice_id && !order_id">
                <button class="submit-btn br60 white btn" size="lg" @click="handleConfirm">确定</button>
            </view>
            <view class="m-t-40">
                <button class="cancel-btn br60 white btn" size="lg" @click="handleCancel">不开发票</button>
            </view>
        </view>
        
        
        <!-- 发票类型选择 -->
        <u-popup v-model="showCoupon" border-radius="14" mode="bottom" closeable :safe-area-inset-bottom="true" @open="type=formData.type" @close="handleCloseInvoiceType">
            <view class="p-30 bg-body">
                <view class="text-center">发票类型选择</view>
            </view>
            <view class="invoice-type bg-body">
                <!-- 普票 -->
                <view class="invoice-type--item bg-white flex row-between" @click="type=0">
                    <view>
                        <view class="nr black">增值税电子普通发票</view>
                        <view class="xs lighter m-t-14">默认发送至所提供的电子邮件</view>
                    </view>
                    <u-checkbox :value="type==0" shape="circle"
                        name="0"></u-checkbox>
                </view>
                <!-- 专票 -->
                <view class="invoice-type--item bg-white flex row-between" @click="type=1" v-show="spec_invoice">
                    <view>
                        <view class="nr black">增值税专用发票</view>
                        <view class="xs lighter m-t-14">纸质发票开出后将以邮寄形式交付</view>
                    </view>
                    <u-checkbox :value="type==1" shape="circle"
                            name="1"></u-checkbox>
                </view>
                <!-- 底部确认按钮 -->
                <view class="invoice-type-confirm-btn">
                    <button class="confirm br60 white btn" size="lg" @click="handleChoise">确定</button>
                </view>
            </view>
        </u-popup>
    </view>
</template>

<script>
    import {
        getInvoiceSetting,
        apiInvoiceAdd,
        apiInvoiceEdit,
        apiInvoiceDetail
    } from "@/api/shop.js"
    import { invoiceType } from "@/utils/type.js"
    export default {
        data() {
            return {
                shop_id: '',        // 商家ID
                invoice_id: '',     // 发票ID （编辑时
                order_id: '',       // 订单ID （添加时
                showCoupon: false,
                list: [{
                        name: '个人',
                        header_type: 0,
                        disabled: false
                    },
                    {
                        name: '企业',
                        header_type: 1,
                        disabled: false
                    }
                ],
                formData: {
                    id: '',         //  必填 int 发票id
                    order_id: '',   //	必填	int	订单id
                    type: 0,        //	必填	int	发票类型 0-普通 1-专用
                    header_type: 0, //	必填	int	抬头类型 0-个人 1-企业
                    name: '',       //	必填	string	抬头名称
                    duty_number: '',//	否	string	税号
                    email: '',      //	否	string	邮箱
                    mobile: '',     //	否	string	企业电话
                    address: '',    //	否	string	企业地址
                    bank: '',       //	否	string	开户行
                    bank_account: ''//	否	string	银行账号
                },
                type: 0,            // 
                open_invoice: 0,    // 发票开关 0- 关闭 1-开启
                spec_invoice: 0     // 是否支持专票 0-不支持 1-支持
            };
        },
        methods: {
            // 初始化发票
            initInvoiceSetting() {
                getInvoiceSetting({
                    shop_id: this.shop_id,
                }).then(res => {
                    this.spec_invoice = res.data.spec_invoice
                    if ( res.data.open_invoice ) this.open_invoice = res.data.open_invoice
                    else this.$toast({ title: '当前店铺暂未开启发票' })
                })
            },
            // 获取发票详情
            getInvoiceDetail() {
                apiInvoiceDetail({ id: this.invoice_id }).then(res => {
                    for (const key in res.data) {
                        if (!this.formData.hasOwnProperty(key)) continue
                        this.formData[key] = res.data[key]
                    }
                })
            },
            initRules() {
                const form = this.formData
                if(!this.open_invoice) {
                    this.$toast({title: '当前店铺暂未开启发票'})
                    return false
                }
                if(!form.name) {
                    this.$toast({title: '请输入发票抬头'})
                    return false
                } 
                if(!form.duty_number && form.header_type == 1) {
                    this.$toast({title: '请输入税号'})
                    return false
                }
                if(!form.email) {
                    this.$toast({title: '请输入邮箱地址'})
                    return false
                } 
                if(!/^[0-9a-zA-Z_.-]+[@][0-9a-zA-Z_.-]+([.][a-zA-Z]+){1,2}$/.test(form.email)) {
                    this.$toast({title: '邮箱输入有误,请重新输入'})
                    return false
                }
                if(!form.address && form.header_type == 1 && form.type == 1) {
                    this.$toast({title: '请输入企业地址'})
                    return false
                }
                if(!form.mobile && form.type == 1) {
                    this.$toast({title: '请输入手机号码'})
                    return false
                } 
                if(!form.bank && form.header_type == 1 && form.type == 1) {
                    this.$toast({title: '请输入开户银行'})
                    return false
                }
                if(!form.bank_account && form.header_type == 1 && form.type == 1) {
                    this.$toast({title: '请输入银行账号'})
                    return false
                }
                return true
            },
            // 打开发票类型选择
            handleOpenInvoiceType() {
                if( this.formData.header_type == 0 ) return
                this.showCoupon=true
            },
            // 关闭发票类型选择
            handleCloseInvoiceType() {
                if( this.type != this.formData.type ) {
                    this.type = this.type == 1 ? 0 : 1
                }
            },
            // 选择发票类型
            handleChoise() {
                this.formData.type = this.type
                this.showCoupon = false
            },
            // 确定发票（订单下单时
            handleConfirm() {
                if(!this.initRules()) return
                uni.$emit('invoice', {...this.formData, shop_id: this.shop_id});
                uni.navigateBack()
            },
            // 确认添加
            handleInvoiceAdd() {
                if(!this.initRules()) return
                apiInvoiceAdd({...this.formData, order_id: this.order_id}).then(res => {
                    if(res.code == 1) {
                        setTimeout(() => {
                            uni.navigateBack()
                        }, 500)
                    }
                })
            },
            // 确认编辑
            handleInvoiceEdit() {
                if(!this.initRules()) return
                apiInvoiceEdit({...this.formData}).then(res => {
                    if(res.code == 1) {
                        setTimeout(() => {
                            uni.navigateBack()
                        }, 500)
                    }
                })
            },
            // 不开发票
            handleCancel() {
                if ( !this.order_id && !this.invoice_id ) {
                    uni.$emit('invoice', {del: true, shop_id: this.shop_id});
                }
                uni.navigateBack()
            }
        },

        onLoad() {
            const query = this.$Route.query;
            switch (query.type * 1) {
                case invoiceType['SETTLEMENT']:
                    this.shop_id = query.shop_id || ''
                    if( query.invoice != '{}') {
                        this.formData = JSON.parse(query.invoice)
                        this.type = this.formData.type
                    }
                break;
                case invoiceType['ORDERDETAILEdit']:
                    this.invoice_id = query.invoice_id || ''
                    this.shop_id = query.shop_id || ''
                    this.getInvoiceDetail()
                break;
                case invoiceType['ORDERDETAILADD']:
                    this.order_id = query.order_id || ''
                    this.shop_id = query.shop_id || ''
                break;
            }   
            // 初始化发票
            this.initInvoiceSetting()
        }
    };
</script>

<style lang="scss">
    .invoice {
        height: calc(100vh - env(safe-area-inset-bottom));
        padding: 24rpx;
        position: relative;

        .box {
            padding: 20rpx 0;
            border-radius: 16rpx;

            .item {
                padding: 16rpx 30rpx;

                .label {
                    font-size: 28rpx;
                    color: $-color-black;
                }

                .content {
                    min-width: 440rpx;
                }
            }
        }
        
        .footer {
            left: 0;
            bottom: 0;
            width: 100%;
            padding: 24rpx;
            position: absolute;
            .btn {
                height: 88rpx;
            }
            .submit-btn {
                color: $-color-white;
                background-color: #E39B37;
            }
            .cancel-btn {
                color: #E39B37;
                background-color: $-color-white;
            }
        }

        .invoice-type {
            padding: 40rpx;
            padding-bottom: 0;

            .invoice-type--item {
                padding: 28rpx 36rpx;
                border-radius: 40rpx;
                margin-bottom: 30rpx;
            }

            .invoice-type-confirm-btn {
                padding: 90rpx 0 50rpx 0;

                .confirm {
                    background-color: #FF9E1E;
                }
            }
        }
    }
</style>

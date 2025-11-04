<template>
    <view>
        <u-tabs :list="list" :is-scroll="false" :current="current" @change="change"></u-tabs>

        <view class="m-t-20">
            <template v-if="current == 0">
                <view class="item bb">
                    <view>商家名称</view>
                    <view>{{info.name}}</view>
                </view>
                <view class="item bb">
                    <view>商家类型</view>
                    <view>{{info.name}}</view>
                </view>
                <view class="item bb">
                    <view>主营类目</view>
                    <view>{{ info.cate_name }}</view>
                </view>
                <view class="item bb">
                    <view>商家评分</view>
                    <view>
                        <u-rate disabled active-color="#F6B125" :count="5" v-model="info.score"></u-rate>
                    </view>
                </view>
                <router-link to="/bundle/pages/shop_setting_edit/shop_setting_edit?type=1">
                    <view class="item bb">
                        <view>联系人</view>
                        <view class="flex row-right">
                            <view class="m-r-10">{{info.nickname}}</view>
                            <u-icon name="arrow-right"></u-icon>
                        </view>
                    </view>
                </router-link>
                <router-link to="/bundle/pages/shop_setting_edit/shop_setting_edit?type=2">
                    <view class="item bb">
                        <view>联系电话</view>
                        <view class="flex row-right">
                            <view class="m-r-10">{{info.mobile}}</view>
                            <u-icon name="arrow-right"></u-icon>
                        </view>
                    </view>
                </router-link>
                <router-link to="/bundle/pages/shop_setting_edit/shop_setting_edit?type=3">
                    <view class="item line-2">
                        <view>店铺简介</view>
                        <view class="flex row-right">
                            <view class="m-r-10 line-2">{{info.intro}}</view>
                            <u-icon name="arrow-right"></u-icon>
                        </view>
                    </view>
                </router-link>
            </template>

            <template v-if="current == 1">
                <view class="item bb">
                    <view>经营状态</view>
                    <view class="flex row-right">
                        <view class="m-r-20">{{info.is_run?'营业中':'暂停营业'}}</view>
                        <u-switch @change="isRunFunc" size="36" v-model="info.is_run"></u-switch>
                    </view>
                </view>
                <router-link to="/bundle/pages/run_time/run_time">
                    <view class="item">
                        <view>营业时间</view>
                        <view class="flex row-right">
                            <view class="m-r-10 line-2">{{shopInfo.run_start_time||'-'}}-{{shopInfo.run_end_time||'-'}}
                            </view>
                            <u-icon name="arrow-right"></u-icon>
                        </view>
                    </view>
                </router-link>
                <router-link to="/pages/address_edit/address_edit?type=1">
                    <view class="item">
                        <view>商家地址</view>
                        <view class="flex row-right line-1">
                            <view class="m-r-10 line-1">{{shopAddress}}</view>
                            <u-icon name="arrow-right"></u-icon>
                        </view>
                    </view>
                </router-link>
                <router-link to="/pages/address_edit/address_edit?type=2">
                    <view class="item">
                        <view>退货地址</view>
                        <view class="flex row-right line-1">
                            <view class="m-r-10 line-1">{{refundAddress}}</view>
                            <u-icon name="arrow-right"></u-icon>
                        </view>
                    </view>
                </router-link>
                <view class="item bb">
                    <view>发票开关</view>
                    <view class="flex row-right">
                        <view class="m-r-20">{{info.is_run?'开启':'关闭'}}</view>
                        <u-switch @change="openInvoiceFunc" size="36" v-model="info.open_invoice"></u-switch>
                    </view>
                </view>
                <view class="item bb">
                    <view>经营状态</view>
                    <view class="flex row-right">
                        <view class="m-r-20">{{info.is_run?'支持':'不支持'}}</view>
                        <u-switch @change="specInvoiceFunc" size="36" v-model="info.spec_invoice"></u-switch>
                    </view>
                </view>
            </template>
        </view>

        <u-toast ref="uToast" />
    </view>
</template>

<script>
    import {
        mapGetters,
        mapActions
    } from 'vuex'
    import {
        apiSetShopInfo
    } from '@/api/store'
    export default {
        data() {
            return {
                list: [{
                    name: '基础信息'
                }, {
                    name: '经营信息'
                }],

                current: 0,

                info: {
                    is_run: 1,
                    open_invoice: 1,
                    spec_invoice: 1
                }
            }
        },

        computed: {
            shopAddress() {
                return this.shopInfo.province_name + " " + this.shopInfo.city_name + " " + this.shopInfo.district_name +
                    " " + this.shopInfo.address;
            },
            refundAddress() {
                return this.shopInfo.refund_address?.province_name + " " + this.shopInfo.refund_address?.city_name + " " +
                    this.shopInfo.refund_address?.district_name +
                    " " + (this.shopInfo.refund_address?.address ?? '')
            }
        },

        onShow() {
            this.getUser().then(res => {
                // 深度克隆防止vux的数据地址保存连接
                this.info = JSON.parse(JSON.stringify(res));
            })
        },

        methods: {
            ...mapActions(['getUser']),

            change(index) {
                this.current = index;
            },

            async isRunFunc(event) {
                try {
                    await apiSetShopInfo({
                        is_run: event ? 1 : 0
                    })
                    this.$refs.uToast.show({
                        title: '设置成功',
                        type: 'success'
                    })
                } catch(err) {
                    this.$refs.uToast.show({
                        title: err,
                        type: 'error'
                    })
                }
            },
            
            async openInvoiceFunc(event) {
                try {
                    await apiSetShopInfo({
                        open_invoice: event ? 1 : 0
                    })
                    this.$refs.uToast.show({
                        title: '设置成功',
                        type: 'success'
                    })
                } catch(err) {
                    this.$refs.uToast.show({
                        title: err,
                        type: 'error'
                    })
                }
            },
            
            async specInvoiceFunc(event) {
                try {
                    await apiSetShopInfo({
                        spec_invoice: event ? 1 : 0
                    })
                    this.$refs.uToast.show({
                        title: '设置成功',
                        type: 'success'
                    })
                } catch(err) {
                    this.$refs.uToast.show({
                        title: err,
                        type: 'error'
                    })
                }
            },
        }
    }
</script>

<style lang="scss">
    .item {
        padding: 30rpx;
        /* #ifndef APP-NVUE */
        display: flex;
        /* #endif */
        flex-direction: row;
        align-items: center;
        background-color: $-color-white;
        justify-content: space-between;

        >view:first-child {
            width: 180rpx;
            color: $-color-black;
            font-size: $-font-size-nr;
            font-weight: 500;
        }

        >view:last-child {
            flex: 1;
            text-align: right;
        }
    }

    .bb {
        border-bottom: 1px solid #F8F8F8;
    }
</style>

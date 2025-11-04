<template>
    <view class="">
        <!-- Header -->
        <view class="header bg-white">
            <u-search placeholder="请输入商品名称" :show-action="false" @change="change(current)" v-model="keyword"></u-search>
        </view>

        <!-- Nav -->
        <view class="nav bg-white">
            <u-tabs name="name" :show-bar="false" :list="list" :is-scroll="true" :current="current" @change="change"
                active-color="#40AFFA" />
        </view>
        <!-- Section -->
        <view class="section" :style="{'height': height}">
            <swiper :duration="400" style="height: 100%; overflow: hidden;" @change="change" :current="current">
                <swiper-item v-for="(items, index) in list" :key="index">
                    <view v-show="index == current">
                        <mescroll-uni bottom="220rpx" ref="mescrollRef" top="0rpx" height="100%" @init="mescrollInit"
                            @up="upCallback" :up="upOption" @down="downCallback">
                            <view class="title muted sm">
                                共{{count}}笔订单
                            </view>

                            <block v-for="(items2, index2) in items.lists" :key="index2">
                                <order-card :data="items2">
                                    
                                    <template v-if="items2.edit_address_btn">
                                        <router-link :to="'/pages/address_edit/address_edit?id='+items2.id">
                                            <button class="btn hollow br60 flex row-center normal">修改地址</button>
                                        </router-link>
                                    </template>
                                    <template v-if="items2.content_btn">
                                        <router-link :to="'/pages/order_detail/order_detail?id='+items2.id">
                                            <button class="btn solid br60 flex row-center normal">查看内容</button>
                                        </router-link>
                                    </template>
                                    <template v-if="items2.shop_cancel_btn">
                                        <button class="btn hollow br60 flex row-center normal"
                                            @click="openFunc(items2, 'close')">取消订单</button>
                                    </template>
                                    <template v-if="items2.to_ship_btn">
                                        <router-link :to="'/bundle/pages/deliver_goods/deliver_goods?id='+items2.id">
                                            <button class="btn solid br60 flex row-center normal">去发货</button>
                                        </router-link>
                                    </template>
                                    <template v-if="items2.take_btn">
                                        <button class="btn solid br60 flex row-center normal"
                                            @click="openFunc(items2, 'confirm')">确认收货</button>
                                    </template>
                                    <template v-if="items2.delivery_btn">
                                        <button class="btn hollow br60 flex row-center normal"
                                            @click="openFunc(items2, 'recycle')">查看物流</button>
                                    </template>
                                    <template v-if="items2.del_btn">
                                        <button class="btn hollow br60 flex row-center normal"
                                            @click="openFunc(items2, 'del')">删除</button>
                                    </template>
									<template v-if="items2.to_verification_btn">
									    <router-link :to="'/pages/verification_order/verification_order'">
									        <button class="btn solid br60 flex row-center normal">去核销</button>
									    </router-link>
									</template>
                                </order-card>
                            </block>

                        </mescroll-uni>
                    </view>
                </swiper-item>
            </swiper>
        </view>

        <modal height="200rpx" v-model="close" @confirm="orderSetting">
            <view class="black n" style="height: 200rpx;">
                确认取消该订单吗?
            </view>
        </modal>

        <modal height="200rpx" v-model="del" @confirm="orderSetting">
            <view class="black nr" style="height: 200rpx;">
                确认删除该订单吗?
            </view>
        </modal>

        <modal height="200rpx" v-model="confirm" @confirm="orderSetting">
            <view class="black nr" style="height: 200rpx;">
                确认用户已收到货？请谨慎处理！
            </view>
        </modal>
        
        <modal height="200rpx" :cancelShow="false" v-model="recycle">
            <view class="black nr" style="height: 200rpx;">
                <view class="m-t-40">快递公司： {{logistics.shipping_name}}</view>
                <view class="m-t-20">快递公司： {{logistics.invoice_no}} <text class="copy" @click="copy(logistics.invoice_no)">复制</text></view>
            </view>
        </modal>

        <u-toast ref="uToast" />
    </view>
</template>


<script>
    import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
    import {
        apiOrderList,
        apiOrderClose,
        apiOrderConfirm,
        apiOrderLogistics,
        apiOrderDelete
    } from '@/api/order'
    import {
        debounce,
        copy
    } from "@/utils/tools.js"
    export default {
        mixins: [MescrollMixin],
        data() {
            return {
                height: '100%',
                
                keyword: '',
                list: [{
                        name: '全部',
                        type: 'all',
                        lists: []
                    },
                    {
                        name: '待付款',
                        type: 'pay',
                        lists: []
                    },
                    {
                        name: '待发货',
                        type: 'delivery',
                        lists: []
                    },
                    {
                        name: '待收货',
                        type: 'receiving',
                        lists: []
                    },
                    {
                        name: '已完成',
                        type: 'finish',
                        lists: []
                    },
                    {
                        name: '已取消',
                        type: 'close',
                        lists: []
                    }
                ],                
                current: 0,
                count: 0,

                action: '',

                close: false,
                del: false,
                confirm: false,
                recycle: false,
                
                // 物流
                logistics: {
                    shipping_name: '-',
                    invoice_no: ''
                },
                
                upOption: {
                    empty: {
                        icon: '/static/images/empty/order.png',
                        tip: '暂无相关订单！', // 提示
                        fixed: true,
                        top: "200rpx",
                    }
                }
            }
        },
        
        updated() {
            
        },
        
        methods: {
            change(event) {
                let index;
                event.detail ? index = event.detail.current : index = event
                this.current = Number(index)
                this.$refs.mescrollRef[this.current].mescroll.resetUpScroll()
            },

            upCallback(page) {
                const index = this.current;
                const pageNum = page.num
                const pageSize = page.size

                apiOrderList({
                    goods_name: this.keyword,
                    type: this.list[index].type,
                    page_no: pageNum,
                    page_size: pageSize,
                }).then(({
                    list,
                    size,
                    more,
                    count,
                }) => {
                    // 如果是第一页或是搜索时需手动置空列表
                    if (pageNum == 1 || this.keyword) this.list[index].lists = []
                    const hasNext = !!more;
                    // 重置列表数据
                    this.count = count
                    this.list[index].lists = [...this.list[index].lists, ...list]
                    this.$refs.mescrollRef[index].mescroll.endSuccess(list.length, hasNext);
                }).catch((err) => {
                    console.log(err)
                    this.mescroll.endErr()
                })
            },
            
            copy(content) {
                copy(content)
            },

            async openFunc(item, action) {
                if(action == 'recycle') {
                    const res = await apiOrderLogistics({id: item.id})
                    this.logistics = res;
                }
                
                this.curData = item;
                this.action = action;
                this[action] = true;
            },

            // 操作订单
            async orderSetting() {
                let id = this.curData.id,
                    action = this.action

                if (action == 'close') {
                    await apiOrderClose({id})
                } else if (action == 'del') {
                    await apiOrderDelete({id})
                } else if (action == 'confirm') {
                    await apiOrderConfirm({id})
                }

                this.$refs.mescrollRef[this.current].mescroll.resetUpScroll()
                this.$refs.uToast.show({
                    title: '操作成功',
                    type: 'success'
                })
            }
        },

        onShow() {
            // 使用防抖是为了防止v-show的时候出发多条数据，所以使用防抖触发多次的时候可以只成为触发一次，优化性能请求
            this.upCallback = debounce(this.upCallback, 200, this)
            this.$nextTick(() => {
                this.$refs.mescrollRef[this.current].mescroll.resetUpScroll()
            })
            
            uni.getSystemInfo({
                success: (res) => {
                    this.height = res.windowHeight - 107 + 'px';
                }
            });
        }
    }
</script>


<style lang="scss">
    /*根元素需要有固定的高度*/
    page {
        height: 100%;
        box-sizing: border-box;

        .header {
            padding: 16rpx 30rpx;
        }

        .nav {
            padding: 15rpx 0;
        }

        .section {
			overflow: hidden;
            .title {
                padding: 20rpx;
            }

            .btn {
                margin-top: 20rpx;
                margin-left: 20rpx;
                width: 180rpx;
                height: 64rpx;
                font-size: $-font-size-sm;
            }

            .solid {
                color: $-color-white;
                background-color: $-color-primary;
            }

            .hollow {
                color: $-color-lighter;
                border: 1px solid #DBDBDB;
            }
            
            
        }
        .copy {
            font-size: $-font-size-xs;
            margin-left: 20rpx;
            padding: 4rpx 10rpx;
            border-radius: 4rpx;
            color: $-color-primary;
            background-color: rgba(64, 175, 250, .1);
        }
    }
</style>

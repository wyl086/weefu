<template>
    <view class="m-t-20">

        <view class="item bb">
            <view>快递方式</view>
            <view class="flex row-right">
                <u-radio-group v-model="form.send_type">
                    <u-radio v-for="(item, index) in list" :key="index" :name="item.val">
                        {{item.name}}
                    </u-radio>
                </u-radio-group>
            </view>
        </view>

        <template v-if="form.send_type == 1">
            <view class="item bb" @click="show = true">
                <view>快递公司</view>
                <view class="flex row-right m-r-16">
                    <view class="m-r-12">
                        {{!curData.label?'未选择':curData.label}}
                    </view>
                    <u-icon name="arrow-down"></u-icon>
                </view>
            </view>

            <view class="item bb" style="align-items:flex-start">
                <view>快递单号</view>
                <view style="text-align: left;" class="m-t-4">
                    <input v-model="form.invoice_no" placeholder="请输入物流单号" />
                </view>
            </view>
        </template>

        <view class="br60 btn flex row-center white md" @click="onSubmit(type)">
            确认
        </view>
        
        
		<u-select v-model="show" @confirm="confirm" :list="express" mode="single-column" value-name="id" label-name="name"></u-select>

        <u-toast ref="uToast" />
    </view>
</template>

<script>
    import {
        apiOrderDelivery,
        apiOrderExpress
    } from '@/api/order'
    export default {
        data() {
            return {
                form: {
                    id: 0,
                    invoice_no: '',
                    send_type: 1,
                    shipping_id: 0
                },
                
                show: false,
                express: [],
                curData: {},

                list: [{
                        name: '快递配送',
                        val: 1
                    },
                    {
                        name: '无需快递',
                        val: 2
                    }
                ],
            }
        },

        onLoad() {
            try {
                const id = this.$Route.query.id;
                if (id) {
                    this.form.id = id;
                    this.getExpressFunc(id)
                }

            } catch (e) {
                //TODO handle the exception
            }
        },

        methods: {
            async onSubmit() {
                if(this.form.send_type == 1) {
                    if(this.curData.value == undefined) return this.$toast({title: '请选择快递公司'})
                    if(this.form.invoice_no == '') return this.$toast({title: '请输入快递单号'})
                }
                
                const params = { 
                    id: this.form.id,
                    send_type: this.form.send_type,
                    invoice_no: this.form.send_type == 1 ? this.form.invoice_no : '',
                    shipping_id: this.form.send_type == 1 ? this.curData.value : '',
                }
                
                await apiOrderDelivery({...params})

                this.$refs.uToast.show({
                    title: '发货成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.$Router.back()
                }, 1000)
            },
            
            confirm(event) {
                this.curData = event[0];
            },
            
            async getExpressFunc(id) {
                const res = await apiOrderExpress({id})
                this.express = res;
            }
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

            textarea {
                width: 560rpx;
                height: 300rpx;
            }
        }
    }

    .btn {
        width: 690rpx;
        height: 88rpx;
        margin: 0 auto;
        margin-top: 40rpx;
        background-color: $-color-primary;
    }
</style>

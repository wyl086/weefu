<template>
    <u-popup v-model="show" mode="bottom" closeable border-radius="14" safe-area-inset-bottom :duration="100">
        <!-- 内容列表 -->
        <view class="content-wrapper">
            <tabs :current="active" @change="changeTabs" height="100" :is-scroll="false" width="400rpx" :showBar="false" :async="isAsync">
                <tab name="宝贝">
                    <goods @change="handleGoods" v-model="goodsData" :i="0" :index="active"></goods>
                </tab>
                <tab name="店铺">
                    <shop @change="handleShop" v-model="shopData" :i="1" :index="active"></shop>
                </tab>
            </tabs>
        </view>

        <!-- 底部 -->
        <view class="recommend-footer flex">
            <button class="white br60 bg-primary btn" @click="confirm">确认</button>
        </view>
    </u-popup>
</template>

<script>
    import Goods from "./goods.vue"
    import Shop from "./shop.vue"
    export default {
        name: "recommend",
        components: {
            Goods,
            Shop
        },
        props: {
            value: {
                type: Boolean
            },
            goods: {
                type: [Object, Array]
            },
            shop: {
                type: [Object, Array]
            }
        },
        data() {
            return {
                list: [{    
                    name: '宝贝'
                }, {
                    name: '店铺'
                }],
                active: 0,
                goodsData: [],
                shopData: [],
                isAsync: true // 是否异步
            }
        },
        computed: {
        	// 弹窗Popup显示状态
        	show: {
        		get: function() {
        			return this.value
        		},
        		set: function(value) {
        			this.$emit('input', value)
        		}
        	}
        },
        watch: {
            goods(val) {
                this.active = 0;
                this.goodsData = val;
                console.log(this.goodsData)
            },
            shop(val) {
                this.active = 1;
                this.shopData = val
            }
        },
        methods: {
            changeTabs(event) {
                if(this.goodsData.length!=0 || this.shopData.length!=0) return this.$toast({title: '不能同时选择宝贝/店铺'})
                this.isAsync = false
                this.active = event
                this.isAsync = true
            },
            handleGoods(event) {
                this.goodsData = event;
            },
            handleShop(event) {
                this.shopData = event;
            },
            confirm() {
                if( this.active == 0 ) {
                    this.$emit('change', {
                        type: 0,
                        data: this.goodsData
                    })
                } else {
                    this.$emit('change', {
                        type: 1,
                        data: this.shopData
                    })
                }
                this.$emit('input', false)
            }
        }
    }
</script>

<style lang="scss">
    .bb {
        border-bottom: 1px solid $-color-body;
    }

    .content-wrapper {
        height: 900rpx;
    }    

    .recommend-footer {
        width: 100%;
        height: 100rpx;
        padding: 0 30rpx;
        box-shadow: 0 -4rpx 10rpx rgba(#000000, .1);

        .btn {
            width: 100%;
            height: 82rpx;
            font-size: 32rpx;
            line-height: 82rpx;
        }
    }
</style>

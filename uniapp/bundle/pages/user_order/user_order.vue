<template>
    <view class="user-order">
        <tabs :current="active" @change="changeShow" bar-width="60" :is-scroll="false">
            <tab v-for="(item, index) in order" :key="index" :name="item.name">
                <order-list
                    :order-type="item.type"
                    :i="index"
                    :index="active"
                    v-if="isLogin"
                ></order-list>
                <button class="btn" @click="handlelogin" v-else>立即登录</button>
            </tab>
        </tabs>
        <float-tab></float-tab>
    </view>
</template>

<script>
import { orderType } from '@/utils/type'

export default {
    data() {
        return {
            active: -1,
            order: [
                {
                    name: '全部',
                    type: orderType.ALL
                },
                {
                    name: '待付款',
                    type: orderType.PAY
                },
                {
                    name: '待收货',
                    type: orderType.DELIVERY
                },
                {
                    name: '已完成',
                    type: orderType.FINISH
                },
                {
                    name: '已关闭',
                    type: orderType.CLOSE
                }
            ]
        }
    },
    onLoad(options) {
        const { order } = this
        let type = this.$Route.query.type || orderType.ALL
        let index = order.findIndex((item) => item.type == type)
        this.changeShow(index)
    },
    methods: {
        changeShow(index) {
            if (index != -1) {
                this.$nextTick(() => {
                    this.active = index
                })
            }
        },
        handlelogin() {
            this.$Router.push('/pages/login/login')
        }
    }
}
</script>
<style lang="scss" scoped>
.btn {
    width: 200rpx;
    background-color: $-color-primary;
    border-radius: 20rpx;
    color: white;
    margin: 100rpx auto;
}
</style>

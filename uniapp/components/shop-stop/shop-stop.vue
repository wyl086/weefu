<template>
    <view class="stop_container">
        <image :src="$getImageUri('/images/shop_stop/shop_stop.png')" class="img"> </image>
        <view class="lg"> 店铺暂停营业 </view>
        <view class="muted" style="margin-top: 30rpx">您要找的店铺暂停营业中 请稍后再来</view>
    </view>
</template>
<script>
export default {
    props: {},
    computed: {
        $getImageUri() {
            return (url) => this.$store.state.app.config.base_domain + url
        }
    }
}
</script>
<style lang="scss" scoped>
page {
    background-color: white;
    .stop_container {
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .img {
        width: 300rpx;
        height: 300rpx;
    }
}
</style>

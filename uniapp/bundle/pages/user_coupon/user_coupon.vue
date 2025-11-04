<template>
<view class="user-coupon">
    <tabs :current="active" @change="onChange" :is-scroll="false">
        <tab v-for="(item, index) in coupons" :key="index" :name="item.title">
            <my-coupons :type="item.type" :btn-type="item.btnType" :i="index" :index="active"></my-coupons>
        </tab>
    </tabs>
</view>
</template>

<script>

export default {
  data() {
    return {
      active: 0,
      coupons: [{
        title: '可使用',
        btnType: 0,
		type: 'valid'
      }, {
        title: '已使用',
        btnType: 1,
		type: 'used'
      }, {
        title: '已过期',
        btnType: 2,
		type: 'expired'
      }]
    };
  },

  methods: {
    onChange(index) {
        this.active = index
    }
  }
};
</script>
<style>
</style>
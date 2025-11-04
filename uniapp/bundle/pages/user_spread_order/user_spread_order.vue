<template>
<view class="user-promote-order">
   <tabs :current="active" @change="onChange" bar-width="60" :is-scroll="false">
       <tab v-for="(item, index) in order" :key="index" :name="item.name">
           <spread-order  :type="item.type" :i="index" :index="active"></spread-order>
       </tab>
   </tabs>
</view>
</template>

<script>

import { distributionOrder } from "@/utils/type";

export default {
  data() {
    return {
      order: [{
        name: "全部",
        type: distributionOrder.ALL,
      }, {
        name: "待返佣",
        type: distributionOrder.WAIT_RETURN,
      }, {
        name: "已结算",
        type: distributionOrder.HANDLED,
      }, {
        name: "已失效",
        type: distributionOrder.INVALED,
      }],
      active: distributionOrder.ALL
    };
  },


  onLoad: function (options) {
 
  },

  methods: {
    onChange(index) {
      this.active = index
    },
  }
};
</script>
<style>
</style>
<template>
    <view class="post-sale">
      <view class="contain">
        <tabs :current="active" :bar-width="80" @change="onChange" :is-scroll="false">
          <tab v-for="(item, index) in afterSale" :key="index" :name="item.name">
            <after-sales-list :type="item.type"  :i="index" :index="active"></after-sales-list>
          </tab>
        </tabs>
      </view>
    </view>
</template>

<script>

import { afterSaleType } from "@/utils/type";

export default {
  data() {
    return {
      active: 0,
      afterSale: [{
        name: '售后申请',
        type: afterSaleType.NORMAL
      }, {
        name: '处理中',
        type: afterSaleType.HANDLING
      }, {
        name: '已处理',
        type: afterSaleType.FINISH
      }]
    };
  },

  methods: {
    onChange(index) {
		this.active = index
    },
  }
};
</script>
<style lang="scss">

</style>
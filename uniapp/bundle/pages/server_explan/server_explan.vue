<template>
  <view>
    <view class="main">
      <u-parse :html="content" />
    </view>
  </view>
</template>

<script>
import {
  getServerProto,
  getPrivatePolicy,
  getAfterSaleGuar,
  getuserProto,
} from "@/api/app";
import { getTreaty } from "@/api/shop";
export default {
  data() {
    return {
      content: "",
    };
  },

  onLoad() {
    this.type = Number(this.$Route.query.type);
    // 0 ==> 服务协议 1 ==> 隐私政策 2 ==> 售后保障
    this.getData();
  },
  methods: {
    async getData() {
      let res = {};
      switch (this.type) {
        case 0:
          uni.setNavigationBarTitle({
            title: "服务协议",
          });
          res = await getServerProto();
          break;
        case 1:
          uni.setNavigationBarTitle({
            title: "隐私政策",
          });
          res = await getPrivatePolicy();
          break;
        case 2:
          uni.setNavigationBarTitle({
            title: "售后保障",
          });
          res = await getAfterSaleGuar();
          break;
        case 3:
          uni.setNavigationBarTitle({
            title: "入驻协议",
          });
          res = await getTreaty();
          break;
        case 4:
          uni.setNavigationBarTitle({
            title: "注销协议",
          });
          res = await getuserProto();
          break;
      }
      if (res.code == 1) {
        this.content = res.data.content;
      }
    },
  },
};
</script>
<style lang="scss">
.main {
  padding: 20rpx;
}
</style>

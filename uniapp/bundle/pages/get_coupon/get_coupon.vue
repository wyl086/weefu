<template>
  <mescroll-body
    ref="mescrollRef"
    @init="mescrollInit"
    @down="downCallback"
    @up="upCallback"
    :up="upOption"
  >
    <view class="get-coupon">
      <view>
        <image class="banner" src="../../static/banner_coupon.jpg"></image>
      </view>
      <view class="bg-body main">
        <coupon-list
          :list="couponList"
          :btn-type="3"
          @refresh="refresh"
        ></coupon-list>
      </view>
    </view>
  </mescroll-body>
</template>

<script>
import { getCouponList, getCoupon } from "@/api/activity";
import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins";
export default {
  mixins: [MescrollMixin],
  data() {
    return {
      active: 0,
      upOption: {
        empty: {
          icon: "/static/images/coupon_null.png",
          tip: "暂无优惠券",
        },
      },
      tabList: [
        {
          name: "全部",
          type: "all",
        },
        {
          name: "店铺券",
          type: "shop",
        },
        {
          name: "通用券",
          type: "platform",
        },
      ],
      couponList: [],
    };
  },

  onLoad(options) {},

  methods: {
    upCallback(page) {
      const { tabList, active } = this;
      getCouponList({
        page_size: page.size,
        page_no: page.num,
        type: tabList[active].type,
      })
        .then(({ data }) => {
          if (page.num == 1) this.couponList = [];
          const curPageData = data.lists;
          const curPageLen = curPageData.length;
          const hasNext = !!data.more;
          this.couponList = this.couponList.concat(curPageData);
          this.mescroll.endSuccess(curPageLen, hasNext);
        })
        .catch(() => {
          this.mescroll.endErr();
        });
    },
    changeActive(index) {
      this.active = index;
      this.refresh();
    },
    refresh() {
      this.couponList = []; // 先置空列表,显示加载进度
      this.mescroll.resetUpScroll(); // 再刷新列表数据
    },
  },
};
</script>
<style>
.banner {
  width: 100%;
  height: 340rpx;
}
.main {
  border-radius: 20rpx 20rpx 0 0;
  margin-top: -20rpx;
  overflow: hidden;
  position: relative;
}
</style>

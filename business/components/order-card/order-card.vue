<template>
  <view class="order bg-white m-b-20">
    <!-- Header -->
    <view class="order-header flex row-between">
      <view class="normal nr flex">
        <view v-if="data.delivery_type == 2" class="m-r-10">
          <u-tag text="自提" size="mini" type="success" mode="dark" />
        </view>
        订单编号： {{ data.order_sn }}
      </view>
      <view class="order-status nr m-l-20">
        {{ data.order_status_text }}
      </view>
    </view>

    <!-- Stction -->
    <block v-for="(item, index) in data.order_goods">
      <view
        class="order-section flex m-b-20 col-top"
        @click="toDetail(data.id)"
      >
        <view class="image">
          <u-image :src="item.image" width="160rpx" height="160rpx"></u-image>
        </view>

        <view class="m-l-16 line-2">
          <!-- 订单名称 -->
          <view class="m-t-10">
            <view class="order-name line-2">
              {{ item.goods_name }}
            </view>
          </view>
          <!-- 商品规格 -->
          <view class="order-str m-t-10">{{ item.spec_value }}</view>
        </view>
      </view>
    </block>

    <view class="flex row-right">
      <!-- 实付款金额 -->
      <view class="muted flex sm m-t-10">
        <view>共{{ handlegoodCount() }}件，实付款: </view>
        <price
          class="header-content-price"
          :content="data.order_amount"
          main-size="30rpx"
          minor-size="22rpx"
          color="#FF4141"
        />
      </view>
    </view>

    <!-- Footer -->
    <view class="order-footer flex row-right">
      <slot></slot>
    </view>
  </view>
</template>

<script>
/**
 * @description 订单管理卡片
 *
 * @example <order-card :data="order" />
 */

export default {
  name: "GoodsCard",

  props: {
    data: {
      type: Object,
      default: () => {},
    },
  },

  methods: {
    toDetail(id) {
      this.$Router.push({
        path: "/pages/order_detail/order_detail",
        query: {
          id,
        },
      });
    },
    handlegoodCount() {
      let count = 0;
      this.data.order_goods.forEach((i) => {
        count += i.goods_num;
      });
      return count;
    },
  },
};
</script>

<style lang="scss" scoped>
.order {
  width: 100%;
  padding: 20rpx;
  margin-bottom: 20rpx;

  &-header {
    padding-bottom: 20rpx;
    .order-status {
      color: $-color-primary;
    }
  }

  &-section {
    width: 100%;

    .order-name {
      width: 100%;
      color: $-color-black;
      font-size: $-font-size-nr;
    }

    .order-str {
      color: $-color-muted;
      font-size: $-font-size-xs;
    }

    > view {
      width: 100%;
    }

    .image {
      flex: 0;
    }
  }

  &-footer {
  }
}
</style>

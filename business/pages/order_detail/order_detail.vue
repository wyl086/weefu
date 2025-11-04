<template>
  <view class="order-detail">
    <view class="header">
      <view class="item">
        <view class="white lg m-b-10">{{ orderInfo.order_status_text }}</view>
        <!-- <view class="white sm">原因：超时未支付</view> -->
      </view>
    </view>

    <view class="address-wrap flex contain bg-white row-between">
      <image
        class="m-r-20"
        style="width: 40rpx; height: 40rpx"
        src="/static/images/icon_address.png"
      ></image>
      <view class="address flex-1">
        <view>
          <text class="name md m-r-10">{{ orderInfo.consignee }}</text>
          <text class="phone md">{{ orderInfo.mobile }}</text>
          <view class="area sm m-t-10 lighter">{{
            orderInfo.delivery_address
          }}</view>
        </view>
      </view>
      <view class="copy" @click="copy(orderInfo.delivery_address)"> 复制 </view>
    </view>

    <view class="m-t-20 bg-white">
      <!-- Header -->
      <view class="order-header flex row-between">
        <view class="black md bold"> 商品信息 </view>
        <view class="order-status nr m-l-20">
          {{ orderInfo.order_status_text }}
        </view>
      </view>

      <!-- Stction -->
      <block v-for="(item, index) in orderInfo.order_goods">
        <view class="goods flex m-t-20" @click="toDetail(orderInfo.id)">
          <view class="image">
            <u-image :src="item.image" width="160rpx" height="160rpx"></u-image>
          </view>

          <view class="m-l-16 line-2">
            <!-- 订单名称 -->
            <view class="m-b-10 flex row-between col-top">
              <view class="order-name">
                {{ item.goods_name }}
              </view>
              <view class="text-right" style="height: 100%">
                <view>¥{{ item.goods_price }}</view>
                <view>x{{ item.goods_num }}</view>
              </view>
            </view>
            <!-- 商品规格 -->
            <view class="order-str m-t-10">{{ item.spec_value }}</view>
          </view>
        </view>
      </block>
      <u-collapse>
        <u-collapse-item v-for="(item, index) in itemList" :key="index">
          <view
            slot="title"
            class="p-l-20 p-r-20 nr flex row-between"
            style="width: 100%"
          >
            <view class="normal">支付方式：{{ orderInfo.pay_way_text }}</view>
            <view class="lighter"
              >实际付款：<text style="color: #ff0000"
                >¥{{ orderInfo.order_amount }}</text
              >
            </view>
          </view>

          <view class="flex m-b-20 row-around">
            <view>商品金额： ¥{{ orderInfo.goods_price }}</view>
            <view>运费金额： ¥{{ orderInfo.shipping_price }}</view>
          </view>
          <view class="m-b-40 flex row-around">
            <view>会员优惠： ¥{{ orderInfo.member_amount || 0 }}</view>
            <view>优惠金额： ¥{{ orderInfo.discount_amount }}</view>
          </view>
        </u-collapse-item>
      </u-collapse>
    </view>

    <view
      class="bg-white m-t-20"
      style="padding: 20rpx 20rpx 50rpx 20rpx"
      v-if="orderInfo.delivery_content"
    >
      <view class="black md bold"> 发货内容 </view>
      <view class="normal sm m-t-20">
        <view>
          {{ orderInfo.delivery_content || "-" }}
        </view>
        <view
          class="flex row-right m-t-30"
          @click="copy(orderInfo.delivery_content)"
        >
          <view class="copy-btn">复制</view>
        </view>
      </view>
    </view>

    <view class="bg-white m-t-20" style="padding: 20rpx 20rpx 50rpx 20rpx">
      <view class="black md bold"> 买家信息 </view>
      <view class="normal sm m-t-20">
        买家昵称： {{ orderInfo.user.nickname || "-" }}
      </view>
      <view class="normal sm m-t-20"> 买家编号： {{ orderInfo.user.sn }} </view>
      <view class="normal sm m-t-20">
        买家手机号： {{ orderInfo.user.mobile }}
      </view>
    </view>

    <!-- 发票信息 -->
    <view
      class="bg-white m-t-20"
      style="padding: 20rpx 20rpx 50rpx 20rpx"
      v-if="orderInfo.invoice != null"
    >
      <view class="black md bold"> 发票信息 </view>
      <view class="normal sm m-t-20">
        发票类型： {{ orderInfo.invoice.type == 0 ? "普通发票" : "专用发票" }}
      </view>
      <view class="normal sm m-t-20">
        抬头名称： {{ orderInfo.invoice.name }}
      </view>
      <view class="normal sm m-t-20">
        抬头类型： {{ orderInfo.invoice.header_type == 0 ? "个人" : "企业" }}
      </view>
      <view class="normal sm m-t-20" v-if="orderInfo.invoice.duty_number">
        企业税号： {{ orderInfo.invoice.duty_number }}
      </view>
      <view class="normal sm m-t-20">
        电子邮箱： {{ orderInfo.invoice.email }}
      </view>
      <view class="normal sm m-t-20" v-if="orderInfo.invoice.address">
        企业地址： {{ orderInfo.invoice.address }}
      </view>
      <view class="normal sm m-t-20" v-if="orderInfo.invoice.mobile">
        企业电话： {{ orderInfo.invoice.mobile }}
      </view>
      <view class="normal sm m-t-20" v-if="orderInfo.invoice.bank">
        开户银行： {{ orderInfo.invoice.bank }}
      </view>
      <view class="normal sm m-t-20" v-if="orderInfo.invoice.bank_account">
        银行账号： {{ orderInfo.invoice.bank_account }}
      </view>
    </view>

    <view class="bg-white m-t-20" style="padding: 20rpx 20rpx 50rpx 20rpx">
      <view class="black md bold"> 订单信息 </view>
      <view class="normal sm m-t-20">
        订单编号： {{ orderInfo.order_sn }}
      </view>
      <view class="normal sm m-t-20">
        订单类型： {{ orderInfo.order_type_text }}({{
          orderInfo.order_source_text
        }})
      </view>
      <view class="normal sm m-t-20">
        下单时间： {{ orderInfo.create_time }}
      </view>
      <view class="normal sm m-t-20">
        支付状态： {{ orderInfo.pay_status_text }}
      </view>
      <view class="normal sm m-t-20">
        支付时间： {{ orderInfo.pay_time }}
      </view>
    </view>

    <view class="bg-white m-t-20" style="padding: 20rpx 20rpx 50rpx 20rpx">
      <view class="black md bold"> 买家留言 </view>
      <view class="normal sm m-t-20">
        {{ orderInfo.user_remark || "-" }}
      </view>
    </view>

    <view class="footer bg-white flex row-right">
      <template v-if="orderInfo.edit_address_btn">
        <router-link
          :to="'/pages/address_edit/address_edit?id=' + orderInfo.id"
        >
          <button class="btn hollow br60 flex row-center normal">
            修改地址
          </button>
        </router-link>
      </template>
      <template v-if="orderInfo.shop_cancel_btn">
        <button
          class="btn solid br60 flex row-center normal"
          @click="openFunc(orderInfo, 'close')"
        >
          取消订单
        </button>
      </template>
      <template v-if="orderInfo.to_ship_btn">
        <router-link
          :to="'/bundle/pages/deliver_goods/deliver_goods?id=' + orderInfo.id"
        >
          <button class="btn solid br60 flex row-center normal">去发货</button>
        </router-link>
      </template>
      <template v-if="orderInfo.take_btn">
        <button
          class="btn solid br60 flex row-center normal"
          @click="openFunc(orderInfo, 'confirm')"
        >
          确认收货
        </button>
      </template>
      <template v-if="orderInfo.delivery_btn">
        <button
          class="btn hollow br60 flex row-center normal"
          @click="openFunc(orderInfo, 'recycle')"
        >
          查看物流
        </button>
      </template>
      <template v-if="orderInfo.del_btn">
        <button
          class="btn hollow br60 flex row-center normal"
          @click="openFunc(orderInfo, 'del')"
        >
          删除
        </button>
      </template>
    </view>

    <modal height="200rpx" v-model="close" @confirm="orderSetting">
      <view class="black nr flex row-center" style="height: 200rpx">
        确认取消该订单吗?
      </view>
    </modal>

    <modal height="200rpx" v-model="del" @confirm="orderSetting">
      <view class="black nr flex row-center" style="height: 200rpx">
        确认删除该订单吗?
      </view>
    </modal>

    <modal height="200rpx" v-model="confirm" @confirm="orderSetting">
      <view class="black nr flex row-center" style="height: 200rpx">
        确认用户已收到货？请谨慎处理！
      </view>
    </modal>

    <modal height="200rpx" :cancelShow="false" v-model="recycle">
      <view class="black nr" style="height: 200rpx">
        <view class="m-t-40">快递公司： {{ logistics.shipping_name }}</view>
        <view class="m-t-20"
          >快递公司： {{ logistics.invoice_no }}
          <text class="copy" @click="copy(logistics.invoice_no)"
            >复制</text
          ></view
        >
      </view>
    </modal>

    <u-toast ref="uToast" />
  </view>
</template>

<script>
import {
  apiOrderDetail,
  apiOrderClose,
  apiOrderConfirm,
  apiOrderLogistics,
  apiOrderDelete,
} from "@/api/order";
import { copy } from "@/utils/tools.js";
export default {
  name: "orderDetail",

  data() {
    return {
      orderInfo: {
        user: {
          nickname: "",
        },
      }, // 商品信息
      itemList: [
        {
          head: "赏识在于角度的转换",
          body: "只要我们正确择取一个合适的参照物乃至稍降一格去看待他人，值得赏识的东西便会扑面而来",
          open: true,
          disabled: true,
        },
      ],

      action: "",

      close: false,
      del: false,
      confirm: false,
      recycle: false,

      // 物流
      logistics: {
        shipping_name: "-",
        invoice_no: "",
      },
    };
  },

  methods: {
    // 初始化商品详情数据
    initOrderDetail() {
      return new Promise((resolve, reject) => {
        apiOrderDetail({
          id: this.order_id,
        })
          .then((data) => {
            this.orderInfo = data;
          })
          .catch((err) => {
            reject(err);
          });
      });
    },

    copy(content) {
      copy(content);
    },

    async openFunc(item, action) {
      if (action == "recycle") {
        const res = await apiOrderLogistics({ id: item.id });
        this.logistics = res;
      }

      this.curData = item;
      this.action = action;
      this[action] = true;
    },

    // 操作订单
    async orderSetting() {
      let id = this.curData.id,
        action = this.action;

      if (action == "close") {
        await apiOrderClose({ id });
      } else if (action == "del") {
        await apiOrderDelete({ id });
      } else if (action == "confirm") {
        await apiOrderConfirm({ id });
      }

      this.initOrderDetail();
      this.$refs.uToast.show({
        title: "操作成功",
        type: "success",
      });
    },
  },

  onLoad() {
    const options = this.$Route.query;
    this.order_id = options.id;
  },

  async onShow() {
    await this.initOrderDetail();
  },
};
</script>

<style lang="scss" scoped>
.order-detail {
  padding-bottom: 150rpx;
  background: linear-gradient(to bottom, $-color-primary 260rpx, transparent 0);

  .header {
    padding: 24rpx 40rpx;
  }

  .address-wrap {
    height: 164rpx;
    padding: 0 24rpx;
    border-radius: 10rpx 10rpx 0 0;
    .copy {
      margin: 20px;
      // text-decoration: line-through;
    }
  }

  .order-header {
    padding: 20rpx;

    .order-status {
      color: $-color-primary;
    }
  }

  .goods {
    width: 100%;
    padding: 20rpx;

    .order-name {
      width: 400rpx;

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

  .footer {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 120rpx;
    padding: 18rpx 0;

    .btn {
      width: 168rpx;
      height: 64rpx;
      margin-right: 20rpx;
    }

    .hollow {
      color: $-color-lighter;
      border: 1px solid #dbdbdb;
    }

    .solid {
      color: $-color-white;
      background-color: $-color-primary;
    }
  }
}
.copy {
  font-size: $-font-size-xs;
  margin-left: 20rpx;
  padding: 4rpx 10rpx;
  border-radius: 4rpx;
  color: $-color-primary;
  background-color: rgba(64, 175, 250, 0.1);
}
.copy-btn {
  font-size: 24rpx;
  padding: 10rpx 30rpx;
  border-radius: 8rpx;
  color: $-color-primary;
  background: rgba($color: $-color-primary, $alpha: 0.1);
}
</style>

<template>
  <view>
    <view class="confirm-order">
      <view class="confirm-con">
        <navigator
          hover-class="none"
          url="/bundle/pages/user_address/user_address?type=1"
        >
          <view
            class="address flex bg-white"
            v-if="
              teamId == undefined &&
              shopLists.length != 0 &&
              !deliveryType &&
              shopLists[0].goods[0].type == 0
            "
          >
            <image
              class="icon-md m-r-20"
              src="/static/images/icon_address.png"
            ></image>
            <view class="flex-1 m-r-20">
              <view class="black md" v-if="!address.contact">设置收货地址</view>
              <view v-else>
                <text class="name md m-r-10">{{ address.contact }}</text>
                <text class="phone md">{{ address.telephone }}</text>
                <view class="area sm m-t-10 lighter">
                  {{ address.province }} {{ address.city }}
                  {{ address.district }} {{ address.address }}
                </view>
              </view>
            </view>
            <u-icon name="arrow-right"></u-icon>
          </view>
        </navigator>
        <!-- 拼团商品 -->
        <navigator
          hover-class="none"
          url="/bundle/pages/user_address/user_address?type=1"
        >
          <view
            class="address flex bg-white"
            v-if="
              teamId !== undefined &&
              shopLists.length != 0 &&
              shopLists.delivery_type == 1
            "
          >
            <image
              class="icon-md m-r-20"
              src="/static/images/icon_address.png"
            ></image>
            <view class="flex-1 m-r-20">
              <view class="black md" v-if="!address.contact">设置收货地址</view>
              <view v-else>
                <text class="name md m-r-10">{{ address.contact }}</text>
                <text class="phone md">{{ address.telephone }}</text>
                <view class="area sm m-t-10 lighter">
                  {{ address.province }} {{ address.city }}
                  {{ address.district }} {{ address.address }}
                </view>
              </view>
            </view>
            <u-icon name="arrow-right"></u-icon>
          </view>
        </navigator>

        <!-- 其他商品 -->
        <block v-if="teamId == undefined">
          <view
            class="goods contain"
            v-for="(item, index) in shopLists"
            :key="index"
          >
            <order-shop
              :order-type="orderInfo.order_type"
              :item="item"
              :invoice="invoiceArr"
              @changeremark="changeRemark"
              @changecoupon="changeCoupon($event, index)"
              @changeDeliveryType="changeDeliveryType($event, item)"
              :teamId="teamId"
              :bargainLaunchId="bargainLaunchId"
            ></order-shop>
          </view>
        </block>
        <!-- 拼团商品 -->
        <block
          v-if="teamId !== undefined && teamLists.delivery_types_arr.length"
        >
          <view class="goods contain">
            <order-shop
              :order-type="orderInfo.order_type"
              :item="shopLists"
              :invoice="invoiceArr"
              @changeremark="changeRemark"
              @changeDeliveryType="changeDeliveryType($event, shopLists)"
              :teamId="teamId"
              :bargainLaunchId="bargainLaunchId"
            ></order-shop>
          </view>
        </block>
      </view>

      <view class="footer bg-white flex row-between fixed">
        <view class="all-price lg flex">
          <text>合计：</text>
          <view class="primary">
            <price-format
              weight="500"
              :first-size="36"
              :second-size="36"
              :price="orderInfo.total_amount"
            >
            </price-format>
          </view>
        </view>
        <button
          class="btn br60 white"
          size="md"
          hover-class="none"
          @tap="onSubmitOrder"
        >
          提交订单
        </button>
      </view>
    </view>

    <loading-view
      v-if="showLoading"
      background-color="transparent"
      :size="50"
    ></loading-view>
    <loading-view v-if="isFirstLoading"></loading-view>
  </view>
</template>

<script>
import { orderInfo, orderBuy, getOrderCoupon } from "@/api/order";
import { teamBuy, teamKaiTuan } from "@/api/activity";
import { prepay, getMnpNotice, getPayway } from "@/api/app";
import { wxpay, alipay } from "@/utils/pay";
// total_amount
export default {
  data() {
    return {
      isFirstLoading: true,
      showLoading: false,
      address: {
        contact: "",
        telephone: "",
        province: "",
        district: "",
        address: "",
        city: "",
      },
      orderInfo: {},
      shopLists: [],
      teamLists: {
        delivery_types_arr: [],
      },
      addressId: "",
      useIntegral: 0,
      userRemark: [],
      couponId: [],
      teamId: undefined,
      carts: [],
      type: "",
      goodsType: 1, // 0-实物商品 1-虚拟商品
      goods: "",
      bargainLaunchId: -1,
      invoiceArr: [], // 发票数组
    };
  },

  onLoad(options) {
    uni.$on("selectaddress", (e) => {
      this.addressId = e.id;
      this.orderBuyFun();
    });

    // 监听发票传回的值，
    uni.$on("invoice", (params) => {
      const index = this.invoiceArr.findIndex(
        (el) => el.shop_id == params.shop_id
      );
      if (params.del == true && this.invoiceArr.length) {
        this.invoiceArr.splice(index, 1);
      } else {
        if (index == -1) this.invoiceArr = [...this.invoiceArr, params];
        else this.invoiceArr.splice(index, 1, params);
      }
    });

    const {
      data: { goods, carts, teamId, foundId, type, goodsType },
    } = this.$Route.query;
    console.log("this.$Route.query", this.$Route.query);
    this.goods = goods;
    this.bargainLaunchId = goods[0].bargain_launch_id || -1;
    this.carts = carts || [];
    this.type = type;
    this.goodsType = goodsType;
    this.teamId = teamId;
    // 参团的id，如果为空的话就是开团，如果有数据就是参团
    this.foundId = foundId || "";

    this.orderBuyFun();
  },

  onUnload() {
    uni.$off("selectaddress");
    uni.$off("payment");
    uni.$off("invoice");
  },
  computed: {
    deliveryType() {
      if (this.teamId) {
        return;
      }
      return this.shopLists.every((i) => {
        return i.delivery_type == 2;
      });
    },
  },

  methods: {
    // 备注
    changeRemark(e) {
      let index = this.userRemark.findIndex(
        (item) => item.shop_id == e.shop_id
      );
      if (index == -1) {
        this.userRemark.push(e);
      } else {
        this.userRemark[index].remark = e.remark;
      }
      this.userRemark = this.userRemark.filter((item) => item.remark);
    },

    // 选中优惠券
    changeCoupon(e, index) {
      this.couponId[index] = e;
      this.orderBuyFun();
    },

    // 选择对应的配送方式赋值给商品中的配送方式
    changeDeliveryType(type, row) {
      row.delivery_type = type;
      for (let i = 0; i < this.goods.length; i++) {
        const item = this.goods[i];
        if (row.shop_id == item.shop_id) {
          this.goods[i].delivery_type = type;
          console.log(this.goods[i].delivery_type, this.shopLists);
        }
      }
      this.orderBuyFun();
    },

    getAuthMsg() {
      return new Promise((resolve) => {
        getMnpNotice({
          scene: 1,
        }).then((res) => {
          if (res.code == 1) {
            uni.requestSubscribeMessage({
              tmplIds: res.data,

              fail(res) {
                console.log(res.errMsg);
              },

              complete() {
                resolve();
              },
            });
          } else {
            resolve();
          }
        });
      });
    },

    onSubmitOrder() {
      uni.showModal({
        title: "温馨提示",
        content: "是否确认下单?",
        confirmColor: "#FF2C3C",
        success: async (res) => {
          let { confirm } = res;
          if (confirm) {
            // #ifdef MP-WEIXIN
            await this.getAuthMsg();
            //#endif
            this.showLoading = true;
            this.orderBuyFun("submit");
          }
        },
      });
    },

    async orderBuyFun(action = "info") {
      const {
        userRemark,
        useIntegral,
        carts,
        goods,
        bargainLaunchId,
        couponId,
        shopLists,
      } = this;
      const submitObj = {
        goods: JSON.stringify(goods),
        address_id: this.addressId || 0,
        cart_id: carts.join(),
        coupon_id: couponId.filter((item) => item),
        // bargain_launch_id是砍价的判断
        bargain_launch_id:
          this.bargainLaunchId == -1 ? "" : this.bargainLaunchId,
        goods_type: this.goodsType,
      };

      // 判断是不是拼团的，并且是获取订单数据
      if (this.teamId && action == "info") {
        delete submitObj.goods;
        submitObj.action = "info";
        submitObj.item_id = this.goods[0].item_id;
        submitObj.delivery_type = this.goods[0].delivery_type;
        submitObj.count = this.goods[0].num;
        submitObj.goods_id = this.goods[0].goods_id;
        submitObj.team_id = this.teamId;
      }
      // 判断是不是拼团的，并且是提交订单
      if (this.teamId && action == "submit") {
        console.log(this.goods[0], this.shopLists);
        submitObj.action = "buy";
        submitObj.item_id = this.goods[0].item_id;
        submitObj.delivery_type = this.goods[0].delivery_type;
        submitObj.count = this.goods[0].num;
        submitObj.goods_id = this.goods[0].goods_id;
        submitObj.team_id = this.foundId;
      }

      if (!this.teamId && action == "submit") {
        // 拿第一个店铺的 delivery_type 类型，虚拟商品不能加入购物车所以不用考虑会虚拟商品和实物商品出错
        console.log("this.goods", this.goods, this.shopLists);
        //TODO TODO  TODO
        submitObj.delivery_type = this.shopLists[0].delivery_type || 0;
        this.shopLists.forEach((item, index) => {
          goods.map((i) => {
            if (i.shop_id == item.shop_id) {
              i.delivery_type = item.delivery_type;
            }
          });
        });
        submitObj.goods = JSON.stringify(goods);
        submitObj.remark = userRemark.length ? JSON.stringify(userRemark) : "";
        submitObj.invoice = JSON.stringify(this.invoiceArr);
      }

      let {
        data: orderData,
        code: orderCode,
        msg: orderMsg,
      } = action == "info"
        ? this.teamId
          ? await teamKaiTuan(submitObj)
          : await orderInfo(submitObj)
        : this.teamId
        ? await teamKaiTuan(submitObj)
        : await orderBuy(submitObj);
      // 如果是info的话说明是获取订单数据，？用拼团的id判断当前是否是拼团，是的话调用teamKaiTuan，不是的话调用普通订单获取orderInfo
      // ：判断是不是拼团订单，是的话调用teamKaiTuan提交拼团订单，否则就是普通订单orderBuy

      if (orderMsg == "抱歉,库存不足") {
        setTimeout(() => {
          uni.navigateBack(1);
        }, 500);
      }

      if (orderCode !== 1) return (this.showLoading = false);

      if (action == "info") {
        const { shop, address } = orderData;
        this.address = address;
        this.shopLists = shop;
        this.teamLists = shop;
        this.orderInfo = orderData;
        console.log("orderData", orderData);
        this.$nextTick(() => {
          this.isFirstLoading = false;
        });
      } else if (action == "submit") {
        this.showLoading = false;
        const { shop } = orderData;
        this.shopLists = shop;
        console.log("orderData2", orderData);

        let order_id = "";
        const type = orderData.type;

        switch (type) {
          case "order":
            order_id = orderData.order_id;
            break;
          case "trade":
            order_id = orderData.trade_id;
            break;
        }

        uni.$on("payment", (params) => {
          setTimeout(() => {
            if (params.result) {
              console.log("Jason", this);
              this.$Router.replace({
                path: "/pages/pay_result/pay_result",
                query: {
                  id: params.order_id,
                  from: params.from,
                },
              });
            } else {
              this.$Router.replace({
                path: "/bundle/pages/user_order/user_order",
              });
            }
          }, 1 * 1000);
        });

        uni.navigateTo({
          url: `/pages/payment/payment?from=${type}&order_id=${order_id}`,
        });
      }
    },
  },
  watch: {
    address(val) {
      this.addressId = val.id;
    },
  },
};
</script>
<style lang="scss" scoped>
.confirm-order {
  .confirm-con {
    overflow: hidden;
    padding-bottom: calc(120rpx + env(safe-area-inset-bottom));

    .address {
      min-height: 164rpx;
      padding: 0 24rpx;
      border-radius: 14rpx;
      margin: 20rpx 20rpx 0;
    }

    .img-line {
      height: 1.5px;
      width: 100%;
      display: block;
    }
  }

  .price {
    padding: 28rpx 20rpx;

    .item:not(:last-of-type) {
      margin-bottom: 20rpx;
    }
  }

  .contain {
    border-radius: 14rpx;
    margin: 20rpx 20rpx 0;
    background-color: #fff;
    overflow: hidden;
  }

  .radio-group {
    display: block;
  }

  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 99;
    height: 100rpx;
    padding: 0 30rpx;
    box-sizing: content-box;
    padding-bottom: env(safe-area-inset-bottom);

    .btn {
      background: linear-gradient(
        90deg,
        rgba(249, 95, 47, 1) 0%,
        rgba(255, 44, 60, 1) 100%
      );
      padding: 0 50rpx;
    }
  }
}

// .confirm-order .van-cell:after {
// 	border: none;
// }

// .goods .shop-icon {
// 	width: 40rpx;
// 	height: 40rpx;
// }

// .pop-title {
// 	height: 100rpx;
// 	border-bottom: 1rpx solid #F2F2F2;
// }

// .pop-title .title {
// 	margin-left: 30rpx;
// 	font-size: 34rpx;
// 	font-weight: bold;
// 	line-height: 36rpx;
// }
</style>

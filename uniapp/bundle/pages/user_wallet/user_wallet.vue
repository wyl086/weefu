<template>
  <view class="user-wallet">
    <view class="contain bg-white m-b-20">
      <!-- 资产总计 -->
      <view class="header">
        <view class="white m-b-20">
          <view class="xs">总资产(元)</view>
          <view style="font-size: 76rpx">{{
            wallet.user_money || "0.00"
          }}</view>
        </view>
        <view class="money white flex">
          <view class="item">
            <view class="xs">累计充值(元)</view>
            <view style="font-size: 38rpx">{{
              wallet.total_recharge_amount || "0.00"
            }}</view>
          </view>
          <view class="item">
            <view class="xs">累计消费(元)</view>
            <view style="font-size: 38rpx">{{
              wallet.total_order_amount || "0.00"
            }}</view>
          </view>
          <template v-if="wallet.open_racharge">
            <router-link
              style="height: 58rpx"
              class="flex primary bg-white br60 btn"
              size="xs"
              to="/bundle/pages/user_payment/user_payment"
              >充值</router-link
            >
          </template>
        </view>
      </view>

      <!-- 资金明细 -->
      <view class="nav flex">
        <!-- <router-link class="nav-item">
					<view class="flex-col col-center">
						<image class="icon" src="../../static/icon_yezz.png"></image>
						<view class="m-t-10 sm">余额转账</view>
					</view>
				</router-link> -->
        <router-link class="nav-item" to="/bundle/pages/user_bill/user_bill">
          <view class="flex-col col-center">
            <image class="icon" src="../../static/icon_zhmx.png"></image>
            <view class="m-t-10 sm">账户明细</view>
          </view>
        </router-link>
        <!-- 	<router-link class="nav-item">
					<view class="flex-col col-center">
						<image class="icon" src="../../static/icon_zzjl.png"></image>
						<view class="m-t-10 sm">转账记录</view>
					</view>
				</router-link> -->
        <router-link
          class="nav-item"
          to="/bundle/pages/recharge_record/recharge_record"
        >
          <view class="flex-col col-center">
            <image class="icon" src="../../static/icon_czjl.png"></image>
            <view class="m-t-10 sm">充值记录</view>
          </view>
        </router-link>
      </view>

      <!-- 热门活动 -->
      <view class="activity">
        <view class="activity-title xl flex">
          <view
            class="m-r-20 bg-primary"
            style="width: 6rpx; height: 30rpx"
          ></view>
          <text>热门活动</text>
        </view>
        <block v-for="(item, index) in activityList" :key="item.title">
          <view
            class="activity-item flex row-between"
            :style="{ backgroundColor: item.background }"
          >
            <view>
              <view class="xl normal" style="font-weight: 500">{{
                item.title
              }}</view>
              <view class="muted sm m-t-10">{{ item.slogan }}</view>
              <router-link style="display: inline-block" :to="item.href">
                <view
                  :style="{ backgroundColor: item.buttonColor }"
                  class="br60 white join-btn flex row-center"
                  >立即参与</view
                >
              </router-link>
            </view>
            <image
              style="width: 274rpx; height: 210rpx"
              :src="item.image"
            ></image>
          </view>
        </block>
      </view>
    </view>
  </view>
</template>

<script>
// +----------------------------------------------------------------------
// | multshop开源商城系统
// +----------------------------------------------------------------------
// | 欢迎阅读学习系统程序代码，建议反馈是我们前进的动力
// | gitee下载：https://gitee.com/multshop_gitee
// | github下载：https://github.com/multshop-github
// | 访问官网：https://www.multshop.cn
// | 访问社区：https://home.multshop.cn
// | 访问手册：http://doc.multshop.cn
// | 微信公众号：multshop技术社区
// | multshop系列产品在gitee、github等公开渠道开源版本可免费商用，未经许可不能去除前后端官方版权标识
// |  multshop系列产品收费版本务必购买商业授权，购买去版权授权后，方可去除前后端官方版权标识
// | 禁止对系统程序代码以任何目的，任何形式的再发布
// | multshop团队版权所有并拥有最终解释权
// +----------------------------------------------------------------------
// | author: multshop.cn.team
// +----------------------------------------------------------------------

import { getWallet } from "@/api/user";
export default {
  data() {
    return {
      wallet: {},
      // 热门活动列表数据
      activityList: [
        {
          title: "领取优惠券",
          slogan: "每日优惠券抢不停",
          button: "立即抢购",
          buttonColor: "#FC597A",
          href: "/bundle/pages/get_coupon/get_coupon",
          image: "/bundle/static/img_activity_coupon.png",
          background: "rgba(252, 89, 122, 0.1)",
        },
        {
          title: "超值商品 限时秒杀",
          slogan: "最新商品秒杀中",
          button: "立即抢购",
          buttonColor: "#FF2C3C",
          href: "/bundle/pages/goods_seckill/goods_seckill",
          image: "/bundle/static/img_activity_seckill.png",
          background: "rgba(236, 71, 37, 0.1)",
        },
      ],
    };
  },

  onShow() {
    this.getWalletFun();
  },

  methods: {
    getWalletFun() {
      getWallet().then((res) => {
        if (res.code == 1) {
          this.wallet = res.data;
        }
      });
    },
  },
};
</script>
<style lang="scss">
.user-wallet {
  .contain {
    padding: 20rpx 30rpx 36rpx;

    .header {
      position: relative;
      background: linear-gradient(
        180deg,
        rgba(255, 44, 60, 1) 0%,
        rgba(255, 49, 106, 1) 100%
      );
      border-radius: 20rpx;
      height: 320rpx;
      padding: 50rpx 30rpx 30rpx;
      box-sizing: border-box;

      .money {
        .item {
          flex: 1;
        }
      }

      .btn {
        position: absolute;
        right: 30rpx;
        top: 50rpx;
        padding: 0 51rpx;
      }
    }

    .nav {
      border-bottom: $-solid-border;

      .nav-item {
        width: 25%;
        padding: 40rpx 0;

        .icon {
          width: 52rpx;
          height: 52rpx;
        }
      }
    }
  }
}

.activity {
  padding: 40rpx 0rpx;

  .activity-title {
    font-weight: bold;
  }

  .activity-item {
    padding: 15rpx 40rpx;
    // box-shadow: 0px 0rpx 20rpx rgba(0, 0, 0, 0.16);
    margin-top: 34rpx;

    .join-btn {
      height: 52rpx;
      width: 156rpx;
      margin-top: 24rpx;
    }
  }
}
</style>

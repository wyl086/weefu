<template>
  <view>
    <view class="cancel">
      <view class="lg">
        为保证你的账号安全，在你提交的注销申请生效前，需同时满足以下条件：
      </view>
      <view class="lg m-t-40">
        <view> 1、账号处于安全状态 </view>
        <view class="muted sm">账号当前为有效账号，非冻结状态。</view>
      </view>
      <view class="lg m-t-40">
        <view> 2、账号内财产已结清，交易已完成 </view>
        <view class="muted sm"
          >账号下所有关联业务的资产及预期收益（包括现金、余额、佣金、积分、优惠券）均已结清、退款、清空或自愿放弃，所有交易已完成或自愿放弃。</view
        >
      </view>
      <button class="btn" type="primary" @click="showPopup = true">
        申请注销
      </button>
    </view>
    <u-popup
      v-model="showPopup"
      mode="bottom"
      border-radius="14"
      :closeable="false"
      :safe-area-inset-bottom="true"
      mask-close-able
    >
      <view class="popup_header">
        <text>提示</text>
        <u-icon name="close" color="#666666" @tap="showPopup = false" />
      </view>
      <view class="popup_body">
        <view
          >注销后，
          <text class="tip"> 你的账号信息将永久清空无法恢复 </text>
        </view>
        <view class="popup_body_container">
          <view>·你的个人相关数据将会被清空且无法恢复</view>
          <view class="m-t-10">·你账号内剩余的余额、资产也将无法恢复</view>
        </view>
        <view class="m-t-30">
          <u-checkbox
            v-model="isAgree"
            :active-color="'#ff2c3c'"
            shape="circle"
            :label-disabled="true"
          >
            <view class="sm flex">
              我已阅读并同意
              <router-link
                data-theme=""
                to="/bundle/pages/server_explan/server_explan?type=4"
              >
                <view class="agreement" :style="{ color: '#ff2c3c' }"
                  >《 用户注销协议 》</view
                >
              </router-link>
            </view>
          </u-checkbox>
        </view>
        <view class="flex row-around m-t-30 btn-pop">
          <button class="btn_cancel" @click="showPopup = false">取消</button>
          <button
            class="btn_comfirm"
            :style="{ 'background-color': isAgree ? ' #ff2c3c' : '#CFCFCF' }"
            @click="handleCancel"
          >
            <u-loading mode="circle" :show="loading" />
            <text class="m-l-10"> 确认注销 </text>
          </button>
        </view>
      </view>
    </u-popup>
  </view>
</template>
<script>
import { apiuserDelete, apiuserDeletecheck } from "@/api/user";

import store from "@/store";
import { getuserProto } from "@/api/app";
export default {
  data() {
    return {
      showPopup: false,
      isAgree: false,
      loading: false,
      AgreemenName: "",
    };
  },
  methods: {
    // 获取服务协议
    getPolicyAgreement() {
      getuserProto().then((res) => {
        this.AgreemenName = res.name;
      });
    },
    async handleCancel() {
      if (!this.isAgree)
        return this.$toast({
          title: "请先阅读并同意《用户注销协议》",
        });
      this.loading = true;
      const { data } = await apiuserDeletecheck();
      console.log(data.pass);
      if (data.pass === 1) {
        const data = await apiuserDelete();
      }
      this.$Router.replaceAll({
        path: "/bundle/pages/cancel_result/cancel_result",
        query: { pass: data.pass },
      });
    },
  },
  onLoad() {
    this.getPolicyAgreement();
  },
};
</script>
<style lang="scss">
page {
  height: 100%;
  background-color: white;
  .cancel {
    height: 100%;

    padding: 42rpx;
  }
  .btn {
    height: 80rpx;
    line-height: 80rpx;
    position: fixed;
    bottom: env(safe-area-inset-bottom);
    bottom: constant(safe-area-inset-bottom);
    // #ifdef APP
    bottom: 30rpx;
    // #endif
    left: 42rpx;
    right: 42rpx;
  }
  .popup_header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100rpx;
    padding: 0 30rpx;
    font-weight: 500;
    font-size: 26rpx;
    background-color: #ffffff;
  }
  .popup_body {
    padding: 42rpx;
    font-size: 26rpx;
    .tip {
      font-weight: 500;
    }
    &_container {
      margin-top: 30rpx;
      background-color: #f7f7f7;
      padding: 42rpx;
    }
    .btn-pop {
      height: 80rpx;
      line-height: 80rpx;
    }
    .btn_comfirm {
      border-radius: 50rpx;
      width: 250rpx;
      height: 80rpx;
      line-height: 80rpx;
      color: white;
    }
    .btn_cancel {
      border-radius: 50rpx;
      width: 250rpx;
      height: 80rpx;
      line-height: 80rpx;
      border: 1px solid rgba(230, 230, 230, 1);
    }
  }
}
</style>

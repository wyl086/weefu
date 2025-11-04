<template>
  <view>
    <mescroll-body
      ref="mescrollRef"
      @init="mescrollInit"
      @down="downCallback"
      @up="upCallback"
      :up="{
        use: false,
        toTop: {
          bottom: '300rpx',
        },
      }"
    >
      <view class="index index-bg" :style="[headerStyle]">
        <u-sticky offset-top="0" h5-nav-height="0" bg-color="transparent">
          <view class="index-bg" :style="[headerStyle]">
            <u-navbar
              :is-fixed="false"
              :border-bottom="false"
              :background="{ background: 'transparent' }"
              :is-back="false"
            >
              <view class="flex-1 flex row" style="position: relative">
                <!-- 城市 -->
                <router-link
                  v-if="appConfig.is_open_nearby"
                  class="m-l-16 flex white row-center"
                  to="/bundle_b/pages/city/city"
                >
                  <text class="m-r-6">{{ cityInfo.name || "选择" }}</text>
                  <u-icon name="arrow-down" size="24" color="#FFFFFF"></u-icon>
                  <!-- <image class="icon-md m-l-30" src="/static/images/icon_news.png">
								</image> -->
                </router-link>
                <view class="flex-1">
                  <router-link to="/pages/goods_search/goods_search">
                    <u-search
                      wrap-bg-color="transparent"
                      bg-color="#fff"
                      :disabled="true"
                      :height="62"
                    >
                    </u-search>
                  </router-link>
                </view>

                <!-- #ifdef MP -->
                <view class="capsule-tips flex row-between" v-if="offPrompt">
                  <text class="m-r-10"
                    >添加到”我的小程序”，红包、优惠不错过</text
                  >
                  <u-icon
                    name="close"
                    color="#FFFFFF"
                    @click="clearIntervalFunc"
                  ></u-icon>
                </view>
                <!-- #endif -->
              </view>
            </u-navbar>
            <view class="flex">
              <view class="flex-1" style="min-width: 600rpx">
                <u-tabs
                  active-color="#fff"
                  inactive-color="#fff"
                  :current="active"
                  :list="cateList"
                  bg-color="transparent"
                  :active-item-style="{ fontSize: '32rpx' }"
                  :bar-width="64"
                  :bold="false"
                  :barStyle="{
                    background:
                      'linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, #FFFFFF 49%, rgba(255, 255, 255, 0) 100%)',
                  }"
                  @change="changeActive"
                >
                </u-tabs>
              </view>
              <router-link to="/pages/goods_cate/goods_cate" navType="pushTab">
                <view class="white flex cate-btn m-l-10">
                  <image
                    class="icon-xs m-r-4"
                    src="/static/images/icon_cate.png"
                    alt=""
                  />
                  分类
                </view>
              </router-link>
            </view>
          </view>
        </u-sticky>
        <view class="tab-con">
          <view v-show="active == 0">
            <index-home
              ref="indexHome"
              :home-data="homeData"
              :nav-list="navList"
              :live-list="liveLists"
            >
            </index-home>
            <goods-column
              ref="mescrollItem"
              :autoGetData="false"
            ></goods-column>
          </view>
          <template v-for="(item, index) in cateList">
            <view
              v-if="index > 0"
              class="tab-item"
              v-show="active == index"
              :key="index"
            >
              <view>
                <cate-home
                  v-if="showCateList[index]"
                  :top="cateTop"
                  ref="cateItem"
                  :i="index"
                  :index="active"
                  :cate="item"
                >
                </cate-home>
              </view>
            </view>
          </template>
        </view>
      </view>
      <!-- #ifdef APP-PLUS -->
      <lyg-popup
        v-if="appConfig.app_agreement"
        title="用户使用及隐私保护政策提示"
        protocolPath="/bundle/pages/server_explan/server_explan?type=0"
        policyPath="/bundle/pages/server_explan/server_explan?type=1"
        policyStorageKey="has_read_privacy"
      >
      </lyg-popup>
      <!-- #endif -->
      <!-- #ifdef MP-WEIXIN -->
      <!-- 用户隐私协议弹框 -->
      <privacy-popup v-model="showPrivacyPopup"></privacy-popup>
      <!-- #endif -->
    </mescroll-body>

    <tabbar></tabbar>

    <!-- 无网络提示 -->
    <u-no-network z-index="1200" @retry="handleRetry"></u-no-network>
  </view>
</template>

<script>
import MescrollCompMixin from "@/components/mescroll-uni/mixins/mescroll-comp";
import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins";
import { mapGetters, mapMutations, mapActions } from "vuex";
import { getMenu, getHome, getHotGoods, getLevelOneList } from "@/api/store";
import { getConfig } from "@/api/app";
import { getLiveLists } from "@/api/live";
import { getRect } from "@/utils/tools";
const app = getApp();
const homeItem = {
  name: "首页",
};
export default {
  mixins: [MescrollMixin, MescrollCompMixin],
  data() {
    return {
      offPrompt: true,
      active: 0,
      navBg: 0,
      goodsList: [],
      homeData: {},
      navList: [],
      enable: true,
      cateList: [homeItem],
      showCateList: [],
      liveLists: [],
      showPrivacyPopup: false, //微信用户隐私协议
    };
  },
  async onLoad(options) {
    // #ifdef MP-WEIXIN
    wx.getPrivacySetting({
      success: (res) => {
        console.log(res, "------"); // 返回结果为: res = { needAuthorization: true/false, privacyContractName: '《xxx隐私保护指引》' }
        if (res.needAuthorization) {
          // 需要弹出隐私协议
          this.showPrivacyPopup = true;
        }
      },
      fail: (err) => {
        console.log(err);
      },
    });
    // #endif

    // 选择城市后是否刷新
    if (options?.refresh) await this.getHomeFun();
    // 监听是否刷新页面，目前秒杀时会用到
    uni.$on("refreshhome", () => {
      this.getHomeFun();
    });
    // #ifdef MP-WEIXIN
    this.getLiveListsFun();
    // #endif
  },
  onUnload() {
    uni.$off("refreshhome");
  },
  onShow() {
    this.enable = this.active == 0 ? true : false;
    this.getCartNum();
  },
  onHide() {
    // #ifdef H5
    this.enable = false;
    // #endif
  },
  onReady() {
    // #ifdef MP
    // 关闭胶囊提示
    this.offPromptFunc();
    // #endif
  },
  methods: {
    ...mapActions(["getCartNum", "getUser", "wxShare", "initLocationFunc"]),
    ...mapMutations(["setConfig"]),
    // 网络重试刷新网络请求（解决在ios中首次进入时需要授权蜂窝加载空白页面问题
    async handleRetry() {
      console.log("网络重试刷");
      const { code, data } = await getConfig();
      if (code == 1) {
        this.setConfig(data);
        if (data.is_open_nearby) {
          // 获取定位
          this.initLocationFunc();
        }
        // 防止第一次调用时拿不到数据
        this.wxShare();
      }
      this.getUser();
    },
    // #ifdef MP
    offPromptFunc() {
      let time = 8;
      this.offPrompt = setInterval(() => {
        time -= 1;
        if (time <= 0) this.clearIntervalFunc();
      }, 1000);
    },
    clearIntervalFunc() {
      clearInterval(this.offPrompt);
      this.offPrompt = false;
    },
    // #endif
    // 获取1级分类
    async getLevelOneListFun() {
      const { code, data } = await getLevelOneList();
      if (code == 1) {
        this.cateList = [homeItem, ...data];
        this.showCateList = [];
      }
    },
    // 获取菜单
    async getMenuFun() {
      const { code, data } = await getMenu({
        type: 1,
      });
      if (code == 1) {
        this.navList = data;
      }
    },
    // 获取首页数据
    async getHomeFun() {
      const { code, data } = await getHome({ city_id: this.cityInfo.id });
      if (code == 1) {
        this.homeData = data;
      }
    },
    // #ifdef MP-WEIXIN
    async getLiveListsFun() {
      const { code, data } = await getLiveLists({ page_size: 6, page_no: 1 });
      if (code == 1) {
        this.liveLists = data.list;
      }
    },
    // #endif
    changeActive(index) {
      this.active = index;
      this.enable = index == 0;
      this.mescroll.optDown.use = index == 0;
      this.showCateList[index] = true;
    },
    async downCallback() {
      await this.getLevelOneListFun();
      await this.getMenuFun();
      await this.getHomeFun();
      // #ifdef MP-WEIXIN
      this.getLiveListsFun();
      // #endif
      this.$refs.mescrollItem.getData();
      this.mescroll.endSuccess(0, false);
    },
  },
  computed: {
    ...mapGetters(["sysInfo", "inviteCode", "appConfig", "cityInfo"]),
    navH() {
      return this.sysInfo.navHeight + "px";
    },
    // 分类栏悬浮高度
    cateTop() {
      return this.sysInfo.navHeight + uni.upx2px(80) + "px";
    },
    headerStyle() {
      const { active, cateList, appConfig } = this;
      let bg = cateList[active].bg_image;
      if (active == 0) {
        bg = appConfig.index_setting.top_bg_image;
      }
      return bg
        ? {
            "background-image": `url(${bg})`,
          }
        : {};
    },
  },
};
</script>

<style lang="scss">
page {
  padding: 0;
}
.index-bg {
  background-image: url("../../static/images/index_bg.png");
  background-size: 100% auto;
  background-repeat: no-repeat;
}

.index {
  min-height: calc(100vh - var(--window-bottom));

  .u-navbar {
    ::v-deep .u-search {
      padding: 0 30rpx;
    }
  }

  // 胶囊提示
  .capsule-tips {
    width: 584rpx;
    color: #ffffff;
    padding: 12rpx 18rpx;
    border-radius: 14rpx;
    background: rgba(0, 0, 0, 0.7);
    position: relative;
    position: absolute;
    z-index: 9999;
    bottom: -80rpx;
    right: -150rpx;
  }
  .capsule-tips::after {
    content: "";
    border-bottom: 14rpx solid rgba(0, 0, 0, 0.7);
    border-right: 14rpx solid transparent;
    border-left: 14rpx solid transparent;
    position: absolute;
    top: -14rpx;
    right: 88rpx;
  }

  .cate-btn {
    padding: 12rpx 16rpx 12rpx 20rpx;
    border-radius: 60rpx 0 0 60rpx;
    background-color: rgba(256, 256, 256, 0.4);
  }
}
</style>

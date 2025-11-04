<template>
  <view class="shop-street">
    <mescroll-body
      v-if="appConfig.shop_street_hide"
      ref="mescrollRef"
      @init="mescrollInit"
      @down="downCallback"
      @up="upCallback"
      :up="upOption"
    >
      <view class="shop-street-content">
        <view class="search bg-white flex flex-1 flex row">
          <!-- 城市 -->
          <router-link
            v-if="appConfig.is_open_nearby"
            class="m-l-16 flex black row-center"
            to="/bundle_b/pages/city/city"
          >
            <text class="m-r-6">{{ cityInfo.name || "选择" }}</text>
            <u-icon name="arrow-down" size="24" color="#000000"></u-icon>
            <!-- <image class="icon-md m-l-30" src="/static/images/icon_news.png">
							</image> -->
          </router-link>
          <view class="flex-1">
            <u-search
              v-model="keyword"
              @search="onReflesh"
              bg-color="#F4F4F4"
              placeholder="搜索关键词"
            ></u-search>
          </view>
        </view>
        <scroll-view
          class="bg-white"
          :scroll-x="true"
          :scroll-with-animation="true"
        >
          <view class="store-category p-t-20">
            <view
              class="category-item flex-col col-center"
              @tap="changeActive(-1)"
            >
              <view
                class="icon-wrap"
                :style="{
                  borderColor: active == -1 ? colorConfig.primary : '',
                }"
              >
                <u-image
                  width="68rpx"
                  height="68rpx"
                  border-radius="60rpx"
                  src="/static/images/icon_shop_cate.png"
                />
              </view>
              <view class="xs m-t-10" :class="{ primary: active == -1 }"
                >全部</view
              >
            </view>
            <view
              class="category-item flex-col col-center"
              v-for="(item, index) in shopCategory"
              :key="index"
              @tap="changeActive(index)"
            >
              <view
                class="icon-wrap"
                :style="{
                  borderColor: active == index ? colorConfig.primary : '',
                }"
              >
                <u-image
                  width="68rpx"
                  height="68rpx"
                  border-radius="60rpx"
                  :src="item.image"
                />
              </view>
              <view class="xs m-t-10" :class="{ primary: active == index }">{{
                item.name
              }}</view>
            </view>
          </view>
        </scroll-view>
        <view class="store-container">
          <view class="m-t-20" v-for="(item, index) in shopList" :key="index">
            <shop-item :item="item"></shop-item>
          </view>
        </view>
      </view>
    </mescroll-body>
    <view v-else>
      <view class="p-b-20" v-if="hotGoods.length">
        <goods-list type="one" :list="hotGoods"></goods-list>
      </view>
      <!-- <view v-else class="flex-col col-center"  style="margin-top: 200rpx;">
				<image class="img-null" src="/static/images/goods_null.png"></image>
				<view class="muted">
					暂无数据~
				</view>
			</view> -->
    </view>
  </view>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins";
import { getNearbyShops, getShopCategory } from "@/api/shop";
import { getHome } from "@/api/store";
export default {
  mixins: [MescrollMixin],
  data() {
    return {
      shopList: [],
      shopCategory: [],
      keyword: "",
      active: -1,
      upOption: {
        auto: false,
        empty: {
          icon: "/static/images/goods_null.png",
          tip: "暂无数据～",
        },
      },
      hotGoods: [],
    };
  },
  onShow() {
    this.getHomeFun();
    if (this.cityInfo) this.mescroll.resetUpScroll();
  },
  methods: {
    async downCallback() {
      await this.getShopCategoryFun();
      this.mescroll.resetUpScroll();
    },
    // 获取首页数据
    async getHomeFun() {
      const { code, data } = await getHome({ city_id: this.cityInfo.id });
      if (code == 1) {
        this.hotGoods = data.hots;
      }
    },
    onReflesh() {
      this.shopList = [];
      this.mescroll.resetUpScroll();
    },
    changeActive(index) {
      this.active = index;
      this.onReflesh();
    },
    upCallback(page) {
      let pageNum = page.num;
      let pageSize = page.size;
      const { keyword, active, shopCategory } = this;
      const cateId = active == -1 ? "" : shopCategory[active].id;
      getNearbyShops({
        page_no: pageNum,
        page_size: pageSize,
        name: keyword,
        shop_cate_id: cateId,
        city_id: this.cityInfo.id,
      })
        .then((res) => {
          if (res.code == 1) {
            let curPageData = res.data.list;
            let curPageLen = curPageData.length;
            let hasNext = !!res.data.more;
            if (page.num == 1) {
              this.shopList = [];
            }
            this.shopList = this.shopList.concat(curPageData);
            this.mescroll.endSuccess(curPageLen, hasNext);
          }
        })
        .catch((err) => {
          this.mescroll.endErr();
        });
    },
    async getShopCategoryFun() {
      const { code, data } = await getShopCategory();
      if (code == 1) {
        this.shopCategory = data;
      }
    },
  },
  computed: {
    ...mapGetters(["cityInfo"]),
  },
};
</script>

<style lang="scss">
.shop-street {
  .search {
  }

  .store-category {
    white-space: nowrap;
    padding-bottom: 10rpx;

    .category-item {
      display: inline-flex;
      padding: 0 30rpx;
      .icon-wrap {
        border: 1px solid transparent;
        border-radius: 50%;
      }
    }
  }

  .store-container {
    padding: 0 30rpx;
  }
}
</style>

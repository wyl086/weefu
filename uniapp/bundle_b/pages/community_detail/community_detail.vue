<template>
  <view>
    <!-- Main Start -->
    <view class="content-box">
      <!-- 审核失败 -->
      <view class="audit flex" v-if="communityInfo.status == 2">
        <image src="/bundle_b/static/icon_audit_fail.png"></image>
        <view class="m-l-16 primary">
          <view class="bold md">审核失败</view>
          <view class="xs m-t-6">{{ communityInfo.audit_remark_desc }}</view>
        </view>
      </view>
      <!-- 审核中 -->
      <view class="audit flex" v-if="communityInfo.status == 0">
        <image src="/bundle_b/static/icon_under_review.png"></image>
        <view class="m-l-16 primary">
          <view class="bold md">审核中</view>
          <view class="xs m-t-6">{{ communityInfo.audit_remark_desc }}</view>
        </view>
      </view>

      <!-- 内容头部信息 -->
      <view class="header flex row-between">
        <router-link
          :to="
            '/bundle_b/pages/community_user/community_user?id=' +
            communityInfo.user.id
          "
        >
          <view class="flex">
            <!-- 头像 -->
            <u-image
              width="70"
              height="70"
              :src="communityInfo.user.avatar"
              borderRadius="50%"
            ></u-image>
            <!-- 昵称 -->
            <text class="normal bold m-l-16">{{
              communityInfo.user.nickname
            }}</text>
          </view>
        </router-link>
        <view class="flex">
          <!-- 关注 -->
          <button
            class="follow-btn br60"
            size="mini"
            @click="handleFollow(1)"
            v-if="communityInfo.is_author == 0 && communityInfo.is_follow == 0"
          >
            <image src="/bundle_b/static/icon_follow.png"></image>
            <text class="m-l-6 xs">关注</text>
          </button>
          <!-- 已关注 -->
          <button
            class="followed-btn br60 sm"
            size="mini"
            @click="showFollowTips = true"
            v-if="communityInfo.is_author == 0 && communityInfo.is_follow == 1"
          >
            已关注
          </button>
          <!-- 管理 -->
          <button
            class="manage-btn br60"
            size="mini"
            @click="showManage = true"
            v-if="communityInfo.is_author"
          >
            管理
          </button>

          <!-- 转发 -->
          <button
            open-type="share"
            @click="handleShare"
            class="flex-col col--center"
            hover-class="none"
          >
            <image
              src="/bundle_b/static/icon_forward.png"
              class="share-img m-l-12"
            ></image>
          </button>
        </view>
      </view>

      <!-- 内容媒体信息 -->
      <view class="swiper-container">
        <product-swiper
          :imgUrls="communityInfo.images"
          :autoplay="false"
          borderRadius="14"
        ></product-swiper>
      </view>

      <!-- 提到的宝贝( 商品 ) -->
      <view
        class="goods-box bb flex row-between"
        @click="showGoodsPopup = true"
        v-if="communityInfo.goods_data.length"
      >
        <text class="nr lighter"
          >查看TA提到的宝贝({{ communityInfo.goods_data.length }})</text
        >
        <!-- <text class="tips xs">300+人评价</text> -->
        <view class="goods flex">
          <block
            v-for="(goodsItem, goodsIndex) in communityInfo.goods_data"
            :key="goodsIndex"
          >
            <u-image
              v-if="goodsIndex <= 2"
              :src="goodsItem.image"
              width="58"
              height="58"
              class="m-l-6"
            >
            </u-image>
          </block>
          <u-icon name="arrow-right" class="m-l-10"></u-icon>
        </view>
      </view>

      <!-- 提到的店铺( 店铺 ) -->
      <view
        class="goods-box bb flex row-between"
        @click="showShopPopup = true"
        v-if="communityInfo.shop_data.length"
      >
        <text class="nr lighter"
          >查看TA提到的店铺({{ communityInfo.shop_data.length }})</text
        >
        <!-- <text class="tips xs">300+人评价</text> -->
        <view class="goods flex">
          <block
            v-for="(shopItem, shopIndex) in communityInfo.shop_data"
            :key="shopIndex"
          >
            <u-image
              v-if="shopIndex <= 2"
              :src="shopItem.logo"
              width="58"
              height="58"
              class="m-l-6"
            >
            </u-image>
          </block>
          <u-icon name="arrow-right" class="m-l-10"></u-icon>
        </view>
      </view>

      <!-- 内容文字 -->
      <view class="content">
        <view class="text">
          {{ communityInfo.content }}
        </view>
        <view class="tags" v-if="communityInfo.topic">
          <navigator
            hover-class="none"
            :url="
              '/bundle_b/pages/community_topic/community_topic?id=' +
              communityInfo.topic.id +
              '&name=' +
              communityInfo.topic.name
            "
          >
            <text># {{ communityInfo.topic.name }}</text>
          </navigator>
        </view>
        <view class="xs muted">
          {{ communityInfo.create_time || "2022-05-20 05:13:14" }}
        </view>
      </view>
    </view>
    <!-- Main End -->

    <!-- Comment Start -->
    <view class="comment-box m-t-20 bg-white">
      <view class="comment-title bb" id="comment">
        评价 ({{ communityInfo.total_comment || "0" }}条)
      </view>

      <template v-if="isCommentLoading">
        <view class="text-center flex row-center p-50">
          <u-loading
            :color="colorConfig.primary"
            :size="40"
            mode="circle"
          ></u-loading>
          <text class="m-l-20">加载中</text>
        </view>
      </template>

      <template v-else>
        <view class="text-center p-50" v-if="!commentData.length">
          <view class="flex row-center">
            <u-image
              :src="'/static/images/news_null.png'"
              width="300"
              height="300"
            ></u-image>
          </view>
          <view class="muted m-t-40"> 还没有人评论呢, 快来抢沙发～ </view>
        </view>
        <template v-else>
          <view
            v-for="(commentItem, commentIndex) in commentData"
            :key="commentItem.id"
            @click="onSelectComment(commentIndex)"
          >
            <community-comment-list :comment="commentItem" @reply="onReply">
            </community-comment-list>
          </view>
          <!-- 加载 -->
          <view
            class="flex row-center primary nd p-50"
            v-if="more === 1 && loading"
          >
            <u-loading
              :color="colorConfig.primary"
              :size="40"
              mode="circle"
            ></u-loading>
            <text class="m-l-20">加载中</text>
          </view>
          <!-- 加载底部 -->
          <view class="text-center muted nd p-50" v-else>
            <text>没有更多了~</text>
          </view>
        </template>
      </template>
    </view>
    <!-- Comment End -->

    <!-- Footer Start -->
    <view class="footer flex bg-white">
      <view class="content-wrapper flex row-between">
        <view class="flex-1 flex" @click="handleComment">
          <view class="input nr muted">发表你的想法吧</view>
        </view>
        <view class="flex likes-box">
          <view
            class="likes"
            :class="communityInfo.is_like ? 'entry' : 'leave'"
            @click="handleLike(communityInfo.is_like)"
          ></view>
          <image class="m-l-30"></image>
          <text>{{ communityInfo.like || "0" }}</text>
        </view>
        <view class="flex" @click="toComment">
          <image src="/static/images/icon_evaluate.png" class="m-l-30"></image>
          <text>{{ communityInfo.total_comment || "0" }}</text>
        </view>
      </view>
    </view>
    <!-- Footer End -->

    <!-- 管理 -->
    <u-action-sheet
      :list="manageList"
      v-model="showManage"
      @click="handleManage"
      safe-area-inset-bottom
    >
    </u-action-sheet>

    <!-- 取消关注 -->
    <u-modal
      v-model="showFollowTips"
      :show-cancel-button="true"
      comfirm-text="取消关注"
      cancelText="再想想"
      :confirm-color="colorConfig.primary"
      :show-title="false"
      @confirm="handleFollow(0)"
    >
      <view class="flex-col col-center tips-dialog" style="padding-top: 40rpx">
        <image class="icon-lg" src="/static/images/icon_warning.png" />
        <view style="margin: 30rpx 0">确认取消关注？</view>
      </view>
    </u-modal>

    <!-- 提到的商品 -->
    <community-goods
      v-model="showGoodsPopup"
      :communityId="communityInfo.id"
    ></community-goods>

    <!-- 提到的店铺 -->
    <community-shop
      v-model="showShopPopup"
      :communityId="communityInfo.id"
    ></community-shop>

    <!-- 一级回复评论 -->
    <community-comment
      v-model="showCommentPopup"
      :communityId="communityId"
      @change="changeComment"
      :safeAreaInsetBottom="false"
    >
    </community-comment>

    <!-- 二级回复评论 -->
    <community-comment
      v-model="showCommentChildPopup"
      :communityId="communityId"
      :pid="childPid"
      @change="changeCommentChild"
      :placeholder="childPlaceholder"
      :safeAreaInsetBottom="false"
    >
    </community-comment>

    <!-- 加载 -->
    <loading-view v-if="isFirstLoading"></loading-view>

    <!-- #ifdef H5 -->
    <u-popup
      :custom-style="{ background: 'none' }"
      class="share-tips"
      v-model="showTips"
      mode="top"
    >
      <view style="overflow: hidden">
        <image src="/static/images/share_arrow.png" class="share-arrow" />
        <view class="white" style="text-align: center; margin-top: 280rpx">
          <view class="bold lg">立即分享给好友吧</view>
          <view class="sm m-t-10">点击屏幕右上角将本页面分享给好友</view>
        </view>
      </view>
    </u-popup>
    <!-- #endif -->
  </view>
</template>

<script>
import {
  apiCommunityDel,
  getCommunityDetail,
  apiCommunityFollow,
  getCommunityCommentLists,
  apiCommunityCommentLike,
} from "@/api/community.js";
import { getRect } from "@/utils/tools";
export default {
  data() {
    return {
      globalLike: false,

      communityId: "",
      communityInfo: {
        user: {
          avatar: "",
          nickname: "",
          id: null,
        },
        goods_data: [],
        shop_data: [],
        topic: {
          id: false,
          name: "",
        },
      },

      isFirstLoading: true, // 详情加载
      isCommentLoading: true, // 评论加载

      showManage: false, // 管理操作
      manageList: [
        {
          // 管理操作列表
          text: "编辑",
          color: "#333333",
          fontSize: 32,
        },
        {
          text: "删除",
          color: "#333333",
          fontSize: 32,
        },
      ],
      showFollowTips: false, // 取消关注
      showGoodsPopup: false, // 商品推荐弹窗
      showShopPopup: false, // 店铺推荐弹窗
      showTips: false, // 分享弹窗H5

      showCommentPopup: false, // 评论弹窗
      showCommentChildPopup: false, // 二级评论
      childPid: "", // 选择二级评论回复ID
      childIndex: "", // 选择的二级评论第几条
      childPlaceholder: "", // 选择的二级评论回复人名字: 回复@xxx

      toScrollArr: [], // 存储需要跳转到的滚动条高度 0-评论
      commentData: [], // 评论数据
      page: 1, // 评论分页页数
      pageSize: 10, // 评论分页数量
      more: 0, // 是否有下一页分页
      loading: false, // 加载动画
    };
  },
  onLoad() {
    this.$nextTick(() => {
      // 滚动到顶部，防止h5端出现问题
      uni.pageScrollTo({
        scrollTop: 0,
        duration: 0,
      });
      getRect("#comment").then((res) => {
        this.toScrollArr[0] = res.top;
      });
    });
    const options = this.$Route.query;
    if (options && options.scene) {
      const scene = strToParams(decodeURIComponent(options.scene));
      options.id = scene.id;
    }
    this.communityId = options.id || "";
    this.initCommunityDetail();
  },
  onShow() {},
  // 触底加载
  onReachBottom() {
    console.log("触底");
    if (this.more) {
      this.loading = true;
      this.getCommentData();
    }
  },
  // 分享朋友
  onShareAppMessage() {
    return {
      title: `${this.communityInfo.user.nickname}，TA的内容超级棒`,
      path:
        "/bundle_b/pages/community_detail/community_detail?id=" +
        this.communityId,
      imageUrl: this.communityInfo.image,
    };
  },
  methods: {
    // 初始化详情
    initCommunityDetail() {
      getCommunityDetail({
        id: this.communityId,
      }).then((res) => {
        if (res.code == 1) {
          this.communityInfo = res.data;
          setTimeout(() => {
            this.isFirstLoading && this.getCommentData();
            this.isFirstLoading = false;
          }, 600);
        } else {
          this.$toast({
            title: res.msg,
          });
          setTimeout(() => this.$Router.back(), 2000);
        }
      });
    },
    // 分享处理
    handleShare() {
      // #ifdef H5
      this.showTips = true;
      // #endif
      // #ifndef MP
      this.$store.commit("setCommunity", {
        ...this.communityInfo,
        url: "bundle_b/pages/community_detail/community_detail",
      });
      this.$store.dispatch("communityShare");
      // #endif
    },
    // 刷新评论 event 是子组件传参是否评论
    changeComment(event) {
      this.communityInfo.total_comment += 1;
      if (!event.hasOwnProperty("child")) {
        event.child = [];
      }
      this.commentData.unshift(event);
    },
    // 选择第几条评论区回复
    onSelectComment(index) {
      this.childIndex = index;
    },
    // 回复评论
    onReply(event) {
      // console.log(event)
      this.childPid = event.parentId;
      this.childPlaceholder = "回复@" + event.commentUserName;
      this.showCommentChildPopup = true;
    },
    // 改变添加子评论
    changeCommentChild(event) {
      this.commentData[this.childIndex].child.push(event);
    },
    // 获取评论
    getCommentData() {
      getCommunityCommentLists({
        article_id: this.communityId,
        page_no: this.page,
        page_size: this.pageSize,
      }).then((res) => {
        setTimeout(() => (this.isCommentLoading = false), 500);
        if (res.code == 1) {
          res.data.list.forEach((item) => {
            item.loading = false;
            this.commentData.push(item);
          });
          if (res.data.more === 1) {
            this.page += 1;
          }
          this.more = res.data.more;
          this.loading = false;
        } else {
          this.$toast({ title: res.msg });
        }
      });
    },
    // 处理需要回复的评论
    handleComment() {
      this.showCommentPopup = true;
    },
    // 管理文章
    handleManage(index) {
      // 编辑
      switch (index) {
        case 0:
          this.$Router.push({
            path: "/bundle_b/pages/published_works/published_works",
            query: {
              id: this.communityId,
            },
          });
          break;
        case 1:
          apiCommunityDel({
            id: this.communityId,
          }).then((res) => {
            if (res.code == 1) {
              this.$toast({
                title: "删除成功",
              });
              setTimeout(() => this.$Router.back(), 1000);
            }
          });
          break;
      }
    },
    // 关注 ｜ 取消关注
    handleFollow(event) {
      if (!this.isLogin) return this.$Router.push("/pages/login/login");
      apiCommunityFollow({
        follow_id: this.communityInfo.user.id,
        status: event,
      }).then((res) => {
        this.$toast({
          title: res.msg,
        });
        this.initCommunityDetail();
      });
    },
    // 点赞
    handleLike(status) {
      if (!this.isLogin) return this.$Router.push("/pages/login/login");
      this.communityInfo.is_like = !status;
      apiCommunityCommentLike({
        id: this.communityId,
        status: status ? 0 : 1,
        type: 1,
      }).then((res) => {
        if (res.code === 1) {
          if (status) this.communityInfo.like -= 1;
          else this.communityInfo.like += 1;
          // 点赞文章时 其他页面的状态也需要更改
          uni.$emit("changeItem", {
            like: this.communityInfo.like,
            is_like: this.communityInfo.is_like,
            id: this.communityId,
          });
        } else {
          this.communityInfo.is_like = status;
          this.$toast({
            title: res.msg,
          });
        }
      });
    },
    // 跳转到评论
    toComment() {
      uni.pageScrollTo({
        scrollTop: this.toScrollArr[0],
        duration: 200,
      });
    },
  },
};
</script>

<style lang="scss">
.bb {
  border-bottom: 1px solid $-color-border;
}

.content-box {
  margin-bottom: 20rpx;
  background-color: $-color-white;

  // 审核
  .audit {
    padding: 20rpx 24rpx;
    background-color: rgba($-color-primary, 0.1);

    image {
      width: 60rpx;
      height: 60rpx;
    }
  }

  // 头部-作者
  .header {
    font-size: 28rpx;
    padding: 20rpx 24rpx;

    // 更多
    .share-img {
      width: 60rpx;
      height: 60rpx;
    }

    // 关注-按钮
    .follow-btn {
      width: 118rpx;
      height: 48rpx;
      line-height: 44rpx;
      color: #ffffff;
      padding: 0;
      background: linear-gradient(90deg, #f95f2f 0%, #ff2c3c 100%);

      image {
        width: 30rpx;
        height: 30rpx;
        vertical-align: middle;
      }
    }

    // 已关注-按钮
    .followed-btn {
      width: 118rpx;
      height: 48rpx;
      line-height: 44rpx;
      color: #ffffff;
      padding: 0;
      background-color: #cccccc;
    }

    // 管理-按钮
    .manage-btn {
      width: 92rpx;
      height: 48rpx;
      line-height: 44rpx;
      padding: 0;
      border: 1px solid $-color-primary;
      color: $-color-primary;
    }
  }

  .swiper-container {
    padding: 0 20rpx;
  }

  // 推荐的商品或店铺
  .goods-box {
    padding: 15rpx 24rpx;

    .tips {
      padding: 0 10rpx;
      color: $-color-primary;
      border-radius: 20rpx;
      border: 1px solid $-color-primary;
    }
  }

  .content {
    padding: 24rpx;

    // 内容文字
    .text {
      white-space: pre-line;
      line-height: 48rpx;
      font-size: 28rpx;
      color: $-color-normal;
    }

    // 标签
    .tags {
      padding: 24rpx 0;

      text {
        margin-right: 20rpx;
        border-radius: 26rpx;
        padding: 8rpx 24rpx;
        color: $-color-primary;
        background: rgba($-color-primary, 0.1);
      }
    }
  }
}

.comment-box {
  overflow: hidden;
  padding-bottom: 140rpx;

  .comment-title {
    color: $-color-black;
    padding: 28rpx 24rpx;
    font-size: 30rpx;
  }
}

// 底部
.footer {
  width: 100%;
  height: 92rpx;
  z-index: 99;
  position: fixed;
  left: 0;
  bottom: 0;
  box-sizing: content-box;
  padding-bottom: env(safe-area-inset-bottom);
  box-shadow: 0 -4rpx 10rpx rgba(#000000, 0.1);

  .content-wrapper {
    width: 100%;
    padding: 0 30rpx;
    color: $-color-lighter;
    font-size: 28rpx;

    .input {
      width: 100%;
      border-radius: 30rpx;
      background: #f8f8f8;
      padding: 10rpx 30rpx;
    }

    image {
      width: 44rpx;
      height: 44rpx;
      margin-right: 6rpx;
    }

    // 点赞动画
    .likes-box {
      position: relative;

      .likes {
        z-index: 999;
        left: -10rpx;
        width: 120rpx;
        height: 120rpx;
        margin-right: 6rpx;
        position: absolute;
        background: url("@/static/images/likes.png") no-repeat;
        background-position: left;
        background-size: cover;
      }

      // 没点赞
      .leave {
        background-position: left;
      }

      // 点赞
      .entry {
        background-position: right;
        transition: background 0.6s steps(28);
      }
    }
  }
}

.share-tips .share-arrow {
  width: 140rpx;
  height: 250rpx;
  float: right;
  margin: 15rpx 31rpx 0 0;
}
</style>

<template>
  <view class="mask-comment">
    <u-mask :show="show" @click="show = false" duration="0"></u-mask>
    <view
      v-if="show"
      class="comment-popup bg-white"
      :style="{ bottom: !isFocus ? 0 + 'px' : tabbarBottom + height + 'px' }"
      @click="isFocus = true"
    >
      <!-- tabbarBottom+height -->
      <view class="comment-popup-header flex row-between">
        <view class="lg normal" @click.stop="show = false">取消</view>
        <view class="lg bold">评论</view>
        <view class="primary lg" @click.stop="handleComment">确定</view>
      </view>

      <view class="comment-popup-content">
        <textarea
          class="comment-popup-textarea"
          cols="30"
          rows="10"
          v-model="content"
          :focus="isFocus"
          :auto-focus="true"
          :placeholder="commentPlaceholder"
          disable-default-padding
          :show-confirm-bar="false"
          @focus="handleFocus"
          @blur="handleBlur"
          fixed
          :adjust-position="false"
        ></textarea>
      </view>
    </view>
  </view>
</template>

<script>
import { mapGetters } from "vuex";
import { apiCommunityCommentAdd } from "@/api/community.js";
import { currentPage, trottle } from "@/utils/tools.js";
import { isWeixinClient, isAndroid, getClient } from "@/utils/tools.js";
import { Client } from "@/utils/type.js";
export default {
  name: "community-comment",
  props: {
    value: {
      type: Boolean,
    },
    communityId: {
      type: [Number, String],
    },
    pid: {
      type: [String, Number],
    },
    placeholder: {
      type: [String, Number],
      default: "发表你的想法吧...",
    },
    safeAreaInsetBottom: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isFocus: true, // 是否触发键盘
      height: 0, // 键盘高度
      content: "", // 评论内容
    };
  },
  computed: {
    ...mapGetters(["sysInfo"]),
    commentPlaceholder() {
      return this.placeholder;
    },
    // 弹窗Popup显示状态
    show: {
      get: function () {
        return this.value;
      },
      set: function (value) {
        this.$emit("input", value);
      },
    },
    tabbarBottom() {
      if (this.safeAreaInsetBottom) {
        console.log("???");
        // #ifdef MP
        let safeArea = this.sysInfo.safeArea;
        let bottom = this.sysInfo.screenHeight - safeArea.bottom;
        // 获取菜单按钮的位置信息
        let rect = uni.getMenuButtonBoundingClientRect();
        // 计算底部tab栏的高度
        return bottom + rect.bottom - rect.top + 15;
        // #endif
        // #ifndef MP
        return 50;
        // #endif
      } else {
        return 0;
      }
    },
  },
  mounted() {
    this.handleComment = trottle(this.handleComment, 500, this);
  },

  methods: {
    // 需要输入时
    async handleFocus(event) {
      this.isFocus = true;
      if (currentPage().route == "pages/community/community") {
        this.height = event.detail.height - 54;
      } else {
        // #ifdef APP-PLUS
        const res = await getClient();
        switch (res) {
          case Client["IOS"]:
            console.log(event.detail.height, "-------");
            this.height = event.detail.height - 108;
            break;
          case Client["ANDROID"]:
            this.height = event.detail.height;
            break;
          default:
            this.height = event.detail.height;
            break;
        }
        // #endif
        // #ifdef MP||H5
        this.height = event.detail.height;
        // #endif
      }
    },
    // 失去焦点时
    handleBlur() {
      this.isFocus = false;
    },
    // 评论
    handleComment() {
      if (!this.isLogin) return this.$Router.push("/pages/login/login");
      apiCommunityCommentAdd({
        article_id: this.communityId,
        pid: this.pid,
        comment: this.content,
      }).then((res) => {
        this.$toast({ title: res.msg });
        if (res.code == 1) {
          this.show = false;
          this.$emit("change", res.data);
          this.content = "";
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.comment-popup {
  width: 100%;
  height: 340rpx;
  border-radius: 20rpx 20rpx 0 0;
  position: fixed;
  z-index: 9999;
  bottom: 0;
  left: 0;
  padding-bottom: env(safe-area-inset-bottom);

  .comment-popup-header {
    view {
      padding: 28rpx 30rpx;
    }
  }

  .comment-popup-content {
    height: 240rpx;
    padding: 20rpx;

    .comment-popup-textarea {
      width: 100%;
      box-sizing: border-box;
      height: 200rpx;
      background: #f8f8f8;
      border-radius: 14rpx;
      padding: 20rpx;
    }
  }
}
</style>

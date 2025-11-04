<template>
  <view class="community">
    <template v-if="appConfig.is_open_community">
      <like-header @change="handleNav" :current="currentNav" />
      <view class="container">
        <follow
          :active="currentNav"
          v-show="currentNav === 0"
          @share="handleShare"
        ></follow>
        <!-- 发现 -->
        <explore :active="currentNav" v-show="currentNav === 1"></explore>
      </view>
    </template>
    <template v-else>
      <view class="community-empty flex-col col-center row-center">
        <image class="img-null" src="/static/images/follow_null.png"></image>
        <view class="muted mt20">当前页面暂无内容～</view>
      </view>
    </template>
    <tabbar></tabbar>
  </view>
</template>

<script>
import LikeHeader from "./components/like-header.vue";
import Explore from "./components/explore.vue";
import Follow from "./components/follow.vue";
export default {
  components: {
    LikeHeader,
    Explore,
    Follow,
  },
  data() {
    return {
      currentNav: 1,
      communityShareItem: {},
    };
  },
  onUnload() {
    uni.$off("changeItem");
    uni.$off("hasNew");
  },
  onShareAppMessage() {
    // const promise = new Promise(resolve => {
    //     setTimeout(() => {
    //         resolve({
    //             title: `${this.communityShareItem.user.nickname}，TA的内容超级棒`,
    //             path: '/bundle_b/pages/community_user/community_user?id=' + this
    //                 .communityShareItem.id,
    //             imageUrl: this.communityShareItem.image
    //         })
    //     }, 10)
    // })
    // return {
    //     title: '自定义转发标题',
    //     path: '/page/user/user',
    //     promise
    // }
    return {
      path: "/pages/community/community",
    };
  },
  methods: {
    handleNav(event) {
      this.currentNav = Number(event);
    },
    // 关注页的分享信息
    handleShare(event) {
      this.communityShareItem = event;
    },
  },
};
</script>

<style lang="scss">
page {
  padding: 0;
}

.community {
  display: flex;
  height: calc(100vh - var(--window-bottom));
  overflow: hidden;
  flex-direction: column;

  &-empty {
    height: calc(100vh - var(--window-bottom));
  }

  .container {
    flex: 1;
    min-height: 0;
    overflow: scroll;
  }
}
</style>

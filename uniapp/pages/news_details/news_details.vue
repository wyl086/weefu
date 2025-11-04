<template>
<view>
<view class="news-details">
    <view class="header">
        <view class="title xxl m-b-20">{{ articleDetail.title }}</view>
        <view class="flex row-between">
            <view class="xs lighter">发布时间：{{ articleDetail.create_time }}</view>
            <view class="flex">
                <image class="icon-sm" src="/static/images/icon_see.png"></image>
                <view class="m-l-10 xs muted">{{ articleDetail.visit }}人浏览</view>
            </view>
        </view>
    </view>
    <view class="main">
        <u-parse :html="article_content" />
    </view>
</view>
<loading-view v-if="showLoading"></loading-view>
</view>
</template>

<script>

import { getArticleDetail } from '@/api/store';

export default {
  data() {
    return {
      showLoading: true,
      articleDetail: {},
      article_content: ""
    };
  },

  components: {
  },
  props: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.type = Number(options.type) || '';
    this.id = options.id;

    if (this.type) {
      uni.setNavigationBarTitle({
        title: '帮助详情'
      });
    } else {
      uni.setNavigationBarTitle({
        title: '资讯详情'
      });
    }

    this.getArticleDetailFun();
  },

 
  methods: {
    getArticleDetailFun() {
      getArticleDetail({
        type: this.type,
        id: this.id
      }).then(res => {
        if (res.code == 1) {
          this.articleDetail = res.data
          setTimeout(() => {
            this.article_content = res.data.content;
          }, 200);
          setTimeout(() => {
              this.showLoading = false
          }, 300);
        }
      });
    }

  }
};
</script>
<style lang="scss">
page {
    background-color: #fff;
}
.news-details .header{
    padding: 20rpx 15px;
    border-bottom: $-solid-border;
}
.news-details .main {
    padding: 40rpx 15px;
}

</style>
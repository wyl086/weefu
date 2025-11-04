<template>
    <view class="bargain-process-container">
        <!-- #ifdef H5 -->
        <download-nav v-if="showDownload"></download-nav>
        <!-- #endif -->
        <view v-show="status == -1">
            <view class="bargain-process-header">
                <view class="mt20 column status-container">
                    <view class="white xxl">
                        {{ activityObj.bargain_tips }}
                    </view>
                    <view class="mt10 white xxs">
                        {{ activityObj.simple_tips }}
                    </view>
                </view>
            </view>
            <view class="main">
                <navigator
                    class="goods-planel row"
                    :url="'/pages/goods_details/goods_details?id=' + activityObj.goods_id"
                    hover-class="none"
                >
                    <u-image
                        width="180rpx"
                        height="180rpx"
                        :src="activityObj.image"
                        border-radius="10rpx"
                    />
                    <view class="goods-info">
                        <view class="goods-name line2 nr">
                            {{ activityObj.name }}
                        </view>
                        <view class="xs" style="color: #f95f2f">
                            最低可砍至<text class="sm" style="line-height: 48rpx"
                                >¥<text class="xl">{{ activityObj.activity_price }}</text></text
                            >
                        </view>
                        <view class="xs muted">
                            原价
                            <text style="text-decoration: line-through"
                                >¥{{ activityObj.price }}</text
                            >
                        </view>
                    </view>
                </navigator>
                <view class="choose-container">
                    <view class="title xl normal"> 请选择商品规格 </view>
                    <view class="choose-content row-between" @click="showSpecPop">
                        <view class="row">
                            <view class="muted sm">已选：</view>
                            <view class="md normal">
                                {{ userSpecText }}
                            </view>
                        </view>
                        <u-icon name="arrow-right" size="28" color="#999" />
                    </view>
                </view>
                <view class="lunch-btn white br60 row-center" @click="$launchBargain"
                    >发起砍价</view
                >
            </view>
        </view>
        <view v-show="status != -1">
            <view class="bargain-process-header">
                <view class="mt20 status-container row">
                    <u-image
                        v-if="bargainObj.share_avatar"
                        width="80rpx"
                        height="80rpx"
                        :src="bargainObj.share_avatar"
                        round
                        :customStyle="{ border: '2rpx solid #fff' }"
                    />
                    <view class="column ml20">
                        <view class="white xxl">
                            {{ bargainObj.bargain_tips }}
                        </view>
                        <view class="mt10 white xxs">
                            {{
                                bargainObj.simple_tips ||
                                '邀请好友帮忙砍价 —— 砍至' + bargainObj.current_price + '元即可发货'
                            }}
                        </view>
                    </view>
                </view>
            </view>
            <view class="main">
                <navigator
                    class="goods-planel row"
                    :url="'/pages/goods_details/goods_details?id=' + bargainObj.goods_id"
                    hover-class="none"
                >
                    <u-image
                        width="180rpx"
                        height="180rpx"
                        :src="bargainObj.image"
                        border-radius="10rpx"
                    />
                    <view class="goods-info">
                        <view class="goods-name line2 nr">
                            {{ bargainObj.name }}
                        </view>
                        <view class="xs muted">
                            {{ bargainObj.spec_value_str }}
                        </view>
                        <view class="row-between mt10">
                            <view class="xxs muted"> 原价 ¥{{ bargainObj.price || 0 }} </view>
                            <view class="row" v-show="showCountDown">
                                <u-count-down
                                    :timestamp="timestamp"
                                    bg-color="#FF2C3C"
                                    color="#fff"
                                    separator-color="#FF2C3C"
                                    height="36"
                                    :show-days="true"
                                    @end="closeBargainOrderFun"
                                />
                                <text class="muted xs ml10">内可砍</text>
                            </view>
                        </view>
                    </view>
                </navigator>
                <!-- 非被邀请状态 -->
                <view class="bargain-panel" v-if="status != 5">
                    <view class="bargain-panel-header nr">
                        已砍￥{{ bargainObj.knife_price || 0 }}，还差￥{{
                            bargainObj.diff_price || 0
                        }}
                    </view>
                    <view class="progress-container row">
                        <view class="progress">
                            <view class="progress-bar" :style="{ width: precent + '%' }"> </view>
                        </view>
                        <view class="primary xs ml20">
                            <text class="xxs">¥</text>{{ bargainObj.activity_price }}
                        </view>
                    </view>
                    <view
                        class="nr lighter row-center"
                        style="margin-top: 35rpx"
                        v-if="bargainObj.status != 0 && bargainObj != -1"
                    >
                        {{ bargainObj.status_tips }}
                    </view>
                    <view
                        class="invite-btn1 br60 white row-center lg"
                        @click="shareToBargain"
                        v-if="bargainObj.direct_buy_btn != 1 && bargainObj.invite_btn"
                    >
                        邀请好友帮砍价
                    </view>
                    <view
                        class="invite-btn1 br60 white row-center lg"
                        v-if="bargainObj.buy_btn"
                        @tap="handleClickBuy"
                    >
                        立即购买
                    </view>
                    <view class="fail-btn br60 white row-center lg" v-if="bargainObj.status == 2">
                        砍价失败
                    </view>
                    <view class="invite-btn-group row-between" v-if="bargainObj.direct_buy_btn">
                        <view class="buy-now-btn br60 md row-center" @click="handleClickBuy">
                            ¥{{ bargainObj.current_price }} 直接购买
                        </view>
                        <view
                            class="invite-friend-btn white br60 md row-center"
                            @click="shareToBargain"
                        >
                            邀请好友帮砍价
                        </view>
                    </view>
                    <view
                        class="invite-btn1 br60 white row-center lg"
                        v-if="bargainObj.order_btn"
                        @click="toOrderDetail"
                    >
                        查看订单
                    </view>
                    <view class="bargain-code-content">
                        <view class="bargain-code-title row-between">
                            <view class="md normal bold"> 砍价记录 </view>
                            <view class="muted xs">
                                已有{{
                                    bargainObj.knife_list && bargainObj.knife_list.length
                                }}人帮砍
                            </view>
                        </view>
                        <view class="code-content">
                            <view
                                class="user-item row-between"
                                v-for="(item, index) in bargainObj.knife_list"
                                :key="item.id"
                            >
                                <view class="user-content row">
                                    <u-image
                                        width="80rpx"
                                        height="80rpx"
                                        radius="60rpx"
                                        :src="item.avatar"
                                    />
                                    <view class="ml20">
                                        <view class="sm normal">
                                            {{ item.nickname }}
                                        </view>
                                        <view class="muted xxs"> 小刀一砍，惊喜满满 </view>
                                    </view>
                                </view>
                                <view class="bargain-price xs primary">
                                    ¥{{ item.help_price || 0 }}
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
                <!-- end -->
                <!-- 被邀请状态 -->
                <view class="shared-panel" v-if="status == 5">
                    <view class="btn-container">
                        <view class="nr muted row-center">
                            {{ bargainObj.status_tips }}
                        </view>
                        <view
                            class="help-knife-btn row-center white lg br60"
                            v-if="bargainObj.knife_btn"
                            @click="$helpBargain"
                        >
                            帮忙砍一刀
                        </view>
                        <navigator
                            hover-class="none"
                            url="/bundle/pages/bargain/bargain"
                            class="knife-btn row-center lg normal br60"
                            v-if="bargainObj.sponsor_btn"
                        >
                            我也要砍价
                        </navigator>
                    </view>
                    <view class="code-content">
                        <view class="bargain-code-title row-between">
                            <view class="md normal bold"> 砍价记录 </view>
                            <view class="muted xs">
                                已有{{ bargainObj.knife_list.length }}人帮砍
                            </view>
                        </view>
                        <view
                            class="user-item row-between"
                            v-for="(item, index) in bargainObj.knife_list"
                            :key="item.id"
                        >
                            <view class="user-content row">
                                <u-image
                                    width="80rpx"
                                    height="80rpx"
                                    radius="60rpx"
                                    :src="item.avatar"
                                />
                                <view class="ml20">
                                    <view class="sm normal">
                                        {{ item.nickname }}
                                    </view>
                                    <view class="muted xxs"> 小刀一砍，惊喜满满 </view>
                                </view>
                            </view>
                            <view class="bargain-price xs primary">
                                ¥{{ item.help_price || 0 }}
                            </view>
                        </view>
                    </view>
                </view>
                <!-- end -->
            </view>
        </view>
        <loading-view v-if="showLoadingView" />
        <goods-bargain v-if="status != -1" ref="goodsBargain" />
        <u-popup v-model="showBargainPop" mode="center">
            <view class="bargain-pop-container">
                <view class="md normal bold row-center" style="padding-top: 64rpx">
                    恭喜您成功砍下<text class="primary lg">{{ knifePrice || 0 }}</text
                    >元
                </view>
                <view class="bold md row-center" style="margin-top: 38rpx" v-if="!isHelpKnife">
                    还差<text class="ml20 differ-price primary"
                        >{{ diffPrice || 0 }}<text style="font-size: 40rpx">元</text></text
                    >
                </view>
                <view class="bold primary xxl row-center" style="margin-top: 38rpx" v-else>
                    已为好友砍价成功
                </view>
                <view class="progress-container row-center">
                    <view class="progress">
                        <view class="progress-bar" :style="{ width: precent + '%' }" />
                    </view>
                </view>
                <view class="row-center">
                    <view class="invite-btn row-center md" @click="shareToBargain">
                        {{ isHelpKnife ? '确定' : '邀请好友帮砍' }}
                    </view>
                </view>
            </view>
            <view class="close-icon row-center" @click="closeBargainPop" mode="bottom">
                <u-icon name="close-circle" size="68rpx" color="#fff"></u-icon>
            </view>
        </u-popup>
        <spec-popup
            :showComfirm="true"
            :show="showPop"
            :goods="activityObj"
            :isBargain="true"
            :show-add="false"
            :show-buy="false"
            :showConfirm="true"
            :disabledNumberBox="true"
            :showStock="false"
            @confirm="chooseSpec"
            @close="showPop = false"
        />

        <!-- 分享弹窗 -->
        <share-popup
            v-model="showSharePop"
            :share-id="bargainId"
            pagePath="bundle/pages/bargain_process/bargain_process"
            :config="{
                avatar: userInfo.avatar,
                nickname: userInfo.nickname,
                image: bargainObj.image,
                name: bargainObj.name
            }"
            type="2"
        />

        <float-tab></float-tab>
    </view>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {
    getBargainDetail,
    launchBargain,
    getBargainActivityDetail,
    helpBargain,
    closeBargainOrder
} from '@/api/activity'
import { strToParams } from '@/utils/tools'
import config from '@/config/app'
export default {
    data() {
        return {
            options: {},
            showPop: false,
            showBargainPop: false,
            showSharePop: false,
            activityObj: {},
            bargainObj: {},
            status: 1,
            precent: 0,
            timestamp: 3000,
            userSpecText: '请选择商品规格',
            userSpec: {},
            bargainId: -1,
            activityId: -1,
            // 砍价弹窗变量
            knifePrice: 0,
            diffPrice: 0,
            isHelpKnife: false,
            showCountDown: true,
            showLoadingView: true,
            showDownload: false
        }
    },
    onLoad() {
        this.options = this.$Route.query
        if (!this.isLogin) return this.$Router.push('/pages/login/login')
        // 活动详情ID
        this.bargainId = this.options.bargainId
        // 砍价活动ID
        this.activityId = this.options.activityId
        console.log(this.bargainId, this.activityId, 'option')
        if (this.activityId && this.activityId != -1) {
            this.$getBargainDetail(this.activityId)
        } else if (this.bargainId && this.bargainId != -1) {
            this.$getBargainActivityDetail(this.bargainId)
        }
    },
    async onShow() {
        await this.$nextTick()
        if (this.options && this.options.scene) {
            let scene = strToParams(decodeURIComponent(this.options.scene))
            this.options.bargainId = scene.id
        }
        if (this.options && this.options.id) {
            this.options.bargainId = this.options.id
        }
        // #ifdef H5
        if (this.options && this.options.isapp == 1) {
            this.showDownload = true
        }
        // #endif
    },
    onReachBottom() {
        if (this.$refs.goodsBargain) {
            this.$refs.goodsBargain.$getBargainList()
        }
    },
    // #ifdef MP-WEIXIN
    onShareAppMessage() {
        console.log(this.bargainId)
        return {
            path: 'bundle/pages/bargain_process/bargain_process?bargainId=' + this.bargainId,
            title: this.bargainObj.share_titles
        }
    },
    // #endif
    methods: {
        ...mapActions(['getCartNum', 'wxShare']),
        showSpecPop() {
            this.showPop = true
        },
        closeBargainPop() {
            this.showBargainPop = false
        },
        $getBargainDetail(id) {
            getBargainDetail({ bargain_id: id }).then((res) => {
                if (res.code == 0)
                    return setTimeout(() => {
                        uni.navigateBack(1)
                    }, 500)
                if (res.code == 1) {
                    this.activityObj = res.data
                    this.status = res.data.status
                    this.showLoadingView = false
                    this.userSpecText = res.data.goods_item[0].spec_value_str
                    this.userSpec = {
                        id: res.data.goods_item[0].id
                    }
                    // #ifdef h5
                    let options = {
                        shareTitle: this.activityObj.name,
                        shareLink: location.href + '&invite_code=' + this.$store.getters.inviteCode,
                        shareImage: this.activityObj.image,
                        shareDesc: this.activityObj.simple_tips
                    }
                    this.wxShare(options)
                    console.log(options, 'share-bargain-options1', location.href)
                    // #endif
                }
            })
        },
        chooseSpec(e) {
            this.userSpec = e.detail
            this.userSpecText = e.detail.spec_value_str
            this.showPop = false
        },
        $launchBargain() {
            if (!this.isLogin) return this.$Router.push('/pages/login/login')
            let data = {
                // 砍价活动id
                bargain_id: this.activityId,
                item_id: this.userSpec.id
            }
            launchBargain(data).then((res) => {
                if (res.code == 1) {
                    this.$toast({ title: res.msg })
                    this.knifePrice = res.data.knife_price
                    this.diffPrice = res.data.diff_price
                    this.precent = res.data.progress * 100
                    if (this.precent > 100) {
                        this.precent = 100
                    }
                    this.showBargainPop = true
                    this.bargainId = res.data.id
                    this.showLoadingView = true
                    uni.showLoading()
                    this.$getBargainActivityDetail(res.data.id)
                }
            })
        },
        $getBargainActivityDetail(id) {
            let timestamp = 0
            let now_time = new Date().getTime() / 1000
            getBargainActivityDetail({
                id: id
            }).then((res) => {
                if (res.code == 1) {
                    uni.hideLoading()
                    this.status = res.data.status
                    this.bargainObj = res.data

                    console.log(this.bargainObj)
                    timestamp = res.data.over_time
                    this.precent = res.data.progress * 100
                    if (this.precent > 100) {
                        this.precent = 100
                    }
                    this.showLoadingView = false
                    this.timestamp = timestamp - Math.floor(now_time)
                    console.log('calc: ', timestamp, '-', Math.floor(now_time), '=', this.timestamp)
                    // #ifdef h5
                    let url = location.href.replace(/activityId=\d*/g, 'bargainId=' + id)
                    let options = {
                        shareTitle: this.bargainObj.share_titles || this.bargainObj.name,
                        shareLink: url + '&invite_code=' + this.$store.getters.inviteCode,
                        shareImage: this.bargainObj.image,
                        shareDesc: this.bargainObj.share_intros || this.bargainObj.simple_tips
                    }
                    this.wxShare(options)
                    console.log(options, 'share-bargain-options2', url)
                    // #endif
                    if (this.timestamp <= 0 || this.status == 1) {
                        // 砍价已结束
                        this.showCountDown = false
                    } else {
                        this.showCountDown = true
                    }
                }
            })
        },
        shareToBargain() {
            this.showBargainPop = false
            if (this.isHelpKnife) {
                return
            }
            this.showSharePop = true
        },
        $helpBargain() {
            // 帮好友砍价
            helpBargain({
                id: this.bargainId
            }).then((res) => {
                console.log(res)
                if (res.code == 1) {
                    this.knifePrice = res.data.knife_price
                    this.precent = res.data.progress * 100
                    if (this.precent > 100) {
                        this.precent = 100
                    }
                    this.isHelpKnife = true
                    this.showBargainPop = true
                    this.$getBargainActivityDetail(this.bargainId)
                }
            })
        },
        toOrderDetail() {
            console.log(this.bargainObj.order_id)
            this.$Router.push({
                path: '/bundle/pages/order_details/order_details',
                query: {
                    id: this.bargainObj.order_id
                }
            })
        },
        closeBargainOrderFun() {
            // 计时结束后关闭订单
            closeBargainOrder({
                id: this.bargainObj.id
            }).then((res) => {
                if (res.code == 1) {
                    this.$toast({
                        title: res.msg
                    })
                    this.$getBargainActivityDetail(this.bargainObj.id)
                }
            })
        },
        // 直接购买
        handleClickBuy() {
            let goods = [
                {
                    num: 1,
                    shop_id: this.bargainObj.shop_id,
                    goods_id: this.bargainObj.goods_id,
                    // 暂时写死配送方式为0
                    delivery_type: 0,
                    bargain_launch_id: this.bargainObj.id,
                    item_id: this.bargainObj.item_id
                }
            ]
            let params = {
                goods
            }

            this.$Router.push({
                path: '/pages/confirm_order/confirm_order',
                query: {
                    data: params
                }
            })
        }
    },

    computed: {
        ...mapGetters(['userInfo'])
    }
}
</script>

<style lang="scss">
@import '@/styles/base.scss';

.bargain-process-container {
    .bargain-process-header {
        background-image: url(data:image/png;base64,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);
        height: 420rpx;
        background-size: 100% 100%;
        padding-top: 30rpx;
        .rule-contain {
            background-color: rgba(255, 255, 255, 0.8);
            border-radius: 100rpx;
            padding: 6rpx 10rpx;
            margin-right: 24rpx;
        }
        .status-container {
            margin-left: 24rpx;
        }
    }
    .main {
        padding: 0 24rpx;
        margin-top: -230rpx;
        .goods-planel {
            background-color: white;
            padding: 30rpx 24rpx;
            border-radius: 20rpx;
            box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.06);
            .goods-info {
                margin-left: 24rpx;
                flex: 1;
                .goods-name {
                    line-height: 40rpx;
                }
            }
        }
        // 砍价状态2
        .bargain-panel {
            margin-top: 30rpx;
            padding: 24rpx 24rpx 20rpx;
            background-color: $-color-white;
            box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.06);
            border-radius: 20rpx;
            .bargain-panel-header {
                font-weight: bold;
            }
            .progress-container {
                margin-top: 33rpx;
                .progress {
                    flex: 1;
                    background-color: #ffebe5;
                    height: 20rpx;
                    border-radius: 50rpx;
                    .progress-bar {
                        background: linear-gradient(90deg, #f95f2f 0%, #ff2c3c 100%);
                        transition: width 0.5s ease;
                        height: 100%;
                        width: 0%;
                        border-radius: 50rpx;
                    }
                }
            }
            .invite-btn1 {
                background-color: $-color-primary;
                height: 84rpx;
                margin-top: 36rpx;
                box-shadow: 0px 3px 10px rgba(235, 36, 51, 0.5);
            }
            .fail-btn {
                background-color: #e5e5e5;
                height: 84rpx;
                margin-top: 30rpx;
            }
            .invite-btn-group {
                margin-top: 60rpx;
                .buy-now-btn {
                    width: 316rpx;
                    height: 84rpx;
                    color: #f95f2f;
                    font-size: 30rpx;
                    background-color: rgba($color: #f95f2f, $alpha: 0.2);
                }
                .invite-friend-btn {
                    width: 316rpx;
                    height: 84rpx;
                    background-color: $-color-primary;
                }
            }
            .bargain-code-content {
                margin-top: 62rpx;
                .bargain-code-title {
                }
                .code-content {
                    margin-top: 30rpx;
                    .user-item {
                        padding: 15rpx 0;
                        margin-bottom: 30rpx;
                    }
                }
            }
        }
        // end
        // 被邀请状态
        .shared-panel {
            .btn-container {
                margin-top: 40rpx;
                .help-knife-btn {
                    background-color: $-color-primary;
                    height: 84rpx;
                    box-shadow: 0px 3px 10px rgba(235, 36, 51, 0.5);
                }
                .knife-btn {
                    height: 84rpx;
                    background-color: $-color-white;
                    border: 1px solid #bbbbbb;
                    margin-top: 30rpx;
                }
            }
            .code-content {
                margin-top: 30rpx;
                padding: 27rpx 24rpx;
                background-color: $-color-white;
                .user-item {
                    padding: 15rpx 0;
                    margin-top: 10rpx;
                }
            }
        }
        // end
        .choose-container {
            margin: 40rpx 0;
            .title {
                font-weight: 500;
                margin-bottom: 30rpx;
            }
            .choose-content {
                padding: 30rpx 20rpx;
                background-color: $-color-white;
                border-radius: 10px;
            }
        }
        .lunch-btn {
            height: 84rpx;
            background-color: $-color-primary;
            box-shadow: 0px 3px 10px rgba(235, 36, 51, 0.5);
        }
    }
    .pop-container {
        height: 800rpx;
        .goods-info {
            padding: 20rpx 20rpx;
            .goods-spec {
                align-self: flex-end;
            }
        }
        .spec-selector {
            padding: 30rpx 20rpx;
            .title {
                line-height: 36rpx;
            }
            .spec-item {
                padding: 8rpx 28rpx;
                background-color: #f4f4f4;
            }
            .spec-active-item {
                padding: 8rpx 28rpx;
                color: white;
                background-color: $-color-primary;
            }
        }
        .pickup-number {
            margin-top: 30rpx;
            padding: 0 20rpx;
        }
    }
    .bargain-pop-container {
        width: 559rpx;
        height: 580rpx;
        background-image: url(data:image/png;base64,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);
        background-size: 100% 100%;
        .differ-price {
            font-size: 58rpx;
            line-height: 38rpx;
        }
        .progress-container {
            margin-top: 26rpx;
            .progress {
                width: 409rpx;
                height: 20rpx;
                background-color: #fd498f1a;
                border-radius: 50rpx;
                .progress-bar {
                    height: 100%;
                    width: 0%;
                    background: linear-gradient(90deg, #fa444d 0%, #fd498f 100%);
                    border-radius: 50rpx;
                    transition: width 0.5s ease;
                }
            }
        }
        .invite-btn {
            background-image: url(data:image/png;base64,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);
            background-size: 100% 100%;
            height: 106rpx;
            color: #7b3200;
            font-weight: 500;
            margin-top: 180rpx;
            width: 478rpx;
        }
    }
    .close-icon {
        margin-top: 26rpx;
    }
    .share-pop-container {
        height: 500rpx;
        background-color: $-color-white;
    }
}
</style>

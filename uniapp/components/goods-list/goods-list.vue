<template>
    <view class="goods-list">
        <view v-if="type == 'waterfall'" class="goods-waterfall">
            <router-link
                v-for="(item, index) in list"
                :key="index"
                :to="{
                    path: '/pages/goods_details/goods_details',
                    query: { id: item.goods_id || item.id }
                }"
            >
                <view :style="{ width: width }" class="item bg-white m-t-20">
                    <view class="goods-img">
                        <u-image
                            :width="width"
                            :height="width"
                            :border-radius="10"
                            :src="item.image"
                        ></u-image>
                    </view>
                    <view class="goods-info">
                        <view class="goods-name line-2">{{ item.name }}</view>
                        <view class="price mt10 row">
                            <price-format
                                :color="colorConfig.primary"
                                class="m-r-10"
                                :first-size="34"
                                :second-size="26"
                                :subscript-size="26"
                                :price="item.min_price"
                                :weight="500"
                            ></price-format>
                            <price-format
                                class="muted"
                                :firstSize="24"
                                :secondSize="24"
                                :subscript-size="24"
                                line-through
                                :price="item.market_price || item.price"
                                v-if="item.market_price != 0 && item.price != 0"
                            ></price-format>
                        </view>
                    </view>
                </view>
            </router-link>
        </view>
        <view
            v-if="type == 'double'"
            class="goods-double double flex flex-wrap row-between col-stretch p-l-20 p-r-20"
        >
            <router-link
                class="m-t-20"
                v-for="(item, index) in list"
                :key="index"
                :to="{
                    path: '/pages/goods_details/goods_details',
                    query: { id: item.goods_id || item.id }
                }"
            >
                <view class="item bg-white" :style="{ width: width, height: '100%' }">
                    <view class="goods-img">
                        <u-image
                            :width="width"
                            :height="width"
                            :border-radius="10"
                            :src="item.image"
                        ></u-image>
                    </view>
                    <view class="goods-info">
                        <view
                            class="goods-name line-2"
                            :class="{ 'store-tag': item.shop_type == 1 }"
                            >{{ item.name }}</view
                        >
                        <view class="price mt10 row">
                            <price-format
                                :color="colorConfig.primary"
                                class="m-r-10"
                                :first-size="34"
                                :second-size="26"
                                :subscript-size="26"
                                :price="item.activity_price || item.min_price"
                                :weight="500"
                            ></price-format>
                            <price-format
                                class="muted"
                                :firstSize="24"
                                :secondSize="24"
                                :subscript-size="24"
                                line-through
                                :price="item.market_price || item.price"
                                v-if="item.market_price != 0 && item.price != 0"
                            ></price-format>
                        </view>
                    </view>
                </view>
            </router-link>
        </view>
        <view v-if="type === 'one' && list.length" class="goods-one m-t-20">
            <router-link
                v-for="(item, index) in list"
                :key="index"
                :to="{
                    path: '/pages/goods_details/goods_details',
                    query: { id: item.goods_id || item.id }
                }"
            >
                <view class="item bg-white flex col-top">
                    <view class="goods-img">
                        <u-image
                            width="200rpx"
                            height="200rpx"
                            :border-radius="10"
                            :src="item.image"
                        ></u-image>
                    </view>
                    <view class="goods-info m-l-20 flex-1">
                        <view
                            class="goods-name line-2 m-b-10"
                            :class="{ 'store-tag': item.shop_type == 1 }"
                            >{{ item.name }}</view
                        >
                        <view class="flex row-between m-t-10">
                            <view class="price m-t-10 flex">
                                <price-format
                                    :color="colorConfig.primary"
                                    class="m-r-10"
                                    :first-size="34"
                                    :second-size="26"
                                    :subscript-size="26"
                                    :price="item.min_price || item.price"
                                    :weight="500"
                                ></price-format>
                                <price-format
                                    class="muted"
                                    :firstSize="24"
                                    :secondSize="24"
                                    :subscript-size="24"
                                    line-through
                                    :price="item.market_price || item.price"
                                    v-if="item.market_price != 0 && item.price != 0"
                                ></price-format>
                            </view>
                        </view>
                    </view>
                </view>
            </router-link>
        </view>

        <view v-if="type.includes('row')" class="goods-row flex">
            <router-link
                class="item"
                v-for="(item, index) in list"
                :key="index"
                :to="{
                    path: '/pages/goods_details/goods_details',
                    query: { id: item.goods_id || item.id }
                }"
            >
                <view :class="[{ 'bg-white': showBg }]">
                    <view class="goods-img">
                        <u-image
                            width="240rpx"
                            height="240rpx"
                            :border-radius="10"
                            :src="item.image"
                        ></u-image>
                    </view>
                    <view class="goods-info">
                        <view class="goods-name line-1 sm">{{ item.name }}</view>
                        <view class="price m-t-10 row">
                            <price-format
                                :color="colorConfig.primary"
                                class="m-r-10"
                                :first-size="28"
                                :second-size="22"
                                :subscript-size="22"
                                :price="item.min_price"
                                :weight="500"
                            ></price-format>
                            <price-format
                                class="muted"
                                :firstSize="22"
                                :secondSize="22"
                                :subscript-size="22"
                                line-through
                                :price="item.market_price || item.price"
                                v-if="item.market_price != 0 && item.price != 0"
                            ></price-format>
                        </view>
                    </view>
                    <image
                        v-if="index < 3 && type == 'row-hot'"
                        class="paixu"
                        :src="'/static/images/No.' + index + '.png'"
                    ></image>
                </view>
            </router-link>
        </view>
        <view v-if="type == 'new'" class="goods-new">
            <router-link
                v-for="(item, index) in list"
                :key="index"
                :to="{
                    path: '/pages/goods_details/goods_details',
                    query: { id: item.goods_id || item.id }
                }"
            >
                <view class="item flex" :class="[{ 'bg-white': showBg }]">
                    <view class="goods-img">
                        <u-image
                            width="214rpx"
                            height="214rpx"
                            :border-radius="10"
                            :src="item.image"
                        ></u-image>
                    </view>
                    <view class="goods-info flex-1 m-l-20 flex-1">
                        <view class="goods-name line-2">{{ item.name }}</view>
                        <view class="price m-t-20 flex row-between">
                            <view class="muted xxs"
                                >原价<price-format
                                    :first-size="24"
                                    :second-size="24"
                                    :subscript-size="24"
                                    :price="item.market_price"
                                ></price-format>
                            </view>
                            <view class="muted xxs">{{ item.sales_total }}人购买</view>
                        </view>
                        <view class="btn flex row-between m-t-20">
                            <price-format
                                :color="colorConfig.primary"
                                class="m-r-10"
                                :first-size="34"
                                :second-size="26"
                                :subscript-size="26"
                                :price="item.min_price"
                                :weight="500"
                            ></price-format>
                            <button class="bg-primary br60 white btn" size="xs">去购买</button>
                        </view>
                    </view>
                </view>
            </router-link>
        </view>
        <view v-if="type == 'hot'" class="goods-hot">
            <router-link
                v-for="(item, index) in list"
                :key="index"
                :to="{
                    path: '/pages/goods_details/goods_details',
                    query: { id: item.goods_id || item.id }
                }"
            >
                <view class="item flex bg-white m-t-20">
                    <view class="goods-img">
                        <u-image
                            :lazy-load="true"
                            width="180rpx"
                            height="180rpx"
                            border-radius="6rpx"
                            :src="item.image"
                        />
                    </view>
                    <view class="goods-info m-l-20 flex-1">
                        <view class="goods-name line-2 m-b-10">{{ item.name }}</view>
                        <text class="sale br60 xxs">已有{{ item.sales_total }}人购买</text>
                        <view class="row-between flex m-t-10">
                            <view class="price m-t-10 flex">
                                <price-format
                                    :color="colorConfig.primary"
                                    class="m-r-10"
                                    :first-size="34"
                                    :second-size="26"
                                    :subscript-size="26"
                                    :price="item.min_price"
                                    :weight="500"
                                >
                                </price-format>
                                <price-format
                                    class="muted"
                                    :firstSize="24"
                                    :secondSize="24"
                                    :subscript-size="24"
                                    line-through
                                    :price="item.market_price"
                                ></price-format>
                            </view>
                            <button class="bg-primary br60 white btn" size="xs">立即抢购</button>
                        </view>
                    </view>
                    <image
                        v-if="index < 3"
                        class="paixu"
                        :src="'/static/images/No.' + index + '.png'"
                    ></image>
                </view>
            </router-link>
        </view>
        <view v-if="type == 'activity'" class="goods-hot">
            <router-link
                v-for="(item, index) in list"
                :key="index"
                :to="{
                    path: '/pages/goods_details/goods_details',
                    query: { id: item.goods_id || item.id }
                }"
            >
                <view class="item flex bg-white m-t-20">
                    <view class="goods-img">
                        <u-image
                            :lazy-load="true"
                            width="180rpx"
                            height="180rpx"
                            border-radius="6rpx"
                            :src="item.image"
                        />
                    </view>
                    <view class="goods-info m-l-20 flex-1">
                        <view class="goods-name line-2 m-b-10">{{ item.name }}</view>
                        <text class="views br60 xxs">{{ item.views }}浏览量</text>
                        <view class="row-between flex m-t-10">
                            <view class="price m-t-10 flex">
                                <price-format
                                    :color="colorConfig.primary"
                                    class="m-r-10"
                                    :first-size="34"
                                    :second-size="26"
                                    :subscript-size="26"
                                    :price="item.price"
                                    :weight="500"
                                >
                                </price-format>
                                <price-format
                                    class="muted"
                                    :firstSize="24"
                                    :secondSize="24"
                                    :subscript-size="24"
                                    line-through
                                    :price="item.market_price"
                                ></price-format>
                            </view>
                            <button class="bg-primary br60 white btn" size="xs">立即抢购</button>
                        </view>
                    </view>
                </view>
            </router-link>
        </view>
    </view>
</template>

<script>
export default {
    props: {
        type: {
            type: String,
            default: 'double'
        },
        list: {
            type: Array,
            default: () => []
        },
        isBargain: {
            type: Boolean,
            default: false
        },
        // 两行时有效
        width: {
            type: String,
            default: '347rpx'
        },
        showBg: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {}
    }
}
</script>

<style lang="scss" scoped>
.goods-list {
    // 自营标签
    .store-tag::before {
        content: '自营';
        font-size: 22rpx;
        color: $-color-white;
        padding: 0 10rpx;
        background: linear-gradient(267deg, #ff2c3c 0%, #f52e99 100%);
        border-radius: 6rpx;
    }

    .goods-waterfall {
        .item {
            width: 347rpx;
            border-radius: 10rpx;
            overflow: hidden;

            .goods-info {
                padding: 10rpx;
            }
        }
    }
    .goods-double {
        .item {
            width: 347rpx;
            border-radius: 10rpx;
            overflow: hidden;

            .goods-info {
                padding: 10rpx;
                .goods-name {
                    height: 80rpx;
                    line-height: 40rpx;
                }
            }
        }
    }

    .goods-one .item {
        padding: 20rpx;

        &:not(:last-of-type) {
            margin-bottom: 20rpx;
        }
    }

    .goods-seckill .item {
        padding: 20rpx;
    }

    .goods-new .item {
        padding: 0 20rpx 20rpx;
        border-radius: 10rpx;
    }

    .goods-row {
        .item {
            position: relative;
            width: 240rpx;
            border-radius: 16rpx;
            overflow: hidden;

            &:not(:last-of-type) {
                margin-right: 20rpx;
            }

            .goods-info {
                padding: 10rpx;
            }
        }
    }

    .goods-hot {
        .item {
            position: relative;
            padding: 30rpx 20rpx;
            border-radius: 10rpx;

            .goods-info {
                width: 450rpx;

                .sale {
                    padding: 4rpx 18rpx;
                    color: #f79c0c;
                    background-color: rgba(247, 156, 12, 0.1);
                }
                .views {
                    padding: 4rpx 18rpx;
                    color: #ff2c3c;
                    background-color: rgba(237, 83, 73, 0.1);
                }
            }
        }
    }
    .goods-row,
    .goods-hot {
        .paixu {
            position: absolute;
            top: 0;
            left: 20rpx;
            width: 48rpx;
            height: 60rpx;
        }
    }
}
</style>

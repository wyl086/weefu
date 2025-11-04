<template>
    <u-popup v-model="showPop" height="70vh" mode="bottom" border-radius="14" :closeable="true" @close="onClose"
        :safe-area-inset-bottom="true">
        <view class="bg-white spec-contain">
            <view class="spec-header flex">
                <u-image class="m-r-20" width="180rpx" height="180rpx" border-radius="10rpx" @tap="previewImage(checkedGoods.image)"
                    :src="checkedGoods.image"></u-image>
                <view class="goods-info">
                    <view class="primary flex">
                        <price :content="checkedGoods.price" main-size="46rpx" minor-size="38rpx" color="#FF2C3C">
                        </price>
                    </view>
                    <view class="sm m-t-120">
                        库存：{{stock}}件
                    </view>
                </view>
            </view>
            <!-- 规格 -->
            <view class="spec-main">
                <scroll-view style="min-height: 600rpx;" scroll-y="true">
                    <view class="spec-list">
                        <view v-for="(item, index) in specList" :key="index" class="spec">
                            <view class="flex row-between">
                                <view class="name m-b-30">{{ item.name }}</view>
                            </view>
                            <view class="flex wrap">
                                <view v-for="(specitem, index2) in item.spec_value" :key="index2"
                                    :class="'spec-item sm ' + ( specitem.checked ? 'checked' : '' )"
                                    @tap="choseSpecItem(item.id, specitem.id)">
                                    {{ specitem.value }}
                                </view>
                            </view>
                        </view>
                    </view>
                </scroll-view>
            </view>
        </view>
    </u-popup>
</template>

<script>
    export default {
        data() {
            return {
                stock: 0,//库存
                checkedGoods: {},
                specList: [],
                showPop: false,
                isSelectedAll: true, //是否全选
                selectStr: '', // 已选规格
                specListAll: [], // 是否全选
            };
        },

        components: {},
        props: {
            show: {
                type: Boolean
            },
            goods: {
                type: Object
            }
        },
        mounted() {},
        watch: {
            // 监听商品
            goods(value) {
                this.stock = value.stock
                let specList = value.goods_spec || [];
                let goodsItem = value.goods_item || [];
                specList.forEach(item => {
                    if (item.spec_value) {
                        item.spec_value.forEach((specitem, specindex) => {
                            specitem.checked = 1;
                        });
                    }
                    this.specListAll[item.id] = true
                });
                this.specList = specList
                this.checkedGoods = goodsItem.length ? goodsItem[0] : {};
            },
            // 监听规格
            specList(value) {
                const {
                    goods_item
                } = this.goods;
                let keyArr = [];
                let specArr = [];
                let specArrCM = []; // 个规格选中的id
                value.forEach(item => {
                    if (item.spec_value) {
                        item.spec_value.forEach((specitem, indexS) => {
                            if (specitem.checked) {
                                keyArr.push(specitem.id);
                                specArr.push(specitem.value)
                                specArrCM.push(specitem.id)
                            }
                            if (indexS == item.spec_value.length - 1) {
                                if (specArrCM.length == item.spec_value.length) {
                                    this.specListAll[item.id] = true
                                } else {
                                    this.specListAll[item.id] = false
                                }
                                specArrCM = []
                            }
                        });
                    }
                });
                this.selectStr = specArr.join('、')
                // hsz
                if (!keyArr.length) return;
                let key = keyArr[0];
                let index = goods_item.findIndex(item => {
                    return item.spec_value_ids == key;
                });
                if (index == -1) return;
                this.checkedGoods = goods_item[index]
                this.$emit('change', {
                    detail: goods_item[index]
                });
            },
            show(val) {
                this.showPop = val
            }
        },
        methods: {
            onClose() {
                this.$emit('close')
            },

            // 点击选中规格。
            choseSpecItem(id, specid) {
                this.specList.forEach(item => {
                    if (item.spec_value && item.id == id) {
                        item.spec_value.forEach(specitem => {
                            if (specitem.id == specid) {
                                if (specitem.checked == 1) {
                                    specitem.checked = 0;
                                } else {
                                    specitem.checked = 1;
                                }
                            }
                        });
                    }
                });
                this.specList = [...this.specList]
                this.getStock();
            },
            
            getStock() {
                let sku = [];
                // 遍历得到sku = [[1],[157，158]]数组
                this.specList.forEach((item, index) => {
                    sku.push([])
                    item.spec_value.forEach(specitem => {
                        if (specitem.checked) {
                            sku[index].push(specitem.id)
                        }
                    });
                });
                
                // 算出数组多种规格组合
                let keyArr = this.dkej(sku)
                let stock = 0
                keyArr.forEach((item) => {
                    const a = item.join(',')
                    let index = this.goods.goods_item.findIndex(item => {
                        return item.spec_value_ids == a;
                    });
                    if (index == -1) return;
                    stock += this.goods.goods_item[index].stock
                })
                this.stock = stock
            },
            
            dkej(arr) {
                let accArr = []
                for (var arrar in arr) {
                    arrar = arr[arrar]
                    let result = []
                    for (var i in arrar) {
                        if (accArr.length) {
                            for (var x in accArr) {
                                result.push(accArr[x].concat(arrar[i]))
                            }
                        } else {
                            result.push([arrar[i]])
                        }
                    }
                    accArr = result
                }
                return accArr
            },

            previewImage(current) {
                uni.previewImage({
                    current,
                    // 当前显示图片的http链接
                    urls: [current] // 需要预览的图片http链接列表
                });
            }
        }
    };
</script>
<style lang="scss" scoped>
    .spec-contain {
        border-radius: 10rpx 10rpx 0 0;
        overflow: hidden;
        position: relative;

        .close {
            position: absolute;
            right: 10rpx;
            top: 10rpx;
        }

        .spec-header {
            padding: 30rpx;
            padding-right: 70rpx;
            align-items: flex-start;
            border: $-solid-border;

            .vip-price {
                margin: 0 24rpx;
                background-color: #FFE9BA;
                line-height: 36rpx;
                border-radius: 6rpx;
                overflow: hidden;

                .price-name {
                    background-color: #101010;
                    padding: 3rpx 12rpx;
                    color: #FFD4B7;
                    position: relative;
                    overflow: hidden;

                    &::after {
                        content: '';
                        display: block;
                        width: 20rpx;
                        height: 20rpx;
                        position: absolute;
                        right: -15rpx;
                        background-color: #FFE9BA;
                        border-radius: 50%;
                        top: 50%;
                        transform: translateY(-50%);
                        box-sizing: border-box;
                    }
                }
            }
        }

        .spec-main {
            .spec-list {
                padding: 30rpx 20rpx;

                .spec-item {
                    line-height: 52rpx;
                    padding: 0 30rpx;
                    background-color: #F6F6F6;
                    border-radius: 30rpx;
                    margin: 0 20rpx 20rpx 0;
                    border: 1rpx solid #F6F6F6;

                    &.checked {
                        font-weight: 500;
                        border: 1rpx solid $-color-primary;
                        color: #fff;
                        background-color: $-color-primary;
                    }

                }
            }
        }
    }
</style>
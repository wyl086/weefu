<template>
  <u-popup
    v-model="showPop"
    mode="bottom"
    border-radius="14"
    :closeable="true"
    @close="onClose"
    :safe-area-inset-bottom="true"
  >
    <view class="bg-white spec-contain">
      <view class="header flex">
        <u-image
          width="160rpx"
          height="160rpx"
          class="m-r-20"
          border-radius="10rpx"
          @click="previewImage(checkedGoods.image)"
          :src="checkedGoods.image"
        ></u-image>
        <view class="goods-info">
          <view class="primary flex">
            <price-format
              :first-size="46"
              :second-size="32"
              :subscript-size="32"
              :price="group ? checkedGoods.team_price : checkedGoods.price"
              :weight="500"
            />
            <view
              class="vip-price flex"
              v-if="!group && !isSeckill && checkedGoods.member_price"
            >
              <view class="price-name xxs">会员价</view>
              <view style="padding: 0 11rpx">
                <price-format
                  :price="checkedGoods.member_price"
                  :first-size="22"
                  :second-size="22"
                  :subscript-size="22"
                  :weight="500"
                  color="#7B3200"
                />
              </view>
            </view>
          </view>
          <view class="sm" v-if="showStock">
            库存：{{ checkedGoods.stock }}件
          </view>
          <view class="sm m-t-10">
            <text>{{ specValueText }}</text>
          </view>
        </view>
      </view>
      <view class="spec-main" style="height: 550rpx">
        <scroll-view style="max-height: 500rpx" scroll-y="true">
          <view class="spec-list">
            <view v-for="(item, index) in specList" :key="index" class="spec">
              <view class="name m-b-20">
                {{ item.name }}
                <text class="primary xs m-l-20">{{
                  checkedGoods.spec_value_ids_arr[index] == ""
                    ? "请选择" + item.name
                    : ""
                }}</text>
              </view>
              <view class="flex flex-wrap">
                <view
                  v-for="(specitem, index2) in item.spec_value"
                  :key="index2"
                  :class="
                    'spec-item sm ' +
                    (checkedGoods.spec_value_ids_arr[index] == specitem.id
                      ? 'checked '
                      : '') +
                    (checkedGoods.spec_value_ids_arr[index] != specitem.id &&
                    isDisable(specitem.id)
                      ? 'unspec-disabled '
                      : '') +
                    (isDisable(specitem.id) ? 'spec-disabled' : '')
                  "
                  @click="choseSpecItem(index, index2)"
                >
                  {{ specitem.value }}
                </view>
              </view>
            </view>
          </view>
        </scroll-view>
        <view class="good-num flex row-between m-l-20 m-r-20">
          <view class="label">数量</view>
          <u-number-box
            v-if="show"
            v-model="goodsNum"
            :min="1"
            :max="checkedGoods.stock"
          ></u-number-box>
        </view>
      </view>
      <view
        v-if="shop.is_pay"
        class="btns flex row-between bg-white"
        :class="specValueText.indexOf('请选择') != -1 ? 'disabled' : ''"
      >
        <template v-if="checkedGoods.stock != 0">
          <button
            v-if="showAdd && type == 0"
            class="add-cart br60 white btn"
            size="lg"
            @click="onClick('addcart')"
          >
            {{ yellowBtnText }}
          </button>
          <button
            v-if="showBuy"
            class="bg-primary br60 white btn"
            size="lg"
            @click="onClick('buynow')"
          >
            {{ redBtnText }}
          </button>
          <button
            v-if="showConfirm"
            class="bg-primary br60 white btn"
            size="lg"
            @click="onClick('confirm')"
          >
            确定
          </button>
        </template>
        <button v-else class="bg-gray br60 white btn" size="lg">缺货</button>
      </view>
      <!-- TODO砍价活动无确认按钮 shop.is_pay为undefined-->
      <view
        v-if="showComfirm"
        class="btns flex row-between bg-white"
        :class="specValueText.indexOf('请选择') != -1 ? 'disabled' : ''"
      >
        <template v-if="checkedGoods.stock != 0">
          <button
            v-if="showAdd && type == 0"
            class="add-cart br60 white btn"
            size="lg"
            @click="onClick('addcart')"
          >
            {{ yellowBtnText }}
          </button>
          <button
            v-if="showBuy"
            class="bg-primary br60 white btn"
            size="lg"
            @click="onClick('buynow')"
          >
            {{ redBtnText }}
          </button>
          <button
            v-if="showConfirm"
            class="bg-primary br60 white btn"
            size="lg"
            @click="onClick('confirm')"
          >
            确定
          </button>
        </template>
        <button v-else class="bg-gray br60 white btn" size="lg">缺货</button>
      </view>
    </view>
  </u-popup>
</template>

<script>
export default {
  data() {
    return {
      shop: {},
      checkedGoods: {
        stock: 0,
      }, //选中的
      outOfStock: [], //缺货的
      specList: [], //规格
      disable: [], //不可选择的
      goodsNum: 1,
      showPop: false,
    };
  },

  props: {
    show: {
      type: Boolean,
    },
    goods: {
      type: Object,
    },
    showAdd: {
      type: Boolean,
      default: true,
    },
    showBuy: {
      type: Boolean,
      default: true,
    },
    showConfirm: {
      type: Boolean,
      default: false,
    },
    redBtnText: {
      type: String,
      default: "立即购买",
    },
    yellowBtnText: {
      type: String,
      default: "加入购物车",
    },
    showStock: {
      type: Boolean,
      default: true,
    },
    group: {
      type: Boolean,
      default: false,
    },
    isSeckill: {
      type: Boolean,
      default: false,
    },
    // type 是用来判断是什么类型的商品0=实物商品，1=虚拟商品
    type: {
      type: Number,
      default: 1,
    },
    showComfirm: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    // 选择的规格参数等
    specValueText() {
      let arr = this.checkedGoods.spec_value_ids?.split(",");
      let spec_str = "";
      if (arr)
        arr.forEach((item, index) => {
          if (item == "") spec_str += this.specList[index].name + ",";
        });
      if (this.checkedGoods?.stock != 0 && spec_str == "")
        return `已选择 ${this.checkedGoods.spec_value_str} ${this.goodsNum} 件`;
      else if (this.checkedGoods?.stock != 0 && spec_str.length)
        return `请选择 ${spec_str.slice(0, spec_str.length - 1)}`;
      else return `库存不足`;
    },
  },

  watch: {
    // 初始化
    goods(value) {
      console.log(value, 12345);
      this.specList = value.goods_spec || [];
      let goodsItem = value.goods_item || [];
      this.shop = value.shop || {};
      this.outOfStock = goodsItem.filter((item) => item.stock == 0);
      // 找出库存不为0的
      const resultArr = goodsItem.filter((item) => item.stock != 0);
      if (resultArr.length != 0) {
        resultArr[0].spec_value_ids_arr =
          resultArr[0].spec_value_ids.split(",");
        this.checkedGoods = resultArr[0];
      } else {
        // 无法选择
        goodsItem[0].spec_value_ids_arr = [];
        this.disable = goodsItem.map((item) => item.spec_value_ids.split(","));
        this.checkedGoods = goodsItem[0];
      }
    },

    // 规格列表变更时
    specList(value) {
      const res = this.goods.goods_item.filter(
        (item) => this.checkedGoods.spec_value_ids === item.spec_value_ids
      );
      if (res.length != 0) {
        const result = JSON.parse(JSON.stringify(res[0]));
        result.spec_value_ids_arr = result.spec_value_ids.split(",");
        this.checkedGoods = result;
        if (this.checkedGoods.stock < this.goodsNum) {
          this.goodsNum = this.checkedGoods.stock;
        }
        // 同步到父组件
        this.$emit("change", {
          detail: this.checkedGoods,
        });
      }
      // 当前选择的规格ID数组
      const idsArr = this.checkedGoods.spec_value_ids_arr;
      // 缺货规格列表
      const outOfStock = this.outOfStock;
      // 计算当前规格与缺货规格匹配
      const getArrGather = this.getArrResult(idsArr, outOfStock);
      // 计算出缺货的规格项
      this.disable = this.getOutOfStockArr(getArrGather, idsArr);
    },

    show(val) {
      this.showPop = val;
    },
  },
  created() {
    console.log("spec");
  },
  methods: {
    isDisable(spec_id) {
      // 如果有禁用的就直接返回
      if (this.disable.includes(spec_id)) return true;

      // 是否全选的缺货
      const checked = this.checkedGoods;
      const isLess = this.goods.goods_item.filter((item) => {
        return (
          checked.stock == 0 && checked.spec_value_ids === item.spec_value_ids
        );
      });
      if (isLess.length) {
        return checked.spec_value_ids_arr.includes(spec_id + "");
      }
    },

    onClose() {
      this.$emit("close");
    },

    onClick(type) {
      let { checkedGoods, goodsNum } = this;
      if (this.specValueText.indexOf("请选择") != -1)
        return this.$toast({
          title: this.specValueText,
        });
      if (checkedGoods.stock == 0)
        return this.$toast({
          title: "当前选择库存不足",
        });
      checkedGoods.goodsNum = goodsNum;
      checkedGoods.type = this.type;
      console.log("checkedGoods", checkedGoods);
      this.$emit(type, {
        detail: checkedGoods,
      });
    },

    // 选择规格
    choseSpecItem(index, index2) {
      const id = this.specList[index].spec_value[index2].id;

      let idsArr = this.checkedGoods.spec_value_ids_arr;

      if (id == idsArr[index]) idsArr[index] = "";
      else idsArr[index] = id;
      //保存已选规格
      this.checkedGoods.spec_value_ids_arr = idsArr;
      this.checkedGoods.spec_value_ids = idsArr.join(",");
      console.log(this.checkedGoods);

      // 重新渲染页面
      this.specList = [...this.specList];
    },

    // 过滤出需要进行禁用的规格
    getOutOfStockArr(arr, arr1, result = []) {
      arr.forEach((el) => {
        if (el.num >= arr1.length - 1) result.push(...el.different);
      });
      return result;
    },

    // 匹配出缺货库存和已选中对比结果
    getArrIdentical(arr1, arr2, arr = [], num = 0) {
      arr1.forEach((el) => {
        arr2.forEach((el2) => {
          if (el == el2) {
            num += 1;
            arr.push(el);
          }
        });
      });
      return {
        num, //n个相同的
        different: this.getArrDifference(
          [...new Set(arr)].map(Number),
          arr2.map(Number)
        ),
        identical: [...new Set(arr)],
      };
    },

    // 匹配出已选择和缺库存的
    getArrResult(arr, outOfStock, result = []) {
      outOfStock.forEach((item) => {
        const res = this.getArrIdentical(arr, item.spec_value_ids.split(","));
        if (res != undefined && res.length != 0) result.push(res);
      });
      return result;
    },

    // 找出两个数组中参数不同的
    getArrDifference(arr1, arr2) {
      return arr1.concat(arr2).filter(function (v, i, arr) {
        return arr.indexOf(v) == arr.lastIndexOf(v);
      });
    },

    // 查看商品图片
    previewImage(current) {
      uni.previewImage({
        current,
        urls: [current], // 需要预览的图片http链接列表
      });
    },
  },
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

  .header {
    padding: 30rpx;
    padding-right: 70rpx;
    align-items: flex-start;
    border: $-solid-border;
  }

  .spec-main {
    padding: 0 24rpx;

    .spec-list {
      padding: 30rpx 20rpx;

      .spec-item {
        line-height: 54rpx;
        padding: 0 30rpx;
        background-color: #f4f4f4;
        border-radius: 60rpx;
        margin: 0 20rpx 20rpx 0;
        border: 1px solid #f4f4f4;

        &.checked {
          background-color: #ffe9eb;
          color: $-color-primary;
          border-color: currentColor;
        }

        &.spec-disabled {
          // opacity: .5;
          position: relative;
        }
        &.spec-disabled::after {
          content: "缺货";
          position: absolute;
          right: -20rpx;
          top: -24rpx;
          color: $-color-white;
          width: 70rpx;
          height: 36rpx;
          text-align: center;
          line-height: 36rpx;
          font-size: 22rpx;
          border-radius: 20rpx 20rpx 20rpx 0;
          background-color: $-color-primary;
        }
        &.unspec-disabled::after {
          background-color: gray;
        }
      }
    }
  }

  // 底部按钮无法选择
  .disabled {
    opacity: 0.4;
  }

  .btns {
    height: 120rpx;
    padding: 0 30rpx;
    margin-top: 80rpx;

    .add-cart {
      background-color: #ff9e1e;
    }

    .btn {
      margin: 0 10rpx;
      flex: 1;
    }
  }

  .vip-price {
    margin: 0 24rpx;
    background-color: #ffe9ba;
    line-height: 36rpx;
    border-radius: 6rpx;
    overflow: hidden;

    .price-name {
      background-color: #101010;
      padding: 3rpx 12rpx;
      color: #ffd4b7;
      position: relative;
      overflow: hidden;

      &::after {
        content: "";
        display: block;
        width: 20rpx;
        height: 20rpx;
        position: absolute;
        right: -15rpx;
        background-color: #ffe9ba;
        border-radius: 50%;
        top: 50%;
        transform: translateY(-50%);
        box-sizing: border-box;
      }
    }
  }
}
</style>

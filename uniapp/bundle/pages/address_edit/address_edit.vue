<template>
  <view class="address-edit">
    <view class="form bg-white">
      <u-field
        v-model="addressObj.contact"
        label="收货人"
        placeholder="请填写收货人姓名"
      >
      </u-field>
      <u-field
        v-model="addressObj.telephone"
        label="联系方式"
        placeholder="请填写手机号码"
      >
      </u-field>
      <view @click="showRegion = true">
        <u-field
          v-model="region"
          :disabled="true"
          label="所在地区"
          placeholder="请选择省、市、区"
          right-icon="arrow-right"
        >
        </u-field>
      </view>
      <view>
        <u-field
          v-model="addressObj.address"
          type="textarea"
          label="详细地址"
          placeholder="请填写小区、街道、门牌号等信息"
          :field-style="{ flex: 1, height: '200rpx' }"
        />
      </view>
    </view>
    <view class="m-t-10 m-b-10 bg-white p-20">
      <u-checkbox
        @click="changeDefault"
        v-model="addressObj.is_default"
        shape="circle"
      >
        <text class="xs">设置为默认</text>
      </u-checkbox>
    </view>
    <button class="my-btn bg-primary white br60" @tap="formSubmit">完成</button>
    <u-select
      v-model="showRegion"
      mode="mutil-column-auto"
      @confirm="regionChange"
      :list="lists"
    ></u-select>
  </view>
</template>

<script>
// +----------------------------------------------------------------------
// | multshop开源商城系统
// +----------------------------------------------------------------------
// | 欢迎阅读学习系统程序代码，建议反馈是我们前进的动力
// | gitee下载：https://gitee.com/multshop_gitee
// | github下载：https://github.com/multshop-github
// | 访问官网：https://www.multshop.cn
// | 访问社区：https://home.multshop.cn
// | 访问手册：http://doc.multshop.cn
// | 微信公众号：multshop技术社区
// | multshop系列产品在gitee、github等公开渠道开源版本可免费商用，未经许可不能去除前后端官方版权标识
// |  multshop系列产品收费版本务必购买商业授权，购买去版权授权后，方可去除前后端官方版权标识
// | 禁止对系统程序代码以任何目的，任何形式的再发布
// | multshop团队版权所有并拥有最终解释权
// +----------------------------------------------------------------------
// | author: multshop.cn.team
// +----------------------------------------------------------------------
import {
  editAddress,
  getOneAddress,
  hasRegionCode,
  addAddress,
} from "@/api/user";
import area from "@/utils/area";
export default {
  data() {
    return {
      addressObj: {
        contact: "",
        telephone: "",
        province: "",
        city: "",
        district: "",
        address: "",
        is_default: false,
      },
      region: "",
      addressId: "",
      defaultRegion: ["广东省", "广州市", "番禺区"],
      defaultRegionCode: "440113",
      showRegion: false,
      lists: [],
    };
  },
  onLoad: function (options) {
    this.addressId = parseInt(options.id);
    if (options.id) {
      uni.setNavigationBarTitle({
        title: "编辑地址",
      });
      this.getOneAddressFun();
    } else {
      uni.setNavigationBarTitle({
        title: "添加地址",
      });
      this.getWxAddressFun();
    }
    this.$nextTick(() => {
      this.lists = area;
    });
  },

  onUnload: function () {
    uni.removeStorageSync("wxAddress");
  },

  methods: {
    async formSubmit() {
      let {
        addressObj: {
          contact,
          telephone,
          province_id,
          city_id,
          district_id,
          is_default,
          address,
        },
        addressId,
        region,
      } = this;
      if (!contact)
        return this.$toast({
          title: "请填写收货人姓名",
        });
      if (!telephone)
        return this.$toast({
          title: "请填写手机号码",
        });
      if (!region)
        return this.$toast({
          title: "请选择省、市、区",
        });
      if (!address)
        return this.$toast({
          title: "请填写小区、街道、门牌号等信息",
        });
      const params = {
        contact,
        telephone,
        province_id: parseInt(province_id),
        city_id: parseInt(city_id),
        district_id: parseInt(district_id),
        is_default: is_default ? 1 : 0,
        id: addressId,
        address,
      };
      const { code, msg } = addressId
        ? await editAddress(params)
        : await addAddress(params);
      if (code == 1) {
        this.$toast(
          {
            title: msg,
          },
          {
            tab: 3,
            url: 2,
          }
        );
      }
    },
    regionChange(region) {
      this.addressObj.province_id = region[0].value;
      this.addressObj.city_id = region[1].value;
      this.addressObj.district_id = region[2].value;
      this.region =
        region[0].label + " " + region[1].label + " " + region[2].label;
    },

    getOneAddressFun() {
      getOneAddress(this.addressId).then((res) => {
        if (res.code == 1) {
          let { city, province, district } = res.data;
          this.addressObj = res.data;
          this.region = `${province} ${city} ${district}`;
        }
      });
    },

    getWxAddressFun() {
      let wxAddress = uni.getStorageSync("wxAddress");
      if (!wxAddress) return;
      wxAddress = JSON.parse(wxAddress);
      let {
        userName: contact,
        telNumber: telephone,
        provinceName: province,
        cityName: city,
        detailInfo: address,
      } = wxAddress;
      let district = wxAddress.countryName || wxAddress.countyName;
      hasRegionCode({
        province,
        city,
        district,
      }).then((res) => {
        if (res.code == 1) {
          if (res.data.province && res.data.city && res.data.district) {
            this.region = `${province} ${city} ${district}`;
            this.addressObj.province_id = res.data.province;
            this.addressObj.city_id = res.data.city;
            this.addressObj.district_id = res.data.district;
          }
          this.addressObj.contact = contact;
          this.addressObj.telephone = telephone;
          this.addressObj.address = address;
        }
      });
    },
  },
};
</script>
<style lang="scss">
.address-edit {
  padding-top: 10rpx;

  .my-btn {
    margin: 30rpx 26rpx;
    text-align: center;
  }
}
</style>

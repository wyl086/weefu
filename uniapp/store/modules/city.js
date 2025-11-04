import wechath5 from "@/utils/wechath5";
import { isWeixinClient, toast } from "@/utils/tools";
import { baseURL, basePath } from "@/config/app";
import { getGeocoder } from "@/api/store.js";

const state = {
  cityInfo: {
    // id: city_id,
    // name: result.ad_info.city,
    // gcj02_lat: result.location.lat,
    // gcj02_lng: result.location.lng
  },
};

const mutations = {
  setCityInfo(state, data) {
    state.cityInfo = data;
    uni.$emit("refreshhome");
  },
};

const actions = {
  // 位置授权
  async getAuthorize({ dispatch }) {
    const [error, data] = await uni.showModal({
      title: "您已拒绝地理位置权限",
      content: "是否进入权限管理，调整授权？",
    });
    if (data.confirm) {
      const [error, data] = await uni.openSetting();
      if (data.authSetting["scope.userLocation"]) dispatch("initLocationFunc");
    }
  },
  // 获取当前定位
  async initLocationFunc({ dispatch, rootState }) {
    console.log("获取地址");
    try {
      const [error, res] = await uni.getLocation({
        // #ifndef APP
        type: "gcj02",
        // #endif
      });
      console.log(error, res, "----");
      // if(error?.errMsg == 'getLocation:fail 频繁调用会增加电量损耗，可考虑使用 wx.onLocationChange 监听地理位置变化') return toast({ title: '频繁定位，请稍后' })
      // #ifdef MP
      dispatch("getSystemInfo");
      if (!rootState.app.sysInfo.locationEnabled) {
        uni.showModal({
          title: "温馨提示",
          content: "您的手机定位还未开启",
        });
        return;
      }
      // #endif
      // #ifdef MP
      if (!res) return dispatch("getAuthorize");
      // #endif
      if (error) {
        uni.showModal({
          title: "温馨提示",
          // content: JSON.stringify(error.errMsg)
          content: "获取位置失败，请检查是否开启定位！",
        });
        return;
      }
      // #ifdef APP-PLUS

      if (!res) return toast({ title: "获取位置失败" });
      // #endif
      dispatch("getGeocoderFunc", {
        location: `${res.latitude},${res.longitude}`,
      });
    } catch (err) {
      console.log(err);
      // toast({ title: err.errMsg })
      // throw new Error(err + '获取位置')
    }
  },
  // 逆解析地址
  getGeocoderFunc({ commit }, location) {
    console.log(location);
    getGeocoder({ ...location }).then((res) => {
      console.log(res);
      if (res.code == 1) {
        const result = res.data.result;
        const city_id = res.data.city_id;
        commit("setCityInfo", {
          id: city_id,
          name: result.ad_info.city,
          gcj02_lat: result.location.lat,
          gcj02_lng: result.location.lng,
        });
      } else {
        toast({ title: res.msg });
      }
    });
  },
};

export default {
  state,
  mutations,
  actions,
};

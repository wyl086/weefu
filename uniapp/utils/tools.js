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

import { loadingType } from "./type";
import { baseURL } from "@/config/app.js";

import store from "@/store";

//所在环境
let client = null;
// #ifdef MP-WEIXIN
client = 1;
// #endif

// #ifdef H5
client = isWeixinClient() ? 2 : 6;
// #endif

// #ifdef APP-PLUS
client = 3;
uni.getSystemInfo({
  success: (res) => {
    client = res.platform == "ios" ? 3 : 4;
  },
  fail: (res) => {
    client = 3;
  },
});
// #endif
export { client };

//节流
export const trottle = (func, time = 1000, context) => {
  let previous = new Date(0).getTime();
  return function (...args) {
    let now = new Date().getTime();
    if (now - previous > time) {
      func.apply(context, args);
      previous = now;
    }
  };
};

//节流
export const debounce = (func, time = 1000, context) => {
  let timer = null;
  return function (...args) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      timer = null;
      func.apply(context, args);
    }, time);
  };
};

//判断是否为微信环境
export function isWeixinClient() {
  // #ifdef H5
  var ua = navigator.userAgent.toLowerCase();
  if (ua.match(/MicroMessenger/i) == "micromessenger") {
    //这是微信环境
    return true;
  } else {
    //这是非微信环境
    return false;
  }
  // #endif
  // #ifndef H5
  return false;
  // #endif
}

//判断是否为安卓环境
export function isAndroid() {
  let u = navigator.userAgent;
  return u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
}

//获取url后的参数  以对象返回
export function strToParams(str) {
  var newparams = {};
  for (let item of str.split("&")) {
    newparams[item.split("=")[0]] = item.split("=")[1];
  }
  return newparams;
}

//重写encodeURL函数
export function urlencode(str) {
  str = (str + "").toString();
  return encodeURIComponent(str)
    .replace(/!/g, "%21")
    .replace(/'/g, "%27")
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29")
    .replace(/\*/g, "%2A")
    .replace(/%20/g, "+");
}

//一维数组截取为二维数组

export function arraySlice(data, array = [], optNum = 10) {
  data = JSON.parse(JSON.stringify(data));
  if (data.length <= optNum) {
    data.length > 0 && array.push(data);
    return array;
  }
  array.push(data.splice(0, optNum));
  return arraySlice(data, array, optNum);
}

//对象参数转为以？&拼接的字符
export function paramsToStr(params) {
  let p = "";
  if (typeof params == "object") {
    p = "?";
    for (let props in params) {
      p += `${props}=${params[props]}&`;
    }
    p = p.slice(0, -1);
  }
  return p;
}

// 获取wxml元素

export function getRect(selector, all, context) {
  return new Promise(function (resolve) {
    let qurey = uni.createSelectorQuery();

    if (context) {
      qurey = uni.createSelectorQuery().in(context);
    }

    qurey[all ? "selectAll" : "select"](selector)
      .boundingClientRect(function (rect) {
        if (all && Array.isArray(rect) && rect.length) {
          resolve(rect);
        }
        if (!all && rect) {
          resolve(rect);
        }
      })
      .exec();
  });
}

// 轻提示
export function toast(info = {}, navigateOpt) {
  let title = info.title || "";
  let icon = info.icon || "none";
  let endtime = info.endtime || 2000;
  if (title)
    uni.showToast({
      title: title,
      icon: icon,
      duration: endtime,
    });
  if (navigateOpt != undefined) {
    if (typeof navigateOpt == "object") {
      let tab = navigateOpt.tab || 1,
        url = navigateOpt.url || "";
      switch (tab) {
        case 1:
          //跳转至 table
          setTimeout(function () {
            uni.switchTab({
              url: url,
            });
          }, endtime);
          break;
        case 2:
          //跳转至非table页面
          setTimeout(function () {
            uni.navigateTo({
              url: url,
            });
          }, endtime);
          break;
        case 3:
          //返回上页面
          setTimeout(function () {
            uni.navigateBack({
              delta: parseInt(url),
            });
          }, endtime);
          break;
        case 4:
          //关闭当前所有页面跳转至非table页面
          setTimeout(function () {
            uni.reLaunch({
              url: url,
            });
          }, endtime);
          break;
        case 5:
          //关闭当前页面跳转至非table页面
          setTimeout(function () {
            uni.redirectTo({
              url: url,
            });
          }, endtime);
          break;
      }
    } else if (typeof navigateOpt == "function") {
      setTimeout(function () {
        navigateOpt && navigateOpt();
      }, endtime);
    }
  }
}

//菜单跳转
export function menuJump(item) {
  const { is_tab, link, link_type } = item;
  switch (link_type) {
    case 1:
      // 本地跳转
      if (is_tab) {
        uni.switchTab({
          url: link,
        });
        return;
      }
      uni.navigateTo({
        url: link,
      });
      break;

    case 2:
      // webview
      uni.navigateTo({
        url: "/pages/webview/webview?url=" + link,
      });
      break;

    case 3: // tabbar
  }
}

export function uploadFile(path, options) {
  const { header, name } = options || {};
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: baseURL + "/api/file/formimage",
      filePath: path,
      name: name || "file",
      header: {
        token: store.getters.token,
        ...header,
        // version: '1.2.1.20210717'
      },
      fileType: "image",
      cloudPath: "",
      success: (res) => {
        try {
          console.log(path);
          console.log("uploadFile res ==> ", res);
          let data = JSON.parse(res.data);

          if (data.code == 1) {
            resolve(data.data);
          } else {
            reject();
          }
        } catch (e) {
          console.log(e);
          reject();
        }
      },
      fail: (err) => {
        console.log(err);
        reject();
      },
    });
  });
}

//当前页面

export function currentPage() {
  let pages = getCurrentPages();
  let currentPage = pages[pages.length - 1];
  return currentPage || {};
}

// H5复制方法
export function copy(str) {
  // #ifdef H5
  let aux = document.createElement("input");
  aux.setAttribute("value", str);
  document.body.appendChild(aux);
  aux.select();
  document.execCommand("copy");
  document.body.removeChild(aux);
  uni.showToast({
    title: "复制成功",
  });
  // #endif

  // #ifndef H5
  uni.setClipboardData({
    data: str.toString(),
  });
  // #endif
}

// #ifdef MP-WEIXIN
export function toLivePlayer(roomId) {
  wx.navigateTo({
    url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${roomId}`,
  });
}
// #endif
/**
 * @description 判断系统端
 */
export function getClient() {
  return new Promise((resolve, reject) => {
    uni.getSystemInfo({
      success({ platform }) {
        resolve(platform);
      },
      fail(err) {
        reject(err);
        console.log(err);
      },
    });
  });
}
/**
 * @description 获取当前微信小程序基础库版本号
 */
export function getBaseLibraryVersion() {
  const { SDKVersion } = wx.getSystemInfoSync();
  return SDKVersion;
}
/**
 * @description 用于比较当前微信基础库版本与目标基础库版本
 * 示例用法：比较小程序基础库版本是否大于等于 2.12.0 compareWeChatVersion("2.12.0")
 * return 1 =>当前版本大于目标版本  return -1 =>当前版本小于目标版本 return 0 =>当前版本等于目标版本
 * @param {string} targetVersion 目标微信版本号
 *
 */
export function compareWeChatVersion(targetVersion) {
  const currentVersion = getBaseLibraryVersion();
  if (currentVersion === targetVersion) {
    return 0; // 当前版本与目标版本相同
  } else if (currentVersion > targetVersion) {
    return 1; // 当前版本大于目标版本
  } else {
    return -1; // 当前版本小于目标版本
  }
}

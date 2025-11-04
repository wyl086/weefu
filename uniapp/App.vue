<script>
import { mapActions, mapMutations } from "vuex";
import { getConfig } from "@/api/app";
import { strToParams } from "@/utils/tools";
import { bindSuperior } from "@/api/user";
import { INVITE_CODE } from "@/config/cachekey";
import Cache from "@/utils/cache";
export default {
  onLaunch: function (options) {
    // 获取配置
    this.getConfigFun();
    this.getUser();
    this.getSystemInfo();
    //#ifdef MP-WEIXIN
    this.checkMpUpdate();
    //#endif
  },
  onShow: function (options) {
    console.log(options);
    this.bindCode(options);
  },
  onHide: function () {},
  methods: {
    ...mapActions(["getSystemInfo", "getUser", "wxShare", "initLocationFunc"]),
    ...mapMutations(["setConfig"]),
    async getConfigFun() {
      const { code, data } = await getConfig();
      if (code == 1) {
        this.setConfig(data);
        // #ifndef MP
        if (data.is_open_nearby) {
          // 获取定位
          this.initLocationFunc();
        }
        // #endif
        // 防止第一次调用时拿不到数据
        this.wxShare();
      }
    },
    async bindCode(options) {
      if (!options.query) return;
      let invite_code =
        options.query.invite_code ||
        strToParams(decodeURIComponent(options.query.scene)).invite_code;
      if (invite_code) {
        const { data, code } = await bindSuperior({
          code: invite_code,
        });
        if (code == -1) {
          Cache.set(INVITE_CODE, invite_code);
        }
      }
    },
    //#ifdef MP-WEIXIN
    checkMpUpdate() {
      const updateManager = wx.getUpdateManager();
      updateManager.onUpdateReady(function () {
        wx.showModal({
          title: "更新提示",
          content: "新版本已准备好，是否重启？",
          success: function (res) {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate();
            }
          },
        });
      });
    },
    //#endif
  },
};
</script>
<style lang="scss">
@import "styles/common.scss";
@import "components/uview-ui/index.scss";
@import url("@/plugin/emoji-awesome/css/apple.css");
/*每个页面公共css */
</style>

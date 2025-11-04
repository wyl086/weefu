<template>
    <div class="user-profile">
        <div class="user-header lg">
            个人资料
        </div>
        <div class="user-container">
            <div class="user-form-item flex">
                <label class="user-form-label nr">头像</label>
                <div class="user-avatar-upload">
                    <el-upload class="avatar-uploader" :action="action" :show-file-list="false" :file-list="fileList"
                        :on-success="uploadFileSuccess" :headers="{token: $store.state.token}" 
                        accept="image/jpg,image/jpeg,image/png"
                        :before-upload="beforeAvatarUpload">
                        <div class="avatar">
                            <el-image style="width: 64px;height: 64px;border-radius: 60px" :src="avatar" />
                            <div class="mask white"></div>
                        </div>
                    </el-upload>
                </div>
            </div>
            <div class="user-form-item flex">
                <label class="user-form-label nr">用户ID</label>
                <div class="normal nr">{{sn}}</div>
            </div>
            <div class="user-form-item flex">
                <label class="user-form-label nr">昵称</label>
                <el-input v-model="nickName" class="user-input" suffix-icon="el-icon-edit" />
            </div>
            <div class="user-form-item flex">
                <label class="user-form-label nr">性别</label>
                <el-radio-group v-model="radio">
                    <el-radio :label="'男'">男</el-radio>
                    <el-radio :label="'女'">女</el-radio>
                    <!-- <el-radio :label="3">保密</el-radio> -->
                </el-radio-group>
            </div>
            <div class="user-form-item flex">
                <label class="user-form-label nr">手机号</label>
                <div class="normal nr">{{mobile}}</div>
                <div style="color: #6699CC;margin-left: 13px;cursor: pointer;" @click="openChangeNumber">
                    {{mobile?'修改号码':'绑定手机号'}}</div>
            </div>
            <div class="user-form-item flex">
                <label class="user-form-label nr">注册时间</label>
                <div class="normal nr">{{createTime}}</div>
            </div>
            <div class="user-form-item flex">
                <label class="user-form-label nr">登录密码</label>
                <div class="nr" style="color: #6699CC;cursor: pointer;" @click="openChangePwdPop">修改密码</div>
            </div>
            <button class="primary-btn bg-primary flex-center white" @click="saveUserInfo">
                保存
            </button>
        </div>

        <!-- 修改手机号 -->
        <el-dialog :center="true" :title="mobile ? '更换手机号': '绑定手机'" :visible.sync="showChangeNumber" width="40%">
            <div>
                <el-form style="width: 50%;margin: 0 auto">
                    <el-form-item>
                        <el-input v-model="telephone" placeholder="请输入新的手机号码" />
                    </el-form-item>
                    <el-form-item>
                        <div class="flex">
                            <el-input v-model="verifyCode" placeholder="短信验证码" />
                            <el-button style="margin-left: 14px;" @click="sndSmsToPhone">
                                <div v-if="canSendNumber">获取验证码</div>
                                <count-down v-else :time="60" format="ss秒" autoStart @finish="canSendNumber = true" />
                            </el-button>
                        </div>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer">
                <el-button style="width:134px" type="primary" @click="changeUserMobile">确认</el-button>
                <el-button style="width:134px" @click="closeChangeNumber">取消</el-button>
            </div>
        </el-dialog>

        <!-- 登录密码设置 -->
        <el-dialog title="设置登录密码" :center="true" :visible.sync="showPwdPop" width="40%">
            <div>
                <el-form style="width: 50%;margin: 0 auto;">
                    <el-form-item>
                        <el-input v-model="mobile" placeholder="请输入手机号码" />
                    </el-form-item>
                    <el-form-item>
                        <div class="flex">
                            <el-input v-model="verifyCode" placeholder="短信验证码" />
                            <el-button style="margin-left: 14px;" @click="sndSmsToPhone">
                                <div v-if="canSendPwd">获取验证码</div>
                                <count-down v-else :time="60" format="ss秒" autoStart @finish="canSendPwd = true" />
                            </el-button>
                        </div>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="pwd" type="password" placeholder="请输入密码 (数字与字母自由组合)" />
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="againPwd" type="password" placeholder="再次输入密码" />
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer">
                <el-button style="width:134px" type="primary" @click="setPassWord">确认</el-button>
                <el-button style="width:134px" @click="closePwdPop">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { SMSType, client, FieldType } from "~/utils/type";
import Cookies from "js-cookie";
import { mapActions } from "vuex";
import config from "~/config/app";
export default {
    head() {
        return {
            title: this.$store.getters.headTitle,
            link: [
                {
                    rel: "icon",
                    type: "image/x-icon",
                    href: this.$store.getters.favicon,
                },
            ],
        };
    },
    layout: "user",
    mounted() {
        this.getUserInfoFun();
    },
    data() {
        return {
            avatar: "",
            mobile: "",
            sex: 0,
            createTime: "",
            sn: "",
            action: config.baseUrl + "/api/file/formimage",
            nickName: "",
            radio: 1,
            showChangeNumber: false,
            showPwdPop: false,
            telephone: "",
            verifyCode: "",
            pwd: "",
            againPwd: "",
            smsType: SMSType.CHANGE_MOBILE,
            canSendNumber: true,
            canSendPwd: true,
            fileList: [],
        };
    },
    methods: {
        beforeAvatarUpload(file) {
          var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
          console.log('fdsadsf')
          const extension = testmsg === 'jpg'
          const extension2 = testmsg === 'png'
          const extension4 = testmsg === 'jpeg'
          if (!extension && !extension2) {
            this.$message({
              message: '上传文件只能是 jpg, jpeg, png格式!',
              type: 'warning'
            })
            return false
          }
          return extension || extension2 || extension4
        },
        
        ...mapActions(["getPublicData"]),

        async getUserInfoFun() {
            let res = await this.$get("user/info");
            if (res.code == 1) {
                this.avatar = res.data.avatar;
                this.nickName = res.data.nickname;
                this.mobile = res.data.mobile;
                this.sex = res.data.sex;
                this.radio = this.sex;
                this.createTime = res.data.create_time;
                this.sn = res.data.sn;
            }
        },

        async saveUserInfo() {
            let res = await this.$post("pc/changeUserInfo", {
                sex: this.radio == "男" ? 1 : 2,
                nickname: this.nickName,
            });
            if (res.code == 1) {
                this.$message({
                    message: res.msg,
                    type: "success",
                });
                this.getPublicData();
            }
        },
        closeChangeNumber() {
            this.telephone = "";
            this.verifyCode = "";
            this.showChangeNumber = false;
        },
        closePwdPop() {
            this.telephone = "";
            this.verifyCode = "";
            this.showPwdPop = false;
        },

        // 打开修改手机号的弹窗
        openChangeNumber() {
            this.showChangeNumber = true;
            this.smsType = this.mobile ? SMSType.CHANGE_MOBILE : SMSType.BIND;
        },

        // 打开修改登录密码的弹窗
        openChangePwdPop() {
            if (this.mobile == "") return this.$message.error("请先绑定手机号");
            this.showPwdPop = true;
            this.smsType = SMSType.FINDPWD;
        },

        // 发送验证码
        async sndSmsToPhone() {
            if (
                (this.smsType == SMSType.CHANGE_MOBILE ||
                    this.smsType == SMSType.BIND) &&
                !this.canSendNumber
            )
                return;
            else if (this.smsType == SMSType.FINDPWD && !this.canSendPwd)
                return;
            if (this.smsType == SMSType.CHANGE_MOBILE && !this.telephone)
                return this.$message.error("请输入手机号");

            let res = await this.$post("sms/send", {
                mobile:
                    this.smsType == SMSType.FINDPWD
                        ? this.mobile
                        : this.telephone,
                key: this.smsType,
            });
            if (res.code == 1) {
                this.smsType == SMSType.FINDPWD
                    ? (this.canSendPwd = false)
                    : (this.canSendNumber = false);
                this.$message.success("发送成功");
            }
        },

        // 修改手机号码
        async changeUserMobile() {
            if (!this.telephone)
                return this.$message.error("请输入新的手机号码");
            if (!this.verifyCode) return this.$message.error("请输入验证码");
            let res = await this.$post("user/changeMobile", {
                mobile: this.mobile,
                new_mobile: this.telephone,
                code: this.verifyCode,
                action: this.mobile ? "change" : "",
                client: client,
            });
            if (res.code == 1) {
                this.showChangeNumber = false;
                this.$message.success(res.msg);
                this.getPublicData();
                this.getUserInfoFun();
            }
        },

        // 设置登录密码
        async setPassWord() {
            if (!this.verifyCode) return this.$message.error("请输入验证码");
            if (!this.pwd) return this.$message.error("请输入密码");
            if (!this.againPwd) return this.$message.error("请输入确认密码");
            if (this.pwd != this.againPwd)
                return this.$message.error("两次密码输入不一致");
            let res = await this.$post("login_password/forget", {
                mobile: this.mobile,
                code: this.verifyCode,
                password: this.pwd,
                repassword: this.againPwd,
                client: client,
            });
            if (res.code == 1) {
                this.$message({
                    message: res.msg,
                    type: "success",
                });
                this.showPwdPop = false;
                const token = res.data.token;
                Cookies.set("token", token, { expires: 60 });
            }
        },
        async uploadFileSuccess(res, fileList) {
            let respond = await this.$post("user/setInfo", {
                field: FieldType.AVATAR,
                value: res.data.uri,
            });
            if (respond.code == 1) {
                this.$message({
                    message: respond.msg,
                    type: "success",
                });
                let userRes = await this.$get("user/info");
                if (userRes.code == 1) {
                    this.avatar = userRes.data.avatar;
                    this.nickName = userRes.data.nickname;
                    this.mobile = userRes.data.mobile;
                    this.sex = userRes.data.sex;
                    this.radio = this.sex;
                    this.createTime = userRes.data.create_time;
                }
            }
        },
    },
};
</script>

<style lang="scss">
.user-profile {
    width: 980px;
    padding: 10px;
    .user-header {
        padding: 10px 5px;
        border-bottom: 1px solid #e5e5e5;
    }
    .user-container {
        margin-top: 35px;
        .user-form-item {
            padding-left: 13px;
            margin-top: 24px;
            .user-form-label {
                width: 60px;
                text-align: left;
                margin-right: 24px;
            }
            .user-avatar-upload {
                .avatar-uploader {
                    &:hover {
                        .avatar {
                            .mask {
                                display: flex;
                            }
                            &::after {
                                opacity: 1;
                            }
                        }
                    }
                    .avatar {
                        position: relative;
                        .mask {
                            display: none;
                            position: absolute;
                        }
                        &::after {
                            content: "更换头像";
                            position: absolute;
                            transition: opacity 0.3s ease;
                            opacity: 0;
                            width: 100%;
                            height: 64px;
                            left: 0;
                            top: 0;
                            border-radius: 60px;
                            background-color: rgba(
                                $color: #000000,
                                $alpha: 0.3
                            );
                            color: white;
                            display: flex;
                            flex-direction: row;
                            justify-content: center;
                            align-items: center;
                            font-size: 12px;
                        }
                    }
                }
            }
            .user-input {
                width: 240px;
            }
            .el-radio__input.is-checked + .el-radio__label {
                color: #007aff;
            }
            .el-input__inner:focus {
                border-color: #007aff;
            }
            .el-radio__input.is-checked .el-radio__inner {
                border-color: #007aff;
                background: #007aff;
            }
            .el-radio__inner:hover {
                border-color: #007aff;
            }
        }
        .primary-btn {
            height: 32px;
            width: 100px;
            margin-top: 32px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            &:focus {
                border: none;
                outline: none;
            }
        }
    }
}
</style>
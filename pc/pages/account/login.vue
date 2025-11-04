<template>
    <div class="login flex col-center">
        <div class="login-container flex col-stretch">
            <div class="login-banner">
                <!--                <el-image-->
                <!--                    fit="cover"-->
                <!--                    style="width: 100%; height: 100%"-->
                <!--                    :src="config.pc_login_logo"-->
                <!--                ></el-image>-->
                <img :src="config.pc_login_logo" height="100%" />
            </div>
            <div class="login-float-form-wrap">
                <div class="login-box">
                    <div class="login-header-box">
                        <div class="header-tabs flex row-center">
                            <div
                                class="header-tab xxl"
                                :class="{ 'active-tab': loginStatus == 0 }"
                                @click="changeLoginType(0)"
                            >验证码登录</div>
                            <div
                                class="header-tab xxl"
                                :class="{ 'active-tab': loginStatus == 1 }"
                                @click="changeLoginType(1)"
                            >账号密码登录</div>
                        </div>
                        <div v-show="loginStatus == 0" @keyup.enter="smsLogin">
                            <div class="login-form-box">
                                <div class="login-form-item">
                                    <el-input
                                        placeholder="请输入手机号码"
                                        v-model="telephone"
                                        class="input-phone-num"
                                    >
                                        <el-select
                                            style="width: 100px"
                                            v-model="selectNumberType"
                                            slot="prepend"
                                            placeholder="请选择"
                                        >
                                            <el-option label="中国+86" value="1"></el-option>
                                        </el-select>
                                    </el-input>
                                </div>
                                <div class="login-form-item flex">
                                    <el-input
                                        v-model="smsCode"
                                        placeholder="短信验证码"
                                        style="width: 210px"
                                    />
                                    <el-button class="sms-btn" @click="sendSMSCode">
                                        <div v-if="canSend">获取验证码</div>
                                        <count-down
                                            v-else
                                            :time="60"
                                            format="ss秒"
                                            :autoStart="true"
                                            @finish="canSend = true"
                                        />
                                    </el-button>
                                </div>
                            </div>
                            <div class="option-box flex-col">
                                <el-checkbox v-model="isRemember" class="muted">记住账号</el-checkbox>
                                <div class="m-t-20 flex-col">
                                    <el-button type="primary" @click="smsLogin">立即登录</el-button>
                                </div>
                            </div>
                        </div>
                        <div v-show="loginStatus == 1" @keyup.enter="accountLogin">
                            <div class="login-form-box">
                                <div class="login-form-item">
                                    <el-input
                                        placeholder="请输入账号/手机号码"
                                        v-model="account"
                                        class="input-phone-num"
                                    >
                                        <i
                                            class="el-icon-user"
                                            style="font-size: 18px"
                                            slot="prepend"
                                        ></i>
                                    </el-input>
                                </div>
                                <div class="login-form-item flex">
                                    <el-input v-model="password" placeholder="请输入密码" show-password>
                                        <i
                                            class="el-icon-more-outline"
                                            style="font-size: 18px"
                                            slot="prepend"
                                        />
                                    </el-input>
                                </div>
                            </div>
                            <div class="option-box flex-col">
                                <div class="flex row-between">
                                    <el-checkbox v-model="isRemember" class="muted">记住账号</el-checkbox>
                                    <nuxt-link class="muted" to="/account/forget_pwd">忘记密码？</nuxt-link>
                                </div>
                                <div class="m-t-20 flex-col">
                                    <el-button type="primary" @click="accountLogin">立即登录</el-button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="login-footer-box flex row-between">
                        <div class="flex">
                            <div class="flex login__other-item" @click="goWechatLogin">
                                <i class="iconfont icon-weixin1 login__weixin-icon"></i>
                                <div class="m-l-4 muted">微信</div>
                            </div>
                        </div>
                        <nuxt-link class="primary" to="/account/register">注册账号</nuxt-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { loginType, client, SMSType } from '@/utils/type'
import Cookies from 'js-cookie'
import { mapMutations, mapActions, mapState } from 'vuex'
import CountDown from '@/components/count-down'

export default {
    head() {
        return {
            title: this.$store.getters.headTitle,
            link: [
                {
                    rel: 'icon',
                    type: 'image/x-icon',
                    href: this.$store.getters.favicon,
                },
            ],
        }
    },

    layout: 'main',

    components: {
        CountDown,
    },

    data() {
        return {
            // 选择电话类型
            selectNumberType: '中国+86',
            // 账号
            account: '',
            // 密码
            password: '',
            // 电话号码
            telephone: '',
            // 图形验证码
            verifyCode: '',
            // 短信验证码
            smsCode: '',
            isRemember: true,
            // 短信登陆或账号登陆 0 ==》 短信 1 ==》账号
            loginStatus: loginType.SMS,
            canSend: true,
        }
    },
    computed: {
        ...mapState(['config']),
    },
    methods: {
        ...mapMutations(['setToken']),
        ...mapActions(['getPublicData']),

        changeLoginType(type) {
            this.loginStatus = type
            this.telephone = ''
            this.verifyCode = ''
            this.smsCode = ''
            let jsonPaser = JSON.parse(localStorage.getItem('ACCOUNT'))
            let telJson = JSON.parse(localStorage.getItem('TEL'))
            if (jsonPaser && jsonPaser.account) {
                this.account = jsonPaser.account
            }
            if (telJson && telJson.telephone) {
                this.telephone = telJson.telephone
            }
        },

        // 前往微信登录
        goWechatLogin() {
            this.$get('account/scanCode')
                .then(({ code, msg, data }) => {
                    if (code !== 1) throw new Error(msg)
                    window.open(data.url, '_self')
                })
                .catch((err) => {
                    this.$message.error(err.message)
                })
        },

        // 微信授权登录处理
        handleWechatLogin(params) {
            this.$post('account/scanLogin', params)
                .then(({ code, msg, data }) => {
                    if (code !== 1) throw new Error(msg)

                    Cookies.set('token', data.token, { expires: 60 })
                    this.setToken(data.token)
                    this.$router.replace({
                        path: Cookies.get('back_url') || '/',
                    })
                    Cookies.remove('back_url')
                    this.getPublicData()
                })
                .catch((err) => {
                    this.$message.error(err.message)
                })
        },

        async sendSMSCode() {
            if (!this.canSend) {
                return
            }
            let res = await this.$post('sms/send', {
                mobile: this.telephone,
                key: SMSType.LOGIN,
                client,
            })
            if (res.code == 1) {
                this.$message({
                    message: res.msg,
                    type: 'success',
                })
                this.canSend = false
            }
        },

        async smsLogin() {
            let res = await this.$post('account/smsLogin', {
                mobile: this.telephone,
                code: this.smsCode,
                client,
            })
            if (res.code == 1) {
                const token = res.data.token
                Cookies.set('token', token, { expires: 60 })
                this.setToken(token)
                this.$router.replace({
                    path: Cookies.get('back_url') || '/',
                })
                Cookies.remove('back_url')
                this.getPublicData()
                if (this.isRemember) {
                    localStorage.setItem(
                        'TEL',
                        JSON.stringify({
                            telephone: this.telephone,
                        })
                    )
                } else {
                    localStorage.setItem(
                        'TEL',
                        JSON.stringify({
                            telephone: '',
                        })
                    )
                }
            }
        },

        async accountLogin() {
            let res = await this.$post('account/login', {
                mobile: this.account,
                password: this.password,
                client,
            })
            if (res.code == 1) {
                const token = res.data.token
                Cookies.set('token', token, { expires: 60 })
                this.setToken(token)
                this.$router.replace({
                    path: Cookies.get('back_url') || '/',
                })
                Cookies.remove('back_url')
                this.getPublicData()
                if (this.isRemember) {
                    localStorage.setItem(
                        'ACCOUNT',
                        JSON.stringify({
                            account: this.account,
                        })
                    )
                } else {
                    localStorage.setItem(
                        'ACCOUNT',
                        JSON.stringify({
                            account: '',
                        })
                    )
                }
            }
        },
    },

    created() {

        try {
            // 获取URL Query参数
            const query = this.$route.query

            // 如果存在code和state值，即为微信扫码授权后重定向至此
            query.code &&
                query.state &&
                this.handleWechatLogin({ code: query.code, state: query.state })

            // 获取缓存数据
            const jsonPaser = JSON.parse(localStorage.getItem('ACCOUNT')) ?? {}
            const telJson = JSON.parse(localStorage.getItem('TEL')) ?? {}
            // 利用缓存数据初始化表单值
            this.account = jsonPaser?.account ?? ''
            this.telephone = telJson?.telephone ?? ''
        } catch (error) {

        }

    },
}
</script>

<style lang="scss" scoped>
.login {
    flex: 1;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: 50%;
    min-width: 1180px;
    .login-container {
        margin: 0 auto;
        width: 1180px;
        height: 100%;
        position: relative;
        .login-banner {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 750px;
            margin-right: 30px;
            height: 440px;
            overflow: hidden;
            animation: loadimg 2s infinite;
            transition: background-color 2s;
        }

        @keyframes loadimg {
            0% {
                background-color: #e4e4e4;
            }
            50% {
                background-color: #f0f0f0;
            }
            100% {
                background-color: #e4e4e4;
            }
        }

        .login-float-form-wrap {
            width: 400px;
            height: 440px;
            .login-box {
                background-color: white;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                .login-header-box {
                    padding-top: 20px;
                    .header-tabs {
                        .header-tab {
                            width: 160px;
                            height: 35px;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            cursor: pointer;
                        }
                        .active-tab {
                            color: $--color-primary;
                            text-align: center;
                            &::after {
                                content: "";
                                height: 2px;
                                width: 72px;
                                margin-top: 8px;
                                background-color: $--color-primary;
                            }
                        }
                    }
                    .login-form-box {
                        padding: 0 30px;
                        .login-form-item {
                            margin-top: 24px;
                            .input-phone-num {
                                width: 340px;
                            }
                            .verify-code-img {
                                width: 100px;
                                height: 40px;
                                margin-left: 20px;
                                background-color: red;
                            }
                            .sms-btn {
                                margin-left: 20px;
                                height: 40px;
                            }
                        }
                    }
                    .option-box {
                        padding: 0 30px;
                        margin-top: 60px;
                        ::v-deep .el-checkbox {
                            color: #888;
                        }
                    }
                }
                .login-footer-box {
                    height: 50px;
                    padding: 15px;

                    .login__other-item {
                        cursor: pointer;
                    }

                    .login__weixin-icon {
                        width: 1.5em;
                        height: 1.5em;
                        text-align: center;
                        line-height: 1.5em;
                        border-radius: 50%;
                        background-color: #0abd5d;
                        color: #ffffff;
                    }
                }
            }
        }
    }
}
</style>

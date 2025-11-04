<template>
    <div>
        <div class="m-t-20">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>商家入驻</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="store bg-white m-t-16">

            <div class="main">
                <div class="title">入驻申请</div>
                <el-form :model="form" :rules="rules" ref="form" label-width="110px" class="demo-form">
                    <el-form-item label="商家名称:" prop="name">
                        <el-input v-model="form.name" placeholder="请输入商家名称"></el-input>
                    </el-form-item>
                    <el-form-item label="主营类目:" prop="cid">
                        <el-select v-model="form.cid" placeholder="请选择" style="width: 100%">
                            <el-option v-for="item in category" :key="item.id" :label="item.name" :value="item.id">
                                {{item.name}}
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="联系人姓名:" prop="nickname">
                        <el-input v-model="form.nickname" placeholder="请输入联系人姓名"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号码:" prop="mobile">
                        <el-input v-model="form.mobile" placeholder="请输入手机号码"></el-input>
                    </el-form-item>
                    <el-form-item label="验证码:" prop="code">
                        <el-input v-model="form.code" placeholder="请输入验证码" style="width:355px"></el-input>
                        <el-button style="margin-left: 14px;width: 175px" @click="sndSmsToPhone">
                            <div v-if="canSendPwd">获取验证码</div>
                            <count-down v-else :time="60" format="ss秒" autoStart @finish="canSendPwd = true" />
                        </el-button>
                    </el-form-item>
                    <el-form-item label="创建账号:" prop="account">
                        <el-input v-model="form.account" placeholder="请设置登录账号(可用手机号代替)"></el-input>
                    </el-form-item>
                    <el-form-item label="设置密码:" prop="password">
                        <el-input v-model="form.password" placeholder="请输入登录密码"></el-input>
                    </el-form-item>
                    <el-form-item label="营业执照:" prop="">
                        <el-upload class="avatar-uploader" :action="action" :show-file-list="true"
                            list-type="picture-card" :on-success="uploadFileSuccess" :on-remove="handleRemove"
                            :headers="{token: $store.state.token}">
                            <i class="el-icon-picture avatar-uploader-icon"></i>
                            <div class="m-t-20 xs">上传图片</div>
                        </el-upload>
                        <div class="xs muted">支持jpg、png、jpeg格式的图片，最多可上传10张</div>
                    </el-form-item>

                    <el-form-item label="">
                        <div class="xs muted m-t-20">
                            <el-checkbox v-model="checked"></el-checkbox>
                            同意并阅读<span class="primary pointer" @click="dialogVisible=true">《服务协议》</span>
                        </div>
                        <div class="flex m-t-10">
                            <el-button style="width: 213px;" class="bg-primary white" @click="onSubmitStore('form')">
                                提交申请
                            </el-button>
                            <span class="m-l-20 xs muted pointer"
                                @click="$router.push('/store_settled/record')">查看申请记录</span>
                        </div>
                    </el-form-item>
                </el-form>
            </div>

        </div>

        <!-- 服务协议 -->
        <el-dialog title="提示" :visible.sync="dialogVisible" width="50%">
            <div style="height: 40vh;overflow-y: auto;">
                <div v-html="content">

                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import config from "~/config/app";
import { SMSType } from "~/utils/type";
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
    data() {
        return {
            checked: false,
            action: config.baseUrl + "/api/file/formimage",
            category: [], //类目
            fileList: [],
            content: "", //隐私协议
            dialogVisible: false, //是否显示服务协议
            canSendPwd: true, //是否验证码
            form: {
                cid: "", //类目ID
                clabel: "", //类目名称
                name: "", //商家名称
                nickname: "", //联系人姓名
                mobile: "", //手机号码
                account: "", //账号
                password: "", //密码
                code: "", //验证码
            },
            rules: {
                name: [
                    {
                        required: true,
                        message: "请输入商家名称",
                        trigger: "blur",
                    },
                ],
                cid: [
                    {
                        required: true,
                        message: "请选择主营类目",
                        trigger: "change",
                    },
                ],
                nickname: [
                    {
                        required: true,
                        message: "请输入联系人姓名",
                        trigger: "blur",
                    },
                ],
                mobile: [
                    {
                        required: true,
                        message: "请输入手机号码",
                        trigger: "blur",
                    },
                    {
                        // pattern: /^1[3|4|5|7|8][0-9]{9}$/,
                        pattern: /^[1][3,4,5,6.7,8,9][0-9]{9}$/,
                        message: "请输入正确的手机号",
                    },
                ],
                code: [
                    {
                        required: true,
                        message: "请输入验证码",
                        trigger: "blur",
                    },
                ],
                account: [
                    {
                        required: true,
                        message: "请输入登录账号",
                        trigger: "blur",
                    },
                ],
                password: [
                    {
                        required: true,
                        message: "请输入设置登录密码",
                        trigger: "blur",
                    },
                ],
                imageForm: [
                    {
                        required: true,
                        message: "请上传营业执照",
                        trigger: "blur",
                    },
                ],
            },
        };
    },

    async asyncData({ $get }) {
        const { data } = await $get("shop_category/getList");
        return { category: data };
    },

    mounted() {
        this.getServiceData();
    },

    methods: {
        async sndSmsToPhone() {
            // if (!/^1[3|4|5|7|8][0-9]{9}$/.test(this.form.mobile))
            if (!/^[1][3,4,5,6.7,8,9][0-9]{9}$/.test(this.form.mobile))
                return this.$message.error("请输入正确的手机号码");
            const { code } = await this.$post("sms/send", {
                mobile: this.form.mobile,
                key: SMSType.SJSQYZ,
            });
            if (code == 1) {
                this.canSendPwd = false;
                return this.$message.success("发送成功");
            } else return this.$message.error("发送失败");
        },

        uploadFileSuccess(res, fileList) {
            this.fileList.push(res.data.uri);
            console.log(res, this.fileList);
        },

        handleRemove(file, fileList) {
            console.log(fileList);
            if (fileList.length >= 0) {
                const res = fileList.map((item) => item.response.data.uri);
                this.fileList = res;
            }
        },

        async getServiceData() {
            const res = await this.$get("ShopApply/getTreaty");

            if (res.code == 1) {
                this.content = res.data.content;
            }
        },

        onSubmitStore(formName) {
            if (!this.checked)
                return this.$message.error("请同意并阅读服务协议");
            this.$refs[formName].validate(async (valid) => {
                if (valid) {
                    const { data, code, msg } = await this.$post(
                        "ShopApply/apply",
                        {
                            ...this.form,
                            license: this.fileList,
                        }
                    );
                    if (code == 1) {
                        // data.id
                        this.$router.push({
                            path: "/store_settled/detail",
                            query: {
                                id: data.id,
                            },
                        });
                    }
                } else return false;
            });
        },
    },
};
</script>

<style lang="scss" scope>
.store {
    width: 100%;
    .main {
        width: 660px;
        margin: 0 auto;
        padding-bottom: 52px;
        .title {
            padding: 16px 0;
            color: #101010;
            font-size: 18px;
            text-align: center;
        }
        ::v-deep .el-input__inner {
            border-radius: 0 !important;
        }

        .avatar-uploader .el-upload {
            width: 100px;
            height: 100px;
            border: 1px solid #d9d9d9;
            cursor: pointer;
            position: relative;
            line-height: 0px;
            padding: 20px 0;
            color: #101010;
            overflow: hidden;
            border-radius: 0;
        }
        .avatar-uploader .el-upload:hover {
            border-color: #ff2c3c;
        }
        .avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            text-align: center;
        }
        .avatar {
            width: 100px;
            height: 100px;
            display: block;
        }
    }
}
</style>

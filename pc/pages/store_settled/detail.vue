<template>
    <div class="detail">

        <div class="m-t-20">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/store_settled' }"><a>商家入驻</a></el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/store_settled/record' }"><a>申请列表</a></el-breadcrumb-item>
                <el-breadcrumb-item>详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="main  bg-white m-t-20">

            <div class="header">
                <div class="m-b-30 pointer" @click="$router.back();">
                    <i class="el-icon-arrow-left"></i>
                    返回
                </div>

                <div v-if="detail.audit_status==1">
                    <div class="flex normal xxl bold" style="font-weight:600">
                        <img class="m-r-12" src="~/static/images/time.png" alt="">
                        恭喜您，资料提交成功
                    </div>
                    <div class="xs muted m-t-12 m-l-42">
                        预计在3个工作日内审核完毕，如通过我们将会发送短信通知您，请注意查收！
                    </div>
                </div>

                <div v-else-if="detail.audit_status==3">
                    <div class="flex normal xxl bold" style="font-weight:600">
                        <img class="m-r-12" src="~/static/images/error.png" alt="">
                        很遗憾，审核不通过！
                    </div>
                    <div class="xs muted m-t-12 m-l-42">
                        请尽量完善您的资料信息再重新提交！
                    </div>
                </div>

                <div v-else-if="detail.audit_status==2">
                    <div class="flex normal xxl bold" style="font-weight:600">
                        <img class="m-r-12" src="~/static/images/success.png" alt="">
                        恭喜您，审核已通过！
                    </div>
                    <div class="xs muted m-t-12 m-l-42">
                        您的审核已通过
                    </div>

                    <div class="admin m-t-20">
                        <div class="xs p-t-16">
                            <span>PC管理后台地址：</span>
                            <a :href="detail.admin_address">
                                {{detail.admin_address}}
                            </a>
                        </div>
                        <div class="xs m-t-16">
                            <span>商家账号：</span>
                            <a href="" target="_blank" rel="noopener noreferrer">
                                {{detail.account}}
                            </a>
                        </div>
                        <div class="xs m-t-16">
                            <span>登录密码：</span>
                            登录密码：密码是您在创建账号时设置的登录密码，如忘记密码可联系官方客服进行修改！
                        </div>
                    </div>

                </div>
            </div>

            <div class="section">
                <div class="xl bold normal m-b-30">资料详情</div>
                <el-form :model="detail" size="medium" :label-position="'left'" ref="form" label-width="110px"
                    class="demo-form">
                    <el-form-item label="商家名称:" prop="name">
                        <span>{{detail.name}}</span>
                    </el-form-item>
                    <el-form-item label="主营类目:" prop="name">
                        <span>{{detail.cid_desc}}</span>
                    </el-form-item>
                    <el-form-item label="联系人姓名:" prop="name">
                        <span>{{detail.nickname}}</span>
                    </el-form-item>
                    <el-form-item label="手机号码:" prop="name">
                        <span>{{detail.mobile}}</span>
                    </el-form-item>
                    <el-form-item label="商家账号:" prop="name">
                        <span>{{detail.account}}</span>
                    </el-form-item>
                    <el-form-item label="营业执照:" prop="name">
                        <el-image v-for="(item, index) in detail.license" :key="index"
                            style="width: 72px; height: 72px; margin-right: 10px" :src="item" fit="fit"></el-image>
                    </el-form-item>
                </el-form>
            </div>

        </div>
    </div>
</template>

<script>
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

    data() {
        return {
            detail: {},
        };
    },

    async mounted() {
        console.log(this.$route.query.id);
        const { data } = await this.$get("ShopApply/detail", {
            params: { id: this.$route.query.id },
        });
        this.detail = data

        console.log("我艹啊私房话哀诉还是");
    },

    methods: {},
};
</script>

<style lang="scss" scope>
.detail {
    width: 100%;
    height: 788px;
    .main {
        width: 100%;
        height: 788px;
        padding: 30px;
        .header {
            padding: 0px 0 40px;
            margin-bottom: 25px;
            border-bottom: 1px dotted #e5e5e5;
            img {
                width: 32px;
                height: 32px;
            }
            .admin {
                background: #f6f6f6;
                padding: 0 30px;
                padding-bottom: 16px;
                a:hover {
                    color: #ff2c3c;
                }
            }
        }
    }
}
</style>
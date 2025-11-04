<template>
    <div class="record">
        <div class="m-t-20">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/store_settled' }"><a>商家入驻</a></el-breadcrumb-item>
                <el-breadcrumb-item>申请列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="main bg-white m-t-20">

            <el-table :data="record" style="width: 100%" size="medium"
                :header-cell-style="{background:'#eee',color:'#606266'}">
                <el-table-column prop="name" label="商家名称" max-width="180">
                </el-table-column>
                <el-table-column prop="audit_status_desc" label="审核状态" max-width="180">
                    <template slot-scope="scope">
                        <div class="primary" v-if="scope.row.audit_status==3">{{scope.row.audit_status_desc}}</div>
                        <div v-else>{{scope.row.audit_status_desc}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="apply_time" label="提交时间" max-width="180">
                </el-table-column>
                <el-table-column label="操作" max-width="180">
                    <template slot-scope="scope">
                        <div class="pointer" @click="$router.push({
                            path: '/store_settled/detail',
                            query: {
                                id: scope.row.id
                            }
                        })">查看详情</div>
                    </template>
                </el-table-column>
            </el-table>

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
            record: [],
        };
    },

    mounted() {
        // console.log("我艹啊私房话哀诉还是");
    },

    async asyncData({ $get }) {
        const { data } = await $get("ShopApply/record");
        console.log(data);
        return { record: data.lists };
    },

    methods: {},
};
</script>

<style lang="scss" scope>
.record {
    width: 100%;
    height: 788px;
    .main {
        padding: 18px;
        height: 100%;
    }
}
</style>
<template>
    <div class="footer-container">
        <div class="footer-box flex row-center">
            <div class="server-box flex row-between">
                <div class="flex" v-for="(item, index) in lists" :key="index">
                    <i
                        :class="`white iconfont ${item.icon}`"
                        style="font-size: 50px"
                    />
                    <div class="m-l-8 xxl name">{{ item.name }}</div>
                </div>
            </div>
        </div>
        <footer class="footer-wrap flex row-center">
            <a class="white" target="_blank" :href="config.icp_link"
                >{{ config.copyright_info }} {{ config.icp_number }}</a
            >
        </footer>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    data() {
        return {
            lists: [
                {
                    name: '自营商城',
                    icon: 'icon-ziying',
                },
                {
                    name: '正品保障',
                    icon: 'icon-zhengpin',
                },
                {
                    name: '专属服务',
                    icon: 'icon-fuwu',
                },
                {
                    name: '售后无忧',
                    icon: 'icon-peisong',
                },
                {
                    name: '极速配送',
                    icon: 'icon-shouhou',
                },
            ],
        }
    },
    computed: {
        ...mapState(['config']),
    },
}
</script>

<style lang="scss" scoped>
.footer-container {
    margin-top: 38px;
    .footer-box {
        height: 120px;
        background-color: #222;
        min-width: 1180px;
        .server-box {
            width: 1180px;
            padding: 36px 40px;
            border-bottom: 1px solid #707070;
            .name {
                color: #e5e5e5;
            }
        }
    }
    .footer-wrap {
        min-width: 1180px;
        background-color: #222;
        height: 60px;
        color: #ccc;
    }
}
</style>
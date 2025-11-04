<template>
    <nav>
        <div class="header-nav bg-white">
            <div class="nav-wrap flex">
                <category />
                <ul class="nav flex">
                    <li class="item">
                        <nuxt-link to="/">首页</nuxt-link>
                    </li>

                    <li class="item">
                        <nuxt-link to="/seckill">限时秒杀</nuxt-link>
                    </li>
                    <li class="item">
                        <nuxt-link to="/goods_list/1">热销榜单</nuxt-link>
                    </li>
                    <li class="item">
                        <nuxt-link to="/goods_list/2">新品推荐</nuxt-link>
                    </li>
                    <li class="item">
                        <nuxt-link to="/shop_street">店铺街</nuxt-link>
                    </li>

                    <li class="item">
                        <nuxt-link to="/get_coupons">领券中心</nuxt-link>
                    </li>
                    <li class="item">
                        <nuxt-link to="/news_list">商城资讯</nuxt-link>
                    </li>
                    <li class="item">
                        <nuxt-link to="/help_center">帮助中心</nuxt-link>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script>
import { mapState } from 'vuex'
import Category from './category'
export default {
    components: {
        Category,
    },
    created() {},
    computed: {
        ...mapState(['publicData']),
    },
}
</script>

<style lang="scss" scoped>
.header-nav {
    border-top: 1px solid $--background-color-base;
    .nav-wrap {
        width: 1180px;
        margin: 0 auto;
    }
    .nav {
        overflow-x: auto;
        overflow-y: hidden;
        .item {
            a {
                padding: 12px 15px;
                margin: 0 10px;
                color: #101010;
                font-size: 16px;
                white-space: nowrap;
                &:hover {
                    color: $--color-primary;
                }
                &.nuxt-link-exact-active {
                    color: $--color-primary;
                }
            }
        }
    }
}
</style>

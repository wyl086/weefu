<template>
    <div class="default-layout flex-col">
        <div class="default-header">
            <div class="haeder-con">
                <nuxt-link to="/" v-if="config.shop_login_logo">
                    <img class="header-logo" :src="config.shop_login_logo" />
                </nuxt-link>
            </div>
        </div>
        <div class="default-main flex-1">
            <nuxt />
        </div>
        <ls-footer></ls-footer>
    </div>
</template>

<script>
import LsFooter from '~/components/layout/footer'
import { mapState } from 'vuex'
export default {
    components: {
        LsFooter,
    },
    data() {
        return {}
    },
    created() {},
    computed: {
        ...mapState(['config']),
    },
    methods: {},
}
</script>

<style lang="scss" scoped>
.default-layout {
    min-height: 100vh;
    .default-header {
        padding: 22px 0;
        background-color: white;
        min-width: 1180px;
        border-bottom: 1px solid #e5e5e5;
        .haeder-con {
            width: 1180px;
            margin: 0 auto;
        }
        .header-logo {
            height: 56px;
        }
    }
    .default-main {
        display: flex;
        flex-direction: column;
    }
}
</style>

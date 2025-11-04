<template>
    <div class="default-layout flex-col">
        <ls-header></ls-header>
        <main class="content-container">
            <nuxt />
        </main>
        <ls-footer></ls-footer>
        <float-nav></float-nav>
    </div>
</template>
<script>
import LsHeader from '~/components/layout/header'
import LsFooter from '~/components/layout/footer'
import FloatNav from '~/components/layout/float-nav'
import MainNav from '~/components/layout/main-nav'
export default {
    components: {
        LsHeader,
        LsFooter,
        FloatNav,
        MainNav,
    },
}
</script>
<style scoped>
.default-layout {
    min-height: 100vh;
}
</style>

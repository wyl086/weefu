<template>
    <div class="default-layout flex-col">
        <ls-header></ls-header>
        <main-nav />
        <main class="content-container wrapper1180 flex flex-1">
            <aslide-nav />
            <div class="content bg-white flex-1">
                <nuxt />
            </div>
        </main>
        <ls-footer></ls-footer>
        <float-nav></float-nav>
    </div>
</template>
<script>
import LsHeader from "~/components/layout/header";
import LsFooter from "~/components/layout/footer";
import AslideNav from "~/components/layout/aslide-nav";
import MainNav from '~/components/layout/main-nav'
import FloatNav from "~/components/layout/float-nav";
export default {
    components: {
        LsHeader,
        LsFooter,
        AslideNav,
        FloatNav,
        MainNav
    },
};
</script>
<style scoped>
.default-layout {
    min-height: 100vh;
}
.content-container {
    padding: 24px 0;
    align-items: flex-start;
}
.content-container > .content {
    min-height: 680px;
}
</style>
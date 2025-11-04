<template>
    <div class="get-coupons">
        <div class="help-center-banner">
            <client-only>
                <swiper ref="mySwiper" :options="swiperOptions">
                    <swiper-slide class="swiper-item" v-for="(item, index) in bannerList" :key="index">
                        <ad-item :item="item"></ad-item>
                    </swiper-slide>
                </swiper>
            </client-only>
        </div>
        <div class="coupons bg-white">
            <div class="title weight-500">每日领券</div>
            <div class="list">
                <coupons-list v-if="couponList.length" :list="couponList" :type="3" @reflash="getCouponsList" />
                <null-data v-else :img="require('~/static/images/coupon_null.png')" text="暂无优惠券~"></null-data>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        head() {
            return {
                title: this.$store.getters.headTitle,
                link: [{
                    rel: "icon",
                    type: "image/x-icon",
                    href: this.$store.getters.favicon
                }],
            };
        },
        async asyncData({
            query,
            $get
        }) {
            const {
                data
            } = await $get("coupon/getCouponList");
            console.log('datafadadaasd', data)

            const { data: banner }= await $get("ad_content/lists", { params: { pid: 27, terminal: 2 } });

            return {
                couponList: data.lists,
                bannerList: banner,
            };
        },

        data() {
            return {
                swiperOptions: {
                    width: 1180,
                }
            }
        },

        methods: {
            async getCouponsList() {
                const {
                    data,
                    code
                } = await this.$get("coupon/getCouponList");
                if (code == 1) {
                    this.couponList = data.lists;
                }
            },
        },
    };
</script>

<style lang="scss">
    .get-coupons {
        padding: 16px 0;

        .coupons {
            padding: 0 14px;

            .title {
                padding: 16px 18px;
                font-size: 20px;
            }
        }
    }
</style>

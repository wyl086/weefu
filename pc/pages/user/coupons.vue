<template>
    <div class="user-coupons">
        <div class="coupons-header lg">
            我的优惠券
        </div>

        <div class="tabs">
            <el-button v-for="(value,key,index) in expand" @click="changeTabs(index)" :key="key" class="button m-l-18"
                :class="index==active?'active':''" type="primary">
                {{coupons[index].title}}({{value}})</el-button>

            <div v-for="(item2, index2) in coupons" :key="index2">
                <div class="m-t-20" v-if="index2==active">
                    <coupons-list v-if="item2.hasData" :list="item2.list" :type="active" />
                    <null-data v-else :img="require('~/static/images/coupon_null.png')" text="暂无优惠券~"></null-data>
                </div>
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
    layout: "user",
    components: {},
    data() {
        return {
            active: 0,
            expand: {
                valid: 0,
                used: 0,
                expired: 0,
            },
            coupons: [
                {
                    title: "可使用",
                    type: "valid",
                    list: [],
                    hasData: true,
                },
                {
                    title: "已使用",
                    type: "used",
                    list: [],
                    hasData: true,
                },
                {
                    title: "已过期",
                    type: "expired",
                    list: [],
                    hasData: true,
                },
            ],
        };
    },
    mounted() {
        this.getMyCoupons();
    },
    methods: {
        changeTabs(index) {
            this.active = index;
            this.getMyCoupons();
        },
        async getMyCoupons() {
            let { data, code } = await this.$get("coupon/myCouponList", {
                params: {
                    type: this.coupons[this.active].type + "",
                    page_size: 100,
                },
            });
            if (code == 1) {
                for (const key in this.expand) {
                    this.$set(this.expand, key, data.expand[key]);
                }
                this.changeData(data);
            }
        },
        changeData(data) {
            this.coupons.some((item, index) => {
                console.log(data, index);
                if (index == this.active) {
                    Object.assign(item, {
                        list: data.lists,
                        hasData: data.lists.length,
                    });
                    return true;
                }
            });
        },
    },
};
</script>

<style lang="scss">
.user-coupons {
    width: 980px;
    .coupons-header {
        padding: 20px 15px;
        border-bottom: 1px solid #e5e5e5;
    }

    .tabs {
        padding: 15px 0;
        .button {
            width: 104px;
            height: 30px;
            line-height: 0px;
            display: inline-block;
            background: #fff;
            color: #666;
            border: 1px solid #e5e5e5;
        }
        .active {
            color: #fff;
            border: 0;
            background: $--color-primary;
        }
    }
}
</style>
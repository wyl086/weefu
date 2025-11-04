<template>
    <div class="coupons-list flex">
        <template v-for="(item, index) in couponsList">
            <div v-show="item.isShow" class="item" :key="index">
                <div
                    :class="[
                        'info white',
                        {
                            gray: type == 2 || type == 1,
                        },
                    ]"
                >
                    <div class="info-hd flex">
                        <div>
                            <price-formate
                                :price="item.money"
                                :first-size="38"
                                :second-size="38"
                            />
                        </div>
                        <div class="m-l-8 flex1">
                            <div class="line1">{{ item.name }}</div>
                            <div class="xs line1">
                                {{ item.condition_type_desc }}
                            </div>
                        </div>
                    </div>
                    <div class="info-time xs">{{ item.user_time_desc }}</div>
                </div>
                <div
                    class="tips flex row-between"
                    @click.stop="onShowTips(index)"
                >
                    <div class="muted xs">{{ item.use_scene_desc }}</div>
                    <div
                        v-if="
                            item.use_goods_type != 1 &&
                            (type == 1 || type == 2 || type == 0)
                        "
                    >
                        <i
                            :class="
                                showTips[index]
                                    ? 'el-icon-arrow-up'
                                    : 'el-icon-arrow-down'
                            "
                        ></i>
                        <div
                            class="tips-con xs lighter"
                            v-if="
                                item.use_scene_desc != '全场通用' &&
                                showTips[index]
                            "
                        >
                            {{ item.use_goods_desc }}
                        </div>
                    </div>
                    <div
                        class="primary sm"
                        v-if="type == 3 && !item.is_get"
                        @click.capture="
                            onHandle(
                                item.id,
                                item.is_get,
                                item.can_continue_get,
                                item,
                                3
                            )
                        "
                    >
                        立即领取
                    </div>
                    <div
                        class="primary sm"
                        v-if="item.is_get && item.can_continue_get"
                        @click.capture="
                            onHandle(
                                item.id,
                                item.is_get,
                                item.can_continue_get,
                                item,
                                3
                            )
                        "
                    >
                        继续领取
                    </div>
                    <div
                        class="primary sm"
                        v-if="
                            (item.is_get && !item.can_continue_get) || type == 0
                        "
                        @click.capture="
                            onHandle(
                                item.id,
                                item.is_get,
                                item.can_continue_get,
                                item,
                                4
                            )
                        "
                    >
                        去使用
                    </div>
                </div>
                <img
                    v-if="item.is_get"
                    class="receice"
                    src="~/static/images/coupons_img_receive.png"
                    alt=""
                />
                <div class="choose xs" v-if="type == 4 && id == item.id">
                    已选择
                </div>
            </div>
        </template>

        <div
            class="more muted"
            v-if="showMore && list.length > 4"
            @click="changeShow"
        >
            {{ isMore ? "收起" : "更多" }}
            <i :class="isMore ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
        </div>
    </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
    props: {
        list: {
            type: Array,
            default: () => [],
        },
        type: {
            type: Number,
        },
        showMore: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            showTips: [],
            couponsList: [],
            id: "",
            isMore: false,
            isUse: false,
        };
    },
    methods: {
        ...mapActions(["getPublicData"]),
        onHandle(id, isGet, can_continue_get, item, btnType) {
            this.id = id;
            // const { type } = this;
            switch (btnType) {
                case 0:
                    // 可使用
                    break;
                case 1:
                    break;
                // 已使用
                case 2:
                    break;
                //过期
                case 3:
                    // 领券
                    if (!isGet || (isGet && can_continue_get)) {
                        this.getCoupon();
                        item.is_get = 1;
                        item.can_continue_get = 0;
                    }
                    break;
                case 4:
                    //去使用
                    if (this.type == 0) {
                        console.log(item);
                        this.$router.replace({
                            path: `/shop_street_detail`,
                            query: {
                                id: item.shop_id,
                            },
                        });
                    } else {
                        this.$router.replace({
                            path: `/shop_street_detail`,
                            query: {
                                id: item.shop.id,
                            },
                        });
                    }
                    break;

                // if (this.selectId == id) {
                //     this.id = "";
                // }
                // this.$emit("use", this.id);
                // this.selectId = this.id;
            }
        },
        async getCoupon() {
            const { msg, code } = await this.$post("coupon/getCoupon", {
                coupon_id: this.id,
            });
            if (code == 1) {
                this.$message({
                    message: msg,
                    type: "success",
                });
                this.getPublicData();
                // this.$emit("reflash");
            }
        },
        onShowTips(index) {
            const { showTips } = this;

            this.showTips[index] = showTips[index] ? 0 : 1;
            // 拷贝数组
            this.showTips = Object.assign([], this.showTips);
        },
        changeShow() {
            this.isMore = !this.isMore;
            this.list.forEach((item, index) => {
                item.isShow = true;
                if (!this.isMore && index >= 4) {
                    item.isShow = false;
                }
            });
            this.couponsList = [...this.list];
        },
    },
    watch: {
        list: {
            handler: function (val) {
                if (val.length) {
                    // 默认选中第一张
                    if (this.type == 4) {
                        this.id = val[0].id;
                        this.selectId = this.id;
                        this.$emit("use", this.id);
                    }
                }
                let arr = val.map((item) => {
                    return 0;
                });
                this.showTips = arr;
                this.list.forEach((item, index) => {
                    // item.isUse = false;
                    // this.$set("item.isUse", false);
                    item.isShow = true;
                    if (this.showMore) {
                        if (index >= 4) {
                            item.isShow = false;
                        }
                    }
                });
                console.log(this.list, "//////");
                this.couponsList = this.list;
            },
            immediate: true,
            deep: true,
        },
    },
};
</script>

<style lang="scss" scoped>
.coupons-list {
    padding: 0 18px;
    flex-wrap: wrap;
    position: relative;

    .item {
        margin-bottom: 20px;
        margin-right: 16px;
        position: relative;
        cursor: pointer;

        .info {
            padding: 0 10px;
            background: url("~/static/images/bg_coupon_s.png") no-repeat;
            width: 240px;
            height: 80px;
            background-size: 100%;

            &.gray {
                background-image: url("~/static/images/bg_coupon.png");
            }

            .info-hd {
                overflow: hidden;
            }
        }

        .tips {
            position: relative;
            background-color: #f2f2f2;
            height: 30px;
            padding: 0 8px;

            .tips-con {
                width: 100%;
                left: 0;
                background-color: #f2f2f2;
                position: absolute;
                top: 30px;
                padding: 10px;
                z-index: 99;
            }
        }

        .receice {
            position: absolute;
            top: 0;
            right: 0;
            width: 58px;
            height: 45px;
        }

        .choose {
            position: absolute;
            top: 0;
            right: 0;
            background-color: #ffe72c;
            color: $--color-primary;
            padding: 1px 5px;
        }
    }

    .more {
        position: absolute;
        bottom: 20px;
        cursor: pointer;
        right: 30px;
    }
}
</style>

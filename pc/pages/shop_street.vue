<!-- 店铺街 -->
<template>
    <div class="street">
        <!-- 店铺卡片 -->
        <div class="shop-street flex flex-wrap flex-center">
            <div v-for="(item, index) in shopList" :key="index">
                <!-- 店铺卡片 -->
                <div class="shop-cart">
                    <shop-item
                        :cover="item.cover"
                        :shopId="item.id"
                        :logo="item.logo"
                        :type="item.type"
                        :name="item.name"
                        :sales="item.on_sale_goods"
                    />
                </div>
            </div>
        </div>
        <!-- 分页栏 -->
        <div
            class=""
            style="padding-bottom: 38px; text-align: center"
            v-if="count"
        >
            <el-pagination
                background
                layout="prev, pager, next"
                :total="count"
                prev-text="上一页"
                next-text="下一页"
                hide-on-single-page
                :page-size="pageSize"
                @current-change="changePage"
            >
            </el-pagination>
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
                    rel: 'icon',
                    type: 'image/x-icon',
                    href: this.$store.getters.favicon,
                },
            ],
        }
    },

    async asyncData({ query, $get }) {
        const {
            data: { list, count },
        } = await $get('shop/getShopList', {
            params: {
                page_size: 8,
                page_no: 1,
            },
        })
        return {
            shopList: list,
            count: count,
        }
    },

    data() {
        return {
            shopList: [],
            count: 0,
            page: 1,
            pageSize: 8,
        }
    },

    methods: {
        changePage(current) {
            this.page = current
            this.getShopList()
        },

        async getShopList() {
            const { page, pageSize } = this
            const {
                data: { list, count },
                code,
            } = await this.$get('shop/getShopList', {
                params: {
                    page_size: pageSize,
                    page_no: page,
                },
            })
            if (code == 1) {
                this.shopList = list
                this.count = count
            }
        },
    },
}
</script>

<style lang="scss" scoped>
.shop-street {
    width: 1180px;
    padding: 20px 0;

    .shop-cart {
        width: 270px;
        height: 400px;
        // background-color: lightcoral;
        margin-bottom: 20px;

        &:not(:nth-of-type(4n)) {
            margin-right: 20px;
        }

        .shop-desc {
            width: 249px;
            height: 124px;
            background-color: #ffffff;
            margin-top: 247px;
            margin-bottom: 9px;
            border-radius: 6px;
            position: relative;

            .shop-logo {
                position: absolute;
                top: -26px;
                left: 89px;
                z-index: 10;
            }

            .shop-name {
                margin-top: 52px;
                padding: 0 10px;
                margin-bottom: 4px;
                text-align: center;
                font-size: 16px;
                color: #101010;
            }

            .goods-num {
                width: 82px;
                height: 24px;
                text-align: center;
                background: #e5e5e5;
                padding-top: 4px;
                margin-bottom: 20px;
                font-size: 12px;
                border-radius: 4px;
                color: #999999;
            }
        }
    }
}
</style>

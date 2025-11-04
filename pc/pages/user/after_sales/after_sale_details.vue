<template>
    <div class="apply-detail">
        <div class="apply-detail-content">
            <el-table :data="lists.order_goods" style="width: 100%">
                <el-table-column prop="date" label="商品信息" max-width="180">
                    <template slot-scope="scope">
                        <div class="flex">
                            <el-image style="width: 80px; height: 80px" :src="scope.row.image" fit="fit"></el-image>
                            <div class="m-l-10">
                                <div class="line-2">
                                    {{scope.row.goods_name}}
                                </div>
                                <div>
                                    {{scope.row.spec_value}}
                                </div>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="价格" width="180">
                    <template slot-scope="scope">
                        ¥{{scope.row.goods_price}}
                    </template>
                </el-table-column>
                <el-table-column prop="goods_num" label="数量" width="180">
                </el-table-column>
                <el-table-column prop="address" label="申请状态" width="180">
                    <template>{{lists.status_text}}</template>
                </el-table-column>
            </el-table>

            <div class="m-t-30" style="padding: 0 20px">
                <div class="result-content">
                    <div class="result-item flex">
                        <div class="label">退款类型:</div>
                        <div class="desc">{{lists.refund_type_text}}</div>
                    </div>
                    <div class="result-item flex">
                        <div class="label">退款原因:</div>
                        <div class="desc">{{lists.refund_reason}}</div>
                    </div>
                    <div class="result-item flex">
                        <div class="label">退款金额:</div>
                        <div class="desc">
                            <price-formate :price="lists.refund_price" showSubscript color="red" />
                        </div>
                    </div>
                    <div class="result-item flex">
                        <div class="label">申请时间:</div>
                        <div class="desc">{{lists.create_time}}</div>
                    </div>
                    <div class="result-item flex">
                        <div class="label">退款编号:</div>
                        <div class="desc">{{lists.sn}}</div>
                    </div>
                    <div class="result-item flex">
                        <div class="label">退款说明:</div>
                        <div class="column desc">
                            <div class="m-b-16"></div>
                            <el-image style="width: 76px;height: 76px;" :src="lists.refund_image"
                                v-if="lists.refund_image" :preview-src-list="[lists.refund_image]" />
                        </div>
                    </div>
                </div>
            </div>

            <div class="apply-detail-address flex" v-if="lists.refund_type_text == '退款退货' && lists.status == 2">
                退货地址：{{lists.shop.contact||'-'}},{{lists.shop.mobile||'-'}}, {{lists.shop.address||'-'}}
                <div class="copy pointer" @click="onCopy">复制</div>
            </div>

            <div class="btn-group flex row-center m-t-60">
                <el-popconfirm title="确定撤销商品吗？" confirm-button-text="确定" cancel-button-text="取消" icon="el-icon-info"
                    icon-color="red" @confirm="cancelApply(lists.id)">
                    <el-button class="apply-btn flex row-center sm" size="small" slot="reference"
                        v-if="lists.status!=6">撤销申请</el-button>
                </el-popconfirm>
                <el-button class="apply-btn flex row-center sm" size="small" v-if="lists.status==2"
                    @click="showInput=true">填写快递单号</el-button>
            </div>
        </div>
        <input-express v-model="showInput" @success="getDetail" :aid="lists.id" />
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

    data() {
        return {
            lists: {
                order_goods: [],
                shop: {},
            },
            showInput: false,
        };
    },

    mounted() {
        this.getDetail();
    },

    methods: {
        async getDetail() {
            let res = await this.$get("after_sale/detail", {
                params: {
                    id: this.$route.query.afterSaleId,
                },
            });
            if (res.code == 1) {
                let goods = [res.data.order_goods];
                res.data.order_goods = goods;
                console.log(goods);
                this.lists = res.data;
            }
        },

        onCopy() {
            // this.deliverOrder.invoice_no;
            let oInput = document.createElement("input");
            oInput.value = this.lists.shop.address;
            document.body.appendChild(oInput);
            oInput.select();
            document.execCommand("Copy");
            this.$message.success("复制成功");
            oInput.remove();
        },

        async cancelApply(afterSaleId) {
            let res = await this.$post("after_sale/cancel", {
                id: afterSaleId,
            });
            if (res.code == 1) {
                this.$message({
                    message: res.msg,
                    type: "success",
                });
                setTimeout(() => {
                    this.$router.go(-1);
                }, 500);
            }
        },

        goRefund(afterSaleId, orderId, itemId) {
            this.$router.push(
                "/user/after_sales/apply_result?afterSaleId=" +
                    afterSaleId +
                    "&order_id=" +
                    orderId +
                    "&item_id=" +
                    itemId
            );
        },
    },
};
</script>

<style lang="scss" scoped>
.apply-detail {
    padding: 10px;
    .apply-detail-header {
        padding: 15px 0;
        border-bottom: 1px solid #e5e5e5;
    }
    .apply-detail-address {
        margin: 0 10px;
        padding-top: 16px;
        border-top: 1px solid #e5e5e5;

        .copy {
            margin-left: 20px;
            padding: 2px 6px;
            color: $--color-primary;
            background-color: rgba(255, 44, 60, 0.2);
        }
    }
    .result-content {
        padding: 24px 20px;
        .result-item {
            margin-bottom: 16px;
            &:not(:last-of-type) {
                .label {
                    width: 82px;
                    align-self: flex-start;
                    text-align: right;
                    &::before {
                        content: "* ";
                        color: red;
                    }
                }
            }
            .label {
                width: 82px;
                align-self: flex-start;
                text-align: right;
            }
            .desc {
                margin-left: 24px;
                width: 680px;
            }
        }
    }
    .apply-detail-content {
        .btn-group {
            .apply-btn {
                border: 1px solid #cccccc;
                border-radius: 2px;
                width: 100px;
                height: 32px;
                align-self: flex-start;
                margin-right: 10px;
            }
        }
    }
}
</style>
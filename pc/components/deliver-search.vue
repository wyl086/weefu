<template>
    <div class="deliver-search-container">
        <el-dialog :visible.sync="showDialog" top="30vh" width="900px" title="物流查询">
            <div class="deliver-box">
                <div class="deliver-recode-box flex">
                    <div class="recode-img">
                        <el-image style="width: 100%; height: 100%" fit="cover" :src="deliverOrder.image" />
                        <div class="float-count flex row-center">共{{deliverOrder.count}}件商品</div>
                    </div>
                    <div class="recode-info-container m-l-10">
                        <div class="flex">
                            <div class="recode-label">物流状态：</div>
                            <div class="primary lg" style="font-weight: 500">{{deliverOrder.tips}}</div>
                        </div>
                        <div class="flex" style="margin: 6px 0;">
                            <div class="recode-label">快递公司：</div>
                            <div >{{deliverOrder.shipping_name}}</div>
                        </div>
                        <div class="flex">
                            <div class="recode-label">快递单号：</div>
                            <div>{{deliverOrder.invoice_no}}</div>
                            <div class="copy-btn primary flex row-center" @click="onCopy">复制</div>
                        </div>
                    </div>
                </div>
                <div class="deliver-flow-box m-t-16">
                    <el-timeline>
                        <!-- 收货 -->
                        <el-timeline-item
                            v-if="deliverFinish.tips"
                        >
                            <div>
                                <div class="flex lg">
                                    <div class="m-r-8" style="font-weight: 500">
                                        {{deliverTake.contacts}}
                                    </div>
                                    <div style="font-weight: 500">{{deliverTake.mobile}}</div>
                                </div>
                                <div class="lighter m-t-8">{{deliverTake.address}}</div>
                            </div>
                        </el-timeline-item>
                        <!-- 交易状态 -->
                        <el-timeline-item
                            v-if="deliverFinish.tips"
                            :timestamp="deliverFinish.time"
                        >
                            <div class="time-line-title">{{deliverFinish.title}}</div>
                            <div>{{deliverFinish.tips}}</div>
                        </el-timeline-item>
                        <!-- 跟踪物流 -->
                        <el-timeline-item
                            v-if="delivery.traces && delivery.traces.length"
                            :timestamp="delivery.time"
                        >
                            <div class="time-line-title m-b-8">{{delivery.title}}</div>
                            <el-timeline-item
                                v-for="(item, index) in delivery.traces"
                                :key="index"
                                :timestamp="item[0]"
                            >
                                <div class="muted">{{item[1]}}</div>
                            </el-timeline-item>
                        </el-timeline-item>
                        <!-- 完成 -->
                        <el-timeline-item
                            v-if="deliverShipment.tips"
                            :timestamp="deliverShipment.time"
                        >
                            <div class="time-line-title">{{deliverShipment.title}}</div>
                            <div>{{deliverShipment.tips}}</div>
                        </el-timeline-item>
                        <!-- 下单 -->
                        <el-timeline-item
                            v-if="deliverBuy.tips"
                            :timestamp="deliverBuy.time"
                        >
                            <div class="time-line-title">{{deliverBuy.title}}</div>
                            <div>{{deliverBuy.tips}}</div>
                        </el-timeline-item>
                    </el-timeline>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    props: {
        value: {
            type: Boolean,
            default: false,
        },
        aid: {
            type: Number | String
        }
    },
    data() {
        return {
            showDialog: false,
            deliverBuy: {},
            delivery: {},
            deliverFinish: {},
            deliverOrder: {},
            deliverShipment: {},
            deliverTake: {},
            timeLineArray: []
        }
    },
    watch: {
        value(val) {
            console.log(val, 'val')
            this.showDialog = val;
        },
        showDialog(val) {
            if(val) {
                if(this.aid) {
                    this.timeLineArray = []
                    this.getDeliverTraces();
                }
            }
            this.$emit("input", val);
        },
    },
    methods: {
        async getDeliverTraces() {
            let data = {
                id: this.aid
            }
            let res = await this.$get("order/orderTraces", {params: data});
            if(res.code == 1) {
                let {buy, delivery, finish, order, shipment, take} = res.data
                this.deliverBuy = buy;
                this.delivery = delivery;
                this.deliverFinish = finish;
                this.deliverOrder = order;
                this.deliverShipment = shipment;
                this.deliverTake = take;
                this.timeLineArray.push(this.deliverFinish);
                this.timeLineArray.push(this.delivery);
                this.timeLineArray.push(this.deliverShipment);
                this.timeLineArray.push(this.deliverBuy);
                console.log(this.timeLineArray)
            }
        },
        onCopy() {
            // this.deliverOrder.invoice_no;
            let oInput = document.createElement('input');
            oInput.value = this.deliverOrder.invoice_no;
            document.body.appendChild(oInput);
            oInput.select();
            document.execCommand("Copy");
            this.$message.success("复制成功");
            oInput.remove();
        }
    }
}
</script>

<style lang="scss" scoped>
    .deliver-search-container {
        .deliver-box {
            .deliver-recode-box {
                padding: 10px 20px;
                background-color: #F2F2F2;
                .recode-img {
                    position: relative;
                    width: 72px;
                    height: 72px;
                    .float-count {
                        position: absolute;
                        bottom: 0;
                        height: 20px;
                        width: 100%;
                        background-color: rgba(0, 0, 0, 0.5);
                        color: white;
                        font-size: 12px;
                    }
                }
                .recode-info-container {
                    flex: 1;
                    .recode-label {
                        width: 70px;
                    }
                    .copy-btn {
                        height: 20px;
                        min-width: 42px;
                        border: 1px solid $--color-primary;
                        font-size: 12px;
                        margin-left: 8px;
                        border-radius: 60px;
                        cursor: pointer;
                        &:hover {
                            background-color: white;
                        }
                    }
                }
            }
            .deliver-flow-box {
                padding-left: 15px;
            }
            .time-line-title {
                font-weight: 500px;
                font-size: 16px;
                margin-bottom: 10px;
            }
        }
    }
</style>
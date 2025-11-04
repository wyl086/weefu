<template>
    <view class="sort-nav flex bg-white">
        <view
            :class="'tag flex-2 flex row-center ' + (comprehensive ? 'primary' : '')"
            @tap="onNormal"
            >综合</view
        >
        <view class="tag flex-2 flex row-center" @tap="onCreate" v-if="showCreate">
            <text :class="value.sort_by_create ? 'primary' : ''">新品</text>
        </view>
        <view class="tag flex-2 flex row-center" @tap="onPriceSort">
            <text :class="value.priceSort ? 'primary' : ''">价格</text>
            <view class="arrow-icon flex-col col-center row-center">
                <u-icon
                    name="arrow-up-fill"
                    :color="value.priceSort == 'asc' ? colorConfig.primary : colorConfig.normal"
                ></u-icon>
                <u-icon
                    name="arrow-down-fill"
                    :color="value.priceSort == 'desc' ? colorConfig.primary : colorConfig.normal"
                ></u-icon>
            </view>
        </view>

        <view class="tag flex-2 flex row-center" @tap="onSaleSort">
            <text :class="value.saleSort ? 'primary' : ''">销量</text>
            <view class="arrow-icon flex-col col-center row-center">
                <u-icon
                    name="arrow-up-fill"
                    :color="value.saleSort == 'asc' ? colorConfig.primary : colorConfig.normal"
                ></u-icon>
                <u-icon
                    name="arrow-down-fill"
                    :color="value.saleSort == 'desc' ? colorConfig.primary : colorConfig.normal"
                ></u-icon>
            </view>
        </view>
        <view v-if="showType" class="tag flex-1 flex row-center" @tap="changeType">
            <image
                class="icon-sm"
                :src="
                    value.goodsType === 'one'
                        ? '/static/images/icon_double.png'
                        : '/static/images/icon_one.png'
                "
            >
            </image>
        </view>
    </view>
</template>

<script>
import { trottle } from '@/utils/tools'
export default {
    name: 'sort-nav',
    props: {
        value: {
            type: Object,
            default: () => ({
                priceSort: '',
                saleSort: '',
                goodsType: 'one',
                sort_by_create: ''
            })
        },
        showType: {
            type: Boolean,
            default: true
        },
        showCreate: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {}
    },
    created() {
        this.onNormal = trottle(this.onNormal, 500, this)
        this.onPriceSort = trottle(this.onPriceSort, 500, this)
        this.onSaleSort = trottle(this.onSaleSort, 500, this)
        this.onCreate = trottle(this.onCreate, 500, this)
    },
    computed: {
        comprehensive() {
            const { priceSort, saleSort, sort_by_create } = this.value
            if (priceSort == '' && saleSort == '' && sort_by_create == '') {
                return true
            }
            return false
        }
    },
    methods: {
        onNormal() {
            this.value.priceSort = ''
            this.value.saleSort = ''
            this.value.sort_by_create = ''
            const obj = {
                priceSort: '',
                saleSort: '',
                sort_by_create: ''
            }
            this.onInput(obj)
        },
        onInput(obj) {
            this.$emit('input', Object.assign(this.value, obj))
        },
        onPriceSort() {
            let { priceSort } = this.value
            const obj = {}
            obj.priceSort = priceSort == 'asc' ? 'desc' : 'asc'
            obj.saleSort = ''
            obj.sort_by_create = ''
            this.onInput(obj)
        },

        onSaleSort() {
            let { saleSort } = this.value
            const obj = {}
            obj.saleSort = saleSort == 'asc' ? 'desc' : 'asc'
            obj.priceSort = ''
            obj.sort_by_create = ''
            this.onInput(obj)
        },
        onCreate() {
            let { sort_by_create } = this.value
            const obj = {}
            obj.sort_by_create = 'desc'
            obj.saleSort = ''
            obj.priceSort = ''
            this.onInput(obj)
        },
        changeType() {
            const { goodsType } = this.value
            const obj = {}
            obj.goodsType = goodsType === 'one' ? 'double' : 'one'
            this.onInput(obj)
        }
    }
}
</script>

<style lang="scss" scoped>
.sort-nav {
    height: 80rpx;
    .tag {
        height: 100%;
    }
    .arrow-icon {
        transform: scale(0.36);
    }
}
</style>

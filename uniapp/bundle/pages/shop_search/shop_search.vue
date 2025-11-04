<template>
    <view>
        <u-navbar :border-bottom="false" :back-bg="'rgba(255, 255, 255, 0.45)'" :is-fixed="true">
            <view class="store-search flex-1">
                <u-search
                    v-model="keyword"
                    shape="round"
                    placeholder="搜索店内商品"
                    wrap-bg-color="transparent"
                    @search="refresh"
                >
                </u-search>
            </view>
        </u-navbar>
        <view class="goods-display flex bg-body">
            <view class="category-row flex-1">
                <u-sticky
                    bg-color="rgba(255, 255, 255, 0)"
                    :enable="enableFix"
                    :offset-top="navHeight"
                    :h5-nav-height="0"
                >
                    <sort-nav v-model="sortConfig" :show-type="false"></sort-nav>
                </u-sticky>
                <mescroll-body
                    ref="mescrollRef"
                    @init="mescrollInit"
                    :height="meScrollH"
                    @down="downCallback"
                    @up="upCallback"
                    :up="upOption"
                    :down="{ use: false }"
                >
                    <view class="bg-white">
                        <goods-list :list="goodsList"></goods-list>
                    </view>
                </mescroll-body>
            </view>
        </view>
    </view>
</template>
<script>
import { mapGetters } from 'vuex'
import { getGoodsList } from '@/api/store'
import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins.js'

export default {
    mixins: [MescrollMixin], // 使用mixin

    data() {
        return {
            id: '',
            is_recommend: '',
            keyword: '',
            sortConfig: {
                priceSort: '',
                saleSort: ''
            },
            goodsList: [],
            enableFix: true,

            upOption: {
                auto: false,
                empty: {
                    icon: '/static/images/goods_null.png',
                    tip: '暂无商品'
                }
            },
            active: ''
        }
    },
    async onLoad() {
        this.id = this.$Route.query.id
        this.is_recommend = this.$Route.query.is_recommend
        console.log(this.id)
        this.mescroll.resetUpScroll()
    },
    onHide() {
        // #ifdef H5
        this.enableFix = false
        // #endif
    },
    onShow() {
        // #ifdef H5
        this.enableFix = true
        // #endif
    },
    methods: {
        refresh() {
            this.goodsList = []
            this.mescroll.resetUpScroll()
        },
        upCallback(page) {
            //联网加载数据
            let {
                goodsList,
                keyword,
                sortConfig: { priceSort, saleSort }
            } = this
            const pageNum = page.num // 页码, 默认从1开始
            const pageSize = page.size // 页长, 默认每页10条

            getGoodsList({
                page_size: pageSize,
                page_no: pageNum,
                shop_id: this.id,
                is_recommend: this.is_recommend == 1 ? 1 : '',
                sort_by_price: priceSort,
                sort_by_sales: saleSort,
                keyword
            }).then(({ data }) => {
                let curPageData = data.lists
                let curPageLen = curPageData.length
                let hasNext = !!data.more
                if (page.num == 1) this.goodsList = []
                this.goodsList = this.goodsList.concat(curPageData)
                this.mescroll.endSuccess(curPageLen, hasNext)
            })
        }
    },
    computed: {
        ...mapGetters(['sysInfo']),
        navHeight() {
            return this.sysInfo.navHeight + 'px'
        }
    },
    watch: {
        sortConfig: {
            deep: true,
            handler(val) {
                console.log(val)
                this.refresh()
            }
        }
    }
}
</script>

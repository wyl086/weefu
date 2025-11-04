 <template>
    <nuxt-link
        class="shop-item flex-col row-right"
        :style="{
            'background-image': `url(${cover})`,
        }"
        :to="`/shop_street_detail?id=${shopId}`"
    >
        <div class="bg-white shop-info text-center">
            <el-image class="logo" :src="logo"></el-image>
            <div class="m-t-12 line-1 lg">
                <el-tag size="mini" v-if="type == 1">自营</el-tag> {{ name }}
            </div>
            <span class="xs muted sales"
                >共{{ sales }}件商品</span
            >
        </div>
    </nuxt-link>
</template>

<script>
export default {
    components: {},
    props: {
        cover: {
            type: String,
        },
        shopId: {
            type: [String, Number],
        },
        logo: {
            type: String,
        },
        type: {
            type: [String, Number],
        },
        name: {
            type: String,
        },
        sales: {
            type: [String, Number],
        }
    },
    methods: {},
}
</script>

<style lang="scss" scoped>
.shop-item {
    width: 270px;
    height: 400px;
    background-size: cover;
    background-position: center;
    padding: 10px;
    border-radius: 6px;

    .shop-info {
        border-radius: 6px;
        padding: 18px 15px;
        .logo {
            width: 70px;
            height: 70px;
            border-radius: 16px;
            margin-top: -45px;
        }
        .sales {
            display: inline-block;
            padding: 4px 10px;
            background-color: #f2f2f2;
            margin-top: 6px;
            border-radius: 4px;
        }
    }
}
</style>
 
 

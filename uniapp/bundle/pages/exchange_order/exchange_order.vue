<template>
	<view class="user-order">
		<tabs :current="active" @change="changeShow" bar-width="60" :is-scroll="true">
			<tab v-for="(item, index) in order" :key="index" :name="item.name">
				<exchange-order-list :order-type="item.type" :i="index" :index="active"></exchange-order-list>
			</tab>
		</tabs>
		<float-tab></float-tab>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				active: -1,
				order: [{
					name: '全部',
					type: ''
				}, {
					name: '待付款',
					type: 0
				}, {
					name: '待发货',
					type: 1
				}, {
					name: '待收货',
					type: 2
				}, {
					name: '已完成',
					type: 3
				}, {
					name: '已关闭',
					type: 4
				}]
			};
		},

		methods: {
			changeShow(index) {
				if (index != -1) {
					this.$nextTick(() => {
						this.active = index
					})
				}
			},
		},
		onLoad(options) {
			const {
				order
			} = this
			let type = this.$Route.query.type || '';
			let index = order.findIndex(item => item.type == type)
			this.changeShow(index);
		},

	};
</script>
<style>

</style>

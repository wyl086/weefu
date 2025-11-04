<template>
	<u-modal v-model="show" :show-cancel-button	="true" :content="getTipsText" @confirm="onConfirm" confirm-color="#ff2c3c"></u-modal>
</template>

<script>
	
	export default {
		props: {
			type: Number,
			orderId: [Number, String]
		},
		data() {
			return {
				show: false
			};
		},
		methods: {
			open() {
				this.show = true
			},
			close() {
				this.show = false
			},
			async onConfirm() {
				const {
					type,
					orderId
				} = this;
				let res = null;
				this.$emit("confirm")
			},
		},
		computed: {

			getTipsText() {
				const {
					type
				} = this
				switch (type) {
					case 0:
						return "确认取消订单吗？"
					case 1:
						return "确认删除订单吗?"
					case 2:
						return "确认收货吗?"
				}
			}
		}
	}
</script>

<style>

</style>

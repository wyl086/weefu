<template>
	<view class="p-24">
		<u-parse :html="content" :selectable="true" :show-with-animation="true"></u-parse>
	</view>
</template>

<script>
	import {
		apiPolicyAgreement,
	} from "@/api/app"
	export default {
		data() {
			return {
				content: ''
			}
		},

		methods: {
			// 获取服务协议
			getPolicyAgreement() {
				apiPolicyAgreement({
					type: this.type
				}).then(res => {
					this.content = res[this.type];
				})
			},

		},

		onLoad() {
			this.type = this.$Route.query.type;
			this.getPolicyAgreement()
			this.type == 1 ? uni.setNavigationBarTitle({
				title: '服务协议'
			}) : uni.setNavigationBarTitle({
				title: '隐私政策'
			})

		}
	}
</script>

<style>
</style>

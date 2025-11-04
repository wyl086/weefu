<template>
	<view class="m-t-20 m-l-20 m-r-20">
		<text class="nr sign-rule">{{rules}}</text>
	</view>
</template>

<script>
	import { getSignRule } from "@/api/activity";
	
	export default {
		data() {
			return {
				rules: '',
			};
		},
		
		methods: {
			getSignRuleFun() {
				getSignRule()
				.then(res => {
					if(res.code == 1) {
						this.rules = res.data.rule
					}
				})
			}
		},
		
		onLoad() {
			this.getSignRuleFun()
		}
	}
</script>

<style lang="scss">
	.sign-rule {
		line-height: 36rpx;
	}
</style>

<template>
	<view class="goods-comment-list">
		<tabs :current="active" :is-scroll="false" @change="changeActive">
			<tab name="待评价">
				<comment-list type="1" :i="0" :index="active"></comment-list>
			</tab>
			<tab name="已评价">
				<comment-list type="2" :i="1" :index="active"></comment-list>
			</tab>
		</tabs>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				active: -1
			};
		},
		onLoad() {
			this.type = this.$Route.query.type || 0;
			this.active = parseInt(this.type)
		},


		methods: {
			changeActive(e) {
				this.active = e
			}
		}
	};
</script>
<style>
</style>

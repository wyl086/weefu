<template>
	<view class="cate-one">
		<tabs @change="changeActive" v-if="cateList.length">
			<tab :name="item.name" v-for="(item, index) in cateList" :key="index">
				<cate-list v-if="showCate[index]" :top="174" ref="mescrollItem" :i="index" :index="selectIndex"  :cate="item">
				</cate-list>
			</tab>
		</tabs>
	</view>
</template>

<script>
	export default {
		name:"cate-one",
		props: {
			cateList: {
				type: Array,
				default: () => ([])
			},
		},
		data() {
			return {
				selectIndex: 0,
				showCate: []
			};
		},
		methods:{
			changeActive(index) {
				this.selectIndex = index
				this.showCate[index] = true
			},
		},
		watch: {
			cateList(val) {
				this.showCate = val.map((item, index) => index == this.selectIndex ? true : false)
				console.log(this.showCate)
			}
		}
		
	}
</script>

<style>

</style>

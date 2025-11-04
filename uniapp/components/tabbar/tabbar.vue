<template>
	<u-tabbar v-show="showTabbar" :activeColor="tabbarStyle.st_color" :inactiveColor="tabbarStyle.ust_color"
		:list="tabbarList"></u-tabbar>
</template>

<script>
	import { mapGetters } from 'vuex'
	export default {
		data() {

			return {
				currentRoute: ''
			}
		},
		mounted() {
			const currentPages = getCurrentPages()
			const currentPage = currentPages[currentPages.length - 1]
			this.currentRoute = currentPage.route
		},
		computed: {
			tabbarStyle() {
				return this.appConfig.navigation_setting || {}
			},
			tabbarList() {
				const tabbar = this.appConfig.navigation_menu || []
				console.log(this.cartNum )
				return tabbar.filter((item) => item.status == 1).map((item) => {
					return {
						iconPath: item.un_selected_icon,
						selectedIconPath: item.selected_icon,
						text: item.name,
						count: item.page_path == 'pages/shop_cart/shop_cart' ? this.cartNum : 0,
						pagePath: '/' + item.page_path
					}
				})
			},
			showTabbar() {
				
				const current = this.tabbarList.findIndex((item) => {
					return item.pagePath === '/' + this.currentRoute
				})
				return current >= 0
			},
			...mapGetters(['cartNum']),
		}
	}
</script>

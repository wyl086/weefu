<template>
	<view class="city">

		<!-- 当前定位城市 -->
		<view class="city-title xs">当前定位城市</view>
		<view class="city-current bg-white flex row-between">
			<view>
				<u-icon name="map-fill" size="34"></u-icon>
				<text class="m-l-8 nr" v-if="!isLoading">{{ cityInfo.name || '城市' }}</text>
				<text class="m-l-8 nr" v-else>定位中...</text>
			</view>
			<view class="reselect nr flex" @click="reLocationFunc">
				<u-loading mode="flower" color="#528FFF" size="28" v-if="isLoading"></u-loading>
				<text class="m-l-8">重新定位</text>
			</view>
		</view>

		<!-- 历史浏览城市 -->
		<view class="city-title xs" v-if="historyList.length">历史浏览城市</view>
		<view class="city-list bg-white">
			<block v-for="(hisItem, hisIndex) in historyList" :key="hisIndex">
				<view class="city-list-item line-1 nr" @click="chooseCity(hisItem)">{{ hisItem.name }}</view>
			</block>
		</view>

		<!-- 热门城市 -->
		<view class="city-title xs">热门城市</view>
		<view class="city-list bg-white">
			<block v-for="(hotItem, hotIndex) in hotList" :key="hotIndex">
				<view class="city-list-item line-1 nr" @click="chooseCity(hotItem)">{{ hotItem.name }}</view>
			</block>
		</view>

		<!-- 普通城市列表 -->
		<view v-for="(cityItem, cityIndex) in cityList" :key="cityIndex">
			<view class="city-title anchor xs">{{ cityIndex }}</view>
			<view class="city-list bg-white">
				<block v-for="(cityItem2, cityIndex2) in cityItem" :key="cityIndex2">
					<view class="city-list-item line-1 nr" @click="chooseCity(cityItem2)">
						{{ cityItem2.name }}
					</view>
				</block>
			</view>
		</view>
		
		<!-- 侧边导航条 -->
		<view class="city-bar__sidebar" @touchstart.stop.prevent="onTouchMove" @touchmove.stop.prevent="onTouchMove"
			@touchend.stop.prevent="onTouchStop" @touchcancel.stop.prevent="onTouchStop">
			<view v-for="(barItem, barIndex) in labelList" :key="barIndex" class="city-bar__index"
				:style="{color: touchmoveIndex === barIndex ? '#528FFF' : ''}">
				{{ barItem }}
			</view>
		</view>
		
		<!-- 侧边弹窗 -->
		<view class="city-list-alert" v-if="touchmove && labelList[touchmoveIndex+'']">
			<text>{{labelList[touchmoveIndex]}}</text>
		</view>

		<loading-view v-if="isFirstLoading"></loading-view>
	</view>
</template>

<script>
	import { mapActions, mapMutations, mapGetters } from 'vuex'
	import { getCityLists } from "@/api/store.js"
	import { currentPage, toast } from "@/utils/tools.js"
    import cache from "@/utils/cache"

	export default {
		data() {
			return {
				isLoading: false,
				cityList: [],
				labelList: [],
				historyList: [],
				hotList: [
					{ name: '北京市', gcj02_lat: "39.929986", gcj02_lng: "116.395645", id: 110100 },
					{ name: '上海市', gcj02_lat: "31.249162",  gcj02_lng: "121.487899", id: 310100 },
					{ name: '广州市', gcj02_lat: "23.120049", gcj02_lng: "113.30765", id: 440100 },
					{ name: '深圳市', gcj02_lat: "22.546054", gcj02_lng: "114.025974", id: 440300 },
					{ name: '重庆市', gcj02_lat: "29.544606", gcj02_lng: "106.530635", id: 110100 },
					{ name: '成都市', gcj02_lat: "30.679943", gcj02_lng: "104.067923", id: 510100 },
					{ name: '杭州市', gcj02_lat: "30.259244", gcj02_lng: "120.219375", id: 110100 },
					{ name: '苏州市', gcj02_lat: "31.317987", gcj02_lng: "120.619907", id: 320500 },
					{ name: '武汉市', gcj02_lat: "30.581084", gcj02_lng: "114.3162", id: 420100 },
					{ name: '沈阳市', gcj02_lat: "41.808645", gcj02_lng: "123.432791", id: 210100 }
				],
				isFirstLoading: true,
				
				touchmove: false,
				touchmoveIndex: 0,
			}
		},
		onLoad() {
			this.getCityListsFunc()
			this.historyList = cache.get('HISTORY') || []
		},
		onPageScroll({ scrollTop }) {
		    const anchor = this.anchor;
		    const index = anchor.findIndex(item => item >= scrollTop);
		    const isLessTop = index !== -1;
		    if (isLessTop && !this.touchmmove) this.touchmoveIndex = index;
		},
		methods: {
			...mapActions(['initLocationFunc']),
			...mapMutations(['setCityInfo']),
			
			async reLocationFunc() {
				this.isLoading = true;
				await this.initLocationFunc()
				this.isLoading = false;
			},
			
			chooseCity(city) {
				try{
					this.setCityInfo(city);
					// 返回上一页
					this.$Router.back(1, {
						success: () => {
							const { 
								onLoad,
								options
							} = currentPage()
							// 刷新上一个页面
							onLoad && onLoad({ ...options, refresh: true })
						}
					})
					console.log(city)
					const historyList = this.historyList;
					const result = historyList.filter(item => item.name == city.name);
					const isLessTop = result.length === 0;
					if ( isLessTop ) {
					    historyList.unshift(city)
					    cache.set('HISTORY', historyList)
					}
				}catch(e){
					console.log(e)
					toast({ title: '选择有误，请联系管理员' })
					//TODO handle the exception
				}
			},
			
			getCityListsFunc() {
				getCityLists()
					.then(res => {
						if (res.code == 1) {
							this.cityList = res.data;
							this.labelList = Object.keys(res.data ?? {});
							this.setRect()
						}
						this.isFirstLoading = false;
					})
			},
			
			onTouchMove(event) {
				const y = parseInt(event.changedTouches[0].clientY)
				const len = this.labelList.length;
				const itemHeight = parseInt(this.sidebar.height / len);
				let index = Math.floor((y - this.sidebar.top) / itemHeight);
				if (index < 0) {
				    index = 0;
				} else if (index > len - 1) {
				    index = len - 1;
				}
				if (this.touchmoveIndex != index) {
				    this.touchmove = true;
				    this.touchmoveIndex = index
				    uni.pageScrollTo({
				        duration: 0,
				        scrollTop: (this.anchor[index])
				    })
				}
			},
			
			onTouchStop() {
				this.touchmove = false;
				this.scrollToAnchorIndex = null;
			},
			
			async setRect() {
				await this.$nextTick()
				const sidebar = uni.createSelectorQuery().selectAll(".city-bar__sidebar");
				sidebar.boundingClientRect(res => {
				    this.sidebar = {
				        height: res[0].height,
				        top: res[0].top
				    }
				}).exec();
				
				const anchor = uni.createSelectorQuery().selectAll(".anchor");
				anchor.boundingClientRect(res => {
				    res.top = parseInt(res.top)
				    this.anchor = res.map(item => parseInt(item.top));
				}).exec();
			}
		},
		computed: {
			...mapGetters(['cityInfo'])
		}
	}
</script>

<style lang="scss" scoped>
	.city {
		padding: 12rpx 0;

		&-title {
			color: #AAAAAA;
			padding: 12rpx 34rpx;
		}

		.city-current {
			color: #575757;
			padding: 0 36rpx;

			.reselect {
				color: #528FFF;
				padding: 26rpx 10rpx;
			}
		}

		&-list {
			color: #575757;
			padding: 0 40rpx;
			display: flex;
			flex-wrap: wrap;

			&-item {
				width: 25%;
				height: 96rpx;
				line-height: 96rpx;
				padding-left: 34rpx;
			}
		}

		&-bar__sidebar {
			position: fixed;
			top: 50%;
			right: 0;
			display: flex;
			flex-direction: column;
			text-align: center;
			transform: translateY(-50%);
			user-select: none;
			z-index: 99;
		}

		&-bar__index {
			font-weight: 500;
			padding: 8rpx 18rpx;
			font-size: 22rpx;
			line-height: 1
		}

		&-list-alert {
			position: fixed;
			width: 120rpx;
			height: 120rpx;
			right: 90rpx;
			top: 50%;
			margin-top: -60rpx;
			border-radius: 24rpx;
			font-size: 50rpx;
			color: #fff;
			background-color: rgba(0, 0, 0, 0.65);
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 0;
			z-index: 9999999;

			text {
				line-height: 50rpx;
			}
		}
	}
</style>

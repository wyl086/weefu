<template>
	<view class="goods-reviews">
		<view class="bg-white flex p-20">
				<u-image  width="160rpx" height="160rpx" border-radius="6rpx" :src="goodsInfo.goods_item.image"></u-image>
				<view class="goods-desc flex-1 m-l-24">
					<view class="goods-name line-2">{{goodsInfo.goods_name}}</view>
					<view class="m-t-10 xs muted" >{{goodsInfo.goods_item.spec_value_str}}</view>
					<view class="flex row-between m-t-20">
						<price-format :price="goodsInfo.goods_price" :subscript-size="26"
							:first-size="30" :second-size="30" />
						<view class="nr">x{{goodsInfo.goods_num}}</view>
					</view>
				</view>
		</view>
		<view class="goods-evaluate bg-white flex">
			<view class="lable">商品评价</view>
			<u-rate name="goodsRate" :count="5" :size="42" active-color="#FF2C3C" v-model="goodsRate"
				@change="goodsRateChange" />
			<view :class="'desc ' + ((goodsRate<=2)? 'muted': 'primary') + ' '" v-show="!(goodsRate == 0)">
				{{goodsRateDesc}}
			</view>
		</view>
		<view class="bg-white p-20 lighter">{{goodsInfo.shop.name}}</view>
		<view class="rate bg-white">
			<view class="item flex m-b-20">
				<view class="lable">描述相符</view>
				<u-rate name="descRate" :size="42" active-color="#FF2C3C" v-model="descRate" />
			</view>
			<view class="item flex m-b-20">
				<view class="lable">服务态度</view>
				<u-rate name="serverRate" :size="42" active-color="#FF2C3C" v-model="serverRate" />
			</view>
			<view class="item flex m-b-20">
				<view class="lable">配送服务</view>
				<u-rate name="deliveryRate" :size="42" active-color="#FF2C3C" v-model="deliveryRate" />
			</view>
		</view>
		<view class="goods-dec bg-white m-t-20">
			<view class="title m-b-20 md bold">商品描述</view>
			<view class="p-20" style="background-color: #F8F8F8;">
				<u-input v-model="comment" type="textarea" placeholder="宝贝收到还满意吗，说说你的使用心得。分享给想买的他们吧！！" :border="false"
					:height="160" />
			</view>
			<view class="m-t-20">
				<u-upload ref="uUpload" :show-progress="false" :header="{token: $store.getters.token}"
					:max-count="8" width="150" height="150" :action="action" upload-text="上传图片"
					@on-success="onSuccess"  @on-remove="onRemove" />
			</view>
			<view class="muted m-t-20 m-b-10">支持jpg、png、jpeg格式的图片，最多可上传8张</view>
		</view>
		<button class="btn br60" type="primary" size="lg" @tap="onSubmit">立即评价</button>
	</view>
</template>

<script>
	import {
		baseURL
	} from '@/config/app.js';
	import {
		goodsComment,
		getCommentInfo
	} from '@/api/user';
	import {
		uploadFile
	} from '@/utils/tools.js';
	export default {
		data() {
			return {
				action: baseURL + '/api/file/formimage',
				goodsRate: 0,
				descRate: 0,
				serverRate: 0,
				deliveryRate: 0,
				goodsRateDesc: "",
				fileList: [],
				goodsInfo: {
					shop: {},
					goods_item: {}
				},
				comment: '',
				type: ""
			};
		},

		onLoad() {
			this.id = this.$Route.query.id
			this.getCommentInfoFun();
		},


		methods: {
			onSuccess(e) {
				this.fileList.push(e.data.base_uri)
			},
			onRemove(index) {
				this.fileList.splice(index, 1)
			},

			goodsRateChange(e) {
				let goodsRateDesc = "";

				if (e <= 2) {
					goodsRateDesc = "差评";
				} else if (e == 3) {
					goodsRateDesc = "中评";
				} else {
					goodsRateDesc = "好评";
				}
				this.goodsRateDesc = goodsRateDesc;
			},

			onSubmit() {
				let {
					goodsRate,
					fileList,
					comment,
					deliveryRate,
					descRate,
					serverRate
				} = this;
				if (!goodsRate) return this.$toast({
					title: '请对商品进行评分'
				});
				if (!descRate) return this.$toast({
					title: '请对描述相符进行评分'
				});
				if (!serverRate) return this.$toast({
					title: '请对服务态度进行评分'
				});
				if (!deliveryRate) return this.$toast({
					title: '请对配送服务进行评分'
				});
				goodsComment({
					order_goods_id: parseInt(this.id),
					goods_comment: goodsRate,
					service_comment: serverRate,
					express_comment: deliveryRate,
					description_comment: descRate,
					comment,
					image: fileList
				}).then(res => {
					if (res.code == 1) {
						this.$toast({
							title: '评价成功'
						}, {
							tab: 3,
							url: 1
						});
						uni.$emit('refreshcomment')
					}
				});
			},
			getCommentInfoFun() {
				getCommentInfo({
					order_goods_id: this.id
				}).then(res => {
					if (res.code == 1) {
						this.goodsInfo = res.data
					}
				});
			},

		}
	};
</script>
<style>
	.goods-reviews {
		padding: 20rpx 0 40rpx;
	}

	.goods-reviews .rate {
		padding: 20rpx 20rpx;
	}

	.goods-reviews  .lable {
		width: 170rpx;
	}

	.goods-reviews .goods-dec {
		padding: 30rpx 20rpx;
	}

	.goods-reviews .btn {
		width: 698rpx;
		margin: 30rpx 26rpx 0;
	}

	.goods-reviews .goods-evaluate {
		padding: 20rpx;
		border: 1rpx solid #F2F2F2;
	}

</style>

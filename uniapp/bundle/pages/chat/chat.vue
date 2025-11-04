<template>
	<view class="chat flex-col">
		<view class="content" @tap="showEmoji = false">
			<scroll-view style="height: 100%;" :scroll-y="true" :scroll-top="scrollTop" :scroll-into-view="intoView"
				@scrolltoupper="scrollToupper">
				<view class="loading flex row-center" v-if="pageStatus == 'loading'">
					<u-loading mode="flower" size="40"></u-loading>
				</view>
				<view class="chat-lists">
					<view class="chat-item" v-for="(item,index) in recoreds" :id="`chat-item_${item.id}`" :key="item.id"
						:class="{
							'right': item.from_type == 'user',
							'left': item.from_type == 'kefu',
							'visibility': showIndex > index
						} ">

						<!-- 普通聊天记录 -->
						<template v-if="item.type == 1">
							<!-- 时间 -->
							<view class="text-center m-b-30 white" v-if="timeFormat(item,index)">
								<view class="chat-tips xs">{{timeFormat(item,index)}}</view>
							</view>
							<view class="chat-info">
								<image class="avatar" :src="$getImageUri(item.from_avatar)">
								</image>
								<!-- 文本 -->
								<view class="text-box" v-if="item.msg_type == 1">
									<rich-text :nodes="replaceEmoji(item.msg)" space="nbsp"></rich-text>
								</view>
								<!-- 图片 -->
								<view class="image-box" v-if="item.msg_type == 2">
									<image class="image" mode="widthFix" :src="$getImageUri(item.msg)"
										@tap="previewImage($getImageUri(item.msg))">
									</image>
								</view>
								<!-- 商品 -->
								<view class="goods m-r-20 goods-box" v-if="item.msg_type == 3">
									<view class="goods-img m-r-20">
										<image style="width: 140rpx;height: 140rpx;"
											:src="$getImageUri(item.goods.image)">
										</image>
									</view>
									<view class="goods-info flex-1">
										<view class="line-2">
											{{item.goods.name}}
										</view>
										<view class="flex m-t-10 row-between">
											<price-format :color="colorConfig.primary" :subscript-size="26"
												:first-size="38" :second-size="26" :price="item.goods.min_price">
											</price-format>
										</view>
									</view>
								</view>
							</view>
						</template>
						<!-- 通知类型记录 -->
						<template v-else>
							<view class="text-center white">
								<view class="muted xs">{{item.msg}}</view>
							</view>
						</template>
					</view>
				</view>
				<view class="error" v-if="isError">
					<view class="error-msg text-center xs">{{errorMsg}}</view>
				</view>
				<view id="bottom"></view>
			</scroll-view>
		</view>

		<view class="footer" @tap="showGoods = false">
			<view class="footer-input flex">
				<view class="album" @tap="uploadFile">
					<image class="icon" src="@/static/images/icon_album.png"></image>
				</view>
				<view class="input-contain flex">
					<input v-model="msg" class="text-area" confirm-type="send" maxlength="-1"
						@focus="scrollToBottom" @confirm="sendText" />
					<image class="icon" src="@/static/images/icon_emoji.png" @tap="handleEmojiShow"></image>
				</view>
				<button size="sm" class="send-btn" @tap="sendText">发送</button>
			</view>
			<view class="emoji-wrap" :class="{'emoji-show': showEmoji}">
				<scroll-view style="height:100%;" scroll-y="true">
					<emoji @input="handleEmojiInput"></emoji>
				</scroll-view>
			</view>
		</view>

		<view class="goods" v-if="showGoods">
			<view class="close" @tap="showGoods = false">
				<u-icon name="close-circle-fill" color="#ccc" size="40"></u-icon>
			</view>
			<view class="goods-img m-r-20">
				<u-image width="140rpx" height="140rpx" :src="goodsInfo.image"></u-image>
			</view>
			<view class="goods-info flex-1">
				<view class="line-2">
					{{goodsInfo.name}}
				</view>
				<view class="flex m-t-10 row-between">
					<price-format :color="colorConfig.primary" :subscript-size="26" :first-size="38" :second-size="26"
						:price="goodsInfo.min_price">
					</price-format>
					<view class="send-btn" @tap="sendGoods">发送链接</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import Socket from '@/utils/socket'
	import {
		chatRecord
	} from '@/api/user'
	import {
		getChatConfig
	} from '@/api/app'
	import {
		getGoodsDetail
	} from '@/api/store'
	import {
		client,
		uploadFile,
		getRect,
		debounce
	} from '@/utils/tools'
	import {
		timeFormatChat
	} from '@/utils/date'
	import {
		mapMutations
	} from 'vuex';
	export default {
		data() {
			return {
				pageStatus: 'loading',
				scrollTop: '',
				intoView: '',
				page: 1,
				msg: '',
				socket: {},
				kefu: {},
				showEmoji: false,
				recoreds: [],
				errorMsg: '',
				goodsInfo: {},
				isError: false,
				showGoods: false,
				showIndex: -1
			}
		},
		computed: {
			// 设置记录
			timeFormat() {
				return (item, index) => {
					let timeFmt = timeFormatChat(item.create_time_stamp)
					if (index && item.create_time_stamp - this.recoreds[index - 1].create_time_stamp < 300 && !item
						.show_time) {
						timeFmt = ''
					}

					return timeFmt
				}
			},
			// 表情转换
			replaceEmoji() {
				return (str) => str.replace(/\[em-([a-z_]+)\]/g, `<span class="em em-$1"></span>`)
			},
			// 获取图片域名
			$getImageUri() {
				return (url) => this.$store.state.app.config.base_domain + url
			}
		},
		watch: {
			kefu(val) {
				if (val.id) {
					this.setTitle(val.nickname)
				}
			}
		},
		methods: {
			// 初始化
			init() {
				this.shopId = this.$Route.query.shop_id || 0
				this.goodsId = this.$Route.query.goods_id
				this.socket = new Socket(this.appConfig.ws_domain, {
					token: this.$store.getters.token,
					type: 'user',
					client,
					shop_id: this.shopId,
				})
				this.socket.addEvent('connect', () => {
					this.setTitle('连接中...')
				})
				this.socket.addEvent('open', () => {
					this.setTitle(this.kefu.nickname)
					this.isError = false
				})
				this.socket.addEvent('message', (data) => {

					switch (data.event) {
						case 'login':
							this.loginEvent(data.data)
							break;
						case 'chat':
							this.chatEvent(data.data)
							break;
						case 'transfer':
							this.transferEvent(data.data)
							break;
						case 'error':
							this.errorEvent(data.data)
							break;

					}
				})
				this.socket.addEvent('error', (data) => {
					this.setTitle('连接失败')
				})
			},

			showTips(msg) {
				if (!msg) {
					setTimeout(() => {
						this.$Router.replace({
							path: `/bundle/pages/contact_offical/contact_offical?id=${this.shopId}`
						});
					}, 200)
					return
				}
				uni.showModal({
					title: '温馨提示',
					content: msg,
					success: (res) => {
						if (res.confirm) {
							this.$Router.replace({
								path: `/bundle/pages/contact_offical/contact_offical?id=${this.shopId}`
							});
						} else if (res.cancel) {
							this.$Router.back()
						}
					}
				});
			},
			getConfig() {
				return getChatConfig({
					shop_id: this.shopId
				}).then(res => {
					return Promise.resolve(res)
				}).catch(() => {
					return Promise.reject()
				})
			},
			// 获取数据
			async getData() {
				try {
					const res = await this.getConfig()
					if (res.code == 0) return this.showTips(res.msg)
					await this.getChatRecord()
					this.getGoods()
					this.scrollToBottom()
					if (!this.kefu.id) {
						this.setTitle('客服不在线')
						return
					}
					this.socket.connect()
				} catch (e) {

				}


			},
			getGoods() {
				if (!this.goodsId) return
				getGoodsDetail({
					goods_id: this.goodsId
				}).then(res => {
					if (res.code == 1) {
						this.goodsInfo = res.data
						if (this.kefu.id) {
							this.showGoods = true
						}
					}
				})
			},
			// 图片预览
			previewImage(url) {
				uni.previewImage({
					urls: [url]
				});
			},

			// 上传图片
			async uploadFile() {
				const [error, success] = await uni.chooseImage({
					count: 1
				})
				if (error) {
					return
				}
				uni.showLoading({
					title: '上传中...'
				})
				try {
					const file = await uploadFile(success.tempFilePaths[0])
					this.send(file.base_uri, 2)
					uni.hideLoading()
				} catch (e) {
					this.$toast({
						title: '上传失败，请稍后再试'
					})
					uni.hideLoading()
				}

			},
			// 发送文本
			sendText() {
				if (!this.msg) return
				this.send(this.msg, 1)
				this.msg = ''
			},
			// 发送商品
			sendGoods() {
				this.showGoods = false
				this.send(this.goodsId, 3)
			},

			// 获取聊天记录
			async getChatRecord() {
				const {
					page,
					pageStatus
				} = this
				if (pageStatus == 'finish') return
				const res = await chatRecord({
					shop_id: this.shopId,
					page_no: page
				})
				if (res.code == 1) {
					let toid = 0
					this.page++
					const {
						kefu,
						record
					} = res.data
					this.kefu = kefu
					this.showIndex = record.list.length
					if (this.recoreds.length) {
						toid = this.recoreds[0].id
						this.recoreds[0].show_time = true
					}

					this.recoreds.unshift(...record.list)
					this.$nextTick(() => {
						if (!record.more) {
							this.pageStatus = 'finish'
						}
						this.scrollToItem(toid)
						this.showIndex = -1
					})
				}
			},
			// 发送消息
			send(msg, type) {
				this.socket.send({
					event: 'chat',
					data: {
						msg,
						msg_type: type, // 暂定 1=>文本；2=>图片；3=>表情
						to_id: this.kefu.id, // 接收人id；客服发给用户则为user_id, 用户发给客服则为kefu_id
						to_type: "kefu"
					}
				})
			},
			// 显示、隐藏表情库
			handleEmojiShow() {
				this.showEmoji = !this.showEmoji
				if (!this.showEmoji) return
				setTimeout(() => {
					this.scrollToBottom()
				}, 300)
			},
			scrollToupper() {
				this.getChatRecord()
			},
			scrollToBottom() {
				this.intoView = 'bottom'
				this.$nextTick(() => {
					this.intoView = ''
				})
			},
			scrollToItem(id) {
				this.intoView = `chat-item_${id}`
				this.$nextTick(() => {
					this.intoView = ''
				})
			},

			handleEmojiInput(val) {
				this.msg = this.msg + val
			},
			chatEvent(data) {
				this.isError = false
				if (data.from_type == 'kefu') {
					uni.vibrateLong({
						success: function() {
							console.log('success');
						}
					});
				}
				if (data.shop_id != this.shopId) {
					return
				}
				this.recoreds.push(data)
				this.$nextTick(() => {
					getRect('#bottom').then(res => {
						if (res.bottom < 1000) {
							this.scrollToItem(data.id)
						}
					})
				})

			},
			errorEvent(data) {
				this.errorMsg = data.msg
				this.isError = true
				this.$nextTick(() => {
					this.scrollToBottom()
				})
			},
			loginEvent(data) {
				// 登录成功，发送用户上线通知
				this.socket.send({
					event: 'user_online',
					data: {
						kefu_id: this.kefu.id
					}
				})
			},
			transferEvent(data) {
				this.kefu = data
			},
			setTitle(title) {
				uni.setNavigationBarTitle({
					title
				})
			}

		},
		async onLoad() {
			this.scrollToupper = debounce(this.scrollToupper, 500, this)
			this.init()
			this.getData()
		},
		onUnload() {
			this.socket.close()
		},
		onReady() {

		}
	}
</script>

<style lang="scss">
	page {
		pading: 0;
		height: 100%;
	}

	.chat {
		height: 100%;

		.goods {
			display: flex;
			position: fixed;
			width: 600rpx;
			right: 20rpx;
			bottom: calc(120rpx + env(safe-area-inset-bottom));
			border-radius: 14rpx;
			background: #fff;
			padding: 20rpx;

			.close {
				position: absolute;
				left: -20rpx;
				top: -20rpx;
			}

			.send-btn {
				padding: 8rpx 22rpx;
			}
		}

		.content {
			transition: all .3s;
			flex: 1;
			min-height: 0;

			.loading {
				padding: 20rpx;
				height: 40px;
			}

			.chat-lists {
				padding: 0 20rpx 30rpx;
				overflow: hidden;
				position: relative;

				.chat-tips {
					padding: 4rpx 20rpx;
					border-radius: 21rpx;
					display: inline-block;
					text-align: center;
					background-color: rgba(0, 0, 0, 0.2);
				}

				.chat-item {
					padding-top: 30rpx;

					&.visibility {
						visibility: hidden;
					}

					.chat-info {
						display: flex;
						align-items: flex-start;
					}

					&.right {
						.chat-info {
							flex-direction: row-reverse;

							.text-box {
								background-color: #ED5349;
								color: #fff;
							}
						}

					}

					.avatar {
						width: 78rpx;
						height: 78rpx;
						border-radius: 14rpx;
						flex: none;
					}

					.text-box {
						max-width: 500rpx;
						min-width: 80rpx;
						background-color: #fff;
						border-radius: 14rpx;
						padding: 16rpx 20rpx;
						margin: 0 20rpx;
						word-break: break-word;
						line-height: 40rpx;
					}

					.image-box {
						max-width: 300rpx;
						margin: 0 20rpx;

						.image {
							max-width: 100%;
						}
					}

					.goods-box {
						position: static;
						width: 510rpx;
					}
				}
			}
		}

		.error {
			padding: 0 30rpx 30rpx;

			.error-msg {
				color: #bbb;
				word-break: break-word;
			}
		}

		.footer {
			background: #f2f2f2;
			padding-bottom: env(safe-area-inset-bottom);

			.footer-input {
				height: 100rpx;
				padding: 0 20rpx;

				.icon {
					width: 52rpx;
					height: 52rpx;
				}

				.input-contain {
					margin: 0 20rpx;
					background-color: #fff;
					height: 68rpx;
					border-radius: 60rpx;
					flex: 1;
					overflow: hidden;
					padding: 0 10rpx 0 30rpx;

					.text-area {
						flex: 1;
						height: 100rpx;
						word-break: break-all;
					}
				}

			}


		}

		.emoji-wrap {
			height: 0;
			transition: all .3s;

			&.emoji-show {
				height: 200px;
			}
		}

		.send-btn {
			padding: 0 25rpx;
			color: #fff;
			background-color: #ED5349;
			border-radius: 60rpx;
		}
	}
</style>

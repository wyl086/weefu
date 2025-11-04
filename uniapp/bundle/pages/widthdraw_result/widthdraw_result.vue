

<template>
	<view class="widthdraw-result">
		<view class="contain bg-white">
			<view class="header flex-col col-center">
				<view>
					<image class="tips-icon" :src="getTipsIcon(widthdrawInfo.status)"></image>
				</view>
				<view class="xl m-t-20 bold">{{widthdrawInfo.statusDesc}}</view>
				<view class="flex-col col-center">
				  <price-format :price="widthdrawInfo.money" :color="colorConfig.primary"  subscript-size="30" first-size="46" second-size="46" weight="bold" />
				</view>
			</view>
			<view class="info">
				<view class="flex row-between m-t-20">
					<view>流水号</view>
					<view>
						{{widthdrawInfo.sn}}
					</view>
				</view>
				<view class="flex row-between m-t-20">
					<view>提交时间</view>
					<view>{{widthdrawInfo.create_time}}</view>
				</view>
				<view class="flex row-between m-t-20">
					<view>提现至</view>
					<view>{{widthdrawInfo.typeDesc}}</view>
				</view>
				<view class="flex row-between m-t-20">
					<view>服务费</view>
					<view>
						<price-format :price="widthdrawInfo.poundage"></price-format>
					</view>
				</view>
				<view class="flex row-between m-t-20">
					<view>实际到账</view>
					<view>
						<price-format :price="widthdrawInfo.left_money"></price-format>
					</view>
				</view>
				
			</view>
			<view class="line m-t-40"></view>
			<view class="m-t-40 flex-col row-center">
				<router-link to="/bundle/pages/user_withdraw_code/user_withdraw_code">
					<button type="primary" size="lg" class="br60">查看历史提现记录</button>
				</router-link>
				<router-link  navType="pushTab" to="/pages/index/index">
					<button size="lg" class="br60 plain primary m-t-30">返回首页</button>
				</router-link>
			</view>
		</view>
		<view class="muted m-t-20 xs text-center">* 审核通过后约72小时内到账，请留意账户明细</view>
		</view>
	</view>
</template>

<script>
import { getWithdrawDetail } from '@/api/user';

export default {
  data() {
    return {
      widthdrawInfo: {}
    };
  },

  onLoad () {
    this.id = this.$Route.query.id
    this.getWithdrawDetailFun();
  },

 
  methods: {
    getWithdrawDetailFun() {
      getWithdrawDetail({
        id: this.id
      }).then(res => {
        if (res.code == 1) {
          this.widthdrawInfo = res.data
        }
      });
    },
	getTipsIcon(status) {
		// status 状态：1-待提现2-提现中3-提现成功4-提现失败
		switch(status) {
			case 1:
			case 2: return '/static/images/icon_wait.png'
			case 3: return '/static/images/icon_success.png'
			case 4: return '/static/images/icon_fail.png'
		}
	}

  }
};
</script>
<style lang="scss">
	.widthdraw-result {
		.contain {
			border-radius: 10rpx;
			padding: 0 30rpx 40rpx;
			position: relative;
			margin: 78rpx 20rpx 0;
			.tips-icon {
				width: 112rpx;
				height: 112rpx;
			}

			.header {
				position: absolute;
				left: 50%;
				transform: translateX(-50%);
				top: -50rpx;
			}
			.info {
				padding-top: 180rpx;
			}
			.line {
				border-top: $-solid-border;
			}
			.plain {
				border: 1px solid $-color-primary;
			}
		}
	}
</style>

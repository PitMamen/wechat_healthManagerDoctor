<template>
	<view class="wrap">
		<view class="top">
			<view class="title">钱包余额</view>
			<view class="cash">￥{{ info.settlementSum || 0 }}</view>
			<view class="block">
				<view class="left">
					<view class="line line1">可提现金额</view>
					<view class="line line2">￥{{ info.canRecoverSum || 0 }}</view>
				</view>
				<view class="right">
					<view class="line line1">待结算金额</view>
					<view class="line line2">￥{{ info.noSettlementSum || 0 }}</view>
				</view>
			</view>
			<view class="action">
				<view class="btn" @click="goCashOut">提现</view>
			</view>
		</view>
		<view class="bottom">
			<view class="row" @click="goCashOutList">
				<view class="contain">
					<view class="left">
						<image src="/static/static/images/cash/pack-1.png"></image>
						<view class="name">提现记录</view>
					</view>
					<u-icon name="arrow-right" color="#1A1A1A" size="36rpx"></u-icon>
				</view>
			</view>
			<view class="row" @click="goCashCard">
				<view class="contain">
					<view class="left">
						<image src="/static/static/images/cash/pack-2.png"></image>
						<view class="name">银行卡管理</view>
					</view>
					<u-icon name="arrow-right" color="#1A1A1A" size="36rpx"></u-icon>
				</view>
			</view>
			<view class="row" @click="goCashTradeList">
				<view class="contain">
					<view class="left">
						<image src="/static/static/images/cash/pack-3.png"></image>
						<view class="name">交易记录</view>
					</view>
					<u-icon name="arrow-right" color="#1A1A1A" size="36rpx"></u-icon>
				</view>
			</view>
			<view class="row" @click="goCashPwd">
				<view class="contain">
					<view class="left">
						<image src="/static/static/images/cash/pack-4.png"></image>
						<view class="name">支付密码管理</view>
					</view>
					<u-icon name="arrow-right" color="#1A1A1A" size="36rpx"></u-icon>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				info: {}
			}
		},
		onLoad() {
		},
		onReady() {
		},
		onShow() {
			this.getInfo();
		},
		methods: {
			getInfo() {
				uni.showLoading({
					title:'正在加载'
				});
				uni.$u.http.get(`/medical-api/userRightsSettlement/getSettlementSumByLoginUser`, {
					params: {
					}
				}).then(res => {
					uni.hideLoading();
					this.info = res.data || {};
				});
			},
			goCashOut() {
				uni.navigateTo({
					url: '/pages2/pages/cash/out'
				});
			},
			goCashOutList() {
				uni.navigateTo({
					url: '/pages2/pages/cash/out-list'
				});
			},
			goCashCard() {
				uni.navigateTo({
					url: '/pages2/pages/cash/card'
				});
			},
			goCashTradeList() {
				uni.navigateTo({
					url: '/pages2/pages/cash/trade-list'
				});
			},
			goCashPwd() {}
		}
	}
</script>

<style lang="scss">
	.wrap {
		min-height: 100vh;
		background: #F5F5F5;
		.top {
			margin: 0 24rpx;
			padding: 40rpx 0;
			background: #FFFFFF;
			border-radius: 4rpx;
			.title {
				margin-bottom: 18rpx;
				font-size: 24rpx;
				font-weight: 400;
				color: #999999;
				line-height: 44rpx;
				text-align: center;
			}
			.cash {
				margin-bottom: 32rpx;
				font-size: 48rpx;
				font-weight: 400;
				color: #1A1A1A;
				line-height: 72rpx;
				text-align: center;
			}
			.block {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-bottom: 52rpx;
				.left {
					width: 50%;
				}
				.right {
					width: 50%;
					border-left: 1rpx solid #CCCCCC;
				}
				.line {
					text-align: center;
					&.line1 {
						font-size: 24rpx;
						font-weight: 400;
						color: #999999;
						line-height: 36rpx;
					}
					&.line2 {
						font-size: 30rpx;
						font-weight: 400;
						color: #1A1A1A;
						line-height: 50rpx;
					}
				}
			}
			.action {
				padding: 0 110rpx;
				.btn {
					font-size: 28rpx;
					font-weight: 400;
					color: #FFFFFF;
					line-height: 68rpx;
					text-align: center;
					background: #3894FF;
					border-radius: 34rpx;
				}
			}
		}
		.bottom {
			margin: 30rpx 24rpx 0 24rpx;
			background: #FFFFFF;
			border-radius: 4rpx;
			.row {
				padding: 0 32rpx 0 28rpx;
				&:last-child {
					.contain {
						border-bottom: none;
					}
				}
				.contain {
					display: flex;
					align-items: center;
					justify-content: space-between;
					border-bottom: 1rpx solid #CCCCCC;
				}
				.left {
					display: flex;
					align-items: center;
					justify-content: flex-start;
					image {
						width: 30rpx;
						height: 30rpx;
						margin-right: 15rpx;
					}
					.name {
						font-size: 30rpx;
						font-weight: 400;
						color: #4D4D4D;
						line-height: 108rpx;
					}
				}
				>.u-icon {
					position: relative;
					top: 2rpx;
					margin-left: 2rpx;
				}
			}
		}
	}
</style>

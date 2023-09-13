<template>
	<view class="wrap">
		<view class="content">
			<view class="top">
				<image src="/pages3/static/static/images/out-detail/1.png"></image>
				<view class="desc">提现说明</view>
				<view class="card">
					<view class="title">本次提款合计金额为</view>
					<view class="money">{{ info.settlementSum || 0 }}<text class="unit">元</text></view>
					<view class="msg">本次提款分1笔到账，请注意查收</view>
				</view>
			</view>
			<view class="bottom">
				<view class="item" @click="itemClick()">
					<view class="left">
						<image src="/pages3/static/static/images/out-detail/2.png"></image>
						<view class="block">
							<view class="name">提现</view>
							<view class="time">{{ info.createTime }}</view>
						</view>
					</view>
					<view class="right">
						<view class="block">
							<view class="money">{{ info.settlementSum || 0 }}</view>
							<view class="status">{{ info.settlementStatusStr }}</view>
						</view>
						<u-icon name="arrow-right" color="#1A1A1A" size="36rpx"></u-icon>
					</view>
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
			this.info = uni.getStorageSync('cashItem');
		},
		onReady() {
		},
		onShow() {
		},
		methods: {
			itemClick() {
				uni.navigateTo({
					url: `/pages3/pages/cash/out-info?id=${this.info.id}&types=提`
				});
			}
		}
	}
</script>

<style lang="scss">
	.wrap {
		min-height: 100vh;
		background: #F5F5F5;
		.content {
			padding: 30rpx 24rpx;
			.top {
				padding: 20rpx;
				text-align: center;
				background: #FFFFFF;
				border-radius: 4rpx;
				image {
					display: inline-block;
					width: 80rpx;
					height: 80rpx;
					margin-top: 40rpx;
				}
				.desc {
					font-size: 30rpx;
					font-weight: 400;
					color: #1A1A1A;
					line-height: 70rpx;
				}
				.card {
					margin-top: 10rpx;
					padding: 10rpx 0 30rpx 0;
					text-align: center;
					background: #E2EDF7;
					border-radius: 4rpx;
					.title {
						font-size: 28rpx;
						font-weight: 500;
						color: #1A1A1A;
						line-height: 68rpx;
					}
					.money {
						font-size: 36rpx;
						font-weight: 500;
						color: #3894FF;
						line-height: 76rpx;
						.unit {
							font-size: 28rpx;
						}
					}
					.msg {
						font-size: 24rpx;
						font-weight: 400;
						color: #999999;
						line-height: 44rpx;
					}
				}
			}
			.bottom {
				margin-top: 30rpx;
				background: #FFFFFF;
				border-radius: 4rpx;
				.item {
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding: 20rpx;
					.left {
						display: flex;
						align-items: center;
						justify-content: flex-start;
						image {
							width: 50rpx;
							height: 50rpx;
							margin-right: 20rpx;
						}
						.block {
							.name {
								font-size: 30rpx;
								font-weight: 400;
								color: #4D4D4D;
								line-height: 45rpx;
							}
							.time {
								font-size: 24rpx;
								font-weight: 400;
								color: #999999;
								line-height: 40rpx;
							}
						}
					}
					.right {
						display: flex;
						align-items: center;
						justify-content: flex-end;
						.block {
							text-align: right;
							.money {
								font-size: 24rpx;
								font-weight: 400;
								color: #4D4D4D;
								line-height: 40rpx;
							}
							.status {
								font-size: 24rpx;
								font-weight: 400;
								color: #CD9F11;
								line-height: 40rpx;
								&.success {
									color: #0CAD41;
								}
								&.fail {
									color: #FF3838;
								}
							}
						}
						.u-icon {
							position: relative;
							top: 4rpx;
							margin-left: 10rpx;
						}
					}
				}
			}
		}
	}
</style>

<template>
	<view class="wrap">
		<view class="content">
			<view class="cash">-2300.00</view>
			<view class="status" v-if="true">提现中</view>
			<view class="status green" v-if="false">提现成功</view>
			<view class="status red" v-if="false">提现失败</view>
			<view class="progress" v-if="true">
				<view class="dot blue">
					<view class="name">提交成功</view>
				</view>
				<view class="line blue"></view>
				<view class="dot blue">
					<view class="name">提现中</view>
				</view>
				<view class="line"></view>
				<view class="dot">
					<view class="name">提现成功</view>
				</view>
			</view>
			<view class="progress" v-if="false">
				<view class="dot blue">
					<view class="name">提交成功</view>
				</view>
				<view class="line blue"></view>
				<view class="dot blue">
					<view class="name">提现中</view>
				</view>
				<view class="line blue"></view>
				<view class="dot blue">
					<view class="name">提现成功</view>
				</view>
			</view>
			<view class="progress" v-if="false">
				<view class="dot blue">
					<view class="name">提交成功</view>
				</view>
				<view class="line blue"></view>
				<view class="dot blue">
					<view class="name">提现中</view>
				</view>
				<view class="line blue"></view>
				<view class="dot red">
					<view class="name">提现失败</view>
				</view>
			</view>
			<view class="card">
				<view class="title">明细</view>
				<view class="row">
					<view class="left">说明</view>
					<view class="right">用户提现</view>
				</view>
				<view class="row">
					<view class="left">时间</view>
					<view class="right">2023.07.17 14:50</view>
				</view>
				<view class="row">
					<view class="left">交易单号</view>
					<view class="right">202307177193759500612</view>
				</view>
				<view class="row">
					<view class="left">提现账户</view>
					<view class="right">**** **** **** **** 8634</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				currentItem: {}
			}
		},
		onLoad() {
		},
		onReady() {
		},
		onShow() {
		},
		methods: {
		}
	}
</script>

<style lang="scss">
	.wrap {
		min-height: 100vh;
		background: #FFFFFF;
		.content {
			padding: 40rpx 24rpx;
			.cash {
				font-size: 48rpx;
				font-weight: 500;
				color: #1A1A1A;
				line-height: 88rpx;
				text-align: center;
			}
			.status {
				font-size: 30rpx;
				font-weight: 400;
				color: #CD9F11;
				line-height: 70rpx;
				text-align: center;
				&.green {
					color: #5DB600;
				}
				&.red {
					color: #FF3838;
				}
			}
			.progress {
				display: flex;
				align-items: center;
				justify-content: center;
				padding: 20rpx 0 60rpx 0;
				.dot {
					position: relative;
					width: 24rpx;
					height: 24rpx;
					background: #CCCCCC;
					border-radius: 50%;
					&.blue {
						background: #3894FF;
						.name {
							color: #3894FF;
						}
					}
					&.red {
						background: #FF3838;
						.name {
							color: #FF3838;
						}
					}
					.name {
						position: absolute;
						display: inline-block;
						left: 50%;
						bottom: -50rpx;
						transform: translateX(-50%);
						font-size: 24rpx;
						font-weight: 400;
						color: #999999;
						line-height: 44rpx;
						white-space: nowrap;
					}
				}
				.line {
					width: 230rpx;
					height: 2rpx;
					background: #E6E6E6;
					&.blue {
						background: #3894FF;
					}
				}
			}
			.card {
				margin-top: 40rpx;
				padding: 10rpx 30rpx 30rpx 30rpx;
				background: #FFFFFF;
				box-shadow: 0rpx 2rpx 6rpx 0rpx rgba(77,77,77,0.35);
				border-radius: 4rpx;
				.title {
					font-size: 30rpx;
					font-weight: 400;
					color: #1A1A1A;
					line-height: 70rpx;
				}
				.row {
					display: flex;
					align-items: center;
					justify-content: flex-start;
					font-size: 24rpx;
					font-weight: 400;
					color: #999999;
					line-height: 44rpx;
					.left {
						width: 155rpx;
					}
					.right {
						flex: 1;
					}
				}
			}
		}
	}
</style>

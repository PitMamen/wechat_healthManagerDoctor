<template>
	<view class="wrap">
		<view class="content">
			<view class="cash">{{ info.settlement_sum || 0 }}</view>
			<view class="status" :class="{red: info.status==='提现失败' || info.status==='失败', green: info.status==='提现成功' || info.status==='成功'}">{{ info.status }}</view>
			<block v-if="options.types === '提'">
				<view class="progress" v-if="info.status === '提现中'">
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
				<view class="progress" v-if="info.status === '提现成功'">
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
				<view class="progress" v-if="info.status === '提现失败'">
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
			</block>
			<view class="card">
				<view class="title">明细</view>
				<view class="row">
					<view class="left">说明</view>
					<view class="right">{{ info.order_type_name }}</view>
				</view>
				<view class="row">
					<view class="left">时间</view>
					<view class="right">{{ info.create_time }}</view>
				</view>
				<view class="row" v-if="info.order_id">
					<view class="left">交易单号</view>
					<view class="right">{{ info.order_id }}</view>
				</view>
				<view class="row" v-if="info.bank_no">
					<view class="left">提现账户</view>
					<view class="right">**** **** **** **** {{ info.bank_no.substring(info.bank_no.length-4, info.bank_no.length) }}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				options: {},
				info: {}
			}
		},
		onLoad(options) {
			this.options = options;
			this.getInfo();
		},
		onReady() {
		},
		onShow() {
		},
		methods: {
			getInfo() {
				uni.showLoading({
					title:'正在加载'
				});
				uni.$u.http.post(`/account-api/accountOrderSettlementMaster/getWithdrawalRecordDetail`, {
					...this.options
				}).then(res => {
					uni.hideLoading();
					this.info = res.data || {};
				});
			}
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

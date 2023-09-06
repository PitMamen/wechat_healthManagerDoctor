<template>
	<view class="wrap">
		<view class="headers">
			<view class="status" :style="{height: statusHeight + 'px'}"></view>
			<view class="navigator" :style="{height: navigatorHeight + 'px'}">
				<u-icon name="arrow-left" color="#FFFFFF" size="36rpx" @click="goBack()"></u-icon>
				<view class="title">提现</view>
			</view>
		</view>
		<view class="tips">
			<view class="line line1">提现金额：</view>
			<view class="line line2">￥{{ money || 0 }}</view>
			<view class="line line1">本月剩余可提现金额：94999.00元</view>
		</view>
		<view class="content">
			<view class="action">
				<view class="title">提现金额</view>
				<view class="inputs">
					<view class="unit">￥</view>
					<u--input
						type="number"
						color="#1A1A1A"
						fontSize="48rpx"
						maxlength="8"
						border="none"
						inputAlign="left"
						placeholder=" "
						:focus="true"
						v-model="money"
					></u--input>
				</view>
				<view class="card" @click="cardClick()">
					<view class="name">银行卡</view>
					<view class="numbers">
						<view class="number">中国工商银行（****6632）</view>
						<u-icon name="arrow-right" color="#999999" size="36rpx"></u-icon>
					</view>
				</view>
				<view class="msg">3个工作日到账，具体以账户到账时间为准</view>
			</view>
			<view class="desc">
				<view class="line">每人每月首次提现不限金额，之后每次最低限额50元；</view>
				<view class="line">每人每月累计提现金额小于95000.00元；</view>
				<view class="line">单笔现金额小于等于3万，可分多次申请提现；</view>
			</view>
			<view class="btn" @click="cash1()">提现</view>
			<view class="radios">
				<u-radio-group v-model="radio">
					<u-radio shape="square" label=" " :name="1"></u-radio>
				</u-radio-group>
				<view class="agree">
					<text>我已阅读并同意</text>
					<text class="active" @click="protocolClick()">《服务条款》</text>
				</view>
			</view>
		</view>
		
		<u-popup
			mode="center"
			:show="show1"
			:safeAreaInsetBottom="false"
		>
			<view class="card-wrap">
				<view class="top">选择银行卡</view>
				<view class="middle">
					<view class="list">
						<view class="item">
							<view class="name">
								<text>中国工商银行</text>
								<text class="type">储蓄卡</text>
							</view>
							<view class="numbers">
								<view class="number">**** **** **** **** 6632</view>
								<u-icon name="checkmark" color="#999999" size="36rpx"></u-icon>
							</view>
						</view>
					</view>
				</view>
				<view class="bottom">
					<view class="action">使用其他银行卡提现</view>
					<u-icon name="plus" color="#999999" size="36rpx"></u-icon>
				</view>
			</view>
		</u-popup>
		<u-popup
			closeable
			mode="bottom"
			:show="show2"
			@close="close2"
		>
			<view class="out-wrap">
				<view class="top">收费提示</view>
				<view class="infos">
					<view class="row">
						<view class="name">提现金额</view>
						<view class="value">2300.00元</view>
					</view>
					<view class="row">
						<view class="name">本次服务费</view>
						<view class="value">12.00元</view>
					</view>
				</view>
				<view class="descs">
					<view class="title">服务费说明</view>
					<view class="desc">按照税收法律法规的相关规定，您的所得对应需要缴纳的个人所得税以及因使用第三方支付方式所产生的手续费将由您自行承担，并从应结算的提现金额中直接扣除</view>
				</view>
				<view class="btns">
					<view class="btn" @click="cash2()">继续提现</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				info: {},
				list: [],
				radio: 0,
				money: '',
				flag: false,
				show1: false,
				show2: false,
				headerHeight: getApp().globalData.headerInfo.height,
				statusHeight: getApp().globalData.headerInfo.statusBarHeight,
				navigatorHeight: getApp().globalData.headerInfo.navigatorHeight
			}
		},
		onLoad() {
		},
		onShow() {
		},
		methods: {
			getList() {
				uni.showLoading({
					title:'正在加载'
				});
				uni.$u.http.post(`/medical-api/userRightsSettlement/getIncomeDetailsByLoginUser`, {
				}).then(res => {
					uni.hideLoading();
				});
			},
			bind() {
				if (!this.currentItem.bankCard){
					uni.showToast({
						title: '请先输入银行卡号',
						icon: 'none'
					});
					return;
				}
				if (!/^\d{16,19}$/.test(this.currentItem.bankCard)){
					uni.showToast({
						title: '请输入16-19位的数字银行卡号',
						icon: 'none'
					});
					return;
				}
				if (this.flag){
					return;
				}
				this.flag = true;
				uni.showLoading({
					title:'正在加载'
				});
				uni.$u.http.post(`/account-api/tfUserInfoHvyogo/bindBankLoginUser`, {
					bindFlag: 'bind',
					...this.currentItem
				}).then(res => {
					uni.hideLoading();
					uni.showToast({
						title: '保存成功',
						icon: 'success'
					});
					setTimeout(() => {
						uni.navigateBack({
							delta: 1
						});
					}, 2000);
				}).catch(err => {
					this.flag = false;
				});
			},
			goBack() {
				uni.navigateBack({
					delta: 1
				});
			},
			hideKeyboard() {
				uni.hideKeyboard();
			},
			close1() {
				this.show1 = false;
			},
			close2() {
				this.show2 = false;
			},
			cash1() {
				this.show2 = true;
				this.hideKeyboard();
			},
			cash2() {
				uni.navigateTo({
					url: '/pages3/pages/cash/out-detail'
				});
			},
			protocolClick() {
				uni.navigateTo({
					url: '/pages3/pages/cash/protocol'
				});
			},
			cardClick() {
				this.show1 = true;
				this.hideKeyboard();
			}
		}
	}
</script>

<style lang="scss">
	.wrap {
		min-height: 100vh;
		background: #F5F5F5;
		.headers {
			background: #3894FF;
			.navigator {
				position: relative;
				display: flex;
				align-items: center;
				justify-content: center;
				.u-icon {
					position: absolute;
					left: 0;
					padding: 5rpx 10rpx;
				}
				.title {
					font-size: 36rpx;
					font-weight: 500;
					color: #FFFFFF;
					text-align: center;
				}
			}
		}
		.tips {
			padding: 30rpx 40rpx 70rpx 40rpx;
			background: #3894FF;
			.line {
				font-weight: 400;
				color: #FFFFFF;
				&.line1 {
					font-size: 28rpx;
					line-height: 48rpx;
				}
				&.line2 {
					font-size: 48rpx;
					line-height: 88rpx;
				}
			}
		}
		.content {
			position: relative;
			top: -50rpx;
			padding: 0 24rpx;
			.action {
				padding: 20rpx;
				background: #FFFFFF;
				box-shadow: 0rpx 3rpx 6rpx 0rpx rgba(230,230,230,0.35);
				border-radius: 4rpx;
				.title {
					font-size: 30rpx;
					font-weight: 400;
					color: #4D4D4D;
					line-height: 50rpx;
				}
				.inputs {
					display: flex;
					align-items: center;
					justify-content: flex-start;
					padding: 20rpx 0;
					border-bottom: 1rpx solid #E6E6E6;
					.unit {
						margin-right: 10rpx;
						font-size: 36rpx;
						font-weight: 400;
						color: #4D4D4D;
						line-height: 76rpx;
					}
					.u-input {
						flex: 1;
					}
				}
				.card {
					margin: 30rpx 0 20rpx 0;
					padding: 15rpx 30rpx;
					border: 1rpx solid #E6E6E6;
					border-radius: 4rpx;
					.name {
						font-size: 32rpx;
						font-weight: 400;
						color: #4D4D4D;
						line-height: 62rpx;
					}
					.numbers {
						display: flex;
						align-items: center;
						justify-content: flex-start;
						.number {
							font-size: 30rpx;
							font-weight: 400;
							color: #3894FF;
							line-height: 60rpx;
						}
						.u-icon {
							position: relative;
							top: 4rpx;
						}
					}
				}
				.msg {
					font-size: 24rpx;
					font-weight: 400;
					color: #999999;
					line-height: 44rpx;
				}
			}
			.desc {
				margin-top: 30rpx;
				padding: 15rpx 30rpx;
				background: #E2EDF7;
				border-radius: 4rpx;
				.line {
					font-size: 24rpx;
					font-weight: 400;
					color: #3894FF;
					line-height: 54rpx;
				}
			}
			.btn {
				margin-top: 80rpx;
				font-size: 30rpx;
				font-weight: 400;
				color: #FFFFFF;
				line-height: 68rpx;
				text-align: center;
				background: #3894FF;
				border-radius: 8rpx;
			}
			.radios {
				display: flex;
				align-items: center;
				justify-content: flex-start;
				margin-top: 30rpx;
				.u-radio-group {
					flex: 0;
				}
				.agree {
					font-size: 24rpx;
					font-weight: 400;
					color: #4D4D4D;
					line-height: 36rpx;
					.active {
						color: #3894FF;
					}
				}
			}
		}
	}
	.card-wrap {
		width: 702rpx;
		background: #FFFFFF;
		border-radius: 4rpx;
		.top {
			font-size: 30rpx;
			font-weight: 400;
			color: #4D4D4D;
			line-height: 110rpx;
			text-align: center;
			border-bottom: 1rpx solid #E6E6E6;
		}
		.middle {
			.list {
				.item {
					padding: 15rpx 60rpx;
					border-bottom: 1rpx solid #E6E6E6;
					&:last-child {
						border-bottom: none;
					}
					.name {
						font-size: 30rpx;
						font-weight: 400;
						color: #1A1A1A;
						line-height: 60rpx;
						.type {
							margin-left: 20rpx;
							font-size: 24rpx;
							color: #999999;
						}
					}
					.numbers {
						display: flex;
						align-items: center;
						justify-content: space-between;
						.number {
							font-size: 24rpx;
							font-weight: 400;
							color: #999999;
							line-height: 54rpx;
						}
						.u-icon {
							position: relative;
							top: 4rpx;
						}
					}
				}
			}
		}
		.bottom {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 50rpx 60rpx;
			border-top: 1rpx solid #E6E6E6;
			.action {
				font-size: 30rpx;
				font-weight: 400;
				color: #1A1A1A;
				line-height: 50rpx;
			}
			.u-icon {
				position: relative;
				top: 4rpx;
			}
		}
	}
	.out-wrap {
		background: #FFFFFF;
		border-radius: 4rpx;
		.top {
			font-size: 30rpx;
			font-weight: 500;
			color: #1A1A1A;
			line-height: 110rpx;
			text-align: center;
			border-bottom: 1rpx solid #E6E6E6;
		}
		.infos {
			margin: 0 24rpx;
			padding: 15rpx 0;
			border-bottom: 1rpx solid #E6E6E6;
			.row {
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-size: 30rpx;
				font-weight: 400;
				color: #1A1A1A;
				line-height: 60rpx;
			}
		}
		.descs {
			padding: 10rpx 24rpx;
			.title {
				font-size: 28rpx;
				font-weight: 400;
				color: #1A1A1A;
				line-height: 68rpx;
			}
			.desc {
				font-size: 24rpx;
				font-weight: 400;
				color: #999999;
				line-height: 44rpx;
			}
		}
		.btns {
			padding: 40rpx 24rpx;
			.btn {
				font-size: 30rpx;
				font-weight: 400;
				color: #FFFFFF;
				line-height: 68rpx;
				text-align: center;
				background: #3894FF;
				border-radius: 8rpx;
			}
		}
	}
</style>

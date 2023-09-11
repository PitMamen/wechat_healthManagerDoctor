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
			<view class="line line1">钱包余额：</view>
			<view class="line line2">￥{{ info.settlementSum || 0 }}</view>
			<view class="line line1">本月剩余可提现金额：{{ info.residueRecoverSum || 0 }}元</view>
		</view>
		<view class="content">
			<view class="action">
				<view class="title">提现金额</view>
				<view class="inputs">
					<view class="unit">￥</view>
					<u--input
						type="digit"
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
				<view class="card" @click="cardSelectClick()">
					<view class="name">银行卡</view>
					<view class="numbers">
						<view class="number" v-if="currentItem.id">
							<text>{{ currentItem.bankName }}</text>
							<text>（****{{ currentItem.bankCard.substring(currentItem.bankCard.length-4, currentItem.bankCard.length) }}）</text>
						</view>
						<view class="number" v-else>暂未绑定银行卡，点击进行绑定</view>
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
			<view class="btn" @click="outSubmit()">提现</view>
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
		
		<u-keyboard
			mode="number"
			tips="请输入6位数字密码"
			:show="show"
			:tooltip="false"
			:showTips="true"
			:showCancel="true"
			:showConfirm="true"
			:dotDisabled="true"
			@close="close"
			@change="change"
			@cancel="cancel"
			@confirm="confirm"
			@backspace="backspace"
		>
			<view class="wrap-keyboard">
				<view class="tipss">
					<text>请输入6位数字密码</text>
					<text class="close" @click="close">取消</text>
				</view>
				<u-code-input
					dot
					disabledKeyboard
					v-model="pwd"
					:maxlength="6"
				></u-code-input>
			</view>
		</u-keyboard>
		<u-popup
			mode="center"
			:show="show1"
			:safeAreaInsetBottom="false"
		>
			<view class="card-wrap">
				<view class="top">选择银行卡</view>
				<view class="middle">
					<view class="list">
						<view class="item" v-for="item in list" :key="item.id" @click="cardItemClick(item)">
							<view class="name">
								<text>{{ item.bankName }}</text>
								<text class="type">储蓄卡</text>
							</view>
							<view class="numbers">
								<view class="number">**** **** **** **** {{ item.bankCard.substring(item.bankCard.length-4, item.bankCard.length) }}</view>
								<u-icon name="checkmark" color="#999999" size="36rpx" v-if="item.id === currentItem.id"></u-icon>
							</view>
						</view>
					</view>
				</view>
				<view class="bottom" @click="cardBindClick()">
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
						<view class="name">到账金额</view>
						<view class="value">{{ settlementSum || 0 }}元</view>
					</view>
					<view class="row">
						<view class="name">本次服务费</view>
						<view class="value">{{ free || 0 }}元</view>
					</view>
				</view>
				<view class="descs">
					<view class="title">服务费说明</view>
					<view class="desc">按照税收法律法规的相关规定，您的所得对应需要缴纳的个人所得税以及因使用第三方支付方式所产生的手续费将由您自行承担，并从应结算的提现金额中直接扣除</view>
				</view>
				<view class="btns">
					<view class="btn" @click="confirmSubmit()">继续提现</view>
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
				free: 0,
				radio: 0,
				money: '',
				pwd: '',
				flag: false,
				show: false,
				show1: false,
				show2: false,
				currentItem: {},
                settlementSum: 0,
				headerHeight: getApp().globalData.headerInfo.height,
				statusHeight: getApp().globalData.headerInfo.statusBarHeight,
				navigatorHeight: getApp().globalData.headerInfo.navigatorHeight
			}
		},
		onLoad() {
		},
		onShow() {
			this.getInfo();
			this.getList();
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
			getList() {
				uni.showLoading({
					title:'正在加载'
				});
				uni.$u.http.get(`/account-api/tfUserInfoHvyogo/getBankListByUserId`, {
					params: {
					}
				}).then(res => {
					uni.hideLoading();
					this.list = res.data || [];
					if (this.list.length > 0){
						this.currentItem = this.list[0];
					}
				});
			},
			getServices() {
				uni.showLoading({
					title:'正在加载'
				});
				uni.$u.http.post(`/account-api/accountOrderSettlementMaster/countFree`, {
					settlementSum: this.money,
					bankNo: this.currentItem.bankCard
				}).then(res => {
					uni.hideLoading();
					this.free = res.data.free;
                    this.settlementSum = res.data.settlementSum;
				});
			},
			doSubmit() {
				uni.showLoading({
					title:'正在加载'
				});
				uni.$u.http.post(`/account-api/accountOrderSettlementMaster/withdrawal`, {
					settlementSum: this.money,
					bankNo: this.currentItem.bankCard
				}).then(res => {
					uni.hideLoading();
					uni.showToast({
						title: '提交成功',
						icon: 'success'
					});
					uni.setStorageSync('cashItem', res.data);
					setTimeout(() => {
						uni.navigateTo({
							url: '/pages3/pages/cash/out-detail'
						});
					}, 2000);
				}).finally(() => {
					this.close();
				});
			},
			outSubmit() {
				if (!this.currentItem.id){
					uni.showModal({
						title: '温馨提示',
						content: '请先绑定银行卡',
						showCancel: true,
						success: (res) => {
							if (res.confirm){
								this.cardBindClick();
							}
						}
					});
					return;
				}
				if (!this.money){
					uni.showToast({
						title: '请先输入提现金额',
						icon: 'none'
					});
					return;
				}
				if (!/^(([1-9][0-9]*)|([0]\.[0-9]{1,2}|[1-9][0-9]*\.[0-9]{1,2}))$/.test(this.money+'') || (this.money+'')==='0.0' || (this.money+'')==='0.00'){
					uni.showToast({
						title: '提现金额需大于0，且只能保留2位小数',
						icon: 'none'
					});
					return;
				}
				if (!this.radio){
					uni.showToast({
						title: '请先阅读并同意《服务条款》',
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
				uni.$u.http.post(`/account-api/accountOrderSettlementMaster/withdrawalCheck`, {
					settlementSum: this.money,
					bankNo: this.currentItem.bankCard
				}).then(res => {
					uni.hideLoading();
					this.show2 = true;
					this.hideKeyboard();
					this.getServices();
				}).finally(() => {
					this.flag = false;
				});
			},
			confirmSubmit() {
				this.close2();
				this.show = true;
				this.hideKeyboard();
			},
			cardItemClick(item) {
				this.close1();
				this.currentItem = item;
			},
			cardSelectClick() {
				if (!this.currentItem.id){
					this.cardBindClick();
					return;
				}
				this.show1 = true;
				this.hideKeyboard();
			},
			cardBindClick() {
				uni.navigateTo({
					url: '/pages3/pages/cash/card-add'
				});
			},
			protocolClick() {
				uni.navigateTo({
					url: '/pages3/pages/cash/protocol'
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
			close(e) {
				this.pwd = '';
				this.show = false;
				this.flag = false;
			},
			change(e) {
				e = e + '';
				if (this.pwd.length >= 6){
					return;
				}
				this.pwd = this.pwd + e;
				if (this.pwd.length === 6){
					this.checkPwd();
				}
			},
			cancel(e) {
				this.close(e);
			},
			confirm(e) {
				this.close(e);
			},
			backspace(e) {
				if (this.pwd.length === 0){
					return;
				}
				this.pwd = this.pwd.substring(0, this.pwd.length-1);
			},
			checkPwd() {
				if (this.flag){
					return;
				}
				this.flag = true;
				uni.showLoading({
					title:'正在加载'
				});
				uni.$u.http.post(`/account-api/accountOrderSettlementMaster/checkPayPassword`, {
					payPassword: this.pwd
				}).then(res => {
					uni.hideLoading();
					this.doSubmit();
				}).catch(err => {
					this.flag = false;
				});
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
	.wrap-keyboard {
		padding: 40rpx 24rpx;
		background: #FFFFFF;
		.tipss {
			position: relative;
			margin-bottom: 40rpx;
			font-size: 36rpx;
			font-weight: 500;
			color: #1A1A1A;
			line-height: 54rpx;
			text-align: center;
			.close {
				position: absolute;
				top: 0;
				right: 0;
				font-size: 30rpx;
				font-weight: 400;
				color: #999999;
				line-height: 54rpx;
			}
		}
		.u-code-input {
			margin-bottom: 40rpx;
			justify-content: center;
		}
	}
</style>

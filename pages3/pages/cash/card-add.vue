<template>
	<view class="wrap">
		<view class="content">
			<view class="row border">
				<view class="name">持卡人</view>
				<view class="value">{{ account.user.userName }}</view>
			</view>
			<view class="row">
				<view class="name">卡号</view>
				<u--input
					type="number"
					color="#4D4D4D"
					fontSize="30rpx"
					maxlength="19"
					border="none"
					inputAlign="right"
					placeholder="请输入银行卡号"
					v-model="currentItem.bankCard"
				></u--input>
			</view>
			<view class="row border">
				<view class="name">卡类型</view>
				<view class="value">目前仅支持储蓄卡</view>
			</view>
			<view class="desc">重要提示：请认真核对账号信息，否则可能导致提现失败！</view>
		</view>
		<view class="fix-btn">
			<view class="btn" @click="bind()">保存</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				flag: false,
				currentItem: {},
				account: uni.getStorageSync('account')
			}
		},
		onLoad() {
		},
		onReady() {
		},
		onShow() {
		},
		methods: {
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
					});
				}).finally(() => {
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
		.content {
			padding: 0 45rpx;
			.row {
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-size: 30rpx;
				font-weight: 400;
				color: #4D4D4D;
				line-height: 110rpx;
				&.border {
					border-bottom: 1rpx solid #CCCCCC;
				}
			}
			.desc {
				font-size: 24rpx;
				font-weight: 400;
				color: #4D4D4D;
				line-height: 84rpx;
			}
		}
		.fix-btn {
			position: fixed;
			bottom: 125rpx;
			width: 100%;
			padding: 0 24rpx;
			box-sizing: border-box;
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

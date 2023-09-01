<template>
	<view class="wrap">
		<view class="top">
			<u-icon name="grid" color="#3894FF" size="42rpx"></u-icon>
			<view class="action" @click="management(true)" v-if="!manager">管理</view>
			<view class="action" @click="management(false)" v-else>退出</view>
		</view>
		<view class="content">
			<view class="list">
				<view class="item" v-for="item in list" :key="item.id">
					<view class="radio-wrap" v-if="manager">
						<view class="mask" @click="radioClick(item)"></view>
						<u-radio-group v-model="currentItem.id">
							<u-radio shape="circle" :name="item.id"></u-radio>
						</u-radio-group>
					</view>
					<view class="card">
						<view class="name">{{ item.bankName }}</view>
						<view class="desc">储蓄卡</view>
						<view class="number">{{ item.bankCard }}</view>
					</view>
				</view>
			</view>
			<view class="add-block" @click="goAdd()" v-if="!manager && list.length<3">
				<u-icon name="plus" color="#999999" size="52rpx"></u-icon>
				<view class="btn">添加银行卡</view>
			</view>
		</view>
		<view class="fix-btn" v-if="manager">
			<view class="btn" @click="unBind()">解除绑定</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				flag: false,
				manager: false,
				list: [],
				currentItem: {}
			}
		},
		onLoad() {
			this.getList();
		},
		onReady() {
		},
		onShow() {
		},
		methods: {
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
				});
			},
			goAdd() {
				uni.navigateTo({
					url: '/pages3/pages/cash/card-add'
				});
			},
			unBind() {
				if (!this.currentItem.id){
					uni.showToast({
						title: '请先选择需要解绑的银行卡',
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
					bindFlag: 'unbind',
					...this.currentItem
				}).then(res => {
					uni.hideLoading();
					this.getList();
					this.manager = false;
				}).finally(() => {
					this.flag = false;
				});
			},
			radioClick(item) {
				this.currentItem = item;
			},
			management(manager) {
				if (this.list.length === 0){
					return;
				}
				this.manager = manager;
			}
		}
	}
</script>

<style lang="scss">
	.wrap {
		min-height: 100vh;
		background: #F5F5F5;
		.top {
			display: flex;
			align-items: center;
			justify-content: flex-end;
			padding: 30rpx 24rpx 0 24rpx;
			>.u-icon {
				position: relative;
				top: 2rpx;
				margin-right: 10rpx;
			}
			.action {
				font-size: 30rpx;
				font-weight: 400;
				color: #3894FF;
			}
		}
		.content {
			padding: 30rpx 24rpx;
			.list {
				.item {
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-bottom: 30rpx;
					.radio-wrap {
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: center;
						position: relative;
						width: 52rpx;
						.mask {
							position: absolute;
							top: 0;
							left: 0;
							right: 0;
							bottom: 0;
							z-index: 1;
						}
						.u-radio {}
					}
					.card {
						flex: 1;
						padding: 30rpx 40rpx;
						background: #3894FF;
						border-radius: 4rpx;
						.name {
							font-size: 30rpx;
							font-weight: 400;
							color: #FFFFFF;
							line-height: 50rpx;
						}
						.desc {
							font-size: 24rpx;
							font-weight: 400;
							color: #FFFFFF;
							line-height: 44rpx;
						}
						.number {
							padding: 20rpx 0 5rpx 0;
							font-size: 30rpx;
							font-weight: 400;
							color: #FFFFFF;
							line-height: 50rpx;
						}
					}
				}
			}
			.add-block {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: flex-start;
				padding: 55rpx 0;
				background: #E6E6E6;
				border-radius: 4rpx;
				>.u-icon {
					padding: 10rpx 0;
				}
				.btn {
					font-size: 24rpx;
					font-weight: 400;
					color: #999999;
					line-height: 44rpx;
				}
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

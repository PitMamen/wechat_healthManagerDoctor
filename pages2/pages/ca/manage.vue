<template>
	<view class="wrap">
		<view class="row" @click="certificateClick()">
			<view class="left">我的证书</view>
			<view class="right">
				<u-icon name="arrow-right" color="#999999" size="36rpx"></u-icon>
			</view>
		</view>
		<view class="row" @click="pwdClick()">
			<view class="left">重置密码</view>
			<view class="right">
				<u-icon name="arrow-right" color="#999999" size="36rpx"></u-icon>
			</view>
		</view>
		<view class="row" @click="signClick()">
			<view class="left">签署授权</view>
			<view class="right">
				<view class="name" v-if="info.signStatus === 3000">完成</view>
				<view class="name red" v-else>未完成</view>
				<u-icon name="arrow-right" color="#999999" size="36rpx"></u-icon>
			</view>
		</view>
		<view class="row" @click="caClick()">
			<view class="left">实名认证</view>
			<view class="right">
				<view class="name" v-if="info.authStatus === 2">通过</view>
				<view class="name red" v-else>未通过</view>
				<u-icon name="arrow-right" color="#999999" size="36rpx"></u-icon>
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
		computed: {
		},
		components: {
		},
		onLoad(options) {
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
				uni.$u.http.post('/account-api/tdUserInfoCaAuthApplet/getCaAuthInfoForUserId', {}).then(res => {
					this.info = res.data || {};
				}).finally(() => {
					uni.hideLoading();
				});
			},
			certificateClick() {
				uni.navigateTo({
					url: `/pages2/pages/ca/certificate?isAuthType=1`
				});
			},
			pwdClick() {
				uni.navigateTo({
					url: '/pages2/pages/ca/pwd-reset'
				});
			},
			signClick() {
				if (this.info.signStatus === 3000){
					uni.showToast({
						title: '授权签署已完成',
						icon: 'success'
					});
					return;
				}
				// window.location.href = this.info.signUrl;
				uni.setStorageSync('caAuthUrl',this.info.signUrl)
				uni.navigateTo({
						url: '/pages2/pages/ca/webview' 
						
					})
			},
			caClick() {
				if (this.info.authStatus === 2){
					uni.showToast({
						title: '实名认证已完成',
						icon: 'success'
					});
					return;
				}
				// window.location.href = this.info.caUrl;
				uni.setStorageSync('caAuthUrl',this.info.caUrl)
				uni.navigateTo({
						url: '/pages2/pages/ca/webview' 
						
					})
			}
		}
	}
</script>

<style lang="scss">
	.wrap {
		min-height: 100vh;
		background: #F5F5F5;
		.row {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 32rpx 25rpx;
			background: #FFFFFF;
			border-bottom: 1rpx solid #F5F5F5;
			&:last-child {
				border-bottom: 1rpx solid #FFFFFF;
			}
			.left {
				font-size: 30rpx;
				font-weight: 400;
				color: #4D4D4D;
				line-height: 46rpx;
			}
			.right {
				display: flex;
				justify-content: flex-end;
				align-items: center;
				.name {
					margin-right: 10rpx;
					font-size: 30rpx;
					font-weight: 400;
					color: #999999;
					line-height: 46rpx;
					&.red {
						color: #E41616;
					}
				}
				.u-icon {
					position: relative;
					top: 2rpx;
				}
			}
		}
	}
</style>

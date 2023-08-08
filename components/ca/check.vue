<template>
	<u-popup
		mode="center"
		:show="show"
		:closeOnClickOverlay="false"
	>
		<view class="wrap">
			<view class="title">实名认证提醒</view>
			<view class="content">
				<view>尊敬的用户：</view>
				<view>系统检测到您尚未完成实名认证，根据相关法规要求，请您立刻完成实名认证以便开通服务。</view>
			</view>
			<view class="bottom">
				<view class="btn" @click="submit()">前往开通</view>
			</view>
		</view>
	</u-popup>
</template>

<script>
	export default {
		data() {
			return {
				urls: '',
				show: false
			}
		},
		onLoad(options) {
		},
		onReady() {
		},
		onShow() {
		},
		methods: {
			check() {
				uni.$u.http.post('/account-api/tdUserInfoCaAuthApplet/authExistsForUserId', {}).then(res => {
					this.show = res.data;
					
					if (this.show){
						this.getUrls();
						uni.hideTabBar()
						
					}else{
						uni.showTabBar()
					}
				});
			},
			getUrls() {
				uni.$u.http.post('/account-api/tdUserInfoCaAuthApplet/getCustomerIdForUserId', {}).then(res => {
					this.urls = res.data;
				
				});
			},
			close() {
				this.show = false;
			},
			submit() {
				if (!this.urls){
					return;
				}
				
				if(this.urls.indexOf('pages/ca/pwd-set') > -1){
					//跳转到小程序设置密码页面
					uni.navigateTo({
							url: '/pages2/pages/ca/pwd-set' 
							
						})
				}else if(this.urls.indexOf('pages/work/workshop') > -1){
					//跳转到小程序成功页面
					uni.switchTab({
							url: '/pages/work/workshop'
							
						})
				}else {
					//跳转到网页
					uni.setStorageSync('caAuthUrl',this.urls)
					uni.navigateTo({
							url: '/pages2/pages/ca/webview' 
							
						})
				}
				

					
					
			}
		}
	}
</script>

<style lang="scss">
	.wrap {
		width: 620rpx;
		padding: 15rpx 40rpx;
		background: #FFFFFF;
		border-radius: 4rpx;
		box-sizing: border-box;
		.title {
			padding-bottom: 8rpx;
			font-size: 36rpx;
			font-weight: 500;
			color: #1A1A1A;
			line-height: 86rpx;
			text-align: center;
		}
		.content {
			font-size: 30rpx;
			font-weight: 400;
			color: #999999;
			line-height: 45rpx;
		}
		.bottom {
			padding: 30rpx 0;
			.btn {
				font-size: 30rpx;
				font-weight: 400;
				color: #FFFFFF;
				line-height: 68rpx;
				text-align: center;
				background: #409EFF;
				border-radius: 34rpx;
			}
		}
	}
</style>

<template>
	<view>
		<view style="height: 110rpx;background-color: white;"></view>
		<view style="display: flex;flex-direction: row;padding-left: 20rpx;">
			<u-icon @click="goBack" bold name="arrow-left" size='45rpx' color="#333"
				style="width: 10rpx;height: 10rpx;float: right;margin-right: 10rpx;margin-top: 6.5rpx;"></u-icon>
			<view style="margin-left: 30vw;font-size: 30rpx;">实名认证</view>
		</view>
		<view class="content">

			<image v-if="type==1"
				src="https://hmg.mclouds.org.cn/content-api/file/I20230829170202755CWGLSP17LC5BR7-uploadsucc_20230829165916.png"
				style="width: 320rpx;height: 222rpx;margin-top: 300rpx;">
			</image>
			<image v-else
				src="https://hmg.mclouds.org.cn/content-api/file/I202308291702310806W9T8CPHCSCECD-uploadfail_20230829165917.png"
				style="width: 320rpx;height: 222rpx;margin-top: 300rpx;">
			</image>

			<view v-if="type==1" style="color: #999999;font-size: 30rpx;margin: 56rpx 60rpx;">
				您的资料已经提交，工作人员将在3-5个工作日内对您的资料进行审核！审核结果请关注短信和微信公众号消息。</view>
			<view v-else style="color: #999999;font-size: 30rpx;margin: 56rpx 60rpx;">
				您的资料经工作人员审核，审核结果为：不通过！不通过原因：{{failReason}}。
			</view>

			<!-- 底部按钮 下一步按钮-->
			<view v-if="type!=1"
				style="width: 100vw;display: flex;flex-direction: row;align-items: center;justify-content: center;margin-top: 22rpx;">
				<view @click="goNext"
					style="color: white;background-color: #3894FF;width: 90vw;padding: 20rpx 0;border-radius: 8rpx;text-align: center;font-size: 30rpx;">
					修改资料</view>
			</view>

		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type: 1, //1提交成功  2审核失败
				jumpFrom: 1, //从哪里跳入标记  1我的  2提交审核  需要返回不同的页面
				account: '',
				failReason: '',

			}
		},
		onLoad(option) {
			this.type = option.type
			this.jumpFrom = option.jumpFrom
			if (this.type == 2) {

			}
			this.account = uni.getStorageSync('account');
			console.log('option', option)
			// uni.setNavigationBarStyle({
			// 	backgroundColor: '#ffffff',
			// 	borderBottom: '1px solid #e5e5e5',
			// 	titleText: '页面标题',
			// 	titleColor: '#000000'
			// })
		},
		methods: {
			getFailReason() {
				uni.$u.http.get('/account-api/accountInfo/getDoctorAuthStatus', {
					params: {}
				}).then(res => {
					if (res.code == 0) {
						this.failReason = res.data.reason || ''
					} else {
						this.$u.toast(res.message)
					}

				}).finally(() => {
					uni.hideLoading();
				});
			},

			/**
			 * 重新返回键需要在pages.js里面配置"navigationStyle": "custom",然后重新写返回键的样式以及页面标题
			 */
			goBack() {
				console.log('goBack jumpFrom', this.jumpFrom)
				if (this.jumpFrom == 1) {
					uni.navigateBack({
						delta: 1
					});
				} else {
					uni.navigateBack({
						delta: 3
					});
				}

			},


			goNext() {
				uni.navigateTo({
					url: '/pages2/pages/mine/identify-base'
				})
			},



		}
	}
</script>

<style lang="scss">
	.content {
		background-color: white;
		min-height: 70vh;
		overflow: hidden;
		display: flex;
		background-color: white;
		align-items: center;
		// justify-content: center;
		flex-direction: column;


	}
</style>
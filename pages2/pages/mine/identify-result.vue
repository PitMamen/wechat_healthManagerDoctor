<template>
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
			您的资料经工作人员审核，审核结果为：不通过！不通过原因：请您修改自己的职称证书。
		</view>

		<!-- 底部按钮 下一步按钮-->
		<view v-if="type!=1"
			style="width: 100vw;display: flex;flex-direction: row;align-items: center;justify-content: center;margin-top: 22rpx;">
			<view @click="goNext"
				style="color: white;background-color: #3894FF;width: 90vw;padding: 20rpx 0;border-radius: 8rpx;text-align: center;font-size: 30rpx;">
				修改资料</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				type: 1, //1提交成功  2审核失败
				account: '',

			}
		},
		onLoad(option) {
			this.account = uni.getStorageSync('account');
			console.log('option', option)
		},
		methods: {

			goBack() {
				uni.navigateBack({
					delta: 1
				});
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
		min-height: 100vh;
		overflow: hidden;
		display: flex;
		background-color: white;
		align-items: center;
		// justify-content: center;
		flex-direction: column;


	}
</style>
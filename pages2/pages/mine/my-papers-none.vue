<template>
	<view class="content">

		<view style="width: 100vw;height: 20rpx;background-color: #F2F2F2;"></view>



		<view class="view-base">
			<view style="height: 20rpx;background-color: #F2F2F2;"></view>
			<view style="color: #4D4D4D;font-size: 30rpx;padding: 40rpx 30rpx">身份证（待上传）</view>
			<view style="height: 20rpx;background-color: #F2F2F2;"></view>
			<view style="color: #4D4D4D;font-size: 30rpx;padding: 40rpx 30rpx">职称证（待上传）</view>
			<view style="height: 20rpx;background-color: #F2F2F2;"></view>
			<view style="color: #4D4D4D;font-size: 30rpx;padding: 40rpx 30rpx">资格证（待上传）</view>
			<view style="height: 20rpx;background-color: #F2F2F2;"></view>
			<view style="color: #4D4D4D;font-size: 30rpx;padding: 40rpx 30rpx">执业证（待上传）</view>
			<view style="height: 20rpx;background-color: #F2F2F2;"></view>


			<!-- 底部按钮 下一步按钮-->
			<view
				style="width: 100vw;display: flex;flex-direction: row;align-items: center;justify-content: center;margin-top: 60rpx;">
				<view @click="goNext"
					style="color: white;background-color: #3894FF;width: 90vw;padding: 20rpx 0;border-radius: 8rpx;text-align: center;font-size: 30rpx;">
					更新证件</view>
			</view>

			<view style="height: 30rpx;"></view>

		</view>


	</view>
</template>

<script>
	import {
		baseURL
	} from '@/config/config';
	export default {
		components: {
			// config
		},
		data() {
			return {
				// imgSrc: 'https://hmg.mclouds.org.cn/content-api/file/I20230831105355758RXFRVRZAKPAHAC-zige_Z.jpg',
				// imgSrc:'https://hmg.mclouds.org.cn/content-api/file/I20230831105045590J2K0MERVYNDDJV-shenfenzheng_Z.jpg',
				imgSrc: 'https://hmg.mclouds.org.cn/content-api/file/I20230831105218879DJJBP3PPFSZMLQ-zhiyezheng_Z.jpg',
				account: {},
				title: '',

			}
		},
		onLoad(option) {
			this.account = uni.getStorageSync('account');

			// this.headers.Authorization = uni.getStorageSync('bussinessToken')

			console.log('option****************', option)
			// console.log('header****************', this.header)
			// this.getIdentifyInfo()
		},
		methods: {
			goNext() {
				uni.navigateTo({
					url: '/pages2/pages/mine/my-papers-edit'
				})
			}


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
		flex-direction: column;

		.view-base {
			width: 100vw;
			display: flex;
			flex-direction: column;
			// padding: 30rpx 24rpx;




		}
	}
</style>
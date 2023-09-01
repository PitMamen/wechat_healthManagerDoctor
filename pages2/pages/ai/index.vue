<template>
	<view style="height: 100vh;background-color: #f5f5f5;padding-top: 30rpx;">

		<view class="inputwrap">
			<view class="remind">
				<image src="../../static/static/images/ai_icon.png"
					style="width: 42rpx;height: 42rpx;margin-right: 20rpx;"></image>
				<view>智能AI助手根据您和患者对话生成推荐回答</view>

			</view>
			<textarea class="textview" @input="bindInput" :value="value" auto-height />
		</view>

		<button type="primary" class="button" @click="btnClick">发 送</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				value: '哈哈哈哈哈啊'
			}
		},
		methods: {
			bindInput(event) {
				console.log(event.detail)

			}

		}
	}
</script>

<style>
	.inputwrap {
		width: 690rpx;
		min-height: 244rpx;
		background: #FFFFFF;
		border-radius: 4rpx;
		margin-left: 30rpx;
		padding-top: 30rpx;
		padding-bottom: 30rpx;
		background-color: white;

	}

	.remind {
		font-size: 28rpx;
		color: #999999;
		display: flex;
		flex-direction: row;
		margin-left: 30rpx;
		
	}

	.textview {
		width: 628rpx;
		min-height: 100rpx;
		margin-top: 30rpx;
		margin-left: 30rpx;

		background-color: white;
		color: #4D4D4D;
	}

	.button {

		width: 690rpx;

		color: #ffffff;
		background-color: #3894FF !important;

		border-color: #3894FF !important;
		border-radius: 10rpx;
		margin-top: 60rpx;
	}
</style>
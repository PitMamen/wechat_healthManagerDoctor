<template>
	<view class="content">
		<view class="cash-wrap" @click="goMyplan()">
			<view class="top-title">我的随访计划</view>
			<view class="bottom-title">我收藏和创建的随访计划</view>
		</view>

		<view class="center-line"></view>


		<view class="cash-wrap" @click="goSendplan()">
			<view class="top-title">我发放的随访计划</view>
			<view class="bottom-title">已发送的随访计划{{count}}个</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {

				count: 0,
			}
		},

		onLoad(options) {

			this.account = uni.getStorageSync('account')
			this.getsendplanCount()




		},

		onReady() {

		},
		onShow() {

		},
		methods: {


			goMyplan() {
				console.log("vvvvvv")
				uni.navigateTo({
					url: '/pages2/pages/follow/myfollowlist'
				})

			},


			goSendplan() {
				uni.navigateTo({
					url: '/pages2/pages/follow/sendplan'
				})
			},


			getsendplanCount() {
				uni.showLoading({
					title: '加载中...'
				});
				uni.$u.http.get('/follow-api/follow/plan/doctorSendPlanCount', {

				}).then(res => {
					uni.hideLoading()
					if (res.code === 0) {
						if(res.data){
							this.count = res.data
						}
						
						// this.followDataList = res.data.rows
						// this.noData = this.followDataList.length == 0
					}

				})
			},




			// /follow-api/follow/plan/doctorSendPlanCount





		}
	}
</script>

<style>
	.content {
		height: 300rpx;
		width: 100%;
		background-color: #FFFFFF;
		display: flex;
		flex-direction: column;
		overflow: hidden;

		flex-wrap: wrap;
	}


	.cash-wrap {
		height: 100rpx;
		width: 100%;
	}

	.top-title {
		margin-top: 12rpx;
		margin-left: 48rpx;
		font-size: 32rpx;
		color: #1A1A1A;
	}

	.bottom-title {
		margin-left: 48rpx;
		font-size: 28rpx;
		margin-top: 15rpx;
		color: #999999;
	}



	.center-line {
		width: 100%;
		height: 1px;
		background: #E6E6E6;
		margin-bottom: 30rpx;
		margin-top: 30rpx;
	}
</style>

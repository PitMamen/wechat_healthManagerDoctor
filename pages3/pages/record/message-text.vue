<template>
	<view>
		<view class="titlewrap">
			<view class="titleview">

				<view class="title">{{patientList.length}}<text style="color: #1A1A1A;">个收信人：</text></view>
			</view>
			<scroll-view scroll-y="true" style="height: 400rpx;">
				<view class="nameview">
					<view class="nameitem">{{nameList}}</view>
				</view>
			</scroll-view>
		</view>
		<view class="titlewrap">
			<view class="titleview">

				<view class="title">消息内容</view>
			</view>
			<textarea class="textview" maxlength="-1" placeholder="请输入您的内容" @input="bindInput" :value="value" />
		</view>

		<view class="wrap-submit" @click="btnClick">
			<view class="btn-sub">发 送</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				value: '',
				requestting: false,
				patientList: [],
				nameList: '',

			}
		},
		onLoad(options) {
			this.patientList = uni.getStorageSync('cache_chose_patients') || []
			this.nameList = this.patientList.map(item => {
				return item.user_name
			}).join('、')
		},
		methods: {
			bindInput(event) {
				console.log(event.detail)
				this.value = event.detail.value
			},
			btnClick() {
				let that = this
				if (this.patientList.length === 0) {
					uni.showToast({
						title: '请先选择患者',
						icon: 'none'
					});
					return
				}
				if (!this.value) {
					uni.showToast({
						title: '请输入内容',
						icon: 'none'
					});
					return
				}
				if (this.requestting) {
					return
				}

				this.requestting = true

				setTimeout(() => {
					that.requestting = false
				}, 2000)



				uni.showLoading({
					title: '发送中'
				});
				uni.$u.http.post('/medical-api/tlSendImMessageLog/addImMessageLog', {
					"messageType": 1,
					"sendMessage": this.value,
					"sendUserIds": this.patientList.map(item => {return item.patient_user_id}),

				}).then(res => {

					uni.showToast({
						title: '发送成功',
						icon: 'success'
					});
					setTimeout(() => {
						uni.navigateBack({
							delta: 2
						});
					}, 1500)

				}).finally(() => {
					uni.hideLoading();
					
				});;

			},
		}
	}
</script>

<style>
	page {
		background-color: #F5F5F5;
	}

	.titlewrap {
		width: 702rpx;
		margin-top: 30rpx;
		margin-left: 24rpx;
		padding-top: 30rpx;
		padding-bottom: 30rpx;
		background: #FFFFFF;
		box-shadow: 0px 3rpx 6rpx 0px rgba(204, 204, 204, 0.35);
		border-radius: 4rpx;
		display: flex;
		flex-direction: column;
	}

	.titleview {
		display: flex;
		flex-direction: row;
		margin-left: 30rpx;
		margin-bottom: 30rpx;
		align-items: center;
	}

	.titletag {
		width: 5rpx;
		height: 36rpx;
		background: #3894FF;
	}

	.title {
		font-size: 32rpx;

		color: #3894FF;

	}

	.nameview {

		margin-left: 30rpx;
		margin-right: 30rpx;

	}

	.nameitem {
		font-size: 30rpx;
		line-height: 37rpx;
		color: #4D4D4D;
	}

	.inputview {
		margin-left: 30rpx;
		margin-right: 30rpx;
		margin-bottom: 18rpx;
	}

	.input {

		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: rgba(62, 74, 89, 0.45);
		line-height: 36rpx;
	}

	.line {
		margin-left: 30rpx;
		width: 642rpx;
		height: 1rpx;
		background: #E6E6E6;
	}

	.wrap-submit {

		display: flex;
		flex-direction: column;
		margin-bottom: 30rpx;
		padding-left: 24rpx;
		padding-right: 24rpx;
		margin-top: 100rpx;

	}

	.btn-sub {
		width: 100%;
		border-radius: 8rpx;
		text-align: center;
		padding: 20rpx 0;
		font-size: 30rpx;
		color: white;
		background-color: #3894FF;

	}

	.textview {
		width: 628rpx;
		height: 300rpx;
		margin-top: 30rpx;
		margin-left: 30rpx;
		font-size: 30rpx !important;
		background-color: white;
		color: #4D4D4D;
	}
</style>
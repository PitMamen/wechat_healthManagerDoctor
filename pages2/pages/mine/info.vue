<template>
	<view class="content">
		<view class="background">
			<view class="v-card">
				<view class="v-home-head">
					<image mode="aspectFill" :src="account.avatarUrl || '/pages2/static/static/images/header.png'"
						style="flex-shrink: 0; width: 120rpx;height: 120rpx;margin-left: 30rpx;border-radius: 50%;">
					</image>
					<view class="v-right-head">
						<view class="v-right-hor">

							<view style="font-size: 18px;color: #141418;">{{account.doctorName}}</view>

						</view>
						<view class="v-right-hor" style="margin-top: 19rpx;">
							<view style="font-size: 14px;color: #141418;">{{account.professionalTitle}}</view>
							<view style="font-size: 14px;color: #5F5F6B;margin-left: 20rpx;">
								{{account.deptName}}
							</view>


						</view>

					</view>
					
				</view>
				<view class="v-home-bottom">
					<view>好评率：<text style="color: #D7AD65;">{{account.visitScore}}</text>%</view>
					<view style="margin-left: 90rpx;">接诊人次：<text style="color: #D7AD65;">{{account.visitNum}}</text>人
					</view>
				</view>
			</view>


		</view>
		<view class="card-mid">
			<view style="margin-left: 30rpx;margin-top: 30rpx;color: #1A1A1A;">个人资料完整度{{account.infoScore}}%</view>
			<view v-if="account.infoScore!='100'"
				style="margin-left: 30rpx;margin-top: 30rpx;margin-right: 30rpx;color: #D77311;">{{infosText}}
			</view>
			<view style="margin-left: 30rpx;margin-top: 30rpx;margin-right: 30rpx;">
				<u-line-progress style="color: #D77311;"
					activeColor="#409EFF" :percentage="account.infoScore" :showText="false"></u-line-progress>
			</view>
			
			<view style="margin-left: 30rpx;margin-top: 30rpx;margin-right: 30rpx;color: #999999;margin-bottom: 30rpx;">
				100%完善您的个人信息，将有助于您提高平台曝光度，为更多患者提供专业服务</view>
		</view>

		<view
			style="margin-left: 10px;margin-right:10px;margin-top: 20rpx; margin-bottom: 20rpx; background: white;padding: 30rpx;border-radius: 8rpx;"
			@click="gowsgrzl">
			<image src="/pages2/static/static/images/inquiry.png" style="float: left;width: 40rpx;height: 40rpx;">
			</image>
			<span style="float: left;margin-left: 10px;font-size: 15px;color: #1A1A1A;">完善我的个人资料</span>
		    <view style="margin-left: 95%;">
				<u-icon name="arrow-right" color="#333" style="width: 10px;height: 10px;float: right;margin-top: 6.5px;">
				</u-icon>
			</view>
		
		
			
			

		</view>
		<view class="itemviewcard">
			<view class="itemview" @click="goTuwen">
				<image src="/pages2/static/static/images/textNum.png" style="float: left;width: 40rpx;height: 40rpx;">
				</image>

				<view style="display: flex;flex-direction: column;">
					<view style="float: left;margin-left: 10px;font-size: 15px;color: #1A1A1A;font-weight: bold;">图文咨询
						<span v-if="textNumStatus == 0"
							style="margin-left: 20rpx; font-size: 12px;color: #EB1111;">未开通</span>
					</view>
					<view style="float: left;margin-left: 10px;font-size: 12px;color: #999999;margin-top: 10rpx;">
						24小时可以多次沟通</view>
				</view>
				
				<view style="margin-left: auto;margin-top: 15px;">
					<u-icon name="arrow-right"
						style="width: 10px;height: 10px;margin-left: auto;margin-top: 20rpx;color=#333"></u-icon>
				</view>
				
				
				 
				

			</view>
			<view style="height: 0.5px;background: #E6E6E6;margin-left: 30rpx;margin-right: 30rpx;"></view>
			<view class="itemview" @click="goDianhua">
				<image src="/pages2/static/static/images/telNum.png" style="float: left;width: 40rpx;height: 40rpx;">
				</image>

				<view style="display: flex;flex-direction: column;">
					<view style="float: left;margin-left: 10px;font-size: 15px;color: #1A1A1A;font-weight: bold;">电话咨询
						<span v-if="telNumStatus == 0"
							style="margin-left: 20rpx; font-size: 12px;color: #EB1111;">未开通</span>
					</view>
					<view style="float: left;margin-left: 10px;font-size: 12px;color: #999999;margin-top: 10rpx;">
						预约时段接听医生，沟通更直接</view>
				</view>
			<view style="margin-left: auto;margin-top: 15px;">
				<u-icon name="arrow-right"
					style="width: 10px;height: 10px;margin-left: auto;margin-top: 20rpx;color=#333"></u-icon>
			</view>

			</view>
			<view style="height: 0.5px;background: #E6E6E6;margin-left: 30rpx;margin-right: 30rpx;"></view>
			<view class="itemview" @click="goShipin">
				<image src="/pages2/static/static/images/videoNum.png" style="float: left;width: 40rpx;height: 40rpx;">
				</image>

				<view style="display: flex;flex-direction: column;">
					<view style="float: left;margin-left: 10px;font-size: 15px;color: #1A1A1A;font-weight: bold;">视频咨询
						<span v-if="videoNumStatus == 0"
							style="margin-left: 20rpx; font-size: 12px;color: #EB1111;">未开通</span>
					</view>
					<view style="float: left;margin-left: 10px;font-size: 12px;color: #999999;margin-top: 10rpx;">
						预约时间，医生根据情况与患者视频交流</view>
				</view>
			<view style="margin-left: auto;margin-top: 15px;">
				<u-icon name="arrow-right"
					style="width: 10px;height: 10px;margin-left: auto;margin-top: 20rpx;color=#333"></u-icon>
			</view>

			</view>
			<view style="height: 0.5px;background: #E6E6E6;margin-left: 30rpx;margin-right: 30rpx;"></view>
			<view class="itemview" @click="goSuiz">
				<image src="/pages2/static/static/images/suizNum.png" style="float: left;width: 40rpx;height: 40rpx;">
				</image>
			
				<view style="display: flex;flex-direction: column;">
					<view style="float: left;margin-left: 10px;font-size: 15px;color: #1A1A1A;font-weight: bold;">门诊随诊
					</view>
					<view style="float: left;margin-left: 10px;font-size: 12px;color: #999999;margin-top: 10rpx;">
						轻松管理诊后患者，提升个人品牌价值</view>
				</view>
			<view style="margin-left: auto;margin-top: 15px;">
				<u-icon name="arrow-right"
					style="width: 10px;height: 10px;margin-left: auto;margin-top: 20rpx;color=#333"></u-icon>
			</view>
			
			</view>

		</view>

		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello',
				account: {},
				infosText: '',
				taskList: [],
				//0未开通 1已开通
				textNumStatus: 0,
				telNumStatus: 0,
				videoNumStatus: 0,
			}
		},
		onLoad() {



		},
		onShow() {
			this.getData()
		},
		methods: {
			getData() {

				uni.$u.http.get('/account-api/getDocLoginInfo', {}).then(res => {
					if (res.code === 0) {
						this.account = res.data

						var noFinishedInfos = res.data.infos.filter(item => {
							return item.status === 0
						})
						this.infosText = '还需完善' + noFinishedInfos.map(item => {
							return item.itemName
						}).join('、')

						res.data.serviceOptions.forEach(item => {
							if (item.serviceCode === 101) {
								this.textNumStatus = item.status
							} else if (item.serviceCode === 102) {
								this.telNumStatus = item.status
							} else if (item.serviceCode === 103) {
								this.videoNumStatus = item.status
							}
						})
					}

				})
			},
			
			//完善个人资料
			gowsgrzl() {

			},
			goTuwen() {
				uni.navigateTo({
					url:'/pages2/pages/config/consult-text'
				});
			},
			goShipin() {
				uni.navigateTo({
					url:'/pages2/pages/config/consult-video'
				});
			},
			goSuiz() {
				uni.navigateTo({
					url:'/pages2/pages/config/consult-suiz'
				});
			},
			goDianhua() {
				uni.navigateTo({
					url:'/pages2/pages/config/consult-phone'
				});
			},
		}
	}
</script>

<style>
	.background {
		width: 100%;
		height: 458rpx;
		background: linear-gradient(180deg, #377EF5, #F1F3FD);
	}

	.top {
		position: relative;
		top: -383rpx;
	}

	.content {
		display: flex;
		flex-direction: column;

		background: #F2F4F6;
		height: 100vh;


	}

	.v-card {

		display: flex;
		flex-direction: column;

		width: 95vw;
		background-color: #FFFFFF;
		border: ;
		overflow: hidden;
		border-radius: 6px;

		margin: 20px 10px;

	}


	.v-home-head {
		position: relative;
		display: flex;
		flex-direction: row;
		align-items: center;

		background-color: #FFFFFF;
		border: ;
		overflow: hidden;

		margin-top: 30rpx;
		margin-bottom: 20rpx;


	}

	.v-home-bottom {
		display: flex;
		flex-direction: row;
		margin-left: 30rpx;
		margin-bottom: 30rpx;
		color: #97979F;
		font-size: 28rpx;
	}

	.v-home-head .v-right-head {
		display: flex;
		margin-left: 3vw;
		width: 100%;
		flex-direction: column;
		align-items: center;
	}

	.v-home-head .v-right-head .v-right-hor {
		display: flex;
		width: 100%;
		flex-direction: row;
		align-items: baseline;
	}

	.share {
		position: absolute;
		width: 98rpx;
		height: 52rpx;
		top: 0rpx;
		right: 22rpx;
		box-sizing: border-box;
		font-size: 24rpx;
		font-weight: 400;
		color: #0379FF;
		line-height: 50rpx;
		text-align: center;
		border: 1rpx solid #0379FF;
		border-radius: 4rpx;
	}

	.card-mid {
		width: 95vw;

		margin-left: 10px;
		margin-right: 10px;
		background: #FFFFFF;
		border-radius: 8rpx;
		margin-top: -160rpx;
		font-size: 28rpx;
		display: flex;
		flex-direction: column;

	}

	.itemviewcard {
		display: flex;
		flex-direction: column;
		background: white;
		border-radius: 8rpx;
		margin-left: 10px;
		margin-right: 10px;
	}

	.itemview {
		padding: 30rpx;
		display: flex;
		flex-direction: row;
		align-items: flex-start;
	}

	.content .v-home-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		overflow: hidden;
		width: 96%;
		background-color: #fff;
		margin-top: 10px;

		/* margin-left: 10px !important;
		margin-right: 10px !important;
		padding: 10px !important; */
		border: 1px solid #e6e6e6;
		border-radius: 5px;
	}

	.content .v-home-item .div-item-top {
		height: 50px;
		background-color: #F2F9FF;
		text-align: center;
		width: 100%;
		position: relative;
		border: 1px solid #e6e6e6;
		border-radius: 5px 5px 0 0;
	}

	.content .v-home-item .text-item {
		margin-top: 10px !important;
		margin-left: 10px !important;
		font-size: 14px;
		color: #333;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}

	.todo-back {
		display: flex;
		width: 100%;
		flex-direction: row;
		align-items: center;
		/* margin-top: 40rpx; */
		padding: 10rpx;
		/* margin-bottom: 40rpx; */
	}

	.todo-content {
		margin-right: 15rpx;
		margin-left: 20rpx;
		flex-direction: column;
		flex: 1;
	}

	.todo-button {
		margin-left: auto;
		width: 108rpx;
		margin-right: 10rpx;
		/* border-radius: 3rpx; */
		border-radius: 8rpx;
		border: 1px solid #007BF5;
		height: 48rpx;
		background-color: #007BF5;
		color: white;
		font-size: 24rpx;
		align-items: center;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.quit-main {
		margin-top: 45vh;
		margin-left: 25px;
		margin-right: 20px;
		background-color: white;
		width: 30%;
		height: 32px;
		background-color: #006EFF;
		/* border: 1px solid #006EFF; */
		border-radius: 10px;
	}

	.quit-main-text {
		display: flex;
		padding-top: 7px;
		justify-content: center;
		height: 32px;
		font-family: PingFangSC-Regular;
		font-size: 13px;
		color: #fff;
		letter-spacing: 0;
	}
</style>

<template>
	<view class="wrap">
		<u-sticky>
			<view class="content">
				<view style="font-size: 32rpx;color: #1A1A1A;font-weight: bold;margin-left: 25rpx;margin-top: 30rpx;">
					{{basePlanData.planName}}
				</view>
				<view class="process-kuang">
					<view style="margin-top: 44rpx;margin-left:30rpx;margin-right:30rpx;">

						<u-line-progress style="color:#D77311;" activeColor="#409EFF" :percentage="percentage"
							:showText="false" :height="7">
						</u-line-progress>


					</view>
					<view class="bottom-row">进行中{{basePlanData.finishedTask}}/{{basePlanData.totalTask}}</view>
				</view>


				<view style="margin-left: 28rpx;margin-top: 30rpx;color: #999999;font-size: 24rpx;">
					随访周期:&nbsp;{{basePlanData.beginDate}}-{{basePlanData.endDate}}</view>
				<view class="row-line"></view>
				<view style="margin-left: 28rpx;margin-top: 30rpx;color: #4D4D4D;font-size: 28rpx;">
					{{basePlanData.userInfo.userName}}&nbsp;|&nbsp;{{basePlanData.userInfo.userSex}}&nbsp;|&nbsp;{{basePlanData.userInfo.userAge}}岁
				</view>

				<view class="row-line"></view>
				<view
					style="margin-left: 28rpx;margin-top: 30rpx;margin-bottom: 25rpx;color: #4D4D4D;font-size: 28rpx;">
					{{day}}天内自动随访{{basePlanData.totalTask}}次,指导疾病康复情况
				</view>

			</view>
		</u-sticky>

		<view class="center-content">
			<view style="color: #4D4D4D;margin-left: 23rpx;margin-top: 30rpx;font-size: 30rpx;">编写随访小结</view>

			<view class="input">

				<u--textarea v-model="summary" :autoHeight="true" :border="false" :input-align="left" maxlength="200"
					placeholder="请输入具体小结内容">
				</u--textarea>
			</view>
		</view>

		<view class="bottom-content">

			<view class="left-button" @click="cancel()">
				<view style="text-align: center;padding-top: 12rpx;">取消</view>
			</view>

			<view class="right-button" @click="sendTopatient()">
				<view style="text-align: center; padding-top: 12rpx;">发送给患者</view>

			</view>



		</view>








	</view>



</template>

<script>
	export default {
		data() {
			return {

				bindId: '',
				planId: '',
				userId: '',
				percentage: 0,
				basePlanData: {},
				day: 0,
				summary: '',
				imGroupId: '',
				planName:'',
			}
		},

		onLoad(options) {
			console.log("GGG:", options)
			this.account = uni.getStorageSync('account')
			this.bindId = options.bindId
			this.planId = options.planId
			this.userId = options.userId
			this.imGroupId = options.imGroupId
			this.planName = options.planName
			this.qryExecFollowPlanBaseInfo()
			// this.qryMyExecFollowPlanDetailInfo()


		},




		methods: {

			// 查询随访基本信息
			qryExecFollowPlanBaseInfo() {
				uni.$u.http.post('/follow-api/docFollow/qryExecFollowPlanBaseInfo', {
					bindId: this.bindId,
					planId: this.planId,
					userId: this.userId
				}).then(res => {
					if (res.code === 0) {
						this.basePlanData = res.data
						if (this.basePlanData.finishedTask == this.basePlanData.totalTask) {
							this.percentage = 100
						} else {
							this.percentage = this.basePlanData.finishedTask * 10
						}


						if (this.basePlanData.endDate || this.basePlanData.beginDate) {
							var time2 = new Date(this.basePlanData.endDate).getTime()
							var time1 = new Date(this.basePlanData.beginDate).getTime()
							var diffTIme = (time2 - time1) / 1000

							this.day = diffTIme == 0 ? 1 : diffTIme / 86400
							console.log("333:", this.day)
						}

					}

				})
			},

			sendTopatient() {
				
				// 小结非空
				if(!this.summary){
						this.$u.toast("请输入小结内容!")
					return
				}
				
				
				uni.showLoading({
					title: '发送中'
				});
				const summaryMsgReq = {
					messageOriginalId: this.planId,
					sendMessage: this.summary,
					payLoad: JSON.stringify({
						data: JSON.stringify({
							description: '随访小结',
							id: this.planId,
							name: this.planName,
							type: 'CustomsummaryMessage',
							content: this.summary
							// bindId:this.bindId,
							// userId: this.userId
						}),
						extension: '',
						description: '随访小结'
					})
				};
				uni.setStorageSync('summaryMsgReq', summaryMsgReq);
				uni.$u.http.post('/medical-api/tlSendImMessageLog/addImMessageLog', {
					...uni.getStorageSync('summaryMsgReq'),
					messageType: 5,
					sendUserIds: [this.userId],
				}).then(res => {
					uni.hideLoading();
					uni.navigateTo({
						url: `/pages2/pages/TUI-Chat-Group2/chat?conversationID=GROUP${this.imGroupId}`
					});

				}).catch(err => {

				});

			},


			cancel() {
				uni.navigateBack({
					delta: 1
				});
			},




		}
	}
</script>

<style lang="scss">
	.wrap {
		width: 100%;
		height: 100%;
		background: #F5F5F5;
	}

	.content {
		// height: 300rpx;
		width: 100%;
		background-color: #FFFFFF;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		margin-top: 10rpx;
		flex-wrap: wrap;

		.bottom-row {
			display: flex;
			flex-direction: row;
			margin-left: 30rpx;
			color: #409EFF;
			font-size: 24rpx;
			margin-top: 18rpx;
		}

		.row-line {
			margin-left: 26rpx;
			margin-top: 20rpx;
			margin-right: 40rpx;

			// width: 100%;
			height: 1px;
			background: #E6E6E6;
		}



	}



	.center-content {
		width: 100%;
		display: flex;
		flex-direction: column;
		background: #FFFFFF;
		margin-top: 20rpx;
		padding-bottom: 30rpx;


		.input {
			// width: 100%;
			margin-left: 24rpx;
			margin-right: 24rpx;
			margin-top: 20rpx;
			height: 218px;
			background: #FFFFFF;
			border: 1px solid #E6E6E6;
		}



		.listinfo {
			width: 100%;
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;

			.left-content {
				width: 10%;
				margin-top: 10rpx;


				.roadis {
					margin-left: 30rpx;
					margin-top: 15rpx;
					width: 22rpx;
					height: 22rpx;
					background: #FFFFFF;
					border: 8rpx solid #409EFF;
					border-radius: 50%;
				}

				.colun-line {
					width: 2rpx;
					height: 100%;
					background: #409EFF;
					margin-left: 49rpx;
				}
			}

			.right-content {
				width: 85%;
				margin-top: 20rpx;
				margin-right: 24rpx;


				.row-top {
					display: flex;
					flex-direction: row;
					flex-wrap: wrap;
					align-items: center;
				}





				.kuang {
					width: 100%;
					background: #F5F5F5;
					border-radius: 8px;
					margin-top: 36rpx;
					display: flex;
					flex-direction: column;


					.item-content {
						display: flex;
						flex-direction: column;
						flex-wrap: wrap;
						margin-left: 30rpx;
						margin-top: 30rpx;
						color: #999999;



						.column-con {
							display: flex;
							flex-direction: column;

							.name {
								color: #1A1A1A;
								font-size: 28rpx;
								display: flex;
								flex-wrap: wrap;
								margin-top: 27rpx;
								margin-bottom: 29rpx;
								margin-right: 10rpx;
								text-align: justify
							}

							.rowline {
								height: 1px;
								margin-right: 30rpx;
								background: #CCCCCC;
							}
						}
					}





				}
			}
		}
	}


	.bottom-content {
		display: flex;
		flex-direction: row;
		width: 100%;
		height: 148rpx;
		background: #FFFFFF;


		.left-button {
			align-items: center;
			width: 308rpx;
			height: 68rpx;
			background: #FFFFFF;
			border: 2px solid #409EFF;
			border-radius: 34rpx;
			margin-left: 30rpx;
			color: #409EFF;
		}


		.right-button {
			align-items: center;
			width: 308rpx;
			height: 68rpx;
			background: #409EFF;
			border-radius: 34rpx;
			margin-left: 40rpx;
			color: #FFFFFF;
		}


	}








	.process-kuang {
		height: 60px;
		background: #F0F7FF;
		border-radius: 4px;
		margin-left: 30rpx;
		margin-right: 30rpx;
		margin-top: 30rpx;
	}
</style>

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
					<view class="bottom-row">进行中 {{basePlanData.finishedTask}}/{{basePlanData.totalTask}}</view>
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
					{{day}}天内自动随访{{basePlanData.totalTask}}次，指导疾病康复情况
				</view>
			</view>
		</u-sticky>


		<!-- 列表 -->

		<view class="center-content">

			<view style="margin-left: 30rpx;margin-top: 15rpx;"> 计划详情</view>

			<scroll-view scroll-y="true" style="height: 100vh;">
				<view class="listinfo" v-for="(item, index) in detailInfoList" :key="index">
					<view class="left-content">
						<view class="roadis">
						</view>
						<view class="colun-line"></view>
					</view>


					<view class="right-content">
						<view class="row-top">
							<view style="margin-left: 15rpx;">就诊后0天向患者发送</view>
							<view style="margin-left: auto;color: #999999;font-size: 26rpx;">
								{{item.day}}{{item.statusName}}
							</view>
						</view>
						<view class="kuang">
							<view class="item-content" v-for="(item2, index2) in item.details" :key="index2">
								<view style="display: flex;flex-direction: row;flex-wrap: wrap;height: 50rpx;">
									<view>{{item2.taskTypeshow||''}}</view>
									<view v-if="item2.taskBizStatus.value==2" style="color: #999999;margin-left: 56%;">
										√</view>
									<view style="color: #999999;margin-right: 30rpx;margin-left: auto;">
										{{item2.taskBizStatus.description||''}}
									</view>

								</view>

								<view class="column-con">
									<view class="name" @click="goSeek(item2)"
										:style="item2.taskType.value==1||item2.taskType.value==2?'color:#409EFF':'color:#1A1A1A'">
										{{item2.jumpTitle||''}}
									</view>
									<view class="rowline"></view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>

		</view>

		<view class="bottom-content">

			<view class="left-button" @click="goCall()">
				<view style="text-align: center;padding-top: 12rpx;">和患者沟通</view>
			</view>

			<view class="right-button">
				<view style="text-align: center; padding-top: 12rpx;" @click="goSummary()">随访小结</view>

			</view>



		</view>





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
				basePlanData: {},
				detailInfoList: [],
				percentage: 0,
				day: 0,
				imGroupId: '',

			}
		},

		onLoad(options) {

			this.account = uni.getStorageSync('account')
			console.log("VVV:", this.account)
			this.bindId = options.bindId
			this.planId = options.planId
			this.userId = options.userId
			this.qryExecFollowPlanBaseInfo()
			this.qryMyExecFollowPlanDetailInfo()


		},

		onReady() {

		},
		onShow() {},
		methods: {


			// 点击查看问卷  文章  xjw
			goSeek(item) {
				// 文章
				if (item.taskType.value == 2) {
					uni.navigateTo({
						url: `/pages2/pages/article/index?id=${item.jumpId}`
					});
					// 问卷
				} else if (item.taskType.value == 1) {
					uni.navigateTo({
						url: `/pages2/pages/TUI-User-Center/webview/webview?url=${item.jumpValue}&nav=${item.jumpTitle}`
					});
				}

			},


			// 查询随访基本信息
			qryExecFollowPlanBaseInfo() {
				uni.$u.http.post('/follow-api/docFollow/qryExecFollowPlanBaseInfo', {
					bindId: this.bindId,
					planId: this.planId,
					userId: this.userId
				}).then(res => {
					if (res.code === 0) {
						this.basePlanData = res.data
						this.imGroupId = res.data.imGroupId
						this.planName = res.data.planName
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


			// 查询我发放的随访计划的详细信息
			qryMyExecFollowPlanDetailInfo() {
				uni.$u.http.post('/follow-api/docFollow/qryMyExecFollowPlanDetailInfo', {
					bindId: this.bindId,
					planId: this.planId,
					userId: this.userId
				}).then(res => {
					if (res.code === 0) {
						this.detailInfoList = res.data
						if (this.detailInfoList && this.detailInfoList.length > 0) {
							this.detailInfoList.forEach((itemOut) => {
								if (itemOut.details) {
									itemOut.details.forEach((itemIn) => {
										this.$set(itemIn, 'taskTypeshow', this.getType(itemIn
											.taskType
											.value))
										console.log("111:", itemIn.taskType)

									})
								}

							})

						}

					}

				})
			},



			goSummary() {
				uni.navigateTo({
					url: '/pages2/pages/follow/followsummary?bindId=' + this.bindId + '&planId=' + this.planId +
						'&userId=' + this.userId + '&imGroupId=' + this.imGroupId + '&planName=' + this.planName,
				})
			},


			goCall(item) {
				uni.$u.http.post(`/medical-api/rightsUse/qryRightsUseRecordPageByDoc`, {
					docId: this.account.user.userId,
					flag: 1,
					orderId: "M_1733045904073502722"

				}).then(res => {

					if (res.code == 0) {
						if (res.data && res.data.rows) {
							var item = res.data.rows[0]
							this.onPatientItemClick(item)
						}

					}
				}).finally(() => {});
			},

			//点击患者
			onPatientItemClick(taskItem) {
				uni.setStorageSync('taskItem', taskItem);
				if (taskItem.status === 3) {
					uni.navigateTo({
						url: `/pages2/pages/TUI-Chat-Group2/chat?conversationID=GROUP${taskItem.imGroupId}`
					});
				} else {
					uni.navigateTo({
						url: `/pages2/pages/TUI-Group-History/chat?conversationID=GROUP${taskItem.imGroupId}`
					});
				}

			},





			getType(value) {
				if (value == 1) {
					return '问卷收集'
				} else if (value == 2) {
					return '健康宣教'
				} else {
					return '消息提醒'
				}

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
		padding-bottom: 100rpx;


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
		position: fixed;
		bottom: 0;
		left: 0;
		display: flex;
		flex-direction: row;
		width: 100%;
		height: 148rpx;
		background: #FFFFFF;
		box-shadow: 0px 4px 6px 0px rgba(153, 153, 153, 0.35);


		.left-button {
			align-items: center;
			width: 308rpx;
			height: 68rpx;
			background: #FFFFFF;
			border: 2px solid #409EFF;
			border-radius: 34rpx;
			margin-left: 30rpx;
			color: #409EFF;
			margin-top: 30rpx;
		}


		.right-button {
			align-items: center;
			width: 308rpx;
			height: 68rpx;
			background: #409EFF;
			border-radius: 34rpx;
			margin-left: 40rpx;
			color: #FFFFFF;
			margin-top: 30rpx;
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

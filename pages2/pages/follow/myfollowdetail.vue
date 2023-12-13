<template>
	<view class="wrap">
		<u-sticky>
			<view class="center-content">

				<view>
					<view class="content-row">
						<view
							style="color: #1A1A1A;font-size: 32rpx;margin-top: 30rpx;font-weight: bold;margin-left: 48rpx;">
							{{taskList.planName}}
						</view>
						<view style="margin-left: 48rpx;margin-top: 30rpx;color: #999999;font-size: 24rpx;">基准时间就诊后
						</view>
					</view>

					<view class="keshi">{{taskList.subjectName||'未知'}}</view>

					<view class="bottom-line"></view>

					<view style="color: #4D4D4D;margin-left: 48rpx;margin-top: 30rpx;padding-bottom: 30rpx;">
						{{taskList.taskDays}}天内自动随访{{taskList.taskCnt}}次
					</view>
				</view>
			</view>
		</u-sticky>


		<!-- 列表 -->

		<view class="center-content">

			<!-- <view style="margin-left: 30rpx;margin-top: 15rpx;"> 计划详情</view> -->
			<u-empty v-if="!taskList.nodes||taskList.nodes.length==0" icon="/static/img/icon_nodata.png" text="暂无数据">
			</u-empty>
			<scroll-view style="height: 1000vh" scroll-y="true" scroll-anchoring="true" v-else>
				<view class="listinfo" v-for="(item, index) in taskList.nodes" :key="index">
					<view class="left-content">
						<view class="roadis">
						</view>
						<view class="colun-line"></view>
					</view>


					<view class="right-content">
						<view class="row-top">
							<view style="margin-left: 15rpx;">就诊后</view>
							<view class="choose-days" @click="showPicker(item)">
								<view style="color: #409EFF;font-size: 30rpx;padding-top: 10rpx;">
									{{item.days||days}}{{item.unit||'天'}}
								</view>
								<u-icon class="icon" style="margin-top: -35rpx;justify-content: flex-end;"
									name="arrow-down" color="#1A1A1A" size="18"></u-icon>
							</view>
							<view>向患者发送</view>
						</view>
						<view class="kuang">
							<view class="item-content" v-for="(item2, index2) in item.tasks" :key="index2">
								<view
									style="display: flex;flex-direction: row;flex-wrap: wrap;height: 50rpx;margin-top: 25rpx;">
									<view>{{item2.typeDesc||''}}</view>
								</view>

								<view v-if="item2.jumpType==1||item2.jumpType==2" class="text-name" style="color:#409EFF;" @click="goSeek(item2)">
									{{item2.text||''}}
								</view>
								
								<view v-else  style="color: #1A1A1A;" class="text-name">
									{{item2.text||''}}
								</view>
								
								


								<view class="column-con">
									<view class="rowline"></view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>

		</view>


		<u-picker keyName="label" title="请选择" :show="show2" :columns="columns2" @cancel="cancel2" @confirm="confirm2">
		</u-picker>



		<view class="bottom-content">

			<view class="left-button" @click="favoriteClick()">
				<image v-if="!isCollect" style="width: 48rpx;height: 48rpx;" src="/static/static/images/jiahao.png">
				</image>
				<view v-if="!isCollect" style="color: #409EFF;font-size: 30rpx;">添加常用</view>

				<image v-if="isCollect" style="width: 48rpx;height: 48rpx;" src="/static/static/images/jianhao.png">
				</image>
				<view v-if="isCollect" style="color: #409EFF;font-size: 30rpx;">取消常用</view>
			</view>

			<view class="right-button">
				<view style="text-align: center; padding-top: 12rpx;" @click="goChoosePatient()">
					{{type=='chat'?'发送给患者':'选择患者'}}
				</view>
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
				days: 0,
				unit: '天',
				taskList: {},
				operFavoriteData: [], //收藏/取消收藏返回数据
				isCollect: true, //是否收藏
				show2: false,
				currentItem: {},
				type: '',
				columns2: [
					[{
							id: 62,
							label: '0'
						},
						{
							id: 4,
							label: '1'
						},
						{
							id: 5,
							label: '2'
						},
						{
							id: 6,
							label: '3'
						},
						{
							id: 7,
							label: '4'
						},
						{
							id: 31,
							label: '5'
						},
						{
							id: 7,
							label: '6'
						},
						{
							id: 8,
							label: '7'
						},
						{
							id: 9,
							label: '8'
						},
						{
							id: 10,
							label: '9'
						},
						{
							id: 11,
							label: '10'
						},
						{
							id: 12,
							label: '11'
						},
						{
							id: 13,
							label: '12'
						},
						{
							id: 14,
							label: '13'
						},
						{
							id: 15,
							label: '14'
						},
						{
							id: 16,
							label: '15'
						},
						{
							id: 17,
							label: '16'
						},
						{
							id: 18,
							label: '17'
						},
						{
							id: 19,
							label: '18'
						},

						{
							id: 20,
							label: '19'
						},
						{
							id: 21,
							label: '20'
						},
						{
							id: 22,
							label: '21'
						},
						{
							id: 23,
							label: '22'
						},
						{
							id: 24,
							label: '23'
						},
						{
							id: 25,
							label: '24'
						},
						{
							id: 26,
							label: '25'
						},
						{
							id: 27,
							label: '26'
						},
						{
							id: 28,
							label: '27'
						},
						{
							id: 29,
							label: '28'
						},
						{
							id: 30,
							label: '29'
						},
						{
							id: 31,
							label: '30'
						},
						{
							id: 32,
							label: '31'
						},
						{
							id: 33,
							label: '32'
						},
						{
							id: 34,
							label: '33'
						},
						{
							id: 35,
							label: '34'
						},
						{
							id: 36,
							label: '35'
						},
						{
							id: 37,
							label: '36'
						},
						{
							id: 38,
							label: '37'
						},
						{
							id: 39,
							label: '38'
						},
						{
							id: 40,
							label: '39'
						},
						{
							id: 41,
							label: '40'
						},
						{
							id: 42,
							label: '41'
						},
						{
							id: 43,
							label: '42'
						},
						{
							id: 44,
							label: '43'
						},
						{
							id: 45,
							label: '44'
						},
						{
							id: 46,
							label: '45'
						},
						{
							id: 47,
							label: '46'
						},
						{
							id: 48,
							label: '47'
						},
						{
							id: 49,
							label: '48'
						},
						{
							id: 50,
							label: '49'
						},
						{
							id: 51,
							label: '50'
						},
						{
							id: 52,
							label: '51'
						},
						{
							id: 53,
							label: '52'
						},
						{
							id: 54,
							label: '53'
						},
						{
							id: 55,
							label: '54'
						},
						{
							id: 56,
							label: '55'
						},
						{
							id: 57,
							label: '56'
						},
						{
							id: 58,
							label: '57'
						},
						{
							id: 59,
							label: '58'
						},
						{
							id: 60,
							label: '59'
						},
						{
							id: 61,
							label: '60'
						},

					],
					[{
						id: 0,
						label: '至'
					}],
					[{
							id: 1,
							label: '天'
						},
						{
							id: 2,
							label: '周'
						},
						{
							id: 3,
							label: '月'
						},

					]
				],


			}
		},

		onLoad(options) {

			this.account = uni.getStorageSync('account')
			this.planId = options.planId
			this.type = options.type
			this.userId = options.userId
			console.log("11111:", this.type, this.userId)
			this.qrytasks()
		},

		onReady() {

		},
		onShow() {},
		methods: {

			hideKeyboard() {
				uni.hideKeyboard();
			},

			// 点击查看问卷  文章  纯合
			goSeek(item) {
				// 文章
				if (item.jumpType == 2) {
					uni.navigateTo({
						url: `/pages2/pages/article/index?id=${item.jumpId}`
					});
					// 问卷
				} else if (item.jumpType == 1) {
					uni.navigateTo({
						url: `/pages2/pages/TUI-User-Center/webview/webview?url=${item.jumpValue}&nav=${item.text}`
					});
				}

			},







			// 查询随访基本信息
			qrytasks() {
				uni.$u.http.get('/follow-api/follow/plan/tasks', {
					params: {
						planId: this.planId,
					}
				}).then(res => {
					if (res.code === 0) {
						if (res.data) {
							this.taskList = res.data

							this.isCollect = this.taskList.favoriteStatus == 1
							if (this.taskList && this.taskList.nodes) {
								this.taskList.nodes.forEach(item => {

									this.$set(item, 'unit', this.getType1(item.unit));
									
									console.log("555:",item.unit)

									// if (item.unit == 1) {
									// 	this.unit = '天'
									// } else if (item.unit == 2) {
									// 	this.unit = '周'
									// } else {
									// 	this.unit = '月'
									// }

									// console.log("8888:", this.unit)
								})
							}
						}
					}

				})
			},


			getType1(value) {
				if (value == 1) {
					return '天'
				} else if (value == 2) {
					return '周'
				} else {
					return '月'
				}
			},


			operFavoriteOut(type) {
				uni.showLoading({
					title: '加载中...'
				});
				uni.$u.http.post('/follow-api/follow/plan/operFavorite', {
					operationType: type,
					planId: this.planId
				}).then(res => {
					uni.hideLoading()
					if (res.code === 0) {
						if (res.data) {
							this.operFavoriteData = res.data
						}
					}

				})
			},


			goChoosePatient() {
				if (this.type == 'chat') {
					const followMsgReq = {
						messageOriginalId: this.planId,
						sendMessage: this.taskList.planName,
						payLoad: JSON.stringify({
							data: JSON.stringify({
								description: '随访计划',
								id: this.planId,
								name: this.taskList.planName,
								type: 'CustomfollowMessage',
								// bindId:this.bindId,
								// userId: this.userId
							}),
							extension: '',
							description: '随访计划'
						})
					};
					uni.setStorageSync('followMsgReq', followMsgReq);

					uni.$u.http.post('/medical-api/tlSendImMessageLog/addImMessageLog', {
						...uni.getStorageSync('followMsgReq'),
						messageType: 4,
						sendUserIds: [this.userId]
					}).then(res => {
						uni.hideLoading();
						uni.showToast({
							title: '发送成功',
							icon: 'success'
						});
						setTimeout(() => {
							uni.navigateBack({
								delta: 2
							});
						}, 1500);
					}).catch(err => {});
				} else {
					const followMsgReq = {
						messageOriginalId: this.planId,
						sendMessage: this.taskList.planName,
						payLoad: JSON.stringify({
							data: JSON.stringify({
								description: '随访计划',
								id: this.planId,
								name: this.taskList.planName,
								type: 'CustomfollowMessage',
							}),
							extension: '',
							description: '随访计划'
						})
					};
					uni.setStorageSync('followMsgReq', followMsgReq);
					uni.navigateTo({
						url: '/pages3/pages/record/choose-patient?type=followMessage'
					});
				}

			},


			favoriteClick() {
				this.isCollect = !this.isCollect
				var type = this.isCollect ? 1 : 0
				console.log("CCC:", type)
				this.operFavoriteOut(type)

			},


			cancel2() {
				this.show2 = false;
			},
			confirm2(e) {
				this.cancel2();
				this.days = e.value[0].label;
				this.unit = e.value[2].label;
				var timeUnit = e.value[2].id
				console.log("555：", this.days, timeUnit)

				this.saveFollowPlanExecDateOut(this.days, timeUnit)
			},

			showPicker(item) {
				this.currentItem = item;
				this.show2 = true;
			},




			// 修改时间随访计划
			saveFollowPlanExecDateOut(time, timeunit) {
				uni.showLoading({
					title: '加载中...'
				});
				uni.$u.http.post('/follow-api/docFollow/saveFollowPlanExecDate', {
					taskIds: this.currentItem.taskIds,
					planId: this.planId,
					timeQuantity: time,
					timeUnit: timeunit
				}).then(res => {
					uni.hideLoading()
					if (res.code === 0) {

						// 刷新列表
						this.qrytasks()

						// if (res.data) {
						// 	this.operFavoriteData = res.data
						// }
					}

				})

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
		// padding-bottom: 100rpx;


		.keshi {
			width: 150rpx;
			height: 42rpx;
			background: #EFF6FF;
			color: #367BF5;
			border: 1px solid #3894FF;
			margin-top: 30rpx;
			border-radius: 2rpx;
			margin-left: 48rpx;
			margin-top: 15rpx;
			font-size: 22rpx;
			padding-left: 10rpx;
			padding-top: 10rpx;
			text-align: center;
			margin-top: 30rpx;
		}

		.bottom-line {
			margin-top: 28rpx;
			margin-left: 31rpx;
			background: #E6E6E6;
			margin-right: 30rpx;
			height: 1rpx;
		}



		.listinfo {
			width: 100%;
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			margin-top: 15rpx;

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
				margin-right: 24rpx;


				.choose-days {
					width: 118rpx;
					height: 60rpx;
					background: #FFFFFF;
					border: 2px solid #409EFF;
					border-radius: 30rpx;
					display: flex;
					flex-direction: row;
					flex-wrap: wrap;
					justify-content: center;


					.icon {
						padding-right: 6rpx;
						font-size: 28rpx;
						color: #FFFFFF;
						line-height: 34rpx;
					}
				}


				.row-top {
					display: flex;
					flex-direction: row;
					flex-wrap: wrap;
					align-items: center;
					margin-top: 10rpx;
				}





				.kuang {
					width: 100%;
					background: #F5F5F5;
					border-radius: 8px;
					margin-top: 15rpx;
					display: flex;
					flex-direction: column;


					.item-content {
						display: flex;
						flex-direction: column;
						flex-wrap: wrap;
						margin-left: 30rpx;
						// margin-top: 30rpx;
						color: #999999;

						.text-name {
							margin-bottom: 30rpx;
							margin-top: 15rpx;
							display: flex;
							flex-wrap: wrap;
							overflow-wrap: anywhere;
						}



						.text {
							margin-top: 30rpx;
							margin-bottom: 30rpx;
						}


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

			display: flex;
			flex-direction: column;
			margin-left: 24rpx;
			align-items: center;
			justify-content: center;
		}


		.right-button {
			align-items: center;
			width: 500rpx;
			height: 68rpx;
			background: #409EFF;
			border-radius: 34rpx;
			margin-left: 40rpx;
			color: #FFFFFF;
			margin-top: 40rpx;
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
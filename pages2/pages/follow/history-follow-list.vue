<template>


	<view class="content">
		<u-sticky style="top:0">
			<view class="topselect">
				<view>选择问卷:</view>
				<view @click="qestionSelectShow=true" class="selectclass">
					{{qestionTitle}}
					<u-icon name="arrow-down" color="#999" style="width: 22rpx;height: 12rpx;margin-top: 25rpx;">
					</u-icon>
				</view>

			</view>
		</u-sticky>
		<view v-if="taskList.length>0" class="v-home-item" v-for="(item, index) in taskList" :key="index">
			<view class="histitem" @click="goFollowDetail(item)">
				<view style="flex: 1;display: flex; flex-direction: row;">
					<view class="itemname">{{item.userName}}</view>
					<view class="itemname">{{item.sex}}</view>
					<view class="itemname">{{item.age}}岁</view>
				</view>

				<view style="flex: 1;display: flex;flex-direction: row-reverse;align-items: center;">
					<u-icon name="arrow-right" color="#999"
						style="width: 13rpx;height: 24rpx;margin-right: 32rpx;margin-left: 10rpx;"></u-icon>
					<view
						style="color: #999999;width: 290rpx;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-align: right;">
						{{item.questionnaireName}}
					</view>

				</view>


			</view>
		</view>
		<u-loadmore v-if="taskList.length>0" :status="status" color="#999999" />
		<u-empty class="empty" icon="/pages2/static/img/icon_nodata.png" v-if="noData" mode="history" text="暂无数据" />

		<u-picker :show="qestionSelectShow" @cancel="qestionSelectShow=false" :columns="qlist"
			@confirm="qestionSelectconfirm" keyName="questionnaireName"></u-picker>

		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				status: 'loadmore',

				noData: false,
				userId: '',
				showModal: false,
				showReason: false,
				showArea: false,
				modelReject: {
					reason: '',
					other: ''
				},

				currentItem: null,
				title: 'Hello',

				isToday: false,

				taskList: [],
				isCompleted: false,
				requestData: {
					userId: '',
					pageNo: 1,
					pageSize: 20,
					questionnaireId: '', //问卷ID
					userType: 'actualDoctor', //历史
				},
				qestionTitle: '全部',
				qestionSelectShow: false,
				qlist: [
					[{
						questionnaireId: "",
						questionnaireName: "全部"
					}]
				]
			}
		},

		onLoad() {

			this.account = uni.getStorageSync('account')

			this.requestData.userId = this.account.user.userId
			this.userId = this.account.user.userId
			//todo 测试用
			// this.userId = 617
			// this.requestData.userId = 617

			this.getQuestionnaireListForUserId()
			this.getData(true)
		},
		//下拉刷新监听
		onPullDownRefresh() {
			console.log('refresh');

			this.getData(true)
		},
		//加载更多
		onReachBottom() {
			if (this.isCompleted) return;
			this.status = 'loading';
			this.getData(false)

		},
		onReady() {

		},
		onShow() {

		},
		methods: {


			showSelect() {
				this.qestionSelectShow = true
			},
			qestionSelectconfirm(e) {
				console.log(e)
				this.qestionTitle = e.value[0].questionnaireName
				this.qestionSelectShow = false

				this.requestData.questionnaireId = e.value[0].questionnaireId

				uni.startPullDownRefresh();
			},
			goFollowDetail(item) {

				uni.navigateTo({
					url: './follow-detail?recordId=' + item.recordId + '&patientUserName=' + item.userName+'&questionnaireName='+item.questionnaireName
				})
			},

			getData(isRefresh) {
				if (isRefresh) {
					this.isCompleted = false
					this.requestData.pageNo = 1
					uni.showLoading({
						title: '加载中'
					})
				} else {
					this.requestData.pageNo = this.requestData.pageNo + 1
				}
				uni.$u.http.post('/follow-api/followPlanPhone/getFollowRecordListToPhone',
					this.requestData
				).then(res => {
					if (res.code == 0) {
						var list = res.data.records

						if (isRefresh) {
							this.taskList = list

						} else {
							this.taskList = [...this.taskList, ...list];
						}


						if (res.data.current >= res.data.pages) {
							this.isCompleted = true
							this.status = 'nomore';

						} else {
							this.status = 'loadmore';
						}


						this.noData = this.taskList.length === 0
					}
					uni.stopPullDownRefresh();
					uni.hideLoading()
				})
			},

			//获取问卷
			getQuestionnaireListForUserId() {

				uni.$u.http.post('/follow-api/followPlanPhone/getQuestionnaireListForUserId', {
					userId: this.userId,
					userType: "execDoctor"
				}).then(res => {
					if (res.code === 0) {
						res.data.unshift({
							questionnaireId: "",
							questionnaireName: "全部"
						})
						this.qlist = [res.data]
						console.log(this.qlist)
					}

				})
			},
		}
	}
</script>

<style>
	.topselect {
		display: flex;
		flex-direction: row;
		align-items: center;
		font-size: 28rpx;
		color: #4D4D4D;
		background-color: #FFFFFF;
		padding: 20rpx 23rpx;
	}

	.selectclass {
		flex: 1;
		margin-left: 9rpx;
		height: 60rpx;
		background: #FFFFFF;
		border: 1px solid #CCCCCC;
		border-radius: 4rpx;
		font-size: 28rpx;
		line-height: 60rpx;
		padding-left: 20rpx;
		padding-right: 23rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		color: #999999;
	}

	.content {
		display: flex;
		flex-direction: column;



	}

	.histitem {
		display: flex;
		flex-direction: row;
		align-items: center;
		height: 86rpx;
		font-size: 28rpx;
		color: #1A1A1A;
		border-bottom: 1rpx solid #E6E6E6;
		flex-shrink: 0;
		margin-bottom: 20rpx;
		margin-left: 23rpx;
		margin-right: 23rpx;
	}

	.itemname {
		margin-left: 19rpx;
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

	.normal {
		display: inline-block;
		height: 18px;
		color: #85888e;
		text-align: center;
		font-size: 13px;
		margin-left: 10px;
		padding: 2px 8px;
		border-radius: 5px;
		border: 1px #85888e solid;

	}

	.today {
		display: inline-block;
		height: 18px;
		color: #3894ff;
		text-align: center;
		font-size: 13px;
		margin-left: 10px;
		padding: 2px 8px;
		border-radius: 5px;
		border: 1px #3894ff solid;
	}

	.content>>>.reject-modal .u-modal__content {
		flex-direction: column !important;
	}

	.content>>>.reject-reason .uicon-close {
		display: none;
	}

	.empty {
		margin-top: 300rpx !important;
	}
</style>
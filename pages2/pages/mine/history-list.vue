<template>
	<view class="content">


		<view v-if="taskList.length>0" class="v-home-item" v-for="(item, index) in taskList" :key="index">
			<view class="div-item-top">
				<!-- <image src="/pages2/static/static/images/smile.png" -->
				<image :src="item.iconUrl"
					style="width: 30rpx;height: 30rpx;position: absolute;top: 50%;left:10px;transform: translate(0,-50%);">
				</image>
				<span
					style="font-size: 14px;position: absolute;top: 50%;left:60rpx;transform: translate(0,-50%);">{{item.appointItemName}}</span>
				
				<span @click="goHistoryPage(item)" style="color: #007BF5;font-size: 14px;top: 25%;right:25px;position: absolute;">历史记录</span>
				
				<view style="margin-top: 15px;margin-left: 95%;">
					
					<u-icon name="arrow-right"
								 style="width: 10px;height: 10px;color=#007BF5;"> 
								</u-icon>
				</view>
				
			
			</view>

			<view class="view-hor" style="display: flex;flex-direction: row;align-items: center;width: 100%;">
				<span
					style='font-size: 14px;color: #333;margin-top: 6px;margin-left: 10px !important;'>患者姓名：{{item.userName}}</span>
			</view>

			<view v-if="false" class="view-hor"
				style="display: flex;flex-direction: row;align-items: center;width: 100%;">
				<span
					style='font-size: 14px;color: #333;margin-top: 6px;margin-left: 10px !important;'>{{item.appointDeptName}}</span>
			</view>

			<!-- /* 自定义线条方向 */ -->
			<u-line style="margin-top: 10px;margin-left: 10px;margin-right: 10px;width: 96%;" direction="row"></u-line>
			<!-- <view style="margin-top: 10px;margin-left: 10px;margin-right: 10px;height: 1px;color: #006EFF;"></view> -->

			<view class="todo-back">
				<view class="todo-content">
					<view style="display: flex;flex-direction: row;">
						<view style='font-size: 14px;color: #333;margin-top: 6px;'>开始时间：</view>
						<view style='font-size: 14px;color: #333;margin-top: 6px;'>
							{{$u.timeFormat(item.appointDate, 'yyyy-mm-dd')}}
						</view>
					</view>
				</view>

			</view>
		</view>
		<u-loadmore v-if="taskList.length>0" :status="status" />
		<u-empty style="margin-top: 20%;" v-if="taskList.length == 0" mode="data" icon="/pages2/static/img/icon_nodata.png" :text="nodatatext" />


		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				status: 'loadmore',
				nodatatext:'加载中...',
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
					doctorId: '',
					pageNo: 1,
					pageSize: 15
				},
			}
		},
		onReachBottom() {
			if (this.isCompleted) return;
			this.status = 'loading';
			this.getData()

		},
		onLoad() {

			this.account = uni.getStorageSync('account')
			
			this.requestData.doctorId = this.account.user.userId

			this.getData()
		},
		onReady() {

		},
		onShow() {

		},
		methods: {




			goHistoryPage(item) {
				console.log(item)

				uni.navigateTo({
					url: '../TUI-Chat-History/chat?toUserID=' + item.userId + '&conversationName=' + item.userName
				})
			},

			getData() {
				if(this.account.roleName === 'nurse'){
					this.requestData.source='1'
				}
				uni.$u.http.post('/health-api/appoint/qryDoctorConsulation',
					this.requestData
				).then(res => {
					if (res.code === 0) {
						var list = res.data.rows
						list.forEach((item, index) => {
							if (item.appointItem === 'videoNum') {
								this.$set(item, 'iconUrl', '/pages2/static/static/images/videoNum.png')
							} else if (item.appointItem === 'telNum') {
								this.$set(item, 'iconUrl', '/pages2/static/static/images/telNum.png')
							} else if (item.appointItem === 'appointNum') {
								this.$set(item, 'iconUrl', '/pages2/static/static/images/appointNum.png')
							} else if (item.appointItem === 'textNum') {
								this.$set(item, 'iconUrl', '/pages2/static/static/images/textNum.png')
							} else {
								this.$set(item, 'iconUrl', '/pages2/static/static/images/textNum.png')
							}

						})
						this.taskList = [...this.taskList, ...list];

						if (res.data.pageNo >= res.data.totalPage) {
							this.isCompleted = true
							this.status = 'nomore';
						} else {
							this.status = 'loadmore';
						}
						this.requestData.pageNo = res.data.pageNo + 1
						if(this.taskList.length===0){
							this.nodatatext='暂无数据'
						}
					}

				})
			},


		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: #fff;
		justify-content: center;
		padding-bottom: 10px;

	}

	.content .v-home-head {
		display: flex;
		flex-direction: row;
		align-items: center;
		width: 95vw;
		background-color: #007BF5;
		border: ;
		overflow: hidden;
		border-radius: 6px;
		border: 1px solid #e6e6e6;
		margin: 10px 10px;
		height: 10vh;
	}

	.content .v-home-head .v-right-head {
		display: flex;
		margin-left: 3vw;
		width: 100%;
		flex-direction: column;
		align-items: center;
	}

	.content .v-home-head .v-right-head .v-right-hor {
		display: flex;
		width: 100%;
		flex-direction: row;
		align-items: baseline;
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

		/* &:hover {
			border: 1px #3894ff solid;
			color: #3894ff;
			cursor: pointer;
		} */
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
</style>

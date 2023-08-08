<template>
	<view class="content">
		<u-sticky style="top:0">
		<view style="display: flex; height: 82rpx;width: 750rpx; background: white;">
			<view class="top-screen" @click="showType = true">
				<view :style="recordType !='全部类型'?'color:#409EFF':'color:#4D4D4D'">{{recordType}}</view>
				<u-icon name="arrow-down" :color="recordType !='全部类型'?'#409EFF':'#4D4D4D'" style="margin-left: 8rpx;" />
			</view>
			<view style="background-color: #cccccc;width: 2rpx;height: 30rpx;margin-top: 26rpx;"></view>
			<view class="top-screen" @click="showTime = true">
				<view :style="recordStatus !='全部状态'?'color:#409EFF':'color:#4D4D4D'">{{recordStatus}}</view>
				<u-icon name="arrow-down" :color="recordStatus !='全部状态'?'#409EFF':'#4D4D4D'" style="margin-left: 8rpx;" />
			</view>
		</view>
		<view style="background-color: #E6E6E6;width: 750rpx;height: 0.5px;"></view>
		</u-sticky>
		<view v-if="taskList.length>0" class="v-home-item" v-for="(item, index) in taskList" :key="index" @click="goHistoryPage(item)">
			<view class="div-item-top">
				
				<image :src="item.iconUrl"
					style="width: 40rpx;height: 40rpx;margin-right: 21rpx;">
				</image>
				<span>{{item.serviceItemName}}</span>

			</view>

			<view class="view-hor" >
				患者姓名：{{item.userInfo.userName}}
			</view>

			<view  class="view-hor">
				开始时间：{{item.appointTime}}
			</view>

			<view style="background-color: #F2F2F2;width: 750rpx;height: 20rpx;"></view>
		</view>
		<u-loadmore v-if="taskList.length>0" :status="status" />
		<u-empty style="margin-top: 20%;" v-if="taskList.length == 0" mode="data" icon="/pages2/static/img/icon_nodata.png" :text="nodatatext" />

		<u-picker :show="showType" @cancel="showType=false" @confirm="typeConfirm" :columns="typeColumns" keyName="label"></u-picker>
		<u-picker :show="showTime" @cancel="showTime=false" @confirm="timeConfirm" :columns="timeColumns" keyName="label"></u-picker>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showType: false,
				showTime: false,
				recordType:'全部类型',
				recordStatus:'全部状态',
				typeColumns: [
					[{label: '全部类型',id: ''},{label: '图文问诊',id: 101},{label: '电话问诊',id: 102},{label: '视频问诊',id: 103}]
				],
				timeColumns: [
					[{label: '全部状态',id: ''},{label: '已结束',id: 4}]
				],
				status: 'loadmore',
				nodatatext: '加载中...',
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
					docId: '',
					serviceItemType:'',//咨询类型(101:图文咨询 102:电话咨询 103:视频咨询)
					status:4,//咨询状态(2:待接诊 3:接诊中 4:已完成)
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

			this.requestData.docId = this.account.user.userId

			this.getData(true)
		},
		onReady() {

		},
		onShow() {

		},
		methods: {
			//类型确定
			typeConfirm(e) {
				this.$data.showType = false
				console.log(e)
				
				if (this.requestData.serviceItemType == e.value[0].id) {
					return
				} else {
					this.$data.recordType = e.value[0].label
					this.requestData.serviceItemType=e.value[0].id
				}
				this.getData(true)

			},
			//状态确定
			timeConfirm(e) {
				this.$data.showTime = false
				console.log(e)
				
				if (this.$data.recordStatus == e.value[0].label) {
					return
				} else {
					this.$data.recordStatus = e.value[0].label
					this.requestData.status=e.value[0].id
				}
				this.getData(true)
			},


			goHistoryPage(item) {
				console.log(item)
				uni.setStorageSync('taskItem', item);
				uni.navigateTo({
					url: `/pages2/pages/TUI-Group-History/chat?conversationID=GROUP${item.imGroupId}`
				});
			},

			getData(refresh) {
				if (this.account.roleName === 'nurse') {
					return
				}
				if(refresh){
					this.isCompleted = false
					this.status = 'loadmore'
					this.nodatatext = '加载中...'
					this.taskList =[]
					this.requestData.pageNo=1 
				}
				uni.$u.http.post('/medical-api/rightsUse/qryRightsUseRecordPageByDoc',
					this.requestData
				).then(res => {
					if (res.code === 0) {
						var list = res.data.rows || []
						list.forEach((item, index) => {
							//咨询类型(101:图文咨询 102:电话咨询 103:视频咨询)
							if (item.serviceItemType === 103) {
								this.$set(item, 'iconUrl', '/pages2/static/static/images/videoNum.png')
							} else if (item.appointItem === 101) {
								this.$set(item, 'iconUrl', '/pages2/static/static/images/textNum.png')
							} else if (item.appointItem === 102) {
								this.$set(item, 'iconUrl', '/pages2/static/static/images/telNum.png')
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
						if (this.taskList.length === 0) {
							this.nodatatext = '暂无数据'
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

	.top-screen {
		display: flex;
		color: #4D4D4D;
		font-size: 30rpx;
		width: 50%;
		align-items: center;
		flex-direction: row;
		justify-content: center;
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
		
		justify-content: flex-start;
		overflow: hidden;
		width: 750rpx;
		background-color: #fff;
		
	}

	.content .v-home-item .div-item-top {
		margin-top: 25rpx;
		margin-bottom: 25rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		
		font-size: 32rpx;
		color: #4D4D4D;
		margin-left: 25rpx;
	}
	.content .v-home-item .view-hor{
		display: flex;
		flex-direction: row;
		align-items: center;
		font-size: 30rpx;
		color: #999999;
		margin-bottom: 25rpx;
		margin-left: 27rpx;
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

		/* .hover {
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

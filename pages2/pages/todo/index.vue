<template>
	<view class="content">
		<view class="v-home-head" v-if="false">
			<image src="/pages2/static/static/images/header.png" style="width: 120rpx;height: 100rpx;margin-left: 2vw;">
			</image>
			<view class="v-right-head">
				<view class="v-right-hor">
					<u--text :text="account.user.userName" color="white" size="18px"></u--text>
					<u--text :text="account.user.departmentName" color="white" size="14px"></u--text>
					<u--text :text="account.user.professionalTitle" color="white" size="14px"></u--text>
				</view>
				<u--text :text="account.user.hospitalName" color="white" size="14px"></u--text>
			</view>
		</view>

		<view style="width: 100%;margin-top: 28rpx;">
			<span style="float: left;margin-left: 10px;font-size: 16px;font-weight: bold;">我的待办</span>
			<view class="normal" :class="{today:isToday}" @tap="onTodayClick">今天</view>
		</view>

		<view v-if="taskList.length>0" class="v-home-item" v-for="(item, index) in taskList" :key="index">
			<view class="div-item-top">
				<!-- <image src="/pages2/static/static/images/smile.png" -->
				<!-- <image :src="item.iconUrl"
					style="width: 30rpx;height: 30rpx;position: absolute;top: 50%;left:10px;transform: translate(0,-50%);">
				</image> -->
				<view :style="item.taskDetail.execFlag ==0?'background: #E81313;':'background: #4FAB3D;'" style="width: 11px;height: 11px;border-radius: 50%;position: absolute;top: 20.5px;left:10px;"></view>
				<span
					style="font-size: 14px;position: absolute;top: 50%;left:60rpx;transform: translate(0,-50%);">{{item.taskDetail.rightsName}}</span>

				<u-icon name="arrow-right" color="#007BF5"
					style="width: 10px;height: 10px;position: absolute;top: 50%;right:10px;transform: translate(0,-50%);">
				</u-icon>
				<span @click="goHealthRecordPage(item)"
					style="color: #007BF5;font-size: 14px;position: absolute;top: 50%;right:25px;transform: translate(0,-50%);">患者详情</span>
			</view>
			
			<view class="view-hor" style="display: flex;flex-direction: row;align-items: center;width: 100%;" @click="onItemClick(item)">
				<span
					style='font-size: 14px;color: #333;margin-top: 6px;margin-left: 10px !important;'>{{item.taskDetail.userInfo.userName}}
					{{item.taskDetail.userInfo.userSex}} {{item.taskDetail.userInfo.userAge}}岁</span>
			</view>

			<!-- <view v-if="false" class="view-hor"
				style="display: flex;flex-direction: row;align-items: center;width: 100%;">
				<span
					style='font-size: 14px;color: #333;margin-top: 6px;margin-left: 10px !important;'>{{item.taskDescribe}}</span>
			</view> -->

			<!-- /* 自定义线条方向 */ -->
			<!-- <u-line style="margin-top: 10px;margin-left: 10px;margin-right: 10px;width: 96%;" direction="row"></u-line> -->
			

			<view class="todo-back" @click="onItemClick(item)">
				<view class="todo-content">
					<view style="display: flex;flex-direction: row;">
						<view style='font-size: 14px;color: #333;margin-top: 6px;'>开始时间 :</view>
						<view style='font-size: 14px;color: #CCCCCC;margin-top: 6px;margin-left: 5px;'>
							{{item.execTimeDate}}
						</view>
					</view>

					<view v-if="false" style="display: flex;flex-direction: row;">
						<view style='font-size: 14px;color: #333;margin-top: 6px;'>问诊时长 :
						</view>
						<view style='font-size: 14px;color: #CCCCCC;margin-top: 6px;margin-left: 5px;'>2022-02-1218:22
						</view>
					</view>
				</view>
				<view class="todo-button1" v-if="item.taskDetail.rightsType!='ICUConsultNum' && item.taskDetail.execFlag ==0" >
					待接诊
				</view>
				<view class="todo-button2" v-if="item.taskDetail.rightsType != 'ICUConsultNum'&& item.taskDetail.execFlag !=0" >
					进行中
				</view>
				<!-- <view class="todo-button" v-if="item.taskDetail.rightsType!='ICUConsultNum' && item.taskDetail.execFlag===0" @click="goReject(item)">
					拒诊
				</view>
				<view class="todo-button" v-if="item.taskDetail.rightsType != 'ICUConsultNum'" @click="goInquiry(item)">
					去接诊
				</view> -->
			</view>
		</view>

		<u-empty style="margin-top: 20%;" v-if="taskList.length == 0" mode="data" text="暂无待办任务" icon="/pages2/static/img/icon_nodata.png"/>
		
		<u-modal
			class="reject-modal"
			title="拒诊"
			:show="showModal"
			showCancelButton
			closeOnClickOverlay
			@confirm="confirmModal"
			@cancel="() => showModal = false"
			@close="() => showModal = false"
		>
			<u--form
				labelPosition="left"
				:model="modelReject"
				ref="form"
			>
				<u-form-item
					label="理由"
					prop="reason"
					@click="showReason = true; hideKeyboard()"
				>
					<u--input
						v-model="modelReject.reason"
						disabled
						disabledColor="#ffffff"
						placeholder="请选择拒诊理由"
						border="none"
					></u--input>
					<u-icon
						slot="right"
						name="arrow-right"
					></u-icon>
				</u-form-item>
				<u-form-item
					label="其他"
					prop="other"
					v-show="showArea"
				>
					<u--textarea
						placeholder="请输入"
						v-model="modelReject.other"
					></u--textarea>
				</u-form-item>
			</u--form>
		</u-modal>
		<u-action-sheet
			class="reject-reason"
			:show="showReason"
			:actions="actions"
			closeOnClickAction
			closeOnClickOverlay
			title="请选择拒诊理由"
			@select="reasonSelect"
			@close="() => showReason = false"
		>
		</u-action-sheet>
		<u-popup :show="detailPopShow" round="4px" mode="center" @close="detailPopShow=false">
			<view class="detailview">
				<view class="detailviewtitle">患者信息</view>
				
				<view style="overflow-y: auto;">
					<view class="detalviewtext" style="color: #1A1A1A;font-size: 30rpx;font-weight: bold;">基本信息</view>
					<text class="detalviewtext" decode>
						{{activeItem.taskDetail.userInfo.userName}}&emsp;{{activeItem.taskDetail.userInfo.userSex}}&emsp;{{activeItem.taskDetail.userInfo.userAge}}岁
					</text>
					<view class="detalviewtext" >挂号时间：{{formatDate(activeItem.taskDetail.execTime)}} {{activeDetail.dealResult}}</view>
					<view class="detalviewtext" >
						咨询类型：{{activeItem.taskDetail.rightsName}}
					</view>
					<view class="detalviewtext" style="color: #1A1A1A;font-size: 30rpx;font-weight: bold;">
						病情描述
					</view>
					<view class="detalviewtext" >{{activeDetail.dealDetail}}</view>
					<view class="detailviewimgview">
						<image @click="previewImageClick(item)" v-for="(item, index) in activeDetail.urls" :key="index" :src="item" style="width: 156rpx;height: 118rpx;margin-right: 10rpx;" ></image>
					
					</view>
				</view>
				
				<view class="popbtnview">
					<u-button type="default" style="width: 228rpx;margin-right: 0rpx;background-color: #E6E6E6;"
						text="拒诊" @click="goReject(activeItem)"></u-button>
					<u-button type="primary" style="width: 228rpx;" text="接诊" @click="goInquiry(activeItem)"></u-button>
				</view>
			</view>
		</u-popup>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				detailPopShow:false,
				activeItem:{taskDetail:{userInfo:{}}},
				activeDetail:{},
				showModal: false,
				showReason: false,
				showArea: false,
				modelReject: {
					reason: '',
					other: ''
				},
				actions: [{
						name: '抱歉，没有接诊时间',
					},
					{
						name: '不对症状，请选择其他医生',
					},
					{
						name: '建议线下就诊',
					},
					{
						name: '其他',
					}
				],
				rules: {
					reason: {
						type: 'string',
						required: true,
						message: '请选择拒诊理由',
						trigger: ['blur', 'change']
					},
					other: [{
						type: 'string',
						// required: true,
						message: '请填写其他理由',
						trigger: ['blur', 'change']
					}, {
						// 此为同步验证，可以直接返回true或者false，如果是异步验证，稍微不同，见下方说明
						validator: (rule, value, callback) => {
							// 调用uView自带的js验证规则，详见：https://www.uviewui.com/js/test.html
							if (this.showArea){
								return !!value
							}
							return true
						},
						message: "拒诊理由是其他时，请填写其他理由",
						// 触发器可以同时用blur和change，二者之间用英文逗号隔开
						trigger: ["change", "blur"]
					}],
				},
				currentItem: null,
				title: 'Hello',
				account: {
					name: '李雅',
					dept: '精神科',
					pos: '主治医师',
					hos: '中南大学湘雅二医院',
					disease: '疾病: 青少年精神障碍',
				},
				isToday: false,

				taskList: [],

				requestData: {
					execFlag: '0',
					taskType: '9',
					userId: '',
					execTime: '',
				},
			}
		},
		onLoad() {
			// uni.$u.http.get('/health-api/health/patient/getUserTask', {
			// 	execFlag: '',
			// }).then(res => {
			// 	uni.setStorageSync('token', res.data.jwt); //存数据
			// 	console.log('res', res)
			// })

			this.account = uni.getStorageSync('account')
			this.requestData.userId = this.account.user.userId
			this.todayStr = this.formatDate(new Date())
			this.getData()
		},
		onReady() {
			// this.$refs.form.setRules(this.rules)
		},
		onShow() {
			this.getData()
		},
		methods: {
			onTodayClick() {
				this.isToday = !this.isToday
				if (this.isToday) {
					this.requestData.execTime = this.todayStr
				} else {
					this.requestData.execTime = ''
				}
				this.getData()

			},
			jump() {
				// uni.redirectTo({
				// 	url: '/pages/tab/index'
				// });

				uni.switchTab({
					url: '/pages/tab/index'
				});
			},

			goHealthRecordPage(item) {
				console.log(item)
				uni.navigateTo({

					url: '../record/index?userId=' + item.taskDetail.userId

				})
			},

			getData() {
				uni.$u.http.get('/health-api/health/patient/getUserTask', {
					params: this.requestData
				}).then(res => {
					this.taskList = res.data
					this.taskList.forEach((item, index) => {
						if (item.taskDetail.rightsType === 'videoNum') {
							this.$set(item, 'iconUrl', '/pages2/static/static/images/videoNum.png')
						} else if (item.taskDetail.rightsType === 'telNum') {
							this.$set(item, 'iconUrl', '/pages2/static/static/images/telNum.png')
						} else if (item.taskDetail.rightsType === 'appointNum') {
							this.$set(item, 'iconUrl', '/pages2/static/static/images/appointNum.png')
						} else if (item.taskDetail.rightsType === 'textNum') {
							this.$set(item, 'iconUrl', '/pages2/static/static/images/textNum.png')
						} else {
							this.$set(item, 'iconUrl', '/pages2/static/static/images/textNum.png')
						}
						this.$set(item, 'execTimeDate', this.formatDateFull(item.execTime))
					})
				})
			},
			
			//卡片被点击 
			onItemClick(item){
				if(item.taskDetail.rightsType=='ICUConsultNum'){
					return
				}
				if(item.taskDetail.execFlag == 0){
					//查看患者填写的资料 可拒绝问诊和去接诊
					this.showDetailPop(item)
				}else{
					this.goInquiry(item)
				}
			},
			
			goInquiry(item) {
				uni.setStorageSync('taskItem', item);
				if ((item.taskDetail.rightsType==='textNum' || item.taskDetail.rightsType==='appointNum') && item.taskDetail.execFlag===0) {
					uni.$u.http.post('/health-api/patient/updateRightsRequestTime', {
						execTime: uni.$u.timeFormat(new Date().getTime(), 'yyyy-mm-dd hh:MM:ss'),
						tradeId: item.taskDetail.tradeId,
						userId: item.taskDetail.userId,
					}).then(res => {
						uni.navigateTo({
							url: `/pages2/pages/TUI-Chat/chat?conversationID=C2C${item.taskDetail.userInfo.userId}`
						});
					});
				}else {
					uni.navigateTo({
						url: `/pages2/pages/TUI-Chat/chat?conversationID=C2C${item.taskDetail.userInfo.userId}`
					});
				}
				this.detailPopShow=false
			},
			//查看患者填写的资料 可拒绝问诊和去接诊
			showDetailPop(item){
				this.activeItem=item
				
				uni.showLoading({
					title:'正在加载'
				})
				uni.$u.http.get('/health-api/patient/qryRightsUserLog', {params: {
					dealType: 'REQUEST_DATA',
					tradeId: item.taskDetail.tradeId,
					userId: item.taskDetail.userId,
				}					
				}).then(res => {
					uni.hideLoading()
					
					this.activeDetail=res.data[0]
					this.activeDetail.urls=this.activeDetail.dealImages.split(',')
					console.log(this.activeDetail)
					this.detailPopShow=true
				});
			},
			previewImageClick(currentUrl){
				uni.previewImage({
					current:currentUrl,
					urls:this.activeDetail.urls,
					indicator:'number'
				})
			},
			formatDate(date) {
				date = new Date(date)
				let myyear = date.getFullYear()
				let mymonth = date.getMonth() + 1
				let myweekday = date.getDate()
				mymonth < 10 ? (mymonth = '0' + mymonth) : mymonth
				myweekday < 10 ? (myweekday = '0' + myweekday) : myweekday
				return `${myyear}-${mymonth}-${myweekday}`
			},
			formatDateFull(date) {
				date = new Date(date)
				let myyear = date.getFullYear()
				let mymonth = date.getMonth() + 1
				let myweekday = date.getDate()
				let oHour = date.getHours()
				let oMin = date.getMinutes()
				let oSen = date.getSeconds()
				mymonth < 10 ? (mymonth = '0' + mymonth) : mymonth
				myweekday < 10 ? (myweekday = '0' + myweekday) : myweekday
				oHour < 10 ? (oHour = '0' + oHour) : oHour
				oMin < 10 ? (oMin = '0' + oMin) : oMin
				oSen < 10 ? (oSen = '0' + oSen) : oSen
				return `${myyear}-${mymonth}-${myweekday} ${oHour}:${oMin}:${oSen}`
			},
			
			goReject(item) {
				this.showModal = true
				this.detailPopShow=false
				this.showArea = false
				this.currentItem = item
				this.modelReject = {
					reason: '',
					other: ''
				}
				this.$nextTick(() => {
					this.$refs.form.setRules(this.rules)
				})
			},
			confirmModal() {
				this.submit()
			},
			hideKeyboard() {
				uni.hideKeyboard()
			},
			reasonSelect(e) {
				this.$set(this.modelReject, 'reason', e.name)
				if (this.modelReject.reason === '其他'){
					this.showArea = true
				}else {
					this.showArea = false
				}
			},
			submit() {
				this.$refs.form.validate().then(res => {
					const account = uni.getStorageSync('account')
					uni.$u.http.post('/health-api/patient/saveRightsUseRecord', {
						deptName: account.user.departmentName,
						execDept: account.user.departmentId,
						execFlag: 3,
						execUser: account.user.userId,
						execTime: uni.$u.timeFormat(this.currentItem.execTime, 'yyyy-mm-dd hh:MM:ss'),
						id: this.currentItem.taskDetail.id,
						rightsId: this.currentItem.taskDetail.rightsId,
						rightsName: this.currentItem.taskDetail.rightsName,
						rightsType: this.currentItem.taskDetail.rightsType,
						statusDescribe: '拒绝问诊',
						remark: this.modelReject.reason === '其他' ? this.modelReject.other : this.modelReject.reason,
						tradeId: this.currentItem.taskDetail.tradeId,
						userId: this.currentItem.taskDetail.userId,
						taskId: this.currentItem.id
					}).then(res => {
						uni.$u.toast('拒诊成功')
						this.showModal = false
						this.getData()
					})
				});
			}
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
		border: 1px solid rgba(204,204,204,0.35);
		border-radius: 5px;
	}

	.content .v-home-item .div-item-top {
		height: 50px;
		background-color: #F7F7F7;
		text-align: center;
		width: 100%;
		position: relative;
		border-bottom: 1px solid rgba(204,204,204,0.35);
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
.todo-button1 {
		margin-left: auto;
		margin-top: -50rpx;
		width: 120rpx;
		margin-right: 15rpx;
		/* border-radius: 3rpx; */
		border-radius: 8rpx;
		
		height: 48rpx;
		background-color: #FFEBEB;
		color: #E81313;
		font-size: 24rpx;
		align-items: center;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	.todo-button2 {
			margin-left: auto;
			margin-top: -50rpx;
			width: 120rpx;
			margin-right: 15rpx;
			/* border-radius: 3rpx; */
			border-radius: 8rpx;
			
			height: 48rpx;
			background-color: #E1F2DE;
			color: #4FAB3D;
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

/* 		&:hover {
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
	
	.content>>> .reject-modal .u-modal__content {
		flex-direction: column !important;
	}
	.content>>> .reject-reason .uicon-close {
		display: none;
	}
	.detailview {
		display: flex;
		flex-direction: column;
		width: 548rpx;
		max-height: 1200rpx;
	}
	
	.detailviewtitle {
		height: 80rpx;
		background: #409EFF;
		border-radius: 4px 4px 0 0;
		width: 100%;
		color: white;
		text-align: center;
		line-height: 80rpx;
		font-size: 32rpx;
	}
	
	.detalviewtext {
		display: flex;
		flex-direction: row;
		padding-left: 30rpx;
		padding-right: 30rpx;
		padding-top: 20rpx;
		font-size: 28rpx;
		color: #4D4D4D;
	}
	.popbtnview {
		align-items: center;
		display: flex;
		justify-content: center;
	
		margin-top: 30rpx;
		margin-bottom: 30rpx;
		
	
		width: 100%;
	}
	.detailviewimgview{
		padding-left: 30rpx;
		
		padding-top: 30rpx;
	}
	
</style>

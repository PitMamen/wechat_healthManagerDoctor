<template>


	<view class="content">
		<u-sticky style="top:0"  v-if="account && account.accountId && account.bindStatus == 0">
			<view class="topselect" @click="popWindowShow=true">

				<image src="/static/static/images/icon_shaixuan.png"
					style="width: 24rpx;height: 26rpx;margin-left: 10rpx;"></image>
				<view>筛选</view>
			</view>
			<view style="width: 100%;height: 1rpx;background-color: #eeeeee;"></view>
		</u-sticky>
		
		<view class="identyView" v-else @click="goIdentify">
			<view class="identyitem">
				<view>您可以进行实名认证</view>
				<view style="margin-top: 33rpx;font-size: 28rpx;color: #AED3FF;">实名认证通过后可以使用更多功能</view>
			</view>
			<view class="identyright">
				<view>实名认证</view>
			</view>
		</view>
		
		<view v-if="taskList.length>0" class="carditem" v-for="(item, index) in taskList" :key="index">

			<view class="histitem">

				<image
					:src="item.sex=='男'?'https://hmg.mclouds.org.cn/content-api/file/F20230901104620552ZAFKPPDHICNEOX-follow_icon_nan.png':'https://hmg.mclouds.org.cn/content-api/file/F20230901104637129JKWMLVJEEVJFVF-follow_icon_nv.png'"
					style="width: 82rpx;height: 82rpx;"></image>
				<view style="flex:1; display: flex; flex-direction: column;margin-left: 21rpx;">
					<view style="color: #1A1A1A;font-size: 30rpx;">{{item.userName}}</view>
					<text style="color: #999999;font-size: 24rpx;margin-top: 13rpx;"
						decode>{{item.sex}}&ensp;|&ensp;{{item.age}}岁</text>

				</view>
				<image v-if="item.hangStatus && item.hangStatus == 1" src="/static/static/images/icon_zangua.png"
					style="width: 83rpx;height: 71rpx;position: absolute;right: 296rpx;"></image>
				<view style="color:#409EFF;" @click="showPatientDetail(item)">患者详情</view>
				<u-icon name="arrow-right" color="#999999" style="margin-left: 9rpx;"></u-icon>
			</view>
			<view style="width: 100%;height: 1rpx;background-color: #eeeeee;"></view>
			<view class="qustionitem" @click="goFollowDetail(item)">
				<view>{{item.questionnaireName}}</view>
				<view>{{item.cysj}}</view>
			</view>
			<view style="width: 100%;height: 1rpx;background-color: #eeeeee;"></view>
			<view class="phoneitem">
				<view style="flex: 1;"></view>
				<view class="u-page__button-item" style="margin-right: 20rpx;">
					<u-button type="primary" size="normal" style=";" text="呼叫本人"
						@click="item.tel?goFollowPhone(item,item.tel):''"></u-button>
					<!-- 						@click="item.tel?goFollowPhone(item,item.tel):''"></u-button> -->
				</view>
				<view class="u-page__button-item">
					<u-button plain size="normal"
						style=" border-color: #4EA773;background-color: #F7FFFA;color: #139248;margin-right: 20rpx;"
						text="呼叫紧急联系人" @click="item.urgentTel?goFollowPhone(item,item.urgentTel):callUrgentTelEmpty()">
					</u-button>
				</view>


			</view>
			<view style="width: 100%;height: 20rpx;background-color: #F2F2F2;"></view>
		</view>



		<u-loadmore v-if="taskList.length>0" :status="status" color="#999999" />
		<u-empty class="empty" v-if="noData" mode="history" icon="/static/img/icon_nodata.png" text="暂无数据" />

		<u-picker :show="qestionSelectShow" @cancel="qestionSelectShow=false" :columns="qlist"
			@confirm="qestionSelectconfirm" keyName="questionnaireName"></u-picker>
		<u-popup :show="popWindowShow" mode="right" @close="onPopClose" @open="onPopOpen" customStyle="width: 662rpx;">
			<scroll-view scroll-y="true" style="height: 100vh;">
				<view class="popview">
					<view class="poptitle" style="margin-top: 0rpx;">暂挂</view>
					<view class="label-item-box">
						<view :class="zanguaActive==1?'label-item active':'label-item'"
							style="width: 160rpx;padding: 20rpx 0rpx;" @click="checkGuaYesTap">
							<view>是</view>
						</view>

						<view :class="zanguaActive==0?'label-item active':'label-item'"
							style="width: 160rpx;padding: 20rpx 0rpx;" @click="checkGuaNoTap">
							<view>否</view>
						</view>
					</view>

					<view class="poptitle">选择时间</view>
					<view class="label-item-box" style="align-items: center; margin-top: 20rpx;">
						<view class="label-item" style="width: 280rpx;padding: 20rpx 0rpx;margin:  0;"
							:style="checkTime.start?'color:#409EFF':'color:#4D4D4D'" @click="datetimeShow=true">
							<view>{{checkTime.start?formatFullDate1(checkTime.start) : '出院开始时间'}}</view>
						</view>
						<view
							style="height: 2rpx;width: 16rpx;background-color: #999999;margin-left: 10rpx;margin-right: 10rpx;">
						</view>
						<view class="label-item" style="width: 280rpx;padding: 20rpx 0rpx;margin:  0;"
							:style="checkTime.end?'color:#409EFF':'color:#4D4D4D'" @click="datetimeShow2=true">
							<view>{{checkTime.end?formatFullDate1(checkTime.end) : '出院结束时间'}}</view>
						</view>
					</view>

					<view class="poptitle">选择科室</view>
					<view class="label-item-box" style="max-height: 800rpx;overflow-y: auto;">
						<view :class="dptActive==index?'label-item active':'label-item'"
							v-for="(item, index) in dptlist" :key="index" @click="checkDptTap(item,index)">
							<view>{{item.department_name}}</view>
						</view>
					</view>

					<view class="poptitle">选择问卷</view>
					<view class="label-item-box" style="max-height: 800rpx;overflow-y: auto;">
						<view :class="questionActive==index?'label-item active':'label-item'"
							v-for="(item, index) in qlist" :key="index" @click="checkQestionTap(item,index)">
							<view>{{item.questionnaireName}}</view>
						</view>
					</view>

					<view style="height: 98rpx;"> </view>
					<view class="popbtnview">
						<!-- <view class="label-item-box"> -->
						<u-button type="default" style="width: 228rpx;margin-right: 40rpx;background-color: #E6E6E6;"
							text="重置" @click="btnReset"></u-button>
						<u-button type="primary" style="width: 228rpx;" text="确定" @click="btnConfirm"></u-button>
					</view>
				</view>
			</scroll-view>
		</u-popup>
		<u-datetime-picker :show="datetimeShow" v-model="datestart" :maxDate="maxDate" mode="date"
			@cancel="datetimeShow=false" @confirm="dateConfirm"></u-datetime-picker>
		<u-datetime-picker :show="datetimeShow2" v-model="datestart" :maxDate="maxDate" mode="date"
			@cancel="datetimeShow2=false" @confirm="dateConfirm2"></u-datetime-picker>

		<u-popup :show="detailPopShow" round="4px" mode="center">
			<view class="detailview">
				<view class="detailviewtitle">患者详情</view>

				<view style="overflow-y: auto;" @touchmove.stop @touch.stop>
					<view class="detalviewtext" v-for="(item, index) in filedList" :key="index">
						<view style="color: #1A1A1A;flex: 1;">{{item.fieldComment}}: </view>
						<view style="color: #999999;flex: 1.4;">{{item.fieldValue}}</view>
					</view>
				</view>

				<view class="detailbtn" @click="detailPopShow=false">关闭</view>
			</view>
		</u-popup>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				account: {
					user: {}
				},
				status: 'loadmore',
				noData: false,
				popWindowShow: false,
				userId: '',
				showModal: false,
				showReason: false,
				isSDKReady: false,
				phone: '',
				recordId: '',
				showArea: false,
				modelReject: {
					reason: '',
					other: ''
				},

				currentItem: null,
				title: 'Hello',

				isToday: false,

				taskList: [],
				callers: [],
				isCompleted: false,
				requestData: {
					userId: '',
					executeDepartmentIds: [],
					pageNo: 1,
					pageSize: 20,
					questionnaireId: '', //问卷ID
					userType: 'execDoctor', //待随访
					hangStatus: '', //暂挂电话随访挂起状态：0:否；1:是
					cysjStart: '', //出院开始时间
					cysjEnd: '', //出院结束时间
				},
				qestionTitle: '全部',
				qestionSelectShow: false,
				qlist: [],
				dptlist: [],
				questionActive: -1, //问卷
				dptActive: -1, //问卷
				checkTime: {
					start: '',
					end: ''
				},
				zanguaActive: -1, //暂挂
				datetimeShow: false,
				datetimeShow2: false,
				maxDate: '',
				datestart: '',
				detailPopShow: false, //患者详情
				filedList: [], //患者详情字段集
				patientActive: -1, //上一次选择的患者
			}
		},

		onLoad() {

			this.account = uni.getStorageSync('account')


			this.requestData.userId = this.account.user.userId
			this.userId = this.account.user.userId
			//todo 测试用
			// this.userId = 947
			// this.requestData.userId = 947

			this.maxDate = new Date().getTime()
			this.datestart = new Date().getTime()

			this.getQuestionnaireListForUserId()
			// this.getData(true)
			this.getDeptData()

			let that = this
			uni.$on('FollowUpdate', function(data) {
				console.log('监听到事件来自 FollowUpdate ，携带参数 msg 为：' + data.msg);
				that.getData(true)
			})

			uni.$u.http.get('/account-api/accountParamInfo/getAccountParam/follow_caller_phone', {}).then(res => {
				if (res.code == 0) {
					that.callers = res.data
					if (that.callers.length > 0) {
						// that.goInitTccc()
					}
				}
			})
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
			this.getData(true)
			this.refreshBindStatus();
		},
		onUnload() {
			//取消监听
			uni.$off('FollowUpdate')
		},
		methods: {
			// goInitTccc() {
			// 	let that = this
			// 	uni.$u.http.post('/follow-api/follow/ccc/createSdkLoginToken', {}).then(res => {
			// 		if (res.code == 0) {
			// 			that.injectTcccWebSDK(res.data.sdkURL)
			// 		}
			// 	})
			// },

			// injectTcccWebSDK(sdkURL) {
			// 	let that = this
			// 	return new Promise(function(resolve) {
			// 		const script = document.createElement('script')
			// 		script.setAttribute('crossorigin', 'anonymous')
			// 		script.src = sdkURL
			// 		document.body.appendChild(script)
			// 		script.addEventListener('load', function() {
			// 			// 加载JS SDK文件成功，此时可使用全局变量"tccc"
			// 			tccc.on(tccc.events.ready, function() {
			// 				/**
			// 				 * Tccc SDK初始化成功，此时可调用外呼等功能。
			// 				 * 注意：请确保只初始化一次SDK
			// 				 * */

			// 				tccc.UI.hideWorkbench() //隐藏工作台
			// 				tccc.UI.hidefloatButton() //隐藏悬浮按钮
			// 				tccc.overrideButtonConfig((config) => {
			// 					console.log('call config ', config)
			// 					return {
			// 						active: config.active.filter(
			// 							(c) =>
			// 							![
			// 								'transferSeat',
			// 								'transferSkillGroup',
			// 								'holdToggle',
			// 								'forwardOut',
			// 								'showKeyboard',
			// 								'selfService',
			// 							].includes(c.type)
			// 						),
			// 					}
			// 				})

			// 				that.isSDKReady = true
			// 				console.log('云呼叫初始化成功 Agent', tccc.Agent)

			// 				resolve('初始化成功')
			// 				// this.$message.success('初始化成功')
			// 			})

			// 			tccc.on(tccc.events.sessionEnded, function(data) {
			// 				/**
			// 				 *  监听挂断
			// 				 * */

			// 				// tccc.Agent.offline()

			// 				console.log('云呼叫挂断 sessionEnded', data)
			// 			})
			// 		})
			// 	})
			// },
			/**
			 * auditStatus  0待完善/1审核中/2审核通过/3审核不通过
			 * 1、3有单独两个页面展示；0为提交一个页面为待完善，直接进基础页面；2审核通过后就没有入口看不见了
			 */
			goIdentify() {
				uni.$u.http.get('/account-api/accountInfo/getDoctorAuthStatus', {
					params: {}
				}).then(res => {
					if (res.code == 0) {
						if (res.data.auditStatus == 1) { //审核中
							uni.navigateTo({
								url: '/pages2/pages/mine/identify-result?type=1&jumpFrom=1'
							})
						} else if (res.data.auditStatus == 3) { //审核不通过
							uni.navigateTo({
								url: '/pages2/pages/mine/identify-result?type=2&jumpFrom=1'
							})
						} else { // 0待完善   进去后查询数据来确定填充信息还是完全的新增
							uni.navigateTo({
								url: '/pages2/pages/mine/identify-base'
							})
						}

					} else {
						this.$u.toast(res.message)
					}

				}).finally(() => {
					uni.hideLoading();
				});
			},
			
			refreshBindStatus(){
				uni.$u.http.get('/account-api/accountInfo/getDoctorAuthStatus', {
					params: {}
				}).then(res => {
					if (res.code == 0) {
						this.account.bindStatus =res.data.bindStatus
					} else {
						this.$u.toast(res.message)
					}
				
				}).finally(() => {
					uni.hideLoading();
				});
			},
			goCall(phone, recordId, item) {
				debugger
				console.log('goCall 1')
				if (this.callers.length > 0) {
					// if (!this.isSDKReady) {
					// 	// uni.showLoading({
					// 	// 	title:'初始化'
					// 	// })
					// 	uni.$u.toast('正在初始化...');
					// 	return
					// }
					uni.navigateTo({
						url: '/pages2/pages/follow/follow-phone?recordId=' + item.recordId + '&executeDepartmentId=' + item
							.executeDepartmentId + '&patientUserName=' + item.userName + '&patientUserId=' + item
							.userId + '&hangStatus=' + item.hangStatus
					})
					this.phone = phone
					this.recordId = recordId
					console.log('goCall 2')
					console.log('account', this.account)
					let wxUserId = this.account.user.accountId + "@bitvalue.com.cn"
					this.startOutboundCall(phone, wxUserId, recordId)
				} else {
					uni.navigateTo({
						url: '/pages2/pages/follow/follow-phone?recordId=' + item.recordId + '&executeDepartmentId=' + item
							.executeDepartmentId + '&patientUserName=' + item.userName + '&patientUserId=' + item
							.userId + '&hangStatus=' + item.hangStatus
					})
					uni.makePhoneCall({
						phoneNumber: phone,
						success: function(res) {
							console.log('makePhoneCall success', res)
						},
						fail: function(res) {
							console.log('makePhoneCall fail', res)
						},
					})
				}
			},

			startOutboundCall(phone, userId, recordId) {

				console.log('goCall 3')


				this.createToken(phone, userId, recordId)
			},

			createToken(phone, userId, recordId) {
				let that = this


				uni.$u.http.get('/account-api/accountParamInfo/tencentcLogin', {}).then(res => {
					if (res.code == 0) {
						console.log('createToken', res);
						let sdkAppId = '1400756462' //写死的，是公司在腾讯申请的云呼叫中心appid
						// phone = '13574111026'
						console.error('createToken data', sdkAppId + 'sdkAppId***' + phone + 'phone***' +
							recordId + 'recordId***' +
							userId + 'userId***')
						uni.openEmbeddedMiniProgram({
							appId: 'wx49e8ab828096cff3',
							path: `pages/call/call?sdkAppId=${sdkAppId}&userId=${userId}&calleePhone=${phone}&token=${res.data.data.token}`,
							success(res) {
								// 打开成功
								console.log('startOutboundCall Success', res)
								// 外呼成功，执行您的业务逻辑
								// that.addTencentPhoneTapeOut(res, recordId)
							},
							fail(e) {
								console.error('startOutboundCall Fail ee', e)
								uni.showToast({
									title: '打开失败',
									icon: 'none'
								})
								// that.addTencentPhoneTapeOut(err, recordId)
							}
						})
					}
				})

				// uni.request({
				// 	url: `https://ccc.tencentcloudapi.com/?Action=CreateSDKLoginToken&Version=2020-02-10&SdkAppId=1400756462&SeatUserId=${this.callers[0].paramValue}&Timestamp=${new Date().getTime()}`,
				// 	// data: {
				// 	//     text: 'uni.request'
				// 	// },
				// 	header: {
				// 		'Action': 'X-TC-Action' //自定义请求头信息
				// 	},
				// 	success: (res) => {
				// 		console.log('createToken',res);
				// 	}
				// });
			},

			addTencentPhoneTapeOut(res, recordId) {
				let param = {}
				if (res.status == 'success') {
					param = {
						followExecuteRecordId: recordId, //随访任务id
						calleePhoneNumber: res.data.calleePhoneNumber, //被呼叫人
						callerPhoneNumber: res.data.callerPhoneNumber, //呼叫人
						sessionId: res.data.sessionId,
						status: 1, //随访电话通话状态;1:成功2:失败
					}
				} else if (res.status == 'error') {
					param = {
						followExecuteRecordId: recordId,
						status: 2,
					}
				}
				console.error('addTencentPhoneTapeOut param', param)
				// /follow-api/follow/ccc/addTencentPhoneTape
				uni.$u.http.post('/follow-api/follow/ccc/addTencentPhoneTape', param).then(res => {
					if (res.code == 0) {
						console.error('新增腾讯云呼叫电话记录成功', res)
					}
				})
				// addTencentPhoneTape(param).then((resIn) => {
				// 	if (resIn.code == 0) {
				// 		console.error('新增腾讯云呼叫电话记录成功', resIn)
				// 	}
				// })
			},
			subStringIdcardNo(idcard) {
				if (idcard) {
					const temp = idcard.substring(4, 15)
					return idcard.replace(temp, '***********')
				} else {
					return ''
				}
			},
			//患者详情
			showPatientDetail(item) {
				if (this.patientActive == item.userId) {
					this.detailPopShow = true
					return
				}
				uni.showLoading({
					title: '正在加载'
				})
				uni.$u.http.post('/follow-api/followPlanPhone/getPatientInfo/' + item.recordId, {}).then(res => {
					uni.hideLoading()
					res.data.forEach((element) => {
						if (element.tableField == 'id_card') {
							element.fieldValue = this.subStringIdcardNo(element.fieldValue)
						}
						if (element.tableField == 'sex') {
							element.fieldValue = element.fieldValue == 1 ? '男' : '女'
						}
					})

					this.filedList = res.data
					this.detailPopShow = true
					this.patientActive = item.userId
				})
			},
			onPopOpen() {
				console.log("onPopOpen")
			},
			onPopClose() {
				console.log("onPopClose")
				this.popWindowShow = false
			},
			checkQestionTap(item, index) {
				if (this.questionActive == index) {
					this.questionActive = -1
				} else {
					this.questionActive = index
				}
			},
			checkDptTap(item, index) {
				if (this.dptActive == index) {
					this.dptActive = -1
				} else {
					this.dptActive = index
				}
			},
			//毫秒时间戳->YYYY-MM-DD
			formatFullDate1(time) {

				if (time) {
					let date = new Date(time)
					var md = date.getMonth() + 1 + '-' + date.getDate()
					return date.getFullYear() + '-' + md
				}
			},
			dateConfirm(e) {
				console.log(e)
				if (this.checkTime.end && e.value > this.checkTime.end) {
					uni.showToast({
						title: '开始时间不能大于结束时间',
						icon: 'none'
					})
				} else {
					this.checkTime.start = e.value
					this.datetimeShow = false
				}

			},
			dateConfirm2(e) {
				console.log(e)

				if (this.checkTime.start && e.value < this.checkTime.start) {
					uni.showToast({
						title: '结束时间不能小于开始时间',
						icon: 'none'
					})
				} else {
					this.checkTime.end = e.value
					this.datetimeShow2 = false
				}

			},
			checkGuaYesTap() {
				if (this.zanguaActive == 1) {
					this.zanguaActive = -1
				} else {
					this.zanguaActive = 1
				}
			},
			checkGuaNoTap() {
				if (this.zanguaActive == 0) {
					this.zanguaActive = -1
				} else {
					this.zanguaActive = 0
				}
			},
			//重置按钮
			btnReset() {
				this.zanguaActive = -1
				this.questionActive = -1
				this.dptActive = -1
				this.checkTime.end = ''
				this.checkTime.start = ''
				this.requestData.questionnaireId = '' //问卷
				this.requestData.hangStatus = '', //暂挂电话随访挂起状态：0:否；1:是
					this.requestData.cysjStart = '', //出院开始时间
					this.requestData.cysjEnd = '', //出院结束时间

					this.getData(true);
			},

			//确定按钮
			btnConfirm() {
				this.requestData.questionnaireId = this.questionActive == -1 ? '' : this.qlist[this.questionActive]
					.questionnaireId

				this.requestData.executeDepartmentIds = []
				let dptId = this.dptActive == -1 ? '' : this.dptlist[this.dptActive]
					.department_id
				if (dptId) {
					this.requestData.executeDepartmentIds.push(dptId)
				}
				this.requestData.hangStatus = this.zanguaActive == -1 ? '' : this.zanguaActive
				this.requestData.cysjStart = this.formatFullDate1(this.checkTime.start)
				this.requestData.cysjEnd = this.formatFullDate1(this.checkTime.end)
				this.getData(true);
			},

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
			//打电话 并跳转到登记页面
			goFollowPhone(item, phone) { //TODO 打电话需要确认
				debugger
				// this.goCall('13524371592', item.recordId)
				this.goCall(phone, item.recordId, item)
			},
			callUrgentTelEmpty() {
				uni.showToast({
					title: '无紧急联系人电话',
					icon: 'none'
				})
			},
			//不打电话 直接进去登记页面
			goFollowDetail(item) {
				uni.navigateTo({
					url: '/pages2/pages/follow/follow-phone?recordId=' + item.recordId + '&executeDepartmentId=' + item
						.executeDepartmentId + '&patientUserName=' + item.userName + '&patientUserId=' + item
						.userId + '&hangStatus=' + item.hangStatus
				})
			},

			getDeptData() {
				uni.$u.http.post('/follow-api/departmentManger/getDepartmentListForReq', {
					// departmentName: 'departmentName', //搜索输入
					source: 'managerDept', //租户下所有科室：undefined  本登录账号管理科室： 'managerDept'      //需要根据页面业务需求传递
					status: 1, //1开启
					pageNo: 1,
					pageSize: 9999
				}).then(res => {
					if (res.code === 0) {

						this.dptlist = res.data.records

						console.log(this.dptlist)
					}

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
					if (res.code === 0) {
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
						this.popWindowShow = false
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

						this.qlist = res.data

						console.log(this.qlist)
					}

				})
			},
		}
	}
</script>

<style lang="scss">
	.identyView{
		width: 690rpx;
		margin-left: 30rpx;
		margin-top: 20rpx;
		height: 208rpx;
		background: #3894FF;
		border-radius: 4rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		
		.identyitem{
			display: flex;
			flex-direction: column;		
			font-size: 32rpx;
			margin-left: 30rpx;
			color: #FFFFFF;
		}
		.identyright{
			width: 150rpx;
			height: 68rpx;
			background: #FFFFFF;
			border-radius: 34rpx;
			font-size: 28rpx;
			color: #3894FF;
			display: flex;
			flex-direction: row;	
			align-items: center;
			justify-content: center;
			margin-left: auto;
			margin-right: 30rpx;
		}
	}
	.uni-tabbar .uni-tabbar-border {
		height: 3px !important;
	}

	.topselect {
		display: flex;
		flex-direction: row-reverse;
		align-items: center;
		font-size: 30rpx;
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
		padding-top: 30rpx;
		font-size: 28rpx;
	}

	.detailbtn {

		height: 86rpx;
		width: 100%;
		border-top: 1rpx solid #E6E6E6;
		color: #3478F6;
		text-align: center;
		line-height: 86rpx;
		font-size: 30rpx;
		margin-top: 30rpx;
	}

	.detailbtn2 {
		position: absolute;
		left: 0;
		bottom: 0;
		height: 86rpx;
		width: 100%;
		border-top: 1rpx solid #E6E6E6;
		color: #3478F6;
		text-align: center;
		line-height: 86rpx;
		font-size: 30rpx;
	}

	.popview {
		padding: 38rpx 29rpx;
		display: flex;
		flex-direction: column;
		color: #4D4D4D;
		font-size: 28rpx;
		// min-height: 100%;
		position: relative;
	}

	.poptitle {
		color: #1A1A1A;
		font-size: 30rpx;
		margin-top: 48rpx;
		font-weight: bold;
	}

	.popbtnview {
		align-items: center;
		display: flex;
		justify-content: center;
		position: absolute;
		background-color: white;
		left: 0;
		bottom: 40rpx;

		width: 100%;
	}

	.pop-button-blue {

		height: 80rpx;
		width: 690rpx;
		background-color: #007AFF;
		border-radius: 6rpx;
		color: white;
		font-size: 28rpx;
		align-items: center;
		display: flex;
		justify-content: center;
		position: fixed;
		bottom: 40rpx;
		left: 30rpx;
	}

	.label-item-box {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		overflow-y: auto;
	}

	.label-item {
		padding: 20rpx 15rpx;
		background: #F2F2F2;
		border-radius: 34rpx;
		margin: 20rpx 20rpx 0 0;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.label-item.active {
		color: white;
		background-color: #409EFF;
	}

	.content {
		display: flex;
		flex-direction: column;



	}

	.carditem {
		display: flex;
		flex-direction: column;
		font-size: 28rpx;



	}

	.histitem {
		display: flex;
		flex-direction: row;
		color: #1A1A1A;
		align-items: center;
		padding: 24rpx 20rpx 24rpx 24rpx;
	}

	.qustionitem {
		display: flex;
		flex-direction: row;
		color: #1A1A1A;
		align-items: center;
		justify-content: space-between;
		font-size: 28rpx;
		padding: 24rpx;
	}

	.phoneitem {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin: 20rpx 0;
		padding-right: 20rpx;
		// position: relative;
		// height: 108rpx;
	}

	.phonecontent {
		display: flex;
		flex-direction: row;
		align-items: center;
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

		// &:hover {//TODO
		// 	border: 1px #3894ff solid;
		// 	color: #3894ff;
		// 	cursor: pointer;
		// }
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
		// border: 1px #3894ff solid; //TODO
	}

	//TODO
	// .content>>>.reject-modal .u-modal__content {
	// 	flex-direction: column !important;
	// }

	// .content>>>.reject-reason .uicon-close {
	// 	display: none;
	// } //TODO

	.empty {
		margin-top: 300rpx !important;
	}

	.u-safe-bottom {
		display: none;
	}
</style>
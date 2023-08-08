<template>
	<view class="content">
		<view class="card-wrap">
			<view class="textcontent" @click="showPatientDetail()">
				<text style="flex: 1;"> 查看患者信息</text>

				<view class="" style="display: flex;flex-direction: row;align-items: center;">
					<!-- <view>{{detailResult.actualDoctorUserName}} </view> -->
					<u-icon name="arrow-right" color="#999"
						style="width: 22rpx;height: 12rpx;"></u-icon>
				</view>

			</view>
			<view class="textcontent" @click="qestionSelectShow=true">
				<!-- <text class="texttitle"> 实际随访人:</text>
				<view @click="qestionSelectShow=true" class="selectclass">
					{{detailResult.actualDoctorUserName}}
					<u-icon name="arrow-right" color="#999"
						style="width: 22rpx;height: 12rpx;margin-top: 25rpx;"></u-icon>
				</view> -->
				<text style="flex: 1;"> 实际随访人</text>

				<view class="" style="display: flex;flex-direction: row;align-items: center;">
					<view>{{detailResult.actualDoctorUserName}} </view>
					<u-icon name="arrow-right" color="#999"
						style="width: 22rpx;height: 12rpx;margin-top: 25rpx;"></u-icon>
				</view>
			</view>

			<view class="textcontent">
				<text style="flex: 1;"> 是否暂挂</text>

				<view class="" style="display: flex;flex-direction: row;align-items: center;">
					<view>{{hangStatus && hangStatus == 1?'是':'否'}} </view>
				</view>

			</view>

			<view class="textcontent">
				<!-- <text class="texttitle">随访结果:</text> -->
				<text style="flex: 1;"> 随访结果</text>
				<u-radio-group v-model="resultValue" placement="row" @change="groupChange">
					<u-radio name='2' activeColor="#409EFF" label="成功"></u-radio>
					<u-radio name='3' activeColor="#409EFF" label="失败"></u-radio>
				</u-radio-group>
			</view>
			<view class="textcontent" @click="goQues()">
				<text style="flex: 1;"> 填写问卷</text>

				<view class="" style="display: flex;flex-direction: row;align-items: center;">
					<!-- <view>{{detailResult.actualDoctorUserName}} </view> -->
					<u-icon name="arrow-right" color="#999"
						style="width: 22rpx;height: 12rpx;margin-top: 25rpx;"></u-icon>
				</view>

			</view>
			<!-- 			<view v-if="resultValue=='3'" class="textcontent">
				<text class="texttitle">失败原因:</text>
				<u-radio-group v-model="failueValue" placement="column">
					<u-radio activeColor="#409EFF" :customStyle="{marginBottom: '16rpx'}"
						v-for="(item, index) in failureList" :key="index" :label="item" :name="index">
					</u-radio>
				</u-radio-group>
			</view>
			<view v-if="resultValue=='3'" class="textcontent">
				<text decode class="texttitle"> 备&emsp;&emsp;注:</text>
				<u--textarea v-model="detailResult.remark" placeholder="请输入内容"></u--textarea>
			</view> -->
			<!-- 		<web-view v-if="resultValue=='2'" style="margin-top: 200rpx;margin-bottom: 100rpx;"
			:webview-styles="webviewStyles" :src="questionUrl" @message="onPostMessage"></web-view> -->

			<view class="bottomview">
				<u-button type="error" class="custombutton" @click="btnZangua">暂挂</u-button>
				<view style="width: 100rpx;"></view>
				<u-button type="primary" class="custombutton" @click="btnConfirm">提交</u-button>
			</view>
		</view>
		<!-- 		<image v-if="hangStatus && hangStatus == 1" src="/pages2/static/static/images/icon_zangua.png"
				style="width: 83rpx;height: 71rpx;position: absolute;top: 108rpx;right: 24rpx;"></image> -->

		<!-- 		<image @click="showPatientDetail()" src="/pages2/static/static/images/morentouxiang.png"
			style="width: 72rpx;height: 72rpx;position: absolute;top: 209rpx;right: 24rpx;z-index: 10000;"></image>
 -->
		<u-picker :show="qestionSelectShow" @cancel="qestionSelectShow=false" :columns="deptUsers"
			@confirm="qestionSelectconfirm" keyName="userName"></u-picker>

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
		<u-popup :show="failShow" round="4px" mode="center">
			<view class="detailview">
				<view class="detailviewtitle">失败原因</view>
				<view style="padding: 20rpx;">
					<view v-if="resultValue=='3'" class="textcontent">
						<text class="texttitle">失败原因:</text>
						<u-radio-group v-model="failueValue" placement="column">
							<u-radio activeColor="#409EFF" :customStyle="{marginBottom: '16rpx'}"
								v-for="(item, index) in failureList" :key="index" :label="item" :name="index">
							</u-radio>
						</u-radio-group>
					</view>
					<view v-if="resultValue=='3'" class="textcontent">
						<text decode class="texttitle"> 备&emsp;&emsp;注:</text>
						<u--textarea v-model="detailResult.remark" placeholder="请输入内容"></u--textarea>
					</view>

					<view class="detailbtn" @click="closeFailPop">关闭</view>
				</view>
			</view>
		</u-popup>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				detailPopShow: false,
				filedList: [],
				user: {},
				recordId: '',
				patientUserId: '',
				qestionSelectShow: false,
				failShow: false,
				resultValue: '2', //随访结果
				failueValue: -1, //失败原因
				webviewStyles: {
					progress: {
						color: '#409EFF'
					}
				},
				failureList: [
					'电话无人接听',
					'电话号码有误',
					'主动放弃随访',
					'患者拒绝随访',
					'电话占线',
					'电话停机',
					'电话关机',
					'患者已死亡',
					'患者已迁出',
					'其他',
				],
				deptUsers: [],
				detailResult: {
					actualDoctorUserName: '请选择',
					actualDoctorUserId: '',
					remark: '' //备注
				}, //随访结果
				questionUrl: '', //问卷
				departmentId: '',
				isLoading: false,
				hangStatus: ''
			}
		},

		onLoad(options) {

			this.user = uni.getStorageSync('account').user

			this.recordId = options.recordId
			this.departmentId = options.executeDepartmentId
			this.patientUserId = options.patientUserId
			this.hangStatus = options.hangStatus

			uni.setNavigationBarTitle({
				title: options.patientUserName + '随访登记'
			})

			//科室人员
			uni.$u.http.post('/account-api/accountInfo/getUsersByDeptIdAndRole', {
				departmentId: this.departmentId,
				roleId: [3, 5, 7, 8]
			}).then(res => {
				if (res.code == 0) {
					var deptUsers = res.data.deptUsers[0].users

					this.deptUsers = [deptUsers]
					console.log('deptUsers', this.deptUsers)
					let that = this
					//策略：保存的实际就诊人>登录人员>只有一个选项
					var actualDoctorUserId = ''
					try {
						actualDoctorUserId = uni.getStorageSync('follow_user_key') || that.user.userId;

					} catch (e) {
						console.log(e)
						actualDoctorUserId = that.user.userId;

					}

					deptUsers.forEach(item => {
						if (item.userId == actualDoctorUserId + '') {
							console.log('相等')
							that.detailResult.actualDoctorUserId = item.userId
							that.detailResult.actualDoctorUserName = item.userName
						}
					})

					if (!that.detailResult.actualDoctorUserId) {
						if (deptUsers.length == 1) {
							that.detailResult.actualDoctorUserId = deptUsers[0].userId
							that.detailResult.actualDoctorUserName = deptUsers[0].userName
						}
					}

					// uni.getStorage({
					// 	key: 'follow_user_key',
					// 	success: function(res) {
					// 		console.log("读取缓存",res.data);
					// 		var actualDoctorUserId = res.data || that.user.userId

					// 		deptUsers.forEach(item => {

					// 			if (item.userId == actualDoctorUserId + '') {
					// 				console.log('相等')
					// 				that.detailResult.actualDoctorUserId = item.userId
					// 				that.detailResult.actualDoctorUserName = item.userName
					// 			}
					// 		})
					// 	}
					// });

				}

			})

			//随访结果
			uni.$u.http.post('/follow-api/followPlanPhone/current/' + this.recordId, {}).then(res => {
				if (res.code == 0) {
					this.questionUrl = res.data.projectKeyUrlW
				}

			})

		},

		onReady() {
			//监听iframe发过来的消息
			// window.addEventListener('message', this.submitFormFun)
		},
		onShow() {

		},
		onUnload() {
			// window.removeEventListener('message', this.submitFormFun)
		},
		methods: {
			groupChange() {
				if (this.resultValue == '3') {
					this.failShow = true
				}
			},
			closeFailPop() {
				if (this.resultValue == '3') {
					//失败
					if (this.failueValue == -1) {
						uni.showToast({
							title: '请选择失败理由',
							icon: 'none'
						})
						return
					}

					if (this.failueValue == 9) {
						if (this.detailResult.remark.length == 0) {
							uni.showToast({
								title: '请填写备注',
								icon: 'none'
							})
							return
						}
					}
				}
				this.failShow = false
			},
			goQues() {
				// let url = this.questionUrl.replace('hide', 'show')
				// console.log('goQues', url)
				// uni.navigateTo({
				// 	// url: './ques-detail?questionUrl=' + url
				// 	url: './ques-detail?questionObj=' + encodeURIComponent(JSON.stringify({
				// 		url: url
				// 	}))
				// })

				let url = this.questionUrl.replace('hide', 'show')
				uni.setStorageSync('suifang_ques', url);
				uni.navigateTo({
					// url: './ques-detail?questionUrl=' + url
					url: './ques-detail'
				})

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
			showPatientDetail() {
				if (this.filedList.length > 0) {
					this.detailPopShow = true
					return
				}
				uni.showLoading({
					title: '正在加载'
				})
				uni.$u.http.post('/follow-api/followPlanPhone/getPatientInfo/' + this.recordId, {}).then(res => {
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

				})
			},
			qestionSelectconfirm(e) {
				console.log(e)
				this.detailResult.actualDoctorUserId = e.value[0].userId

				this.detailResult.actualDoctorUserName = e.value[0].userName
				this.qestionSelectShow = false

			},

			//提交
			btnConfirm() {
				console.log('isLoading=' + this.isLoading)
				let that = this
				if (this.isLoading) {
					return
				}

				this.isLoading = true

				setTimeout(function() {
					that.isLoading = false
				}, 1500);

				console.log("btnConfirm", this.detailResult)
				if (!this.detailResult.actualDoctorUserId) {

					uni.showToast({
						title: '请选择实际随访人',
						icon: 'none'
					})
					return
				}
				if (this.resultValue == '3') {
					//失败

					if (this.failueValue == -1) {

						uni.showToast({
							title: '请选择失败理由',
							icon: 'none'
						})
						return
					}

					if (this.failueValue == 9) {
						if (this.detailResult.remark.length == 0) {

							uni.showToast({
								title: '请填写备注',
								icon: 'none'
							})
							return
						}
					}

					// //保存处理信息
					// this.dodealsave()
				} else {
					//成功
					//发送消息给iframe 通知其提交问卷  待监听到提交成功的消息后 保存处理信息

					// this.evalJs()
				}

				//保存处理信息
				this.dodealsave()


			},
			//发送消息给webview 通知其提交问卷
			evalJs: function() {
				// console.log(12);
				//通过窗口的 origin 属性来指定哪些窗口能接收到消息事件，其值可以是字符串"*"（表示无限制）或者一个 URI。在发送消息的时候，如果目标窗口的协议、主机地址或端口这三者的任意一项不匹配 targetOrigin 提供的值，那么消息就不会被发送；只有三者完全匹配，消息才会被发送。这个机制用来控制消息可以发送到哪些窗口；
				//window.frames[0] 注意窗口
				window.frames[0].postMessage("submitForm", "*")
			},
			//监听webview发来的消息
			submitFormFun(e) {
				console.log('submitFormFun', e)
				if (e.data == 'submitFormSuccess') {
					console.log('iframe中已提交成功')
					this.dodealsave()
				}
			},

			dodealsave() {


				uni.showLoading({
					title: '正在提交'
				})
				var postdata = {
					actualDoctorUserId: this.detailResult.actualDoctorUserId, //实际随访人
					failReason: this.failueValue + 1,
					id: this.recordId,
					remark: this.detailResult.remark,
					taskBizStatus: this.resultValue, //2成功3失败
				}
				uni.$u.http.post('/follow-api/followPlanPhone/modifyFollowExecuteRecord', postdata).then(res => {
					if (res.code == 0) {
						//保存实际随访人
						uni.setStorage({
							key: 'follow_user_key',
							data: postdata.actualDoctorUserId
						});
						uni.showToast({
							title: '提交成功!',
							icon: 'success'
						})

						setTimeout(function() {
							uni.$emit('FollowUpdate', {
								msg: '页面更新'
							})
							uni.navigateBack()
						}, 1500);

					} else {
						uni.showToast({
							title: res.message,
							icon: 'none'
						})
					}
					uni.hideLoading()
				})
			},
			//暂挂
			btnZangua() {
				uni.showLoading({
					title: '加载中'
				})
				var postdata = {

					id: this.recordId,
					hangStatus: 1,
				}
				uni.$u.http.post('/follow-api/followPlanPhone/hangExecuteRecord', postdata).then(res => {
					if (res.code == 0) {

						uni.showToast({
							title: '暂挂成功!',
							icon: 'success'
						})

						setTimeout(function() {
							uni.$emit('FollowUpdate', {
								msg: '页面更新'
							})
							uni.navigateBack()
						}, 1500);

					} else {
						uni.showToast({
							title: res.message,
							icon: 'none'
						})
					}
					uni.hideLoading()
				})
			}

		}
	}
</script>

<style lang="scss">
	.content {
		display: flex;
		flex-direction: column;
		background-color: #F2F2F2;
		min-height: 100vh;
		padding: 20rpx 23rpx;
		/* background-color: #999999; */

	}

	/deep/ .u-radio-group {
		flex: none !important;
	}

	.u-safe-bottom {
		display: none;
	}

	.card-wrap {
		background-color: #F2F2F2;
		border-radius: 10rpx;
		// padding: 20rpx;
		// padding: 20rpx 20rpx 0 20rpx;
		border: 1rpx solid #F2F2F2;

	}

	.textcontent {
		display: flex;
		flex-direction: row;
		// align-items: flex-start;
		align-items: center;
		font-size: 28rpx;
		color: #4D4D4D;
		background-color: white;
		border-radius: 10rpx;
		border: 1rpx solid white;
		// padding: 10rpx;
		padding: 36rpx 30rpx;
		margin-bottom: 20rpx;
	}

	.texttitle {
		width: 150rpx;
		text-align: left;
		margin-right: 30rpx;
		text-align-last: justify;

		text-align: justify;
	}

	.selectclass {
		flex: 1;

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

	.bottomview {
		position: fixed;
		left: 24rpx;
		width: 702rpx;
		height: 100rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		bottom: 50rpx;
		z-index: 998;
		// background-color: #FFFFFF;
	}

	.custombutton {

		/* background-color: #409EFF; */

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
</style>
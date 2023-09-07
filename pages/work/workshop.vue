<template>
	<view class="wrap">
		<u-sticky style="top:0;background-color: white;" v-if="account && account.accountId && account.bindStatus == 0">
			<view class="view-info">
				<image @click="goInfoPage" :src="account.user.avatarUrl || '/static/static/images/header.png'"
					mode="aspectFill"></image>
				<view class="view-info-personal">
					<!-- <view style="font-size: 42rpx;color: #1A1A1A;" @click="goIdentify">{{account.user.userName}}</view> -->
					<view style="font-size: 42rpx;color: #1A1A1A;">{{account.user.userName}}</view>
					<view class="info-personal">
						<view style="font-size: 30rpx;color: #4D4D4D">{{account.user.departmentName}}</view>
						<view style="font-size: 30rpx;color: #4D4D4D;margin-left: 30rpx;">
							{{account.user.professionalTitle}}
						</view>
					</view>
				</view>
				<view class="view-info-card" @click="showDocCode">
					<image src="/static/img/mingpian.png"></image>
					<!-- <view>名片</view> -->
				</view>
			</view>
			<view style="margin-left: 30rpx;margin-right: 30rpx;">
				<u-search @search="goSearch()" disabled @click="goSearch()" inputAlign="left" placeholder="搜索"
					v-model="keyword" :show-action="false" input-align="center">
				</u-search>
			</view>

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

		<!-- 这里 uview不能用 -->
		<!-- <u-divider text=""></u-divider> -->
		<view style="height: 1px; background-color: #E6E6E6;margin-top: 20rpx;margin-bottom: 20rpx;"></view>

		<view class="view-list" v-for="(item, index) in listData" @click="onItemClick(index)" :key="index">
			<view class="view-info-list">
				<view class="v-num">
					<image mode="aspectFit" style="width: 90rpx;height: 90rpx;margin-bottom: 25rpx;float: left;"
						:src="item.headUrl"></image>
					<view class="v-num-wrap" v-if="item.unreadCount > 0">
						<view class="num">{{ item.unreadCount }}</view>
					</view>

				</view>
				<view class="view-info-personal-list">
					<view class="info-personal-list">
						<view class="left-whole">
							<view style="font-size: 31rpx;color: #1A1A1A;">{{item.userName}}</view>
							<view v-show="item.type== 1"
								style="font-size: 20rpx;color: #DE7311;margin-left: 30rpx;background-color: #FFF6E6;border-radius: 4rpx;height: 30rpx;padding: 0 12rpx">
								应用</view>
							<view v-show="item.type== 2"
								style="font-size: 20rpx;color: #DE7311;margin-left: 30rpx;background-color: #FBE9E9;border-radius: 4rpx;height: 30rpx;padding: 0 12rpx">
								患者</view>
						</view>

						<view style="font-size: 24rpx;color: #999999;float: right;">{{item.lastMsgTime}}</view>
						<!-- 						<view style="font-size: 24rpx;color: #999999" v-if="item.type== 2">{{item.lastMsgTime}}</view> -->
					</view>
					<view
						style="font-size: 28rpx;color: #999999;margin-top: 5rpx;overflow: hidden; text-overflow: ellipsis; white-space: nowrap;width: 570rpx;">
						{{item.type== 2 ?(item.nick?(item.nick+'：' +item.nearMsg):'无最新消息'):item.nearMsg}}
					</view>
					<view style="margin-top: 30rpx;height: 1rpx;background-color: #E6E6E6;"></view>
				</view>

			</view>

		</view>
		<u-empty mode="data" style="padding-top: 300rpx;" v-if="listData.length === 0"
			icon="/static/img/icon_nodata.png"></u-empty>

		<u-popup :show="showCode" mode="center" :round="4" @close="closeCodePop">
			<view class="codeview">
				<image class="code" :src="docCodeImg">
				</image>
				<view class="codeitem">
					<image src="/static/static/images/yisheng.png"
						style="width: 30rpx;height: 34rpx;margin-right: 20rpx;">
					</image>
					<text>{{account.user.userName}}</text>
				</view>
				<view class="codeitem">
					<text>{{account.user.professionalTitle}}</text>
					<view style="margin-left: 20rpx;margin-right: 20rpx;">|</view>
					<text>{{account.user.departmentName}}</text>
				</view>
				<text style="color: #3894FF;">让患者微信扫一扫添加</text>
			</view>
		</u-popup>
		<ca-check ref="caCheck" />
	</view>
</template>

<script>
	import caCheck from '@/components/ca/check';

	export default {
		data() {
			return {
				showCode: false,
				docCodeImg: undefined,
				numZX: 0,
				numSF: 0,
				listData: [],
				keyword: undefined,
				conversationIDList: [],

				account: {
					user: {}
				}
			}
		},
		components: {
			caCheck
		},
		onLoad() {
			this.account = uni.getStorageSync('account');
		},
		onReady() {},
		onShow() {
			this.listData = []
			// 1.第一个原 互联网医院咨询 改成 本院复诊，原来的健康咨询里面的复诊续方拖出来到首页的应用，点进去跳转到单独的页面
			// 2.原 互联网医院咨询 其实是 图文咨询 也归纳到 健康咨询 里面去

			this.listData.push({
				userName: '本院复诊',
				// userName: '互联网医院咨询',
				type: 1, //构造字段 用来区分患者和应用
				headUrl: '/static/img/icon_mission.png',
				// nearMsg: '[患者发起的图文咨询/复诊开方]'
				nearMsg: ''
			})
			this.listData.push({
				userName: '健康咨询',
				type: 1,
				headUrl: '/static/img/icon_talk.png',
				// nearMsg: '[患者发起的图文&电话&视频咨询]'
				nearMsg: ''
			})


			if (this.account && this.account.accountId && this.account.bindStatus == 0) {

				this.getNum();

				setTimeout(() => {
					this.$refs.caCheck.check();
				});
			}

			this.refreshBindStatus();

		},
		methods: {
			//个人信息页
			goInfoPage() {
				uni.navigateTo({
					url: '/pages2/pages/mine/info'
				})
			},
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

			refreshBindStatus() {
				uni.$u.http.get('/account-api/accountInfo/getDoctorAuthStatus', {
					params: {}
				}).then(res => {
					if (res.code == 0) {
						this.account.bindStatus = res.data.bindStatus
					} else {
						this.$u.toast(res.message)
					}

				}).finally(() => {
					uni.hideLoading();
				});
			},
			//获取健康咨询数量
			getNum() {

				uni.showLoading({
					title: '请求中'
				});
				//权益使用待接诊数量查询
				uni.$u.http.post('/medical-api/rightsUse/qryRightsUsingCountByDoc', {
						docId: this.account.user.userId
					}).then(res => {
						uni.hideLoading()
						this.$set(this.listData[1], 'unreadCount', res.data.TextNum + res.data.TelNum + res.data
							// this.$set(this.listData[0], 'unreadCount', res.data.TextNum + res.data.TelNum + res.data
							.VedioNum)

						//本院复诊的数量也从这里来
						this.$set(this.listData[0], 'unreadCount', res.data.appointNum)
						this.$set(this.listData[0], 'nearMsg', '患者发起的复诊续方')

						// this.listData[1].unreadCount = res.data.TextNum + res.data.TelNum + res.data.VedioNum
						console.log('this.listData[0]', JSON.stringify(this.listData[1]))
						//互联网咨询不显示了

						this.getChatList()
						// this.getnumZX()
					})
					.catch(() => {
						uni.hideLoading()
					});
			},

			//获取互联网咨询数量  最初的湘雅二的咨询数据
			getnumZX() {
				uni.$u.http.get('/health-api/health/patient/getUserTaskNum', {
					params: {
						execFlag: '0',
						taskType: '9',
						execTime: '',
						userId: this.account.user.userId
					}
				}).then(res => {
					uni.hideLoading();
					res.data = res.data || {};
					this.$set(this.listData[0], 'unreadCount', res.data.taskNum)
					this.getChatList()
				});
			},

			goSearch() {
				uni.navigateTo({
					url: '/pages2/pages/work/search'
				})
			},
			getChatList() {
				this.conversationIDList = []
				uni.$u.http.post('/medical-api/rightsUse/qryRightsUsingByDoc', {
					keyWord: '',
					userId: this.account.user.userId
				}).then(res => {
					res.data = res.data || {};
					if (res.data.length > 0) {
						res.data.forEach((item) => {
							this.$set(item, 'type', 2)
							this.$set(item, 'headUrl', '/static/static/images/header.png')
							// this.$set(item, 'nearMsg', '在吗？吃饭了吗')

							if (item.imGroupId) {
								console.log('ggg', 'GROUP' + item.imGroupId)
								this.$set(item, 'conversationID', 'GROUP' + item.imGroupId)
								this.conversationIDList.push(item.conversationID)
							}
						})
						//单独处理第2个应用的最近一条信息信息
						// this.$set(this.listData[1], 'nearMsg', '患者发起的' + res.data[0].serviceItemName)
						console.log('fff', res.data)
						this.listData = this.listData.concat(res.data)
						console.log('fffddd', this.listData)
						this.getConversationList() //TODO 聊天H5 api暂时无法使用
						uni.hideLoading();
					} else {
						//互联网咨询不显示了
						// this.getRecentMsg()
						this.getRecentMsgMore()
						uni.hideLoading();
					}
				});
			},

			closeCodePop() {
				this.showCode = false
			},
			/**
			 * 这里也是只有图文咨询聊天用group，其他的三种都用group2
			 * @param {Object} index
			 */
			onItemClick(index) {

				if (!this.account || !this.account.accountId || this.account.bindStatus !== 0) {
					//如果没有账号 或者 没有认证
					this.goIdentify()
					return
				}

				//互联网咨询不显示了
				if (index == 0) {
					uni.navigateTo({
						// url: `/pages2/pages/todo/index`
						url: `/pages2/pages/work/talk/fuzhen`
					});
				} else
				if (index == 1) {
					uni.navigateTo({
						url: '/pages2/pages/work/talk/index'
					})
					// } else if (this.listData[index].broadClassify == 4) {
				} else if (this.listData[index].serviceItemType == '101') {
					uni.setStorageSync('taskItem', this.listData[index]);
					// this.chatList()
					uni.navigateTo({
						url: `/pages2/pages/TUI-Chat-Group2/chat?conversationID=GROUP${this.listData[index].imGroupId}`
					});
				} else {
					uni.setStorageSync('taskItem', this.listData[index]);
					// this.chatList()
					uni.navigateTo({
						url: `/pages2/pages/TUI-Chat-Group2/chat?conversationID=GROUP${this.listData[index].imGroupId}`
					});
				}
			},

			//获取问诊列表的未读数
			getConversationList() {
				if (this.conversationIDList.length == 0) {
					return
				}
				console.log(this.conversationIDList)
				// if (getApp().globalData.sdkReady) {
				// 获取指定的会话列表
				let promise = uni.$TUIKit.getConversationList(this.conversationIDList);
				let that = this
				let listDataTemp = JSON.parse(JSON.stringify(this.listData))
				uni.hideLoading();
				promise.then(function(imResponse) {
					const conversationList = imResponse.data.conversationList; // 缓存中已存在的指定的会话列表
					console.log("获取指定的会话列表", JSON.stringify(conversationList))
					console.log("获取指定的会话列表dd", imResponse)
					// var num = 0
					if (conversationList && conversationList.length > 0) {
						for (var i = 0; i < conversationList.length; i++) {
							for (var j = 0; j < listDataTemp.length; j++) {
								if (conversationList[i].conversationID == listDataTemp[j].conversationID) {
									listDataTemp[j].unreadCount = conversationList[i].unreadCount
									listDataTemp[j].nearMsg = conversationList[i].lastMessage.messageForShow
									listDataTemp[j].nick = conversationList[i].lastMessage.nick
									listDataTemp[j].lastMsgTime = that.formatDate(conversationList[i]
										.lastMessage
										.lastTime * 1000)
									// num = num + conversationList[i].unreadCount
								}
							}
						}
						// that.setData({
						// 	appointList: appointList,
						// 	unreadConsult: num
						// })
					}
					// that.$set(listDataTemp[1], 'lastMsgTime', listDataTemp[2].createdTime)
					//互联网咨询不显示了
					// that.getRecentMsg()
					that.getRecentMsgMore()
					that.listData = listDataTemp
					console.log("转换后的数据", JSON.stringify(listDataTemp))
				}).catch(function(imError) {
					console.warn('getConversationList error:', imError); // 获取会话列表失败的相关信息
				})
				// this.listData = listDataTemp
				// }

			},

			///patient/getLastRightsUserRecordByDoc 根据医生获取最新问诊记录
			//获取原 互联网咨询 的最近消息 
			getRecentMsg() {
				uni.$u.http.get('/health-api/patient/getLastRightsUserRecordByDoc', {
					params: {
						docId: this.account.user.userId
					}
				}).then(res => {
					// res.data = res.data || {};
					// rightsName createTime
					if (res.data) {
						this.$set(this.listData[0], 'nearMsg', res.data.rightsName ? ('患者发起的' + res.data
							.rightsName) : '')
						this.$set(this.listData[0], 'lastMsgTime', res.data.createTime ? this.formatDate(res
							.data.createTime) : '')
					}
				});
			},

			//获取 健康咨询 的最近消息 
			getRecentMsgMore() {
				uni.$u.http.post('/medical-api/rightsUse/qryRightsUseRecord', {
					docId: this.account.user.userId
				}).then(res => {
					// res.data = res.data || {};
					// rightsName createTime
					if (res.data && res.data.length > 0) {
						//互联网咨询不显示了
						// this.$set(this.listData[1], 'nearMsg', res.data[0].serviceItemName ? ('患者发起的' + res.data[0]
						this.$set(this.listData[1], 'nearMsg', res.data[0].broadClassifyName ? ('患者发起的' + res.data[
								0]
							.broadClassifyName) : '')
						res.data[0].createdTime = this.changeDate(res.data[0].createdTime)
						// this.$set(this.listData[1], 'lastMsgTime', res.data[0].createdTime ? res
						this.$set(this.listData[1], 'lastMsgTime', res.data[0].createdTime ? res
							.data[0].createdTime : '')
					}
				});
			},

			showDocCode() {
				if (this.docCodeImg) {
					this.showCode = true
					return
				}
				uni.$u.http.get('/wx-api/wx/qrcode/' + uni.getAccountInfoSync().miniProgram.appId + '/getDoctorQrCode', {
					params: {
						docUserId: this.account.user.userId,
						forceMpCode: '',
					}
				}).then(res => {

					if (res.code == 0) {
						this.docCodeImg = res.data
						this.showCode = true
					} else {
						uni.showToast({
							title: res.message
						})
					}

				});
			},


			formatDate(date) {
				date = new Date(date);
				let myyear = date.getFullYear();
				let mymonth = date.getMonth() + 1;
				let myweekday = date.getDate();
				mymonth < 10 ? (mymonth = '0' + mymonth) : mymonth;
				myweekday < 10 ? (myweekday = '0' + myweekday) : myweekday;
				return `${myyear}/${mymonth}/${myweekday}`;
			},
			changeDate(dateStr) {
				if (!dateStr) {
					return ''
				}
				dateStr = dateStr.substring(0, 10)
				let str = dateStr.substring(0, 4) + '/' + dateStr.substring(5, 7) + '/' + dateStr.substring(8, 10)
				return str
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
		}
	}
</script>

<style lang="scss">
	.codeview {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 620rpx;
		padding-top: 100rpx;
		padding-bottom: 32rpx;

		.code {
			width: 316rpx;
			height: 316rpx;
			margin-bottom: 32rpx;

		}

		text {
			font-size: 30rpx;
			color: #1A1A1A;
		}

		.codeitem {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			margin-bottom: 30rpx;
		}
	}

	.identyView {
		width: 690rpx;
		margin-top: 30rpx;
		margin-left: 20rpx;
		height: 208rpx;
		background: #3894FF;
		border-radius: 4rpx;
		display: flex;
		flex-direction: row;
		align-items: center;

		.identyitem {
			display: flex;
			flex-direction: column;
			font-size: 32rpx;
			margin-left: 30rpx;
			color: #FFFFFF;
		}

		.identyright {
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

	.wrap {
		min-height: 100%;
		background: #fff;

		.u-sticky__content {
			background-color: white;
		}

		.view-info {
			padding: 30rpx 30rpx;
			overflow: hidden;
			width: 92vw;
			display: flex;
			flex-direction: row;
			align-items: center;

			image {
				float: left;
				width: 108rpx;
				height: 108rpx;
				border-radius: 50%;
			}

			.view-info-personal {
				display: flex;
				margin-left: 30rpx;
				flex: 1;
				flex-direction: column;
				// align-items: center;

				.info-personal {
					display: flex;
					flex-direction: row;
				}
			}

			.view-info-card {
				display: flex;
				flex-direction: column;
				align-items: center;

				image {
					border-radius: 0;
				}
			}
		}

		.view-list {
			// display: flex;
			// flex-direction: column;
			// padding: 30rpx 30rpx;

			.view-info-list {
				margin-left: 30rpx;
				margin-right: 30rpx;

				margin-bottom: 28rpx;
				// margin: 30rpx 30rpx 0 30rpx;
				overflow: hidden;
				// border-bottom: 1rpx solid #E6E6E6;
				width: 92vw;
				display: flex;
				flex-direction: row;
				align-items: center;

				.v-num {
					// width: 500rpx;
					display: flex;
					flex-direction: row;

					.v-num-wrap {
						margin-left: -30rpx;
						width: 40rpx;
						height: 40rpx;
						z-index: 100;
						display: flex;
						align-items: center;
						flex-direction: row;
						background: #FF482C;
						justify-content: center;
						border-radius: 20rpx;

						.num {
							font-size: 20rpx;
							// font-family: PingFang SC;
							// font-weight: 400;
							color: #FFFFFF;
						}
					}


				}

				.view-info-personal-list {
					display: flex;
					margin-left: 30rpx;
					flex: 1;
					flex-direction: column;
					// align-items: center;

					.info-personal-list {
						margin-top: 5rpx;
						display: flex;
						width: 638rpx;
						align-items: center;
						flex-direction: row;

						.left-whole {
							width: 68%;
							// flex: 1;
							display: flex;
							flex-direction: row;
							align-items: center;
						}
					}
				}


			}


		}
	}
</style>
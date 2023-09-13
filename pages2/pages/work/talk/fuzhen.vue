<template>
	<view class="wrap">
		<!-- TODO视频代码 -->
		<tuicall ref="TUICall"></tuicall>
		<u-sticky style="background-color: white;" zIndex="1">
			<u-tabs :list="listTab" :scrollable="false"
				itemStyle="height: '44rpx';padding:20rpx 10rpx;ackground-color: white" @click="clickTab">
			</u-tabs>
			<view class="view-info">
				<view class="btn-wrap" v-for="(item, index) in listBtn" :key="index" @click="clickBtn(index)">
					<view class="btn-def" :class="{active:item.isChecked}">{{item.name}}</view>
					<!-- 					<view v-if="serviceItemType == '102' &&(status ==2||status==3) && listData.length && item.canSee>0" -->
					<view v-if="item.canSee>0" class="btn-dot"></view>

				</view>
			</view>
		</u-sticky>

		<!-- <u-divider text=""></u-divider> -->

		<!-- 复诊续方列表 -->
		<view style="background-color: #F5F5F5;" v-if="serviceItemType=='99'">
			<view style="height: 1rpx;"></view>

			<!-- <view class="view-list-video" @click="onClick(index)" v-for="(item, index) in listData" :key="index"> -->
			<!-- //复诊续方本质是图文咨询 点击图文条目没有操作   原来的操作都放到条目的按钮上了 -->
			<view class="view-list-video" @click="onClickFuzhenItem(item,index)" v-for="(item, index) in listData"
				:key="index">
				<view class="view-video-list">
					<view style="display: flex;flex-direction: row;align-items: center;">
						<view style="flex: 1;display: flex;flex-direction: row;align-items: center;">
							<view style="font-size: 30rpx;font-weight: bold;">复诊续方</view>
							<view style="font-size: 28rpx;color: #F32B0C;margin-left: 26rpx;">￥{{item.orderTotal}}
							</view>
						</view>
						<view v-if="item.status==2" style="color: #F32B0C;">{{item.statusText}}</view>
						<view v-else-if="item.status==3" style="color: #ECAD14;">{{item.statusText}}</view>
						<view v-else style="color: #999999;">{{item.statusText}}</view>
					</view>
					<view
						style="display: flex;flex-direction: row;align-items: center;color: #1A1A1A;padding: 20rpx 0;">
						<view style="color: #999999;width: 150rpx;">患者信息：</view>
						<view style="margin-left: 10px;">{{item.userInfo.userName}}</view>
						<view class="v-line" style="margin-left: 15px;" />
						<view style="margin-left: 15px;">{{item.userInfo.userAge}}</view>
						<view class="v-line" style="margin-left: 15px;" />
						<view style="margin-left: 15px;">{{item.userInfo.userSex}}</view>
					</view>

					<view style="display: flex;flex-direction: row;color: #1A1A1A;padding: 20rpx 0;">
						<view style="color: #999999;width: 150rpx;">病情描述：</view>
						<view style="margin-left: 10px;width: 500rpx;">{{item.diseaseDesc}}</view>
					</view>

					<view
						style="display: flex;flex-direction: row;align-items: center;color: #1A1A1A;padding: 20rpx 0;">
						<view style="color: #999999;width: 150rpx;">预约时间：</view>
						<view style="margin-left: 10px;width: 500rpx;">{{item.createdTime}}</view>
					</view>

					<view style="display: flex;flex-direction: row;">
						<view style="flex:1"></view>
						<!-- 空心按钮 -->
						<view v-if="item.status ==2"
							style="color: #409EFF;background-color: white;border:1rpx solid  #409EFF ;border-radius: 30rpx;padding: 12rpx 43rpx 11rpx 43rpx;margin-right: 20rpx;"
							@click.stop="onTextRefuse(item,index)">拒诊</view>
						<view v-if="item.status ==2"
							style="color: white;background-color: #409EFF;border-radius: 30rpx;padding: 12rpx 43rpx 11rpx 43rpx;margin-right: 20rpx;"
							@click.stop="onTextGoOn(item,index)">接诊</view>

						<!-- 空心按钮 -->
						<view v-if="item.status ==3"
							style="color: #409EFF;background-color: white;border:1rpx solid  #409EFF ;border-radius: 30rpx;padding: 12rpx 43rpx 11rpx 43rpx;margin-right: 20rpx;"
							@click.stop="goPopEnd(item,index)">结束问诊</view>
						<view v-if="item.status ==3 && item.diagnosisFlag.value===1"
							style="color: white;background-color: #409EFF;border-radius: 30rpx;padding: 12rpx 43rpx 11rpx 43rpx;margin-right: 20rpx;"
							@click.stop="goChufang(item,index)">开具处方</view>
						<view v-if="item.status ==3"
							style="color: white;background-color: #409EFF;border-radius: 30rpx;padding: 12rpx 43rpx 11rpx 43rpx;margin-right: 20rpx;"
							@click.stop="goChatClick(item,index)">进入诊室</view>


						<!-- 空心按钮 -->
						<!-- <view v-if="item.status ==4" -->
						<view v-if="item.status ==4||item.status ==5"
							style="color: #409EFF;background-color: white;border:1rpx solid  #409EFF ;border-radius: 30rpx;padding: 12rpx 43rpx 11rpx 43rpx;margin-right: 20rpx;"
							@click.stop="goChatHistory(item,index)">查看记录</view>
					</view>
				</view>

				<view style="width: 95vw;height: 1rpx;color: #f00;"></view>
			</view>
		</view>

		<!-- 		<view class="view-list" @click="onClick(index)" v-else v-for="(item, index) in listData" :key="index">
			<view class="view-info-list">
				<image mode="aspectFit" style="width: 90rpx;height: 90rpx;margin-bottom: 25rpx;"
					src="/pages2/static/static/images/header.png">
				</image>
				<view class="view-info-personal-list">
					<view class="info-personal-list">
						<view style="flex: 1;display: flex;flex-direction: row;align-items: baseline;">
							<view style="font-size: 31rpx;color: #1A1A1A;">{{item.userInfo.userName}}
							</view>
							<view style="font-size: 28rpx;color: #4D4D4D;margin-left: 30rpx;">
								{{item.userInfo.userSex}}&nbsp;&nbsp;{{item.userInfo.userAge}}岁
							</view>
						</view>
					</view>
					<view
						style="font-size: 28rpx;color: #999999;margin-top: 5rpx;overflow: hidden; text-overflow: ellipsis; white-space: nowrap">
						{{item.createdTime}}
					</view>
					<view style="margin-top: 30rpx;height: 0.5px;background: #E6E6E6;"></view>
				</view>
			</view>
			<view style="width: 95vw;height: 1rpx;color: #f00;"></view>
		</view> -->

		<u-empty mode="data" style="padding-top: 300rpx;" icon="/pages2/static/img/icon_nodata.png"
			v-if="listData.length === 0"></u-empty>

		<!-- 		<u-popup :safeAreaInsetBottom="true" :safeAreaInsetTop="true" :mode="popupData.mode" :show="show"
			:round="popupData.round" :overlay="popupData.overlay" :borderRadius="popupData.borderRadius"
			:closeable="popupData.closeable" :closeOnClickOverlay="popupData.closeOnClickOverlay" @close="close"
			@open="open">
			<view class="wrap-pop" style="overflow-y: auto;">
				<view class="pop-top">
					<view class="pop-info">
						<view>{{choseOne.userInfo.userName}}</view>
						<view style="margin-left: 20rpx;">{{choseOne.userInfo.userSex}}</view>
						<view style="margin-left: 20rpx;">{{choseOne.userInfo.userAge}}岁</view>
					</view>
				</view>
				<view style="overflow-y: auto;">
					<view class="info-title">病情描述</view>
					<view class="info-desc">{{illData.diseaseDesc}}</view>
					<view class="info-pics">
						<u-album :previewFullImage="false" :urls="illData.images" multipleSize="80"></u-album>
					</view>
					<view class="info-title">希望获得帮助</view>
					<view class="info-desc">{{illData.appealDesc}}</view>
				</view>
				<view class="view-btn">
					<view class="view-btn-in">
						<view
							style="margin-left: 30rpx;font-size:30rpx;padding: 17rpx 60rpx;background-color: #E6E6E6;color: #4D4D4D;border-radius: 5rpx;"
							@click="goAsk">拒诊</view>
						<view
							style="margin-left: 30rpx;font-size:30rpx;padding:  17rpx 60rpx;background-color: #409EFF;color: white;border-radius: 5rpx;"
							@click="goOn">接诊</view>
					</view>
				</view>
			</view>
		</u-popup> -->

		<!-- 		<u-popup :show="detailPopShow" round="4px" mode="center" @close="detailPopShow=false">
			<view class="detailview">
				<view class="detailviewtitle">患者信息</view>
				<view style="overflow-y: auto;">
					<view class="detalviewtext" style="color: #1A1A1A;font-size: 30rpx;font-weight: bold;">基本信息</view>
					<text class="detalviewtext" decode>
						{{choseOne.userInfo.userName}}&emsp;{{choseOne.userInfo.userSex}}&emsp;{{choseOne.userInfo.userAge}}岁
					</text>
					<view class="detalviewtext">挂号时间：{{illData.appointTime}}</view>
					<view class="detalviewtext">
						咨询类型：复诊续方
					</view>
					<view class="detalviewtext" style="color: #1A1A1A;font-size: 30rpx;font-weight: bold;">
						病情描述
					</view>
					<view class="detalviewtext">{{illData.diseaseDesc}}</view>
					<view class="detailviewimgview">
						<u-album :previewFullImage="false" :urls="illData.images" multipleSize="80"></u-album>
					</view>
				</view>

				<view class="popbtnview">
					<u-button type="default" style="width: 228rpx;margin-right: 0rpx;background-color: #E6E6E6;"
						text="拒诊" @click="goAskFang"></u-button>
					<u-button type="primary" style="width: 228rpx;" text="接诊" @click="goOn"></u-button>
				</view>
			</view>
		</u-popup> -->

		<u-modal class="wenzhen-modal" title="温馨提示" confirmText="确定" :show="showRefuse" closeOnClickOverlay
			@confirm="goRefuse" @close="() => showRefuse = false">
			<view>确认拒诊吗？</view>
		</u-modal>

		<u-modal class="wenzhen-modal" title="温馨提示" confirmText="确定" :show="showGoOn" closeOnClickOverlay
			@confirm="goOn" @close="() => showGoOn = false">
			<view>确认接诊吗？</view>
		</u-modal>

		<u-modal title="结束问诊" confirmText="确定" @cancel="() => showEnd = false" showCancelButton :show="showEnd"
			closeOnClickOverlay @confirm="endTalk" @close="() => showEnd = false">
			<view>请确认是否结束问诊？</view>
		</u-modal>

		<TUI-view-rate ref="TUIViewRate" />

	</view>
</template>

<script>
	import tuicall from '../../../components/common/tuicall';
	import TUIViewRate from '../../../components/tui-rate/view/index';

	export default {
		components: {
			tuicall,
			TUIViewRate
		},
		data() {
			return {
				numZX: 0,
				numSF: 0,
				// show: false,
				// detailPopShow: false,
				// showAsk: false,
				showGoOn: false,
				showRefuse: false,
				showEnd: false,
				serviceItemType: '99',
				status: '2',
				choseOne: {
					userInfo: {}
				},
				illData: {},
				fuzhenNum: {},
				phoneNum: {},
				phoneNumVideo: {},
				popupData: {
					overlay: true,
					mode: 'center',
					closeable: false,
					round: 10,
					closeOnClickOverlay: true
				},
				listTab: [{
					name: '复诊续方',
					badge: {
						value: 0,
					}
				}, {
					// name: '视频咨询',
					name: '特需心里咨询',
					disabled: true,
					badge: {
						value: 0,
					}
				}],
				listBtn: [{
					name: '待接诊',
					canSee: false,
					isChecked: true
				}, {
					name: '问诊中',
					canSee: false,
					isChecked: false
				}, {
					name: '已结束',
					canSee: false,
					isChecked: false
				}],
				listData: [],
				keyword: undefined,
				account: {
					user: {}
				}
			}
		},
		onLoad() {},
		onReady() {
			console.log('date', this.formatDateFull(new Date()))
		},
		/**
		 * 本页面从原 健康咨询 页面独立出来，把原健康咨询中复诊续方单独抽一个页面出来
		 */
		onShow() {
			this.account = uni.getStorageSync('account') || {
				user: {}
			};
			this.refreshAllData()
		},
		onPullDownRefresh() {
			console.log('refresh');

			if (this.show) {
				uni.stopPullDownRefresh();
				return
			}
			this.refreshAllData()
		},

		methods: {
			refreshAllData() {
				this.getNum();
				this.getFuzhenNum();
				this.chatList();
			},
			goSearch() {
				uni.navigateTo({
					url: '/pages2/pages/work/search'
				})
			},
			getNum() {
				//权益使用待接诊数量查询
				uni.$u.http.post('/medical-api/rightsUse/qryRightsUsingCountByDoc', {
					docId: this.account.user.userId
				}).then(res => {
					this.listTab[0].badge.value = res.data.appointNum
					// this.listTab[0].badge.value = res.data.TextNum
					// this.listTab[1].badge.value = res.data.TelNum
					// this.listTab[2].badge.value = res.data.VedioNum
					// this.listTab[3].badge.value = res.data.appointNum //复诊续方的红点
					// if (this.serviceItemType == '99') {
					// 	this.listBtn[0].canSee = this.listTab[2].badge.value > 0 ? true : false
					// }
				});
			},

			getFuzhenNum() {
				//权益使用待接诊数量查询  这里电话咨询的新增做了红点提示
				uni.$u.http.post('/medical-api/rightsUse/qryRightsUsingStatusCountByDoc', {
					docId: this.account.user.userId,
					serviceItemType: '101',
					broadClassify: '4',
				}).then(res => {
					this.fuzhenNum = res.data
					if (this.serviceItemType == '99') {
						this.listBtn[0].canSee = this.fuzhenNum.todo > 0 ? true : false
						this.listBtn[1].canSee = this.fuzhenNum.doing > 0 ? true : false
						// this.listBtn[2].canSee = this.phoneNum.done > 0 ? true : false
					}
				});
			},

			getPhoneNum() {
				//权益使用待接诊数量查询  这里电话咨询的新增做了红点提示
				uni.$u.http.post('/medical-api/rightsUse/qryRightsUsingStatusCountByDoc', {
					docId: this.account.user.userId,
					serviceItemType: '102'
				}).then(res => {
					this.phoneNum = res.data
					if (this.serviceItemType == '102') {
						this.listBtn[0].canSee = this.phoneNum.todo > 0 ? true : false
						this.listBtn[1].canSee = this.phoneNum.doing > 0 ? true : false
						// this.listBtn[2].canSee = this.phoneNum.done > 0 ? true : false
					}
				});
			},
			getVideoNum() {
				//权益使用待接诊数量查询  这里电话咨询的新增做了红点提示
				uni.$u.http.post('/medical-api/rightsUse/qryRightsUsingStatusCountByDoc', {
					docId: this.account.user.userId,
					serviceItemType: '103'
				}).then(res => {
					this.phoneNumVideo = res.data
					if (this.serviceItemType == '103') {
						this.listBtn[0].canSee = this.phoneNumVideo.todo > 0 ? true : false
						this.listBtn[1].canSee = this.phoneNumVideo.doing > 0 ? true : false
						// this.listBtn[2].canSee = this.phoneNumVideo.done > 0 ? true : false
					}
				});
			},
			chatList() {
				//医生查询权益使用记录
				uni.showLoading({
					title: '请求中'
				});
				let param = {}
				//复诊续方跟图文电话咨询传参不一样
				if (this.serviceItemType == '99') {
					param = {
						docId: this.account.user.userId,
						// 复诊续方传参
						broadClassify: 4,
						// 咨询状态(2:待接诊 3:接诊中 9:已完成)
						status: this.status
					}
				} else {
					param = {
						docId: this.account.user.userId,
						// 咨询类型(101:图文咨询 102:电话咨询 103:视频咨询)
						serviceItemType: this.serviceItemType,
						// 咨询状态(2:待接诊 3:接诊中 9:已完成)
						status: this.status
					}
				}

				uni.$u.http.post('/medical-api/rightsUse/qryRightsUseRecordByDoc', param).then(res => {
					uni.hideLoading();
					uni.stopPullDownRefresh()
					this.listData = res.data
					this.listData.forEach((item, index) => {
						//默认的图文咨询时间
						item.createdTime = '申请时间：' + item.createdTime
						console.log('serviceItemType', this.serviceItemType)
						if (this.serviceItemType == '102') {
							switch (this.status) {
								case '2':
									item.createdTime = '预约时间：' + item.appointTime.substring(0, 10) + ' ' +
										item
										.appointPeriod.substring(3)
									this.$set(item, 'statusText', '待接诊')
									break;
								case '3':
									item.createdTime = '待处理时间：' + item.confirmTime.substring(0, 10) + ' ' +
										item
										.confirmPeriod.substring(3)
									this.$set(item, 'statusText', '已预约')
									break;
									// case '4':
									// case '5': //已拒诊归纳到已完成
								case '9':
									item.createdTime = '结束时间：' + item.updatedTime
									this.$set(item, 'statusText', '已结束')
									break;
								default:
									break;
							}

						} else if (this.serviceItemType == '99') {
							switch (this.status) {
								case '2':
									this.$set(item, 'statusText', '待接诊')
									break;
								case '3':
									this.$set(item, 'statusText', '问诊中')
									break;

								case '9':
									this.$set(item, 'statusText', '已结束')
									break;
								default:
									break;
							}
							//复诊续方
							item.createdTime = item.appointTime.substring(0, 10) + ' ' + item
								.appointPeriod
						}
					})
				});
			},
			getData(index) {
				//获取权益购买时提交的资料
				uni.$u.http.get('/medical-api/rightsUse/getRightsReqData', {
					params: {
						rightsId: this.listData[index].rightsId,
					}
				}).then(res => {
					this.illData = res.data
					this.illData.images = this.illData.images.split(',')
				});
			},
			// goAsk() {
			// 	this.show = false
			// 	this.showAsk = true
			// },
			// goAskFang() {
			// 	this.detailPopShow = false
			// 	this.showAsk = true
			// },

			goRefuse() {
				//拒诊
				uni.showLoading({
					title: '请求中'
				});
				uni.$u.http.post('/medical-api/rightsUse/rejectRightsUseReq', {
					id: this.choseOne.id,
				}).then(res => {
					uni.hideLoading()
					if (res.code == 0) {
						this.showRefuse = false
						this.refreshAllData()
						uni.showToast({
							title: '操作成功！',
							icon: 'none'
						});
					}

				});
			},
			goOn() {
				// 接诊
				uni.showLoading({
					title: '请求中'
				});
				uni.$u.http.post('/medical-api/rightsUse/confirmRightsUseReq', {
					id: this.choseOne.id,
					confirmTime: this.formatDateFull(new Date())
				}).then(res => {
					uni.hideLoading()
					if (res.code == 0) {
						uni.setStorageSync('taskItem', this.choseOne);
						this.showGoOn = false
						this.refreshAllData()
						if (this.serviceItemType == '101') {
							uni.navigateTo({
								url: `/pages2/pages/TUI-Chat-Group2/chat?conversationID=GROUP${this.choseOne.imGroupId}`
							});
						} else if (this.serviceItemType == '99') {
							//接诊成功跳详情
							uni.navigateTo({
								url: `./detailFz?item=${encodeURIComponent(JSON.stringify(this.choseOne))}`,
							})
							// uni.navigateTo({
							// 	url: `/pages2/pages/TUI-Chat-Group2/chat?conversationID=GROUP${this.choseOne.imGroupId}`
							// });
						}

					}

				});
			},

			/**
			 * 结束问诊
			 */
			endTalk() {
				uni.showLoading({
					title: '请求中'
				});
				uni.$u.http.post('/medical-api/rightsUse/endRightsUseReq', {
					id: this.choseOne.id,
				}).then(res => {
					uni.hideLoading()
					if (res.code == 0) {
						this.showEnd = false
						uni.showToast({
							title: '操作成功！',
							icon: 'none'
						});
						this.refreshAllData()
					}
				});
			},

			onClickFuzhenItem(item, index) {
				this.choseOne = JSON.parse(JSON.stringify(this.listData[index]))
				uni.navigateTo({
					// url: './detailPhone?rightsId=' + this.listData[index].rightsId
					url: `./detailFz?item=${encodeURIComponent(JSON.stringify(this.choseOne))}`,
				})
				// switch (this.choseOne.status) {
				// 	case 2:
				// 		//弹询问窗去接诊	现在改成跳转页面，还是有接诊拒诊按钮
				// 		// this.show = true
				// 		// this.getData(index)

				// 		break;
				// 		//跳转聊天室
				// 	case 3:
				// 		// uni.setStorageSync('taskItem', this.choseOne);
				// 		// uni.navigateTo({
				// 		// 	url: `/pages2/pages/TUI-Chat-Group2/chat?conversationID=GROUP${this.choseOne.imGroupId}`
				// 		// });
				// 		break;
				// 	case 4:
				// 	case 5:
				// 		// uni.setStorageSync('taskItem', this.choseOne);
				// 		// uni.navigateTo({
				// 		// 	url: `/pages2/pages/TUI-Group-History/chat?conversationID=GROUP${this.choseOne.imGroupId}`
				// 		// });
				// 		break;
				// }
			},

			onTextRefuse(item, index) {
				this.choseOne = JSON.parse(JSON.stringify(this.listData[index]))
				console.log('onTextRefuse')
				this.showRefuse = true
			},
			onTextGoOn(item, index) {
				this.choseOne = JSON.parse(JSON.stringify(this.listData[index]))
				console.log('onTextGoOn')
				this.showGoOn = true
			},

			goPopEnd(item, index) {
				this.choseOne = JSON.parse(JSON.stringify(this.listData[index]))
				this.showEnd = true
			},

			goChufang(item, index) {
				this.choseOne = JSON.parse(JSON.stringify(this.listData[index]))
				uni.setStorageSync('taskItem', this.choseOne);
				// 图文  电话  视频 传consultOrderPrescription  ；复诊续方传 appPrePrescription
				uni.navigateTo({
					// url: `/pages2/pages/chufang2/cf-add?preType=consultOrderPrescription`
					url: `/pages2/pages/chufang2/cf-add?preType=appPrePrescription`

				});
			},

			goChatClick(item, index) {
				this.choseOne = JSON.parse(JSON.stringify(this.listData[index]))
				this.goChatRoom()
			},
			goChatRoom() {
				uni.setStorageSync('taskItem', this.choseOne);
				uni.navigateTo({
					url: `/pages2/pages/TUI-Chat-Group2/chat?conversationID=GROUP${this.choseOne.imGroupId}`
				});
			},

			showComments(item, index) {
				this.choseOne = JSON.parse(JSON.stringify(this.listData[index]))
				this.$refs.TUIViewRate.open(this.choseOne.orderId);
			},

			goChatHistory(item, index) {
				this.choseOne = JSON.parse(JSON.stringify(this.listData[index]))
				uni.setStorageSync('taskItem', this.choseOne); //TODO 去聊天可能要改
				uni.navigateTo({
					url: `/pages2/pages/TUI-Group-History/chat?conversationID=GROUP${this.choseOne.imGroupId}`
				});
			},


			onClickVideo(item, index) {
				//接诊中跳打视频，其他跳详情
				if (item.status == 3) {
					this.getMyDetail(item)
				} else {
					uni.navigateTo({
						// url: './detailPhone?rightsId=' + this.listData[index].rightsId
						url: `./detailVideo?item=${encodeURIComponent(JSON.stringify(item))}`,
					})
				}
			},

			getMyDetail(item) {
				uni.$u.http.post('/medical-api/rightsUse/qryRightsUseRecord', {
					id: item.id,
				}).then(res => {
					uni.hideLoading()
					item.serviceTime = res.data[0].serviceTime
					item.usedServiceTime = res.data[0].usedServiceTime

					if (item.serviceTime - item.usedServiceTime <= 0) {
						uni.showToast({
							title: '您的视频通话时长已用尽！',
							icon: 'none'
						});
						return
					}
					//TODO视频代码
					this.startVideoCall(item.id)
					// this.$refs.TUICall.groupCall('M_1678244033869307906', ['1841']);
					// this.$refs.TUICall.call('1841');
					this.$refs.TUICall.call(item.userId, item.imGroupId);
				});
			},

			onClickVideoItem(item, index) {
				uni.navigateTo({
					// url: './detailPhone?rightsId=' + this.listData[index].rightsId
					url: `./detailVideo?item=${encodeURIComponent(JSON.stringify(item))}`,
				})

			},

			startVideoCall(id) {
				uni.$u.http.get('/medical-api/rightsUse/startVedio', {
					params: {
						tradeId: id,
					}
				}).then(res => {
					if (res.code == 0) {
						console.log('上报视频电话成功')
					}
				})
			},

			close() {
				this.show = false
			},
			clickTab(item) {
				console.log('item', item)
				switch (item.index) {
					case 0:
						// 咨询类型(101:图文咨询 102:电话咨询 103:视频咨询  复诊续方 99)
						//这里处理复诊续方，前端自定义一个serviceItemType 99，表示复诊续方
						this.serviceItemType = '99'
						// this.listTab[0].badge.value = 0
						this.listBtn[1].name = '问诊中'
						this.chatList()
						this.listBtn[0].canSee = this.fuzhenNum.todo > 0 ? true : false
						this.listBtn[1].canSee = this.fuzhenNum.doing > 0 ? true : false
						break;
					case 1:
						// this.serviceItemType = '102'
						// this.listBtn[1].name = '待处理'
						// this.chatList()
						// this.listBtn[0].canSee = this.phoneNum.todo > 0 ? true : false
						// this.listBtn[1].canSee = this.phoneNum.doing > 0 ? true : false
						break;
						// case 2:
						// 	//视频咨询
						// 	this.serviceItemType = '103'
						// 	this.listBtn[1].name = '待处理'
						// 	// this.listTab[2].badge.value = 0
						// 	this.chatList()
						// 	this.listBtn[0].canSee = this.phoneNumVideo.todo > 0 ? true : false
						// 	this.listBtn[1].canSee = this.phoneNumVideo.doing > 0 ? true : false
						// 	break;
						// case 3:
						// 	//原视频咨询不要了  这里处理复诊续方，前端自定义一个serviceItemType 99，表示复诊续方
						// 	this.serviceItemType = '99'
						// 	this.listBtn[1].name = '问诊中'
						// 	// this.listTab[2].badge.value = 0
						// 	this.chatList()
						// 	this.listBtn[0].canSee = false
						// 	this.listBtn[1].canSee = false
						// 	this.listBtn[2].canSee = false
						// 	if (this.serviceItemType == '99') {
						// 		this.listBtn[0].canSee = this.listTab[3].badge.value > 0 ? true : false
						// 		// this.listBtn[1].canSee = this.phoneNum.doing > 0 ? true : false
						// 		// this.listBtn[2].canSee = this.phoneNum.done > 0 ? true : false
						// 	}
						// 	break;
				}

			},
			clickBtn(index) {
				this.listBtn.forEach((item) => {
					item.isChecked = false
				})
				this.listBtn[index].isChecked = true
				switch (index) {
					case 0:
						this.status = '2'
						this.chatList()
						break;
					case 1:
						this.status = '3'
						this.chatList()
						break;
					case 2:
						this.status = '9'
						this.chatList()
						break;
				}
			},

			formatDate(date) {
				date = new Date(date);
				let myyear = date.getFullYear();
				let mymonth = date.getMonth() + 1;
				let myweekday = date.getDate();
				mymonth < 10 ? (mymonth = '0' + mymonth) : mymonth;
				myweekday < 10 ? (myweekday = '0' + myweekday) : myweekday;
				return `${myyear}-${mymonth}-${myweekday}`;
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

<style lang="scss" scoped>
	/deep/ .u-badge {
		position: relative;
		top: -4px;
		left: -5px;

	}

	/deep/ .u-status-bar {
		height: 0 !important;
	}

	.wrap {
		min-height: 100vh;
		background-color: #F5F5F5;

		// .u-sticky__content {
		// 	background-color: white !important;
		// }

		.u-tabs {
			background-color: white;
		}

		/deep/ .u-tabs__wrapper__scroll-view {
			background-color: white !important;
		}

		// .u-tabs__wrapper {
		// 	background-color: white;
		// }

		// .u-sticky {
		// 	background-color: white;
		// }

		.view-info {
			padding: 30rpx 30rpx;
			overflow: hidden;
			width: 92vw;
			background-color: white;
			display: flex;
			flex-direction: row;
			align-items: center;

			.btn-wrap {
				width: 30vw;
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-items: center;

				.btn-def {
					display: flex;
					flex-direction: row;
					align-items: center;
					font-size: 28rpx;
					border-radius: 30rpx;
					padding: 8rpx 45rpx;
					border: #F2F2F2 1rpx solid;
					color: #4D4D4D;
					background-color: #F2F2F2;
				}

				.btn-dot {
					width: 9px;
					height: 9px;
					margin-left: -8px;
					margin-top: -11px;
					background-color: #F56C6C;
					// border: #F56C6C 1rpx solid;
					border-radius: 9px;
				}

				.active {
					border: #EBF4FF 1rpx solid;
					color: #409EFF;
					background-color: #EBF4FF;
				}
			}

		}

		.view-list-video {
			margin: 20rpx;
			background-color: white;
			border-radius: 5rpx;
			padding: 20rpx;



			.view-video-list {
				display: flex;
				flex-direction: column;
				font-size: 28rpx;
				// background-color: #00C8DC;

				.v-line {
					width: 1rpx;
					height: 30rpx;
					background-color: #999999;
				}

			}
		}

		.view-list {

			.view-info-list {
				margin-left: 30rpx;
				margin-right: 30rpx;
				padding-bottom: 30rpx;
				// margin: 30rpx 30rpx 0 30rpx;
				overflow: hidden;

				width: 92vw;
				display: flex;
				flex-direction: row;
				align-items: center;
				flex-shrink: 0;

				.view-info-personal-list {
					flex-shrink: 0;
					display: flex;
					margin-left: 30rpx;
					flex: 1;
					flex-direction: column;
					// align-items: center;

					.info-personal-list {
						margin-top: 5rpx;
						display: flex;
						flex-direction: row;
					}
				}
			}
		}

		.wrap-pop {

			display: flex;
			flex-direction: column;

			max-height: 1200rpx;

			width: 550rpx;
			// height: 930rpx;

			margin-bottom: 30rpx;

			// background-color: white;
			// border-radius: 15rpx;
			overflow: hidden;
			box-sizing: border-box;


			.pop-top {
				background-color: #409EFF;
				width: 100%;
				border: 1px solid #409EFF;
				padding: 10rpx 0;
				border-radius: 15rpx 15rpx 0 0;
				display: flex;
				flex-direction: row;
				justify-content: center;

				.pop-info {
					color: white;
					display: flex;
					flex-direction: row;
				}
			}



			.info-title {
				color: #1A1A1A;
				font-weight: bold;
				margin: 30rpx 30rpx 0 30rpx;
				font-size: 30rpx;
			}

			.info-desc {
				color: #4D4D4D;
				margin: 15rpx 30rpx 0 30rpx;
				font-size: 28rpx;
			}

			.info-pics {
				margin: 30rpx 30rpx 0 30rpx;
			}

			.view-btn {
				width: 100%;
				margin-top: 30rpx;
				display: flex;
				flex-direction: row;
				justify-content: center;

				.view-btn-in {
					width: 80%;
					display: flex;
					flex-direction: row;
					align-items: center;
				}
			}
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

		.detailviewimgview {
			padding-left: 30rpx;

			padding-top: 30rpx;
		}
	}
</style>

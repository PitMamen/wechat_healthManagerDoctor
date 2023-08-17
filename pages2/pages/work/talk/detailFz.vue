<template>
	<view class="wrap">
		<view class="v-status-top">
			<!-- 5个点分情况展示 -->
			<view class="v-dot dot-red" v-if="passItem.status==2"></view>
			<view class="v-dot dot-blue" v-if="passItem.status==3"></view>
			<view class="v-dot" v-if="passItem.status==4"></view>
			<view class="v-dot dot-blue-dark" v-if="passItem.status==5"></view>
			<view class="v-status-name">{{statusName}}</view>
		</view>
		
		<view class="v-package">
			<view class="v-p-name">套餐信息</view>
			<view class="v-line"></view>
			<view class="v-p-item">
				<view class="v-item-name">套餐名称：</view>
				<view class="v-item-value">{{rightDetail.commodityName}}</view>
			</view>
			<view class="v-p-item">
				<view class="v-item-name">咨询类型：</view>
				<view class="v-item-value">{{rightDetail.commodityClassName}}</view>
			</view>
			<view class="v-p-item">
				<view class="v-item-name">咨询回合：</view>
				<view class="v-item-value">{{rightDetail.textNum}}</view>
			</view>
		</view>
		
		<view class="v-package" style="margin-top: 20rpx;">
			<view class="v-p-name">问诊信息</view>
			<view class="v-line"></view>
			<view class="v-p-item">
				<view class="v-item-name">预约时间：</view>
				<view class="v-item-value">{{rightDetail.appointTime}}</view>
			</view>
			<block v-if="passItem.status!=2 && rightDetail.medicalInfos && rightDetail.medicalInfos.length>0">
				<view class="v-p-item" v-for="item in rightDetail.medicalInfos" :key="item.preNo">
					<view class="v-item-name">处方/用药建议：</view>
					<view class="v-item-value" style="color: #409EFF;" @click="chufangHandler(item)">查看详情</view>
				</view>
			</block>
		</view>
		
		<view class="v-patient-info" style="margin-top: 20rpx;">
			<view class="v-pa-up">
				<view class="v-name-des" style="flex: 1;">患者信息</view>
				<view class="info-des" style="color: #1A1A1A;">
					{{rightDetail.userInfo.userName}} | {{rightDetail.userInfo.userSex}} | {{rightDetail.userInfo.userAge}}
				</view>
			</view>
			<view class="v-line"></view>
			<view style="overflow-y: auto;">
				<view class="info-title">病情描述</view>
				<view class="info-desc">{{rightDetail.diseaseDesc}}</view>
				<view class="info-pics" v-if="rightDetail.images && rightDetail.images.length>0">
					<u-album :previewFullImage="false" :urls="rightDetail.images" multipleSize="80"></u-album>
				</view>
				<view class="info-title">希望获得帮助</view>
				<view class="info-desc">{{rightDetail.appealDesc || '---'}}</view>
			</view>
		</view>
		
		<view class="v-package" style="margin-top: 20rpx;">
			<view class="v-p-name">订单信息</view>
			<view class="v-line"></view>
			<view class="v-p-item">
				<view class="v-item-name">订单编号：</view>
				<view class="v-item-value">{{rightDetail.orderId}}</view>
			</view>
			<view class="v-p-item">
				<view class="v-item-name">支付时间：</view>
				<view class="v-item-value">{{rightDetail.payTime}}</view>
			</view>
			<view class="v-p-item">
				<view class="v-item-name">订单费用：</view>
				<view class="v-item-value" style="color: #E14C4C;">￥{{rightDetail.orderTotal}}</view>
			</view>
		</view>
		
		<view
			class="v-patient-info"
			style="margin-top: 20rpx;padding-bottom: 50rpx;"
			v-if="passItem.status==2 || passItem.status==3 || showHistory"
		>
			<!-- 待接诊按钮 -->
			<view class="view-btn-wait" v-if="passItem.status==2">
				<view
					style="width: 50%;text-align: center;;font-size:30rpx;padding: 17rpx 60rpx;background-color: #E14C4C;color: white;border-radius: 8rpx;"
					@click="goPopRefuse">拒诊</view>
				<view
					style="width: 50%;text-align: center;margin-left: 30rpx;font-size:30rpx;padding:  17rpx 60rpx;background-color: #409EFF;color: white;border-radius: 8rpx;"
					@click="goOn">接诊</view>
			</view>
			<!-- 待处理按钮 -->
			<view class="view-btn-handle" v-if="passItem.status==3">
				<view
					style="width: 18%;text-align: center;;font-size:30rpx;padding: 17rpx 30rpx;background-color: #E14C4C;color: white;border-radius: 8rpx;"
					@click="goPopEnd">结束问诊</view>
				<view
					v-if="rightDetail.diagnosisFlag.value==1"
					style="width: 30%;text-align: center;margin-left: 20rpx;font-size:30rpx;padding:  17rpx 0;background-color: #409EFF;color: white;border-radius: 8rpx;"
					@click="sendBag">{{btnName}}</view>
				<view
					style="width: 30%;text-align: center;margin-left: 20rpx;font-size:30rpx;padding:  17rpx 30rpx;background-color: #409EFF;color: white;border-radius: 8rpx;"
					@click="goCall">进入诊室</view>
			</view>
			<!-- 已结束按钮 -->
			<view class="view-btn-handle" v-if="showHistory">
				<view
					style="width: 18%;text-align: center;;font-size:30rpx;padding: 17rpx 30rpx;background-color: #409EFF;color: white;border-radius: 8rpx;"
					@click="goHistory">交流记录</view>
			</view>
		</view>
		
		<u-modal title="拒诊" confirmText="确定" @cancel="() => showAsk = false" showCancelButton :show="showAsk"
			closeOnClickOverlay @confirm="goRefuse" @close="() => showAsk = false">
			<view>请确认是否拒诊？</view>
		</u-modal>
		<u-modal title="结束问诊" confirmText="确定" @cancel="() => showEnd = false" showCancelButton :show="showEnd"
			closeOnClickOverlay @confirm="endTalk" @close="() => showEnd = false">
			<view>请确认是否结束问诊？</view>
		</u-modal>
		<block v-if="showRate">
			<TUI-view-rate ref="TUIViewRate" />
			<view class="wrap-rate">
				<view class="btn-rate" @click="viewRateHandler">查看评价</view>
			</view>
		</block>
		
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
				mProgress: 1,
				ggg: 20,
				canSendBag: true,
				showHistory: false, //赠送过就显示查看聊天记录
				btnName: '开具处方',
				rightsId: '',
				rightDetail: {},
				innerAudioContext: {},
				mPeriod: '',
				statusName: '',
				clickTimeName: '',
				mCallTime: '---',
				passItem: '',
				audioUrl: 'https://develop.mclouds.org.cn/content-api/file/S20230310102901327FU9MCYTI30CPRS-13027496952_01053189990_18627596225_20230309163615_00163e0888b39a0e11edbe5574c45d16.mp3',
				showAsk: false,
				showEnd: false,
				showRate: false,
				current: {
					// poster: 'https://web-assets.dcloud.net.cn/unidoc/zh/music-a.png',
					name: '致爱丽丝',
					author: '暂无',
					src: 'https://develop.mclouds.org.cn/content-api/file/S20230310102901327FU9MCYTI30CPRS-13027496952_01053189990_18627596225_20230309163615_00163e0888b39a0e11edbe5574c45d16.mp3',
				},
				audioAction: {
					method: 'pause'
				},

				account: {
					user: {}
				}
			}
		},
		onLoad(options) {
			this.passItem = JSON.parse(decodeURIComponent(options.item));
			// 咨询状态(2:待接诊 3:接诊中 9:已完成)   2待接诊3问诊中4已结束5已拒诊
			console.log('this.passItem ', this.passItem)
			if (this.passItem.status == 2) {
				this.statusName = '待接诊'
			} else if (this.passItem.status == 3) {
				this.statusName = '待处理'
			} else if (this.passItem.status == 4) {
				this.statusName = '已完成'
			} else if (this.passItem.status == 5) {
				this.statusName = '已拒诊'
			}
			this.rightsId = this.passItem.rightsId
			uni.setStorageSync('timeDate', '');
			this.checkRate();
		},
		onReady() {},
		onShow() {
			this.account = uni.getStorageSync('account') || {
				user: {}
			};
			let timeDate = uni.getStorageSync('timeDate') || '';
			if (timeDate && this.rightDetail && this.rightDetail.rightsUseRecordStatus) {
				this.clickTimeName = timeDate
			}
			this.mPeriod = timeDate.substring(11);
			console.log('timeDate', timeDate)
			console.log('this.mPeriod', this.mPeriod)
            this.getRightDetail();
		},
		onPullDownRefresh() {

		},
		onHide() {
			this.rightDetail.voiceTapeInfo.forEach((item, index) => {
				if (item.isPlaying) {
					this.innerAudioContext.pause()
					item.isPlaying = false
					item.iconUrl = item.isPlaying ? "/pages2/static/static/images/side/pause.png" :
						"/pages2/static/static/images/side/play.png"
				}
			})
			// this.rightDetail.voiceTapeInfo.forEach((item, index) => {
			// 	//获取到的是数组所以引用[0]
			// 	console.log('获取元素编号', index)
			// 	console.log('获取元素', this.$refs[`player${index}`])
			// 	this.$refs[`player${index}`][0].pauseAudio()
			// })
		},
		onUnload() {
			this.rightDetail.voiceTapeInfo.forEach((item, index) => {

				//获取到的是数组所以引用[0]
				console.log('获取元素编号', index)
				console.log('获取元素', this.$refs[`player${index}`])
				this.rightDetail.voiceTapeInfo.forEach((item, index) => {
					if (item.isPlaying) {
						this.innerAudioContext.pause()
						this.innerAudioContext = null
					}
				})

				// this.$refs[`player${index}`][0].pauseAudio()
				// this.$refs[`player${index}`][0].destroyAudio()

			})
		},

		methods: {
			/**
			 * 点击播放和暂停按钮
			 * @param {Object} index
			 */
			onClick(index) {
				let playingIndex = this.rightDetail.voiceTapeInfo.findIndex(item => {
					return item.isPlaying
				});
				//有播放中的，且是当前点击的
				console.log('playingIndex', playingIndex)
				if (playingIndex != -1) {
					if (playingIndex == index) { //有播放中的，且是当前点击的
						this.innerAudioContext.pause()
						this.rightDetail.voiceTapeInfo[index].isPlaying = false
						this.rightDetail.voiceTapeInfo[index].iconUrl = "/pages2/static/static/images/side/play.png"
					} else { //有播放中的，不是当前点击的   此时暂停播放中的，播放当前点击的
						this.innerAudioContext.pause()
						// this.changePlay(index)
						this.goPlay(index)
						this.innerAudioContext.play()
						this.rightDetail.voiceTapeInfo[playingIndex].isPlaying = false
						this.rightDetail.voiceTapeInfo[playingIndex].iconUrl = "/pages2/static/static/images/side/play.png"

						this.rightDetail.voiceTapeInfo[index].isPlaying = true
						this.rightDetail.voiceTapeInfo[index].iconUrl = "/pages2/static/static/images/side/pause.png"
					}

				} else { //没有播放中的
					// this.changePlay(index)
					this.goPlay(index)
					this.innerAudioContext.play()
					console.log('goPlay', index)
					this.rightDetail.voiceTapeInfo[index].isPlaying = true
					this.rightDetail.voiceTapeInfo[index].iconUrl = "/pages2/static/static/images/side/pause.png"
				}

			},
			onChange(index) {
				console.log('onChange index', index)
				console.log('onChange progress', this.rightDetail.voiceTapeInfo[index].progress)
				if (this.rightDetail.voiceTapeInfo[index].isPlaying) {
					console.log('seek progress', this.rightDetail.voiceTapeInfo[index].progress)
					this.innerAudioContext.seek(this.rightDetail.voiceTapeInfo[index].progress)
					// this.goPlay(index)
					// this.innerAudioContext.play()
				}
			},
			chufangHandler(item) {
				uni.navigateTo({
					url: `/pages2/pages/chufang2/cf-detail?preNo=${item.preNo}`
				});
			},

			goPlay(readyIndex) {
				this.innerAudioContext = null
				this.innerAudioContext = uni.createInnerAudioContext()
				if (!this.rightDetail.voiceTapeInfo || this.rightDetail.voiceTapeInfo.length == 0) {
					return
				}
				this.innerAudioContext.src = this.rightDetail.voiceTapeInfo[readyIndex].callTape;
				// this.innerAudioContext.startTime = this.rightDetail.voiceTapeInfo[readyIndex].progress;
				let that = this
				this.innerAudioContext.onPlay(() => {
					this.rightDetail.voiceTapeInfo.forEach((item, index) => {
						if (item.isPlaying && item.progress > 0) {
							console.log('seek onPlay ', item.progress);
							// this.innerAudioContext.pause()
							this.innerAudioContext.seek(item.progress)

						}
					})
					console.log('开始播放');
				});

				this.innerAudioContext.onError((res) => {
					console.log(res.errMsg);
					console.log(res.errCode);
				});

				this.innerAudioContext.onEnded((res) => {
					console.log('onEnded', res);

					this.rightDetail.voiceTapeInfo.forEach((item, index) => {
						if (item.isPlaying) {
							item.progress = 0
							item.isPlaying = false
							item.iconUrl = '/pages2/static/static/images/side/play.png'
						}
					})

				});
				this.innerAudioContext.onTimeUpdate((res) => {
					this.rightDetail.voiceTapeInfo.forEach((item, index) => {
						if (item.isPlaying) {
							item.progress = this.innerAudioContext.currentTime.toFixed(0)

							console.log('onTimeUpdate progress', item.progress);
							// console.log('onTimeUpdate innerAudioContext', this.innerAudioContext);
						}
					})

				});
			},

			goPopRefuse() {
				this.showAsk = true
			},
			goPopEnd() {
				this.showEnd = true
			},

			getMyDetail() {
				uni.$u.http.post('/medical-api/rightsUse/qryRightsUseRecord', {
					id: this.passItem.id,
				}).then(res => {
					uni.hideLoading()
					this.passItem.serviceTime = res.data[0].serviceTime
					this.passItem.usedServiceTime = res.data[0].usedServiceTime
					// this.passItem = res.data

					if (this.passItem.serviceTime - this.passItem.usedServiceTime <= 0) {
						uni.showToast({
							title: '您的视频通话时长已用尽！',
							icon: 'none'
						});
						return
					}
					this.startVideoCall()
					// this.$refs.TUICall.groupCall('M_1678244033869307906', ['1841']);
					// this.$refs.TUICall.call('1841');
					this.$refs.TUICall.call(this.passItem.userId, this.passItem.imGroupId);
				});
			},

			getRightDetail() {
				uni.showLoading({
					title: '请求中'
				});
				//获取权益购买时提交的资料
				uni.$u.http.get('/medical-api/rightsUse/getRightsInfo', {
					params: {
						rightsId: this.rightsId,
						tradeId: this.passItem.id,
					}
				}).then(res => {
					uni.hideLoading()
					this.rightDetail = res.data
					let str = ''
					if (this.rightDetail.rightsUseRecordStatus.confirmTime && this.rightDetail
						.rightsUseRecordStatus.confirmPeriod) {
						str = this.rightDetail.rightsUseRecordStatus.confirmTime.substring(0, 10) + ' ' + this
							.rightDetail.rightsUseRecordStatus.confirmPeriod.substring(9)
					}

					// this.clickTimeName = str || '点击设置服务时间'
					if (!(this.passItem.status == 2 && this.mPeriod)) {
						this.clickTimeName = str || '点击设置服务时间'
					}
					
					if (this.passItem.status == 5) {
						this.clickTimeName = this.rightsUseRecordStatus.updatedTime
					}
					this.rightDetail.images = this.rightDetail.images.split(',')
					if (this.rightDetail.voiceTapeInfo && this.rightDetail.voiceTapeInfo.length > 0) {
						this.mCallTime = this.rightDetail.voiceTapeInfo[0].callTime

						this.rightDetail.voiceTapeInfo.forEach((item, index) => {
							item.duration = parseInt(item.duration)
							this.$set(item, 'progress', 0)
							this.$set(item, 'isPlaying', 0)
							this.$set(item, 'iconUrl', '/pages2/static/static/images/side/play.png')
						})
					}

					if (this.rightDetail.voiceTapeInfo && this.rightDetail.voiceTapeInfo.length > 0) {
						this.goPlay(0)
					}

					//处理逻辑
					if (this.rightDetail.rightsUseRecordStatus.serviceFrequency > 0 && this.passItem.status ==
						4) {
						this.showHistory = true
					}
				});
			},


			goChooseTime() {
				let dd = this.rightDetail.rightsUseRecordStatus.status == 3 ? true : false
				uni.navigateTo({
					url: './chooseTime?appointPeriod=' + this.rightDetail.rightsUseRecordStatus.appointPeriod +
						'&appointTime=' + this.rightDetail.rightsUseRecordStatus.appointTime +
						'&isModify=' + dd +
						'&id=' + this.passItem.id +
						'&confirmPeriod=' + this.rightDetail.rightsUseRecordStatus.confirmPeriod +
						'&confirmTime=' + this.rightDetail.rightsUseRecordStatus.confirmTime
				})
			},

			goRefuse() {
				uni.showLoading({
					title: '请求中'
				});
				//拒诊
				uni.$u.http.post('/medical-api/rightsUse/rejectRightsUseReq', {
					id: this.passItem.id,
				}).then(res => {
					uni.hideLoading()
					if (res.code == 0) {
						this.showAsk = false
						this.statusName = '已拒诊'
						this.passItem.status = 5
						//TODO是否要处理status字段
						uni.showToast({
							title: '操作成功！',
							icon: 'none'
						});
						this.getRightDetail();
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
					id: this.passItem.id,
				}).then(res => {
					uni.hideLoading()
					if (res.code == 0) {
						this.statusName = '已完成'
						this.passItem.status = 4
						this.showEnd = false
						uni.showToast({
							title: '操作成功！',
							icon: 'none'
						});
						this.getRightDetail();
					}
				});
			},

			sendBag() {
				if (this.canSendBag) {
					uni.setStorageSync('taskItem', this.passItem);
					uni.navigateTo({
						url: `/pages2/pages/chufang2/cf-add?preType=consultOrderPrescription`

					});
				} else {
					uni.setStorageSync('taskItem', this.passItem);
					uni.navigateTo({
						url: `/pages2/pages/TUI-Chat-Group2/chat?conversationID=GROUP${this.passItem.imGroupId}`
					});
				}

			},
			goCall() {
				uni.setStorageSync('taskItem', this.passItem);
				uni.navigateTo({
					url: `/pages2/pages/TUI-Chat-Group2/chat?conversationID=GROUP${this.passItem.imGroupId}`
				});
			},

			startVideoCall() {
				uni.$u.http.get('/medical-api/rightsUse/startVedio', {
					params: {
						tradeId: this.passItem.id,
					}
				}).then(res => {
					if (res.code == 0) {
						console.log('上报视频电话成功')
					}
				})
			},

			onStart(audioIndex) {
				console.log('点击了第' + (audioIndex) + '个')
				let that = this
				this.rightDetail.voiceTapeInfo.forEach((item, index) => {
					if (index != audioIndex) {
						//获取到的是数组所以引用[0]
						console.log('获取元素编号', index)
						console.log('获取元素', that.$refs[`player${index}`])
						that.$refs[`player${index}`][0].pauseAudio()
					}
				})
			},

			/**
			 * 接诊 需要先选时段
			 */
			goOn() { //TODO 接诊逻辑，判断是否还有视频时间
				// 接诊
				uni.showLoading({
					title: '请求中'
				});

				let timeDate = uni.getStorageSync('timeDate') || '';
				// if (timeDate && this.rightDetail && this.rightDetail.rightsUseRecordStatus) {
				// 	this.clickTimeName = timeDate
				// }

				uni.$u.http.post('/medical-api/rightsUse/confirmRightsUseReq', {
					id: this.passItem.id,
					confirmTime: this.formatDateFull(new Date())
				}).then(res => {
					if (res.code == 0) {
						uni.hideLoading();
						uni.showToast({
							title: '操作成功！',
							icon: 'none'
						});
						// let grpId = encodeURIComponent('M_' + this.passItem.orderId)
						uni.setStorageSync('taskItem', this.passItem);
						this.statusName = '待处理'
						this.passItem.status = 3
						this.show = false

					}

				});
			},

			goHistory() {
				// uni.setStorageSync('taskItem', this.passItem);
				// uni.navigateTo({
				// 	url: `/pages2/pages/TUI-Chat-Group/chat?conversationID=GROUP${this.passItem.imGroupId}`
				// });

				uni.setStorageSync('taskItem', this.passItem);
				uni.navigateTo({
					// url: '../../TUI-Chat-History/chat?toUserID=' + this.passItem.userId + '&conversationName=' +
					// 	this.passItem.userName

					url: `/pages2/pages/TUI-Group-History/chat?conversationID=GROUP${this.passItem.imGroupId}`
				})
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

			checkRate() {
				uni.$u.http.post(`/medical-api/tfUserAppraise/getAppraiseByOrderIdExists/${this.passItem.orderId}`).then(
					res => {
						this.showRate = res.data !== 0;
					});
			},
			viewRateHandler() {
				this.$refs.TUIViewRate.open(this.passItem.orderId);
			}
		}
	}
</script>

<style lang="scss" scoped>
	/deep/ .u-badge {
		position: relative;
		top: -4px;
		left: -5px;

	}

	.wrap {
		min-height: 100vh;
		padding-bottom: 140rpx;
		background-color: #F5F5F5;
		font-size: 28rpx;

		/deep/ .u-slider {
			width: 88%;
		}

		// background-color: white;
		.v-status-top {
			display: flex;
			padding: 30rpx 24rpx;
			align-items: center;
			flex-direction: row;

			.v-dot {
				width: 28rpx;
				height: 28rpx;
				border-radius: 28rpx;
				background-color: #47C000;
			}

			.dot-red {
				background-color: #f00;
			}

			// .dot-green {
			// 	background-color: #47C000;
			// }

			.dot-blue {
				background-color: #5A9CF8;
			}

			.dot-blue-dark {
				background-color: #0014C0;
			}

			.v-status-name {
				margin-left: 10rpx;
				flex: 1;
			}
		}

		.v-package {
			background-color: white;
			display: flex;
			flex-direction: column;
			padding: 30rpx;

			.v-p-name {
				color: #1A1A1A;
				font-size: 30rpx;
				font-weight: bold;

			}

			.v-line {
				margin-top: 30rpx;
				height: 1rpx;
				background-color: #CCCCCC;
			}

			.v-p-item {
				margin-top: 30rpx;
				display: flex;
				flex-direction: row;

				.v-voice {
					width: 70%;
					display: flex;
					flex-direction: row-reverse;
					align-items: center;
					// flex-wrap: wrap-reverse;
					flex-wrap: wrap
				}

				.v-item-name {
					color: #999999;
					flex: 1;
				}

				.v-item-value {
					color: #1A1A1A;
				}

				.v-point-time {
					color: #3181F0;
					background-color: #EFF6FF;
					padding: 16rpx 32rpx;
				}
			}



		}

		.v-patient-info {
			background-color: white;
			display: flex;
			flex-direction: column;
			padding: 30rpx;

			.v-pa-up {
				display: flex;
				flex-direction: row;

				.v-name-des {
					color: #1A1A1A;
					font-size: 30rpx;
					font-weight: bold;
				}
			}

			.v-line {
				margin-top: 30rpx;
				height: 1rpx;
				background-color: #CCCCCC;
			}

			.info-title {
				color: #1A1A1A;
				font-weight: bold;
				margin: 30rpx 30rpx 0 0;
				font-size: 28rpx;
			}

			.info-desc {
				color: #4D4D4D;
				margin: 15rpx 30rpx 0 0;
				font-size: 28rpx;
			}

			.info-pics {
				margin: 30rpx 30rpx 0 0;
			}

			.view-btn-wait {
				width: 100%;
				margin-top: 50rpx;
				display: flex;
				flex-direction: row;
				justify-content: center;

			}

			.view-btn-handle {
				width: 100%;
				margin-top: 50rpx;
				display: flex;
				flex-direction: row;
				justify-content: space-around;
			}
		}


	}

	.wrap-rate {
		position: fixed;
		flex-shrink: 0;
		left: 0;
		right: 0;
		bottom: 0;
		padding: 36rpx 24rpx;
		background: #FFFFFF;
		box-shadow: 0rpx 2rpx 3rpx 0rpx rgba(204, 204, 204, 0.35);

		.btn-rate {
			font-size: 30rpx;
			font-weight: 400;
			color: #FFFFFF;
			line-height: 68rpx;
			text-align: center;
			background: #5A9CF8;
			border-radius: 8rpx;
		}
	}
</style>

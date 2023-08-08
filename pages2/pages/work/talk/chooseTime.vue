<template>
	<view class="wrap">
		<!-- 患者意向预约时间 -->
		<view class="v-package" style="padding-bottom: 20rpx;">
			<view class="v-p-name">患者意向预约时间</view>
			<view class="v-line"></view>

			<view class="v-p-item" style="margin-top: 20rpx;">
				<view class="v-point-time">{{appointPeriod}}</view>
			</view>
		</view>

		<view style="height: 20rpx;background-color: #F5F5F5;"></view>
		<!-- 完成信息 -->
		<view class="v-package" style="height: 100vh;flex: 1;">
			<view class="v-p-name">拨打电话时间</view>
			<view class="v-line"></view>
			<view class="v-p-item" @click="showPicker">
				<view class="v-item-name" style="color: #1A1A1A;font-size: 32rpx;">日期：</view>
				<view class="v-time">{{dateStr}}</view>
				<u-icon name="arrow-right" color="#999999" style="width: 10px;height: 10px"></u-icon>
			</view>
			<view class="v-p-item">
				<view class="v-item-name" style="color: #1A1A1A;font-size: 32rpx;">时间：</view>
				<view @click="showPickerStartTime" class="v-time">{{startTimeStr+'-'+endTimeStr}}</view>
				<u-icon name="arrow-right" color="#999999" style="width: 10px;height: 10px"></u-icon>
			</view>


		</view>

		<view class="view-btn">
			<u-button text="确定" @click="btnConfirm" size="normal" type="primary"></u-button>
		</view>

		
		<u-datetime-picker title="选择日期" :show="showDate" v-model="dateNum" mode="date" closeOnClickOverlay
			@confirm="confirm" @cancel="cancel" @close="close"></u-datetime-picker>

		<u-datetime-picker title="选择开始时间" :show="showStartTime" v-model="startTimeStr" mode="time" closeOnClickOverlay
			@confirm="confirmStartTime" @cancel="cancelStartTime" @close="closeStartTime"></u-datetime-picker>

		<u-datetime-picker title="选择结束时间" :show="showEndTime" v-model="endTimeStr" mode="time" closeOnClickOverlay
			@confirm="confirmEndTime" @cancel="cancelEndTime" @close="closeEndTime"></u-datetime-picker>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				appointPeriod: '',
				appointTime: '',
				showDate: false,
				showStartTime: false,
				showEndTime: false,
				isModify: false,
				confirmTime: '',
				confirmPeriod: '',
				id: '',
				dateNum: Number(new Date()),
				dateStr: this.formatDate(new Date().getTime()),
				startTimeStr: '08:30',
				endTimeStr: '10:30',
				account: {
					user: {}
				}
			}
		},
		onLoad(options) {
			console.log('onLoad options', options)
			this.appointPeriod = options.appointPeriod
			this.appointTime = options.appointTime
			// this.isModify = options.isModify
			this.isModify = options.isModify == 'true' ? true : false
			this.confirmPeriod = options.confirmPeriod
			this.confirmTime = options.confirmTime
			this.id = options.id
			// debugger
			if (this.isModify) {
				this.dateNum = (new Date(this.confirmTime)).getTime()
				this.dateStr = this.confirmTime.substring(0, 10)

				this.startTimeStr = this.confirmPeriod.substring(9, 14)
				this.endTimeStr = this.confirmPeriod.substring(15)
			} else {
				this.dateNum = (new Date(this.appointTime)).getTime()
				this.dateStr = this.appointTime.substring(0, 10)

				this.startTimeStr = this.appointPeriod.substring(9, 14)
				this.endTimeStr = this.appointPeriod.substring(15)
			}

			console.log('onLoad appointTime', this.appointTime)
			console.log('onLoad startTimeStr', this.startTimeStr)
			console.log('onLoad endTimeStr', this.endTimeStr)
		},
		onReady() {},
		onShow() {

		},
		onPullDownRefresh() {

		},

		methods: {
			showPicker() {
				this.showDate = true
			},
			showPickerStartTime() {
				this.showStartTime = true
			},
			confirm(e) {
				console.log('confirm e', e)

				this.dateStr = this.formatDate(e.value)
				console.log('confirm dateStr', this.dateStr)
				this.showDate = false
			},
			cancel() {
				this.showDate = false
			},

			close() {
				this.showDate = false
			},

			confirmStartTime(e) {
				console.log('confirm e', e)
				this.startTimeStr = e.value
				console.log('confirm startTimeStr', this.startTimeStr)
				this.showStartTime = false
				this.showEndTime = true
			},
			cancelStartTime() {
				this.showStartTime = false
			},

			closeStartTime() {
				this.showStartTime = false
			},


			confirmEndTime(e) {
				console.log('confirm e', e)
				this.endTimeStr = e.value
				console.log('confirm endTimeStr', this.endTimeStr)
				this.showEndTime = false
			},
			cancelEndTime() {
				this.showEndTime = false
			},

			closeEndTime() {
				this.showEndTime = false
			},

			btnConfirm() {
				uni.setStorageSync('timeDate', this.dateStr + ' ' + this.startTimeStr + '-' + this.endTimeStr);
				if (this.isModify) {
					this.goMOdifyTime()
				} else {
					uni.navigateBack()
				}
			},

			goMOdifyTime() {
				uni.showLoading({
					title: '请求中'
				});
				//拒诊
				uni.$u.http.post('/medical-api/rightsUse/updateRightsUseConfirmTime', {
					id: this.id,
					confirmTime: this.dateStr + ' 00:00:00',
					confirmPeriod: this.startTimeStr + '-' + this.endTimeStr,
				}).then(res => {
					uni.hideLoading()
					if (res.code == 0) {
						uni.showToast({
							title: '修改时间成功！',
							icon: 'none'
						});
						uni.navigateBack()
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
				return `${myyear}-${mymonth}-${myweekday}`;
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

	.wrap {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		background-color: #fff;
		font-size: 28rpx;

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
				align-items: center;
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

		.view-btn {
			margin-top: 200rpx;
			padding: 24rpx;
		}


	}
</style>

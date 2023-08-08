<template>
	<view class="wrap">

		<view class="detail-status2" v-if="chufangItem.checkFlag==1">
			<view style="flex: 1;">{{chufangItem.statusText}}</view>
			<!-- <view class="btn">20小时12分后过期</view> -->
			<!-- 过期时间 timeOutTime 与当前时间做换算 -->
			<!-- <u-count-down :time="30 * 60 * 60 * 1000" format="DD:HH:mm:ss" autoStart millisecond @change="onChange"> -->
			<u-count-down :time="countTime" @finish="finish" format="DD:HH:mm:ss" autoStart millisecond
				@change="onChange">
				<view class="time">
					<text class="time__item">{{ timeData.days }}&nbsp;天</text>
					<text class="time__item">{{ timeData.hours>10?timeData.hours:'0'+timeData.hours}}&nbsp;时</text>
					<text class="time__item">{{ timeData.minutes }}&nbsp;分</text>
					<text class="time__item">{{ timeData.seconds }}&nbsp;秒后过期</text>
				</view>
			</u-count-down>
		</view>
		<view class="detail-status" v-else>
			<view  class="btn">{{chufangItem.checkFlag==5?'已取消':chufangItem.auditStatus.description}}</view>
		</view>
		<view class="detail-user">
			<view class="user-top">
				<view>{{chufangItem.hospitalName}}互联网医院</view>
			</view>
			<view class="user-top-status">普通</view>

			<view class="user-top" style="margin-top: 40rpx;">
				<view>电子处方笺</view>
			</view>

			<view class="user-info" style="margin-top: 40rpx;">
				<view style="width: 33%;">姓名：{{chufangItem.userName}}</view>
				<view style="width: 33%;">性别：{{chufangItem.userSex}}</view>
				<view style="width: 33%;">年龄：{{chufangItem.userAge}}</view>
			</view>
			<view class="user-info" style="margin-top: 40rpx;">
				<view style="width: 50%;">科室：{{chufangItem.deptName}}</view>
				<view style="width: 50%;">日期：{{formatDate(chufangItem.createTime)}}</view>
			</view>
		</view>
		<view class="detail-zhenduan" style="margin-top: 20rpx;">
			<view style="font-weight: bold;">诊断</view>
		</view>
		<view class="view-line2"></view>
		<view class="detail-zhenduan">
			<view> {{chufangItem.medicalOrdersCase?chufangItem.medicalOrdersCase.diagnosis:'' }} </view>
		</view>

		<view class="detail-medicine">
			<view style="padding: 30rpx;font-weight: bold;">
				Rp
			</view>
			<view class="item-medicine" v-for="(itemChild,indexChild) in chufangItem.userMedicalOrdersDetail"
				:key="itemChild.id">
				<view class="view-line2"></view>
				<view class="med-top">
					<view style="flex: 1;font-weight: bold;">{{indexChild+1}}.{{itemChild.drugName}}</view>
					<view style="font-weight: bold;">x{{itemChild.num}}{{itemChild.drugUnit || ''}}</view>
				</view>
				<view style="color: #999999;font-size: 24rpx;padding: 30rpx 24rpx 0 24rpx;">规格：{{itemChild.drugSpec}}
				</view>
				<view style="color: #4D4D4D;font-size: 24rpx;padding: 30rpx 24rpx ;">
					<!-- 用法用量：{{itemChild.useFrequency}}；{{itemChild.useNum}}{{itemChild.useUnit}}/1次；{{itemChild.useFrequencyName}} -->
					用法用量：{{itemChild.useNum}}{{itemChild.useUnit}}/1次；{{itemChild.useFrequencyName}} 
				</view>
			</view>

		</view>
		
		
		
		<!-- 备注 -->
		<view class="detail-zhenduan" style="margin-top: 20rpx;">
			<view style="font-weight: bold;font-weight: bold;">备注</view>
		</view>
		<view class="view-line2" style="height: 3rpx;"></view>
		<view style="display: flex;flex-direction: row;flex-wrap: wrap;padding: 30rpx 24rpx 20rpx 24rpx;background-color: white;">
			<view>{{chufangItem.prescriptionInstruction}}</view>
		</view>
		
		
		

		<!-- 签字盖章 -->
		<view class="detail-zhenduan" style="margin-top: 20rpx;">
			<view style="font-weight: bold;font-weight: bold;">签字盖章</view>
		</view>
		<view class="view-line2" style="height: 3rpx;"></view>
		<view style="display: flex;flex-direction: column;padding: 30rpx 24rpx 20rpx 24rpx;background-color: white;">
			<view v-if="!showCa">开方医生：{{chufangItem.docName}}</view>
			<view style="display: flex;align-items: center;" v-else>
				<view>开方医生：</view>
				<image :src="signUrl" mode="heightFix" style="width: auto;height: 60rpx;" />
			</view>
			<view style="margin-top: 30rpx;">执行科室：{{chufangItem.takeMedicineLocDesc}}</view>
				<view v-if="!showCa" style="margin-top: 30rpx;">审核药师：{{chufangItem.checkUserName || ''}}</view>
				<view style="display: flex;align-items: center;" v-else>
					<view>审核药师：</view>
					<image :src="chufangItem.checkerCerFile" mode="heightFix" style="width: auto;height: 60rpx;" />
				</view>
		</view>


		<view class="detail-remind">
			<view style="padding: 30rpx 24rpx 0 24rpx;">特别提示：</view>
			<view style="padding: 30rpx 24rpx 0 24rpx">1、本次处方仅限于中南大学湘雅二医院互联网医院使用，自行下 载配药不具有处方效力。</view>
			<view style="padding: 30rpx 24rpx 30rpx 24rpx">2、按照卫生部、国家中医药管理局卫医政发【2011】11号文件规 定：为保证患者用药安全，药品一经发出，不得退换
			</view>
		</view>
		<!-- 作废处方后按钮隐藏，状态变成 已取消 -->
		<!-- 审核标识（0：审核中1：审核通过待支付2：审核通过已支付;3审核未通过;4支付中;5已取消） -->
		<view @click="() => showAsk = true"" class=" btn-des" v-if="chufangItem.checkFlag !=5">作废处方</view>
		<view style="height: 60rpx;"></view>

		<u-modal class="wenzhen-modal" title="作废处方" showCancelButton cancelText="取消" confirmText="确认作废" :show="showAsk"
			closeOnClickOverlay @confirm="goFail" @cancel="() => showAsk = false" @close="() => showAsk = false">
			<view>请确认是否要作废当前处方？</view>
			<!-- <u--form labelPosition="left" ref="form">
		
			</u--form> -->
		</u-modal>
		
	</view>
</template>

<script>
	import {
		formatDate
	} from '../../components/base/common.js';
	export default {
		data() {
			return {
				value: '',
				signUrl: '',
				chufangItem: {},
				countTime: 0,
				showCa: false,
				showAsk: false,
				timeData: {},
				drugList: [{
					id: 1
				}, {
					id: 2
				}]
			}
		},
		onLoad(option) {
			this.value = option.value
			this.preNo = option.preNo

			this.getList();
			this.getShowCa();
			
			this.chufangItem = uni.getStorageSync('data_chufang');
			
			this.countTime = 60 * 1000
			// this.countTime = 30 * 60 * 60 * 1000
			// this.countTime = this.chufangItem.timeOutTime - new Date().getTime()
			if (this.countTime <= 0) {
				this.$set(this.chufangItem, 'checkFlag', 5)
				this.$set(this.chufangItem, 'statusText', '已取消')
			}
			console.log("ggg", this.countTime)
			console.log("fggg", this.chufangItem)

		},

		onReady() {},
		onShow() {},
		methods: {
			formatDate,
			onChange(e) {
				this.timeData = e
			},
			getShowCa() {
				uni.$u.http.get(`/info-api/sysConfigData/getConfig/CA_AUTH_FLAG`).then(res => {
					this.showCa = res.data.value === '1';
					if (this.showCa){
						this.getSignUrl();
					}
				});
			},
			getSignUrl() {
				uni.$u.http.get('/account-api/tdUserInfoCaAuthApplet/getsignatureForUserId', {}).then(res => {
					this.signUrl = res.data || '';
				});
			},
			goFail() {
				uni.$u.http.post('/medical-api/medical/cancelMedicalOrder', {
					preNo: this.chufangItem.preNo,
				}).then(res => {
					if (res.code == 0) {
						uni.showToast({
							title: '操作成功！',
							icon: 'none'
						});
						this.$set(this.chufangItem, 'checkFlag', 5)
						this.$set(this.chufangItem, 'statusText', '已取消')
						this.showAsk = false
					}
				});
			},

			getList() {
				const taskItem = uni.getStorageSync('taskItem');
				uni.$u.http.get('/medical-api/medical/getHistoryMedical', {
					params: {
						// userId: '1626', //TODO 写死的参数
						userId: taskItem.userInfo.userId,
						preNo: this.preNo,
					}
				}).then(res => {
					res.data = res.data || {};

					this.list = res.data || [];
					this.list.forEach((item) => {
						if (item.checkFlag == 1) {
							this.$set(item, 'statusText', '待付款')
						} else if (item.checkFlag == 2) {
							this.$set(item, 'statusText', '已结束')
						} else if (item.checkFlag == 5) {
							this.$set(item, 'statusText', '已取消')
						}
					})
					this.chufangItem = this.list[0]
					this.countTime = this.chufangItem.timeOutTime - new Date().getTime()
					if (this.countTime <= 0) {
						this.$set(this.chufangItem, 'checkFlag', 5)
						this.$set(this.chufangItem, 'statusText', '已取消')
					}

				});
			},

			finish() {
				this.$set(this.chufangItem, 'checkFlag', 5)
				this.$set(this.chufangItem, 'statusText', '已取消')
				this.showAsk = false
			}
		}
	}
</script>

<style>
	.wrap {
		/* padding: 20rpx 24rpx; */
		background: #F5F5F5;
		font-size: 30rpx;
		color: #1A1A1A;
		min-height: 100vh;
	}

	.wrap .view-line2 {
		height: 1rpx;
		/* margin: 0 30rpx; */
		background-color: #E6E6E6;
	}

	.wrap .detail-status {
		display: flex;
		color: white;
		background-color: #409EFF;
		padding: 25rpx 24rpx;
		flex-direction: row;
		align-items: center;
	}

	.wrap .detail-status2 {
		display: flex;
		color: white;
		background-color: red;
		padding: 25rpx 24rpx;
		flex-direction: row;
		align-items: center;
	}

	.wrap .detail-user {
		background-color: white;
		padding: 40rpx 24rpx;
	}

	.wrap .detail-user .user-top {
		display: flex;
		justify-content: center;
		flex-direction: row;
	}

	.wrap .detail-user .user-top-status {
		position: absolute;
		top: 207rpx;
		right: 24rpx;
		border-radius: 5rpx;
		border: 1rpx solid #409EFF;
		padding: 8rpx 20rpx;
		color: #409EFF;
	}

	.wrap .detail-user .user-info {
		display: flex;
		align-items: center;
		flex-direction: row;
	}

	.wrap .detail-zhenduan {
		display: flex;
		justify-content: center;
		background-color: white;
		padding: 30rpx 24rpx;
		/* align-items: center; */
		flex-direction: column;
	}

	.wrap .detail-medicine {
		background-color: white;
		margin-top: 20rpx;
	}

	.wrap .detail-medicine .item-medicine {
		display: flex;
		flex-direction: column;
	}

	.wrap .detail-medicine .item-medicine .med-top {
		padding: 30rpx 24rpx 0 24rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.wrap .detail-remind {
		background-color: white;
		color: #999999;
		font-size: 24rpx;
		margin-top: 20rpx;
		display: flex;
		flex-direction: column;
		/* align-items: center; */
	}

	.wrap .btn-des {
		margin-top: 100rpx;
		background-color: #409EFF;
		margin: 40rpx 24rpx;
		padding: 20rpx 0;
		text-align: center;
		border-radius: 8rpx;
		color: white;
	}
</style>
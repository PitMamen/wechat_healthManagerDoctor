<template>
	<view class="wrap">
		<u-empty v-if="list.length === 0" mode="data" icon="/pages2/static/static/images/data.png"></u-empty>
		<view style="height: 20rpx;background-color: #F5F5F5;" v-show="false"></view>
		<view class="item" :class="{first: index==0}" v-for="(item,index) in list" :key="index" @click="goDetail(item)"
			>
			<view class="item-top">
				<view class="top-left">
					<view style="color: #1A1A1A;font-size: 30rpx;font-weight: bold;">{{item.userName}}</view>
					<view style="margin-left: 42rpx;font-size: 28rpx;">{{item.userSex}}</view>
					<view class="view-line" style="margin-left: 30rpx;"></view>
					<view style="margin-left: 30rpx;">{{item.userAge}}岁</view>
				</view>
				<view class="btn" @click.stop="useItem(item)">引用</view>
			</view>
			<view class="view-line2"></view>
			<view class="item-mid">
				<view class="med-item" v-for="(itemChild,indexChild) in list[index].userMedicalOrdersDetail"
					:key="itemChild.goodsId">
					<view style="flex: 1;">{{itemChild.drugName}}</view>
					<view>x{{itemChild.num}}{{itemChild.drugUnit || ''}}</view>
				</view>
			</view>
			<view class="view-line2"></view>
			<view class="item-bottom">
				<!-- <view style="flex: 1;"> 2023-05-26</view> -->
				<view style="flex: 1;"> {{formatDate(item.createTime)}}</view>
				<!-- 审核标识（0：审核中1：审核通过待支付2：审核通过已支付;3审核未通过;4支付中;5已取消） -->
				<view v-if="item.checkFlag ==1" style="color: red;">{{item.statusText}}</view>
				<view v-if="item.checkFlag ==2" style="color: #409EFF;">{{item.statusText}}</view>
				<view v-if="item.checkFlag ==5" style="color: #999999;">{{item.statusText}}</view>
				<!-- 		<view v-if="item.status ==1"
					style="color: #409EFF;display: flex;flex-direction: row;align-items: center">
					<view>待付款：</view>
					<view style="color: #FF0000;">12小时20分后过期</view>
				</view> -->
			</view>
		</view>
		<u-modal class="wenzhen-modal" title="温馨提示" showCancelButton cancelText="取消" confirmText="确认" :show="showAsk"
			closeOnClickOverlay @confirm="goFill" @cancel="() => showAsk = false" @close="() => showAsk = false">
			<view>引用历史处方会覆盖当前的诊断和药品，确认使用？</view>
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
				item: {},
				showAsk: false,
				list: []
			}
		},
		onLoad(option) {
			this.value = option.value
			this.getList()
		},
		onReady() {},
		onShow() {},
		methods: {
			formatDate,
			getList() {
				const taskItem = uni.getStorageSync('taskItem');
				uni.$u.http.get('/medical-api/medical/getHistoryMedical', {
					params: {
						// userId: '1626' //TODO 写死的参数
						userId: taskItem.userInfo.userId
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
				});
			},

			useItem(item) {

				this.item = item
				let cfInfo = uni.getStorageSync('cf-info');

				if ((cfInfo.medicalOrdersCaseList && cfInfo.medicalOrdersCaseList.length > 0) || (cfInfo
						.medicalOrdersDetails && cfInfo.medicalOrdersDetails.length > 0)) {
					this.showAsk = true
				} else {
					this.goFill()
				}

				console.log('fff', JSON.stringify(cfInfo))

			},

			goFill() {
				let cfInfo = uni.getStorageSync('cf-info');
				let arr = this.item.medicalOrdersCase.diagnosis.split(',')
				let arr2 = this.item.medicalOrdersCase.diagnosisCode.split(',')
				let arr3 = []

				arr.forEach((item, index) => {
					arr3.push({
						diagnosis: arr[index],
						diagnosisCode: arr2[index]
					})
				})

				// let cfInfo = uni.getStorageSync('cf-info');
				cfInfo.medicalOrdersCaseList = arr3


				this.item.userMedicalOrdersDetail.forEach((itemIn) => {
					// item.drugCode = item.code;
					// item.price = item.unitPrice;
					// item.drugName = item.genericName;
					// item.drugSpec = item.specification;
					// item.drugUnit = item.valuationUnit;

					this.$set(itemIn, 'code', itemIn.drugCode)
					this.$set(itemIn, 'unitPrice', itemIn.price)
					this.$set(itemIn, 'genericName', itemIn.drugName)
					this.$set(itemIn, 'specification', itemIn.drugSpec)
					this.$set(itemIn, 'valuationUnit', itemIn.drugUnit)

				})

				cfInfo.medicalOrdersDetails = this.item.userMedicalOrdersDetail
				uni.setStorageSync('cf-info', cfInfo);
				this.showAsk = false
				uni.navigateBack({
					delta: 1
				});
			},

			goDetail(item) {
				uni.setStorageSync('data_chufang', item)
				uni.navigateTo({
					url: `/pages2/pages/chufang2/cf-detail?preNo=${item.preNo}`
				});
			}
		}
	}
</script>

<style>
	.wrap {
		padding: 20rpx 24rpx;
		background: #F5F5F5;
		font-size: 28rpx;
		min-height: 100vh;
	}

	.wrap .view-line {
		width: 1rpx;
		height: 28rpx;
		margin-top: 10rpx;
		background-color: #1A1A1A;
	}

	.wrap .item {
		border-radius: 5rpx;
		margin-top: 20rpx;
		background-color: white;

	}

	.wrap .first {
		margin-top: 0;
		background-color: white;
	}

	.wrap .item .item-top {
		display: flex;
		align-items: center;
		padding: 30rpx;
		flex-direction: row;
	}

	.wrap .item .item-top .btn {
		color: #409EFF;
		background-color: #F6FAFF;
		border-radius: 26rpx;
		padding: 5rpx 29rpx;
		border: solid 1rpx #409EFF;
	}

	.wrap .item .item-top .top-left {
		display: flex;
		flex-direction: row;
		flex: 1;
	}

	.view-line2 {
		height: 1rpx;
		margin: 0 30rpx;
		background-color: #E6E6E6;
	}

	.wrap .item .item-mid {
		display: flex;
		/* padding: 15rpx 30rpx; */
		padding-top: 15rpx;
		padding-bottom: 15rpx;
		flex-direction: column;
	}

	.wrap .item .item-mid .med-item {
		padding: 15rpx 30rpx;
		display: flex;
		align-items: center;
		flex-direction: row;
	}

	.wrap .item .item-bottom {
		display: flex;
		align-items: center;
		padding: 42rpx 30rpx;
		flex-direction: row;
	}
</style>
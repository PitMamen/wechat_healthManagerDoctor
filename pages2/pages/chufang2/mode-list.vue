<template>
	<view class="wrap">
		<view class="head">
			<view class="tab">
				<view class="tabitem" :class="{active: tab===1}"  @click="tabClick(1)">
					<view>本院处方</view>
				</view>
				<view class="tabitem" :class="{active: tab===2}" @click="tabClick(2)">
					<view>外流处方</view>
				</view>
			</view>
			
		</view>
		
			<u-empty v-if="list.length === 0" mode="data" icon="/pages2/static/static/images/data.png"></u-empty>
			<view style="height: 20rpx;background-color: #F5F5F5;" v-show="false"></view>
			<view class="item"  v-for="(item,index) in list" :key="index">
				<view class="itemview">
					<view class="title">诊断</view>
					<view class="zd">{{item.diagnosis}}</view>
				</view>
				<view class="itemview">
					<view class="title">药品</view>
					<view class="item-mid">
						<view class="med-item" v-for="(itemChild,indexChild) in list[index].medicalOrdersTemplateDetail"
							:key="itemChild.id">
							<view style="flex: 1;">{{itemChild.drugName}}</view>
							<view>x{{itemChild.num}}{{itemChild.drugUnit || ''}}</view>
						</view>
					</view>
				</view>
				<view class="btn" @click.stop="useItem(item)">修改</view>
			</view>
			
			<view style="height: 150rpx;"></view>
		
		
		<view  class="fix">		
			<view class="save-btn" @click="addMode()">添加模版</view>
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
				list: [],
				tab: 1,
			}
		},
		onLoad(option) {
		
			
		},
		onReady() {},
		onShow() {
			this.getList()
		},
		methods: {
			formatDate,
			
			getList() {
				uni.$u.http.get('/medical-api/medical/getMyMedicalTemp', 
				{params: {
					templateType:this.tab===1?'appPrePrescription':'consultOrderPrescription'
				}}
				).then(res => {
					this.list = res.data || [];
					
					
				});
			
			},
		tabClick(tab) {
				this.tab=tab
				this.getList()
			},
			useItem(item) {

				var preType=this.tab===1?'appPrePrescription':'consultOrderPrescription'
				uni.navigateTo({
					url:'./mode-edit?id='+item.id+'&preType='+preType
				})

			},
			addMode(){
				var preType=this.tab===1?'appPrePrescription':'consultOrderPrescription'
				uni.navigateTo({
					url:'./mode-edit?preType='+preType
				})
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

<style lang="scss">
	page{
		background: #F5F5F5;
	}
	.fix {
			position: fixed;
			bottom: 0;
			left: 0;
			width: 750rpx;
			padding-bottom: 30rpx;
			background: #F5F5F5;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;

			
			.save-btn {
			margin-left: 30rpx;
			width: 690rpx;
			font-size: 30rpx;
			font-weight: 400;
			color: #FFFFFF;
			line-height: 70rpx;
			text-align: center;
			background: #409EFF;
			border-radius: 10rpx;
			margin-right: 30rpx;
			
			}
		}
	.wrap {
		
		
		font-size: 28rpx;
	
				
		.head {
			background: #FFFFFF;
			.tab {
				display: flex;
				align-items: center;
				justify-content: space-between;
				border-bottom: 1rpx solid #E6E6E6;
				.tabitem {
					flex: 1;
					font-size: 30rpx;
					font-weight: 400;
					color: #999999;
					line-height: 88rpx;
					text-align: center;
					&.active {
						view {
							display: inline-block;
							color: #409EFF;
							border-bottom: 5rpx solid #409EFF;
						}
					}
				}
			}
			
		}
	}

	

	.button {
		position: fixed;

		width: 702rpx;
		
		left: 24rpx;
		bottom: 30rpx;

		color: #ffffff;
		background-color: #3894FF !important;

		border-color: #3894FF !important;
		border-radius: 10rpx;
		
	}
	.wrap .view-line {
		width: 1rpx;
		height: 28rpx;
		margin-top: 10rpx;
		background-color: #1A1A1A;
	}
	.wrap .itemview{
		display: flex;
		flex-direction: row;
		margin:0 30rpx 30rpx 30rpx;
	}
	.wrap .itemview .title{
		width: 80rpx;
		min-width: 80rpx;
		font-size: 28rpx;
		color: #999999;
	}
	.wrap .itemview .zd{
		font-size: 28rpx;
		color: #1A1A1A;
	}
	

	.wrap .item {
		border-radius: 5rpx;
		margin-top: 20rpx;
		background-color: white;
		margin-left: 24rpx;
		padding: 30rpx 0;
		width: 702rpx;
	}

	

	.wrap .item .item-top {
		display: flex;
		align-items: center;
		padding: 30rpx;
		flex-direction: row;
	}

	.wrap .item .btn {
		color: #409EFF;
		background-color: #F6FAFF;
		border-radius: 26rpx;
		padding: 5rpx 29rpx;
		border: solid 1rpx #409EFF;
		    width: 80rpx;
		    margin-left: auto;
			margin-right: 30rpx;
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
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
		flex: 1;
		flex-direction: column;
	}

	.wrap .item .item-mid .med-item {
		margin-bottom: 20rpx;
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

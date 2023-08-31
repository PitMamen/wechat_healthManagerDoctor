<template>
	<view class="wrap">
		<view class="headers">
			<view class="status" :style="{height: statusHeight + 'px'}"></view>
			<view class="navigator" :style="{height: navigatorHeight + 'px'}">
				<u-icon name="arrow-left" color="#FFFFFF" size="36rpx" @click="goBack()"></u-icon>
				<view class="title">收入明细</view>
			</view>
		</view>
		<view class="filter">
			<view class="date">
				<view class="contain" @click="show = true; hideKeyboard();">
					<view class="text">{{ createdTime.replace('-', '年') }}月</view>
					<u-icon name="arrow-down" color="#FFFFFF" size="28rpx"></u-icon>
				</view>
			</view>
			<view class="time">入账周期：{{ timePeriod }}</view>
			<view class="tabs">
				<view class="item" :class="{active: settlementStatus===0}" @click="tabClick(0)">全部</view>
				<view class="item" :class="{active: settlementStatus===1}" @click="tabClick(1)">待结算</view>
				<view class="item" :class="{active: settlementStatus===2}" @click="tabClick(2)">已结算</view>
				<view class="item" :class="{active: settlementStatus===3}" @click="tabClick(3)">不予结算</view>
			</view>
		</view>
		<view class="content">
			<u-empty mode="data" icon="/pages2/static/img/icon_nodata.png" v-if="list.length === 0"></u-empty>
			<scroll-view class="list" :scroll-y="true" @scrolltolower="scrolltolower" v-else>
				<view class="item" v-for="(item, index) in list" :key="index">
					<view class="row row1">
						<view class="time">{{ item.createdTime }}</view>
						<view class="status">{{ item.settlementStatus }}</view>
					</view>
					<view class="row row2">
						<view class="desc">{{ item.orderType }}</view>
						<view class="price">￥{{ item.paySum }}</view>
					</view>
				</view>
			</scroll-view>
		</view>
		
		<u-datetime-picker
		    mode="year-month"
			:show="show"
			:maxDate="maxDate"
			@close="close"
			@cancel="close"
			@confirm="confirm"
		></u-datetime-picker>
	</view>
</template>

<script>
	import moment from 'moment';
	
	export default {
		data() {
			return {
				list: [],
				total: 0,
				pageNo: 1,
				pageSize: 20,
				show: false,
				flag: false,
				settlementStatus: 0,
				maxDate: new Date().getTime(),
				createdTime: this.formatDate(new Date()),
				headerHeight: getApp().globalData.headerInfo.height,
				statusHeight: getApp().globalData.headerInfo.statusBarHeight,
				navigatorHeight: getApp().globalData.headerInfo.navigatorHeight
			}
		},
		onLoad() {
			this.getList();
			this.geneTimePeriod(new Date());
		},
		onShow() {
		},
		methods: {
			getList() {
				uni.showLoading({
					title:'正在加载'
				});
				uni.$u.http.post(`/medical-api/userRightsSettlement/getIncomeDetailsByLoginUser`, {
					pageNo: this.pageNo,
					pageSize: this.pageSize,
					createdTime: this.createdTime,
					settlementStatus: this.settlementStatus===0 ? undefined : this.settlementStatus
				}).then(res => {
					uni.hideLoading();
					this.total = res.data.total;
					this.list = this.list.concat(res.data.records);
				}).finally(() => {
					this.flag = false;
				});
			},
			scrolltolower() {
				if (this.pageNo*this.pageSize >= this.total){
					return;
				}
				if (this.flag){
					return;
				}
				this.flag = true;
				this.pageNo ++;
				this.getList();
			},
			hideKeyboard() {
				uni.hideKeyboard();
			},
			goBack() {
				uni.navigateBack({
					delta: 1
				});
			},
			formatDate(date) {
				date = new Date(date);
				let myyear = date.getFullYear();
				let mymonth = date.getMonth() + 1;
				mymonth < 10 ? (mymonth = '0' + mymonth) : mymonth;
				return `${myyear}-${mymonth}`;
			},
			geneTimePeriod(date) {
				const moment1 = moment(date).startOf('month');
				const moment2 = moment(date).endOf('month');
				this.timePeriod = `${moment1.format('YYYY.MM.DD')}至${moment2.format('YYYY.MM.DD')}`;
			},
			tabClick(settlementStatus) {
				if (this.settlementStatus === settlementStatus){
					return;
				}
				this.settlementStatus = settlementStatus;
				this.pageNo = 1;
				this.total = 0;
				this.list = [];
				this.getList();
			},
			close() {
				this.show = false;
			},
			confirm(event) {
				this.createdTime = this.formatDate(event.value);
				this.geneTimePeriod(event.value);
				this.pageNo = 1;
				this.total = 0;
				this.list = [];
				this.close();
				this.getList();
			}
		}
	}
</script>

<style lang="scss">
	.wrap {
		min-height: 100vh;
		background: #FFFFFF;
		.headers {
			background: #5AB0FF;
			.navigator {
				position: relative;
				display: flex;
				align-items: center;
				justify-content: center;
				>.u-icon {
					position: absolute;
					left: 0;
					padding: 5rpx 10rpx;
				}
				.title {
					font-size: 36rpx;
					font-weight: 500;
					color: #FFFFFF;
					text-align: center;
				}
			}
		}
		.filter {
			padding: 10rpx 40rpx;
			background: #5AB0FF;
			.date {
				padding: 10rpx 0;
				.contain {
					display: flex;
					align-items: center;
					justify-content: space-between;
					width: 190rpx;
					height: 68rpx;
					padding: 0 20rpx;
					border: 2rpx solid #FFFFFF;
					border-radius: 4rpx;
					.text {
						font-size: 28rpx;
						font-weight: 400;
						color: #FFFFFF;
					}
					>.u-icon {
						position: relative;
						top: 2rpx;
					}
				}
			}
			.time {
				font-size: 28rpx;
				font-weight: 400;
				color: #FFFFFF;
				line-height: 48rpx;
			}
			.tabs {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 20rpx 0 5rpx 0;
				.item {
					font-size: 32rpx;
					font-weight: 400;
					color: #FFFFFF;
					line-height: 62rpx;
					border-bottom: 5rpx solid transparent;
					&.active {
						border-bottom: 5rpx solid #FFFFFF;
					}
				}
			}
		}
		.content {
			background: #FFFFFF;
			.u-empty {
				padding-top: 200rpx;
			}
			.list {
				max-height: calc(100vh - 40px - 40px - 300rpx);
				padding-top: 50rpx;
				overflow-y: auto;
				.item {
					margin-bottom: 30rpx;
					padding: 0 40rpx;
					&:last-child {
						margin-bottom: 10rpx;
					}
					.row {
						display: flex;
						align-items: center;
						justify-content: space-between;
						&.row1 {
							margin-bottom: 10rpx;
						}
						.time {
							font-size: 24rpx;
							font-weight: 400;
							color: #999999;
							line-height: 36rpx;
						}
						.status {
							width: 100rpx;
							font-size: 24rpx;
							font-weight: 400;
							color: #1A1A1A;
							line-height: 36rpx;
							text-align: center;
							background: #E6E6E6;
							border-radius: 2rpx;
						}
						.desc {
							font-size: 30rpx;
							font-weight: 400;
							color: #1A1A1A;
							line-height: 50rpx;
						}
						.price {
							font-size: 30rpx;
							font-weight: 400;
							color: #1A1A1A;
							line-height: 50rpx;
						}
					}
				}
			}
		}
	}
</style>

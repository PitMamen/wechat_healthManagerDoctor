<template>
	<view class="wrap">
		<view class="head">
			<view class="tab">
				<view class="item" :class="{active: tab===1}" @click="tabClick(1)">
					<view>本院复诊</view>
				</view>
				<view class="item" :class="{active: tab===2}" @click="tabClick(2)">
					<view>健康咨询</view>
				</view>
			</view>
			<view class="filter">
				<view class="item" @click="show1 = true; hideKeyboard();" v-if="tab === 2">
					<view class="name">{{text1 || '请选择类别'}}</view>
					<u-icon name="arrow-down" color="#1A1A1A" size="36rpx"></u-icon>
				</view>
				<view class="item" @click="show2 = true; hideKeyboard();">
					<view class="name">{{text2 || '请选择状态'}}</view>
					<u-icon name="arrow-down" color="#1A1A1A" size="36rpx"></u-icon>
				</view>
			</view>
		</view>
		<view class="content">
			<u-empty mode="data" style="padding-top: 300rpx;" icon="/pages2/static/img/icon_nodata.png" v-if="list.length === 0"></u-empty>
			<scroll-view class="list" :scroll-y="true" @scrolltolower="scrolltolower" v-else>
				<view class="item" v-for="item in list" :key="item.id" @click="itemClick(item)">
					<view class="top">
						<view class="left">
							<text class="name" v-if="item.broadClassify === 4">复诊续方</text>
							<text class="name" v-else>{{getTypeName(item.serviceItemType)}}</text>
							<text class="price">￥{{item.orderTotal}}</text>
						</view>
						<view class="right" :class="{red: item.status===2, blue: item.status===3}">{{item.statusName}}</view>
					</view>
					<view class="middle">
						<view class="line">
							<view class="title">患者信息：</view>
							<view class="desc">
								<text>{{item.userInfo.userName}}</text>
								<text class="split1">|</text>
								<text>{{item.userInfo.userAge}}岁</text>
								<text class="split1">|</text>
								<text>{{item.userInfo.userSex}}</text>
							</view>
						</view>
						<view class="line">
							<view class="title">病情描述：</view>
							<view class="desc">{{item.diseaseDesc || '---'}}</view>
						</view>
						<view class="line" v-if="item.broadClassify === 4">
							<view class="title">预约时间：</view>
							<view class="desc">
								<text>{{item.createdTime}}</text>
							</view>
						</view>
						<view class="line" v-else-if="item.serviceItemType === 101">
							<view class="title">申请时间：</view>
							<view class="desc">
								<text>{{item.createdTime}}</text>
							</view>
						</view>
						<view class="line" v-else>
							<view class="title">预约时间：</view>
							<view class="desc">
								<text>{{item.appointTimePeriod}}</text>
							</view>
						</view>
					</view>
					<view class="bottom">
						<view class="btn btn2">结束问诊</view>
						<view class="btn btn1">开具处方</view>
						<view class="btn btn1">进入诊室</view>
					</view>
				</view>
			</scroll-view>
		</view>
		
		<u-picker :show="show1" :columns="list1" @cancel="cancel1" @confirm="confirm1"></u-picker>
		<u-picker :show="show2" :columns="list2" @cancel="cancel2" @confirm="confirm2"></u-picker>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				serviceItemType: '',
				broadClassify: 4,
				status: '',
				tab: 1,
				
				flag: false,
				total: 0,
				pageNo: 1,
				list: [],
				
				show1: false,
				show2: false,
				text1: '',
				text2: '',
				list1: [[
					{text: '图文咨询',value: 101},
					{text: '电话咨询',value: 102},
					{text: '视频咨询',value: 103}
				]],
				list2: [[
					{text: '待接诊',value: 2},
					{text: '问诊中',value: 3},
					{text: '已结束',value: 9}
				]]
			}
		},
		computed: {
		},
		onLoad() {
			this.getList();
		},
		onReady() {
		},
		onShow() {
		},
		methods: {
			getList() {
				uni.showLoading({
					title:'正在加载'
				});
				uni.$u.http.post(`/medical-api/rightsUse/qryRightsUseRecordPageByDoc`, {
					docId: uni.getStorageSync('account').user.userId,
					serviceItemType: this.serviceItemType,
					broadClassify: this.broadClassify,
					status: this.status,
					pageNo: this.pageNo,
					pageSize: 10
				}).then(res => {
					uni.hideLoading();
					this.total = res.data.totalRows;
					this.list = this.list.concat(res.data.rows || []);
				}).finally(() => {
					this.flag = false;
				});
			},
			scrolltolower() {
				if (this.pageNo*10 >= this.total){
					return;
				}
				if (this.flag){
					return;
				}
				this.flag = true;
				this.pageNo ++;
				this.getList();
			},
			getTypeName(type) {
				const result = [
					{text: '图文咨询',value: 101},
					{text: '电话咨询',value: 102},
					{text: '视频咨询',value: 103}
				].find(item => {
					return item.value === type;
				}) || {};
				return result.text || '';
			},
			hideKeyboard() {
				uni.hideKeyboard();
			},
			changeTab(tab) {
				this.serviceItemType = '';
				this.broadClassify = '';
				this.status = '';
				
				this.pageNo = 1;
				this.total = 0;
				this.list = [];
				
				this.text1 = '';
				this.text2 = '';
				this.tab = tab;
				if (this.tab === 1){
					this.broadClassify = 4;
				}
				
				this.getList();
			},
			tabClick(tab) {
				if (this.tab === tab){
					return;
				}
				this.changeTab(tab);
			},
			itemClick(item) {},
			cancel1() {
				this.show1 = false;
			},
			cancel2() {
				this.show2 = false;
			},
			confirm1(e) {
				this.cancel1();
				this.text1 = e.value[0].text;
				this.serviceItemType = e.value[0].value;
				
				this.pageNo = 1;
				this.total = 0;
				this.list = [];
				this.getList();
			},
			confirm2(e) {
				this.cancel2();
				this.text2 = e.value[0].text;
				this.status = e.value[0].value;
				
				this.pageNo = 1;
				this.total = 0;
				this.list = [];
				this.getList();
			}
		}
	}
</script>

<style lang="scss">
	.wrap {
		min-height: 100vh;
		background: #F5F5F5;
		.head {
			background: #FFFFFF;
			.tab {
				display: flex;
				align-items: center;
				justify-content: space-between;
				border-bottom: 1rpx solid #E6E6E6;
				.item {
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
			.filter {
				display: flex;
				align-items: center;
				justify-content: space-between;
				.item {
					display: flex;
					align-items: center;
					justify-content: center;
					flex: 1;
					.name {
						font-size: 30rpx;
						font-weight: 400;
						color: #4D4D4D;
						line-height: 80rpx;
					}
					>.u-icon {
						position: relative;
						top: 2rpx;
						margin-left: 2rpx;
					}
				}
			}
		}
		.content {
			.list {
				max-height: calc(100vh - 170rpx);
				padding: 30rpx 24rpx;
				box-sizing: border-box;
				.item {
					margin-bottom: 30rpx;
					padding: 20rpx 30rpx;
					background: #FFFFFF;
					border-radius: 4rpx;
					&:last-child {
						margin-bottom: 0;
					}
					.top {
						display: flex;
						align-items: center;
						justify-content: space-between;
						padding-bottom: 20rpx;
						border-bottom: 1rpx solid #E6E6E6;
						.left {
							line-height: 50rpx;
							.name {
								font-size: 30rpx;
								font-weight: 500;
								color: #1A1A1A;
							}
							.price {
								margin-left: 25rpx;
								font-size: 28rpx;
								font-weight: 400;
								color: #F32B0C;
							}
						}
						.right {
							font-size: 28rpx;
							font-weight: 400;
							color: #999999;
							line-height: 50rpx;
							&.red {
								color: #F32B0C;
							}
							&.blue {
								color: #409EFF;
							}
							&.gray {
								color: #999999;
							}
						}
					}
					.middle {
						padding: 15rpx 0;
						.line {
							display: flex;
							align-items: flex-start;
							justify-content: flex-start;
							font-size: 28rpx;
							font-weight: 400;
							line-height: 60rpx;
							.title {
								color: #999999;
							}
							.desc {
								flex: 1;
								color: #1A1A1A;
								.split1 {
									padding: 0 25rpx;
								}
								.split2 {
									padding: 0 10rpx;
								}
							}
						}
					}
					.bottom {
						display: flex;
						align-items: center;
						justify-content: flex-end;
						padding-bottom: 10rpx;
						.btn {
							margin-left: 30rpx;
							width: 148rpx;
							height: 52rpx;
							font-size: 28rpx;
							font-weight: 400;
							line-height: 52rpx;
							text-align: center;
							border-radius: 24rpx;
							&.btn1 {
								color: #FEFEFE;
								background: #409EFF;
							}
							&.btn2 {
								color: #409EFF;
								background: #FFFFFF;
								border: 1rpx solid #409EFF;
							}
						}
					}
				}
			}
		}
	}
</style>

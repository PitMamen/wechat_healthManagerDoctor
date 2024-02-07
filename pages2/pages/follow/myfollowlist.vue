<template>
	<view class="wrap">
		<view class="head">
			<view class="tab">
				<view class="item" :class="{active: tab===1}" @click="tabClick(1)">
					<view>我的随访</view>
				</view>
				<view class="item" :class="{active: tab===2}" @click="tabClick(2)">
					<view>科室随访库</view>
				</view>
			</view>

			<view style="margin-left: 20rpx;margin-right: 20rpx;margin-top: 30rpx;">
				<u-search v-model="planName" placeholder="搜索随访计划" :show-action="false" @change="onSearch">
				</u-search>
			</view>

			<view class="filter">
				<view class="item" @click="show2 = true; hideKeyboard();">
					<view class="name">{{text2 || '请选择科室'}}</view>
					<u-icon name="arrow-down" color="#1A1A1A" size="36rpx"></u-icon>
				</view>
			</view>
		</view>
		<view class="content">
			<u-empty mode="data" style="padding-top: 500rpx;" icon="/pages2/static/img/icon_nodata.png"
				v-if="planList.length === 0"></u-empty>
			<scroll-view class="list" :scroll-y="true" @scrolltolower="scrolltolower" v-if="planList.length > 0">
				<view class="item"   v-for="(item, index) in planList"   :key="item.planId" @click="itemClick(item)">
					<view class="top">
						<view class="left">
							<view>{{item.planName}}</view>
							<view class="smll-kuang">{{item.subjectName}}</view>
							<view style="color: #999999;margin-top: 30rpx;font-size: 24rpx;">医生已使用{{item.sendCount}}次
							</view>
						</view>


						<view class="right">
							<view class="small">查看详情</view>
						</view>
					</view>
					
					<!-- bottom line -->
					<view v-if="index!=planList.length-1" style="height: 1rpx;background-color: #E6E6E6"></view>
					
					
					
				</view>
			</scroll-view>
		</view>

		<u-picker :show="show2" :columns="list2" @cancel="cancel2" @confirm="confirm2"></u-picker>
	</view>
</template>

<script>
	import tuicall from '@/pages2/components/common/tuicall';
	import TUIViewRate from '@/pages2/components/tui-rate/view/index';

	export default {
		data() {
			return {
				account: uni.getStorageSync('account'),
				serviceItemType: '',
				broadClassify: 4,
				status: '',
				tab: 1,

				flag: false,
				total: 0,
				pageNo: 1,

				show1: false,
				show2: false,
				text2: '',
				list2: [
					[]
				],
				planName: '',
				planList: [],
				type: '',
				userId:'',

				choseOne: null,
				showEnd: false,
				showGoOn: false,
				showRefuse: false
			}
		},
		components: {
			tuicall,
			TUIViewRate
		},
		computed: {},
		onLoad(options) {
			this.getDepList();
			this.getPlanList()
			if (options.type) {
				this.type = options.type
			}
			if(options.userId){
				this.userId = options.userId
			}


		},
		onReady() {},
		onShow() {},
		methods: {

			onSearch(planName) {
				console.log("plan:", planName)
				this.getPlanList()
			},



			// 科室列表
			getDepList() {
				uni.$u.http.get(`/follow-api/follow/plan/listSubject`, {
					params: {
						scene: 1
					}
				}).then(res => {
					this.list2 = [(res.data || []).map(item => {
						return {
							text: item.subjectName,
							value: item.subjectCode,
						};
					})];
				});

			},


			// 随访列表
			getPlanList() {
				uni.$u.http.post(`/follow-api/follow/plan/doctorPlans`, {
					queryText: this.planName || '',
					subjectCode: this.status || '',
					type: this.tab,
				}).then(res => {
					if (res.code == 0) {
						if (res.data) {
							this.planList = res.data
						}
					}
				});
			},

			// 后台说不考虑分页  以下实现无效
			scrolltolower() {
				if (this.pageNo * 10 >= this.total) {
					return;
				}
				if (this.flag) {
					return;
				}
				this.flag = true;
				this.pageNo++;
				this.getPlanList();
			},
			hideKeyboard() {
				uni.hideKeyboard();
			},
			resetPage() {
				this.pageNo = 1;
				this.total = 0;
				this.list = [];
			},
			changeTab(tab) {
				this.status = '';
				this.text2 = '';
				this.tab = tab;
				this.getPlanList();
			},
			tabClick(tab) {
				if (this.tab === tab) {
					return;
				}
				this.changeTab(tab);
			},


			itemClick(item) {
				uni.navigateTo({
					url: '/pages2/pages/follow/myfollowdetail?planId=' + item.planId+'&type='+this.type+'&userId='+this.userId

				})


			},
			
			
			formatDateFull(date) {
				date = new Date(date);
				let myyear = date.getFullYear();
				let mymonth = date.getMonth() + 1;
				let myweekday = date.getDate();
				let oHour = date.getHours();
				let oMin = date.getMinutes();
				let oSen = date.getSeconds();
				mymonth < 10 ? (mymonth = '0' + mymonth) : mymonth;
				myweekday < 10 ? (myweekday = '0' + myweekday) : myweekday;
				oHour < 10 ? (oHour = '0' + oHour) : oHour;
				oMin < 10 ? (oMin = '0' + oMin) : oMin;
				oSen < 10 ? (oSen = '0' + oSen) : oSen;
				return `${myyear}-${mymonth}-${myweekday} ${oHour}:${oMin}:${oSen}`;
			},

			cancel2() {
				this.show2 = false;
			},
			confirm2(e) {
				this.cancel2();
				this.text2 = e.value[0].text;
				this.status = e.value[0].value;

				this.getPlanList()
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

				// border-bottom: 1rpx solid #E6E6E6;
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
				max-height: calc(100vh - 174rpx);
				padding: 30rpx 24rpx;
				box-sizing: border-box;

				.item {
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
						// border-bottom: 1rpx solid #E6E6E6;

						.smll-kuang {
							// width: 140rpx;
							height: 42rpx;
							background: #EFF6FF;
							border: 1px solid #3894FF;
							border-radius: 2px;
							color: #367BF5;
							font-size: 22rpx;
							margin-top: 30rpx;
							align-items: center;
							text-align: center;
							padding-bottom: 13rpx;
							width: 160rpx;
						}


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
							margin-top: auto;


							.small {
								background: #FFFFFF;
								border: 1px solid #409EFF;
								border-radius: 31px;
								font-size: 28rpx;
								color: #409EFF;
								text-align: center;
								padding-bottom: 32rpx;
								padding-right: 10rpx;
								padding-top: 10rpx;
								padding-left: 10rpx;
								height: 25rpx;
								width: 130rpx;
							}



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
						height: 52rpx;
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

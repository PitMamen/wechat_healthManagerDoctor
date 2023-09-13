<template>
	<view class="wrap">
		<view class="content">
			<u-empty mode="data" icon="/pages2/static/img/icon_nodata.png" v-if="total === 0"></u-empty>
			<scroll-view class="list" :scroll-y="true" @scrolltolower="scrolltolower" v-else>
				<view class="item" v-for="item in list" :key="item.id">
					<view class="date" v-if="item.isDate">{{ item.key.replace('-', '年') }}月</view>
					<view class="nodate" @click="itemClick(item)" v-else>
						<view class="left" :class="{red: item.types==='退', green: item.types==='提'}">
							<view class="type">{{ item.types }}</view>
						</view>
						<view class="right">
							<view class="row">
								<view class="name bold">提现金额</view>
								<view class="value bold">￥{{ item.settlement_sum }}</view>
							</view>
							<view class="row">
								<view class="name">服务费</view>
								<view class="value">{{ item.manager_sum }}</view>
							</view>
							<view class="row">
								<view class="name">到账余额</view>
								<view class="value">{{ item.can_sum }}</view>
							</view>
							<view class="row">
								<view class="name">{{ item.create_time_month }}</view>
								<view class="value status" :class="{red: item.status==='提现失败', green: item.status==='提现成功'}">{{ item.status }}</view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				flag: false,
				list: [],
				total: 0,
				pageNo: 1,
				pageSize: 20
			}
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
				uni.$u.http.post(`/account-api/accountOrderSettlementMaster/getWithdrawalRecord`, {
					pageNo: this.pageNo,
					pageSize: this.pageSize
				}).then(res => {
					uni.hideLoading();
					this.total = res.data.total;
					this.geneList(res.data.records);
				}).finally(() => {
					this.flag = false;
				});
			},
			geneList(records) {
				let list_ = [];
				Object.keys(records).forEach(key => {
					const value = records[key];
					const index = this.list.findIndex(item => {
						return item.isDate && item.key===key;
					});
					if (index < 0){
						list_.push({
							key,
							isDate: true
						});
					}
					list_ = list_.concat(value);
				});
				this.list = this.list.concat(list_);
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
			itemClick(item) {
				uni.navigateTo({
					url: `/pages3/pages/cash/out-info?id=${item.id}&types=${item.types}`
				});
			}
		}
	}
</script>

<style lang="scss">
	.wrap {
		min-height: 100vh;
		background: #FFFFFF;
		.content {
			.u-empty {
				padding-top: 300rpx;
			}
			.list {
				max-height: 100vh;
				overflow-y: auto;
				.item {
					padding: 0 24rpx;
					.date {
						padding-top: 20rpx;
						font-size: 30rpx;
						font-weight: 400;
						color: #1A1A1A;
						line-height: 50rpx;
					}
					.nodate {
						display: flex;
						align-items: flex-start;
						justify-content: space-between;
						padding: 30rpx 0;
						border-bottom: 1rpx solid #E6E6E6;
						.left {
							width: 88rpx;
							height: 88rpx;
							margin-right: 20rpx;
							background: #F0B90C;
							border-radius: 50%;
							&.green {
								background: #5DB600;
							}
							&.red {
								background: #FF3838;
							}
							.type {
								font-size: 32rpx;
								font-weight: 400;
								color: #FFFFFF;
								line-height: 88rpx;
								text-align: center;
							}
						}
						.right {
							flex: 1;
							.row {
								display: flex;
								align-items: center;
								justify-content: space-between;
								.name {
									font-size: 24rpx;
									font-weight: 400;
									color: #999999;
									line-height: 44rpx;
									&.bold {
										font-size: 30rpx;
										color: #1A1A1A;
										line-height: 50rpx;
									}
								}
								.value {
									font-size: 24rpx;
									font-weight: 400;
									color: #999999;
									line-height: 44rpx;
									&.bold {
										font-size: 30rpx;
										color: #1A1A1A;
										line-height: 50rpx;
									}
									&.green {
										color: #5DB600 !important;
									}
									&.red {
										color: #FF3838 !important;
									}
									&.yellow {
										color: #CD9F11 !important;
									}
									&.status {
										width: 110rpx;
										font-size: 22rpx;
										font-weight: 400;
										color: #CD9F11;
										line-height: 38rpx;
										text-align: center;
										background: #FFF5D6;
										border: 1rpx solid #CD9F11;
										border-radius: 2rpx;
										&.green {
											background: #F5FFEA;
											border: 1rpx solid #5DB600;
										}
										&.red {
											background: #FFECEC;
											border: 1rpx solid #FF3838;
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
</style>

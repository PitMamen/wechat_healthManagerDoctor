<template>
	<view class="wrap">
		<view class="headers">
			<view class="status" :style="{height: statusHeight + 'px'}"></view>
			<view class="navigator" :style="{height: navigatorHeight + 'px'}">
				<view class="title">工作室</view>
			</view>
		</view>
		<view class="infos">
			<view class="left">
				<image :src="account.user.avatarUrl||'/static/static/images/header.png'" mode="aspectFill"></image>
				<view class="desc">
					<view class="name">刘医生的诊室</view>
					<view class="welcome">欢迎您，张医生</view>
				</view>
			</view>
			<view class="right">
				<view class="btn">随诊码</view>
				<view class="btn">名片</view>
			</view>
		</view>
		<view class="contents">
			<view class="auth">
				<view class="title">您可以进行实名认证</view>
				<view class="desc">实名认证通过后可以使用更多功能</view>
				<view class="btn">实名认证</view>
			</view>
			<view class="card" v-if="false">
				<view class="up">
					<view class="item">
						<view class="num">12</view>
						<view class="action">
							<view class="name">抢单池</view>
							<u-icon name="arrow-right" color="#999999" size="30rpx"></u-icon>
						</view>
					</view>
					<view class="item">
						<view class="num">12</view>
						<view class="action">
							<view class="name">待接诊</view>
							<u-icon name="arrow-right" color="#999999" size="30rpx"></u-icon>
						</view>
					</view>
					<view class="item">
						<view class="num">12</view>
						<view class="action">
							<view class="name">问诊中</view>
							<u-icon name="arrow-right" color="#999999" size="30rpx"></u-icon>
						</view>
					</view>
				</view>
				<view class="down">
					<view class="btn">问诊设置</view>
					<view class="btn">处方签名</view>
				</view>
			</view>
			<view class="apps">
				<view class="mask"></view>
				<view class="item">
					<image src="/static/static/images/index/app1.png"></image>
					<view class="name">处方模版</view>
				</view>
				<view class="item">
					<image src="/static/static/images/index/app2.png"></image>
					<view class="name">电话随访</view>
				</view>
				<view class="item">
					<image src="/static/static/images/index/app3.png"></image>
					<view class="name">我的团队</view>
				</view>
				<view class="item">
					<image src="/static/static/images/index/app4.png"></image>
					<view class="name">药品字典</view>
				</view>
				<view class="item">
					<image src="/static/static/images/index/app5.png"></image>
					<view class="name">知识宝典</view>
				</view>
			</view>
			<view class="notes">
				<view class="tabs">
					<view class="tab active">操作手册</view>
					<view class="tab">管理制度</view>
					<view class="tab">奖励政策</view>
					<view class="tab">问诊技巧</view>
				</view>
				<view class="note">
					<u-empty mode="data" icon="/pages2/static/img/icon_nodata.png" v-if="list.length === 0"></u-empty>
					<scroll-view class="list" :scroll-y="true" @scrolltolower="scrolltolower" v-else>
						<view class="item" v-for="item in list" :key="item.id">
							<view class="left">
								<view class="title">如何高效开具处方</view>
								<view class="date">2021-06-18</view>
							</view>
							<view class="right">
								<image :src="'/static/static/images/header.png'" mode="aspectFill"></image>
							</view>
						</view>
					</scroll-view>
				</view>
			</view>
		</view>
		<ca-check ref="caCheck" />
	</view>
</template>

<script>
	import caCheck from '@/components/ca/check';
	
	export default {
		data() {
			return {
				list: [1,2],
				total: 0,
				pageNo: 1,
				pageSize: 20,
				flag: false,
				
				account: uni.getStorageSync('account'),
				
				headerHeight: getApp().globalData.headerInfo.height,
				statusHeight: getApp().globalData.headerInfo.statusBarHeight,
				navigatorHeight: getApp().globalData.headerInfo.navigatorHeight
			}
		},
		components: {
			caCheck
		},
		onLoad() {
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
					pageSize: this.pageSize
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
			}
		}
	}
</script>

<style lang="scss">
	.wrap {
		min-height: 100vh;
		background: #F5F5F5;
		.headers {
			background: #3894FF;
			.navigator {
				position: relative;
				display: flex;
				align-items: center;
				justify-content: center;
				.title {
					font-size: 36rpx;
					font-weight: 500;
					color: #FFFFFF;
					text-align: center;
				}
			}
		}
		.infos {
			display: flex;
			align-items: flex-start;
			justify-content: space-between;
			padding: 20rpx 30rpx 120rpx 30rpx;
			background: #3894FF;
			.left {
				display: flex;
				align-items: center;
				justify-content: flex-start;
				flex: 1;
				image {
					width: 128rpx;
					height: 128rpx;
					margin-right: 30rpx;
					border-radius: 50%;
				}
				.desc {
					.name {
						font-size: 32rpx;
						font-weight: 400;
						color: #FFFFFF;
						line-height: 62rpx;
					}
					.welcome {
						font-size: 24rpx;
						font-weight: 400;
						color: #FFFFFF;
						line-height: 54rpx;
					}
				}
			}
			.right {
				display: flex;
				align-items: center;
				justify-content: flex-end;
				.btn {
					&:last-child {
						margin-right: 0rpx;
					}
					margin-right: 20rpx;
					width: 104rpx;
					font-size: 28rpx;
					font-weight: 400;
					color: #FFFFFF;
					line-height: 68rpx;
					text-align: center;
					background: #5EB6FF;
					border-radius: 4rpx;
				}
			}
		}
		.contents {
			padding: 0 30rpx;
			.auth {
				position: relative;
				top: -90rpx;
				padding: 20rpx 30rpx 30rpx 40rpx;
				overflow: hidden;
				background: #FFFFFF;
				box-shadow: 0rpx 2rpx 4rpx 0rpx rgba(230,230,230,0.35);
				border-radius: 4rpx;
				.title {
					font-size: 32rpx;
					font-weight: 500;
					color: #4D4D4D;
					line-height: 72rpx;
				}
				.desc {
					font-size: 28rpx;
					font-weight: 400;
					color: #999999;
					line-height: 54rpx;
				}
				.btn {
					float: right;
					margin-top: 20rpx;
					width: 150rpx;
					font-size: 28rpx;
					font-weight: 400;
					color: #FFFFFF;
					line-height: 68rpx;
					text-align: center;
					background: #3894FF;
					border-radius: 34rpx;
				}
			}
			.card {
				position: relative;
				top: -90rpx;
				padding: 45rpx 0 35rpx 0;
				background: #FFFFFF;
				box-shadow: 0rpx 2rpx 4rpx 0rpx rgba(230,230,230,0.35);
				border-radius: 4rpx;
				.up {
					display: flex;
					align-items: center;
					justify-content: space-around;
					padding: 0 0 40rpx 0;
					.item {
						.num {
							font-size: 48rpx;
							font-weight: 500;
							color: #1A1A1A;
							line-height: 74rpx;
						}
						.action {
							display: flex;
							align-items: center;
							justify-content: flex-start;
							.name {
								font-size: 24rpx;
								font-weight: 400;
								color: #4D4D4D;
								line-height: 38rpx;
							}
							.u-icon {
								position: relative;
								top: 2rpx;
								margin-left: 4rpx;
							}
						}
					}
				}
				.down {
					display: flex;
					align-items: center;
					justify-content: space-between;
					.btn {
						flex: 1;
						font-size: 28rpx;
						font-weight: 400;
						color: #1A1A1A;
						line-height: 40rpx;
						text-align: center;
						&:first-child {
							border-right: 3rpx solid #CCCCCC;
						}
					}
				}
			}
			.apps {
				position: relative;
				top: -70rpx;
				display: flex;
				align-items: center;
				justify-content: space-around;
				padding: 45rpx 0 30rpx 0;
				background: #FFFFFF;
				box-shadow: 0rpx 2rpx 4rpx 0rpx rgba(230,230,230,0.35);
				border-radius: 4rpx;
				&.gray {
					filter: grayscale(100%);
				}
				.mask {
					position: absolute;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
					background: #F3EBEB;
					opacity: 0.5;
					z-index: 10;
				}
				.item {
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: flex-start;
					image {
						width: 60rpx;
						height: 60rpx;
					}
					.name {
						font-size: 24rpx;
						font-weight: 400;
						color: #4D4D4D;
						line-height: 54rpx;
					}
				}
			}
			.notes {
				position: relative;
				top: -40rpx;
				.tabs {
					display: flex;
					align-items: center;
					justify-content: space-between;
					.tab {
						font-size: 30rpx;
						font-weight: 400;
						color: #4D4D4D;
						line-height: 50rpx;
						border-bottom: 4rpx solid transparent;
						&.active {
							color: #3894FF;
							border-bottom: 4rpx solid #3894FF;
						}
					}
				}
				.note {
					padding-top: 20rpx;
					.u-empty {
						padding-top: 200rpx;
					}
					.list {
						max-height: calc(100vh - 942rpx);
						overflow-y: auto;
						background: #FFFFFF;
						box-shadow: 0rpx 2rpx 4rpx 0rpx rgba(230,230,230,0.35);
						border-radius: 4rpx;
						.item {
							display: flex;
							align-items: center;
							justify-content: space-between;
							padding: 30rpx 20rpx;
							border-bottom: 2rpx solid #F5F5F5;
							&:last-child {
								border-bottom: none;
							}
							.left {
								width: 405rpx;
								.title {
									max-width: 100%;
									white-space: nowrap;
									overflow: hidden;
									text-overflow: ellipsis;
									font-size: 32rpx;
									font-weight: 500;
									color: #1A1A1A;
									line-height: 52rpx;
								}
								.date {
									margin-top: 55rpx;
									font-size: 24rpx;
									font-weight: 400;
									color: #999999;
									line-height: 64rpx;
								}
							}
							.right {
								image {
									width: 226rpx;
									height: 162rpx;
									border-radius: 8rpx;
								}
							}
						}
					}
				}
			}
		}
	}
</style>

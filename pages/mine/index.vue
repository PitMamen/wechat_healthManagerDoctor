<template>
	<view class="content">

		<view class="v-home-head">
			<image @click="goInfoPage" mode="aspectFill"
				:src="account.user.avatarUrl || '/static/static/images/header.png'"
				style="width: 128rpx;height: 128rpx;margin-left: 2vw;border-radius: 50%;">
			</image>
			<view class="v-right-head" v-if="account && account.accountId && account.bindStatus == 0">

				<view style="color: #141418;font-size: 32rpx;width: 100%;margin-top: 10rpx;font-weight: bold;">
					{{account.user.userName}}
				</view>
				<view class="v-right-hor">
					<view style="color: #141418;font-weight: 700;">{{account.user.professionalTitle || ''}}</view>
					<view style="color: #1A1A1A;margin-left: 20rpx;">{{account.user.departmentName || ''}}</view>
				</view>
				<view style="color: #999999;font-size: 24rpx;width: 100%;margin-top: 10rpx;">
					{{account.user.hospitalName}}
				</view>

			</view>
			<view class="v-right-head" v-else>

				<view class="identytag" @click="goIdentify">
					<view>未认证</view>
				</view>

				<view class="identytext" @click="goIdentify">
					点击进行实名认证以使用更多功能
				</view>

			</view>
			<view class="v-right-btn" @tap="unbindDoctorPhone">
				<image mode="aspectFill" src="/static/static/images/quit.png" style="width: 42rpx;height: 42rpx;">
					<view style="color: #1A1A1A;font-size: 24rpx;margin-left: -5rpx;">
						退出
					</view>
			</view>
		</view>

		<view class="cash-wrap">
			<view class="cash-title">钱包余额</view>
			<view class="cash-line">
				<view class="cash-info">
					<text class="cash-unit" v-if="cashEye">￥</text>
					<text v-if="cashEye">{{ info.settlementSum || 0 }}</text>
					<text v-else>******</text>
				</view>
				<u-icon name="eye-fill" color="#FFFFFF" size="36rpx" @click="cashEyeClick(false)"
					v-if="cashEye"></u-icon>
				<u-icon name="eye-off" color="#FFFFFF" size="36rpx" @click="cashEyeClick(true)" v-else></u-icon>
			</view>
			<view class="cash-action">
				<view class="cash-btn" @click="goCashDetail">
					<image src="/static/static/images/mine_shouru.png"></image>
					<view>收入明细</view>
				</view>
				<view class="cash-btn" @click="goCashPack">
					<image src="/static/static/images/mine_tixian.png"></image>
					<view>去提现</view>
				</view>
			</view>
		</view>

		<view v-if="false" class="v-items" @click="goInquiryList">
			<image src="/static/static/images/mine_wenzhen.png" style="width: 56rpx;height: 56rpx;margin-left: 2vw;">
			</image>
			<view style="margin-left: 10px;font-size: 30rpx;flex: 1;">问诊记录</view>

			<view style="display: flex;flex-direction: row;">
				<!-- <span style="float: right;font-size: 14px;">互联网医院</span> -->
				<u-icon name="arrow-right" color="#333"
					style="width: 10px;height: 10px;float: right;margin-right: 10px;margin-top: 6.5px;"></u-icon>
			</view>

		</view>


		<view class="v-items" @click="goOrderList">
			<image src="/static/static/images/mine_dd.png"
				style="float: left;width: 56rpx;height: 56rpx;margin-left: 2vw;">
			</image>

			<view style="margin-left: 10px;font-size: 30rpx;flex: 1;">我的订单</view>

			<view style="display: flex;flex-direction: row;">
				<!-- <span style="float: right;font-size: 14px;"></span> -->
				<u-icon name="arrow-right" color="#333"
					style="width: 10px;height: 10px;float: right;margin-right: 10px;margin-top: 6.5px;"></u-icon>
			</view>

		</view>


		<!-- <view class="v-items" @click="goInquiryList2">
			<image src="/static/static/images/mine_jk.png"
				style="float: left;width: 56rpx;height: 56rpx;margin-left: 2vw;">
			</image>
			
			<view style="margin-left: 10px;font-size: 30rpx;flex: 1;">健康服务</view>
			
			<view style="display: flex;flex-direction: row;">
				
				<u-icon name="arrow-right" color="#333"
					style="width: 10px;height: 10px;float: right;margin-right: 10px;margin-top: 6.5px;"></u-icon>
			</view>
		
		</view> -->


		<view class="v-items" @click="goFollowList">
			<image src="/static/static/images/mine_sf.png"
				style="float: left;width: 56rpx;height: 56rpx;margin-left: 2vw;">
			</image>

			<view style="margin-left: 10px;font-size: 30rpx;flex: 1;">随访记录</view>

			<view style="display: flex;flex-direction: row;">
				<!-- <span style="float: right;font-size: 14px;">全部</span> -->
				<u-icon name="arrow-right" color="#333"
					style="width: 10px;height: 10px;float: right;margin-right: 10px;margin-top: 6.5px;"></u-icon>
			</view>
		</view>


		<view class="v-items" @click="goChuFangModel" v-if="false">
			<image src="/static/static/images/mine_chufang.png"
				style="float: left;width: 56rpx;height: 56rpx;margin-left: 2vw;">
			</image>

			<view style="margin-left: 10px;font-size: 30rpx;flex: 1;">处方模板</view>

			<view style="display: flex;flex-direction: row;">
				<!-- <span style="float: right;font-size: 14px;">全部</span> -->
				<u-icon name="arrow-right" color="#333"
					style="width: 10px;height: 10px;float: right;margin-right: 10px;margin-top: 6.5px;"></u-icon>
			</view>
		</view>



		<view class="v-items" @click="goCaManage" v-if="showCa">
			<image src="/static/static/images/mine_ca.png"
				style="float: left;width: 56rpx;height: 56rpx;margin-left: 2vw;">
			</image>

			<view style="margin-left: 10px;font-size: 30rpx;flex: 1;">证书管理</view>

			<view style="display: flex;flex-direction: row;">
				<!-- <span style="float: right;font-size: 14px;">全部</span> -->
				<u-icon name="arrow-right" color="#333"
					style="width: 10px;height: 10px;float: right;margin-right: 10px;margin-top: 6.5px;"></u-icon>
			</view>
		</view>



		<view class="v-items" @click="goUpdatePwd">
			<image src="/static/static/images/mine_mima.png"
				style="float: left;width: 56rpx;height: 56rpx;margin-left: 2vw;">
			</image>

			<view style="margin-left: 10px;font-size: 30rpx;flex: 1;">修改密码</view>

			<view style="display: flex;flex-direction: row;">
				<!-- <span style="float: right;font-size: 14px;">全部</span> -->
				<u-icon name="arrow-right" color="#333"
					style="width: 10px;height: 10px;float: right;margin-right: 10px;margin-top: 6.5px;"></u-icon>
			</view>
		</view>

		<!-- <view class="v-items" @click="goIdentify">
			<image src="/static/static/images/mine-srrz.png"
				style="float: left;width: 56rpx;height: 56rpx;margin-left: 2vw;">
			</image>
			
			<view style="margin-left: 10px;font-size: 30rpx;flex: 1;">实人认证</view>
			
			<view style="display: flex;flex-direction: row;">
				
				<u-icon name="arrow-right" color="#333"
					style="width: 10px;height: 10px;float: right;margin-right: 10px;margin-top: 6.5px;"></u-icon>
			</view>
		</view> -->

		<view class="v-items" @click="gocfmode">
			<image src="/static/static/images/mine-wdzj.png"
				style="float: left;width: 56rpx;height: 56rpx;margin-left: 2vw;">
			</image>
			
			<view style="margin-left: 10px;font-size: 30rpx;flex: 1;">处方模板</view>
			
			<view style="display: flex;flex-direction: row;">
				
				<u-icon name="arrow-right" color="#333"
					style="width: 10px;height: 10px;float: right;margin-right: 10px;margin-top: 6.5px;"></u-icon>
			</view>
		</view>
		<view class="v-items" @click="goGroupList">
			<image src="/static/static/images/mine-wdzj.png"
				style="float: left;width: 56rpx;height: 56rpx;margin-left: 2vw;">
			</image>
			
			<view style="margin-left: 10px;font-size: 30rpx;flex: 1;">患者标签</view>
			
			<view style="display: flex;flex-direction: row;">
				
				<u-icon name="arrow-right" color="#333"
					style="width: 10px;height: 10px;float: right;margin-right: 10px;margin-top: 6.5px;"></u-icon>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showCa: false,
				cashEye: true,
				title: 'Hello',
				account: {
					name: '李雅',
					dept: '精神科',
					pos: '主治医师',
					hos: '中南大学湘雅二医院',
					disease: '疾病: 青少年精神障碍',
				},
				info: {},

				taskList: [],
			}
		},
		onLoad() {
			// uni.$u.http.get('/health-api/health/patient/getUserTask', {
			// 	execFlag: '',
			// }).then(res => {
			// 	uni.setStorageSync('token', res.data.jwt); //存数据
			// 	console.log('res', res)
			// })
			this.account = uni.getStorageSync('account');

		},
		onShow() {
			if (this.account && this.account.accountId && this.account.bindStatus == 0) {
				this.getShowCa();
			}
			this.getInfo();
			this.refreshBindStatus();
		},
		methods: {
			jump() {
				// uni.redirectTo({
				// 	url: '/pages/tab/index'
				// });

				uni.switchTab({
					url: '/pages/tab/index'
				});
			},



			//个人信息页
			goInfoPage() {
				if (!this.checkAuth()) {
					return
				}
				uni.navigateTo({
					url: '/pages2/pages/mine/info'
				})
			},
			goOrderList() {
				if (!this.checkAuth()) {
					return
				}
				uni.navigateTo({
					url: '/pages2/pages/mine/order'
				});
			},
			//互联网医院问诊咨询
			goInquiryList() {
				if (!this.checkAuth()) {
					return
				}
				uni.navigateTo({
					url: '/pages2/pages/mine/history-list'
				})


			},
			//健康管家问诊咨询
			goInquiryList2() {
				if (!this.checkAuth()) {
					return
				}
				uni.navigateTo({
					url: '/pages2/pages/mine/health-history-list'
				})


			},
			/**
			 * auditStatus  0待完善/1审核中/2审核通过/3审核不通过
			 * 1、3有单独两个页面展示；0为提交一个页面为待完善，直接进基础页面；2审核通过后就没有入口看不见了
			 */
			goIdentify() {
				uni.$u.http.get('/account-api/accountInfo/getDoctorAuthStatus', {
					params: {}
				}).then(res => {
					if (res.code == 0) {
						if (res.data.auditStatus == 1) { //审核中
							uni.navigateTo({
								url: '/pages2/pages/mine/identify-result?type=1&jumpFrom=1'
							})
						} else if (res.data.auditStatus == 3) { //审核不通过
							uni.navigateTo({
								url: '/pages2/pages/mine/identify-result?type=2&jumpFrom=1'
							})
						} else { // 0待完善   进去后查询数据来确定填充信息还是完全的新增
							uni.navigateTo({
								url: '/pages2/pages/mine/identify-base'
							})
						}

					} else {
						this.$u.toast(res.message)
					}

				}).finally(() => {
					uni.hideLoading();
				});
			},
			
			refreshBindStatus(){
				uni.$u.http.get('/account-api/accountInfo/getDoctorAuthStatus', {
					params: {}
				}).then(res => {
					if (res.code == 0) {
						this.account.bindStatus =res.data.bindStatus
					} else {
						this.$u.toast(res.message)
					}
				
				}).finally(() => {
					uni.hideLoading();
				});
			},

			//检验是否认证
			checkAuth() {
				if (!this.account || !this.account.accountId || this.account.bindStatus !== 0) {
					//如果没有账号 或者 没有认证
					this.goIdentify()
					return false
				} else {
					return true
				}
			},
			//随访记录
			goFollowList() {
				if (!this.checkAuth()) {
					return
				}
				uni.navigateTo({
					url: '/pages2/pages/follow/history-follow-list'
				})
			},
			goChuFangModel() {
				if (!this.checkAuth()) {
					return
				}
			},
			goCaManage() {
				if (!this.checkAuth()) {
					return
				}
				uni.navigateTo({
					url: '/pages2/pages/ca/manage'
				});
			},
			goUpdatePwd() {
				if (!this.checkAuth()) {
					return
				}
				uni.navigateTo({
					url: '/pages2/pages/login/update'
				})
			},
			goMyCertificate() {
				if (!this.checkAuth()) {
					return
				}
			},
			//处方模板
			gocfmode(){
				if (!this.checkAuth()) {
					return
				}
				uni.navigateTo({
					url: '/pages2/pages/chufang2/mode-list'
				})
			},
			//患者标签
			goGroupList(){
				if (!this.checkAuth()) {
					return
				}
				uni.navigateTo({
					url: '/pages3/pages/group/list'
				})
			},
			
			getShowCa() {

				uni.$u.http.get(`/info-api/sysConfigData/getConfig/CA_AUTH_FLAG`).then(res => {
					this.showCa = res.data.value === '1';
				});
			},

			quit() {
				// TUIKit xxxx | mine | quit | xxxx
				// logger.log('| TUI-User-Center | mine  | quit-logout ');
				uni.$TUIKit.logout().then(() => {
					const loginData = uni.getStorageSync('loginData') || {};
					uni.clearStorage();
					uni.setStorageSync('loginData', loginData);
					this.$u.toast("退出成功！")
					uni.redirectTo({
						// url: '../../login/login',
						url: '../login/login',
						success: () => {
							uni.showToast({
								title: '退出成功',
								icon: 'none'
							});
						}
					});
				});
			},


			//解绑
			unbindDoctorPhone() {
				uni.showLoading({
					title: '加载中'
				})
				var reqData = {
					appId: uni.getAccountInfoSync().miniProgram.appId
				}
				uni.$u.http.post('/account-api/accountInfo/unbindDoctorPhone', reqData).then(res => {
					uni.hideLoading()
					if (res.code == 0) {
						uni.redirectTo({

							url: '../login/login',
							success: () => {
								uni.showToast({
									title: '退出成功',
									icon: 'none'
								});
							}
						});

					} else {
						this.$u.toast("解绑失败")

					}
				}).catch(() => {
					uni.hideLoading()
				});
			},
			getInfo() {
				uni.showLoading({
					title: '正在加载'
				});
				uni.$u.http.get(`/medical-api/userRightsSettlement/getSettlementSumByLoginUser`, {
					params: {}
				}).then(res => {
					uni.hideLoading();
					this.info = res.data || {};
				});
			},
			cashEyeClick(eye) {
				this.cashEye = eye;
			},
			goCashDetail() {
				if (!this.checkAuth()) {
					return
				}
				uni.navigateTo({
					url: '/pages3/pages/cash/detail'
				});
			},
			goCashPack() {
				if(!this.checkAuth()){
					return
				}
				uni.navigateTo({
					url: '/pages3/pages/cash/pack'
				});
			}
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 100vh;
		background-color: #F2F2F2;
		/* justify-content: center; */

	}

	.content .v-home-head {
		display: flex;
		flex-direction: row;
		align-items: center;
		width: 95vw;
		border: ;
		overflow: hidden;
		margin: 10px 10px;
		height: 10vh;
	}

	.content .v-home-head .v-right-head {
		flex: 1;
		display: flex;
		margin-left: 3vw;
		width: 100%;
		flex-direction: column;

	}

	.identytag {
		width: 112rpx;
		height: 48rpx;
		background: #F5F5F5;
		border: 1rpx solid #3894FF;
		border-radius: 4rpx;
		font-size: 24rpx;
		color: #3894FF;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;

	}

	.identytext {
		font-size: 24rpx;
		color: #3894FF;
		margin-top: 19rpx;
	}

	.content .v-home-head .v-right-btn {
		display: flex;
		flex-direction: column;
		margin-top: -3rpx;
		margin-right: 17rpx;

	}

	.content .v-home-head .v-right-head .v-right-hor {
		display: flex;
		width: 100%;
		margin-top: 10rpx;
		font-size: 24rpx;
		flex-direction: row;
		align-items: center;
	}



	.content .v-home-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		overflow: hidden;
		width: 96%;
		background-color: #fff;
		margin-top: 10px;

		/* margin-left: 10px !important;
		margin-right: 10px !important;
		padding: 10px !important; */
		border: 1px solid #e6e6e6;
		border-radius: 5px;
	}

	.content .v-items {
		width: 90%;
		margin: 20rpx 24rpx 0 24rpx;
		border-radius: 4rpx;
		background-color: white;
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 26rpx 20rpx;
	}

	.content .v-home-item .div-item-top {
		height: 50px;
		background-color: #F2F9FF;
		text-align: center;
		width: 100%;
		position: relative;
		border: 1px solid #e6e6e6;
		border-radius: 5px 5px 0 0;
	}

	.content .v-home-item .text-item {
		margin-top: 10px !important;
		margin-left: 10px !important;
		font-size: 14px;
		color: #333;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}

	.todo-back {
		display: flex;
		width: 100%;
		flex-direction: row;
		align-items: center;
		/* margin-top: 40rpx; */
		padding: 10rpx;
		/* margin-bottom: 40rpx; */
	}

	.todo-content {
		margin-right: 15rpx;
		margin-left: 20rpx;
		flex-direction: column;
		flex: 1;
	}

	.todo-button {
		margin-left: auto;
		width: 108rpx;
		margin-right: 10rpx;
		/* border-radius: 3rpx; */
		border-radius: 8rpx;
		border: 1px solid #007BF5;
		height: 48rpx;
		background-color: #007BF5;
		color: white;
		font-size: 24rpx;
		align-items: center;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
</style>
<style lang="scss">
	.content {
		.cash-wrap {
			width: 90%;
			padding: 20rpx 24rpx;
			background: linear-gradient(270deg, #388CF6, #69C3FF);
			background-image: url('https://hmg.mclouds.org.cn/content-api/file/F20230830145137912OLK8JKDAG3YP83-20230830145111.png');
			background-size: cover;
			border-radius: 4rpx;

			.cash-title {
				font-size: 30rpx;
				font-weight: 400;
				color: #FFFFFF;
				line-height: 50rpx;
			}

			.cash-line {
				display: flex;
				align-items: center;
				justify-content: space-between;

				.cash-info {
					margin-top: 14rpx;
					margin-bottom: 20rpx;
					font-size: 48rpx;
					font-weight: 400;
					color: #FFFFFF;
					line-height: 72rpx;

					.cash-unit {
						margin-right: 10rpx;
						font-size: 30rpx;
					}
				}

				>.u-icon {
					position: relative;
					top: 2rpx;
				}
			}

			.cash-action {
				display: flex;
				align-items: center;
				justify-content: space-around;

				.cash-btn {
					display: flex;
					align-items: center;
					justify-content: flex-start;

					image {
						width: 28rpx;
						height: 28rpx;
						margin-right: 10rpx;
					}

					view {
						font-size: 24rpx;
						font-weight: 400;
						color: #FFFFFF;
						line-height: 44rpx;
					}
				}
			}
		}
	}
</style>
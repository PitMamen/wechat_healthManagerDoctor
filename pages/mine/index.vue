<template>
	<view class="content">
		<view style="background-color: aqua;padding: 20rpx 10rpx;" @click="goIdentify">实名认证</view>
		<view class="v-home-head">
			<image @click="goInfoPage" mode="aspectFill"
				:src="account.user.avatarUrl || '/static/static/images/header.png'"
				style="width: 128rpx;height: 128rpx;margin-left: 2vw;border-radius: 50%;">
			</image>
			<view class="v-right-head">

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
			<view class="v-right-btn" @tap="quit">
				<image mode="aspectFill" src="/static/static/images/quit.png" style="width: 42rpx;height: 42rpx;">
					<view style="color: #1A1A1A;font-size: 24rpx;margin-left: -5rpx;">
						退出
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


		<view  class="v-items" @click="goFollowList">
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



		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showCa: false,
				title: 'Hello',
				account: {
					name: '李雅',
					dept: '精神科',
					pos: '主治医师',
					hos: '中南大学湘雅二医院',
					disease: '疾病: 青少年精神障碍',
				},

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
			this.getShowCa();
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
				uni.navigateTo({
					url: '/pages2/pages/mine/info'
				})
			},
			goOrderList() {
				uni.navigateTo({
					url: '/pages2/pages/mine/order'
				});
			},
			//互联网医院问诊咨询
			goInquiryList() {

				uni.navigateTo({
					url: '/pages2/pages/mine/history-list'
				})


			},
			//健康管家问诊咨询
			goInquiryList2() {
				uni.navigateTo({
					url: '/pages2/pages/mine/health-history-list'
				})


			},
			goIdentify(){
				uni.navigateTo({
					url: '/pages2/pages/mine/identify-base'
				})
			},
			//随访记录
			goFollowList() {
				uni.navigateTo({
					url: '/pages2/pages/follow/history-follow-list'
				})
			},
			goChuFangModel() {
			},
			goCaManage() {
				uni.navigateTo({
					url: '/pages2/pages/ca/manage'
				});
			},
			goUpdatePwd() {
				uni.navigateTo({
					url: '/pages2/pages/login/update'
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
		align-items: center;
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

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
					<view class="name">{{account.user.userName||'XXX'}}的诊室</view>
					<view class="welcome">欢迎您，{{account.user.userName||'XXX'}}</view>
				</view>
			</view>
			<view class="right">
				<view class="btn" @click="showDocCode2">随诊码</view>
				<view class="btn" @click="showDocCode">名片</view>
			</view>
		</view>
		<view class="contents">
			<view class="card" v-if="account && account.accountId && account.bindStatus===0">
				<view class="up">
					<view class="item" @click="goCard1()">
						<view class="num">{{info.poolNum || 0}}</view>
						<view class="action">
							<view class="name">抢单池</view>
							<u-icon name="arrow-right" color="#999999" size="30rpx"></u-icon>
						</view>
					</view>
					<view class="item" @click="goCard2()">
						<view class="num">{{info.reqNum || 0}}</view>
						<view class="action">
							<view class="name">待接诊</view>
							<u-icon name="arrow-right" color="#999999" size="30rpx"></u-icon>
						</view>
					</view>
					<view class="item" @click="goCard3()">
						<view class="num">{{info.confirmNum || 0}}</view>
						<view class="action">
							<view class="name">问诊中</view>
							<u-icon name="arrow-right" color="#999999" size="30rpx"></u-icon>
						</view>
					</view>
				</view>
				<view class="down">
					<view class="btn" @click="goCard4()">问诊设置</view>
					<view class="btn" @click="goCard5()">处方签名</view>
				</view>
			</view>
			<view class="auth" @click="goIdentify" v-else>
				<view class="title">您可以进行实名认证</view>
				<view class="desc">实名认证通过后可以使用更多功能</view>
				<view class="btn">实名认证</view>
			</view>
			<view class="apps" :class="{gray: !(account && account.accountId && account.bindStatus===0)}">
				<view class="mask"></view>
				<view class="item" @click="goApps1()">
					<image src="/static/static/images/index/app1.png"></image>
					<view class="name">处方模版</view>
				</view>
				<view class="item" @click="goApps2()">
					<image src="/static/static/images/index/app2.png"></image>
					<view class="name">电话随访</view>
				</view>
				<view class="item" @click="goApps3()">
					<image src="/static/static/images/index/app3.png"></image>
					<view class="name">我的团队</view>
				</view>
				<view class="item" @click="goApps4()">
					<image src="/static/static/images/index/app4.png"></image>
					<view class="name">药品字典</view>
				</view>
				<view class="item" @click="goApps5()">
					<image src="/static/static/images/index/app5.png"></image>
					<view class="name">知识宝典</view>
				</view>
			</view>
			<view class="notes">
				<view class="tabs">
					<view
						v-for="item in listTab"
						class="tab"
						:key="item.id"
						:class="{active: item.id===categoryId}"
						@click="tabClick(item)"
					>{{item.categoryName}}</view>
				</view>
				<view class="note">
					<u-empty mode="data" icon="/static/img/icon_nodata.png" v-if="list.length === 0"></u-empty>
					<scroll-view class="list" :scroll-y="true" @scrolltolower="scrolltolower" v-else>
						<view class="item" v-for="item in list" :key="item.articleId" @click="articleClick(item)">
							<view class="left">
								<view class="title">{{item.title}}</view>
								<view class="date">{{item.createdTime}}</view>
							</view>
							<view class="right">
								<image :src="item.previewUrl" mode="aspectFill"></image>
							</view>
						</view>
					</scroll-view>
				</view>
			</view>
		</view>
		
		<ca-check ref="caCheck" />
		<u-popup :show="showCode" mode="center" :round="4" @close="closeCodePop">
			<view class="codeview">
				<image class="code" :src="docCodeImg"></image>
				<view class="codeitem">
					<image src="/static/static/images/yisheng.png"
						style="width: 30rpx;height: 34rpx;margin-right: 20rpx;">
					</image>
					<text>{{account.user.userName}}</text>
				</view>
				<view class="codeitem">
					<text>{{account.user.professionalTitle}}</text>
					<view style="margin-left: 20rpx;margin-right: 20rpx;">|</view>
					<text>{{account.user.departmentName}}</text>
				</view>
				<text style="color: #3894FF;">让患者微信扫一扫添加</text>
			</view>
		</u-popup>
		<u-popup :show="showCode2" mode="center" :round="4" @close="closeCodePop2">
			<view class="codeview">
				<image class="code" :src="docCodeImg2"></image>
				<view class="codeitem">
					<image src="/static/static/images/yisheng.png"
						style="width: 30rpx;height: 34rpx;margin-right: 20rpx;">
					</image>
					<text>{{account.user.userName}}</text>
				</view>
				<view class="codeitem">
					<text>{{account.user.professionalTitle}}</text>
					<view style="margin-left: 20rpx;margin-right: 20rpx;">|</view>
					<text>{{account.user.departmentName}}</text>
				</view>
				<text style="color: #3894FF;">患者可扫码领取随诊包</text>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import caCheck from '@/components/ca/check';
	
	export default {
		data() {
			return {
				info: {},
				showCode: false,
				showCode2: false,
				docCodeImg: undefined,
				docCodeImg2: undefined,
				
				list: [],
				listTab: [],
				total: 0,
				pageNo: 1,
				pageSize: 20,
				flag: false,
				categoryId: '',
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
			this.getListTab();
		},
		onShow() {
			this.refreshBindStatus();
			if (this.account && this.account.accountId && this.account.bindStatus===0){
				this.getInfo();
				setTimeout(() => {
					this.$refs.caCheck.check();
				});
			}
		},
		methods: {
			refreshBindStatus() {
				uni.$u.http.get('/account-api/accountInfo/getDoctorAuthStatus', {
					params: {}
				}).then(res => {
					this.account.bindStatus = res.data.bindStatus;
				});
			},
			getInfo() {
				uni.$u.http.post(`/medical-api/rightsUse/qryRightsUseCountByDoc`).then(res => {
					this.info = res.data || {};
				});
			},
			getList() {
				uni.showLoading({
					title:'正在加载'
				});
				uni.$u.http.post(`/health-api/article/getArticleList`, {
					status: 2,
					own: 'doctor',
					isVisible: true,
					pageNo: this.pageNo,
					pageSize: this.pageSize,
					categoryId: this.categoryId
				}).then(res => {
					uni.hideLoading();
					this.total = res.data.total;
					this.list = this.list.concat(res.data.records);
				}).finally(() => {
					this.flag = false;
				});
			},
			getListTab() {
				uni.showLoading({
					title:'正在加载'
				});
				uni.$u.http.post(`/health-api/articleCategory/getArticleCategoryList`, {
					own: 'doctor'
				}).then(res => {
					uni.hideLoading();
					this.listTab = res.data.records || [];
					if (this.listTab.length > 0){
						this.categoryId = this.listTab[0].id;
						this.getList();
					}
				});
			},
			goIdentify() {
				uni.$u.http.get('/account-api/accountInfo/getDoctorAuthStatus', {
					params: {}
				}).then(res => {
					if (res.data.auditStatus == 1){
						uni.navigateTo({
							url: '/pages2/pages/mine/identify-result?type=1&jumpFrom=1'
						});
					}else if (res.data.auditStatus == 3){
						uni.navigateTo({
							url: '/pages2/pages/mine/identify-result?type=2&jumpFrom=1'
						});
					}else{
						uni.navigateTo({
							url: '/pages2/pages/mine/identify-base'
						});
					}
				});
			},
			showDocCode() {
				if (this.docCodeImg){
					this.showCode = true;
					return;
				}
				uni.$u.http.get('/wx-api/wx/qrcode/wx2f945858177df980/getDoctorQrCode', {
					params: {
						docUserId: this.account.user.userId,
						forceMpCode: ''
					}
				}).then(res => {
					this.docCodeImg = res.data;
					this.showCode = true;
				});
			},
			showDocCode2() {
				if (this.docCodeImg2){
					this.showCode2 = true;
					return;
				}
				uni.$u.http.get('/wx-api/wx/qrcode/docMiniAppid/guideCommodityQrCodeByDoctorId', {
					params: {
						doctorUserId: this.account.user.userId
					}
				}).then(res => {
					this.docCodeImg2 = res.data;
					this.showCode2 = true;
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
			tabClick(item) {
				if (item.id === this.categoryId){
					return;
				}
				this.categoryId = item.id;
				this.pageNo = 1;
				this.total = 0;
				this.list = [];
				this.getList();
			},
			closeCodePop() {
				this.showCode = false;
			},
			closeCodePop2() {
				this.showCode2 = false;
			},
			goCard1() {
				uni.navigateTo({
					url: '/pages2/pages/work/grep'
				});
			},
			goCard2() {
				uni.navigateTo({
					url: '/pages2/pages/work/treat?tab=2'
				});
			},
			goCard3() {
				uni.navigateTo({
					url: '/pages2/pages/work/treat?tab=3'
				});
			},
			goCard4() {
				uni.navigateTo({
					url: '/pages2/pages/mine/info'
				});
			},
			goCard5() {
				uni.navigateTo({
					url: '/pages2/pages/ca/manage'
				});
			},
			goApps1() {
				uni.navigateTo({
					url: '/pages2/pages/chufang2/mode-list'
				});
			},
			goApps2() {
				uni.navigateTo({
					url: '/pages/follow/current-follow-list'
				});
			},
			goApps3() {
				uni.showToast({
					title: '当前功能正在开发中，敬请期待',
					icon: 'none'
				});
			},
			goApps4() {
				uni.showToast({
					title: '当前功能正在开发中，敬请期待',
					icon: 'none'
				});
			},
			goApps5() {
				uni.showToast({
					title: '当前功能正在开发中，敬请期待',
					icon: 'none'
				});
			},
			articleClick(item) {
				uni.navigateTo({
					url: `/pages2/pages/group/note-info2?id=${item.articleId}&title=${item.title}`
				});
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
					.mask {
						display: block;
					}
				}
				.mask {
					display: none;
					position: absolute;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
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
					justify-content: flex-start;
					overflow-x: auto;
					.tab {
						margin-right: 40rpx;
						font-size: 30rpx;
						font-weight: 400;
						color: #4D4D4D;
						line-height: 50rpx;
						white-space: nowrap;
						border-bottom: 4rpx solid transparent;
						&.active {
							color: #3894FF;
							border-bottom: 4rpx solid #3894FF;
						}
						&:last-child {
							margin-right: 0;
						}
					}
				}
				.note {
					padding-top: 20rpx;
					.u-empty {
						padding-top: 80rpx;
						padding-bottom: 120rpx;
						background: #FFFFFF;
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
		.codeview {
			display: flex;
			flex-direction: column;
			align-items: center;
			width: 620rpx;
			padding-top: 100rpx;
			padding-bottom: 32rpx;
			.code {
				width: 316rpx;
				height: 316rpx;
				margin-bottom: 32rpx;
			}
			text {
				font-size: 30rpx;
				color: #1A1A1A;
			}
			.codeitem {
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: center;
				margin-bottom: 30rpx;
			}
		}
	}
</style>

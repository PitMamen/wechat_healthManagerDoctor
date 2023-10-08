<template>
	<view class="wrap">
		<view class="head" v-if="false">
			<view class="tab">
				<view class="item" :class="{active: tab===1}" @click="tabClick(1)">
					<view>全部</view>
				</view>
				<view class="item" :class="{active: tab===2}" @click="tabClick(2)">
					<view>待接诊</view>
				</view>
				<view class="item" :class="{active: tab===3}" @click="tabClick(3)">
					<view>问诊中</view>
				</view>
				<view class="item" :class="{active: tab===4}" @click="tabClick(4)">
					<view>已结束</view>
				</view>
			</view>
			<view class="filter" v-if="tab===1">
				<view class="left">
					<view class="btns">
						<view class="btn active" v-if="serviceItemType===101">图文问诊</view>
						<view class="btn active" v-if="serviceItemType===102">电话问诊</view>
						<view class="btn active" v-if="serviceItemType===103">视频问诊</view>
						<view class="btn active" v-if="broadClassify===4">复诊续方</view>
					</view>
				</view>
				<view class="right" @click="chooseOpen()">
					<image src="/pages2/static/static/images/treat/filter.png"></image>
					<view class="name">筛选</view>
					<view class="dot" v-if="serviceItemType||broadClassify">1</view>
				</view>
				<view class="choose-abs" v-if="showChoose">
					<view class="up">
						<view class="title">问诊类型</view>
						<view class="list">
							<view class="item" :class="{active: serviceItemType_===101}" @click="chooseItemClick(101, '')">图文问诊</view>
							<view class="item" :class="{active: serviceItemType_===102}" @click="chooseItemClick(102, '')">电话问诊</view>
							<view class="item" :class="{active: serviceItemType_===103}" @click="chooseItemClick(103, '')">视频问诊</view>
							<view class="item" :class="{active: broadClassify_===4}" @click="chooseItemClick('', 4)">复诊续方</view>
						</view>
					</view>
					<view class="down">
						<view class="btn" @click="chooseReset()">重置</view>
						<view class="btn confirm" @click="chooseConfirm()">确认</view>
					</view>
					<view class="mask" @click="chooseClose()"></view>
				</view>
			</view>
		</view>
		<view class="content">
			<u-empty mode="data" icon="/pages2/static/img/icon_nodata.png" v-if="list.length === 0"></u-empty>
			<scroll-view class="list" :class="{all: tab===1}" :scroll-y="true" @scrolltolower="scrolltolower" v-else>
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
					<view class="bottom" v-if="item.broadClassify === 4">
						<view class="remark-abs inner">院内结算</view>
						<view class="btn btn1" @click.stop="grep(item)">抢单</view>
					</view>
					<view class="bottom" v-else-if="item.serviceItemType === 101">
						<view class="remark-abs">雅医结算</view>
						<view class="btn btn1" @click.stop="grep(item)">抢单</view>
					</view>
					<view class="bottom" v-else-if="item.serviceItemType === 102">
						<view class="remark-abs">雅医结算</view>
						<view class="btn btn1" @click.stop="grep(item)">抢单</view>
					</view>
					<view class="bottom" v-else-if="item.serviceItemType === 103">
						<view class="remark-abs">雅医结算</view>
						<view class="btn btn1" @click.stop="grep(item)">抢单</view>
					</view>
				</view>
			</scroll-view>
		</view>
		
		<tuicall ref="TUICall"></tuicall>
		<TUI-view-rate ref="TUIViewRate" />
		<u-modal
			title="温馨提示"
			confirmText="确定"
			showCancelButton
			closeOnClickOverlay
			:show="showRefuse"
			@confirm="goRefuse"
			@cancel="() => showRefuse = false"
			@close="() => showRefuse = false"
		>
			<view>确认拒诊吗？</view>
		</u-modal>
		<u-modal
			title="温馨提示"
			confirmText="确定"
			showCancelButton
			closeOnClickOverlay
			:show="showGoOn"
			@confirm="goOn"
			@cancel="() => showGoOn = false"
			@close="() => showGoOn = false"
		>
			<view>确认接诊吗？</view>
		</u-modal>
		<u-modal
			title="结束问诊"
			confirmText="确定"
			showCancelButton
			closeOnClickOverlay
			:show="showEnd"
			@confirm="endTalk"
			@cancel="() => showEnd = false"
			@close="() => showEnd = false"
		>
			<view>请确认是否结束问诊？</view>
		</u-modal>
	</view>
</template>

<script>
	import tuicall from '@/pages2/components/common/tuicall';
	import TUIViewRate from '@/pages2/components/tui-rate/view/index';
	
	export default {
		data() {
			return {
				serviceItemType_: '',
				serviceItemType: '',
				broadClassify_: '',
				broadClassify: '',
				showChoose: false,
				tab: 1,
				
				flag: false,
				total: 0,
				pageNo: 1,
				pageSize: 10,
				list: [],
				
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
		computed: {
		},
		onLoad(options) {
			this.tab = parseInt(options.tab || 1);
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
				uni.$u.http.post(`/medical-api/rightsUse/qryPoolReqByPage`, {
					pageSize: this.pageSize,
					pageNo: this.pageNo
				}).then(res => {
					uni.hideLoading();
					this.total = res.data.totalRows;
					this.list = this.list.concat(res.data.rows || []);
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
			resetPage() {
				this.pageNo = 1;
				this.total = 0;
				this.list = [];
			},
			changeTab(tab) {
				this.tab = tab;
				this.resetPage();
				this.getList();
			},
			tabClick(tab) {
				if (this.tab === tab){
					return;
				}
				this.changeTab(tab);
			},
			itemClick(item) {
				uni.showLoading({
					title: '正在加载'
				});
				uni.$u.http.post('/medical-api/rightsUse/qryRightsUseRecord', {
					id: item.id
				}).then(res => {
					uni.hideLoading();
					if (res.data[0].status !== 2){
						uni.showToast({
							title: '已被他人抢单，无法查看',
							icon: 'none'
						});
						return;
					}
					let pageName = '';
					if (item.broadClassify === 4){
						pageName = 'detailFz';
					}else if (item.serviceItemType === 101){
						pageName = 'detailImg';
					}else if (item.serviceItemType === 102){
						pageName = 'detailPhone';
					}else if (item.serviceItemType === 103){
						pageName = 'detailVideo';
					}
					uni.setStorageSync('taskItem', item);
					uni.navigateTo({
						url: `/pages2/pages/work/talk/${pageName}?item=${encodeURIComponent(JSON.stringify(item))}`
					});
				});
			},
			chooseItemClick(type, classify) {
				this.serviceItemType_ = type;
				this.broadClassify_ = classify;
			},
			chooseOpen() {
				this.showChoose = true;
			},
			chooseClose() {
				this.showChoose = false;
			},
			chooseReset() {
				this.serviceItemType_ = '';
				this.serviceItemType = '';
				this.broadClassify_ = '';
				this.broadClassify = '';
				this.chooseClose();
				this.resetPage();
				this.getList();
			},
			chooseConfirm() {
				this.serviceItemType = this.serviceItemType_;
				this.broadClassify = this.broadClassify_;
				this.chooseClose();
				this.resetPage();
				this.getList();
			},
			
			grep(item) {
				uni.showModal({
					title: '温馨提示',
					content: '确认是否抢单？',
					showCancel: true,
					success: (res) => {
						if (res.confirm){
							this.doGrep(item);
						}
					}
				});
			},
			doGrep(item) {
				uni.showLoading({
					title: '正在加载'
				});
				uni.$u.http.post('/medical-api/rightsUse/dynamicConfirm', {
					id: item.id
				}).then(res => {
					uni.hideLoading();
					uni.showToast({
						title: '抢单成功',
						icon: 'success'
					});
					this.refreshAllData();
					setTimeout(() => {
                        let pageName = '';
					    if (item.broadClassify === 4){
						    pageName = 'detailFz';
					    }else if (item.serviceItemType === 101){
						    pageName = 'detailImg';
					    }else if (item.serviceItemType === 102){
						    pageName = 'detailPhone';
					    }else if (item.serviceItemType === 103){
						    pageName = 'detailVideo';
					    }
					    uni.setStorageSync('taskItem', item);
					    uni.navigateTo({
						    url: `/pages2/pages/work/talk/${pageName}?item=${encodeURIComponent(JSON.stringify(item))}`
					    });
					}, 2000);
				});
			},
			onTextRefuse(item) {
				this.choseOne = item;
				this.showRefuse = true;
			},
			onTextGoOn(item) {
				this.choseOne = item;
				this.showGoOn = true;
			},
			goPopEnd(item) {
				this.choseOne = item;
				this.showEnd = true;
			},
			goChufang(item) {
				uni.setStorageSync('taskItem', item);
				uni.navigateTo({
					url: `/pages2/pages/chufang2/cf-add?preType=${item.broadClassify===4 ? 'appPrePrescription' : 'consultOrderPrescription'}`
				});
			},
			goChatClick(item) {
				this.goChatRoom(item);
			},
			goChatRoom(item) {
				uni.setStorageSync('taskItem', item);
				uni.navigateTo({
					url: `/pages2/pages/TUI-Chat-Group2/chat?conversationID=GROUP${item.imGroupId}`
				});
			},
			showComments(item) {
				this.$refs.TUIViewRate.open(item.orderId);
			},
			goChatHistory(item) {
				uni.setStorageSync('taskItem', item);
				uni.navigateTo({
					url: `/pages2/pages/TUI-Group-History/chat?conversationID=GROUP${item.imGroupId}`
				});
			},
			goCall(item) {
				if (!item.docPhone || !item.userPhone){
					uni.showToast({
						title: '号码有误！',
						icon: 'none'
					});
					return;
				}
				uni.showLoading({
					title: '正在加载'
				});
				uni.$u.http.post('/medical-api/rightsUse/doManualCall', {
					tradeId: item.id,
					distPhone: item.userPhone,
					sourcePhone: item.docPhone
				}).then(res => {
					uni.hideLoading();
					if (res.code == 0){
						uni.showToast({
							title: '操作成功,请接听电话！',
							icon: 'none'
						});
					}
				});
			},
			goCallVideo(item) {
				this.getMyDetail(item);
			},
			getMyDetail(item) {
				uni.$u.http.post('/medical-api/rightsUse/qryRightsUseRecord', {
					id: item.id
				}).then(res => {
					uni.hideLoading();
					item.serviceTime = res.data[0].serviceTime;
					item.usedServiceTime = res.data[0].usedServiceTime;
					if (item.serviceTime-item.usedServiceTime <= 0){
						uni.showToast({
							title: '您的视频通话时长已用尽！',
							icon: 'none'
						});
						return;
					}
					this.startVideoCall(item.id);
					this.$refs.TUICall.call(item.userId, item.imGroupId);
				});
			},
			startVideoCall(id) {
				uni.$u.http.get('/medical-api/rightsUse/startVedio', {
					params: {
						tradeId: id
					}
				}).then(res => {});
			},
			refreshAllData() {
				this.resetPage();
				this.getList();
			},
			goRefuse() {
				uni.showLoading({
					title: '正在加载'
				});
				uni.$u.http.post('/medical-api/rightsUse/rejectRightsUseReq', {
					id: this.choseOne.id
				}).then(res => {
					uni.hideLoading();
					if (res.code == 0){
						this.showRefuse = false;
						this.refreshAllData();
						uni.showToast({
							title: '操作成功！',
							icon: 'none'
						});
					}
				});
			},
			goOn() {
				uni.showLoading({
					title: '正在加载'
				});
				uni.$u.http.post('/medical-api/rightsUse/confirmRightsUseReq', {
					id: this.choseOne.id,
					confirmTime: this.formatDateFull(new Date())
				}).then(res => {
					uni.hideLoading();
					if (res.code == 0) {
						this.showGoOn = false;
						this.refreshAllData();
						this.itemClick(this.choseOne);
					}
				});
			},
			endTalk() {
				uni.showLoading({
					title: '正在加载'
				});
				uni.$u.http.post('/medical-api/rightsUse/endRightsUseReq', {
					id: this.choseOne.id
				}).then(res => {
					uni.hideLoading();
					if (res.code == 0) {
						this.showEnd = false;
						this.refreshAllData();
						uni.showToast({
							title: '操作成功！',
							icon: 'none'
						});
					}
				});
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
				padding: 0 24rpx;
				.item {
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
				position: relative;
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 20rpx 24rpx;
				z-index: 10;
				.left {
					height: 44rpx;
					.btns {
						display: flex;
						align-items: center;
						justify-content: flex-start;
						.btn {
							width: 120rpx;
							margin-right: 20rpx;
							font-size: 24rpx;
							font-weight: 400;
							color: #4D4D4D;
							line-height: 42rpx;
							text-align: center;
							background: #F5F5F5;
							border-radius: 21rpx;
							border: 1rpx solid transparent;
							&.active {
								color: #3894FF;
								border: 1rpx solid #3894FF;
							}
						}
					}
				}
				.right {
					display: flex;
					align-items: center;
					justify-content: flex-end;
					image {
						width: 34rpx;
						height: 34rpx;
						margin-right: 10rpx;
					}
					.name {
						font-size: 28rpx;
						font-weight: 400;
						color: #999999;
						line-height: 42rpx;
					}
					.dot {
						position: relative;
						top: -14rpx;
						left: -8rpx;
						width: 28rpx;
						height: 28rpx;
						font-size: 24rpx;
						font-weight: 400;
						color: #FFFFFF;
						line-height: 28rpx;
						text-align: center;
						background: #3894FF;
						border-radius: 50%;
					}
				}
				.choose-abs {
					position: absolute;
					top: 84rpx;
					left: 0;
					right: 0;
					background: #FFFFFF;
					.up {
						padding: 20rpx 24rpx 350rpx 24rpx;
						.title {
							padding-left: 20rpx;
							font-size: 30rpx;
							font-weight: 400;
							color: #4D4D4D;
							line-height: 38rpx;
							border-left: 6rpx solid #3894FF;
						}
						.list {
							display: flex;
							align-items: center;
							justify-content: flex-start;
							margin-top: 30rpx;
							.item {
								width: 120rpx;
								margin-right: 20rpx;
								font-size: 24rpx;
								font-weight: 400;
								color: #4D4D4D;
								line-height: 42rpx;
								text-align: center;
								background: #F5F5F5;
								border-radius: 21rpx;
								border: 1rpx solid transparent;
								&.active {
									color: #3894FF;
									border: 1rpx solid #3894FF;
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
							font-size: 30rpx;
							font-weight: 400;
							color: #1A1A1A;
							line-height: 80rpx;
							text-align: center;
							border-top: 1rpx solid #E6E6E6;
							&.confirm {
								color: #FFFFFF;
								background: #3894FF;
								border-top: 1rpx solid transparent;
							}
						}
					}
					.mask {
						position: fixed;
						top: 735rpx;
						left: 0;
						right: 0;
						bottom: 0;
						background: #000000;
						opacity: 0.3;
						z-index: 10;
					}
				}
			}
		}
		.content {
			.u-empty {
				padding-top: 200rpx;
			}
			.list {
				max-height: calc(100vh - 0rpx);
				padding: 30rpx 24rpx;
				box-sizing: border-box;
				&.all {
					max-height: calc(100vh - 0rpx);
				}
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
						position: relative;
						display: flex;
						align-items: center;
						justify-content: flex-end;
						padding-bottom: 10rpx;
						.remark-abs {
							position: absolute;
							top: 5rpx;
							left: 0rpx;
							width: 120rpx;
							font-size: 24rpx;
							font-weight: 400;
							color: #FFFFFF;
							line-height: 45rpx;
							text-align: center;
							background: #6796F2;
							border-radius: 4rpx;
							&.inner {
								background: #3FC1A5;
							}
						}
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

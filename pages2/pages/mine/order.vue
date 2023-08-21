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
			<u-empty mode="data" style="padding-top: 500rpx;" icon="/pages2/static/img/icon_nodata.png" v-if="list.length === 0"></u-empty>
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
					<view class="bottom" v-if="item.broadClassify === 4">
						<block v-if="item.status === 2">
							<view class="btn btn2" @click.stop="onTextRefuse(item)">拒诊</view>
							<view class="btn btn1" @click.stop="onTextGoOn(item)">接诊</view>
						</block>
						<block v-if="item.status === 3">
							<view class="btn btn2" @click.stop="goPopEnd(item)">结束问诊</view>
							<view class="btn btn1" @click.stop="goChufang(item)" v-if="item.diagnosisFlag.value === 1">开具处方</view>
							<view class="btn btn1" @click.stop="goChatClick(item)">进入诊室</view>
						</block>
						<block v-if="item.status === 4">
							<view class="btn btn2" @click.stop="showComments(item)" v-if="item.appraiseId">查看评价</view>
							<view class="btn btn2" @click.stop="goChatHistory(item)">查看记录</view>
						</block>
					</view>
					<view class="bottom" v-else-if="item.serviceItemType === 101">
						<block v-if="item.status === 2">
							<view class="btn btn2" @click.stop="onTextRefuse(item)">拒诊</view>
							<view class="btn btn1" @click.stop="onTextGoOn(item)">接诊</view>
						</block>
						<block v-if="item.status === 3">
							<view class="btn btn2" @click.stop="goPopEnd(item)">结束问诊</view>
							<view class="btn btn1" @click.stop="goChufang(item)" v-if="item.diagnosisFlag.value === 1">开具处方</view>
							<view class="btn btn1" @click.stop="goChatClick(item)">进入诊室</view>
						</block>
						<block v-if="item.status === 4">
							<view class="btn btn2" @click.stop="showComments(item)" v-if="item.appraiseId">查看评价</view>
							<view class="btn btn2" @click.stop="goChatHistory(item)">查看记录</view>
						</block>
					</view>
					<view class="bottom" v-else-if="item.serviceItemType === 102">
						<block v-if="item.status === 2">
							<view class="btn btn2" @click.stop="onTextRefuse(item)">拒诊</view>
							<view class="btn btn1" @click.stop="onTextGoOn(item)">接诊</view>
						</block>
						<block v-if="item.status === 3">
							<view class="btn btn2" @click.stop="goPopEnd(item)">结束问诊</view>
							<view class="btn btn1" @click.stop="goChufang(item)" v-if="item.diagnosisFlag.value === 1">开具处方</view>
							<view class="btn btn1" @click.stop="goCall(item)">拨打电话</view>
						</block>
						<block v-if="item.status === 4">
							<view class="btn btn2" @click.stop="showComments(item)" v-if="item.appraiseId">查看评价</view>
						</block>
					</view>
					<view class="bottom" v-else-if="item.serviceItemType === 103">
						<block v-if="item.status === 2">
							<view class="btn btn2" @click.stop="onTextRefuse(item)">拒诊</view>
							<view class="btn btn1" @click.stop="onTextGoOn(item)">接诊</view>
						</block>
						<block v-if="item.status === 3">
							<view class="btn btn2" @click.stop="goPopEnd(item)">结束问诊</view>
							<view class="btn btn1" @click.stop="goChufang(item)" v-if="item.diagnosisFlag.value === 1">开具处方</view>
							<view class="btn btn1" @click.stop="goCallVideo(item)">发起视频</view>
						</block>
						<block v-if="item.status === 4">
							<view class="btn btn2" @click.stop="showComments(item)" v-if="item.appraiseId">查看评价</view>
						</block>
					</view>
				</view>
			</scroll-view>
		</view>
		
		<tuicall ref="TUICall"></tuicall>
		<TUI-view-rate ref="TUIViewRate" />
		<u-picker :show="show1" :columns="list1" @cancel="cancel1" @confirm="confirm1"></u-picker>
		<u-picker :show="show2" :columns="list2" @cancel="cancel2" @confirm="confirm2"></u-picker>
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
				]],
				
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
			resetPage() {
				this.pageNo = 1;
				this.total = 0;
				this.list = [];
			},
			changeTab(tab) {
				this.serviceItemType = '';
				this.broadClassify = '';
				this.status = '';
				
				this.text1 = '';
				this.text2 = '';
				this.tab = tab;
				
				this.resetPage();
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
			itemClick(item) {
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
			},
			refreshAllData() {
				this.resetPage();
				this.getList();
			},
			
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
				
				this.resetPage();
				this.getList();
			},
			confirm2(e) {
				this.cancel2();
				this.text2 = e.value[0].text;
				this.status = e.value[0].value;
				
				this.resetPage();
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

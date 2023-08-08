<template>
	<view class="wrap" :class="{empty: list.length === 0}">
		<view class="top">
			<view class="left">
				<view class="name">已选：</view>
				<view class="value">{{ weeksName || '未排班，请您点击添加按钮排班' }}</view>
			</view>
			<view class="right">
				<view class="btn" @click="handleAdd()">
					<u-icon class="icon" name="plus-circle" color="#FFFFFF" size="18"></u-icon>
					<text class="text">添加</text>
				</view>
			</view>
		</view>
		<view class="content">
			<u-empty mode="data" style="padding-top: 300rpx;" icon="/pages2/static/img/icon_nodata.png" v-if="list.length === 0"></u-empty>
			<view class="list" v-else>
				<view class="desc">针对视频、电话问诊，可以自行进行排班设置</view>
				<view class="item" v-for="item in list" :key="item.id">
					<view class="left">{{ weekNameMap[item.weekDay+''] || '' }}</view>
					<view class="right">
						<view class="row">
							<view class="value">
								<text>接诊人数：</text>
								<text class="black">{{ item.receiveUserCount || 12 }}人</text>
							</view>
							<u-icon
								class="icon"
								name="arrow-right"
								color="#1A1A1A"
								size="18"
								@click="showPicker(item, 1)"
							></u-icon>
						</view>
						<view class="row">
							<view class="value">
								<text>接诊时间段：</text>
								<text class="black">{{ item.receiveStartTime || '09:00' }}～{{ item.receiveEndTime || '21:00' }}</text>
							</view>
							<u-icon
								class="icon"
								name="arrow-right"
								color="#1A1A1A"
								size="18"
								@click="showPicker(item, 2)"
							></u-icon>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<u-picker
			keyName="label"
			title="请选择"
			:show="show1"
			:columns="columns1"
			@cancel="cancel1"
			@confirm="confirm1"
		></u-picker>
		<u-picker
			keyName="label"
			title="请选择"
			:show="show2"
			:columns="columns2"
			@cancel="cancel2"
			@confirm="confirm2"
		></u-picker>
		<u-popup
			:show="show3"
			:closeOnClickOverlay="false"
			@close="cancel3"
		>
			<view class="wrap-popu">
				<view class="head">
					<view class="cancel" @click="cancel3">取消</view>
					<view class="title">请选择</view>
					<view class="confirm" @click="confirm3">确定</view>
				</view>
				<view class="weeks">
					<view class="row">
						<view class="week" :class="{active: weekMap['1']}" @click="weekClick(1)">周一</view>
						<view class="week" :class="{active: weekMap['2']}" @click="weekClick(2)">周二</view>
						<view class="week" :class="{active: weekMap['3']}" @click="weekClick(3)">周三</view>
						<view class="week" :class="{active: weekMap['4']}" @click="weekClick(4)">周四</view>
					</view>
					<view class="row">
						<view class="week" :class="{active: weekMap['5']}" @click="weekClick(5)">周五</view>
						<view class="week" :class="{active: weekMap['6']}" @click="weekClick(6)">周六</view>
						<view class="week" :class="{active: weekMap['7']}" @click="weekClick(7)">周日</view>
						<view class="week empty"></view>
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				options: {},
				show1: false,
				show2: false,
				show3: false,
				loading: false,
				columns1: [
					[
						{
							id: 12,
							label: '12人'
						},
						{
							id: 15,
							label: '15人'
						},
						{
							id: 20,
							label: '20人'
						},
						{
							id: 30,
							label: '30人'
						},
						{
							id: 40,
							label: '40人'
						},
						{
							id: 60,
							label: '60人'
						}
					]
				],
				columns2: [
					[
						{ id: 9, label: '09:00' },
						{ id: 10, label: '10:00' },
						{ id: 11, label: '11:00' },
						{ id: 12, label: '12:00' },
						{ id: 13, label: '13:00' },
						{ id: 14, label: '14:00' },
						{ id: 15, label: '15:00' },
						{ id: 16, label: '16:00' },
						{ id: 17, label: '17:00' },
						{ id: 18, label: '18:00' },
						{ id: 19, label: '19:00' },
						{ id: 20, label: '20:00' },
					],
					[
						{ id: 0, label: '至' }
					],
					[
						{ id: 10, label: '10:00' },
						{ id: 11, label: '11:00' },
						{ id: 12, label: '12:00' },
						{ id: 13, label: '13:00' },
						{ id: 14, label: '14:00' },
						{ id: 15, label: '15:00' },
						{ id: 16, label: '16:00' },
						{ id: 17, label: '17:00' },
						{ id: 18, label: '18:00' },
						{ id: 19, label: '19:00' },
						{ id: 20, label: '20:00' },
						{ id: 21, label: '21:00' },
					]
				],
				list: [],
				weekMap: {},
				weekNameMap: {
					'1': '周一',
					'2': '周二',
					'3': '周三',
					'4': '周四',
					'5': '周五',
					'6': '周六',
					'7': '周日'
				},
				currentItem: {},
				userId: ((uni.getStorageSync('account') || {}).user || {}).userId
			}
		},
		computed: {
			weeksName() {
				const names = this.list.map(item => {
					return this.weekNameMap[item.weekDay+''];
				});
				return names.join('、');
			}
		},
		onLoad(options) {
			this.options = options;
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
				uni.$u.http.post(`/medical-api/tdArrangeWorkTime/getDocArrangeInfo`, {
					userId: this.userId,
					type: this.options.type
				}).then(res => {
					uni.hideLoading();
					this.list = res.data || [];
				}).catch(error => {
					uni.hideLoading();
				});
			},
			geneWeekMap() {
				const map = {};
				this.list.forEach(item => {
					map[item.weekDay+''] = true;
				});
				this.weekMap = map;
			},
			weekClick(week) {
				this.weekMap[week+''] = !this.weekMap[week+''];
				this.weekMap = JSON.parse(JSON.stringify(this.weekMap));
			},
			handleAdd() {
				this.show3 = true;
				this.geneWeekMap();
			},
			showPicker(item, num) {
				this.currentItem = item;
				this[`show${num}`] = true;
			},
			cancel1() {
				this.show1 = false;
			},
			confirm1(e) {
				const receiveUserCount = e.value[0].id;
				if (this.loading){
					return;
				}
				this.loading = true;
				uni.showLoading({
					title:'正在加载'
				});
				uni.$u.http.post('/medical-api/tdArrangeWorkTime/modifyArrangeInfo', {
					receiveUserCount,
					id: this.currentItem.id
				}).then(res => {
					this.cancel1();
					uni.hideLoading();
					uni.showToast({
						title: '保存成功',
						icon: 'success'
					});
					this.$set(this.currentItem, 'receiveUserCount', receiveUserCount);
				}).catch(error => {
					uni.hideLoading();
				}).finally(() => {
					this.loading = false;
				});
			},
			cancel2() {
				this.show2 = false;
			},
			confirm2(e) {
				const receiveStartTime = e.value[0].label;
				const receiveEndTime = e.value[2].label;
				if (e.value[0].id >= e.value[2].id){
					uni.showToast({
						title: '结束时间必须大于开始时间',
						icon: 'none'
					});
					return;
				}
				if (this.loading){
					return;
				}
				this.loading = true;
				uni.showLoading({
					title:'正在加载'
				});
				uni.$u.http.post('/medical-api/tdArrangeWorkTime/modifyArrangeInfo', {
					receiveStartTime,
					receiveEndTime,
					id: this.currentItem.id
				}).then(res => {
					this.cancel2();
					uni.hideLoading();
					uni.showToast({
						title: '保存成功',
						icon: 'success'
					});
					this.$set(this.currentItem, 'receiveStartTime', receiveStartTime);
					this.$set(this.currentItem, 'receiveEndTime', receiveEndTime);
				}).catch(error => {
					uni.hideLoading();
				}).finally(() => {
					this.loading = false;
				});
			},
			cancel3() {
				this.show3 = false;
			},
			confirm3(e) {
				const weekDay = [];
				for (let key in this.weekMap){
					if (this.weekMap[key]){
						weekDay.push(key);
					}
				}
				if (this.loading){
					return;
				}
				this.loading = true;
				uni.showLoading({
					title:'正在加载'
				});
				uni.$u.http.post('/medical-api/tdArrangeWorkTime/addArrangeInfo', {
					weekDay,
					userId: this.userId,
					type: this.options.type
				}).then(res => {
					this.cancel3();
					uni.hideLoading();
					uni.showToast({
						title: '添加成功',
						icon: 'success'
					});
					setTimeout(() => {
						this.getList();
					}, 2000);
				}).catch(error => {
					uni.hideLoading();
				}).finally(() => {
					this.loading = false;
				});
			}
		}
	}
</script>

<style lang="scss">
	.wrap {
		min-height: 100vh;
		background: #FFFFFF;
		&.empty {
			background: #F2F2F2;
		}
		.top {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 30rpx 24rpx;
			background: #FFFFFF;
			.left {
				display: flex;
				align-items: flex-start;
				justify-content: flex-start;
				max-width: 495rpx;
				font-size: 28rpx;
				font-weight: 400;
				line-height: 34rpx;
				.name {
					color: #999999;
					white-space: nowrap;
				}
				.value {
					color: #1A1A1A;
				}
			}
			.right {
				padding-right: 6rpx;
				.btn {
					display: flex;
					align-items: center;
					justify-content: center;
					width: 138rpx;
					height: 62rpx;
					background: #5A9CF8;
					border-radius: 31rpx;
					.icon {
						padding-right: 6rpx;
						font-size: 28rpx;
						color: #FFFFFF;
						line-height: 34rpx;
					}
					.text {
						font-size: 28rpx;
						font-weight: 400;
						color: #FFFFFF;
						line-height: 34rpx;
					}
				}
			}
		}
		.content {
			.list {
				.desc {
					padding: 0 24rpx;
					font-size: 28rpx;
					font-weight: 400;
					color: #4D4D4D;
					line-height: 80rpx;
					background: #F2F2F2;
				}
				.item {
					display: flex;
					align-items: center;
					justify-content: space-between;
					.left {
						width: 90rpx;
						height: 160rpx;
						font-size: 30rpx;
						font-weight: 500;
						color: #1A1A1A;
						line-height: 160rpx;
						text-align: center;
						box-sizing: border-box;
						border-right: 1rpx solid #CCCCCC;
						border-bottom: 1rpx solid #CCCCCC;
					}
					.right {
						flex: 1;
						.row {
							display: flex;
							align-items: center;
							justify-content: space-between;
							height: 80rpx;
							box-sizing: border-box;
							border-bottom: 1rpx solid #CCCCCC;
							.value {
								padding-left: 20rpx;
								font-size: 28rpx;
								font-weight: 400;
								color: #999999;
								line-height: 80rpx;
								.black {
									color: #1A1A1A;
								}
							}
							.icon {
								padding: 0 20rpx;
								font-size: 28rpx;
								color: #1A1A1A;
								line-height: 80rpx;
							}
						}
					}
				}
			}
		}
		.wrap-popu {
			background: #FFFFFF;
			.head {
				display: flex;
				align-items: center;
				justify-content: space-between;
				height: 80rpx;
				font-size: 28rpx;
				font-weight: 400;
				line-height: 80rpx;
				.cancel {
					padding: 0 30rpx;
					color: #909193;
				}
				.title {
					color: #303133;
				}
				.confirm {
					padding: 0 30rpx;
					color: #3c9cff;
				}
			}
			.weeks {
				padding: 30rpx 30rpx 90rpx 30rpx;
				.row {
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-bottom: 30rpx;
					.week {
						display: flex;
						align-items: center;
						justify-content: center;
						width: 138rpx;
						height: 62rpx;
						font-size: 28rpx;
						font-weight: 400;
						color: #5A9CF8;
						line-height: 36rpx;
						text-align: center;
						box-sizing: border-box;
						border: 1rpx solid #5A9CF8;
						border-radius: 31rpx;
						&.active {
							color: #FFFFFF;
							border: none;
							background: #5A9CF8;
						}
						&.empty {
							border: none;
						}
					}
				}
			}
		}
	}
</style>

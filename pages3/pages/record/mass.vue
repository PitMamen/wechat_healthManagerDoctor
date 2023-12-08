<template>
	<view class="wrap">

		<view class="card" v-for="(item, index) in tagsData">
			<view class="nameview">收件人：{{item.nameTags}}等共计<text
					style="color: #3894FF;">{{item.userNames.length}}</text>人</view>
			<view class="line"></view>

			<view v-if="item.message_type === 1" class="msgview">{{item.message_original_name}}</view>
			<view v-else-if="item.message_type === 2" class="midview">
				<u-icon name="/pages3/static/static/images/jiankangxuanjiao.png" color="#2979ff" size="20"></u-icon>
				<view class="midview-right">
					<view>宣教文章</view>
					<view style="margin-top: 10rpx;">{{item.message_original_name}}</view>
				</view>
			</view>
			<view v-else-if="item.message_type === 3" class="midview">
				<u-icon name="/pages3/static/static/images/wenjuan.png" color="#2979ff" size="20"></u-icon>
				<view class="midview-right">
					<view>问卷评估</view>
					<view style="margin-top: 10rpx;">{{item.message_original_name}}</view>
				</view>
			</view>
			
			<!-- add -->
			<view v-else-if="item.message_type === 4" class="midview">
				<u-icon name="/pages3/static/static/images/wenjuan.png" color="#2979ff" size="20"></u-icon>
				<view class="midview-right">
					<view>随访计划</view>
					<view style="margin-top: 10rpx;">{{item.message_original_name}}</view>
				</view>
			</view>

			<view class="line"></view>
			<view v-if="item.succCount === item.sumCount" class="tags-item">
				<view class="tagleft">
					<u-icon name="/pages3/static/static/images/icon_wc.png" color="#2979ff" size="20"></u-icon>
					<view class="tagname">发送完成</view>
				</view>
				<view class="tagbtn" @click="sendAgain(item)">再发一条</view>

			</view>
			<view v-else class="tags-item">
				<view class="tagleft">
					<u-icon name="/pages3/static/static/images/jinhangzhong.png" color="#2979ff" size="20"></u-icon>
					<view class="tagname2">发送中（{{item.succCount}}/{{item.sumCount}}）</view>
				</view>
				<view class="tagbtn" @click="sendAgain(item)">再发一条</view>

			</view>
		</view>

		<u-loadmore v-if="tagsData.length>0" :status="status" color="#999999" />

		<view style="height: 150rpx;"></view>

		<view class="fix">
			<view class="save-btn" @click="btnClick">新建群发</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				info: {},
				requestData: {
					pageNo: 1,
					pageSize: 20,
				},
				tagsData: [],
				status: 'loadmore',
				isCompleted: false,
				requestting:false
			}
		},
		onLoad() {
			this.info = uni.getStorageSync('cashItem');
		},
		onReady() {},
		onShow() {
			this.getList(true)
		},
		//下拉刷新监听
		onPullDownRefresh() {
			console.log('refresh');

			this.getList(true)
		},
		//加载更多
		onReachBottom() {
			if (this.isCompleted) return;
			this.status = 'loading';
			this.getList(false)

		},
		methods: {
			getList(isRefresh) {
				if (isRefresh) {
					this.isCompleted = false
					this.requestData.pageNo = 1
					uni.showLoading({
						title: '加载中'
					})
				} else {
					this.requestData.pageNo = this.requestData.pageNo + 1
				}
				uni.$u.http.post('/medical-api/tlSendImMessageLog/getSendImMessageLogPageList', this.requestData).then(
					res => {

						var list = res.data.records || []
						list.forEach(item => {

							item.nameTags = item.userNames.filter((nameItem, nameIndex) => {
								return nameIndex < 6
							}).join('、')

						})

						if (isRefresh) {
							this.tagsData = list
						} else {
							this.tagsData = [...this.tagsData, ...list];
						}


						if (res.data.current >= res.data.pages) {
							this.isCompleted = true
							this.status = 'nomore';

						} else {
							this.status = 'loadmore';
						}

						uni.stopPullDownRefresh();
						uni.hideLoading()
					});

			},
			//再发一条
			sendAgain(item){
			
				let that = this
				
				if (this.requestting) {
					return
				}
			
				this.requestting = true
			
				setTimeout(() => {
					that.requestting = false
				}, 2000)
			
			
			
				uni.showLoading({
					title: '发送中'
				});
				uni.$u.http.post('/medical-api/tlSendImMessageLog/addImMessageLog', {
					"messageType": item.message_type,
					"sendMessage": item.message_original_name,
					"sendUserIds": item.userIds.split(','),
					"messageOriginalId":item.message_original_id,
					"payLoad":item.pay_load
			
				}).then(res => {
			
					uni.showToast({
						title: '发送成功',
						icon: 'success'
					});
					setTimeout(() => {
						that.getList(true)
					}, 1500)
			
				})
			
			},
			btnClick() {
				uni.navigateTo({
					url: './choose-patient?type=TextMessage'
				});
			},


			onItemTap(item) {
				uni.navigateTo({
					url: './edit?tagsName=' + item.tags_name + '&id=' + item.id
				});
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F5F5F5;
	}

	.fix {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 750rpx;
		padding-bottom: 30rpx;
		background: #F5F5F5;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;


		.save-btn {
			margin-left: 30rpx;
			width: 690rpx;
			font-size: 30rpx;
			font-weight: 400;
			color: #FFFFFF;
			line-height: 70rpx;
			text-align: center;
			background: #409EFF;
			border-radius: 10rpx;
			margin-right: 30rpx;

		}
	}

	.wrap {

		display: flex;
		flex-direction: column;
		background: #F5F5F5;
		box-sizing: border-box;
		padding: 30rpx 24rpx;

		.card {
			padding: 30rpx 26rpx;
			margin-bottom: 30rpx;
			border-radius: 4rpx;
			background-color: white;
			box-shadow: 0px 3rpx 6rpx 0px rgba(204, 204, 204, 0.35);
			display: flex;
			flex-direction: column;

			.line {
				width: 650rpx;
				height: 1rpx;
				background: #E6E6E6;
				margin-bottom: 30rpx;
				margin-top: 30rpx;


			}

			.nameview {

				font-size: 24rpx;

				color: #999999;
				line-height: 37rpx;
			}

			.msgview {

				font-size: 30rpx;
				color: #4D4D4D;
				line-height: 37rpx;
				width: 650rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 1;
				-webkit-box-orient: vertical;
			}


			.tags-item {

				display: flex;
				justify-content: space-between;
				flex-direction: row;
				align-items: center;

			}

			.tagleft {
				display: flex;

				flex-direction: row;
				align-items: center;
			}

			.tagname {
				font-size: 24rpx;
				margin-left: 20rpx;
				color: #5FCC5A;
				line-height: 37rpx;
			}

			.tagname2 {
				font-size: 24rpx;
				margin-left: 20rpx;
				color: #3894FF;
				line-height: 37rpx;
			}

			.tagbtn {
				width: 162rpx;
				height: 60rpx;
				background-color: #FFFFFF;
				border: 1rpx solid #3894FF;
				border-radius: 30rpx;
				font-size: 30rpx;
				color: #3894FF;
				display: flex;
				justify-content: center;
				flex-direction: row;
				align-items: center;
			}:active {
				background-color: #F5F5F5;
			}

			.midview {
				display: flex;

				flex-direction: row;
				align-items: flex-start;
			}

			.midview-right {
				display: flex;

				flex-direction: column;
				margin-left: 18rpx;
				font-size: 24rpx;

				color: #4D4D4D;
				line-height: 37rpx;
			}


		}


	}
</style>
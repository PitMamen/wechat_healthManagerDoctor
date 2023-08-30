<template>
	<view class="content">
		<!-- <u-sticky bgColor="#fff"> -->
		<!-- 搜索框 -->
		<view class="hor-input">
			<!-- <image class="img-qr" src="/pages2/static/img/qr_blue.png" /> -->
			<view class="search-wrap">
				<view class="search">
					<u-search v-model="searchName" placeholder="请输入患者名字" :show-action="false" @change="searchChange">
					</u-search>
				</view>
			</view>

			<view class="text-name" style="margin: 0 20rpx" @tap="goBack">取消</view>
			<!-- <image class="img-qr" style="margin-right: 30rpx;" src="/pages2/static/img/add_icon.png" /> -->
		</view>

		<!-- 列表 -->
		<view class="view-list" v-for="(item, index) in listData" @click="onItemClick(index)" :key="index">
			<view class="view-info-list">
				<view class="v-num">
					<image mode="aspectFit" style="width: 80rpx;height: 80rpx;float: left;"
						src="/pages2/static/static/images/header.png"></image>
					<view class="v-num-wrap" v-if="item.unreadCount > 0">
						<view class="num">{{ item.unreadCount||'' }}</view>
					</view>

				</view>
				<view class="view-info-personal-list">
					<view class="info-personal-list">
						<view style="flex: 1;display: flex;flex-direction: row;">
							<view style="font-size: 32rpx;color: #1A1A1A;font-weight: bold;">{{item.userName}}</view>
						</view>

						<view style="font-size: 24rpx;color: #999999">{{item.lastMsgTime}}</view>
					</view>
					<view
						style="font-size: 28rpx;color: ##999999;margin-top: 5rpx;overflow: hidden; text-overflow: ellipsis; white-space: nowrap">
						<!-- {{item.nick+'：' +item.nearMsg}} -->
						{{item.nick?(item.nick+'：' +item.nearMsg):'无最新消息'}}
					</view>
				</view>

			</view>

		</view>
		<u-empty mode="data" style="padding-top: 300rpx;" v-if="listData.length === 0"
			icon="/pages2/static/img/icon_nodata.png"></u-empty>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello',
				account: '',
				psd: '',
				listData: [],
				conversationIDList: [],
				searchName: '',
			}
		},
		onLoad(option) {
			this.account = uni.getStorageSync('account');
			console.log('option', option)
		},
		methods: {
			searchChange(name) {
				if (name) {
					this.getChatList(name)
				}
			},

			goBack() {
				uni.navigateBack({
					delta: 1
				});
			},

			getChatList(name) {
				this.conversationIDList = []
				uni.$u.http.post('/medical-api/rightsUse/qryRightsUsingByDoc', {
					keyWord: name,
					userId: this.account.user.userId
				}).then(res => {
					res.data = res.data || {};
					if (res.data.length > 0) {
						res.data.forEach((item) => {
							this.$set(item, 'type', 2)
							this.$set(item, 'headUrl', '/pages2/static/static/images/header.png')
							// this.$set(item, 'nearMsg', '在吗？吃饭了吗')

							if (item.imGroupId) {
								console.log('ggg', 'GROUP' + item.imGroupId)
								this.$set(item, 'conversationID', 'GROUP' + item.imGroupId)
								this.conversationIDList.push(item.conversationID)
							}
						})


						console.log('fff', res.data)
						this.listData = []
						this.listData = this.listData.concat(res.data)
						console.log('fffddd', this.listData)
						this.getConversationList() //TODO 聊天H5 api暂时无法使用
					}
				});
			},

			//获取问诊列表的未读数
			getConversationList() {
				if (this.conversationIDList.length == 0) {
					return
				}
				console.log(this.conversationIDList)
				// if (getApp().globalData.sdkReady) {
				// 获取指定的会话列表
				let promise = uni.$TUIKit.getConversationList(this.conversationIDList);
				let that = this
				let listDataTemp = JSON.parse(JSON.stringify(this.listData))
				promise.then(function(imResponse) {
					const conversationList = imResponse.data.conversationList; // 缓存中已存在的指定的会话列表
					console.log("获取指定的会话列表", JSON.stringify(conversationList))
					console.log("获取指定的会话列表dd", imResponse)
					// var num = 0
					if (conversationList && conversationList.length > 0) {
						for (var i = 0; i < conversationList.length; i++) {
							for (var j = 0; j < listDataTemp.length; j++) {
								if (conversationList[i].conversationID == listDataTemp[j].conversationID) {
									listDataTemp[j].unreadCount = conversationList[i].unreadCount
									listDataTemp[j].nearMsg = conversationList[i].lastMessage.messageForShow
									listDataTemp[j].nick = conversationList[i].lastMessage.nick
									listDataTemp[j].lastMsgTime = that.formatDateFull(conversationList[i]
										.lastMessage
										.lastTime * 1000)
									// num = num + conversationList[i].unreadCount
								}
							}
						}
						// that.setData({
						// 	appointList: appointList,
						// 	unreadConsult: num
						// })
					}
					that.listData = listDataTemp
					console.log("转换后的数据", JSON.stringify(listDataTemp))
				}).catch(function(imError) {
					console.warn('getConversationList error:', imError); // 获取会话列表失败的相关信息
				})
				// this.listData = listDataTemp
				// }

			},

			onItemClick(index) {
				uni.setStorageSync('taskItem', this.listData[index]);
				this.listData[index].unreadCount = 0
				// this.chatList()
				uni.navigateTo({
					url: `/pages2/pages/TUI-Chat-Group2/chat?conversationID=GROUP${this.listData[index].imGroupId}`
				});

			},

			formatDateFull(date) {
				date = new Date(date)
				let myyear = date.getFullYear()
				let mymonth = date.getMonth() + 1
				let myweekday = date.getDate()
				let oHour = date.getHours()
				let oMin = date.getMinutes()
				let oSen = date.getSeconds()
				mymonth < 10 ? (mymonth = '0' + mymonth) : mymonth
				myweekday < 10 ? (myweekday = '0' + myweekday) : myweekday
				oHour < 10 ? (oHour = '0' + oHour) : oHour
				oMin < 10 ? (oMin = '0' + oMin) : oMin
				oSen < 10 ? (oSen = '0' + oSen) : oSen
				return `${myyear}-${mymonth}-${myweekday} ${oHour}:${oMin}:${oSen}`
			},

		}
	}
</script>

<style lang="scss">
	.content {
		background-color: #F7F7F7;
		/* height: 100vh; */
		min-height: 100vh;
		/* overflow-y: auto; */
		overflow: hidden;
		display: flex;
		background-color: white;
		align-items: center;
		/* padding: 0 20rpx; */
		flex-direction: column;
	}

	.hor-input {
		display: flex;
		/* flex: 0 0 100rpx; */
		/* position: fixed; */
		width: 100%;
		background-color: white;
		padding: 16rpx 20rpx;
		margin-left: 40rpx;
		margin-right: 40rpx;
		/* margin-top: 20rpx; */
		flex-direction: row;
		align-items: center;
		/* border-radius: 5px; */
	}

	.view-list {
		// display: flex;
		// flex-direction: column;
		// padding: 30rpx 30rpx;

		.view-info-list {
			margin-left: 30rpx;
			margin-right: 30rpx;
			margin-top: 30rpx;
			padding-bottom: 30rpx;
			// margin: 30rpx 30rpx 0 30rpx;
			overflow: hidden;
			border-bottom: 1rpx solid #E6E6E6;
			width: 92vw;
			display: flex;
			flex-direction: row;
			align-items: center;

			.v-num {
				// width: 500rpx;
				display: flex;
				flex-direction: row;

				.v-num-wrap {
					margin-left: -30rpx;
					width: 40rpx;
					height: 40rpx;
					z-index: 100;
					display: flex;
					align-items: center;
					flex-direction: row;
					background: #FF482C;
					justify-content: center;
					border-radius: 20rpx;

					.num {
						font-size: 20rpx;
						// font-family: PingFang SC;
						// font-weight: 400;
						color: #FFFFFF;
					}
				}


			}

			.view-info-personal-list {
				display: flex;
				margin-left: 30rpx;
				flex: 1;
				flex-direction: column;
				// align-items: center;

				.info-personal-list {
					margin-top: 5rpx;
					display: flex;
					flex-direction: row;
				}
			}


		}


	}

	.img-qr {
		width: 66rpx;
		height: 66rpx;
		margin-left: 30rpx;
		/* margin-left: -8px; */
	}

	.u-search {
		flex: none;
	}

	.search-wrap {
		flex: 1;
	}

	.search {
		margin-left: 20rpx !important;
		/* width: 330rpx !important; */
	}

	.wrap-sub {
		margin-top: 1%;
		width: 50%;
		padding-left: 20rpx;
	}

	/deep/ .u-tabs__wrapper__nav__item__text {
		font-size: 28rpx !important;
		color: #333333;
	}

	.item-wrap {
		width: 88%;
		display: flex;
		/* margin-top: 3%; */
		flex-direction: column;
		border-radius: 8rpx;
		padding: 20rpx 0 20rpx 20rpx;
		/* padding: 10px 10px; */
		overflow: hidden;
		background-color: white;
		align-items: center;
	}

	.text-name {
		color: #333333;

		font-size: 28rpx;
	}

	.item-status {
		margin-top: 2%;
		display: flex;
		flex-direction: row;
		width: 100%;
		overflow: hidden;
	}

	/* .img-locate-item {
	width: 24rpx;
	height: 30rpx;
}

.text-distance {
	font-size: 24rpx;
	color: #666666;
	margin-left: 20rpx;
}
 */
	.text-status {
		font-size: 24rpx;
		color: #3E7EF8;
		margin-left: 32rpx;
	}

	.text-adress {
		width: 100%;
		margin-top: 2%;
		height: 38rpx;
		border-bottom: #EEEEEE 4rpx solid;
		padding-bottom: 3rpx;
		color: #999999;
		font-size: 28rpx;
	}
</style>
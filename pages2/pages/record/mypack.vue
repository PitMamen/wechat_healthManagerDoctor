<template>
	<view class="wrap">
		<view class="head">
			<u-search placeholder="输入套餐名称进行搜索" v-model="value" :show-action="false" @change="change"></u-search>
		</view>
		<view class="content">
			<u-empty mode="data" style="padding-top: 300rpx;" icon="/pages2/static/img/icon_nodata.png"
				v-if="list.length === 0"></u-empty>
			<!-- <scroll-view class="list" :scroll-y="true" @scrolltolower="scrolltolower" v-else> -->
			<view class="list" v-else>
				<view class="item" v-for="item in list" :key="item.commodityId">
					<view class="item-top">
						<image mode="aspectFit" style="width: 208rpx;height: 168rpx;" :src="item.frontImg"></image>
						<view class="top-right">
							<view style="font-size: 30rpx;color: #1A1A1A;font-weight: bold;">{{item.commodityName}}
							</view>
							<view style="margin-top: 10rpx;">{{item.subjectClassifyName}}</view>
							<view style="margin-top: 10rpx;">{{item.doctors}}</view>
							<view style="margin-top: 10rpx;">套餐价格：<text style="color: red;">￥{{item.startPrice +' '}}
								</text>起</view>

						</view>

					</view>

					<view style="height: 1rpx;background-color: #e6e6e6;margin-top: 30rpx;"></view>

					<view class="view-btn" @click="sendHandler(item)">
						<!-- <image src="/pages2/static/static/images/group/icon_send.png"></image> -->
						<text>发送</text>
					</view>
					<!-- 					<view class="top" @click="viewHandler(item)">
						<view class="row title">
							<image src="/pages2/static/static/images/group/icon_note.png"></image>
							<text>{{ item.name || '' }}</text>
						</view>
						<view class="row desc">{{ item.departmentName || '暂无' }}</view>
					</view>
					<view class="bottom">
						<view class="btn" @click="sendHandler(item)">
							<image src="/pages2/static/static/images/group/icon_send.png"></image>
							<text>发送给患者</text>
						</view>
					</view> -->
				</view>
			</view>
			<!-- </scroll-view> -->
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				flag: false,
				total: 0,
				pageNo: 1,
				value: '',
				list: []
			}
		},
		onLoad() {
			this.getList();
		},
		onReady() {},
		onShow() {},
		methods: {
			viewHandler(item) {
				uni.navigateTo({
					url: `/pages2/pages/group/paper-info?id=${item.id}&name=${item.name}&userId=${item.user_id}&url=${encodeURIComponent(item.questUrl)}`
				});
			},
			sendHandler(item) {
				console.log('sendHandler', item)
				const pages = getCurrentPages();
				console.log('sendHandler pages', pages)
				if (pages.length > 1) {
					const page = pages[pages.length - 1 - 1];
					if (page.route === 'pages2/pages/TUI-Chat-Group/chat' || page.route ===
						'pages2/pages/TUI-Chat-Group2/chat') {
						page.$vm.sendCustomMessage({
							detail: {
								payload: {
									data: JSON.stringify({
										// description: '问卷卡',
										description: '推荐购买',
										id: item.commodityId,
										name: item.commodityName,
										type: 'CustomTaoCanMessage',
										// type: 'CustomArticleMessage',
										// url: item.questUrl,
										// userId: item.user_id
									}),
									extension: '',
									// description: '问卷卡'
									description: '推荐购买'
								}
							}
						});
						uni.navigateBack({
							delta: 1
						});
					}
				}
			},
			change() {
				this.value = this.value.trim();
				this.pageNo = 1;
				this.total = 0;
				this.list = [];
				this.getList();
			},
			getList() {
				uni.showLoading({
					title: '正在加载'
				});
				uni.$u.http.get(`/medical-api/commodity/getCommoditiesByUserId`, {
					// uni.$u.http.post(`/medical-api/commodity/getCommoditiesByClassify`, {

					params: {
						commodityName: this.value,
					}

					// pageNo: 1,
					// pageSize: 1000,
					// queryText: this.value,


				}).then(res => {
					// res.data = res.data || {};
					// res.data.list = res.data.list || [];
					// res.data.total = res.data.total || 0;
					// this.total = res.data.total;
					// res.data.records.shift();
					// this.list = res.data.records;
					this.list = res.data;
					console.log('list', this.list)
				}).finally(() => {
					this.flag = false;
					uni.hideLoading();
				});
			},
			scrolltolower() {
				if (this.pageNo * 10 >= this.total) {
					return;
				}
				if (this.flag) {
					return;
				}
				this.flag = true;
				this.pageNo++;
				this.getList();
			}
		}
	}
</script>

<style lang="scss">
	.wrap {
		min-height: 100vh;
		background: #FFFFFF;

		.head {
			position: fixed;
			top: 0;
			width: 100%;
			padding: 30rpx 24rpx;
			z-index: 1;
			background: #FFFFFF;
			box-sizing: border-box;
		}

		.content {
			margin-top: calc(60rpx + 32px);

			.list {
				max-height: calc(100vh - 60rpx - 32px);
				background: white;
				padding: 5rpx 24rpx 30rpx 24rpx;

				.item {
					margin-bottom: 20rpx;
					background: #FFFFFF;
					font-size: 28rpx;
					box-shadow: 0px 3rpx 3rpx 0px #e6e6e6;
					padding: 30rpx;
					border: 1rpx solid #e6e6e6;
					color: #999;

					&:first-child {
						// margin-top: 20rpx;
					}

					.item-top {
						display: flex;
						flex-direction: row;
						align-items: center;

						image {
							width: 208rpx;
							height: 168rpx;
							// margin-right: 15rpx;
							// padding: 3rpx 0;
							vertical-align: middle;
						}

						.top-right {
							margin-left: 30rpx;
							display: flex;
							flex-direction: column;
							justify-content: center;
						}
					}

					.view-btn {
						display: flex;
						margin-top: 30rpx;
						flex-direction: row;
						border-radius: 5rpx;
						padding: 20rpx 0;
						background-color: #5A9CF8;
						color: white;
						align-items: center;
						justify-content: center;
					}



					// .top {
					// 	position: relative;
					// 	padding: 28rpx 24rpx;

					// 	.row {
					// 		max-width: 750rpx;
					// 		white-space: nowrap;
					// 		overflow: hidden;
					// 		text-overflow: ellipsis;
					// 	}

					// 	.title {
					// 		font-size: 30rpx;
					// 		font-weight: 500;
					// 		color: #4D4D4D;
					// 		line-height: 36rpx;

					// 		image {
					// 			width: 28rpx;
					// 			height: 30rpx;
					// 			margin-right: 15rpx;
					// 			padding: 3rpx 0;
					// 			vertical-align: middle;
					// 		}

					// 		text {
					// 			vertical-align: middle;
					// 		}
					// 	}

					// 	.desc {
					// 		margin-top: 24rpx;
					// 		font-size: 28rpx;
					// 		font-weight: 400;
					// 		color: #999999;
					// 		line-height: 34rpx;
					// 	}

					// 	.read {
					// 		margin-top: 24rpx;
					// 		font-size: 22rpx;
					// 		font-weight: 400;
					// 		color: #999999;
					// 		line-height: 26rpx;

					// 		image {
					// 			width: 26rpx;
					// 			height: 26rpx;
					// 			margin-right: 10rpx;
					// 			vertical-align: middle;
					// 		}

					// 		text {
					// 			vertical-align: text-bottom;
					// 		}
					// 	}

					// 	.abs {
					// 		position: absolute;
					// 		top: 28rpx;
					// 		right: 24rpx;
					// 		width: 140rpx;
					// 		height: 140rpx;
					// 	}
					// }

					// .bottom {
					// 	padding: 30rpx 0;
					// 	border-top: 1rpx solid #E6E6E6;

					// 	.btn {
					// 		text-align: center;

					// 		image {
					// 			display: inline-block;
					// 			width: 33rpx;
					// 			height: 31rpx;
					// 			margin-right: 10rpx;
					// 			vertical-align: middle;
					// 		}

					// 		text {
					// 			font-size: 28rpx;
					// 			font-weight: 400;
					// 			color: #4D4D4D;
					// 			line-height: 31rpx;
					// 			vertical-align: middle;
					// 		}
					// 	}
					// }
				}
			}
		}
	}
</style>
<template>
	<view class="wrap">
		<view class="head">
			<u-search
				placeholder="输入问卷名称进行搜索"
				v-model="value"
				:show-action="false"
				@change="change"
			></u-search>
		</view>
		<view class="content">
			<u-empty mode="data" style="padding-top: 300rpx;" icon="/static/img/icon_nodata.png" v-if="list.length === 0"></u-empty>
			<scroll-view class="list" :scroll-y="true" @scrolltolower="scrolltolower" v-else>
				<view class="item" v-for="item in list" :key="item.id">
					<view class="top" @click="viewHandler(item)">
						<view class="row title">
							<image src="/pages3/static/static/images/group/icon_note.png"></image>
							<text>{{ item.name || '' }}</text>
						</view>
						<view class="row desc">{{ item.departmentName || '暂无' }}</view>
					</view>
					<view class="bottom">
						<view class="btn" @click="sendHandler(item)">
							<image src="/pages3/static/static/images/group/icon_send.png"></image>
							<text>发送给患者</text>
						</view>
					</view>
				</view>
			</scroll-view>
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
		onReady() {
		},
		onShow() {
		},
		methods: {
			viewHandler(item) {
				uni.navigateTo({
					url: `/pages3/pages/group/paper-info?id=${item.id}&name=${item.name}&userId=${item.user_id}&url=${encodeURIComponent(item.questUrl)}`
				});
			},
			sendHandler(item) {
				const paperMsgReq = {
					messageOriginalId: item.id,
					payLoad: JSON.stringify({
						data: JSON.stringify({
							description: '问卷卡',
							id: item.id,
							name: item.name,
							type: 'CustomWenJuanMessage',
							url: item.questUrl,
							userId: item.user_id
						}),
						extension: '',
						description: '问卷卡'
					})
				};
				uni.setStorageSync('paperMsgReq', paperMsgReq);
				uni.navigateTo({
					url: '/pages3/pages/record/choose-patient?type=PaperMessage'
				});
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
					title:'正在加载'
				});
				uni.$u.http.get(`/health-api/health/doctor/qryQuestByKeyWord`, {
					params: {
						keyWord: this.value,
						pageSize: 10,
						start: this.pageNo
					}
				}).then(res => {
					res.data = res.data || {};
					res.data.list = res.data.list || [];
					res.data.total = res.data.total || 0;
					this.total = res.data.total;
					this.list = this.list.concat(res.data.list);
				}).finally(() => {
					this.flag = false;
					uni.hideLoading();
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
				background: #F2F2F2;
				.item {
					margin-bottom: 20rpx;
					background: #FFFFFF;
					&:first-child {
						margin-top: 20rpx;
					}
					.top {
						position: relative;
						padding: 28rpx 24rpx;
						.row {
							max-width: 750rpx;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
						}
						.title {
							font-size: 30rpx;
							font-weight: 500;
							color: #4D4D4D;
							line-height: 36rpx;
							image {
								width: 28rpx;
								height: 30rpx;
								margin-right: 15rpx;
								padding: 3rpx 0;
								vertical-align: middle;
							}
							text {
								vertical-align: middle;
							}
						}
						.desc {
							margin-top: 24rpx;
							font-size: 28rpx;
							font-weight: 400;
							color: #999999;
							line-height: 34rpx;
						}
						.read {
							margin-top: 24rpx;
							font-size: 22rpx;
							font-weight: 400;
							color: #999999;
							line-height: 26rpx;
							image {
								width: 26rpx;
								height: 26rpx;
								margin-right: 10rpx;
								vertical-align: middle;
							}
							text {
								vertical-align: text-bottom;
							}
						}
						.abs {
							position: absolute;
							top: 28rpx;
							right: 24rpx;
							width: 140rpx;
							height: 140rpx;
						}
					}
					.bottom {
						padding: 30rpx 0;
						border-top: 1rpx solid #E6E6E6;
						.btn {
							text-align: center;
							image {
								display: inline-block;
								width: 33rpx;
								height: 31rpx;
								margin-right: 10rpx;
								vertical-align: middle;
							}
							text {
								font-size: 28rpx;
								font-weight: 400;
								color: #4D4D4D;
								line-height: 31rpx;
								vertical-align: middle;
							}
						}
					}
				}
			}
		}
	}
</style>

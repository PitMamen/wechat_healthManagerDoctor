<template>
	<view class="wrap">
		<view class="head">
			<u-search
				placeholder="输入文章标题进行搜索"
				v-model="value"
				:show-action="false"
				@change="change"
			></u-search>
		</view>
		<view class="content">
			<u-empty mode="data" style="padding-top: 300rpx;" icon="/static/img/icon_nodata.png" v-if="list.length === 0"></u-empty>
			<scroll-view class="list" :scroll-y="true" @scrolltolower="scrolltolower" v-else>
				<view class="item" v-for="item in list" :key="item.articleId">
					<view class="top" @click="viewHandler(item)">
						<view class="row title">
							<image src="/pages3/static/static/images/group/icon_note.png"></image>
							<text>{{ item.title || '' }}</text>
						</view>
						<view class="row desc">{{ item.brief || '暂无' }}</view>
						<view class="read">
							<image src="/pages3/static/static/images/group/icon_read.png"></image>
							<text>{{ item.clickNum || 0 }}</text>
						</view>
						<image class="abs" :src="item.previewUrl"></image>
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
					url: `/pages3/pages/group/note-info?id=${item.articleId}&title=${item.title}`
				});
			},
			sendHandler(item) {
				const pages = getCurrentPages();
				if (pages.length > 1){
					const page = pages[pages.length - 1 - 1];
					if (page.route==='pages2/pages/TUI-Chat-Group/chat' || page.route==='pages2/pages/TUI-Chat-Group2/chat'){
						page.$vm.sendCustomMessage({
							detail: {
								payload: {
									data: JSON.stringify({
										content: item.title,
										description: '文章卡',
										id: item.articleId,
										type: 'CustomArticleMessage'
									}),
									extension: '',
									description: '文章卡'
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
					title:'正在加载'
				});
				uni.$u.http.get(`/health-api/health/patient/allArticlesNewPage`, {
					params: {
						status: 2,
						title: this.value,
						pageSize: 20,
						start: this.pageNo
					}
				}).then(res => {
					uni.hideLoading();
					res.data = res.data || {};
					res.data.list = res.data.list || [];
					res.data.total = res.data.total || 0;
					this.total = res.data.total;
					this.list = this.list.concat(res.data.list);
				}).finally(() => {
					this.flag = false;
				});
			},
			scrolltolower() {
				if (this.pageNo*20 >= this.total){
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
							max-width: 540rpx;
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

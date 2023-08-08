<template>
	<view class="wrap">
		<view class="head">
			<view class="info">
				<view class="left">
					<image :src="info.docInfo.avatarUrl || '/pages2/static/static/images/header.png'"></image>
				</view>
				<view class="right">
					<view class="row">
						<text class="name">{{ info.docInfo.userName || '' }}</text>
						<text class="job">{{ info.docInfo.professionalTitle || '' }}</text>
					</view>
					<view class="row">
						<text class="hospital">{{ info.docInfo.hospitalName || '' }}</text>
						<text class="depart">{{ info.docInfo.departmentName || '' }}</text>
					</view>
				</view>
			</view>
			<view class="desc">
				<view class="row">
					<view class="left">患者</view>
					<view class="right">{{ info.userInfo.userName || '' }}  {{ info.userInfo.userSex || '' }}  {{ info.userInfo.userAge || '~' }}岁</view>
				</view>
				<view class="row">
					<view class="left">挂号时间</view>
					<view class="right">{{ info.appointTime || '~' }}</view>
				</view>
				<view class="row">
					<view class="left">咨询类型</view>
					<view class="right">{{ info.broadClassifyName || '~' }}</view>
				</view>
				<view class="row">
					<view class="left">服务截止时间</view>
					<view class="right">{{ info.appointEndTime || '~' }}</view>
				</view>
			</view>
		</view>
		<view class="content">
			<view class="title">患者提交的信息</view>
			<view class="sub-content">
				<view class="sub-title">病情描述</view>
				<view class="desc">{{ info.diseaseDesc || '~' }}</view>
				<view class="sub-title">希望获得帮助</view>
				<view class="desc">{{ info.appealDesc || '~' }}</view>
				<view class="sub-title">上传检查报告或患处图片</view>
				<view class="desc album" v-if="info.imageList.length>0 && info.imageList[0]!==''">
					<u-album :urls="info.imageList" multipleSize="150rpx"></u-album>
				</view>
				<view class="desc" v-else>暂无图片~</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				options: {},
				info: {
					docInfo: {},
					userInfo: {},
					imageList: []
				}
			}
		},
		onLoad(options) {
			this.options = options;
			this.getInfo();
		},
		onReady() {
		},
		onShow() {
		},
		methods: {
			getInfo() {
				uni.showLoading({
					title:'正在加载'
				});
				uni.$u.http.get(`/medical-api/rightsUse/getRightsInfo`, {
					params: {
						rightsId: uni.getStorageSync('taskItem').rightsId,
						tradeId: this.options.tradeId
					}
				}).then(res => {
					this.info = res.data || {};
					this.info.imageList = (this.info.images || '').split(',');
				}).finally(() => {
					uni.hideLoading();
				});
			}
		}
	}
</script>

<style lang="scss">
	.wrap {
		min-height: 100vh;
		background: #F2F2F2;
		.head {
			padding: 0 30rpx;
			background: #FFFFFF;
			.info {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 30rpx 0;
				border-bottom: 1rpx solid #E6E6E6;
				.left {
					width: 102rpx;
					height: 102rpx;
					margin-right: 30rpx;
					image {
						width: 100%;
						height: 100%;
						border-radius: 50%;
					}
				}
				.right {
					flex: 1;
					padding: 5rpx 0;
					font-size: 24rpx;
					font-weight: 400;
					line-height: 44rpx;
					color: #4D4D4D;
					.row {
						.name {
							margin-right: 20rpx;
							font-size: 32rpx;
							color: #1A1A1A;
						}
						.hospital {
							margin-right: 20rpx;
						}
					}
				}
			}
			.desc {
				padding: 15rpx 0;
				.row {
					font-size: 30rpx;
					font-weight: 400;
					line-height: 60rpx;
					color: #4D4D4D;
					overflow: hidden;
					.left {
						float: left;
					}
					.right {
						float: right;
					}
				}
			}
		}
		.content {
			margin-top: 20rpx;
			padding: 10rpx 30rpx;
			background: #FFFFFF;
			.title {
				font-size: 30rpx;
				font-weight: 500;
				line-height: 70rpx;
				color: #1A1A1A;
				border-bottom: 1rpx solid #CCCCCC;
			}
			.sub-content {
				padding-bottom: 20rpx;
				.sub-title {
					font-size: 28rpx;
					font-weight: 500;
					line-height: 68rpx;
					color: #1A1A1A;
				}
				.desc {
					font-size: 28rpx;
					font-weight: 400;
					line-height: 48rpx;
					color: #4D4D4D;
				}
				.album {}
			}
		}
	}
</style>

<template>
	<view class="wrap">
		<view class="head">
			<view class="tab">
				<view class="item">
					<view>本院复诊</view>
				</view>
				<view class="item active">
					<view>健康咨询</view>
				</view>
			</view>
			<view class="filter">
				<view class="item">
					<view class="name">请选择类别</view>
					<u-icon name="arrow-down" color="#1A1A1A" size="36rpx"></u-icon>
				</view>
				<view class="item">
					<view class="name">请选择状态</view>
					<u-icon name="arrow-down" color="#1A1A1A" size="36rpx"></u-icon>
				</view>
			</view>
		</view>
		<view class="content">
			<view class="list">
				<view class="item">
					<view class="top">
						<view class="left">
							<text class="name">复诊续方</text>
							<text class="price">￥10.00</text>
						</view>
						<view class="right red">待接诊</view>
					</view>
					<view class="middle">
						<view class="line">
							<view class="title">患者信息：</view>
							<view class="desc">
								<text>张三</text>
								<text class="split1">|</text>
								<text>18岁</text>
								<text class="split1">|</text>
								<text>男</text>
							</view>
						</view>
						<view class="line">
							<view class="title">病情描述：</view>
							<view class="desc">糖尿病前期，吃了药品后腹泻</view>
						</view>
						<view class="line">
							<view class="title">预约时间：</view>
							<view class="desc">
								<text>2023-01-01  09:00-12:00</text>
								<text class="split2">/</text>
								<text>30分钟</text>
							</view>
						</view>
					</view>
					<view class="bottom">
						<view class="btn btn2">结束问诊</view>
						<view class="btn btn1">开具处方</view>
						<view class="btn btn1">进入诊室</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				options: {}
			}
		},
		computed: {
		},
		components: {
		},
		onLoad(options) {
			this.options = options;
		},
		onReady() {
		},
		onShow() {
			this.init();
		},
		methods: {
			init() {
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
				padding: 30rpx 24rpx;
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

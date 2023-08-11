<template>
	<view class="wrap">
		<view class="head">
			<view class="tab">
				<view class="item">本院复诊</view>
				<view class="item active">健康咨询</view>
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
						<view class="right">待接诊</view>
					</view>
					<view class="middle">
						<view class="line">
							<view class="title">患者信息：</view>
							<view class="desc">
								<text class="name">张三</text>
								<text class="age">18岁</text>
								<text class="sex">男</text>
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
								<text class="split">/</text>
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
			.tab {
				.item {
					&.active {}
				}
			}
			.filter {
				.item {
					.name {}
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
				.item {
					.top {
						.left {
							.name {}
							.price {}
						}
						.right {}
					}
					.middle {
						.line {
							.title {}
							.desc {
								.name {}
								.age {}
								.sex {}
								.split {}
							}
						}
					}
					.bottom {
						.btn {
							&.btn1 {}
							&.btn2 {}
						}
					}
				}
			}
		}
	}
</style>


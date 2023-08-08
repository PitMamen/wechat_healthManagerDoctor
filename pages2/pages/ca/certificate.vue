<template>
	<view class="wrap">
		<image class="image" :src="info.certificate" mode="widthFix" />
		<image class="fixed" src="https://hmg.mclouds.org.cn/content-api/file/I20230703142150006SHYFEXLXOI04RE-微信图片_20230703141456.png" />
		<view v-if="isAuthType" class="bottom">
			<view class="btn" @click="submit()">返回主页</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isAuthType:true,//认证完成跳转到这里才显示按钮
				info: {}
			}
		},
		computed: {
		},
		components: {
		},
		onLoad(options) {
			console.log(options)
			this.isAuthType=!options.isAuthType 
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
				uni.$u.http.post('/account-api/tdUserInfoCaAuthApplet/getCaAuthInfoForUserId', {}).then(res => {
					this.info = res.data || {};
				}).finally(() => {
					uni.hideLoading();
				});
			},
			submit() {
				uni.switchTab({
					url: '/pages/work/workshop'
			
				})
			}
		}
	}
</script>

<style lang="scss">
	.wrap {
		min-height: 100vh;
		padding: 20rpx 24rpx;
		background: #F5F5F5;
		box-sizing: border-box;
		.image {
			width: 100%;
			height: auto;
		}
		.fixed {
			position: fixed;
			right: 40rpx;
			top: 320px;
			width: 160rpx;
			height: 160rpx;
			z-index: 1;
		}
		.button {
			position: absolute;
			width: 510rpx;
			height: 88rpx;
			left: 50%;
			bottom: -44rpx;
			transform: translateX(-50%);
		}
		.bottom {
			position: fixed;
			bottom: 50rpx;
			right: 24rpx;
		.btn {
			width: 702rpx;
			
			font-size: 30rpx;
			font-weight: 400;
			color: #FFFFFF;
			line-height: 68rpx;
			text-align: center;
			background: #409EFF;
			border-radius: 8rpx;
		}
		
		}
	}
	
	
	
</style>

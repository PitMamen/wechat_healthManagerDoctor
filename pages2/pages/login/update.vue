<template>
	<view class="wrap">
		<view class="head">
			<view class="bg">
				<image src="https://hmg.mclouds.org.cn/content-api/file/I20230703145249841SEOCC6F1GL1O5O-logo.png"></image>
			</view>
		</view>
		<view class="content">
			<view class="login">
				<view class="title">修改密码</view>
				<view class="passwd">
					<u-input
						class="input"
						type="password"
						placeholder="请输入原密码"
						border="none"
						v-model="loginData.oldPassword"
					>
						<view slot="prefix" class="prefix">
							<image src="/pages2/static/static/images/update/pwd1.png"></image>
						</view>
					</u-input>
				</view>
				<view class="passwd">
					<u-input
						class="input"
						type="password"
						placeholder="请输入新密码"
						border="none"
						v-model="loginData.password"
					>
						<view slot="prefix" class="prefix">
							<image src="/pages2/static/static/images/update/pwd2.png" class="pwd2"></image>
						</view>
					</u-input>
				</view>
				<view class="passwd">
					<u-input
						class="input"
						type="password"
						placeholder="请再次输入新密码"
						border="none"
						v-model="loginData.password3"
					>
						<view slot="prefix" class="prefix">
							<image src="/pages2/static/static/images/update/pwd2.png" class="pwd2"></image>
						</view>
					</u-input>
				</view>
				<u-button
					class="button"
					type="primary"
					text="提 交"
					loadingText="提交中..."
					:loading="loading"
					@click="all_ok"
				></u-button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				loading: false,
				loginData: {}
			}
		},
		onLoad() {
		},
		methods: {
			all_ok() {
				if (!this.loginData.oldPassword) {
					this.$u.toast("请输入原密码！")
					return;
				}
				if (!this.loginData.password) {
					this.$u.toast("请输入新密码！")
					return;
				}
				if (!this.loginData.password3) {
					this.$u.toast("请再次输入新密码！")
					return;
				}
				if (this.loginData.password !== this.loginData.password3) {
					this.$u.toast("新密码两次输入不一致！")
					return;
				}
				if (this.loading){
					return;
				}
				this.loading = true;
				const reqData = JSON.parse(JSON.stringify(this.loginData));
				delete reqData.password3
				uni.$u.http.post('/account-api/accountInfo/updatePassword', reqData).then(res => {
					uni.showToast({
						title: '密码修改成功',
						icon: 'success'
					});
					setTimeout(() => {
						uni.reLaunch({
							url: '/pages/mine/index'
						});
					}, 1000);
				}).catch(() => {
					this.loading = false;
				});
			}
			
		}
	}
</script>

<style lang="scss" scoped>
	.wrap {
		min-height: 100vh;
		background: #EFF6FE;
		.head {
			position: relative;
			width: 100%;
			height: 534rpx;
			background: rgba(14,99,215,0.59);
			.bg {
				position: absolute;
				width: 564rpx;
				height: 341rpx;
				left: 50%;
				bottom: 102rpx;
				transform: translateX(-50%);
				background-size: cover;
				image {
					position: absolute;
					width: 321rpx;
					height: 85rpx;
					top: 116rpx;
					left: 50%;
					transform: translateX(-50%);
				}
			}
		}
		.content {
			.login {
				position: relative;
				width: 670rpx;
				height: 556rpx;
				top: -67rpx;
				margin: 0 auto;
				background: #FFFFFF;
				box-shadow: 0rpx 5rpx 10rpx 0rpx rgba(97,166,247,0.35);
				border-radius: 8rpx;
				.title {
					padding: 40rpx 0rpx 70rpx 60rpx;
					font-size: 48rpx;
					font-family: SourceHanSansCN;
					font-weight: 400;
					color: #3E4A59;
					line-height: 45rpx;
				}
				.input {
					font-size: 30rpx;
					font-family: PingFang SC;
					font-weight: 400;
					color: rgba(62,74,89,0.45);
					line-height: 36rpx;
				}
				.passwd {
					margin: 0 40rpx;
					margin-bottom: 20rpx;
					padding: 20rpx 0rpx;
					border: 2rpx solid #D3DFEF;
					.prefix {
						position: relative;
						top: 4rpx;
						padding: 0 45rpx;
						image {
							width: 26rpx;
							height: 35rpx;
							&.pwd2 {
								width: 35rpx;
								height: 35rpx;
							}
						}
					}
				}
				.button {
					position: absolute;
					width: 510rpx;
					height: 88rpx;
					left: 50%;
					bottom: -44rpx;
					transform: translateX(-50%);
				}
			}
		}
	}
</style>

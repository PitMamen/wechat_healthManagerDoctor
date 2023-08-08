<template>
	<view class="wrap">
		<view class="head">
			<view class="bg">
				<image src="https://hmg.mclouds.org.cn/content-api/file/I20230703145249841SEOCC6F1GL1O5O-logo.png"></image>
			</view>
		</view>
		<view class="content">
			<view class="login">
				<view class="title">登录</view>
				<view class="account">
					<u-input
						class="input"
						placeholder="输入你的用户名/手机号"
						border="none"
						v-model="loginData.userName"
					>
						<view slot="prefix" class="prefix">
							<image src="/static/static/images/login/account.png"></image>
						</view>
					</u-input>
				</view>
				<view class="passwd">
					<u-input
						class="input"
						type="password"
						placeholder="输入您的密码"
						border="none"
						v-model="loginData.password"
					>
						<view slot="prefix" class="prefix">
							<image src="/static/static/images/login/passwd.png"></image>
						</view>
					</u-input>
				</view>
				<view class="remind">
					<text class="text">记住密码</text>
					<view style="float: right;">
						<u-checkbox-group class="checkbox" v-model="remind">
							<u-checkbox></u-checkbox>
						</u-checkbox-group>
					</view>
				</view>
				<view class="protocol">
					<u-radio-group v-model="checkedProtocol" @change="groupChange" >
						<!-- <u-radio :name='$attrs' activeColor="#01B1F6" iconColor="#01B1F6" labelColor="#01B1F6"  label="同意并查看《互联网医院用户协议》"></u-radio> -->
						<u-radio name='1' shape="square" activeColor="#01B1F6" iconColor="#01B1F6" labelColor="#01B1F6"  label="同意并查看《互联网医院用户协议》"></u-radio>
					</u-radio-group>
				</view>
				<view class="button">
					<u-button
						type="primary"
						text="登 录"
						loadingText="登录中..."
						:loading="loading"
						@click="all_ok"
					></u-button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		setTokenStorage
	} from '../../utils/token';
	import logger from '../../utils/logger';
	const {
		getTokenStorage
	} = require('../../utils/token.js');
	const app = getApp();

	export default {
		data() {
			return {
				remind: [''],
				loading: false,
				checkedProtocol: '',
				title: 'Hello',
				loginData: {
					userName: '',
					password: '',
					loginType: '2',
					terminal: '1'
				}
			}
		},
		onLoad() {
			const loginData = uni.getStorageSync('loginData') || {};
			this.checkedProtocol = uni.getStorageSync('checkedProtocol')||'';
			this.loginData = { ...this.loginData, ...loginData };
		},
		methods: {
			login(res) {
				const userID = res.account.user.userId + '';
				const userSig = res.account.user.userSig;
				const SDKAppID = app.globalData.SDKAppID;
				logger.log(`TUI-login | login  | userSig:${userSig} userID:${userID}`);
				uni.$aegis.reportEvent({
					name: 'platform',
					ext1: 'platform-MP-WEIXIN',
					ext2: 'uniTuikitExternal',
					ext3: `${SDKAppID}`,
				});
				app.globalData.userInfo = res.account.user
				app.globalData.userInfo.userID = userID
				app.globalData.userInfo.userSig = userSig
				app.globalData.userInfo.token = res.jwt
				app.globalData.userInfo.nick = app.globalData.userInfo.userName
				setTokenStorage({
					userInfo: app.globalData.userInfo
				});
				wx.setStorageSync(`TIM_${SDKAppID}_isTUIKit`, true);
				uni.$TUIKit.login({
					userID: userID,
					userSig: userSig
				}).then(() => {
					uni.$aegis.reportEvent({
						name: 'login',
						ext1: 'login-success',
						ext2: 'uniTuikitExternal',
						ext3: `${SDKAppID}`,
					})
				}).catch((error) => {
					logger.error(`TUI-login | login  | login-failed#error:${error}`);
					uni.$aegis.reportEvent({
						name: 'login',
						ext1: `login-failed#error:${error}`,
						ext2: 'uniTuikitExternal',
						ext3: `${SDKAppID}`,
					})
				}).finally(() => {
					this.loading = false;
				})
				uni.reLaunch({
					url: '/pages/work/workshop',
					success() {}
				})
			},
			
			// 登录
			all_ok() {
				if (!this.loginData.userName) {
					this.$u.toast("请输入账号！")
					return
				}
				if (!this.loginData.password) {
					this.$u.toast("请输入密码！")
					return
				}
				if (this.checkedProtocol != '1') {
					this.$u.toast("请同意并查看《互联网医院用户协议》！")
					return
				}
				if (this.loading){
					return;
				}
				this.loading = true;
				
				setTimeout(() => {
					uni.clearStorage();
					const reqData = JSON.parse(JSON.stringify(this.loginData));
					uni.$u.http.post('/account-api/login', reqData).then(res => {
						if (this.remind.length > 0){
							uni.setStorageSync('loginData', {
								userName: this.loginData.userName,
								password: this.loginData.password
							});
						}
						uni.setStorageSync('bussinessToken', res.data.jwt); //存数据
						uni.setStorageSync('account', res.data.account); //存数据
						console.log('loginToken', res.data.jwt)
						this.login(res.data)
					}).catch(() => {
						this.loading = false;
					});
				});
				
			},

			getUserInfo() {
				uni.getUserInfo({
					provider: 'weixin',
					success: (res) => {
						console.log('getUserInfo', res);
					},
				});
			},

			wxLogin() {

			},

			getUserInfo() {
				uni.getUserInfo({
					provider: 'weixin',
					success: (res) => {
						console.log('getUserInfo', res);
					},
				});
			},
			
			wechatLogin() {
				location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${wechatappID}&redirect_uri=${encodeURIComponent(domain + '/pages/wechat/login')}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`
			},
			
			// 注册
			reg_ok() {
				uni.navigateTo({
					url: '/pages/login/register'
				});
			},
			groupChange(){
				// debugger
				uni.setStorageSync('checkedProtocol', '1');
				uni.navigateTo({
					url: '/pages/login/protocol'
				});
			},
			// 忘记密码
			forget_ok() {},
			// 验证码登录
			code_ok() {
				uni.navigateTo({
					url: '/pages/login/code_login'
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
				height: 610rpx;
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
				.account {
					margin: 0 40rpx;
					margin-bottom: 62rpx;
					padding: 20rpx 0rpx;
					border-bottom: 2rpx solid #D3DFEF;
					.prefix {
						position: relative;
						top: 4rpx;
						padding: 0 45rpx;
						image {
							width: 22rpx;
							height: 36rpx;
						}
					}
				}
				.passwd {
					margin: 0 40rpx;
					margin-bottom: 40rpx;
					padding: 20rpx 0rpx;
					border-bottom: 2rpx solid #D3DFEF;
					.prefix {
						position: relative;
						top: 4rpx;
						padding: 0 45rpx;
						image {
							width: 25.2rpx;
							height: 36rpx;
						}
					}
				}
				.remind {
					overflow: hidden;
					.checkbox {
						float: right;
						padding-right: 8rpx;
					}
					.text {
						float: right;
						margin-right: 55rpx;
						font-size: 30rpx;
						font-family: PingFang SC;
						font-weight: 400;
						color: #01B1F6;
						line-height: 30rpx;
					}
				}
				
				.protocol{
					display: flex;
					flex-direction: row;
					align-items: center;
					margin-top: 30rpx;
					padding: 0 80rpx;
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
			.wechat {
				margin-top: 218rpx;
				text-align: center;
				.text {
					margin-bottom: 30rpx;
					font-size: 22rpx;
					font-family: PingFang SC;
					font-weight: 400;
					color: #4D4D4D;
					line-height: 22rpx;
				}
				image {
					display: inline-block;
					width: 54rpx;
					height: 44rpx;
				}
			}
		}
	}
</style>
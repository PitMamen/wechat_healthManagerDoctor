<template>
	<view class="wrap">

		<view class="content">
			<view class="login">

				<image src="https://hmg.mclouds.org.cn/content-api/file/F20230829140605406OK6PA9B5E6N1GR-logoys.png">
				</image>
				<text class="title">您好，欢迎使用雅医医生端小程序</text>

				<view class="protocol">
					<u-checkbox-group v-model="checkedProtocol" placement="column" @change="groupChange">
						<u-checkbox key="1" label="我已阅读并同意" name="1" />

					</u-checkbox-group>
					<view style="color:#01B1F6 ;font-size: 15px;margin-left:12rpx ;" @click="onCheckClick">《用户协议》</view>

				</view>
				<view class="button">
					<button type="primary" class="button" :open-type="checkedProtocol == '1'?'getPhoneNumber':''"
						@getphonenumber="onGetphonenumber" @click="btnClick">
						登 录</button>
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
				},
				openid: '',
				unionid: '',
				sessionKey: '',
			}
		},
		onLoad() {
			const loginData = uni.getStorageSync('loginData') || {};

			this.loginData = {
				...this.loginData,
				...loginData
			};

			uni.removeStorageSync('bussinessToken')
			uni.removeStorageSync('account')
			this.WXlogin()
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
					this.$u.toast("请阅读并同意《用户协议》！")
					return
				}
				if (this.loading) {
					return;
				}
				this.loading = true;

				setTimeout(() => {
					uni.clearStorage();
					const reqData = JSON.parse(JSON.stringify(this.loginData));
					uni.$u.http.post('/account-api/login', reqData).then(res => {
						if (this.remind.length > 0) {
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

			btnClick() {
				console.log('checkedProtocol', this.checkedProtocol)
				if (this.checkedProtocol != '1') {
					this.$u.toast("请阅读并同意《用户协议》！")
					return
				}
			},


			//获取到手机号
			onGetphonenumber(e) {
				console.log(e)
				if (e.detail.iv && e.detail.encryptedData) {
					this.decryptPhone(e.detail.iv, e.detail.encryptedData)
				}

			},
			//获取code
			WXlogin() {
				this.loading = true
				uni.showLoading({
					title: '加载中'
				})
				let that = this
				uni.login({
					provider: 'weixin', //使用微信登录
					success: function(res) {
						console.log(res);
						that.getOpenId(res.code)
					},
					fail: function(error) {
						console.error(error)
						this.loading = false
					}
				});

			},
			//获取openid
			getOpenId(code) {


				var reqData = {
					code: code,
					appId: uni.getAccountInfoSync().miniProgram.appId,
					loginType: '21',
					pubkey: '123'
				}
				uni.$u.http.post('/account-api/wx/user/login', reqData).then(res => {
					uni.hideLoading()
					console.log(res)
					if (res.code == 0) {
						/**
						bindstatus=0;登录成功，可正常执行各项业务操作
						bindstatus=99902;微信open_id未绑定医生账号,需要进入步骤[3]引导用户提供手机号并绑定账号
						bindstatus=99903;微信open_id绑定了手机号,但手机号对应医生账号不存在,进入空白页面,医生可提交资料供审核
						bindstatus=99904;已提交资料,认证审核中/注册审核不通过,进入空白页面,医生可查看、修改资料
						**/


						uni.setStorageSync('account', res.data.account);
						uni.setStorageSync('bussinessToken', res.data.jwt)

						if (res.data.bindStatus == 0) {

							this.login(res.data)

						} else if (res.data.bindStatus == 99902) {

							this.sessionKey = res.data.sessionKey
						} else if (res.data.bindStatus == 99903) {

							uni.reLaunch({
								url: '/pages/work/workshop',
								success() {}
							})
						} else if (res.data.bindStatus == 99904) {
							uni.reLaunch({
								url: '/pages/work/workshop',
								success() {}
							})
						}
					} else {
						this.$u.toast("登录失败")

					}
				}).catch(() => {
					uni.hideLoading()
				});
			},

			//获取解密手机号
			decryptPhone(iv, encryptedData) {
				uni.showLoading({
					title: '加载中'
				})
				var reqData = {
					iv: iv,
					encryptedData: encryptedData,
					sessionKey: this.sessionKey,
					appId: uni.getAccountInfoSync().miniProgram.appId
				}
				uni.$u.http.post('/account-api/wx/user/phone', reqData).then(res => {
					if (res.code == 0) {

						console.log(res.data)
						this.bindDoctorPhone(res.data)
					} else {
						this.$u.toast("获取手机号失败")

					}
				}).catch(() => {
					uni.hideLoading()
				});
			},
			//绑定账号
			bindDoctorPhone(phone) {

				var reqData = {
					phone: phone,
					pubKey: '123',
					appId: uni.getAccountInfoSync().miniProgram.appId
				}
				uni.$u.http.post('/account-api/accountInfo/bindDoctorPhone', reqData).then(res => {
					uni.hideLoading()
					if (res.code == 0) {

						uni.setStorageSync('account', res.data.account);
						uni.setStorageSync('bussinessToken', res.data.jwt)

						if (res.data.bindStatus == 0) {

							this.login(res.data)

						} else if (res.data.bindStatus == 99902) {

							this.sessionKey = res.data.sessionKey
						} else if (res.data.bindStatus == 99903) {

							uni.reLaunch({
								url: '/pages/work/workshop',
								success() {}
							})
						} else if (res.data.bindStatus == 99904) {
							uni.reLaunch({
								url: '/pages/work/workshop',
								success() {}
							})
						}
					} else {
						this.$u.toast("绑定账号失败")

					}
				}).catch(() => {
					uni.hideLoading()
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
				location.href =
					`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${wechatappID}&redirect_uri=${encodeURIComponent(domain + '/pages/wechat/login')}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`
			},

			// 注册
			reg_ok() {
				uni.navigateTo({
					url: '/pages/login/register'
				});
			},
			groupChange() {


				this.checkedProtocol = '1'

			},
			onCheckClick() {
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
		background: #ffffff;

		.head {
			position: relative;
			width: 100%;
			height: 534rpx;
			background: rgba(14, 99, 215, 0.59);

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

				top: 450rpx;
				margin: 0 auto;

				display: flex;
				flex-direction: column;
				align-items: center;

				image {

					width: 448rpx;
					height: 81rpx;
					margin-bottom: 40rpx;
				}

				.title {

					font-size: 30rpx;

					font-weight: 400;
					color: #1A1A1A;

					margin-bottom: 40rpx;
				}

				.input {
					font-size: 30rpx;
					font-family: PingFang SC;
					font-weight: 400;
					color: rgba(62, 74, 89, 0.45);
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

				.protocol {
					display: flex;
					flex-direction: row;
					align-items: flex-start;

					margin-bottom: 63rpx;
				}

				.button {

					width: 670rpx;

					color: #ffffff;
					background-color: #3894FF !important;

					border-color: #3894FF !important;
					border-radius: 46rpx;
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
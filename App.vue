<script>
	import { SDKAPPID } from './config/config';
	import {
		getTokenStorageSync
	} from './utils/token';
	// APP 和 小程序平台
	// #ifdef  APP-PLUS || MP-WEIXIN   
	import TIM from 'tim-wx-sdk';
	import COS from 'cos-wx-sdk-v5';
	// #endif
	
	import Vue from 'vue'
	// #ifdef H5
	import TIM from 'tim-js-sdk';
	import TRTCCalling from 'trtc-calling-js'
	import TIMUploadPlugin from 'tim-upload-plugin'
	logger.error(' TUIKit 暂不支持 H5 / web');
	// #endif

	// #ifdef APP-PLUS
	import Aegis from 'aegis-weex-sdk';
	// #endif

	// #ifdef MP-WEIXIN
	import Aegis from 'aegis-mp-sdk';
	// #endif

	// #ifdef H5
	import Aegis from 'aegis-web-sdk';
	// #endif

	import logger from './utils/logger'; // app.js

	const aegis = new Aegis({
		id: 'iHWefAYqKznuxWjLnr', // 项目key
		reportApiSpeed: true, // 接口测速
	});
	uni.$aegis = aegis
	// 首先需要通过 uni.requireNativePlugin("ModuleName") 获取 module
	// #ifdef APP-PLUS
	const TUICalling = uni.requireNativePlugin('TUICallingUniPlugin-TUICallingModule');
	logger.log(`| app |  TUICallingUniPlugin-TUICallingModule | TUICalling: ${TUICalling}`);
	if (typeof(TUICalling) == 'undefined') {
		logger.error(
			'如果需要音视频功能，请集成原生插件，使用真机运行并且自定义基座调试哦～ 插件地址：https://ext.dcloud.net.cn/plugin?id=7097 , 调试地址：https://nativesupport.dcloud.net.cn/NativePlugin/use/use'
		);
	}
	// #endif
	
	const headerInfo = () => {
		const { statusBarHeight } = uni.getSystemInfoSync();
		const { width, height, top } = uni.getMenuButtonBoundingClientRect();
		const navigatorHeight = (top - statusBarHeight) * 2 + height;
		return {
			statusBarHeight,
			navigatorHeight,
			menuHeight: height,
			menuPadding: top - statusBarHeight,
			height: statusBarHeight + navigatorHeight
		};
	};
	export default {
		onLaunch() {
			const SDKAppID = SDKAPPID;
			uni.$aegis.reportEvent({
				name: 'onLaunch',
				ext1: 'onLaunch-success',
				ext2: 'uniTuikitExternal',
				ext3: `${SDKAppID}`,
			})
			uni.setStorageSync(`TIM_${SDKAppID}_isTUIKit`, true);
			// 重点注意： 为了 uni-app 更好地接入使用 tim，快速定位和解决问题，请勿修改 uni.$TUIKit 命名。
			// 如果您已经接入 tim ，请将 uni.tim 修改为 uni.$TUIKit。
			uni.$TUIKit = TIM.create({
				SDKAppID: SDKAppID
			});
			uni.$TIM = TIM;
			// #ifndef H5
			uni.$TUIKit.registerPlugin({
				'cos-wx-sdk': COS
			});
			// #endif

			// #ifdef H5
			uni.$TUIKit.registerPlugin({
				'tim-upload-plugin': TIMUploadPlugin
			})
			// #endif
			Vue.prototype.$bus = new Vue() // event Bus 用于无关系组件间的通信。
			
			// 将原生插件挂载在 uni 上
			// #ifdef APP-PLUS
			uni.$TUICalling = TUICalling;
			// #endif
			// 如果您已创建了 tim，请将 tim 实例挂载在 wx 上，且不可以修改 wx.$TIM（修改变量可能导致 TUICalling 组件无法正常使用）, 完成 TUICalling 初始化，
			// 如果您没有创建，可以不传
			// #ifdef MP-WEIXIN
			wx.$TIM = uni.$TUIKit;
			// #endif
			uni.$TUIKitTIM = TIM;
			uni.$TUIKitEvent = TIM.EVENT;
			uni.$TUIKitVersion = TIM.VERSION;
			uni.$TUIKitTypes = TIM.TYPES; // 监听系统级事件
			uni.$resetLoginData = this.resetLoginData();
			uni.$TUIKit.on(uni.$TUIKitEvent.SDK_READY, this.onSDKReady);
			uni.$TUIKit.on(uni.$TUIKitEvent.SDK_NOT_READY, this.onSdkNotReady);
			uni.$TUIKit.on(uni.$TUIKitEvent.KICKED_OUT, this.onKickedOut);
			uni.$TUIKit.on(uni.$TUIKitEvent.ERROR, this.onTIMError);
			uni.$TUIKit.on(uni.$TUIKitEvent.NET_STATE_CHANGE, this.onNetStateChange);
			uni.$TUIKit.on(uni.$TUIKitEvent.SDK_RELOAD, this.onSDKReload);
			this.login()
		},
		globalData: {
			headerInfo: headerInfo(),
			// userInfo: userID userSig token phone
			userInfo: getTokenStorageSync(),
			// 个人信息
			userProfile: null,
			isTUIKit: true,
			headerHeight: 0,
			statusBarHeight: 0,
			SDKAppID: SDKAPPID,
			//检查详情
			jcxq: null,
			//检验详情
			jyxq: null,
			//聊天列表上下文
			chatListForAI:[]
		},
		methods: {
			// TODO:
			resetLoginData() {
				this.globalData.expiresIn = '';
				this.globalData.sessionID = '';
				this.globalData.userProfile = null;
				this.globalData.userInfo = getTokenStorageSync();
				logger.log(`| app |  resetLoginData | globalData: ${JSON.stringify(this.globalData)}`);
			},
			onTIMError() {},
			onSDKReady({
				name
			}) {
				const isSDKReady = name === uni.$TUIKitEvent.SDK_READY ? true : false
				uni.$emit('isSDKReady', {
					isSDKReady: true
				});
				this.login()
			},
			onNetStateChange() {},
			onSDKReload() {},
			onSdkNotReady() {},
			onKickedOut() {
				uni.showToast({
					title: '您被踢下线',
					icon: 'error'
				});
				uni.redirectTo({
					url: '/pages/login/login'
				});
			},
			login() {
				const userInfo = getTokenStorageSync();
				if (userInfo) {
					const userID = userInfo.userInfo.userID;
					const userSig = userInfo.userInfo.userSig;
					const SDKAppID = SDKAPPID;
					logger.log(`TUI-login | relogin  | userSig:${userSig} userID:${userID}`);
					uni.$aegis.reportEvent({
						name: 'platform',
						ext1: 'platform-MP-WEIXIN',
						ext2: 'uniTuikitExternal',
						ext3: `${SDKAppID}`,
					})
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
						uni.$aegis.reportEvent({
							name: 'login',
							ext1: `login-failed#error:${error}`,
							ext2: 'uniTuikitExternal',
							ext3: `${SDKAppID}`,
						})
					})
				}
			}
		}
	};
</script>
<style lang="scss">
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "uview-ui/index.scss"
</style>
<style>
	@import './app.css';
</style>
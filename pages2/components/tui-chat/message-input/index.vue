<template>
	<view>
		<view class="TUI-message-input-container">
			<view class="TUI-commom-function">
				<view v-for="(item, index) in commonFunction" :key="index" class="TUI-commom-function-item"
					:data-function="item" @tap="handleCommonFunctions">
					{{ item.name }}
				</view>
			</view>
			<view class="TUI-message-input">
				<image class="TUI-icon" @tap="switchAudio"
					:src="isAudio ? '/pages2/static/static/assets/keyboard.svg' : '/pages2/static/static/assets/audio.svg'">
				</image>
				<view v-if="!isAudio" class="TUI-message-input-main">
					<input class="TUI-message-input-area" :adjust-position="true" cursor-spacing="20"
						v-model="inputText" @input="onInputValueChange" maxlength="140" type="text"
						placeholder-class="input-placeholder" placeholder="说点什么呢~" @focus="inputBindFocus"
						@blur="inputBindBlur" />
				</view>
				<view v-else class="TUI-message-input-main" @longpress="handleLongPress" @touchmove="handleTouchMove"
					@touchend="handleTouchEnd"
					style="display: flex; justify-content: center; font-size: 32rpx; font-family: PingFangSC-Regular;">
					<text>{{ text }}</text>
				</view>
				<view class="TUI-message-input-functions" hover-class="none">
					<image class="TUI-icon" @tap="handleEmoji" src="/pages2/static/static/assets/face-emoji.svg">
					</image>
					<view v-if="!sendMessageBtn" @tap="handleExtensions">
						<image class="TUI-icon" src="/pages2/static/static/assets/more.svg"></image>
					</view>
					<view v-else class="TUI-sendMessage-btn" @tap="sendTextMessage">发送</view>
				</view>
			</view>
			<view v-if="displayFlag === 'emoji'" class="TUI-Emoji-area">
				<TUI-Emoji @enterEmoji="appendMessage"></TUI-Emoji>
			</view>
			<view v-if="displayFlag === 'extension'" class="TUI-Extensions">
				<!-- TODO: 这里功能还没实现 -->
				<!--        <camera device-position="back" flash="off" binderror="error" style="width: 100%; height: 300px;"></camera>-->
				<view class="TUI-Extension-slot" @tap="handleChuFang"
					v-if="taskItem.taskDetail.rightsType === 'appointNum'">
					<image class="TUI-Extension-icon" src="/pages2/static/static/assets/chufang.png"></image>
					<view class="TUI-Extension-slot-name">开处方</view>
				</view>
				<view class="TUI-Extension-slot" @tap="handleSendPicture">
					<image class="TUI-Extension-icon" src="/pages2/static/static/assets/take-photo.svg"></image>
					<view class="TUI-Extension-slot-name">拍摄照片</view>
				</view>
				<view class="TUI-Extension-slot" @tap="handleSendImage">
					<image class="TUI-Extension-icon" src="/pages2/static/static/assets/send-img.svg"></image>
					<view class="TUI-Extension-slot-name">发送图片</view>
				</view>
				<view class="TUI-Extension-slot" @tap="handleShootVideo">
					<image class="TUI-Extension-icon" src="/pages2/static/static/assets/take-video.svg"></image>
					<view class="TUI-Extension-slot-name">拍摄视频</view>
				</view>
				<view class="TUI-Extension-slot" @tap="handleSendVideo">
					<image class="TUI-Extension-icon" src="/pages2/static/static/assets/send-video.svg"></image>
					<view class="TUI-Extension-slot-name">发送视频</view>
				</view>

				<view class="TUI-Extension-slot" @tap="handlefollow">
					<image class="TUI-Extension-icon" src="/pages2/static/static/images/group/icon_sfjh.png"></image>
					<view class="TUI-Extension-slot-name">随访计划</view>
				</view>
				<view class="TUI-Extension-slot" @tap="handleCalling('audio')" v-if="false">
					<image class="TUI-Extension-icon" src="/pages2/static/static/assets/audio-calling.svg"></image>
					<view class="TUI-Extension-slot-name">语音通话</view>
				</view>
				<view class="TUI-Extension-slot" @tap="handleCalling('video')"
					v-if="taskItem.taskDetail.rightsType === 'videoNum'">
					<image class="TUI-Extension-icon" src="/pages2/static/static/assets/video-calling.svg"></image>
					<view class="TUI-Extension-slot-name">视频通话</view>
				</view>
				<view class="TUI-Extension-slot" @tap="handleTeling" v-if="taskItem.taskDetail.rightsType === 'telNum'">
					<image class="TUI-Extension-icon" src="/pages2/static/static/assets/dianhua.png"></image>
					<view class="TUI-Extension-slot-name">电话通话</view>
				</view>
				<!-- <view class="TUI-Extension-slot" @tap="handleServiceEvaluation">
					<image class="TUI-Extension-icon" src="/pages2/static/static/assets/service-assess.svg"></image>
					<view class="TUI-Extension-slot-name">服务评价</view>
				</view>
				<view class="TUI-Extension-slot" @tap="handleSendOrder">
					<image class="TUI-Extension-icon" src="/pages2/static/static/assets/send-order.svg"></image>
					<view class="TUI-Extension-slot-name">发送订单</view>
				</view> -->
			</view>
			<TUI-Preview-Info class="tui-cards" :display="displayPreviewInfo" @close="$handleCloseCards">
			</TUI-Preview-Info>
			<TUI-Common-Words class="tui-cards" :display="displayCommonWords" @sendMessage="$handleSendTextMessage"
				@close="$handleCloseCards"></TUI-Common-Words>
			<TUI-Send-Note class="tui-cards" :display="displaySendNote" @sendNote="$handleSendCustomMessage"
				@close="$handleCloseCards"></TUI-Send-Note>
			<TUI-Send-Ask class="tui-cards" :display="displaySendAsk" @sendAsk="$handleSendCustomMessage"
				@close="$handleCloseCards"></TUI-Send-Ask>
			<TUI-Medical-Folder class="tui-cards" :display="displayMedicalFolder" @close="$handleCloseCards">
			</TUI-Medical-Folder>
			<TUI-Time-Appointment class="tui-cards" :message="messageData" :display="displayTimeAppointment"
				@sendTime="$handleSendCustomMessage" @close="$handleCloseCards"></TUI-Time-Appointment>
			<TUI-Fengshike class="tui-cards" :message="messageData" :display="displayFengshike"
				@sendCard="$handleSendCustomMessage" @close="$handleCloseCards"></TUI-Fengshike>
			<TUI-Fengshike2 class="tui-cards" :message="messageData" :display="displayFengshike2"
				@close="$handleCloseCards"></TUI-Fengshike2>
			<TUI-Condition-Description class="tui-cards" :message="messageData" :display="displayConditionDescription"
				@close="$handleCloseCards"></TUI-Condition-Description>
		</view>
		<view class="record-modal" v-if="popupToggle" @longpress="handleLongPress" @touchmove="handleTouchMove"
			@touchend="handleTouchEnd">
			<view class="wrapper">
				<view class="modal-loading"></view>
			</view>
			<view class="modal-title">{{ title }}</view>
		</view>
	</view>
</template>

<script>
	import Recorder from 'recorder-core'
	import 'recorder-core/src/engine/wav'
	import 'recorder-core/src/extensions/waveview'
	import TUIEmoji from '../message-elements/emoji/index';
	import TUIPreviewInfo from '../message-private/preview-info/index';
	import TUICommonWords from '../message-private/common-words/index';
	import TUISendNote from '../message-private/send-note/index';
	import TUISendAsk from '../message-private/send-ask/index';
	import TUIMedicalFolder from '../message-private/medical-folder/index';
	import TUITimeAppointment from '../message-private/time-appointment/index';
	import TUIFengshike from '../message-private/fengshike/index';
	import TUIFengshike2 from '../message-private/fengshike2/index';
	import TUIConditionDescription from '../message-private/condition-description/index';

	export default {
		data() {
			return {
				// todo  conversation
				// conversation: {},
				taskItem: uni.getStorageSync('taskItem'),
				firstSendMessage: true,
				inputText: '',
				extensionArea: false,
				sendMessageBtn: false,
				displayFlag: '',
				isAudio: false,
				bottomVal: 0,
				startPoint: 0,
				popupToggle: false,
				isRecording: false,
				canSend: true,
				text: '按住说话',
				title: ' ',
				notShow: false,
				isShow: true,
				recordTime: 0,
				recordTimer: null,
				recorderManager: null,
				commonFunction: [{
						name: '就诊历史',
						key: '0'
					},
					{
						name: '快捷回复',
						key: '1'
					},
					{
						name: '发送文章',
						key: '2'
					},
					{
						name: '发送问卷',
						key: '3'
					},
					{
						name: '病历夹',
						key: '4'
					}
				],
				messageData: {},
				displayPreviewInfo: false,
				displayCommonWords: false,
				displaySendNote: false,
				displaySendAsk: false,
				displayMedicalFolder: false,
				displayTimeAppointment: false,
				displayFengshike: false,
				displayFengshike2: false,
				displayConditionDescription: false
			};
		},

		components: {
			TUIEmoji,
			TUIPreviewInfo,
			TUICommonWords,
			TUISendNote,
			TUISendAsk,
			TUIMedicalFolder,
			TUITimeAppointment,
			TUIFengshike,
			TUIFengshike2,
			TUIConditionDescription
		},
		props: {
			conversation: {
				type: Object,
				default: () => {}
			}
		},
		watch: {
			conversation: {
				handler: function(newVal) {
					// todo 值会被改变
					// this.setData({
					//   conversation: newVal
					// });
				},
				immediate: true,
				deep: true
			}
		},

		created() {
			this.$bus.$off('cardTrigger');
			this.$bus.$off('sendCustomMessage');

			this.$bus.$on('cardTrigger', this.cardTriggerHandler);
			this.$bus.$on('sendCustomMessage', this.$handleSendCustomMessage);
		},

		beforeDestroy() {
			this.recClose();
			this.$bus.$off('cardTrigger');
			this.$bus.$off('sendCustomMessage');
		},

		beforeMount() {},

		methods: {
			recInit(success) {
				this.recorderManager = Recorder({
					type: "wav",
					bitRate: 36,
					sampleRate: 18000,
					onProcess: function(buffers, powerLevel, bufferDuration, bufferSampleRate, newBufferIdx,
						asyncEnd) {}
				});

				this.recorderManager.open(function() {
					success && success();
				}, function(msg, isUserNotAllow) {
					console.log((isUserNotAllow ? "UserNotAllow，" : "") + "无法录音: " + msg);
				});
			},

			recStart() {
				this.recorderManager.start();
			},

			recStop() {
				const _this = this;
				_this.recorderManager.stop(function(blob, duration) {
					uni.hideLoading();
					if (_this.canSend) {
						if (duration < 1000) {
							uni.showToast({
								title: '录音时间太短',
								icon: 'none'
							});
						} else {
							const audioFile = new File([blob], 'audio.wav', {
								type: blob.type
							});
							audioFile.fileSize = audioFile.size;
							audioFile.duration = duration;

							const message = uni.$TUIKit.createAudioMessage({
								to: _this.getToAccount(),
								conversationType: _this.conversation.type,
								payload: {
									file: audioFile
								}
							});
							_this.$sendTIMMessage(message);
						}
					}

					_this.setData({
						startPoint: 0,
						popupToggle: false,
						isRecording: false,
						canSend: true,
						title: ' ',
						text: '按住说话'
					});
				}, function(msg) {
					console.log("录音失败: " + msg);
				});
			},

			recClose() {
				this.recorderManager.close();
				this.recorderManager = null;

				this.setData({
					startPoint: 0,
					popupToggle: false,
					isRecording: false,
					canSend: true,
					title: ' ',
					text: '按住说话'
				});
			},

			switchAudio() {
				this.setData({
					isAudio: !this.isAudio,
					text: '按住说话'
				});

				if (this.isAudio) {
					if (!this.recorderManager) {
						this.recInit();
					}
				}
			},

			handleLongPress(e) {
				this.recStart();
				this.setData({
					startPoint: e.touches[0],
					title: '正在录音',
					// isRecording : true,
					// canSend: true,
					notShow: true,
					isShow: false,
					isRecording: true,
					popupToggle: true,
					recordTime: 0
				});
			},

			// 录音时的手势上划移动距离对应文案变化
			handleTouchMove(e) {
				if (this.isRecording) {
					if (this.startPoint.clientY - e.touches[e.touches.length - 1].clientY > 100) {
						this.setData({
							text: '抬起停止',
							title: '松开手指，取消发送',
							canSend: false
						});
					} else if (this.startPoint.clientY - e.touches[e.touches.length - 1].clientY > 20) {
						this.setData({
							text: '抬起停止',
							title: '上划可取消',
							canSend: true
						});
					} else {
						this.setData({
							text: '抬起停止',
							title: '正在录音',
							canSend: true
						});
					}
				}
			},

			// 手指离开页面滑动
			handleTouchEnd() {
				this.setData({
					isRecording: false,
					popupToggle: false
				});
				uni.hideLoading();
				this.recStop();
			},

			handleEmoji() {
				let targetFlag = 'emoji';

				if (this.displayFlag === 'emoji') {
					targetFlag = '';
				}

				this.setData({
					displayFlag: targetFlag
				});
			},

			handleExtensions() {
				let targetFlag = 'extension';

				if (this.displayFlag === 'extension') {
					targetFlag = '';
				}

				this.setData({
					displayFlag: targetFlag
				});
			},

			error(e) {
				console.log(e.detail);
			},

			handleChuFang() {
				uni.navigateTo({
					url: `/pages2/pages/chufang/index`
				});
			},
			handleTeling() {
				const account = uni.getStorageSync('account');
				const taskItem = uni.getStorageSync('taskItem');
				const sourcePhone = account.user.phone;
				const distPhone = taskItem.taskDetail.userInfo.phone;
				const continueTime = ((taskItem.taskDetail.userGoodsAttrInfo || {}).timeLimit || '0') * 60;
				if (!sourcePhone) {
					uni.$u.toast('未检测到本机号码!');
					return;
				}
				if (!distPhone) {
					uni.$u.toast('未检测到患者号码!');
					return;
				}
				uni.$u.http.post('/tc-api/phoneBind/addAutoCall', {
					distPhone,
					sourcePhone,
					continueTime
				}).then(res => {
					uni.$u.toast('自动通话连接成功!');
				});
			},

			handleSendPicture() {
				this.sendImageMessage('camera');
			},

			handleSendImage() {
				this.sendImageMessage('album');
			},

			sendImageMessage(type) {
				console.log('type', type)
				try {
					uni.chooseImage({
						// sourceType: [type],
						// count: 1,
						success: res => {
							console.log('res', res)
							if (res) {
								const message = uni.$TUIKit.createImageMessage({
									to: this.getToAccount(),
									conversationType: this.conversation.type,
									payload: {
										file: res
									},
									onProgress: percent => {
										message.percent = percent;
									}
								});
								this.$sendTIMMessage(message);
							}
						},
						fail: err => {
							console.log('err', err)
						}
					});
				} catch (e) {
					console.log('e', e)
				}
			},

			handleShootVideo() {
				this.sendVideoMessage('camera');
			},

			handlefollow() {
				var account = uni.getStorageSync('account');
				if (account) {
					if (account.roleName != 'doctor') {
						uni.showToast({
							title: '对不起，您无权进行该操作',
							icon: 'none'
						});
						return
					}
				}
				uni.navigateTo({
					url: '/pages2/pages/follow/myfollowlist'
				});
			},


			handleSendVideo() {
				this.sendVideoMessage('album');
			},

			sendVideoMessage(type) {
				uni.chooseVideo({
					sourceType: [type],
					// 来源相册或者拍摄
					maxDuration: 60,
					// 设置最长时间60s
					camera: 'back',
					// 后置摄像头
					success: res => {
						if (res) {
							const message = uni.$TUIKit.createVideoMessage({
								to: this.getToAccount(),
								conversationType: this.conversation.type,
								payload: {
									file: res
								},
								onProgress: percent => {
									message.percent = percent;
								}
							});
							this.$sendTIMMessage(message);
						}
					}
				});
			},

			handleCommonFunctions(e) {
				switch (e.target.dataset.function.key) {
					case '0':
						// this.setData({
						// 	displayPreviewInfo: true
						// });
						uni.navigateTo({

							url: '/pages2/pages/record/index?userId=' + this.conversation.userProfile.userID

						})
						break;

					case '1':
						this.setData({
							displayCommonWords: true
						});
						break;

					case '2':
						this.setData({
							displaySendNote: true
						});
						break;

					case '3':
						this.setData({
							displaySendAsk: true
						});
						break;

					case '4':
						this.setData({
							displayMedicalFolder: true
						});
						break;

					default:
						break;
				}
			},

			cardTriggerHandler(e) {
				switch (e.key) {
					case '5':
						this.setData({
							messageData: e,
							displayTimeAppointment: true
						});
						break;

					case '6':
						this.setData({
							messageData: e,
							displayConditionDescription: true
						});
						break;

					case '7':
						this.setData({
							messageData: e,
							displayFengshike: true
						});
						break;

					case '8':
						this.setData({
							messageData: e,
							displayFengshike2: true
						});
						break;

					default:
						break;
				}
			},

			handleSendOrder() {
				this.setData({
					displayOrderList: true
				});
			},

			appendMessage(e) {
				this.setData({
					inputText: this.inputText + e.detail.message,
					sendMessageBtn: true
				});
			},

			getToAccount() {
				if (!this.conversation || !this.conversation.conversationID) {
					return '';
				}

				switch (this.conversation.type) {
					case 'C2C':
						return this.conversation.conversationID.replace('C2C', '');

					case 'GROUP':
						return this.conversation.conversationID.replace('GROUP', '');

					default:
						return this.conversation.conversationID;
				}
			},
			handleCalling(value) {
				// todo 目前支持单聊
				if (this.conversation.type === 'GROUP') {
					uni.showToast({
						title: '群聊暂不支持',
						icon: 'none'
					});
					return;
				}
				const {
					userID
				} = this.conversation.userProfile;

				let member = [userID]
				let callingData = {
					memberList: member,
					type: 'C2C'
				}
				this.$bus.$emit(`${value}-call`)
			},
			sendTextMessage(msg, flag) {
				const to = this.getToAccount();
				const text = flag ? msg : this.inputText;
				const message = uni.$TUIKit.createTextMessage({
					to,
					conversationType: this.conversation.type,
					payload: {
						text
					}
				});
				this.setData({
					inputText: '',
					sendMessageBtn: false
				});
				this.$sendTIMMessage(message);
			},

			onInputValueChange(event) {
				if (event.detail.value) {
					this.setData({
						sendMessageBtn: true
					});
				} else {
					this.setData({
						sendMessageBtn: false
					});
				}
			},

			$handleSendTextMessage(event) {
				this.sendTextMessage(event.detail.message, true);
				this.setData({
					displayCommonWords: false
				});
			},

			$handleSendCustomMessage(e) {
				const message = uni.$TUIKit.createCustomMessage({
					to: this.getToAccount(),
					conversationType: this.conversation.type,
					payload: e.detail.payload
				});
				this.$sendTIMMessage(message);
				this.setData({
					displayTimeAppointment: false,
					displayFengshike2: false,
					displayFengshike: false,
					displaySendNote: false,
					displaySendAsk: false
				});
			},

			$handleCloseCards(e) {
				switch (e.detail.key) {
					case '0':
						this.setData({
							displayPreviewInfo: false
						});
						break;

					case '1':
						this.setData({
							displayCommonWords: false
						});
						break;

					case '2':
						this.setData({
							displaySendNote: false
						});
						break;

					case '3':
						this.setData({
							displaySendAsk: false
						});
						break;

					case '4':
						this.setData({
							displayMedicalFolder: false
						});
						break;

					case '5':
						this.setData({
							displayTimeAppointment: false
						});
						break;

					case '6':
						this.setData({
							displayConditionDescription: false
						});
						break;

					case '7':
						this.setData({
							displayFengshike: false
						});
						break;

					case '8':
						this.setData({
							displayFengshike2: false
						});
						break;

					default:
						break;
				}
			},

			$sendTIMMessage(message) {
				const SDKAppID = getApp().globalData.SDKAppID;
				this.$emit('sendMessage', {
					detail: {
						message
					}
				});
				uni.$TUIKit.sendMessage(message).then((res) => {
					if (this.firstSendMessage) {
						uni.$aegis.reportEvent({
							name: 'sendMessage',
							ext1: 'sendMessage-success',
							ext2: 'uniTuikitExternal',
							ext3: `${SDKAppID}`,
						})
					}
					this.firstSendMessage = false
				}).catch((error) => {
					uni.$aegis.reportEvent({
						name: 'sendMessage',
						ext1: `sendMessage-failed#error: ${error}`,
						ext2: 'uniTuikitExternal',
						ext3: `${SDKAppID}`,
					})
				})
				this.setData({
					displayFlag: ''
				});
			},

			handleClose() {
				this.setData({
					displayFlag: ''
				});
			},

			handleServiceEvaluation() {
				this.setData({
					displayServiceEvaluation: true
				});
			},

			inputBindFocus() {
				console.log('占位：函数 inputBindFocus 未声明');
			},

			inputBindBlur() {
				console.log('占位：函数 inputBindBlur 未声明');
			}
		}
	};
</script>
<style>
	@import './index.css';
</style>

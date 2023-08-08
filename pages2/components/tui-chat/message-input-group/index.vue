<template>
	<view>
		<view class="TUI-message-input-container">
			<view class="TUI-commom-function">
				<view v-for="(item, index) in commonFunction" :key="index" class="TUI-commom-function-item" :data-function="item" @tap="handleCommonFunctions">
					{{ item.name }}
				</view>
			</view>
			<view class="TUI-message-input">
				<image class="TUI-icon" @tap="switchAudio" :src="isAudio ? '/pages2/static/static/assets/keyboard.svg' : '/pages2/static/static/assets/audio.svg'"></image>
				<view v-if="!isAudio" class="TUI-message-input-main">
					<input
						class="TUI-message-input-area"
						:adjust-position="true"
						cursor-spacing="20"
						v-model="inputText"
						@input="onInputValueChange"
						maxlength="200"
						type="text"
						placeholder-class="input-placeholder"
						placeholder=" "
						@focus="inputBindFocus"
						@blur="inputBindBlur"
					/>
				</view>
				<view
					v-else
					class="TUI-message-input-main"
					@longpress="handleLongPress"
					@touchmove="handleTouchMove"
					@touchend="handleTouchEnd"
					style="display: flex; justify-content: center; font-size: 32rpx; font-family: PingFangSC-Regular;"
				>
					<text>{{ text }}</text>
				</view>
				<view class="TUI-message-input-functions" hover-class="none">
					<view v-if="!sendMessageBtn" @tap="handleExtensions"><image class="TUI-icon" src="/pages2/static/static/assets/more.svg"></image></view>
					<view v-else class="TUI-sendMessage-btn" @tap="sendTextMessage">发送</view>
				</view>
			</view>
			<view v-if="displayFlag === 'emoji'" class="TUI-Emoji-area"><TUI-Emoji @enterEmoji="appendMessage"></TUI-Emoji></view>
			<view v-if="displayFlag === 'extension'" class="TUI-Extensions">
				<view class="TUI-Extension-slot" @tap="handleSendImage">
					<image class="TUI-Extension-icon" src="/pages2/static/static/images/group/image.png"></image>
					<view class="TUI-Extension-slot-name">发送图片</view>
				</view>
				<view class="TUI-Extension-slot" @tap="handleSendPicture">
					<image class="TUI-Extension-icon" src="/pages2/static/static/images/group/camera.png"></image>
					<view class="TUI-Extension-slot-name">拍摄照片</view>
				</view>
				<view class="TUI-Extension-slot" @tap="handlePaper">
					<image class="TUI-Extension-icon" src="/pages2/static/static/images/group/paper.png"></image>
					<view class="TUI-Extension-slot-name">推送问卷</view>
				</view>
				<view class="TUI-Extension-slot" @tap="handleNote">
					<image class="TUI-Extension-icon" src="/pages2/static/static/images/group/note.png"></image>
					<view class="TUI-Extension-slot-name">推送文章</view>
				</view>
				<view class="TUI-Extension-slot" @tap="handleFinish">
					<image class="TUI-Extension-icon" src="/pages2/static/static/images/group/finish.png"></image>
					<view class="TUI-Extension-slot-name">结束问诊</view>
				</view>
			</view>
			<TUI-Preview-Info
				class="tui-cards"
				:display="displayPreviewInfo"
				@close="$handleCloseCards"
			></TUI-Preview-Info>
			<TUI-Common-Words
				class="tui-cards"
				:display="displayCommonWords"
				@sendMessage="$handleSendTextMessage"
				@close="$handleCloseCards"
			></TUI-Common-Words>
			<TUI-Send-Note
				class="tui-cards"
				:display="displaySendNote"
				@sendNote="$handleSendCustomMessage"
				@close="$handleCloseCards"
			></TUI-Send-Note>
			<TUI-Send-Ask
				class="tui-cards"
				:display="displaySendAsk"
				@sendAsk="$handleSendCustomMessage"
				@close="$handleCloseCards"
			></TUI-Send-Ask>
			<TUI-Medical-Folder
				class="tui-cards"
				:display="displayMedicalFolder"
				@close="$handleCloseCards"
			></TUI-Medical-Folder>
			<TUI-Time-Appointment
				class="tui-cards"
				:message="messageData"
				:display="displayTimeAppointment"
				@sendTime="$handleSendCustomMessage"
				@close="$handleCloseCards"
			></TUI-Time-Appointment>
			<TUI-Fengshike
				class="tui-cards"
				:message="messageData"
				:display="displayFengshike"
				@sendCard="$handleSendCustomMessage"
				@close="$handleCloseCards"
			></TUI-Fengshike>
			<TUI-Fengshike2
				class="tui-cards"
				:message="messageData"
				:display="displayFengshike2"
				@close="$handleCloseCards"
			></TUI-Fengshike2>
			<TUI-Condition-Description
				class="tui-cards"
				:message="messageData"
				:display="displayConditionDescription"
				@close="$handleCloseCards"
			></TUI-Condition-Description>
		</view>
		<view class="record-modal" v-if="popupToggle" @longpress="handleLongPress" @touchmove="handleTouchMove" @touchend="handleTouchEnd">
			<view class="wrapper"><view class="modal-loading"></view></view>
			<view class="modal-title">{{ title }}</view>
		</view>
	</view>
</template>

<script>
import TUIEmoji from '../message-elements-group/emoji/index';
import TUIPreviewInfo from '../message-private-group/preview-info/index';
import TUICommonWords from '../message-private-group/common-words/index';
import TUISendNote from '../message-private-group/send-note/index';
import TUISendAsk from '../message-private-group/send-ask/index';
import TUIMedicalFolder from '../message-private-group/medical-folder/index';
import TUITimeAppointment from '../message-private-group/time-appointment/index';
import TUIFengshike from '../message-private-group/fengshike/index';
import TUIFengshike2 from '../message-private-group/fengshike2/index';
import TUIConditionDescription from '../message-private-group/condition-description/index';

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
			commonFunction: [
				{
					name: '常用语',
					key: '1'
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
		this.$bus.$off('cardTrigger');
		this.$bus.$off('sendCustomMessage');
	},
	
	beforeMount() {
		// 加载声音录制管理器
		this.recorderManager = uni.getRecorderManager();
		this.recorderManager.onStop(res => {
			clearInterval(this.recordTimer);
			// 兼容 uniapp 打包app，duration 和 fileSize 需要用户自己补充
			// 文件大小 ＝ (音频码率) x 时间长度(单位:秒) / 8
			let msg = {
				duration: res.duration ? res.duration : this.recordTime * 1000,
				tempFilePath: res.tempFilePath,
				fileSize: res.fileSize ? res.fileSize : ((48 * this.recordTime) / 8) * 1024
			};
			uni.hideLoading();
			// 兼容 uniapp 语音消息没有duration
			if (this.canSend) {
				if (msg.duration < 1000) {
					uni.showToast({
						title: '录音时间太短',
						icon: 'none'
					});
				} else {
					// res.tempFilePath 存储录音文件的临时路径
					const message = uni.$TUIKit.createAudioMessage({
						to: this.getToAccount(),
						conversationType: this.conversation.type,
						payload: {
							file: msg
						}
					});
					this.$sendTIMMessage(message);
				}
			}
	
			this.setData({
				startPoint: 0,
				popupToggle: false,
				isRecording: false,
				canSend: true,
				title: ' ',
				text: '按住说话'
			});
		});
	},
	
	methods: {
		switchAudio() {
			this.setData({
				isAudio: !this.isAudio,
				text: '按住说话'
			});
		},
		
		handleLongPress(e) {
			this.recorderManager.start({
				duration: 60000,
				// 录音的时长，单位 ms，最大值 600000（10 分钟）
				sampleRate: 44100,
				// 采样率
				numberOfChannels: 1,
				// 录音通道数
				encodeBitRate: 192000,
				// 编码码率
				format: 'aac' // 音频格式，选择此格式创建的音频消息，可以在即时通信 IM 全平台（Android、iOS、微信小程序和Web）互通
			});
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
			this.recordTimer = setInterval(() => {
				this.recordTime++;
			}, 1000);
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
			this.recorderManager.stop();
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
		handleNote() {
			uni.navigateTo({
				url: `/pages2/pages/group/note`
			});
		},
		handlePaper() {
			uni.navigateTo({
				url: `/pages2/pages/group/paper`
			});
		},
		handleTeling() {
			const account = uni.getStorageSync('account');
			const taskItem = uni.getStorageSync('taskItem');
			const sourcePhone = account.user.phone;
			const distPhone = taskItem.taskDetail.userInfo.phone;
			const continueTime = ((taskItem.taskDetail.userGoodsAttrInfo || {}).timeLimit || '0') * 60;
			if (!sourcePhone){
				uni.$u.toast('未检测到本机号码!');
				return;
			}
			if (!distPhone){
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
		handleFinish() {
			uni.showModal({
				title: '结束问诊',
				content: '请确认是否结束问诊',
				cancelText: '取消',
				confirmText: '结束',
				cancelColor: '#4D4D4D',
				confirmColor: '#F36F6F',
				showCancel: true,
				success: (res) => {
					if (res.confirm){
						this.finish()
					}
				}
			})
		},
		finish() {
			uni.showLoading({
				title:'正在加载'
			});
			const taskItem = uni.getStorageSync('taskItem');
			uni.$u.http.post('/medical-api/rightsUse/endRightsUseReq', {
				id: taskItem.id
			}).then(res => {
				uni.hideLoading();
				uni.showToast({
					title: '结束成功',
					icon: 'success'
				});
			}).catch(error => {
				uni.hideLoading();
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
					sourceType: [type],
					count: 9,
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
			} catch(e) {
				console.log('e', e)
			}
		},

		handleShootVideo() {
			this.sendVideoMessage('camera');
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
					
						url: '/pages2/pages/record/index?userId='+this.conversation.userProfile.userID 
					
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
			console.log('input:'+e)
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
			const { userID } = this.conversation.userProfile;
			
			let member = [userID]
			let callingData = {
				memberList:member,
				type:'C2C'
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
			
			const taskItem = uni.getStorageSync('taskItem');
			uni.$u.http.get(`/medical-api/rightsUse/addChatCount?id=${taskItem.id}`).then(res => {
				this.setData({
					inputText: '',
					sendMessageBtn: false
				});
				this.$sendTIMMessage(message);
			});
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
				if(this.firstSendMessage) {
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
			this.handleClose();
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

<template>
	<view class="container">
		<!-- #ifdef MP-WEIXIN -->
		<!-- #endif -->
		<view class="tui-chatroom-navigatorbar">
			<image v-if="false" class="tui-chatroom-navigatorbar-back" src="/pages2/static/static/assets/ic_back_white.svg" @tap="goBack" />
			<!-- 先查 remark；无 remark 查 (c2c)nick/(group)name；最后查 (c2c)userID/(group)groupID -->
			<view class="conversation-title">{{ conversationName }}</view>
			
		</view>

		<view class="group-profile">
			<TUI-group-profile v-if="isShow" id="groip-profile" :conversation="conversation" />
		</view>
		<view class="message-list" @tap="triggerClose">
			<TUI-message-list id="message-list" ref="messageList" :conversation="conversation" />
		</view>
		<view v-if="videoPlay" class="container-box" @tap.stop="stopVideoHander">
			<video v-if="videoPlay" class="video-message" :src="videoMessage.payload.videoUrl"
				:poster="videoMessage.payload.thumbUrl" object-fit="contain" error="videoError" autoplay="true"
				direction="0" />
		</view>

	
		<view>
			<u-modal
				class="wenzhen-modal"
				title="问诊小结"
				confirmText="发送"
				cancelText="保存"
				:show="showModal"
				showCancelButton
				closeOnClickOverlay
				@confirm="confirmModal"
				@cancel="saveModal"
				@close="() => showModal = false"
			>
				<u--form
					labelPosition="left"
					:model="modelWenzhen"
					ref="form"
				>
					<u-form-item
						label="病情描述"
						prop="chiefComplaint"
					>
						<u--textarea
							placeholder="请输入病情描述"
							v-model="modelWenzhen.chiefComplaint"
						></u--textarea>
					</u-form-item>
					<u-form-item
						label="处置建议"
						prop="treatment"
					>
						<u--textarea
							placeholder="请输入处置建议"
							v-model="modelWenzhen.treatment"
						></u--textarea>
					</u-form-item>
					<u-form-item
						label="医生"
					>
						<view>{{ modelWenzhen.dealUserName }}</view>
					</u-form-item>
					<u-form-item
						label="日期"
					>
						<view>{{ modelWenzhen.date }}</view>
					</u-form-item>
				</u--form>
			</u-modal>
		</view>
		
		
	</view>
</template>

<script>
	import logger from '../../utils/logger';

	import TUIMessageList from '../../components/tui-chat/message-list-history/index.vue';
	
	import TUIGroupProfile from '../../components/tui-group/group-profile/index';

	const app = getApp();
	export default {
		components: {
			
			TUIMessageList,
		
			TUIGroupProfile
		},
		props: {},
		data() {
			return {
				taskItem: uni.getStorageSync('taskItem'),
				rightsText: '',
				showModal: false,
				modelWenzhen: {
					chiefComplaint: '',
					treatment: '',
					dealUserName: '',
					date: ''
				},
				rules: {
					chiefComplaint: {
						type: 'string',
						required: true,
						message: '请输入病情描述',
						trigger: ['blur', 'change']
					},
					treatment: {
						type: 'string',
						required: true,
						message: '请输入处置建议',
						trigger: ['blur', 'change']
					}
				},
				
				conversationName: '',
				conversation: {
					toUserID:'',
					userID:''
				},
				messageList: [],
				isShow: false,
				showChat: false,
				conversationID: '',
				videoPlay: false,
				videoMessage: {},
				config: {
					sdkAppID: '',
					userID: '',
					userSig: '',
					type: 1,
					tim: null
				}
			};
		},
		created() {
			uni.$on('videoPlayerHandler', value => {
				this.videoPlay = value.isPlay;
				this.videoMessage = value.message;
			});
			
			this.$bus.$off('updateRights');
			this.$bus.$off('wenzhenFinish');
			
			this.$bus.$on('updateRights', this.geneRightsText);
			this.$bus.$on('wenzhenFinish', this.wenzhenFinish);
		},
		beforeDestroy() {
			this.$bus.$off('updateRights');
			this.$bus.$off('wenzhenFinish');
		},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad(options) {
			   
			   this.conversation.userID = uni.getStorageSync('account').user.userId
				this.conversation.toUserID = options.toUserID;
				this.conversation.conversationID='C2C'+options.toUserID
				
				this.setData({
					conversationName: options.conversationName,
					isShow: false
				});
				
		},
		onUnload() {
			
		},
		onShow() {
			
		},
		onReady() {
			
		},
		mounted() {},
		methods: {
			readyHandler({
				name
			}) {
				if (name === uni.$TUIKitEvent.SDK_READY) {
					this.loadFunction()
				}
			},
			loadFunction() {
			
			},
			wenzhenConfirm() {
				uni.showModal({
					title: '提示',
					content: '确定结束问诊吗？',
					showCancel: true,
					success: (res) => {
						if (res.confirm){
							this.wenzhenFinish()
						}
					}
				})
			},
			wenzhenFinish() {
				const taskItem = uni.getStorageSync('taskItem');
				let account = uni.getStorageSync('account')
				uni.$u.http.post('/health-api/patient/saveRightsUseRecord', {
					execFlag: 1,
					id: taskItem.taskDetail.id,
					tradeId: taskItem.taskDetail.tradeId,
					taskId: taskItem.id + '',
					userId: taskItem.taskDetail.userId,
					rightsId: taskItem.taskDetail.rightsId,
					rightsType: taskItem.taskDetail.rightsType,
					execUser: account.user.userId
				}).then(res => {
					uni.$u.toast('问诊结束成功')
					this.wenzhenAction()
				})
			},
			stopVideoHander() {
				this.videoPlay = false;
			},
			getConversationName(conversation) {
				if (conversation.type === '@TIM#SYSTEM') {
					this.setData({
						showChat: false
					});
					return '系统通知';
				}

				if (conversation.type === 'C2C') {
					return conversation.remark || conversation.userProfile.nick || conversation.userProfile.userID;
				}

				if (conversation.type === 'GROUP') {
					return conversation.groupProfile.name || conversation.groupProfile.groupID;
				}
			},

			sendMessage(event) {
				// 将自己发送的消息写进消息列表里面
				this.$refs.messageList.updateMessageList(event.detail.message);
			},

			triggerClose() {
				if (this.showChat) {
					this.$refs.messageInput.handleClose();
				}
			},

			goBack() {
				const pages = getCurrentPages(); // 当前页面栈

				if (pages.length === 1) {
					uni.reLaunch({
						url: '/pages/todo/index'
					});
				} else if (
					pages[pages.length - 2].route === 'pages/TUI-Conversation/create-conversation/create' ||
					pages[pages.length - 2].route === 'pages/TUI-Group/create-group/create' ||
					pages[pages.length - 2].route === 'pages/TUI-Group/join-group/join'
				) {
					uni.navigateBack({
						delta: 2
					});
				} else {
					uni.navigateBack({
						delta: 1
					});
				}

				uni.$TUIKit
					.setMessageRead({
						conversationID: this.conversationID
					})
					.then(() => {});
			},
			
			geneRightsText() {
				const rightsType = this.taskItem.taskDetail.rightsType;
				const rightsName = this.taskItem.taskDetail.rightsName;
				const textNumLimit = (this.taskItem.taskDetail.userGoodsAttrInfo || {}).textNumLimit || 0;
				const timeLimit = ((this.taskItem.taskDetail.userGoodsAttrInfo || {}).timeLimit || 0) * 60;
				if (rightsType==='textNum' || rightsType==='appointNum'){
					this.getTextUsedInfo().then(data => {
						const record = data[0] || {};
						const dealResult = parseInt(record.dealResult || 0);
						const leave = textNumLimit - dealResult;
						this.rightsText = `患者权益: 图文剩余${leave}条`;
					});
				}else if (rightsType === 'videoNum') {
					this.getMultiUsedInfo().then(datas => {
						const record0 = datas[0][0] || {};
						const record1 = datas[1][0] || {};
						const dealResult0 = parseInt(record0.dealResult || 0);
						const dealResult1 = parseInt(record1.dealResult || 0);
						const leave0 = textNumLimit - dealResult0;
						const leave1 = timeLimit - dealResult1;
						uni.setStorageSync('videoLeave', leave1);
						this.rightsText = `患者权益: 图文剩余${leave0}条,视频剩余${leave1}秒`;
					});
				}
			},
			getMultiUsedInfo() {
				return Promise.all([
					this.getTextUsedInfo(),
					this.getVideoUsedInfo()
				]);
			},
			getTextUsedInfo() {
				return this.queryRightsUsedInfo('USED_TEXTNUM');
			},
			getVideoUsedInfo() {
				return this.queryRightsUsedInfo('USED_VIDEONUM');
			},
			queryRightsUsedInfo(dealType) {
				const account = uni.getStorageSync('account');
				const taskItem = uni.getStorageSync('taskItem');
				return uni.$u.http.get(`/health-api/patient/qryRightsUserLog?userId=${taskItem.taskDetail.userId}&tradeId=${taskItem.taskDetail.tradeId}&dealType=${dealType}`).then(res => {
					res.data = res.data || []
					return Promise.resolve(res.data)
				}).catch(() => {
					return Promise.reject()
				})
			},
			wenzhenAction() {
				const account = uni.getStorageSync('account');
				this.showModal = true
				this.modelWenzhen = {
					chiefComplaint: '',
					treatment: '',
					dealUserName: account.user.userName,
					date: uni.$u.timeFormat(new Date().getTime(), 'yyyy-mm-dd')
				}
				this.$nextTick(() => {
					this.$refs.form.setRules(this.rules)
				})
			},
			saveModal() {
				this.submit()
			},
			confirmModal() {
				this.submit(true)
			},
			hideKeyboard() {
				uni.hideKeyboard()
			},
			submit(send) {
				// 如果有错误，会在catch中返回报错信息数组，校验通过则在then中返回true
				const taskItem = uni.getStorageSync('taskItem');
				const account = uni.getStorageSync('account');
				this.$refs.form.validate().then(res => {
					uni.$u.http.post('/health-api/patient/saveSummary', {
						dealType: 'SUMMARY',
						dealResult: '问诊小结',
						userId: taskItem.taskDetail.userId,
						dealUser: account.user.userId,
						dealUserName: account.user.userName,
						tradeId: taskItem.taskDetail.tradeId,
						dealDetail: {
							chiefComplaint: this.modelWenzhen.chiefComplaint,
							treatment: this.modelWenzhen.treatment
						}
					}).then(res => {
						this.showModal = false
						if (send) {
							uni.$u.toast('发送成功');
							this.$bus.$emit('sendCustomMessage', {
								detail: {
									payload: {
										data: JSON.stringify({
											content: this.modelWenzhen.chiefComplaint,
											contentId: '',
											dealName: account.user.userName,
											description: '问诊小结',
											msgDetailId: this.modelWenzhen.treatment,
											time: uni.$u.timeFormat(new Date().getTime(), 'yyyy-mm-dd'),
											title: '问诊小结',
											type: 'CustomAnalyseMessage'
										}),
										extension: '',
										description: '问诊小结'
									}
								}
							});
						}else {
							uni.$u.toast('保存成功');
						}
						uni.reLaunch({
							url: '/pages/todo/index'
						});
					})
				});
			}
		}
	};
</script>

<style>
	@import './chat.css';
	
	.container>>> .wenzhen-modal .u-modal__content {
		flex-direction: column !important;
	}
</style>

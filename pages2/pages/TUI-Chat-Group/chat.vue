<template>
	<view class="container">
		<view class="header">
			<view class="tabs">
				<view class="tab tab1" :class="{active: tab === 'tab1'}" @click="tabClick('tab1')">健康档案</view>
				<view class="tab tab2" :class="{active: tab === 'tab2'}" @click="tabClick('tab2')">医患对话</view>
			</view>
			<view v-if="tab==='tab2'" class="rights">
				<view class="text">剩余咨询回合：{{ rights || 0 }}</view>
				<view class="btn" @click="handleGive()">赠送追问包</view>
			</view>
		</view>
		<block v-if="tab==='tab1'">
			<record :userId="taskItem.userId+''" :rightsId="taskItem.rightsId+''"/>
		</block>
		<block v-if="tab==='tab2'">
			<view class="message-list" @tap="triggerClose">
				<TUI-message-list id="message-list" ref="messageList" :conversation="conversation" />
			</view>
			<view v-if="videoPlay" class="container-box" @tap.stop="stopVideoHander">
				<video v-if="videoPlay" class="video-message" :src="videoMessage.payload.videoUrl"
					:poster="videoMessage.payload.thumbUrl" object-fit="contain" error="videoError" autoplay="true"
					direction="0" />
			</view>
			<view v-if="showChat" class="message-input">
				<TUI-message-input id="message-input" ref="messageInput" :conversation="conversation"
					@sendMessage="sendMessage" />
			</view>
		</block>
	</view>
</template>

<script>
	import logger from '../../utils/logger';
	import TUIMessageList from '../../components/tui-chat/message-list-group/index';
	import TUIMessageInput from '../../components/tui-chat/message-input-group/index';
	import record from '../../pages/record/record';

	const app = getApp();
	export default {
		components: {
			TUIMessageList,
			TUIMessageInput,
			record
		},
		props: {},
		data() {
			return {
				taskItem: uni.getStorageSync('taskItem'),
				tab: 'tab2',
				rights: 0,
				
				conversationName: '',
				conversation: {},
				messageList: [],
				isShow: false,
				showChat: true,
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
			this.$bus.$on('updateRights', this.geneRights);
		},
		beforeDestroy() {
			this.$bus.$off('updateRights');
		},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad(options) {
			logger.log(` TUI-chat | onLoad | conversationID: ${options.conversationID}`);
			const {
				conversationID
			} = options;
			this.setData({
				conversationID
			});

			try {
				this.loadFunction()
			} catch (e) {
				logger.log('TUI-chat | loadFunction  | ${e}');
			}
			uni.$TUIKit.on(uni.$TUIKitEvent.SDK_READY, this.readyHandler);
			
			const taskItem = uni.getStorageSync('taskItem');
			const userInfo = taskItem.userInfo || {};
			uni.setNavigationBarTitle({
				title: `${userInfo.userName} ${userInfo.userSex} ${userInfo.userAge}岁`
			});
		},
		onUnload() {
			uni.$TUIKit.off(uni.$TUIKitEvent.SDK_READY, this.readyHandler);
			getApp().globalData.sideY =uni.getWindowInfo().windowHeight - 300
		},
		onShow() {
			this.geneRights();
		},
		onReady() {},
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
				const conversationID = this.conversationID
				uni.$TUIKit
					.setMessageRead({
						conversationID
					})
					.then(() => {
						logger.log('TUI-chat | setMessageRead  | ok');
					});
				uni.$TUIKit.getConversationProfile(conversationID).then(res => {
					const {
						conversation
					} = res.data;
					this.conversation = conversation;
					this.setData({
						conversationName: this.getConversationName(conversation),
						isShow: conversation.type === 'GROUP'
					});
				});
			},
			tabClick(tab) {
				this.tab = tab;
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
			
			sendCustomMessage(e) {
				let reqParams = {};
				const taskItem = uni.getStorageSync('taskItem');
				const payloadData = JSON.parse(e.detail.payload.data);
                if (payloadData.type === 'CustomChuFangMessage'){
					this.$refs.messageInput.$handleSendCustomMessage(e);
					return;
				}
				if (payloadData.type === 'CustomArticleMessage'){
					reqParams = {
						originalId: payloadData.id,
						originalType: 2,
						title: '医生给您推送了健康宣教文章',
						content: `${taskItem.docName}医生在图文咨询中给您推送了健康宣教文章《${payloadData.content}》，请您及时阅读。`
					};
				}
				if (payloadData.type === 'CustomWenJuanMessage'){
					reqParams = {
						originalId: payloadData.id,
						originalType: 1,
						url: payloadData.url,
						title: '医生邀请您填写问卷',
						content: `${taskItem.docName}医生在图文咨询中邀请您填写问卷《${payloadData.name}》，请您及时填写。`
					};
				}
				uni.$u.http.post(`/medical-api/inquiriesAgency/add`, {
					... reqParams,
					... {
						imGroupId: taskItem.imGroupId,
						orderId: taskItem.orderId,
						rightsItemId: taskItem.rightsItemId,
						tradeId: taskItem.id,
						userId: taskItem.userId
					}
				}).then(res => {
					payloadData.todoId = res.data;
					e.detail.payload.data = JSON.stringify(payloadData);
					this.$refs.messageInput.$handleSendCustomMessage(e);
				});
			},

			triggerClose() {
				if (this.showChat) {
					this.$refs.messageInput.handleClose();
				}
			},
			
			geneRights() {
				this.getTextUsedInfo().then(data => {
					const record = data[0] || {};
					if (record.serviceFrequency===null || record.serviceFrequency===undefined){
						this.rights = '无限制';
					}else {
						this.rights = record.serviceFrequency - record.usedServiceFrequency;
					}
				});
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
				const taskItem = uni.getStorageSync('taskItem');
				return new Promise((resolve, reject) => {
					uni.$u.http.post(`/medical-api/rightsUse/qryRightsUseRecord`, {
						id: taskItem.id
					}).then(res => {
						res.data = res.data || [];
						resolve(res.data);
					}).catch(() => {
						reject();
					});
				});
			},
			handleGive() {
				uni.showModal({
					title: '提醒',
					content: '每个追问包含3个回合医患对话， 确定要赠送患者吗？',
					cancelText: '取消',
					confirmText: '确定',
					cancelColor: '#4D4D4D',
					// confirmColor: '#F36F6F',
					showCancel: true,
					success: (res) => {
						if (res.confirm){
							this.give();
						}
					}
				});
			},
			give() {
				uni.showLoading({
					title:'正在加载'
				});
				const taskItem = uni.getStorageSync('taskItem');
				uni.$u.http.get('/medical-api/rightsUse/giveTextNum', {
					params: {
						num: 3,
						tradeId: taskItem.id
					}
				}).then(res => {
					uni.hideLoading();
					uni.showToast({
						title: '赠送成功',
						icon: 'success'
					});
				}).catch(error => {
					uni.hideLoading();
				});
			},
			hideKeyboard() {
				uni.hideKeyboard();
			}
		}
	};
</script>

<style>
	@import './chat.css';
</style>
<style lang="scss">
	.container {
		background: #FFFFFF;
		.header {
			flex-shrink: 0;
			background: #FFFFFF;
			.tabs {
				display: flex;
				justify-content: space-between;
				padding: 30rpx 121rpx;
				.tab {
					flex: 1;
					font-size: 28rpx;
					font-weight: 400;
					color: #1A1A1A;
					line-height: 68rpx;
					text-align: center;
					border: 1rpx solid #E6E6E6;
					&.tab1 {
						border-radius: 34rpx 0 0 34rpx;
					}
					&.tab2 {
						border-radius: 0 34rpx 34rpx 0;
					}
					&.active {
						color: #FFFFFF;
						background: #409EFF;
						border: 1rpx solid transparent;
					}
				}
			}
			.rights {
				display: flex;
				justify-content: space-between;
				padding: 16rpx 24rpx;
				border-top: 1rpx solid #E6E6E6;
				.text {
					font-size: 28rpx;
					font-weight: 400;
					color: #F02727;
					line-height: 48rpx;
				}
				.btn {
					width: 200rpx;
					margin-right: 6rpx;
					font-size: 28rpx;
					font-weight: 400;
					color: #FFFFFF;
					line-height: 48rpx;
					text-align: center;
					background: #409EFF;
					border-radius: 4rpx;
				}
			}
		}
		.message-list {
			background: #EBEBEB;
		}
		.message-input {
			background: #F5F5F5;
		}
		.chat-wrapper {}
		.container-box {
			.video-message {}
		}
	}
</style>

<template>
	<view class="wrap" >
		
			<view style="height: 30rpx;"></view>
			<view class="inputwrap">
				<view class="remind">
					<image src="../../static/static/images/ai_icon.png"
						style="width: 42rpx;height: 42rpx;margin-right: 20rpx;"></image>
					<view>智能AI助手根据您和患者对话生成推荐回答</view>
			
				</view>
				<textarea class="textview" maxlength="-1"  @input="bindInput" :value="value"  />
			</view>
		
		

		<button type="primary" class="button" @click="sendTextMessage" :disabled="!completion">发 送</button>
	</view>
</template>

<script>
	import { SocketUrl } from '@/config/config';
	const app = getApp();
	export default {
		data() {
			return {
				account: {
					user: {}
				},
				conversation: '',
				patientUserId: '',
				chatListForAI: [],
				patientText: '',
				value: '',
				completion:false 
			}
		},
		onLoad(options) {
			this.account = uni.getStorageSync('account');
			this.patientUserId = options.patientUserId
			this.conversation = options.conversation
			this.completion=false
			var chatList = app.globalData.chatListForAI;
			console.log(chatList)
			var chatListForAI = []

			chatList.forEach(item => {




				if (item.type == 'TIMTextElem' && item.nick.indexOf('助手') == -1) { //目前只针对文本消息 并且踢出

					if (item.from == this.patientUserId) {
						this.patientText = item.payload.text
					}

					var from = ''
					var to = ''
					
						if (item.flow == 'out') {
							from = 'assistant'
							to = 'doctor'
						} else {
							from = 'doctor'
							to = 'assistant'
						}
					

					chatListForAI.push({
						time: item.time,
						from: from,
						to: to,
						text: item.payload.text,
						json: "",

					})
				}

			})
			
			this.chatListForAI = chatListForAI
			console.log(this.chatListForAI)
			if(!this.patientText || this.patientText.length===0){
				uni.showToast({
					title: '未找到患者文字消息,无法生成推荐回答',
					icon:'none'
				})
				return
			}
			this.connectWebSocket()
		},
		onUnload() {
			uni.closeSocket()
		},

		methods: {
			connectWebSocket() {
				let that = this
				uni.closeSocket()

				uni.connectSocket({
					url: SocketUrl+ this.account.user.userId,
					success(res) {
						console.log('连接成功', res)
					}
				});



				uni.onSocketOpen(function() {
					console.log('WebSocket 已连接')


					setTimeout(() => {

						console.log('发送内容', {
							from: "doctor",
							to: "assistant",
							text: that.patientText,
							history: that.chatListForAI
						})
						uni.sendSocketMessage({
							data: JSON.stringify({
								from: "doctor",
								to: "assistant",
								text: that.patientText,
								history: that.chatListForAI
							}),
							success(res) {
								console.log('发送成功', res)
							}
						})
					}, 1000)



				})


				uni.onSocketMessage(function(res) {
					console.log('收到服务器内容：', res)
					if (res && res.data && typeof res.data === "string") {
						var data = JSON.parse(res.data)


						if (data.chunk) {

							that.value = that.value + data.chunk

						}

						if (data.response) {
							uni.showToast({
								title: '生成完毕'
							})
							that.completion=true
						}
					}
				})

				uni.onSocketError(function(error) {
					console.log('socketerror', error)
				})
			},

			sendTextMessage() {
				const to = this.conversation;
				const text = this.value;
				console.log('this.value', this.value)
				const message = uni.$TUIKit.createTextMessage({
					to,
					conversationType: 'GROUP',
					payload: {
						text
					}
				});

				const taskItem = uni.getStorageSync('taskItem');
				uni.$u.http.get(`/medical-api/rightsUse/addChatCount?id=${taskItem.id}`).then(res => {

					this.$sendTIMMessage(message);

					const pages = getCurrentPages();
					const taskItem = uni.getStorageSync('taskItem');

					if (pages.length > 1) {
						const page = pages[pages.length - 2];
						if (page.route === 'pages2/pages/TUI-Chat-Group/chat' || page.route ===
							'pages2/pages/TUI-Chat-Group2/chat') {
							page.$vm.sendMessage({
								detail: {
									message: message
								}
							})
							uni.navigateBack({
								delta: 1
							});
							return;
						}
					}
				});
			},
			$sendTIMMessage(message) {
				console.log(message)
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

			},

			bindInput(event) {
				console.log(event.detail)
				this.value = event.detail.value
			}

		}
	}
</script>

<style>
	.wrap{
		height: 100vh;
		background-color: #f5f5f5;
		
		position: relative;
	}
	.inputwrap {
		width: 690rpx;
		
		background: #FFFFFF;
		border-radius: 4rpx;
		margin-left: 30rpx;
		padding-top: 30rpx;
		padding-bottom: 30rpx;
		background-color: white;

	}

	.remind {
		font-size: 28rpx;
		color: #999999;
		display: flex;
		flex-direction: row;
		margin-left: 30rpx;

	}

	.textview {
		width: 628rpx;
		height: 78vh;
		margin-top: 30rpx;
		margin-left: 30rpx;

		background-color: white;
		color: #4D4D4D;
	}

	.button {

		width: 690rpx;
		position: absolute;
		left: 30rpx;
		bottom: 30rpx;

		color: #ffffff;
		background-color: #3894FF !important;

		border-color: #3894FF !important;
		border-radius: 10rpx;
		
	}
</style>
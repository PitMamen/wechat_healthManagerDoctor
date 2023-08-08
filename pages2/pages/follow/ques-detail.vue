<template>
	<view class="content">
		<web-view style="margin-top: 200rpx;" @message="message" @onPostMessage="handlePostMessage"
			:webview-styles="webviewStyles" :src="questionUrl"></web-view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				webviewStyles: {
					progress: {
						color: '#409EFF'
					}
				},
				isCommited: false,
				questionUrl: '', //问卷
				toastMsg: '请先提交问卷！' //问卷
			}
		},

		onLoad(options) {
			// let questionObj = JSON.parse(decodeURIComponent(options.questionObj))
			// this.questionUrl = questionObj.url
			// console.log('goQues Got', this.questionUrl)

			let url = uni.getStorageSync('suifang_ques');
			this.questionUrl = url

			// this.questionUrl = 'http://develop.mclouds.org.cn:8009/s/e8605aa8b4c341a6963f93fd6e7e4bf0?userId=2018&showsubmitbtn=show&recordId=162243'
			// this.questionUrl =
			// 	"http://192.168.1.121/s/e8605aa8b4c341a6963f93fd6e7e4bf0?userId=2018&showsubmitbtn=hide&recordId=162243"

			// console.log('questionUrl', this.questionUrl)
			// this.questionUrl = this.questionUrl.replace('hide', 'show')
			// console.log('questionUrl**', this.questionUrl)

		},

		onReady() {
			//监听iframe发过来的消息
			// window.addEventListener('message', this.submitFormFun)
		},
		onShow() {

		},
		onUnload() {
			// window.removeEventListener('message', this.submitFormFun)
		},
		methods: {
			// //获取问卷
			// getQuestionnaireListForUserId() {
			// 	uni.$u.http.post('/follow-api/followPlanPhone/getQuestionnaireListForUserId', {
			// 		userId: this.userId,
			// 		userType: "execDoctor"
			// 	}).then(res => {
			// 		if (res.code === 0) {
			// 			res.data.unshift({
			// 				questionnaireId: "",
			// 				questionnaireName: "全部"
			// 			})
			// 			this.qlist = [res.data]
			// 			console.log(this.qlist)
			// 		}

			// 	})
			// },

			submitFormFun(e) {
				console.log('submitFormFun', e)
				if (e.data == 'submitFormSuccess') {
					console.log('iframe中已提交成功')
					// this.dodealsave()
					this.isCommited = true
				}
			},

			message(event) {
				console.log('message', event)
				// this.isCommited = true
			},
			handlePostMessage(event) {
				console.log('handlePostMessage', event)
			}
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		margin: 20rpx 23rpx;
	}

	.textcontent {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		font-size: 28rpx;
		color: #4D4D4D;
		margin-bottom: 56rpx;
	}

	.texttitle {
		width: 150rpx;
		text-align: left;
		margin-right: 30rpx;
		text-align-last: justify;

		text-align: justify;

	}

	.selectclass {
		flex: 1;
		margin-left: 9rpx;
		height: 60rpx;
		background: #FFFFFF;
		border: 1px solid #CCCCCC;
		border-radius: 4rpx;
		font-size: 28rpx;
		line-height: 60rpx;
		padding-left: 20rpx;
		padding-right: 23rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		color: #999999;
	}
</style>
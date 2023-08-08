<template>
	<view class="content">
		<view class="textcontent" style="margin-top: 36rpx;">
			<text class="texttitle"> 实际随访人:</text>
			<text>{{ detailResult.actualDoctorUserName }}</text>
		</view>
		<view class="textcontent">
			<text class="texttitle">随访结果:</text>
			<u-radio-group v-model="resultValue" placement="row" >
				<view>
					<u-radio name='2' activeColor="#409EFF" label="成功" style="margin-right: 88rpx;" :disabled="resultValue!='2'"></u-radio>
				</view>
				
				<view style="margin-left: 20rpx;">
					<u-radio name='3' activeColor="#409EFF" label="失败" style="margin-left: 20rpx;" :disabled="resultValue!='3'"></u-radio>
				</view>
				
				
			</u-radio-group>
		</view>
		<view v-if="resultValue=='3'" class="textcontent">
			<text class="texttitle">失败原因:</text>
			<u-radio-group v-model="failueValue" placement="column" >
				<u-radio activeColor="#409EFF" :customStyle="{marginBottom: '16rpx'}" 
					v-for="(item, index) in failureList" :key="index" :label="item" :name="index" :disabled="failueValue!=index">
				</u-radio>
			</u-radio-group>
		</view>
		<view v-if="resultValue=='3'" class="textcontent">
			<text decode class="texttitle"> 备&emsp;&emsp;注:</text>
			<u--textarea v-model="detailResult.remark" disabled placeholder=""></u--textarea>
		</view>
		<view class="textcontent" @click="goQues()">
			<text style="flex: 1;"> 问卷名称</text>
		
			<view class="" style="display: flex;flex-direction: row;align-items: center;">
				<view>{{questionnaireName}} </view>
				<u-icon name="arrow-right" color="#999"
					style="width: 22rpx;height: 12rpx;margin-top: 25rpx;"></u-icon>
			</view>
		
		</view>
		
		
		
		
		

		<!-- <web-view v-if="resultValue=='2'" style="margin-top: 200rpx;" :webview-styles="webviewStyles"
			:src="questionUrl"></web-view> -->
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				questionnaireName:'',
				recordId: '',
				resultValue: '', //随访结果
				failueValue: -1, //失败原因
				webviewStyles: {
					progress: {
						color: '#409EFF'
					}
				},
				failureList: [
					'电话无人接听',
					'电话号码有误',
					'主动放弃随访',
					'患者拒绝随访',
					'电话占线',
					'电话停机',
					'电话关机',
					'患者已死亡',
					'患者已迁出',
					'其他',
				],
				detailResult: {}, //随访结果
				questionUrl: '' //问卷
			}
		},

		onLoad(options) {

			this.account = uni.getStorageSync('account')
			this.recordId = options.recordId
            this.questionnaireName = options.questionnaireName
			console.log("GGG:", this.questionnaireName)
			uni.setNavigationBarTitle({
				title: options.patientUserName + '随访详情'
			})
			//随访结果
			uni.$u.http.post('/follow-api/followPlanPhone/historyFollowResult/' + this.recordId, {}).then(res => {
				if (res.code === 0) {
					this.detailResult = res.data
					this.resultValue = res.data.taskBizStatus.value + ''
					this.failueValue = res.data.failReason - 1
					console.log('failueValue', this.failueValue)
				}

			})
			//随访内容
			uni.$u.http.post('/follow-api/followPlanPhone/historyDetail/' + this.recordId, {}).then(res => {
				if (res.code === 0) {
					this.questionUrl = res.data.contentUrl
				}
			})
			
		},

		onReady() {

		},
		onShow() {

		},
		methods: {
			
			
			//跳转问卷详情
			goQues() {
				// let url = this.questionUrl.replace('hide', 'show')
				// console.log('goQues', url)
				// uni.navigateTo({
				// 	// url: './ques-detail?questionUrl=' + url
				// 	url: './ques-detail?questionObj=' + encodeURIComponent(JSON.stringify({
				// 		url: url
				// 	}))
				// })
			
				let url = this.questionUrl.replace('hide', 'show')
				uni.setStorageSync('suifang_ques', url);
				uni.navigateTo({
					// url: './ques-detail?questionUrl=' + url
					url: './ques-detail'
				})
			
			},
			


			//获取问卷
			getQuestionnaireListForUserId() {

				uni.$u.http.post('/follow-api/followPlanPhone/getQuestionnaireListForUserId', {
					userId: this.userId,
					userType: "execDoctor"
				}).then(res => {
					if (res.code === 0) {
						res.data.unshift({
							questionnaireId: "",
							questionnaireName: "全部"
						})
						this.qlist = [res.data]
						console.log(this.qlist)
					}

				})
			},
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

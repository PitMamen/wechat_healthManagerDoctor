<template>

	<view class="page">
		<u-sticky style="top:0">
			<view
				style="background-size: cover;background-image: url('https://hmg.mclouds.org.cn/content-api/file/I20211014143935478K8JK9TVTJ7QWFG-20211014143717.png'); "
				class="top">
				<view class="top-h1">
					<view style="font-size: 36rpx;margin-right: 19rpx;">{{baseInfo.userName}}</view>
					<view style="margin-right: 26rpx;">{{baseInfo.userSex}}</view>
					<view>{{baseInfo.birthday}}</view>
				</view>
				<view class="top-h2">
				  <view class="top-l">就诊医院：湘雅二医院</view>
				  <view class="top-r">就诊科室：{{options.deptName || '-'}}</view>
				</view>
				<view class="top-h2">
				  <view class="top-l">就诊医生：{{options.doctorName || '-'}}</view>
				  <view class="top-r">就诊时间：{{options.admDate || '-'}}</view>
				</view>
				
			</view>
			<view style="background-color: #FFFFFF;">
				<u-tabs :list="list1" :activeStyle="{
				    color: '#303133',
				    fontWeight: 'bold',
				    transform: 'scale(1.05)'
				}" @click="click"></u-tabs>
			</view>

		</u-sticky>



		<!-- 检查资料 -->
		<block v-if="active==0">

			<u-empty v-if=" !jcList || jcList.length == 0 " mode="data" text="无数据" icon="/pages2/static/img/icon_nodata.png"/>
			<view class="row" v-for="(item, index) in jcList" :key="index" @click="goInspectionPage(item)" gutter="5">
				<u-row>
					<u-col class="rol-l" span="9">{{item.name}}</u-col>

					<u-col class="rol-r" span="5">{{item.reportTime}}</u-col>
				</u-row>
			</view>

		</block>
		<!-- 检验资料 -->
		<view v-if="active==1">
			<u-empty v-if=" !jyList || jyList.length == 0 " mode="data" text="无数据" icon="/pages2/static/img/icon_nodata.png"/>

			<view class="row" v-for="(item, index) in jyList" :key="index" @click="goExaminePage(item)" gutter="5">
				<u-row>
					<u-col class="rol-l" span="9">{{item.name}}</u-col>

					<u-col class="rol-r" span="5">{{item.reportTime}}</u-col>
				</u-row>
			</view>
		</view>


		<!-- 门诊处方 -->
		<view v-if="active==2">
			<u-empty v-if=" !cfList || cfList.length == 0 " mode="data" text="无数据" icon="/pages2/static/img/icon_nodata.png"/>
			<view class="case-block2" v-for="(item, index) in cfList" :key="index" v-if="item.useDrugMethod">
				<view class="medication-title2">
					<view>{{item.adviceDesc}}</view>
				</view>
				<view class="medication-title2">
					<view v-if="item.packUnit" style="margin-right: 50rpx;">{{item.packUnit || ''}}</view>
					<view v-if="item.quantity">x{{item.quantity}}</view>
				</view>

				<view class="medication-content">
					<view v-if="item.useDrugMethod">{{item.useDrugMethod}}</view>
					<view v-if="item.useDrugFreq" style="margin-left: 30rpx;">
						{{item.useDrugFreq}}{{item.mcsysldw||''}}</view>
					<view v-if="item.yypc" style="margin-left: 30rpx;">{{item.yypc||''}}</view>
					<view v-if="item.yyts" style="margin-left: 30rpx;">共{{item.yyts||''}}天</view>
					<view style="flex: 1;"></view>
					<view >{{item.createDate}}</view>
				</view>

			</view>

		</view>

	</view>
</template>

<script>
	// var ForgeUtils = require("../../utils/forgeUtils.js");
	export default {
		data() {
			return {
				userId: '',
				accountUserId: '',
				admRowid: '',

				baseInfo: {
					healthRecordCode: '',
				},
				hospitalName: '',
				infodata: {},
				active: 0,
				jcList: [],
				jyList: [],
				cfList: [],
				list1: [{
					name: '检查资料'
				}, {
					name: '检验资料'
				}, {
					name: '门诊处方'
				}],
				options:{}
			}
		},
		methods: {

			onLoad: function(options) { //option为object类型，会序列化上个页面传递的参数
				console.log(options)
				this.$data.userId = options.userId
				this.$data.admRowid = options.admRowid
				this.$data.options=options

				this.healthRecordUserInfo()
				this.getjxjyList()
			},

			click(item) {
				console.log('item', item);
				this.$data.active = item.index
				switch (item.index) {

					case 0:
						if (this.$data.jcList.length == 0) {
							this.getjxjyList()
						}
						break;
					case 1:
						if (this.$data.jyList.length == 0) {
							this.getjxjyList()
						}
						break;
					case 2:
						if (this.$data.cfList.length == 0) {
							this.getcfList()
						}
						break;
				}
			},
			//请求基本信息
			healthRecordUserInfo() {

				const postData = {
					"userId": this.$data.userId
				}
				uni.$u.http.get('/account-api/userInfo/getBaseInfo', {
					params: postData
				}).then(res => {
					console.log(res)
					var birthday = res.data.baseInfo.birthday
					res.data.baseInfo.birthday = birthday.substring(0, 4) + '-' + birthday.substring(4, 6) + '-' +
						birthday.substring(6, 8)
					this.$data.baseInfo = res.data.baseInfo,
						this.$data.externalInfo = res.data.externalInfo
				})

			},

			//获取就医记录详情
			// getDocumentByDocId(documentId, indexName) {

			// 	const postData={
			// 		documentId: documentId,
			// 		indexName: indexName
			// 	}
			// return uni.$u.http.get('/health-api/patient/getDocumentByDocId', {params: postData})
			// 		.then(res => {
			// 			this.$data.hospitalName = res.data.hospitalName
			// 			this.$data.infodata = res.data.medicalRecord.source

			// 		})

			// },

			//检测检验
			getjxjyList() {
				const postData = {
					beginDate: '',
					endDate: '',
					userId: this.userId,
				}
				uni.$u.http.post('/health-api/his/report/doctorList', postData)
					.then(res => {
						var jcList = []
						var jyList = []
						res.data.forEach(item => {
							if(item.reportTime && item.reportTime.length > 10){
								item.reportTime = item.reportTime.substring(0, 10)
							}
							//检查：Check，检验： Exam
							if (item.reportType == 'Check') {
								item.reportName = '检查'
								jcList.push(item)
							} else {
								item.reportName = '检验'
								jyList.push(item)
							}
							// item.userId = this.data.defaultPatient.userId
						})
						this.$data.jcList = jcList
						this.$data.jyList = jyList
					})
			},
			//处方列表
			getcfList() {
				const postData = {
					admId: 43015894,
				}
				uni.$u.http.get('/health-api/prescription/getHisOrdItem', {
						params: postData
					})
					.then(res => {

						this.$data.cfList = res.data.items

					})
			},
			//获取就医记录详情
			getRecord(serialNumber, hospitalCode) {
				const postData2 = {
					"dataOwnerId": this.userId,
					"dataUserId": this.accountUserId,
					"recordType": "menzhen",
					"serialNumber": serialNumber,
					"hospitalCode": hospitalCode,
				}
				uni.$u.http.post('/ehr-api/ehr/v1/getRecord', postData2)
					.then(res => {
						console.log(res)


						// var record = ForgeUtils.decodeRecord(res.encryptedRecord, res.wrappedDEK)
						// if (record) {
						// 	this.$data.hospitalName = record.hospitalName
						// 	this.$data.infodata = record
						// } else {
						// 	uni.$u.toast('解密失败')
						// }

					})
			},
			//跳转检查详情
			goInspectionPage(item) {
				uni.navigateTo({
					url: './check?reportId=' + item.reportId + '&userId=' + this.$data.userId +
						'&name=' + this.$data.baseInfo.userName + '&title=' + item.name + '&reportTime=' + item
						.reportTime,
				})
			},
			//跳转检验详情
			goExaminePage(item) {
				uni.navigateTo({
					url: './exam?reportId=' + item.reportId + '&userId=' + this.$data.userId +
						'&name=' + this.$data.baseInfo.userName + '&title=' + item.name + '&reportTime=' + item
						.reportTime,
				})
			},
			//毫秒时间戳->YYYY-MM-DD
			formatFullDate1(time) {

				if (time) {
					let date = new Date(time)
					var md = date.getMonth() + 1 + '-' + date.getDate()
					return date.getFullYear() + '-' + md
				}
			},
			formatDate(date) {
				if (date) {
					return date.substring(0, 4) + '-' + date.substring(4, 6) + '-' + date.substring(6, 8);
				}
			}
		}
	}
</script>

<style>
	@import './index.css';

	.top {
		padding: 26rpx 0 26rpx 26rpx;
		display: flex;
		flex-direction: column;
		color: white;
		font-size: 28rpx;
		background-color: #4180F1;
	}

	.top-h1 {
		display: flex;
		align-items: flex-end;
		flex-direction: row;
		margin-bottom: 30rpx;
	}

	.top-h2 {
	  display: flex;
	  align-items: flex-end;
	  flex-direction: row;
	  margin-bottom: 26rpx;
	}
	
	.top-l {
	  width: 50%;
	  overflow: hidden;
	  white-space: nowrap; 
	  text-overflow: ellipsis; 
	  padding-right: 10rpx;
	}
	.top-r {
	  width: 320rpx;
	  overflow: hidden;
	  white-space: nowrap; 
	  text-overflow: ellipsis; 
	}



	.title-scroll {

		width: 100%;
		overflow: hidden;
		white-space: nowrap;
		padding-bottom: 20rpx;
		padding-top: 26rpx;
		background-color: #fff;
		display: flex;
		align-items: center;

	}

	.title {
		width: 168rpx;
		height: 56rpx;
		background: #F2F2F2;
		color: #141418;
		border-radius: 28rpx;
		font-size: 28rpx;
		line-height: 56rpx;
		text-align: center;
		overflow: hidden;
		margin-left: 20rpx;
		display: inline-block;
	}

	.active {
		color: #0379FF;
		box-sizing: border-box;
		border: 1px solid #0379FF;

	}

	.case-block {
		padding: 35rpx 26rpx;

	}

	.case-title {
		color: #1A1A1A;
		font-size: 30rpx;
	}

	.case-content {
		color: #999999;
		font-size: 28rpx;
		margin-top: 20rpx;
	}

	.case-block2 {
		padding: 35rpx 26rpx;
		border-bottom: 1px solid #E6E6E6
	}

	.inspection-title {
		color: #1A1A1A;
		font-size: 30rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;

	}

	.inspection-title-l {
		width: 70%;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		overflow: hidden;
	}

	.inspection-content {
		color: #999999;
		font-size: 24rpx;
		margin-top: 28rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.inspection-content-l {
		width: 70%;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		overflow: hidden;
		color: #178CFC;
	}

	.row {
		padding: 35rpx 26rpx;

		border-bottom: 1px solid #E6E6E6;

	}

	.rol-l {
		color: #1A1A1A;
		font-size: 26rpx;

	}

	.rol-m {
		color: #178CFC;
		font-size: 24rpx;

	}

	.rol-r {
		color: #999999;
		font-size: 24rpx;
		text-align: right;

	}

	.medication-title {
		color: #1A1A1A;
		font-size: 30rpx;
	}

	.medication-title2 {
		color: #1A1A1A;
		font-size: 26rpx;
		display: flex;
		flex-direction: row;
	}



	.case-block3 {
		padding: 35rpx 26rpx;
		border-bottom: 1px solid #E6E6E6;
		display: flex;
		flex-direction: row;
		align-items: flex-end;
	}

	.examine-content {
		color: #999999;
		font-size: 24rpx;
		margin-left: 30rpx;
		width: 60%;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		overflow: hidden;
		color: #178CFC;
	}

	.examine-r {
		color: #999999;
		font-size: 24rpx;
		margin-left: auto;
	}



	.medication-content {
		display: flex;
		flex-direction: row;
		align-items: flex-end;
		color: #999999;
		font-size: 24rpx;
		margin-top: 20rpx;
	}

	.operation-time {
		color: #999999;
		font-size: 24rpx;
	}
</style>

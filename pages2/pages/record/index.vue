<template>

	<view class="page">
		<u-sticky style="top:0">
			<view class="top-back"
				style="background-size: cover;background-image: url('https://hmg.mclouds.org.cn/content-api/file/I20211014143935478K8JK9TVTJ7QWFG-20211014143717.png'); ">
				<view class="top-heard">
					<image src="/pages2/static/img/avatar.png" style="width: 88rpx;height: 88rpx;border-radius: 44rpx;">
					</image>
				</view>
				<view style="display: flex;flex-direction: row;float: left;flex: 1;">
					<view style="margin-left: 30rpx; font-size: 36rpx;">{{baseInfo.userName}}</view>
					<view style="margin-left: 19rpx; margin-top: 10rpx; font-size: 28rpx;">{{baseInfo.userSex}}</view>
					<view style="margin-left: 19rpx; margin-top: 10rpx; font-size: 28rpx;">{{baseInfo.birthday}}</view>
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
		<!-- 基本信息 -->
		<view v-if="selectTag==0">
			<view class="base-info">
				<view style="display: flex; height: 91rpx;align-items: center;font-size: 32rpx;font-weight: 500;">基础信息
				</view>
				<view style="background-color: #F4F6FA;height: 1rpx;margin-bottom: 8rpx;"></view>
				<view class="item-view">
					<view class="item-left-title">健康档案编码：</view>
					<view>{{baseInfo.healthRecordCode?baseInfo.healthRecordCode:'不详'}}</view>
				</view>
				<view class="item-view">
					<view class="item-left-title">姓名：</view>
					<view>{{baseInfo.userName}}</view>
				</view>
				<view class="item-view">
					<view class="item-left-title">性别：</view>
					<view>{{baseInfo.userSex}}</view>
				</view>
				<view class="item-view">
					<view class="item-left-title">出生日期：</view>
					<view>{{baseInfo.birthday}}</view>
				</view>
				<view class="item-view">
					<view class="item-left-title">证件号码：</view>
					<view>{{baseInfo.identificationNo}}</view>
				</view>
			</view>
			<view style="background-color: #F4F6FA;height: 10rpx;"></view>
			<view class="base-info">
				<view style="display: flex; height: 91rpx;align-items: center;">
					<view
						style="display: flex;font-size: 32rpx;font-weight: 500;float: left;flex: 1;flex-direction: row;">
						更多信息</view>
				</view>
				<view style="background-color: #F4F6FA;height: 1rpx;margin-bottom: 8rpx;"></view>
				<view class="item-view">
					<view class="item-left-title">本人电话：</view>
					<view>{{externalInfo.phone?externalInfo.phone:'不详'}}</view>
				</view>
				<view class="item-view">
					<view class="item-left-title">血型：</view>
					<view>{{externalInfo.bloodType?externalInfo.bloodType:'不详'}}</view>
				</view>
				<view class="item-view">
					<view class="item-left-title">RH：</view>
					<view>{{externalInfo.rh?externalInfo.rh:'不详'}}</view>
				</view>
				<view class="item-view">
					<view class="item-left-title">身高：</view>
					<view>{{externalInfo.height?externalInfo.height+'cm':'不详'}}</view>
				</view>
				<view class="item-view">
					<view class="item-left-title">体重：</view>
					<view>{{externalInfo.weight?externalInfo.weight+'kg':'不详'}}</view>
				</view>
				<view class="address-view">
					<view class="item-left-title">现居地址：</view>
					<view
						style="width: 70%;color: #666666;text-overflow: ellipsis;display:-webkit-box;-webkit-box-orient: vertical;">
						{{externalInfo.address?externalInfo.address:'不详'}}
					</view>
				</view>

			</view>
		</view>

		<!-- 就医记录 -->
		<view v-if="selectTag==1" class="cure-list">

			<!--<view style="display: flex;height: 82rpx;">
				 <view class="top-screen" @click="showType = true">
					<view>{{hospitalName}}</view>
					<u-icon name="arrow-down" color="#666666" style="margin-left: 8rpx;" />
				</view>
				<view style="background-color: #F4F6FA;width: 1rpx;height: 48rpx;margin-top: 17rpx;"></view>
				<view class="top-screen" @click="showTime = true">
					<view>{{screenName}}</view>
					<u-icon name="arrow-down" color="#666666" style="margin-left: 8rpx;" />
				</view>
			</view>-->
			

			<block v-if="cureHistoryList.length>0">
				<view v-for="(item, index) in cureHistoryList" :key="index" class="list-cell"
					@click="cureHistoryListClick(item)">
					<view style="display: flex;">
						<!-- <image class="artical-image" src="/image/hospital_logo.png" style="width: 160rpx;height: 160rpx;"></image> -->
						<view class="left-content">
							<view style="display: flex;">
								<view class="title">中南大学湘雅二医院 </view>
								<view class="title-tag">
									<u-tag v-if="item.recordType == 'zhuyuan'" bgColor="#E6FAE1" borderColor="#E6FAE1"
										color="#2FB315" text="住院"></u-tag>
									<u-tag v-else type="warning" bgColor="#E5F1FF" borderColor="#E5F1FF" color="#0379FF"
										text="门诊"></u-tag>
								</view>

							</view>
							<view class="content">就诊科室：{{item.deptName}}</view>
							<view class="cure-result">医生姓名：{{item.doctorName}}</view>
							<view class="send-time">就诊时间：{{item.admDate}} {{item.admTime}}</view>
						</view>
					</view>
					<view style="background-color: #F4F6FA;height: 1rpx;margin-bottom: 0px;"></view>
				</view>
			</block>

			<u-empty v-else mode="data" icon="/pages2/static/img/icon_nodata.png" text="无记录"></u-empty>

		</view>

		<!-- 检查资料 -->
		<block v-if="selectTag==2">

			<u-empty v-if=" !jcList || jcList.length == 0 " mode="data" icon="/pages2/static/img/icon_nodata.png" text="无数据" />
			<view class="row" v-for="(item, index) in jcList" :key="index" @click="goInspectionPage(item)" gutter="5">
				<u-row>
					<u-col class="rol-l" span="10">{{item.name}}</u-col>

					<u-col class="rol-r" span="4">{{item.reportTime}}</u-col>
				</u-row>
			</view>
			<!-- <view class="case-block2" v-for="(item, index) in jcList" :key="index" @click="goInspectionPage(item)">
				<view class="inspection-title">
					<view class="inspection-title-l">{{item.name}}</view>
					<view>{{item.status}}</view>
				</view>
				<view class="inspection-content">
					<view class="inspection-content-l">{{item.status}}</view>
					<view>{{item.reportTime}}</view>
				</view>

			</view> -->
		</block>
		<!-- 检验资料 -->
		<view v-if="selectTag==3">
			<u-empty v-if=" !jyList || jyList.length == 0 " mode="data" icon="/pages2/static/img/icon_nodata.png" text="无数据" />

			<view class="row" v-for="(item, index) in jyList" :key="index" @click="goExaminePage(item)" gutter="5">
				<u-row>
					<u-col class="rol-l" span="10">{{item.name}}</u-col>

					<u-col class="rol-r" span="4">{{item.reportTime}}</u-col>
				</u-row>
			</view>
		</view>

		<!-- 出院记录 -->
		<block v-if="selectTag==4">
			<u-empty v-if=" !cyxjList || cyxjList.length == 0 " mode="data" icon="/pages2/static/img/icon_nodata.png" text="无数据" />

			<view class="case-block2" v-for="(item, index) in cyxjList" :key="index" gutter="5">

				<view class="inspection-top">
					<view>{{item.hospitalName}}</view>
					<view style="font-size: 28rpx;font-weight: normal;">住院天数：{{item.zyts}}天</view>
				</view>

				<u-cell-group>
					<u-cell title="入院科室" :value="item.ryksmc || '-'"></u-cell>
					<u-cell title="入院时间" :value="formatFullDate1(item.rysj)"></u-cell>
					<u-cell title="入院情况" :value="item.ryzztz || '-'"></u-cell>
					<u-cell title="入院诊断" :value="item.ryzd || '-'"></u-cell>
					<u-cell title="诊疗过程" :value="item.zlgc || '-'"></u-cell>
					<u-cell title="诊疗结果" :value="item.zljgmc || '-'"></u-cell>
					<u-cell title="出院科室" :value="item.cyksmc || '-'"></u-cell>
					<u-cell title="出院时间" :value="formatFullDate1(item.cysj)"></u-cell>
					<u-cell title="出院诊断" :value="item.cyzd || '-'"></u-cell>
					<u-cell title="出院医嘱" :value="item.cyyz || '-'"></u-cell>


				</u-cell-group>

			</view>
		</block>

		<u-picker :show="showType" @cancel="showType=false" @confirm="typeConfirm" :columns="typeColumns"></u-picker>
		<u-picker :show="showTime" @cancel="showTime=false" @confirm="timeConfirm" :columns="timeColumns"></u-picker>

       
	</view>
</template>

<script>
	var ForgeUtils = require("../../utils/forgeUtils.js");
	import commonFormat from "../../utils/common-format.js";
	export default {
		data() {
			return {
				userId: "1",
				accountUserId: '',
				recordType: 'all',
				timeHorizon: '60',
				// idNumber: '430202198802186610',
				hospitalName: '全部类型',
				screenName: '全部时间',
				showType: false,
				showTime: false,
				typeColumns: [
					['全部类型', '住院', '门诊']
				],
				timeColumns: [
					['全部时间', '三个月', '半年', '一年', '两年', '三年']
				],
				baseInfo: {
					healthRecordCode: '',
				},
				externalInfo: {

				},
				cureHistoryList: [], //就医记录
				jcList: [], //检查资料
				jyList: [], //检验资料
				cyxjList: [], //出院小结
				selectTag: 0,
				// list1: [{
				// 	name: '基本信息',
				// }, {
				// 	name: '就医记录',
				// }, {
				// 	name: '检查资料'
				// }, {
				// 	name: '检验资料'
				// }, {
				// 	name: '出院小结'
				// }],
				list1: [{
						name: '基本信息',
					}, {
						name: '就医记录',
					}, {
						name: '检查资料'
					},
					{
						name: '检验资料'
					}
				]
			}
		},
		methods: {
			onLoad: function(options) { //option为object类型，会序列化上个页面传递的参数
				console.log(options)
				this.$data.userId = options.userId
				// this.$data.userId = 658
		
				this.accountUserId = uni.getStorageSync('account').user.userId

				this.healthRecordUserInfo()
			},
			click(item) {
				console.log('item', item);
				this.$data.selectTag = item.index
				console.log(this.$data.selectTag)
				switch (item.index) {
					case 0:

						break;
					case 1:
						if (this.$data.cureHistoryList.length == 0) {
							this.cureHistoryListQuery()
						}

						break;
					case 2:
						if (this.$data.jcList.length == 0) {
							this.getjxjyList()
						}
						break;
					case 3:
						if (this.$data.jyList.length == 0) {
							this.getjxjyList()
						}
						break;
					case 4:
						if (this.$data.cyxjList.length == 0) {
							this.getjxjyList()
						}
						break;
				}
			},
			//类型确定
			typeConfirm(e) {
				this.$data.showType = false
				console.log(e)
				const index = e.indexs[0]
				var recordType = '';
				if (index === 0) {
					recordType = 'all'
				} else if (index === 1) {
					recordType = 'zhuyuan'
				} else if (index === 2) {
					recordType = 'menzhen'
				}
				if (recordType == this.$data.recordType) {
					return
				} else {
					this.$data.recordType = recordType
					this.$data.hospitalName = e.value[0]
					this.cureHistoryListQuery()
					this.getjxjyList()
				}

			},
			//时间确定
			timeConfirm(e) {
				this.$data.showTime = false
				console.log(e)
				const index = e.indexs[0]
				var timeHorizon = '';
				if (index === 0) {
					timeHorizon = '60'
				} else if (index === 1) {
					timeHorizon = '3'
				} else if (index === 2) {
					timeHorizon = '6'
				} else if (index === 3) {
					timeHorizon = '12'
				} else if (index === 4) {
					timeHorizon = '24'
				} else if (index === 5) {
					timeHorizon = '36'
				}
				if (timeHorizon == this.$data.timeHorizon) {
					return
				} else {
					this.$data.timeHorizon = timeHorizon
					this.$data.screenName = e.value[0]
					this.cureHistoryListQuery()
					this.getjxjyList()
				}

			},
			//跳转就医记录详情
			cureHistoryListClick2(item) {
				console.log(item)
				if (item.recordType == 'menzhen') {
					uni.navigateTo({
						url: './mz-detail?documentId=' + item.serialNumber + '&indexName=' + item.recordType +
							'&userId=' + this
							.$data.userId + '&hospitalCode=' + item.hospitalCode,
					})
				} else if (item.recordType == 'zhuyuan') {
					uni.navigateTo({
						url: './zy-detail?documentId=' + item.serialNumber + '&indexName=' + item.recordType +
							'&userId=' + this
							.$data.userId + '&hospitalCode=' + item.hospitalCode,
					})
				}
			},
			//跳转就医记录详情
			cureHistoryListClick(item) {
				
				uni.navigateTo({
					url: './detail?admRowid=' + item.admRowid +'&userId=' + this.$data.userId+
					'&admDate='+item.admDate+'&deptName='+item.deptName+'&doctorName='+item.doctorName,
				})
			},
			//跳转检查详情
			goInspectionPage(item) {	
				uni.navigateTo({
					url: './check?reportId='+item.reportId+'&userId='+this.$data.userId+
					'&name='+this.$data.baseInfo.userName+'&title='+item.name+'&reportTime='+item.reportTime,
				})
			},
			//跳转检验详情
			goExaminePage(item) {
				uni.navigateTo({
					url: './exam?reportId='+item.reportId+'&userId='+this.$data.userId+
					'&name='+this.$data.baseInfo.userName+'&title='+item.name+'&reportTime='+item.reportTime,
				})
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
			//就医记录
			cureHistoryListQuery2() {
				const postData = {
					"dataOwnerId": this.userId,
					"dataUserId": this.accountUserId,
					"recordType": this.recordType,
					"pastMonths": this.timeHorizon,

				}
				uni.$u.http.post('/ehr-api/ehr/v1/list', postData)
					.then(res => {
						// this.$data.cureHistoryList = res.data
						console.log(res)
						this.$data.cureHistoryList = res.data
					})
			},
			//就医记录
			cureHistoryListQuery() {
				const postData = {
					"userId": this.userId,


				}
				uni.$u.http.get('/health-api/prescription/getPatInfoByUserId', {
						params: postData
					})
					.then(res => {
						// this.$data.cureHistoryList = res.data
						console.log(res)
						this.$data.cureHistoryList = res.data
					})
			},
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
							item.reportTime = item.reportTime.substring(0, 10)
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


			getRecord(recordType, serialNumber) {
				const postData2 = {
					"dataOwnerId": this.userId,
					"dataUserId": this.accountUserId,
					"recordType": recordType,
					"serialNumber": serialNumber,
				}
				return uni.$u.http.post('/ehr-api/ehr/v1/getRecord', postData2)

			},
			//就医记录
			// cureHistoryListQuery2() {
			// 	const postData = {
			// 		"userId": this.$data.userId,
			// 		"idNumber":"430202198802186610",
			// 		"recordType": this.$data.recordType,
			// 		"timeHorizon": this.$data.timeHorizon,
			// 		"zjlx": "01",
			// 	}
			// 	uni.$u.http.post('/health-api/patient/qryPatientMedicalRecords', postData)
			// 		.then(res => {
			// 			this.$data.cureHistoryList = res.data

			// 		})
			// },
			//检查检验列表集合 需要自行组装
			getjxjyList2() {
				let that = this
				const postData = {
					"dataOwnerId": this.userId,
					"dataUserId": this.accountUserId,
					"recordType": this.recordType,
					"pastMonths": this.timeHorizon,
				}
				uni.$u.http.post('/ehr-api/ehr/v1/list', postData)
					.then(res => {

						const docs = res.data.map((hs) => this.getRecord(hs.recordType, hs.serialNumber))
						Promise.all(docs)
							.then(resdata => {
								console.log("Promise.all(docs)", resdata)

								var jcList = []
								var jyList = []
								var cyxjList = []
								resdata.map((rdRes) => {

									var rd = ForgeUtils.decodeRecord(rdRes.encryptedRecord, rdRes
										.wrappedDEK)

									console.log(rd)

									return

									jcList = jcList.concat(rd.data.medicalRecord.source.yqjc)
									jyList = jyList.concat(rd.data.medicalRecord.source.sysjc)

									if (rd.data.medicalRecord.index == 'zhuyuan') {
										var cyxj = {
											hospitalName: rd.data.hospitalName,
											ryksmc: rd.data.medicalRecord.source.ryksmc,
											cyksmc: rd.data.medicalRecord.source.cyksmc,
											zyts: rd.data.medicalRecord.source.zyts,
											ryzztz: rd.data.medicalRecord.source.ryzztz,
											ryzd: rd.data.medicalRecord.source.ryzd,
											zlgc: rd.data.medicalRecord.source.zlgc,
											zljgmc: rd.data.medicalRecord.source.zljgmc,
											cyzd: rd.data.medicalRecord.source.cyzd,
											cyyz: rd.data.medicalRecord.source.cyyz,
											cysj: rd.data.medicalRecord.source.cysj,
											rysj: rd.data.medicalRecord.source.rysj,
										}
										cyxjList.push(cyxj)
									}

								})


								this.$data.jcList = jcList
								this.$data.jyList = jyList
								this.$data.cyxjList = cyxjList
								console.log("jcList", this.$data.jcList)
								console.log("jyList", this.$data.jyList)
								console.log("cyxjList", this.$data.cyxjList)
							})
							.catch(e => {
								// wx.showToast({
								// 	title: '获取失败,请重试',
								// 	icon: 'error'
								// });
								this.setData({
									loading: false,
								})
								console.log(e);
							});
					})
			},
			//获取就医记录详情
			getDocumentByDocId(documentId, indexName) {

				const postData = {
					documentId: documentId,
					indexName: indexName
				}
				return uni.$u.http.get('/health-api/patient/getDocumentByDocId', {
					params: postData
				})


			},
			//毫秒时间戳->YYYY-MM-DD
			formatFullDate1(time) {

				if (time) {
					let date = new Date(time)
					var md = date.getMonth() + 1 + '-' + date.getDate()
					return date.getFullYear() + '-' + md
				}
			}


		}
	}
</script>

<style>
	@import './index.css';
</style>

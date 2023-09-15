<template>
	<scroll-view
		:style="selectTag==0?'background-color: #F5F5F5;height:100vh':'background-color: #FFFFFF;height:100vh' "
		scroll-y="true">

		<view class="page">
			<u-sticky style="top:0">

				<view style="background-color: #FFFFFF;">
					<u-tabs :list="list1" :lineWidth="40" :activeStyle="{
				    color: '#303133',
				    fontWeight: 'bold',
				    transform: 'scale(1.05)'
				}" @click="click"></u-tabs>
				</view>
				<view class="diver"></view>

			</u-sticky>
			<!-- 基本信息 -->
			<view v-if="selectTag==0">
				<view class="patient-tags" @click="goEditTags">
					<view style="font-size: 30rpx;margin-top: 10rpx;">分组：</view>
					<view class="tags-wrap">
						<view class="tags-item" v-for="(item, index) in tagsData" :key="index">{{item.name}}</view>
					</view>
					<view style="margin-top: 2rpx;">
						<u-icon name="edit-pen" size="50rpx"></u-icon>
					</view>
					<!-- <u-icon name="plus-circle" color="#409EFF" size="36rpx"></u-icon> -->
				</view>
				<view class="base-info2">



					<view class="base-card">
						<view
							style="display: flex; height: 91rpx;align-items: center;font-size: 32rpx;font-weight: 500;">
							<view style="width: 6rpx;height: 32rpx;background: #5A9CF8;margin-right: 20rpx;"></view>基本信息
						</view>

						<view class="item-view">
							<view>出生日期</view>

							<view v-if="baseInfo.birthday" style="font-size: 28rpx;">{{baseInfo.birthday}}</view>
							<view v-if="!baseInfo.birthday" style="font-size: 28rpx;color: #999999;">未设置</view>
						</view>
						<view class="item-view">
							<view>身高</view>

							<view v-if="baseInfo.height" style="font-size: 28rpx;">{{baseInfo.height}}cm</view>
							<view v-if="!baseInfo.height" style="font-size: 28rpx;color: #999999;">未设置</view>
						</view>
						<view class="item-view">
							<view>体重</view>

							<view v-if="baseInfo.weight" style="font-size: 28rpx;">{{baseInfo.weight}}kg</view>
							<view v-if="!baseInfo.weight" style="font-size: 28rpx;color: #999999;">未设置</view>
						</view>
						<view class="item-view">
							<view>血型</view>

							<view v-if="baseInfo.bloodType" style="font-size: 28rpx;">{{baseInfo.bloodType}}</view>
							<view v-if="!baseInfo.bloodType" style="font-size: 28rpx;color: #999999;">未设置</view>
						</view>
						<view class="item-view">
							<view>婚姻状况</view>
							<view v-if="baseInfo.ismarry" style="font-size: 28rpx;">{{baseInfo.ismarry==1?'已婚':'未婚'}}
							</view>
							<view v-if="!baseInfo.ismarry" style="font-size: 28rpx;color: #999999;">未设置</view>
						</view>
						<view class="item-view" style="border-bottom:0">
							<view>生育状况</view>
							<view v-if="baseInfo.havechild" style="font-size: 28rpx;">{{baseInfo.havechildTx}}
							</view>
							<view v-if="!baseInfo.havechild" style="font-size: 28rpx;color: #999999;">未设置</view>
						</view>
					</view>
				</view>
				<view class="base-info2">


					<view class="base-card">
						<view
							style="display: flex; height: 91rpx;align-items: center;font-size: 32rpx;font-weight: 500;">
							<view style="width: 6rpx;height: 32rpx;background: #5A9CF8;margin-right: 20rpx;"></view>健康状况
							<view v-if="externalInfo.length==0"
								style="font-size: 28rpx;color: #999999;margin-left: auto;">未设置</view>
						</view>
						<view v-if="externalInfo.length>0" v-for="(item, index) in externalInfo" :key="index">
							<view class="item-ill-view">
								<view>{{item.name}}</view>


								<view v-if="item.value.length==0" style="font-size: 28rpx;color: #999999;">未设置</view>
							</view>
							<view class="illview" v-if="item.value.length>0">

								<view class="illcard" v-for="(item2, index2) in item.value" :key="index2">
									{{item2.tagsName}}
								</view>

							</view>
							<view v-if="index!=externalInfo.length-1"
								style="height: 1rpx;background:#E6E6E6 ;margin-top: 30rpx;"></view>
							<view v-if="index==externalInfo.length-1" style="height: 20rpx;"></view>

						</view>



					</view>

					<view style="height: 80px;"></view>

				</view>


			</view>

			<!-- 问诊信息 -->
			<view v-if="selectTag==1">

				<view class="base-info" style=" height: 100%; background-color: white;">
					<view style="display: flex; height: 91rpx;align-items: center;font-size: 32rpx;font-weight: 500;">
						病情描述
					</view>
					<view class="rightsdes">{{inputInfo.diseaseDesc}}</view>
					<view style="display: flex; height: 91rpx;align-items: center;font-size: 32rpx;font-weight: 500;">
						希望获得帮助
					</view>
					<view class="rightsdes">{{inputInfo.appealDesc || '-'}}</view>
					<view style="display: flex; height: 91rpx;align-items: center;font-size: 32rpx;font-weight: 500;">
						上传检查报告或患处图片
					</view>
					<view class="info-pics">
						<u-album :previewFullImage="true" :urls="inputInfo.urls" multipleSize="80" space="10"></u-album>

					</view>
				</view>

			</view>

			<!-- 就医记录 -->
			<view v-if="selectTag==2" class="cure-list" style=" height: 100%; background-color: white;">

				<block v-if="cureHistoryList.length>0">
					<view v-for="(item, index) in cureHistoryList" :key="index" class="list-cell"
						@click="cureHistoryListClick(item)">
						<view style="display: flex;">
							<!-- <image class="artical-image" src="/image/hospital_logo.png" style="width: 160rpx;height: 160rpx;"></image> -->
							<view class="left-content">
								<view style="display: flex;">
									<view class="title">中南大学湘雅二医院 </view>
									<view class="title-tag">
										<u-tag v-if="item.recordType == 'zhuyuan'" bgColor="#E6FAE1"
											borderColor="#E6FAE1" color="#2FB315" text="住院"></u-tag>
										<u-tag v-else type="warning" bgColor="#E5F1FF" borderColor="#E5F1FF"
											color="#0379FF" text="门诊"></u-tag>
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
			<block v-if="selectTag==3">

				<u-empty v-if=" !jcList || jcList.length == 0 " mode="data" icon="/pages2/static/img/icon_nodata.png"
					text="无数据" />
				<view class="row" v-for="(item, index) in jcList" :key="index" @click="goInspectionPage(item)"
					gutter="5">
					<u-row>
						<u-col class="rol-l" span="9">{{item.name}}</u-col>

						<u-col class="rol-r" span="5">{{item.reportTime}}</u-col>
					</u-row>
				</view>
				<view style="height: 80px;"></view>
			</block>
			<!-- 检验资料 -->
			<view v-if="selectTag==4">
				<u-empty v-if=" !jyList || jyList.length == 0 " mode="data" icon="/pages2/static/img/icon_nodata.png"
					text="无数据" />

				<view class="row" v-for="(item, index) in jyList" :key="index" @click="goExaminePage(item)" gutter="5">
					<u-row>
						<u-col class="rol-l" span="9">{{item.name}}</u-col>

						<u-col class="rol-r" span="5">{{item.reportTime}}</u-col>
					</u-row>
				</view>
				<view style="height: 80px;"></view>
			</view>


			<u-picker :show="showType" @cancel="showType=false" @confirm="typeConfirm" :columns="typeColumns">
			</u-picker>
			<u-picker :show="showTime" @cancel="showTime=false" @confirm="timeConfirm" :columns="timeColumns">
			</u-picker>


		</view>

	</scroll-view>
</template>

<script>
	// var ForgeUtils = require("../../utils/forgeUtils.js");
	import commonFormat from "../../utils/common-format.js";
	export default {
		data() {
			return {
				inputInfo: null,
				accountUserId: '',
				recordType: 'all',
				timeHorizon: '60',
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
					birthday: '',
					height: '',
					weight: '',
					bloodType: '',
					ismarry: '',
					havechild: '',
					havechildTx: ''
				},
				externalInfo: [],
				cureHistoryList: [], //就医记录
				jcList: [], //检查资料
				jyList: [], //检验资料

				selectTag: 0,
				tagsData: [{
						name: '基本信息',
						id: 1
					},
					{
						name: '发热热',
						id: 2
					}, {
						name: '发热fr热',
						id: 2
					}, {
						name: '发热wq热',
						id: 2
					},
					{
						name: '发dd热热',
						id: 2
					}, {
						name: '个人各个',
						id: 3
					}
				],

				list1: [{
						name: '基本信息',
					},
					{
						name: '问诊信息',
					}, {
						name: '线下就诊记录',
					}, {
						name: '检查',
					}, {
						name: '检验',
					}
				]
			}
		},
		props: {

			userId: {
				type: String
			},
			rightsId: {
				type: String
			}
		},

		created() {

			this.accountUserId = uni.getStorageSync('account').user.userId

			this.healthRecordUserInfo()
			this.getSavedUserTagsInfo()
		},
		methods: {


			click(item) {
				console.log('item', item);
				this.$data.selectTag = item.index
				console.log(this.$data.selectTag)
				switch (item.index) {
					case 0:

						break;
					case 1:
						if (!this.$data.inputInfo) {
							this.getRightsReqData()
						}

						break;
					case 2:
						if (this.$data.cureHistoryList.length == 0) {
							this.cureHistoryListQuery()
						}

						break;
					case 3:
						if (this.$data.jcList.length == 0) {
							this.getjxjyList()
						}

						break;
					case 4:
						if (this.$data.jyList.length == 0) {
							this.getjxjyList()
						}

						break;

				}
			},

			goEditTags() {
				//TODO 编辑患者标签
				uni.navigateTo({
					url: '/pages3/pages/record/tags'
				});

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
			cureHistoryListClick(item) {
				console.log("cureHistoryListClick")
				uni.navigateTo({
					url: '/pages2/pages/record/detail?admRowid=' + item.admRowid + '&userId=' + this.userId +
						'&admDate=' + item.admDate + '&deptName=' + item.deptName + '&doctorName=' + item
						.doctorName,
				})
			},
			//跳转检查详情
			goInspectionPage(item) {

				uni.navigateTo({
					url: '/pages2/pages/record/check?reportId=' + item.reportId + '&userId=' + this.userId +
						'&name=' + this.baseInfo.userName + '&title=' + item.name + '&reportTime=' + item
						.reportTime,
				})
			},
			//跳转检验详情
			goExaminePage(item) {
				uni.navigateTo({
					url: '/pages2/pages/record/exam?reportId=' + item.reportId + '&userId=' + this.userId +
						'&name=' + this.baseInfo.userName + '&title=' + item.name + '&reportTime=' + item
						.reportTime,
				})
			},

			//请求基本信息
			healthRecordUserInfo() {

				const postData = {
					"userId": this.userId
				}
				uni.$u.http.post('/account-api/getUserExternalInfo/' + this.userId, {}).then(res => {
					console.log(res)



					var baseInfo = {
						birthday: res.data.birthday || '',
						height: res.data.height || '',
						weight: res.data.weight || '',
						bloodType: res.data.bloodType || '',
						ismarry: res.data.ismarry || '',
						havechild: res.data.havechild || '',
						userName: res.data.name || ''
					}
					//1"已生育", 2"未生育",3"备孕期",4"怀孕期"
					if (baseInfo.havechild == 1) {
						baseInfo.havechildTx = '已生育'
					} else if (baseInfo.havechild == 2) {
						baseInfo.havechildTx = '未生育'
					} else if (baseInfo.havechild == 3) {
						baseInfo.havechildTx = '备孕期'
					} else if (baseInfo.havechild == 4) {
						baseInfo.havechildTx = '怀孕期'
					}
					this.$data.baseInfo = baseInfo
				})


			},
			//请求健康状况
			getSavedUserTagsInfo() {

				const postData = {
					"userId": this.userId
				}
				uni.$u.http.post('/account-api/getSavedUserTagsInfo/' + this.userId, {}).then(res => {
					console.log(res)


					this.$data.externalInfo = res.data || []

				})


			},
			//问诊信息
			getRightsReqData() {

				const postData = {
					"rightsId": this.rightsId
				}
				uni.$u.http.get('/medical-api/rightsUse/getRightsReqData', {
					params: postData
				}).then(res => {
					this.inputInfo = res.data || {}
					this.inputInfo.urls = this.inputInfo.images.split(',')
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
							if (item.reportTime && item.reportTime.length > 10) {
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

						console.log(this.$data.jyList)
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
	@import './record.css';
</style>
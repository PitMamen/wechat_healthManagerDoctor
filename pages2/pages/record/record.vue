<template>
	<scroll-view
		:style="selectTag==0?'background-color: #F5F5F5;height:100vh':'background-color: #FFFFFF;height:100vh' "
		scroll-y="true" :scroll-into-view="scrollId">

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
						<view class="tags-item" v-for="(item, index) in tagsData" :key="index">{{item.tags_name}}</view>
						<view v-if="tagsData.length==0" style="color: #999;font-size: 30rpx;margin-top: 10rpx;">暂无
						</view>
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
			
			<view v-if="selectTag==1">
				<view class="wrap1">
					<view class="tabs">
						<view class="tab" :class="{active: tab===0}" @click="tabClick(0)">检验记录</view>
						<view class="tab" :class="{active: tab===1}" @click="tabClick(1)">检查记录</view>
						<view class="tab" :class="{active: tab===2}" @click="tabClick(2)">门诊医嘱</view>
					</view>
					<view class="wrap1-content">
						<view id="wrap1tab1" class="wrap1tab">
							<view class="title1">检验记录</view>
							<!-- 检验资料 -->
							<view>
								<u-empty v-if=" !jyList || jyList.length == 0 " mode="data" icon="/pages2/static/img/icon_nodata.png"
									text="无数据" />
							
								<view class="row" v-for="(item, index) in jyList" :key="index" @click="goExaminePage(item)" gutter="5">
									<u-row>
										<u-col class="rol-l" span="9">{{item.name}}</u-col>
							
										<u-col class="rol-r" span="5">{{item.reportTime}}</u-col>
									</u-row>
								</view>
							</view>
						</view>
						<view id="wrap1tab2" class="wrap1tab">
							<view class="title1">检查记录</view>
							<!-- 检查资料 -->
							<view>
								<u-empty v-if=" !jcList || jcList.length == 0 " mode="data" icon="/pages2/static/img/icon_nodata.png"
									text="无数据" />
								<view class="row" v-for="(item, index) in jcList" :key="index" @click="goInspectionPage(item)"
									gutter="5">
									<u-row>
										<u-col class="rol-l" span="9">{{item.name}}</u-col>
							
										<u-col class="rol-r" span="5">{{item.reportTime}}</u-col>
									</u-row>
								</view>
							</view>
						</view>
						<view id="wrap1tab3" class="wrap1tab">
							<view class="title1">门诊医嘱</view>
							<!-- 就医记录 -->
							<view>
								<u-empty v-if=" !cureHistoryList || cureHistoryList.length == 0 " mode="data" icon="/pages2/static/img/icon_nodata.png"
									text="无记录" />
								<view class="row" v-for="(item, index) in cureHistoryList" :key="index" @click="cureHistoryListClick(item)"
									gutter="5">
									<u-row>
										<u-col class="rol-l" span="9">{{item.doctorName}} | {{item.deptName}}</u-col>
							
										<u-col class="rol-r" span="5">{{item.admDate}}</u-col>
									</u-row>
								</view>
							</view>
							<view style="height: 80px;"></view>
						</view>
					</view>
				</view>
			</view>
			<view v-if="selectTag==2">
				<treat ref="treat"></treat>
			</view>


			<u-picker :show="showType" @cancel="showType=false" @confirm="typeConfirm" :columns="typeColumns">
			</u-picker>
			<u-picker :show="showTime" @cancel="showTime=false" @confirm="timeConfirm" :columns="timeColumns">
			</u-picker>


		</view>

	</scroll-view>
</template>

<script>
	import treat from './treat.vue';
	// var ForgeUtils = require("../../utils/forgeUtils.js");
	import commonFormat from "../../utils/common-format.js";
	export default {
		data() {
			return {
				tab: 0,
				scrollId: '',
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
				tagsData: [],

				list1: [{
						name: '基本信息',
					},
					{
						name: '数据记录',
					}, {
						name: '问诊记录',
					}
				]
			}
		},
		components: {
			treat
		},
		props: {

			userId: {
				type: String
			},
			rightsId: {
				type: String
			}
		},

		onShow() {
			// this.getUserTagsInfo()
		},

		created() {

			this.accountUserId = uni.getStorageSync('account').user.userId

			this.healthRecordUserInfo()
			this.getSavedUserTagsInfo()
			this.getUserTagsInfo()
			uni.$on('refreshTags', (data) => {
				console.log('ddd',data)
				this.getUserTagsInfo()
			});
		},
		beforeDestroy() {
			uni.$off('refreshTags')
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
						if (this.$data.cureHistoryList.length == 0) {
							this.cureHistoryListQuery()
						}
						if (this.$data.jyList.length==0 || this.$data.jcList.length==0) {
							this.getjxjyList()
						}
						break;
					case 2:
						this.$nextTick(() => {
							this.$refs.treat.search();
						});
						break;
				}
			},
			tabClick(tab) {
				this.tab = tab;
				this.scrollId = 'wrap1tab' + (this.tab+1);
			},

			goEditTags() {
				//TODO 编辑患者标签
				uni.navigateTo({
					url: '/pages3/pages/record/tags?userId=' + this.userId
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
			//请求用户标签
			getUserTagsInfo() {
				let postData = {
					userId: this.userId,
				}
				uni.$u.http.post('/account-api/tdUserTags/getPatientTags', postData).then(res => {
					this.tagsData = res.data.records || []
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
				uni.showLoading({
					title:'正在加载'
				});
				const postData = {
					beginDate: '',
					endDate: '',
					userId: this.userId,
				}
				uni.$u.http.post('/health-api/his/report/doctorList', postData)
					.then(res => {
						uni.hideLoading();
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
<style lang="scss">
	.wrap1 {
		padding: 20rpx 24rpx;
		background: #F5F5F5;
		.tabs {
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 4rpx;
			.tab {
				flex: 1;
				font-size: 30rpx;
				font-weight: 400;
				color: #4D4D4D;
				line-height: 68rpx;
				text-align: center;
				background: #FFFFFF;
				border-right: 1rpx solid #CCCCCC;
				&:last-child {
					border-right: none;
				}
				&.active {
					color: #FFFFFF;
					background: #3894FF;
					border-right: 1rpx solid #3894FF;
				}
			}
		}
		.wrap1-content {
		}
		.wrap1tab {
			background: #FFFFFF;
			.title1 {
				padding-top: 10rpx;
				font-size: 32rpx;
				font-weight: 500;
				color: #1A1A1A;
				line-height: 72rpx;
				background: #F5F5F5;
			}
		}
	}
</style>

<template>

	<view class="page">
		<u-sticky style="top:0">
			  <view
			    style="background-size: cover;background-image: url('https://hmg.mclouds.org.cn/content-api/file/I20211014143935478K8JK9TVTJ7QWFG-20211014143717.png'); " class="top">
			    <view class="top-h1">
			      <view style="font-size: 36rpx;margin-right: 19rpx;">{{baseInfo.userName}}</view>
			    <view style="margin-right: 26rpx;">{{baseInfo.userSex}}</view>
			    <view>{{baseInfo.birthday}}</view>
			    </view>
			  <u-row class="top-h2">
			      <u-col span="3">就诊医院：</u-col>
			      <u-col span="3">{{hospitalName}}</u-col>
			      <u-col span="3">就诊科室：</u-col>
			      <u-col span="3">{{infodata.yyjzksmc|| '-'}}</u-col>
			    </u-row>
			    <u-row class="top-h2">
			      <u-col span="3">门诊诊断：</u-col>
			      <u-col span="3">{{infodata.yymzzdbmmc|| '-'}}</u-col>
			      <u-col span="3">就诊时间：</u-col>
			      <u-col span="3">{{formatDate(infodata.jzrq)}}</u-col>
			      
			    </u-row>
			  </view>
			<view style="background-color: #FFFFFF;">
				<u-tabs :list="list1" :activeStyle="{
				    color: '#303133',
				    fontWeight: 'bold',
				    transform: 'scale(1.05)'
				}" @click="click"></u-tabs>
			</view>

		</u-sticky>

		<!-- 门诊病历 -->
		<block v-if="active==0">
			<view class="case-block">
				<view class="case-title">主诉</view>
				<view class="case-content">{{infodata.zs|| '暂无数据'}}</view>
			</view>
			<view class="case-block">
				<view class="case-title">现病史</view>
				<view class="case-content">{{infodata.xbs|| '暂无数据'}}</view>
			</view>
			<view class="case-block">
				<view class="case-title">既往史</view>
				<view class="case-content">{{infodata.jws|| '暂无数据'}}</view>
			</view>
			<view class="case-block">
				<view class="case-title">个人史</view>
				<view class="case-content">{{infodata.grs|| '暂无数据'}}</view>
			</view>
			<view class="case-block">
				<view class="case-title">家族史</view>
				<view class="case-content">{{infodata.jzs|| '暂无数据'}}</view>
			</view>
			<view class="case-block">
				<view class="case-title">过敏史</view>
				<view class="case-content">{{infodata.gms || '暂无数据'}}</view>
			</view>
		</block>
		
		<!-- 检查资料 -->
		<block v-if="active==1">

			<u-empty v-if=" !infodata.yqjc || infodata.yqjc.length == 0 " mode="data" icon="/pages2/static/img/icon_nodata.png" text="无数据" />

			<view class="case-block2" v-for="(item, index) in infodata.yqjc" :key="index"
				@click="goInspectionPage(item)">
				<view class="inspection-title">
					<view class="inspection-title-l">{{item.jclxmc}}</view>
					<view>{{item.jcbwff}}</view>
				</view>
				<view class="inspection-content">
					<view class="inspection-content-l">{{item.jcmc}}</view>
					<view>{{formatFullDate1(item.bgsj)}}</view>
				</view>

			</view>
		</block>
		<!-- 检验资料 -->
		<view v-if="active==2">
			<u-empty v-if=" !infodata.sysjc || infodata.sysjc.length == 0 " mode="data" icon="/pages2/static/img/icon_nodata.png" text="无数据" />

			<view class="row" v-for="(item, index) in infodata.sysjc" :key="index" @click="goExaminePage(item)"
				gutter="5">
				<u-row>
					<u-col class="rol-l" span="3">{{item.yybbmc}}</u-col>
					<u-col class="rol-m" span="5">{{item.bgdlbmc}}</u-col>
					<u-col class="rol-r" span="4">{{formatFullDate1(item.cjrq)}}</u-col>
				</u-row>
			</view>
		</view>

		<!-- 门诊处方 -->
		<view v-if="active==3">
			<u-empty v-if=" !infodata.cfxx || infodata.cfxx.length == 0 " mode="data" icon="/pages2/static/img/icon_nodata.png" text="无数据" />
			<view class="case-block2" v-for="(item, index) in infodata.cfxx" :key="index" v-if="item.sfyp=='1'">
				  <view class="medication-title2">
				      <view >{{item.ywmc}}</view>   
				    </view>
				    <view class="medication-title2">
				      <view v-if="item.ypgg" style="margin-right: 50rpx;">{{item.ypgg || ''}}</view>    
				      <view v-if="item.ypsl">x{{item.ypsl}}</view>  
				    </view>
				
				    <view class="medication-content">
				      <view  v-if="item.ypyf">{{item.ypyf}}</view> 
				      <view  v-if="item.mcsysldw && item.mcsysl!=0" style="margin-left: 30rpx;">每次{{item.mcsysl}}{{item.mcsysldw}}</view>
				      <view  v-if="item.yypc" style="margin-left: 30rpx;">{{item.yypc}}</view>
				      <view  v-if="item.yyts" style="margin-left: 30rpx;">共{{item.yyts}}天</view>  
				    </view>

			</view>

		</view>
		
	</view>
</template>

<script>
	var  ForgeUtils=require("../../utils/forgeUtils.js") ;
	export default {
		data() {
			return {
				userId: '',
				accountUserId:'',
				documentId: '',
				indexName: '',
				baseInfo: {
					healthRecordCode: '',
				},
				hospitalName: '',
				infodata: {},
				active: 0,
				list1: [{
					name: '门诊病历',
				},  {
					name: '检查资料'
				}, {
					name: '检验资料'
				}, {
					name: '门诊处方'
				}]
			}
		},
		methods: {

			onLoad: function(options) { //option为object类型，会序列化上个页面传递的参数
				console.log(options)
				this.$data.userId = options.userId
				this.$data.documentId = options.documentId
				this.$data.indexName = options.indexName
				this.accountUserId = uni.getStorageSync('account').user.userId
				this.getRecord(options.documentId, options.hospitalCode)
			},

			click(item) {
				console.log('item', item);
				this.$data.active = item.index
			},
			//请求基本信息
			healthRecordUserInfo() {
			
			const postData = {
				"userId": this.$data.userId
			}
				uni.$u.http.get('/account-api/userInfo/getBaseInfo', {params: postData}).then(res => {
					console.log(res)
					var birthday=res.data.baseInfo.birthday
					res.data.baseInfo.birthday=birthday.substring(0, 4) + '-' + birthday.substring(4, 6) + '-' + birthday.substring(6, 8)
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


						var record = ForgeUtils.decodeRecord(res.encryptedRecord, res.wrappedDEK)
						if (record) {
							this.$data.hospitalName = record.hospitalName
							this.$data.infodata = record
						} else {
							uni.$u.toast('解密失败')
						}

					})
			},

			//跳转检查详情
			goInspectionPage(item) {
				item.name = this.$data.baseInfo.userName
				getApp().globalData.jcxq = item
				uni.navigateTo({
					url: './check',
				})
			},
			//跳转检验详情
			goExaminePage(item) {
				getApp().globalData.jyxq = item
				wx.navigateTo({
					url: './exam',
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
			formatDate(date){
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
		margin-bottom: 16rpx;
	}

	/* .top-l {
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
	} */



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
		font-size: 30rpx;

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
		font-size: 30rpx;
		display: flex;
		flex-direction: row;
	}

	content-title {
		color: #1A1A1A;
		font-size: 30rpx;
		width: 100px;
		display: table-cell;

		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		overflow: hidden;
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

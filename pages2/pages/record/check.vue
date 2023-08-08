<template>
	<view>
		<view style="background-image: url('https://hmg.mclouds.org.cn/content-api/file/I20211014143935478K8JK9TVTJ7QWFG-20211014143717.png'); " class="top">
		  <view class="top-h1">
		    <view style="font-size: 36rpx;margin-right: 19rpx;">{{options.title}}</view>
		  </view>
		  <view class="top-h2">
		    <view class="top-l">姓名：{{options.name}}</view>
		    <view class="top-r">检查科室：{{detail.deptName || '-'}}</view>
		  </view>
		  <view class="top-h2">
		    <view class="top-l">检查单号：{{detail.checkId || '-'}}</view>
		    <view class="top-r">报告日期：{{options.reportTime || '-'}}</view>
		  </view>
		</view>
		
		<view class="case-block2">
		  <view class="case-title">检查部位与方法</view>
		  <view class="case-content">{{detail.checkName}}</view>
		</view>
		
		<view class="case-block2">
		  <view class="case-title">影像表现或检查所见</view>
		  <view class="case-content">{{detail.advice}}</view>
		</view>
		<view class="case-block2">
		  <view class="case-title">检查诊断或提示</view>
		  <text decode class="case-content">{{detail.checkSituation}}</text>
		</view>
		<view class="case-block2">
		  <view class="case-title">备注或建议</view>
		  <view class="case-content">{{detail.advddice}}</view>
		</view>
	<!-- 	<view class="case-block2">
		  <view class="case-title">报告日期：{{options.reportTime || '-'}}</view>
		 
		</view> --> 
		 
	</view>
</template>

<script>
	export default {
		data() {
			return {
				detail: {},
				options:'',
				
			}
		},
		
		onLoad(options) {
		 //option为object类型，会序列化上个页面传递的参数
				this.options=options
				
				const postData = {
					"reportId": options.reportId,
					"userId": options.userId,			
				}
				console.log("JJJJ:",postData)
				uni.$u.http.post('/health-api/his/report/examDetailForDoctor', postData)
					.then(res => {
						this.$data.detail = res.data
					})
			
		},
		methods: {
			
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
	
	.case-block{
	  padding: 26rpx;
	
	}
	.case-title{
	  color: #1A1A1A;
	  font-size: 30rpx;
	}
	.case-content{
	  color: #999999;
	  font-size: 28rpx;
	  margin-top: 20rpx;
	}
	
	.case-block2{
	  padding: 26rpx;
	  border-bottom:1px solid #E6E6E6
	}

</style>

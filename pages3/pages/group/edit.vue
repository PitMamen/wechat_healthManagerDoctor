<template>
	<view>
		<view class="wrapview">
			<view class="titleview">
				<view class="titletag"></view>
				<view class="title">标签名称</view>
			</view>
			<view class="inputview">
				<u-input
					class="input"
					maxlength="15"
					placeholder="请输入标签名称，不超过15个字符"
					border="none"
					v-model="loginData.password"
				>
					
				</u-input>
			</view>
			
			<view class="line"></view>
		</view>
		
		<view class="wrapview">
			<view class="titleview">
				<view class="titletag"></view>
				<view class="title">标签患者</view>
			</view>
			<view class="userview">
				<view class="usertitle">张三 ｜ 男 ｜ 42岁</view>
				<view class="item">
					<view class="tag">门诊患者</view>
					<view class="tag">报到患者</view>
				</view>
				<view class="item">
					<view class="bqms">病情描述:</view>
					<view class="bqmsvalue">糖尿病前期，吃了药品后腹泻</view>
				</view>
				<view class="time">2023-09-08</view>
			</view>
			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style>
	page{
		background-color: #F5F5F5;
	}
 .wrapview{
	 width: 702rpx;
	 margin-top: 30rpx;
	 margin-left: 24rpx;
	 margin-bottom: 30rpx;
	 padding-top: 30rpx;
	 padding-bottom: 30rpx;
	 background: #FFFFFF;
	 box-shadow: 0px 3rpx 6rpx 0px rgba(204,204,204,0.35);
	 border-radius: 4rpx;
	 display: flex;
	 flex-direction: column;
	 
 }
 .titleview{
	 display: flex;
	 flex-direction: row;
	 margin-left: 30rpx;
	 margin-bottom: 47rpx;
	 align-items: center;
 }
 .titletag{
	 width: 5rpx;
	 height: 36rpx;
	 background: #3894FF;
 }
 .title{
	 font-size: 36rpx;
	 margin-left: 12rpx;
	 color: #1A1A1A;
	 font-weight: bold;
 }
 .inputview{
	 margin-left: 30rpx;
	 margin-right: 30rpx;
	 margin-bottom: 18rpx;
 }
 
 .input {
	
 	font-size: 30rpx;
 	font-family: PingFang SC;
 	font-weight: 400;
 	color: rgba(62,74,89,0.45);
 	line-height: 36rpx;
 }
 .line{
	 margin-left: 30rpx;
	 width: 642rpx;
	 height: 1rpx;
	 background: #E6E6E6;
 }
 .wrap-submit {
 	
 	display: flex;
 	flex-direction: column;
 	margin-bottom: 30rpx;
 	padding-left: 24rpx;
 	padding-right: 24rpx;
	margin-top: 100rpx;
 	
 }
 .btn-sub {
 	width: 100%;
 	border-radius: 8rpx;
 	text-align: center;
 	padding: 20rpx 0;
 	font-size: 30rpx;
 	color: white;
 	background-color: #3894FF;
  
 }
 
 .userview{
	 display: flex;
	 flex-direction: column;
	 margin-left: 30rpx;
	 margin-right: 30rpx;
	 
 }
 .item{
	 display: flex;
	 flex-direction: row;
	 align-items: center;
	  margin-bottom: 20rpx;
 }
 .usertitle{
	 font-size: 32rpx;
	 color: #1A1A1A;
	 line-height: 37rpx;
	 margin-bottom: 20rpx;
 }
 .tag{
	 padding: 11rpx 14rpx;	 
	 background: #65BEFE;
	 border-radius: 4rpx;
	 background-color: #65BEFE;
	 font-size: 24rpx;
	 color: #FFFFFF;
	 margin-right: 20rpx;
 }
 .bqms{
	 font-size: 28rpx;
	 color: #999999;
	 line-height: 37rpx;
	 margin-right: 20rpx;
 }
 .bqmsvalue{
	 font-size: 28rpx;
	 color: #1A1A1A;
	 line-height: 37rpx;
	 width: 400rpx;
 }
 .time{
	 font-size: 28rpx;
	 
	 color: #4D4D4D;
	 line-height: 37rpx;
 }
 
 
</style>

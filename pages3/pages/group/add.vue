<template>
	<view>
		<view class="titlewrap">
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
					v-model="tagTitle"
				>
					
				</u-input>
			</view>
			
			<view class="line"></view>
		</view>
		
		<view class="wrap-submit" @click="btnClick">
			<view class="btn-sub">保 存</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tagTitle:'',
				requestting:false
			}
		},
		methods: {
			btnClick() {
				
				if(!this.tagTitle){
					uni.showToast({
						title: '请填写标签名称',
						icon: 'none'
					});
					return
				}
				if(this.requestting){
					return
				}
				
				this.requestting=true
				uni.showLoading({
					title: '正在加载'
				});
				uni.$u.http.post('/account-api/tdUserTags/addUserTagsDoctor', 
				{
					"tagsName": this.tagTitle,
					
				}
				).then(res => {
					
					uni.showToast({
						title: '保存成功',
						icon: 'success'
					});
					setTimeout(()=>{
						uni.navigateBack()
					},1500)
					
				}).finally(() => {
					uni.hideLoading();
					this.requestting=false
				});;
			
			},
		}
	}
</script>

<style>
	page{
		background-color: #F5F5F5;
	}
 .titlewrap{
	 width: 702rpx;
	 margin-top: 30rpx;
	 margin-left: 24rpx;
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
</style>

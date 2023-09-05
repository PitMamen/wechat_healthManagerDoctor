<template class="wrap">
	<div class="top-content">
		<view style="margin-left: 60rpx;margin-top: 30rpx;">身份验证</view>
		<view style="margin-left: 60rpx;margin-top: 30rpx;color: #999999;">已绑定手机号:{{phone}}</view>
		 <div style="height: 2rpx;background: #999999;margin-left: 20rpx;margin-right: 20rpx;margin-top: 20rpx;"></div>
		 
		 
		
		 <div 	@click="doShow(1)" class="input-code" style="margin-left: 60rpx;margin-top: 30rpx;display: flex;flex-direction: row;">
		 			 <u-input
					   
		 			 	class="input"
		 			 	type="number"
		 			 	placeholder="请输入验证码"
		 			 	border="none"
						maxlength="6"
		 			 	v-model="verfcode"
		 			 ></u-input>
					 
					 <u-keyboard
					 	mode="number"
					 	tips="请输入6位验证码"
					 	:show="show1"
					 	:tooltip="true"
					 	:showTips="true"
					 	:showCancel="true"
					 	:showConfirm="true"
					 	:dotDisabled="true"
					 	@close="close(1, $event)"
					 	@change="change(1, $event)"
					 	@cancel="cancel(1, $event)"
					 	@confirm="confirm(1, $event)"
					 	@backspace="backspace(1, $event)"
					 ></u-keyboard>
					 
					 
					 
					  
					 <text v-if="showText" @click="getVerfiCode" style="color: #3894FF;margin-right: 20rpx;">获取验证码</text>  
					  <text v-else  style="color: #3894FF;margin-right: 20rpx;">{{second}}s重新发送</text>  
		 			 
		 </div>
		 
		  <div style="height: 2rpx;background: #999999;margin-left: 20rpx;margin-right: 20rpx;margin-top: 20rpx;"></div>
		  
		  
		  
		  
		  
		  <div 	@click="doShow(2)" class="input-code" style="margin-left: 60rpx;margin-top: 30rpx;display: flex;flex-direction: row;">
		  			 <u-input
					    readonly
		  			 	class="input"
		  			 	type="password"
		  			 	placeholder="请输入新密码"
		  			 	border="none"
						maxlength="6"
						v-model="newPassword"
					
		  			 	
		  			 ></u-input>
					 
					 <u-keyboard
					 	mode="number"
					 	tips="请输入6位数字密码"
					 	:show="show2"
					 	:tooltip="true"
					 	:showTips="true"
					 	:showCancel="true"
					 	:showConfirm="true"
					 	:dotDisabled="true"
					 	@close="close(2, $event)"
					 	@change="change(2, $event)"
					 	@cancel="cancel(2, $event)"
					 	@confirm="confirm(2, $event)"
					 	@backspace="backspace(2, $event)"
					 ></u-keyboard>
		  					 
		  					
		  			 
		  </div>
		  
		   <div style="height: 2rpx;background: #999999;margin-left: 20rpx;margin-right: 20rpx;margin-top: 20rpx;"></div>
		   
		   
		   
		   
		   <div  @click="updatePwd" style="background: #3894FF;border-radius: 16rpx;color: #FFFFFF;text-align: center;margin-left: 40rpx;margin-right: 40rpx;margin-top: 50rpx;padding-top: 20rpx;padding-bottom: 20rpx;">完成</div>
		  
		  
		
	</div>
	
	
	
	
	
	
	
</template>

<script>
	export default {
		
 
		data() {
			return {
				info: {},
				code:'',
				showText:true,
				second:60,
				account:{},
				phone:"",
				newPassword:'',
				verfcode:'',
				
				show1:false,
				show2:false,
			}
		},
		onLoad() {
			
				this.account = uni.getStorageSync('account');
				this.phone = this.account.phone.replace(/^(.{3})(?:\d+)(.{4})$/, "$1****$2")
				
		},
		onReady() {
		},
		onShow() {
			// this.getInfo();
		},
		methods: {
			
			
			getInfo() {
				uni.showLoading({
					title:'正在加载'
				});
				uni.$u.http.get(`/medical-api/userRightsSettlement/getSettlementSumByLoginUser`, {
					params: {
					}
				}).then(res => {
					uni.hideLoading();
					this.info = res.data || {};
				});
			},
			
			
			getVerfiCode() {
				 
				uni.$u.http.get(`/account-api/captcha/sms`, {
					params: {
						phone:this.account.phone
					}
				}).then(res => {
						
					 if(res.code==0){
						
					 uni.showLoading({
					 	title:'验证码已发送,请注意查收'
					 });
					// this.code = res.data || {};
					 }
				
					
				}).finally(() => {
					setTimeout(() => {
					    uni.hideLoading();
					}, 1000)
					
				});
				
				
				this.showText = false
				    var interval = setInterval(() => {
				        let times = --this.second
				        this.second = times<10?'0'+times:times //小于10秒补 0
				    }, 1000)
				    setTimeout(() => {
				        clearInterval(interval)
				        this.second=60
				        this.showText = true
				    }, 60000)
				
			},
			
			
			
			updatePwd(){
				
				if(!this.verfcode){
					this.$u.toast("请输入验证码！")
					return
				}
				
				if(!this.newPassword){
					this.$u.toast("请输入密码！")
					return
				}
				
				if(this.newPassword.length<6){
					this.$u.toast("密码必须为6数字！")
					return
				}
				
				
				
		
				uni.showLoading({
					title:'正在加载'
				});
				var reqData={
					captcha:this.verfcode,
					password:this.newPassword
				}
				// console.log("ddd:",reqData)
				
				
				uni.$u.http.post(`/account-api/userInfo/updatePayPassword`, reqData).then(res => {
						   
					   if(res.code==0){
						  uni.showToast({
						  	title: '支付密码设置成功',
						  	icon: 'success'
						  }); 
						  
						  setTimeout(() => {
						  	uni.reLaunch({
						  		url: '/pages3/pages/cash/pack'
						  	});
						  }, 1000);
					   }
					
					
				}).catch(() => {
					this.loading = false;
				});
				
			},
			
			
			
			
			// 11111111111111
			
			doShow(index) {
				if (index === 1){
					this.show1 = !this.show1;
				}else if (index === 2){
					this.show2 = !this.show2;
				}
			},
			close(index, e) {
				if (index === 1){
					this.show1 = false;
				}else if (index === 2){
					this.show2 = false;
				}
			},
			change(index, e) {
				e = e + '';
				if (index === 1){
					if (this.verfcode.length >= 6){
						return;
					}
					this.verfcode = this.verfcode + e;
				}else if (index === 2){
					if (this.newPassword.length >= 6){
						return;
					}
					this.newPassword = this.newPassword + e;
				}
			},
			cancel(index, e) {
				this.close(index, e);
			},
			confirm(index, e) {
				this.close(index, e);
			},
			backspace(index, e) {
				if (index === 1){
					if (this.verfcode.length === 0){
						return;
					}
					this.verfcode = this.verfcode.substring(0, this.verfcode.length - 1);
				}else if (index === 2){
					if (this.newPassword.length === 0){
						return;
					}
					this.newPassword = this.newPassword.substring(0, this.newPassword.length - 1);
				}
			},
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
		
		}
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
</script>

<style lang="scss">
	.wrap {
		min-height: 100vh;
		background: #F5F5F5;
		display: flex;
		flex-direction: column;
		
		.top-content {
			background: #F5F5F5;
			
		
		  .input-code {
			  display: flex;
              flex-direction: row;
			  width: 100%;
			  margin-top: 30rpx;
			  margin-left: 60rpx;
		  }
		
		
		}
		
		
			 
		 
	}
</style>


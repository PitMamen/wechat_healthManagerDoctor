<template>
	<web-view :src="url"></web-view>
</template>

<script>
	export default {
		data() {
			return {
				url: ''
			}
		},
		onLoad(e) {
			var caAuthUrl = uni.getStorageSync('caAuthUrl');
					
				this.updateUrl(caAuthUrl)
				
				let that=this
				uni.$on('caUpdate',function(data){
						console.log('监听到事件来自 update ，携带参数 msg 为：' + data.msg);
						that.updateUrl(data.msg)
					})
				},
				
		methods: {
			updateUrl(caAuthUrl){
				
				if(caAuthUrl.indexOf('pages/ca/pwd-set') > -1){
					//跳转到小程序设置密码页面
					uni.navigateTo({
							url: '/pages2/pages/ca/pwd-set' 
							
						})
				}else if(caAuthUrl.indexOf('pages/work/workshop') > -1){
					//跳转到小程序成功页面
					uni.switchTab({
							url: '/pages/work/workshop' 
							
						})
				}else {
					//重置网页
					var url=	caAuthUrl.replace('https://realnameverify-test','https://realnameverify-test05')
					this.url = decodeURIComponent(url)
				}
				
				
			}
		}
	}
</script>

<style>

</style>

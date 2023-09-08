<template>
	<view class="wrap">
		<view class="rich" v-html="content"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				content: '',
				loginData: {}

			}
		},
		onLoad() {
			this.getProtocol()
		},
		methods: {
			getProtocol() {
				uni.showLoading({
					title: '正在加载'
				});
				const taskItem = uni.getStorageSync('taskItem');
				uni.$u.http.post('/health-api/article/getContract', {
					// hospitalCode: '444885559',//湘雅二
					hospitalCode: '430000009',//雅医互联网医院
					categoryId: 'CP_10003'
				}).then(res => {
					uni.hideLoading();
					this.content = res.data.content || ''
				}).catch(error => {
					uni.hideLoading();
				});
			},

		}
	}
</script>

<style lang="scss" scoped>
	.wrap {
		min-height: 100vh;
		
		
		.rich {
			padding: 30rpx;
		}

	}
</style>
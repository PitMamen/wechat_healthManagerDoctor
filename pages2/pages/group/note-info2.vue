<template>
	<view class="page">
		<view class="web-view" v-html="article.content"></view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			id: null,
			title: '',
			article: {
				content: ''
			}
		}
	},
	
	components: {},
	props: {},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		this.id = options.id;
		this.title = options.title;
		uni.showLoading({
			title:'正在加载'
		});
		uni.$u.http.get(`/health-api/health/patient/articleById?id=${options.id}`).then(res => {
			this.article = res.data || {}
			uni.setNavigationBarTitle({
				title: this.article.title
			});
		}).finally(() => {
			uni.hideLoading();
		});
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady() {},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow() {},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide() {},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload() {},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh() {},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom() {},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage() {},

	methods: {
		sendHandler() {
			const pages = getCurrentPages();
			if (pages.length > 2){
				const page = pages[pages.length - 1 - 1 - 1];
				if (page.route==='pages2/pages/TUI-Chat-Group/chat' || page.route==='pages2/pages/TUI-Chat-Group2/chat'){
					page.$vm.sendCustomMessage({
						detail: {
							payload: {
								data: JSON.stringify({
									content: this.title,
									description: '文章卡',
									id: this.id,
									type: 'CustomArticleMessage'
								}),
								extension: '',
								description: '文章卡'
							}
						}
					});
					uni.navigateBack({
						delta: 2
					});
				}
			}
		},
	}
};
</script>
<style lang="scss">
	.web-view {
		margin-bottom: 200rpx;
	}
	.fix {
		position: fixed;
		left: 50%;
		bottom: 80rpx;
		transform: translateX(-50%);
		width: 702rpx;
		font-size: 30rpx;
		font-weight: 400;
		color: #FFFFFF;
		line-height: 88rpx;
		text-align: center;
		z-index: 1;
		background: #409EFF;
		border-radius: 8rpx;
	}
</style>

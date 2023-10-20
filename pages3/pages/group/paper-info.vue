<template>
	<view class="page">
		<web-view class="web-view" :src="url + '?showsubmitbtn=hide'"></web-view>
		<view class="fix" @click="sendHandler">发送给患者</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			id: null,
			url: '',
			name: '',
			userId: ''
		};
	},

	components: {},
	props: {},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		this.id = options.id;
		this.url = decodeURIComponent(options.url);
		this.name = options.name;
		this.userId = options.userId;
		uni.setNavigationBarTitle({
			title: options.name
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
		sendHandler(item) {
			const paperMsgReq = {
				messageOriginalId: this.id,
				payLoad: JSON.stringify({
					data: JSON.stringify({
						description: '问卷卡',
						id: this.id,
						name: this.name,
						type: 'CustomWenJuanMessage',
						url: this.url,
						userId: this.userId
					}),
					extension: '',
					description: '问卷卡'
				})
			};
			uni.setStorageSync('paperMsgReq', paperMsgReq);
			uni.navigateTo({
				url: '/pages3/pages/record/choose-patient?type=PaperMessage'
			});
		}
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

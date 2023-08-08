<template>
	<view class="tuicall-wrap">
		<tuicallkit ref="TUICallKit"></tuicallkit>
	</view>
</template>

<script>
	import tuicallkit from '../../wxcomponents/TUICallKit/TUICallKit/TUICallKit'
	
	export default {
		data() {
			return {
				type: 2
			}
		},
		components: {
			tuicallkit
		},
		props: {
			info: {
				type: Object,
				default: {}
			},
			second: {
				type: Number,
				default: 10 * 60
			}
		},
		mounted() {
			this.$nextTick(() => {
				try {
					this.$refs.TUICallKit.init({
						sdkAppID: getApp().globalData.SDKAppID,
						userID: getApp().globalData.userInfo.userID,
						userSig: getApp().globalData.userInfo.userSig,
						tim: uni.$TUIKit
					});
				}catch (error){
					console.warn('tuicallkit', error);
				}
			});
		},
		destroyed() {
			this.destroy();
		},
		methods: {
			get() {
				return this.$refs.TUICallKit;
			},
			async call(userID, userData, time) {
				try {
					await this.$refs.TUICallKit.call({
						time,
						userID,
						userData,
						type: this.type
					});
				}catch (error){
					uni.showToast({
						title: '呼叫失败',
						icon: "error"
					});
				}
			},
			async groupCall(groupID, userIDList, userData) {
				try {
					await this.$refs.TUICallKit.groupCall({
						groupID,
						userData,
						userIDList,
						type: this.type
					});
				}catch (error){
					uni.showToast({
						title: '呼叫失败',
						icon: "error"
					});
				}
			},
			setSelfInfo(nickName, avatar) {
				this.$refs.TUICallKit.setSelfInfo(nickName, avatar);
			},
			destroy() {
				this.$refs.TUICallKit.destroyed();
			}
		}
	}
</script>

<style lang="scss" scoped>
</style>
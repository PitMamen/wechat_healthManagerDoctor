<template>
	<view class="wrap">
		<view class="row">
			<view class="left">原始密码</view>
			<view class="right">
				<u--input
					readonly
					v-model="pwd1"
					type="password"
					maxlength="6"
					border="none"
					inputAlign="left"
					placeholder="请输入密码"
				></u--input>
				<u-keyboard
					mode="number"
					tips="请输入6位数字密码"
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
				<view class="mask" @click="doShow(1)"></view>
			</view>
		</view>
		<view class="row">
			<view class="left">设置密码</view>
			<view class="right">
				<u--input
					readonly
					v-model="pwd2"
					type="password"
					maxlength="6"
					border="none"
					inputAlign="left"
					placeholder="请输入密码"
				></u--input>
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
				<view class="mask" @click="doShow(2)"></view>
			</view>
		</view>
		<view class="row">
			<view class="left">确认密码</view>
			<view class="right">
				<u--input
					readonly
					v-model="pwd3"
					type="password"
					maxlength="6"
					border="none"
					inputAlign="left"
					placeholder="请确认密码"
				></u--input>
				<u-keyboard
					mode="number"
					tips="请输入6位数字密码"
					:show="show3"
					:tooltip="true"
					:showTips="true"
					:showCancel="true"
					:showConfirm="true"
					:dotDisabled="true"
					@close="close(3, $event)"
					@change="change(3, $event)"
					@cancel="cancel(3, $event)"
					@confirm="confirm(3, $event)"
					@backspace="backspace(3, $event)"
				></u-keyboard>
				<view class="mask" @click="doShow(3)"></view>
			</view>
		</view>
		<view class="bottom">
			<view class="btn" @click="submit()">确认</view>
		</view>
		
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pwd1: '',
				pwd2: '',
				pwd3: '',
				show1: false,
				show2: false,
				show3: false
			}
		},
		computed: {
		},
		components: {
		},
		onLoad(options) {
		},
		onReady() {
		},
		onShow() {
		},
		methods: {
			doShow(index) {
				if (index === 1){
					this.show1 = !this.show1;
				}else if (index === 2){
					this.show2 = !this.show2;
				}else if (index === 3){
					this.show3 = !this.show3;
				}
			},
			close(index, e) {
				if (index === 1){
					this.show1 = false;
				}else if (index === 2){
					this.show2 = false;
				}else if (index === 3){
					this.show3 = false;
				}
			},
			change(index, e) {
				e = e + '';
				if (index === 1){
					if (this.pwd1.length >= 6){
						return;
					}
					this.pwd1 = this.pwd1 + e;
				}else if (index === 2){
					if (this.pwd2.length >= 6){
						return;
					}
					this.pwd2 = this.pwd2 + e;
				}else if (index === 3){
					if (this.pwd3.length >= 6){
						return;
					}
					this.pwd3 = this.pwd3 + e;
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
					if (this.pwd1.length === 0){
						return;
					}
					this.pwd1 = this.pwd1.substring(0, this.pwd1.length - 1);
				}else if (index === 2){
					if (this.pwd2.length === 0){
						return;
					}
					this.pwd2 = this.pwd2.substring(0, this.pwd2.length - 1);
				}else if (index === 3){
					if (this.pwd3.length === 0){
						return;
					}
					this.pwd3 = this.pwd3.substring(0, this.pwd3.length - 1);
				}
			},
			submit() {
				if (this.pwd1.length !== 6){
					uni.showToast({
						title: '请输入6位数字密码',
						icon: 'none'
					});
					return;
				}
				if (this.pwd2.length !== 6){
					uni.showToast({
						title: '请输入6位数字密码',
						icon: 'none'
					});
					return;
				}
				if (this.pwd3.length !== 6){
					uni.showToast({
						title: '请输入6位数字密码',
						icon: 'none'
					});
					return;
				}
				if (this.pwd2 !== this.pwd3){
					uni.showToast({
						title: '两次密码输入不一致',
						icon: 'none'
					});
					return;
				}
				uni.showLoading({
					title:'正在加载'
				});
				uni.$u.http.post('/account-api/tdUserInfoCaAuthApplet/resetPasswordForUserId', {
					oldPassword: this.pwd1,
					password: this.pwd2
				}).then(res => {
					uni.hideLoading();
					uni.showToast({
						title: '保存成功',
						icon: 'success'
					});
					setTimeout(() => {
						uni.navigateBack({
							delta: 1
						});
					}, 1000);
				}).catch(err => {
					uni.hideLoading();
				});
			}
		}
	}
</script>

<style lang="scss">
	.wrap {
		min-height: 100vh;
		background: #F5F5F5;
		.row {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 32rpx 25rpx;
			background: #FFFFFF;
			border-bottom: 1rpx solid #F5F5F5;
			&:last-child {
				border-bottom: 1rpx solid #FFFFFF;
			}
			.left {
				font-size: 30rpx;
				font-weight: 400;
				color: #4D4D4D;
				line-height: 46rpx;
			}
			.right {
				flex: 1;
				position: relative;
				padding-left: 30rpx;
				.mask {
					position: absolute;
					top: 0;
					bottom: 0;
					left: 0;
					right: 0;
					z-index: 1;
				}
				.u-input {
					font-size: 30rpx;
					font-weight: 400;
					color: #999999;
					line-height: 46rpx;
				}
			}
		}
		.bottom {
			margin-top: 168rpx;
			padding: 0 24rpx;
			.btn {
				font-size: 30rpx;
				font-weight: 400;
				color: #FFFFFF;
				line-height: 68rpx;
				text-align: center;
				background: #409EFF;
				border-radius: 8rpx;
			}
		}
	}
</style>

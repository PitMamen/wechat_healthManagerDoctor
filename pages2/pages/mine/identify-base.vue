<template>
	<view class="content">

		<view style="width: 100vw;height: 20rpx;background-color: #F2F2F2;"></view>

		<view class="view-base">
			<view style="color: #1A1A1A;font-size: 32rpx;font-weight: bold;margin-left: 24rpx;">请填写真实个人信息，完成实名认证</view>
			<view
				style="display: flex;flex-direction: row;margin-top: 20rpx;margin-left: 24rpx;background-color: white;">
				<image src="../../static/static/images/icon_dunpai.png" style="width: 28rpx;height: 28rpx;">
				</image>
				<view style="color: #999;font-size: 24rpx;margin-left: 3rpx;">平台严格保障您的信息安全，请放心填写</view>
			</view>

			<view class="info-item">
				<view class="info-item-content">
					<view style="flex: 1;display: flex;flex-direction: row;">
						<view style="color: #1A1A1A;font-size: 32rpx;">姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名
						</view>
						<view style="color: red;padding-top: 5rpx;">*</view>
						<view style="margin-left: 30rpx;">
							<u-input class="input" fontSize="28rpx" placeholder="请输入真实姓名" border="none"
								v-model="baseData.name" />
						</view>


					</view>

				</view>
			</view>
			<view class="info-item">
				<view class="info-item-content">
					<view style="flex: 1;display: flex;flex-direction: row;">
						<view style="color: #1A1A1A;font-size: 32rpx;">身份证号</view>
						<view style="color: red;padding-top: 5rpx;">*</view>
						<view style="margin-left: 30rpx;">
							<u-input class="input" fontSize="28rpx" placeholder="请输入身份证号" border="none"
								v-model="baseData.idNo" />
						</view>
					</view>
					<!-- 	<u-icon name="arrow-right" color="#333"
						style="width: 10rpx;height: 10rpx;float: right;margin-right: 10rpx;margin-top: 6.5rpx;"></u-icon> -->
				</view>
			</view>
			<view class="info-item">
				<view class="info-item-content">
					<view style="flex: 1;display: flex;flex-direction: row;">
						<view style="color: #1A1A1A;font-size: 32rpx;">手&nbsp;&nbsp;机&nbsp;&nbsp;号</view>
						<view style="color: red;padding-top: 5rpx;">*</view>
						<view style="margin-left: 30rpx;">
							<u-input class="input" fontSize="28rpx" type="number" placeholder="请输入手机号" border="none"
								v-model="baseData.phone" />
						</view>
					</view>
				</view>
			</view>

			<view class="info-item">
				<view class="info-item-content">
					<view style="flex: 1;display: flex;flex-direction: row;">
						<view style="color: #1A1A1A;font-size: 32rpx;">校&nbsp;&nbsp;验&nbsp;&nbsp;码</view>
						<view style="color: red;padding-top: 5rpx;">*</view>
						<view style="margin-left: 30rpx;">
							<u-input class="input" fontSize="28rpx" type="number" placeholder="请输入校验码" border="none"
								v-model="baseData.phone" />
						</view>
					</view>

					<view
						style="color: white;background-color: #3894FF;padding: 10rpx 15rpx;font-size: 28rpx;border-radius: 6rpx;">
						获取校验码
					</view>
				</view>
			</view>

			<view class="info-item">
				<view class="info-item-content">
					<view style="flex: 1;display: flex;flex-direction: row;" @click="goChooseHospital">
						<view style="color: #1A1A1A;font-size: 32rpx;">所在医院</view>
						<view style="color: red;padding-top: 5rpx;">*</view>
						<view style="margin-left: 30rpx;color: #999;font-size: 28rpx;padding-top: 5rpx;"
							v-if="!hospitalName">请选择</view>
						<view style="margin-left: 30rpx;font-size: 28rpx;padding-top: 5rpx;" v-else>
							{{ hospitalName || '~' }}
						</view>
					</view>

					<u-icon name="arrow-right" color="#333"
						style="width: 10rpx;height: 10rpx;float: right;margin-right: 10rpx;margin-top: 6.5rpx;"></u-icon>

				</view>
			</view>


			<view class="info-item">
				<view class="info-item-content">
					<view style="flex: 1;display: flex;flex-direction: row;"
						@click="showChooseHospital = true; hideKeyboard();">
						<view style="color: #1A1A1A;font-size: 32rpx;">科&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;室
						</view>
						<view style="color: red;padding-top: 5rpx;">*</view>
						<view style="margin-left: 30rpx;color: #999;font-size: 28rpx;padding-top: 5rpx;"
							v-if="!hospitalName">请选择</view>
						<view style="margin-left: 30rpx;font-size: 28rpx;padding-top: 5rpx;" v-else>
							{{ hospitalName || '~' }}
						</view>
					</view>

					<u-icon name="arrow-right" color="#333"
						style="width: 10rpx;height: 10rpx;float: right;margin-right: 10rpx;margin-top: 6.5rpx;"></u-icon>

				</view>
			</view>

			<view class="info-item">
				<view class="info-item-content">
					<view style="flex: 1;display: flex;flex-direction: row;"
						@click="showChooseHospital = true; hideKeyboard();">
						<view style="color: #1A1A1A;font-size: 32rpx;">职&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;称
						</view>
						<view style="color: red;padding-top: 5rpx;">*</view>
						<view style="margin-left: 30rpx;color: #999;font-size: 28rpx;padding-top: 5rpx;"
							v-if="!hospitalName">请选择</view>
						<view style="margin-left: 30rpx;font-size: 28rpx;padding-top: 5rpx;" v-else>
							{{ hospitalName || '~' }}
						</view>
					</view>

					<u-icon name="arrow-right" color="#333"
						style="width: 10rpx;height: 10rpx;float: right;margin-right: 10rpx;margin-top: 6.5rpx;"></u-icon>

				</view>
			</view>

			<view style="color: #999;font-size: 24rpx;margin: 30rpx 24rpx;">依据相关法律规定，医疗机构应当对开展互联网诊疗活动对医务人员进行实名认证。</view>

			<!-- 底部按钮 下一步按钮-->
			<view
				style="width: 100vw;display: flex;flex-direction: row;align-items: center;justify-content: center;margin-top: 50rpx;">
				<view @click="goNext"
					style="color: white;background-color: #3894FF;width: 90vw;padding: 20rpx 0;border-radius: 8rpx;text-align: center;font-size: 30rpx;">
					下一步</view>
			</view>

		</view>

		<!-- 选择器，参看yp-edit.vue -->
		<u-picker :show="showChooseHospital" :columns="columnsHospital" @cancel="cancelHospital"
			@confirm="confirmHospital" keyName="text"></u-picker>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				account: '',
				baseData: {
					name: '',
					idNo: '',
					phone: '123',
				},
				hospitalName: '',
				showChooseHospital: false,
				columnsHospital: [
					[{
						text: '湘雅二',
						value: 1
					}, {
						text: '中医附一',
						value: 2
					}]
				]
			}
		},
		onLoad(option) {
			this.account = uni.getStorageSync('account');
			console.log('option', option)
		},
		methods: {
			hideKeyboard() {
				uni.hideKeyboard();
			},

			goBack() {
				uni.navigateBack({
					delta: 1
				});
			},

			cancelHospital() {
				console.log('cancelHospital')
				this.showChooseHospital = false;
			},
			confirmHospital(e) {
				console.log('confirmHospital', e.value)
				this.cancelHospital();
				this.hospitalName = e.value[0].text
				// this.$set(this.item, 'useFrequencyName', e.value[0].id);
			},

			goNext() {
				uni.navigateTo({
					url: '/pages2/pages/mine/identify-detail'
				})
			},

			goChooseHospital() {
				uni.navigateTo({
					url: '/pages2/pages/mine/search-hospital'
				})
			},

			formatDateFull(date) {
				date = new Date(date)
				let myyear = date.getFullYear()
				let mymonth = date.getMonth() + 1
				let myweekday = date.getDate()
				let oHour = date.getHours()
				let oMin = date.getMinutes()
				let oSen = date.getSeconds()
				mymonth < 10 ? (mymonth = '0' + mymonth) : mymonth
				myweekday < 10 ? (myweekday = '0' + myweekday) : myweekday
				oHour < 10 ? (oHour = '0' + oHour) : oHour
				oMin < 10 ? (oMin = '0' + oMin) : oMin
				oSen < 10 ? (oSen = '0' + oSen) : oSen
				return `${myyear}-${mymonth}-${myweekday} ${oHour}:${oMin}:${oSen}`
			},

		}
	}
</script>

<style lang="scss">
	.content {
		background-color: white;
		min-height: 100vh;
		overflow: hidden;
		display: flex;
		background-color: white;
		align-items: center;
		flex-direction: column;

		.view-base {
			width: 100vw;
			display: flex;
			flex-direction: column;
			padding: 30rpx 24rpx;

			.info-item {
				padding: 35rpx 0;
				margin: 0 24rpx;
				border-bottom: 1rpx solid #E6E6E6;

				.info-item-content {
					display: flex;
					flex-direction: row;
					align-items: center;

					.input {
						font-size: 28rpx;
						margin-left: 30rpx;
						font-family: PingFang SC;
						font-weight: 400;
						color: rgba(62, 74, 89, 0.45);
						line-height: 36rpx;
					}
				}
			}
		}
	}
</style>
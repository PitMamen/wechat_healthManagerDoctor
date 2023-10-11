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
					<view style="flex: 1;display: flex;flex-direction: row;" @click="goChooseType">
						<view style="color: #1A1A1A;font-size: 32rpx;width: 135rpx;">
							类&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;型
						</view>
						<view style="color: red;padding-top: 5rpx;">*</view>
						<view style="margin-left: 30rpx;color: #999;font-size: 28rpx;padding-top: 5rpx;"
							v-if="!professionalTitle">请选择</view>
						<view style="margin-left: 30rpx;font-size: 28rpx;padding-top: 5rpx;" v-else>
							{{ professionalTitle || '~' }}
						</view>
					</view>
			
					<u-icon name="arrow-right" color="#333"
						style="width: 10rpx;height: 10rpx;float: right;margin-right: 10rpx;margin-top: 6.5rpx;"></u-icon>
			
				</view>
			</view>

			<view class="info-item">
				<view class="info-item-content">
					<view style="flex: 1;display: flex;flex-direction: row;">
						<view style="color: #1A1A1A;font-size: 32rpx;width: 135rpx;">
							姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名
						</view>
						<view style="color: red;padding-top: 5rpx;">*</view>
						<view style="margin-left: 30rpx;">
							<u-input :disabled="!canModify" class="input" fontSize="28rpx" placeholder="请输入真实姓名"
								border="none" v-model="baseData.userName" />
						</view>


					</view>

				</view>
			</view>
			<view class="info-item">
				<view class="info-item-content">
					<view style="flex: 1;display: flex;flex-direction: row;">
						<view style="color: #1A1A1A;font-size: 32rpx;width: 135rpx;">身份证号</view>
						<view style="color: red;padding-top: 5rpx;">*</view>
						<view style="margin-left: 30rpx;">
							<u--input :disabled="!canModify" class="input" fontSize="28rpx" placeholder="请输入身份证号"
								border="none" v-model="baseData.identificationNo" />
							<!-- 	<u--input v-model="baseData.identificationNo" class="input" type="number"
								placeholder="请输入身份证号" color="#409EFF" fontSize="28rpx" border="none"
								inputAlign="center"></u--input> -->
						</view>
					</view>
					<!-- 	<u-icon name="arrow-right" color="#333"
						style="width: 10rpx;height: 10rpx;float: right;margin-right: 10rpx;margin-top: 6.5rpx;"></u-icon> -->
				</view>
			</view>
			<view class="info-item">
				<view class="info-item-content">
					<view style="flex: 1;display: flex;flex-direction: row;">
						<view style="color: #1A1A1A;font-size: 32rpx;width: 135rpx;">手&nbsp;&nbsp;机&nbsp;&nbsp;号</view>
						<view style="color: red;padding-top: 5rpx;">*</view>
						<view style="margin-left: 30rpx;">
							<u-input class="input" @input="onlyNumber" fontSize="28rpx" type="number"
								placeholder="请输入手机号" border="none" v-model="baseData.phone" @blur="onPhoneBlur" />
						</view>
					</view>
				</view>
			</view>

			<view class="info-item" v-if="needShowGetCode">
				<view class="info-item-content">
					<view style="flex: 1;display: flex;flex-direction: row;">
						<view style="color: #1A1A1A;font-size: 32rpx;width: 135rpx;">校&nbsp;&nbsp;验&nbsp;&nbsp;码</view>
						<view style="color: red;padding-top: 5rpx;">*</view>
						<view style="margin-left: 30rpx;">
							<u-input class="input" fontSize="28rpx" type="number" placeholder="请输入校验码" border="none"
								v-model="baseData.captcha" />
						</view>
					</view>

					<view @click="getAuthCode" v-if="isShow"
						style="color: white;background-color: #3894FF;padding: 10rpx 15rpx;font-size: 28rpx;border-radius: 6rpx;">
						获取校验码
					</view>
					<view v-if="!isShow" style="color: #999999;;padding: 10rpx 15rpx;font-size: 28rpx;">
						{{countSecond}}s后重新获取
					</view>
				</view>
			</view>

			<view class="info-item">
				<view class="info-item-content">
					<view style="flex: 1;display: flex;flex-direction: row;" @click="goChooseHospital">
						<view style="color: #1A1A1A;font-size: 32rpx;width: 135rpx;">所在医院</view>
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
					<view style="flex: 1;display: flex;flex-direction: row;" @click="goChooseDept">
						<view style="color: #1A1A1A;font-size: 32rpx;width: 135rpx;">
							科&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;室
						</view>
						<view style="color: red;padding-top: 5rpx;">*</view>
						<view style="margin-left: 30rpx;color: #999;font-size: 28rpx;padding-top: 5rpx;"
							v-if="!deptName">请选择</view>
						<view style="margin-left: 30rpx;font-size: 28rpx;padding-top: 5rpx;" v-else>
							{{ deptName || '~' }}
						</view>
					</view>

					<u-icon name="arrow-right" color="#333"
						style="width: 10rpx;height: 10rpx;float: right;margin-right: 10rpx;margin-top: 6.5rpx;"></u-icon>

				</view>
			</view>

			<view class="info-item">
				<view class="info-item-content">
					<view style="flex: 1;display: flex;flex-direction: row;" @click="goChoosePro">
						<view style="color: #1A1A1A;font-size: 32rpx;width: 135rpx;">
							职&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;称
						</view>
						<view style="color: red;padding-top: 5rpx;">*</view>
						<view style="margin-left: 30rpx;color: #999;font-size: 28rpx;padding-top: 5rpx;"
							v-if="!professionalTitle">请选择</view>
						<view style="margin-left: 30rpx;font-size: 28rpx;padding-top: 5rpx;" v-else>
							{{ professionalTitle || '~' }}
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
		<u-picker :show="showChooseDept" :columns="columnsDept" @cancel="cancelDept" @confirm="confirmDept"
			keyName="departmentName"></u-picker>

		<u-picker :show="showChoosePro" :columns="columnsPro" @cancel="cancelPro" @confirm="confirmPro"
			keyName="value"></u-picker>
			
		<u-picker :show="showChooseType" :columns="columnsPro" @cancel="cancelPro" @confirm="confirmPro"
			keyName="value"></u-picker>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				account: '',
				baseData: {
					appId: "",
					captcha: "", //验证码
					departmentId: 0,
					hospitalCode: "",
					identificationNo: "",
					phone: "",
					professionalTitle: "",
					userName: ""
				},
				modifyData: undefined,
				hospitalItem: undefined,
				chooseHospital: undefined,
				hospitalName: '',
				deptItem: undefined,
				deptName: '',
				profItem: undefined,
				professionalTitle: '',
				canModify: true,
				isShow: true, //是否已经点击了获取验证码 false为点击了，true为倒计时结束
				needShowGetCode: false, //是否显示获取验证码整行布局
				countSecond: 60,
				timer: null,
				showChooseDept: false,
				showChoosePro: false,
				showChooseType: false,
				columnsDept: [
					[]
				],
				columnsPro: [
					[]
				],
			}
		},
		onLoad(option) {
			this.account = uni.getStorageSync('account');
			uni.removeStorageSync('choose_hospital');
			console.log('this.account', this.account)
			//如果没有手机号，直接显示获取验证码

			this.getIdentifyInfo()
		},
		onShow() {
			//这里要判空赋值，不然赋值空会报错
			this.chooseHospital = uni.getStorageSync('choose_hospital');
			if (this.chooseHospital) {
				this.hospitalItem = JSON.parse(JSON.stringify(this.chooseHospital))
			}
			console.log('onShow hospitalItem', this.hospitalItem)
			if (this.hospitalItem) {
				this.hospitalName = this.hospitalItem.hospitalName
			}
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

			/**
			 * 失去焦点时，判断是否显示验证码
			 */
			onPhoneBlur() {
				// //没有输入手机号需要展示验证码；输入了且没有绑定过手机号需要展示验证码； 原来有电话，失焦的时候不等于原来的电话；原来有已提交过的电话，失焦的时候不等于已提交过的电话
				// if (!this.baseData.phone || (!this.account.phone && this.baseData.phone) || (this.account.phone && this
				// 		.baseData.phone != this.account.phone) || (this.modifyData && this.baseData.phone != this.modifyData.phone)) {
				// 	this.needShowGetCode = true
				// } else {
				// 	this.needShowGetCode = false
				// }

				//没有输入手机号需要展示验证码；输入了且没有绑定过手机号需要展示验证码； 原来有电话，失焦的时候不等于原来的电话；原来有已提交过的电话，失焦的时候不等于已提交过的电话
				if (!this.baseData.phone || (this.modifyData && this.baseData.phone != this.modifyData.phone)) {
					this.needShowGetCode = true
				} else {
					this.needShowGetCode = false
				}
			},

			onlyNumber() {

			},

			getIdentifyInfo() {
				uni.showLoading({
					title: '正在加载'
				});
				uni.$u.http.get('/account-api/accountInfo/getDoctorAuthInfo', {
					params: {}
				}).then(res => {
					if (res.code == 0) {
						let baseInfo = res.data
						this.modifyData = JSON.parse(JSON.stringify(baseInfo)) //modifyData有值，说明之前提交过数据需要填充
						if (baseInfo.userName) { //填过实名认证信息，需要填充数据
							this.canModify = false
							this.baseData = JSON.parse(JSON.stringify(baseInfo))
							//填充数据
							this.hospitalItem = {
								hospitalCode: baseInfo.hospitalCode,
								hospitalName: baseInfo.hospitalName
							}
							console.log('getIdentifyInfo', JSON.stringify(this.hospitalItem))
							this.hospitalName = baseInfo.hospitalName

							this.deptItem = {
								departmentId: baseInfo.departmentId,
								departmentName: baseInfo.departmentName
							}
							this.deptName = baseInfo.departmentName

							this.profItem = {
								value: baseInfo.professionalTitle
							}

							this.professionalTitle = this.profItem.value

						} else { //新增的实名认证信息情况，直接取baseInfo的phone
							if (!baseInfo.phone) {
								this.needShowGetCode = true
							} else {
								this.baseData.phone = baseInfo.phone //新用户可能没有创建用户
							}
						}
						this.getProf()

					} else {
						this.$u.toast(res.message)
					}

				}).finally(() => {
					uni.hideLoading({
						noConflict: true
					})
				});

			},

			getAuthCode() {
				uni.showLoading({
					title: '正在加载'
				});
				uni.$u.http.get('/account-api/captcha/sms', {
					params: {
						phone: this.baseData.phone
					}
				}).then(res => {
					if (res.code == 0) {
						this.$u.toast("获取成功！")
						this.isShow = false
						this.startCount()
					} else {
						this.$u.toast(res.message)
					}

				}).finally(() => {
					// uni.hideLoading();
					uni.hideLoading({ //toast 官方文档说明是因为 toast 和 loading 相关接口可以相互混用，为了避免互相干扰，可以使用noConflict进行控制
						noConflict: true
					})
				});

			},

			getProf() {

				uni.$u.http.get('/account-api/accountDict/professionalTitles', {
					params: {
						type: 2
					}
				}).then(res => {
					if (res.code == 0) {

						this.columnsPro = [res.data]
					} else {
						this.$u.toast(res.message)
					}

				}).finally(() => {

				});

			},

			goChooseDept() {
				if (!this.hospitalItem) {
					this.$u.toast("请先选择所在医院！")
					return
				}

				uni.showLoading({
					title: '正在加载'
				});
				uni.$u.http.post('/info-api/departments/getDeptListByType', {
					hospitalCode: this.hospitalItem.hospitalCode,
					type: 1
				}).then(res => {
					if (res.code == 0) {

						this.columnsDept = [res.data];
						console.log('columnsDept', JSON.stringify(this.columnsDept))
						// this.columnsDept = res.data
						this.showChooseDept = true;
						this.hideKeyboard();
					} else {
						this.$u.toast(res.message)
					}

				}).finally(() => {
					uni.hideLoading({
						noConflict: true
					})
				});


			},
			goChoosePro() {
				this.showChoosePro = true;
				this.hideKeyboard();
			},
			goChooseType() {
				this.showChooseType = true;
				this.hideKeyboard();
			},

			startCount() {
				const TIME_COUNT = 60;
				if (!this.timer) {
					this.countSecond = TIME_COUNT;
					this.isShow = false;
					this.timer = setInterval(() => {
						if (this.countSecond > 0 && this.countSecond <= TIME_COUNT) {
							this.countSecond--;
						} else {
							this.isShow = true;
							clearInterval(this.timer);
							this.timer = null;
						}
					}, 1000)
				}
			},

			cancelDept() {
				console.log('cancelDept')
				this.showChooseDept = false;
			},
			//departmentId: 2350054
			// departmentName: "心血管科"
			confirmDept(e) {
				console.log('confirmDept', e.value)
				this.deptItem = e.value[0]
				this.cancelDept();
				this.deptName = this.deptItem.departmentName
				// this.$set(this.item, 'useFrequencyName', e.value[0].id);
			},

			cancelPro() {
				console.log('cancelPro')
				this.showChoosePro = false;
			},

			// {
			//    "value": "正主任医生",
			//    "description": "正主任医生"
			//  }
			confirmPro(e) {
				console.log('confirmPro', e.value)
				this.profItem = e.value[0]
				this.cancelPro();
				this.professionalTitle = this.profItem.value
				// this.$set(this.item, 'useFrequencyName', e.value[0].id);
			},

			goNext() {
				if (!this.baseData.userName) {
					this.$u.toast("请输入真实姓名！")
					return
				}
				if (!this.baseData.identificationNo) {
					this.$u.toast("请输入身份证号！")
					return
				}
				if (!this.baseData.phone) {
					this.$u.toast("请输入手机号！")
					return
				}
				if (!this.baseData.captcha && this.needShowGetCode) {
					this.$u.toast("请输入验证码！")
					return
				}
				if (!this.hospitalItem) {
					this.$u.toast("请选择所在医院！")
					return
				}
				if (!this.deptItem) {
					this.$u.toast("请选择科室！")
					return
				}
				if (!this.profItem) {
					this.$u.toast("请选择职称！")
					return
				}

				// {
				// 	"tenantId": "902",
				// 	"hospitalCode": "992",
				// 	"hospitalName": "一块糍粑租户下的机构",
				// 	"hospitalLevelName": "一级甲等",
				// 	"imgUrl": ""
				// }
				let that = this
				let param = JSON.parse(JSON.stringify(this.baseData))
				this.$set(param, 'hospitalCode', this.hospitalItem.hospitalCode)
				this.$set(param, 'departmentId', this.deptItem.departmentId)
				this.$set(param, 'professionalTitle', this.profItem.value)
				this.$set(param, 'appId', uni.getAccountInfoSync().miniProgram.appId)
				console.log('param', JSON.stringify(param))
				uni.showLoading({
					title: '正在加载'
				});
				uni.$u.http.post('/account-api/accountInfo/submitDoctorBaseInfo', param).then(res => {
					if (res.code == 0) {
						that.$u.toast("操作成功！")
						uni.navigateTo({
							url: '/pages2/pages/mine/identify-detail'
						})
					} else {
						that.$u.toast(res.message)
					}

				}).finally(() => {
					uni.hideLoading({
						noConflict: true
					})
				});

			},

			goChooseHospital() {
				uni.navigateTo({
					url: '/pages2/pages/mine/search-hospital'
				})
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
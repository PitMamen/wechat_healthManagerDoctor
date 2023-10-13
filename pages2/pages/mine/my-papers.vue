<template>
	<view class="content">

		<!-- <view style="width: 100vw;height: 20rpx;background-color: #F2F2F2;"></view> -->



		<view class="view-base">

			<view v-if="auditStatus == 2 && watchNo == '1'"
				style="background-color: #F2F2F2;display: flex;flex-direction: row;padding: 22rpx;30rpx">
				<image src="../../static/img/icon_pass.png" style="width:32rpx;height: 32rpx;" mode="aspectFit">
				</image>
				<view style="color: #1cbb3e;font-size: 28rpx;margin-left: 20rpx;">您提交的证件信息平台已经审核通过，已经为您更新证件信息。</view>
			</view>

			<view v-if="auditStatus == 1"
				style="background-color: #F2F2F2;display: flex;flex-direction: row;padding: 22rpx;30rpx">
				<image src="../../static/img/icon_progress.png" style="width:32rpx;height: 32rpx;" mode="aspectFit">
				</image>
				<view style="color: #3894FF;font-size: 28rpx;margin-left: 20rpx;">您提交的证件信息平台正在审核，预计需要7-14个工作日审核完成。
				</view>
			</view>

			<view v-if="auditStatus == 3 "
				style="background-color: #F2F2F2;display: flex;flex-direction: row;padding: 22rpx;30rpx">
				<image src="../../static/img/icon_fail.png" style="width:32rpx;height: 32rpx;" mode="aspectFit">
				</image>
				<view style="color: red;font-size: 28rpx;margin-left: 20rpx;">
					您提交的证件信息经平台审核为不通过，不通过原因：{{failReason||'暂无'}}。请重新提交。
				</view>
			</view>


			<!-- 身份证 -->
			<view style="display: flex;flex-direction: row;margin-left: 24rpx;margin-top: 30rpx;">
				<view style="color: #4D4D4D;font-size: 30rpx;">身份证</view>
			</view>

			<view style="display: flex;flex-direction: row;align-items: center;margin-left: 24rpx;margin-top: 20rpx;">
				<view style="display: flex;flex-direction: column;align-items: center;justify-content: center;">
					<!-- <u-upload width='150' height='110' :fileList="fileList2" @afterRead="afterRead" :deletable="false" -->
					<u-upload width='150' height='110' :fileList="fileList2" @afterRead="afterRead" :deletable="false"
						@delete="deletePic" :maxCount="1" name="2">
						<view
							style="display: flex;flex-direction: column;justify-content: center;align-items: center;border: 1rpx dashed #999999;width: 180rpx;height: 180rpx;">
							<view>
								<u-icon name="plus" size="28"></u-icon>
							</view>
							<view style="color: #999999;font-size: 30rpx;margin-top: 36rpx;">上传头像面</view>
						</view>
					</u-upload>

				</view>


				<view
					style="margin-left: 40rpx;display: flex;flex-direction: column;align-items: center;justify-content: center;">
					<u-upload width='150' height='110' :fileList="fileList3" @afterRead="afterRead" :deletable="false"
						@delete="deletePic" :maxCount="1" name="3">
						<view
							style="display: flex;flex-direction: column;justify-content: center;align-items: center;border: 1rpx dashed #999999;width: 180rpx;height: 180rpx;">
							<view>
								<u-icon name="plus" size="28"></u-icon>
							</view>
							<view style="color: #999999;font-size: 30rpx;margin-top: 36rpx;">上传国徽面</view>
						</view>
					</u-upload>

				</view>
			</view>


			<!-- 分割线 -->
			<view style="width: 100vw;height: 20rpx;background-color: #F2F2F2;margin-top: 30rpx;"></view>

			<!-- 职称证 -->
			<view v-if="account.roleName=='doctor'"
				style="display: flex;flex-direction: row;margin-left: 24rpx;margin-top: 30rpx;">
				<view style="color: #4D4D4D;font-size: 30rpx;">职称证</view>
			</view>

			<view v-if="account.roleName=='doctor'"
				style="display: flex;flex-direction: row;align-items: center;margin-left: 24rpx;margin-top: 20rpx;">
				<view style="display: flex;flex-direction: column;align-items: center;justify-content: center;">
					<u-upload width='130' height='180' :fileList="fileList4" @afterRead="afterRead" :deletable="false"
						@delete="deletePic" :maxCount="1" name="4">
						<view
							style="display: flex;flex-direction: column;justify-content: center;align-items: center;border: 1rpx dashed #999999;width: 180rpx;height: 180rpx;">
							<view>
								<u-icon name="plus" size="28"></u-icon>
							</view>
							<view style="color: #999999;font-size: 30rpx;margin-top: 36rpx;">上传</view>
						</view>
					</u-upload>

				</view>
			</view>

			<!-- 分割线 -->
			<view v-if="account.roleName=='doctor'"
				style="width: 100vw;height: 20rpx;background-color: #F2F2F2;margin-top: 30rpx;"></view>

			<!-- 资格证 -->
			<view style="display: flex;flex-direction: row;margin-left: 24rpx;margin-top: 30rpx;">
				<view style="color: #4D4D4D;font-size: 30rpx;">资格证</view>
			</view>

			<view style="display: flex;flex-direction: row;align-items: center;margin-left: 24rpx;margin-top: 20rpx;">
				<view style="display: flex;flex-direction: column;align-items: center;justify-content: center;">
					<u-upload width='150' height='110' :fileList="fileList5" @afterRead="afterRead" :deletable="false"
						@delete="deletePic" :maxCount="1" name="5">
						<view
							style="display: flex;flex-direction: column;justify-content: center;align-items: center;border: 1rpx dashed #999999;width: 180rpx;height: 180rpx;">
							<view>
								<u-icon name="plus" size="28"></u-icon>
							</view>
							<view style="color: #999999;font-size: 30rpx;margin-top: 36rpx;">上传正面</view>
						</view>
					</u-upload>

				</view>


				<view
					style="margin-left: 40rpx;display: flex;flex-direction: column;align-items: center;justify-content: center;">
					<u-upload width='150' height='110' :fileList="fileList6" @afterRead="afterRead" :deletable="false"
						@delete="deletePic" :maxCount="1" name="6">
						<view
							style="display: flex;flex-direction: column;justify-content: center;align-items: center;border: 1rpx dashed #999999;width: 180rpx;height: 180rpx;">
							<view>
								<u-icon name="plus" size="28"></u-icon>
							</view>
							<view style="color: #999999;font-size: 30rpx;margin-top: 36rpx;">上传反面</view>
						</view>
					</u-upload>

				</view>
			</view>


			<!-- 分割线 -->
			<view style="width: 100vw;height: 20rpx;background-color: #F2F2F2;margin-top: 30rpx;"></view>

			<!-- 资格证 -->
			<view v-if="account.roleName=='doctor'|| account.roleName=='nurse'"
				style="display: flex;flex-direction: row;margin-left: 24rpx;margin-top: 30rpx;">
				<view style="color: #4D4D4D;font-size: 30rpx;">执业证</view>
			</view>

			<view v-if="account.roleName=='doctor'|| account.roleName=='nurse'"
				style="display: flex;flex-direction: row;align-items: center;margin-left: 24rpx;margin-top: 20rpx;">
				<view style="display: flex;flex-direction: column;align-items: center;justify-content: center;">
					<u-upload width='150' height='110' :fileList="fileList7" @afterRead="afterRead" :deletable="false"
						@delete="deletePic" :maxCount="1" name="7">
						<view
							style="display: flex;flex-direction: column;justify-content: center;align-items: center;border: 1rpx dashed #999999;width: 180rpx;height: 180rpx;">
							<view>
								<u-icon name="plus" size="28"></u-icon>
							</view>
							<view style="color: #999999;font-size: 30rpx;margin-top: 36rpx;">上传正面</view>
						</view>
					</u-upload>

				</view>


				<view
					style="margin-left: 40rpx;display: flex;flex-direction: column;align-items: center;justify-content: center;">
					<u-upload width='150' height='110' :fileList="fileList8" @afterRead="afterRead" :deletable="false"
						@delete="deletePic" :maxCount="1" name="8">
						<view
							style="display: flex;flex-direction: column;justify-content: center;align-items: center;border: 1rpx dashed #999999;width: 180rpx;height: 180rpx;">
							<view>
								<u-icon name="plus" size="28"></u-icon>
							</view>
							<view style="color: #999999;font-size: 30rpx;margin-top: 36rpx;">上传反面</view>
						</view>
					</u-upload>

				</view>
			</view>

			<!-- 底部按钮 下一步按钮-->
			<view v-if="auditStatus!= 1"
				style="width: 100vw;display: flex;flex-direction: row;align-items: center;justify-content: center;margin-top: 60rpx;">
				<view @click="goNext"
					style="color: white;background-color: #3894FF;width: 90vw;padding: 20rpx 0;border-radius: 8rpx;text-align: center;font-size: 30rpx;">
					更新证件</view>
			</view>

			<view style="height: 30rpx;"></view>

		</view>


	</view>
</template>

<script>
	import {
		baseURL
	} from '@/config/config';
	export default {
		components: {
			// config
		},
		data() {
			return {
				title: '',
				content: '',
				auditStatus: '',
				watchNo: '1', //审核通过仅显示一次,用两次字符串不一样区分
				failReason: '',
				account: '',
				baseData: {
					name: '',
					idNo: '',
					phone: '123',
				},
				hospitalName: '',
				goodAt: '',
				headers: {
					Authorization: '',
				},
				fileList1: [],
				fileList2: [],
				fileList3: [],
				fileList4: [],
				fileList5: [],
				fileList6: [],
				fileList7: [],
				fileList8: [],
				countExpert: 0,
				countBrief: 0,
				modifyData: undefined,
				doctorAuthInfo: {
					avatarUrl: "",

					doctorBrief: "",
					expertInDisease: "", //擅长

					idcardF: "",
					idcardZ: "",
					practiceF: "", //执业证反面
					practiceZ: "",
					qualificationF: "", //资格证书反面
					qualificationZ: "",
					titleF: "", //职称反面   职称只要正面
					titleZ: ""
				},
				columnsHospital: [
					[]
				]
			}
		},
		onLoad(option) {
			this.account = uni.getStorageSync('account');
			this.watchNo = uni.getStorageSync('watchNo');
			console.log('watchNo get', this.watchNo)

			this.auditStatus = option.auditStatus
			if (this.auditStatus == 3) {
				this.getFailReason()
			}

			if (this.auditStatus == 2) {
				uni.setStorageSync('watchNo', (this.watchNo + '1'));
				console.log('watchNo set', (this.watchNo + '1'))
			}

			console.log('account****************', this.account)

			this.headers.Authorization = uni.getStorageSync('bussinessToken')

			console.log('option****************', option)
			console.log('header****************', this.header)
			this.getIdentifyInfo()
		},
		methods: {

			getFailReason() {
				uni.$u.http.get('/account-api/accountInfo/getDoctorAuthStatus', {
					params: {}
				}).then(res => {
					if (res.code == 0) {
						this.failReason = res.data.reason || ''
						console.log('this.failReason', this.failReason)
					} else {
						this.$u.toast(res.message)
					}

				}).finally(() => {
					uni.hideLoading();
				});
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
						if (baseInfo.idcardZ) { //填过实名认证信息，需要填充数据
							this.modifyData = res.data //modifyData有值，说明之前提交过数据需要填充
							// avatarUrl: "",

							// doctorBrief: "",
							// expertInDisease: "", //擅长

							// idcardF: "",
							// idcardZ: "",
							// practiceF: "", //执业证反面
							// practiceZ: "",
							// qualificationF: "", //资格证书反面
							// qualificationZ: "",
							// titleF: "", //职称反面   职称只要正面
							// titleZ: ""

							this.doctorAuthInfo.avatarUrl = baseInfo.avatarUrl
							this.doctorAuthInfo.idcardZ = baseInfo.idcardZ
							this.doctorAuthInfo.idcardF = baseInfo.idcardF
							this.doctorAuthInfo.titleZ = baseInfo.titleZ
							this.doctorAuthInfo.qualificationZ = baseInfo.qualificationZ
							this.doctorAuthInfo.qualificationF = baseInfo.qualificationF
							this.doctorAuthInfo.practiceZ = baseInfo.practiceZ
							this.doctorAuthInfo.practiceF = baseInfo.practiceF
							this.doctorAuthInfo.doctorBrief = baseInfo.doctorBrief
							this.doctorAuthInfo.expertInDisease = baseInfo.expertInDisease

							this.fileList1 = [{
								url: baseInfo.avatarUrl,
								status: 'success',
								message: '',
							}]
							this.fileList2 = [{
								url: baseInfo.idcardZ,
								status: 'success',
								message: '',
							}]
							this.fileList3 = [{
								url: baseInfo.idcardF,
								status: 'success',
								message: '',
							}]
							this.fileList4 = [{
								url: baseInfo.titleZ,
								status: 'success',
								message: '',
							}]
							this.fileList5 = [{
								url: baseInfo.qualificationZ,
								status: 'success',
								message: '',
							}]
							this.fileList6 = [{
								url: baseInfo.qualificationF,
								status: 'success',
								message: '',
							}]
							this.fileList7 = [{
								url: baseInfo.practiceZ,
								status: 'success',
								message: '',
							}]
							this.fileList8 = [{
								url: baseInfo.practiceF,
								status: 'success',
								message: '',
							}]

							this.countExpert = (this.doctorAuthInfo.expertInDisease || '').length
							this.countBrief = (this.doctorAuthInfo.doctorBrief || '').length

						} else { //新增的实名认证信息情况，
							// this.getProf()
						}

						//测试代码
						// this.fileList2 = [{
						// 	url: 'https://hmg.mclouds.org.cn/content-api/file/I20230831105045590J2K0MERVYNDDJV-shenfenzheng_Z.jpg',
						// 	status: 'success',
						// 	message: '',
						// }]

					} else {
						this.$u.toast(res.message)
					}

				}).finally(() => {
					uni.hideLoading();
				});

			},

			// 删除图片
			deletePic(event) {
				this[`fileList${event.name}`].splice(event.index, 1)
			},
			// 新增图片
			async afterRead(event) {
				console.log('this[`fileList${event.name}`]---------------111111', JSON.stringify(this[
					`fileList${event.name}`]))
				console.log('event----------------', event)
				// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
				let lists = [].concat(event.file)
				let fileListLen = this[`fileList${event.name}`].length
				lists.map((item) => {
					this[`fileList${event.name}`].push({
						...item,
						status: 'uploading',
						message: '上传中'
					})
				})
				for (let i = 0; i < lists.length; i++) {
					const result = await this.uploadFilePromise(lists[i].url)
					console.log('result----------------', result)
					let item = this[`fileList${event.name}`][fileListLen]
					this[`fileList${event.name}`].splice(fileListLen, 1, Object.assign(item, {
						status: 'success',
						message: '',
						url: result
					}))
					fileListLen++
				}

				console.log('this[`fileList${event.name}`]---------------222222', JSON.stringify(this[
					`fileList${event.name}`]))
			},

			uploadFilePromise(url) {
				return new Promise((resolve, reject) => {
					let a = uni.uploadFile({
						// url: 'http://192.168.1.121/content-api/fileUpload/uploadImgFileForEdit', 
						// url: 'http://192.168.1.121/content-api/fileUpload/uploadImgFile', 
						url: baseURL + '/content-api/fileUpload/uploadImgFile',
						filePath: url,
						name: 'file',
						header: {
							'Authorization': this.headers.Authorization
						},
						formData: {
							user: 'test'
						},
						success: (res) => {
							setTimeout(() => {
								console.log('res----------------', res)
								let dataNew = JSON.parse(res.data)
								console.log('dataNew----------------', dataNew.data)
								resolve(dataNew.data.fileLinkUrl)
							}, 200)
						}
					});
				})
			},

			hideKeyboard() {
				uni.hideKeyboard();
			},

			goBack() {
				uni.navigateBack({
					delta: 1
				});
			},

			goNext() {
				uni.navigateTo({
					url: '/pages2/pages/mine/my-papers-edit'
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

		.u-upload__success {
			display: none !important;
		}

		.view-base {
			width: 100vw;
			display: flex;
			flex-direction: column;
			// padding: 30rpx 24rpx;

			.u-upload {
				flex: none;
			}

			.view-head {
				display: flex;
				flex-direction: row;
				align-items: center;
				margin-left: 24rpx;
				margin-top: 30rpx;
			}


			.input {
				text-indent: 0;
				min-height: 138rpx;
			}




		}
	}
</style>
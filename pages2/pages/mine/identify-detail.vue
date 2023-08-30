<template>
	<view class="content">

		<view style="width: 100vw;height: 20rpx;background-color: #F2F2F2;"></view>



		<view class="view-base">
			<view style="color: #1A1A1A;font-size: 32rpx;font-weight: bold;margin-left: 24rpx;">完成资质认证，开通问诊服务</view>

			<view class="view-head">
				<u-upload :fileList="fileList1" @afterRead="afterRead" @delete="deletePic" :maxCount="1" name="1">
					<!-- 					multiple :maxCount="10"> -->
					<view style="display: flex;flex-direction: row;align-items: center;">
						<view style="width: 128rpx;height: 128rpx;background-color: #F2F2F2;border-radius: 64rpx;">
						</view>
						<view style="color: #999999;font-size: 30rpx;margin-left: 33rpx;">请上传您清晰的免冠正面照</view>
						<view style="margin-left: 20rpx;">
							<u-icon name="arrow-right" color="#999" style="width: 13rpx;height: 24rpx;"></u-icon>
						</view>
					</view>

				</u-upload>

			</view>

			<view style="color: #4D4D4D;font-size: 30rpx;margin-left: 24rpx;margin-top: 30rpx;">上传头像示例:</view>

			<!-- 头像示例 -->
			<view style="display: flex;flex-direction: row;align-items: center;margin-left: 24rpx;margin-top: 20rpx;">
				<image
					src="https://hmg.mclouds.org.cn/content-api/file/I20230830160747241CXMHU0IEPSV6U5-doctorM_20230830160445.png"
					style="width: 88rpx;height: 88rpx;border: 1rpx dashed #999999;">
				</image>
				<image
					src="https://hmg.mclouds.org.cn/content-api/file/I20230830160814611MF3018AHTA5IGM-doctorF_20230830160445_1.png"
					style="width: 88rpx;height: 88rpx;border: 1rpx dashed #999999;margin-left: 20rpx;">
				</image>
			</view>

			<!-- 分割线 -->
			<view style="height: 1rpx;background-color: #E6E6E6;margin: 30rpx 24rpx 24rpx 24rpx;"></view>

			<!-- 身份证 -->
			<view style="display: flex;flex-direction: row;margin-left: 24rpx;">
				<view style="color: #4D4D4D;font-size: 30rpx;">身份证正反面</view>
				<view style="color: red;margin-top: 6rpx;">*</view>
			</view>

			<view style="display: flex;flex-direction: row;align-items: center;margin-left: 24rpx;margin-top: 20rpx;">
				<view style="display: flex;flex-direction: column;align-items: center;justify-content: center;">
					<u-upload :fileList="fileList1" @afterRead="afterRead" @delete="deletePic" :maxCount="1" name="1">
						<view
							style="display: flex;flex-direction: column;justify-content: center;align-items: center;border: 1rpx dashed #999999;width: 180rpx;height: 180rpx;">
							<view>
								<u-icon name="plus" size="28"></u-icon>
							</view>
							<view style="color: #999999;font-size: 30rpx;margin-top: 36rpx;">上传头像面</view>
						</view>
					</u-upload>
					<view style="color: #3894FF;font-size: 28rpx;margin-top: 30rpx;">查看示例</view>
				</view>


				<view
					style="margin-left: 40rpx;display: flex;flex-direction: column;align-items: center;justify-content: center;">
					<u-upload :fileList="fileList1" @afterRead="afterRead" @delete="deletePic" :maxCount="1" name="1">
						<view
							style="display: flex;flex-direction: column;justify-content: center;align-items: center;border: 1rpx dashed #999999;width: 180rpx;height: 180rpx;">
							<view>
								<u-icon name="plus" size="28"></u-icon>
							</view>
							<view style="color: #999999;font-size: 30rpx;margin-top: 36rpx;">上传国徽面</view>
						</view>
					</u-upload>
					<view style="color: #3894FF;font-size: 28rpx;margin-top: 30rpx;">查看示例</view>
				</view>
			</view>

			<!-- 分割线 -->
			<view style="height: 1rpx;background-color: #E6E6E6;margin: 30rpx 24rpx 24rpx 24rpx;"></view>

			<!-- 职称证 -->
			<view style="display: flex;flex-direction: row;margin-left: 24rpx;">
				<view style="color: #4D4D4D;font-size: 30rpx;">职称证</view>
				<view style="color: red;margin-top: 6rpx;">*</view>
			</view>

			<view style="display: flex;flex-direction: row;align-items: center;margin-left: 24rpx;margin-top: 20rpx;">
				<view style="display: flex;flex-direction: column;align-items: center;justify-content: center;">
					<u-upload :fileList="fileList1" @afterRead="afterRead" @delete="deletePic" :maxCount="1" name="1">
						<view
							style="display: flex;flex-direction: column;justify-content: center;align-items: center;border: 1rpx dashed #999999;width: 180rpx;height: 180rpx;">
							<view>
								<u-icon name="plus" size="28"></u-icon>
							</view>
							<view style="color: #999999;font-size: 30rpx;margin-top: 36rpx;">上传</view>
						</view>
					</u-upload>
					<view style="color: #3894FF;font-size: 28rpx;margin-top: 30rpx;">查看示例</view>
				</view>
			</view>

			<!-- 分割线 -->
			<view style="height: 1rpx;background-color: #E6E6E6;margin: 30rpx 24rpx 24rpx 24rpx;"></view>

			<!-- 资格证 -->
			<view style="display: flex;flex-direction: row;margin-left: 24rpx;">
				<view style="color: #4D4D4D;font-size: 30rpx;">资格证正反面</view>
				<view style="color: red;margin-top: 6rpx;">*</view>
			</view>

			<view style="display: flex;flex-direction: row;align-items: center;margin-left: 24rpx;margin-top: 20rpx;">
				<view style="display: flex;flex-direction: column;align-items: center;justify-content: center;">
					<u-upload :fileList="fileList1" @afterRead="afterRead" @delete="deletePic" :maxCount="1" name="1">
						<view
							style="display: flex;flex-direction: column;justify-content: center;align-items: center;border: 1rpx dashed #999999;width: 180rpx;height: 180rpx;">
							<view>
								<u-icon name="plus" size="28"></u-icon>
							</view>
							<view style="color: #999999;font-size: 30rpx;margin-top: 36rpx;">上传正面</view>
						</view>
					</u-upload>
					<view style="color: #3894FF;font-size: 28rpx;margin-top: 30rpx;">查看示例</view>
				</view>


				<view
					style="margin-left: 40rpx;display: flex;flex-direction: column;align-items: center;justify-content: center;">
					<u-upload :fileList="fileList1" @afterRead="afterRead" @delete="deletePic" :maxCount="1" name="1">
						<view
							style="display: flex;flex-direction: column;justify-content: center;align-items: center;border: 1rpx dashed #999999;width: 180rpx;height: 180rpx;">
							<view>
								<u-icon name="plus" size="28"></u-icon>
							</view>
							<view style="color: #999999;font-size: 30rpx;margin-top: 36rpx;">上传反面</view>
						</view>
					</u-upload>
					<view style="color: #3894FF;font-size: 28rpx;margin-top: 30rpx;">查看示例</view>
				</view>
			</view>


			<!-- 分割线 -->
			<view style="height: 1rpx;background-color: #E6E6E6;margin: 30rpx 24rpx 24rpx 24rpx;"></view>

			<!-- 资格证 -->
			<view style="display: flex;flex-direction: row;margin-left: 24rpx;">
				<view style="color: #4D4D4D;font-size: 30rpx;">执业证正反面</view>
				<view style="color: red;margin-top: 6rpx;">*</view>
			</view>

			<view style="display: flex;flex-direction: row;align-items: center;margin-left: 24rpx;margin-top: 20rpx;">
				<view style="display: flex;flex-direction: column;align-items: center;justify-content: center;">
					<u-upload :fileList="fileList1" @afterRead="afterRead" @delete="deletePic" :maxCount="1" name="1">
						<view
							style="display: flex;flex-direction: column;justify-content: center;align-items: center;border: 1rpx dashed #999999;width: 180rpx;height: 180rpx;">
							<view>
								<u-icon name="plus" size="28"></u-icon>
							</view>
							<view style="color: #999999;font-size: 30rpx;margin-top: 36rpx;">上传正面</view>
						</view>
					</u-upload>
					<view style="color: #3894FF;font-size: 28rpx;margin-top: 30rpx;">查看示例</view>
				</view>


				<view
					style="margin-left: 40rpx;display: flex;flex-direction: column;align-items: center;justify-content: center;">
					<u-upload :fileList="fileList1" @afterRead="afterRead" @delete="deletePic" :maxCount="1" name="1">
						<view
							style="display: flex;flex-direction: column;justify-content: center;align-items: center;border: 1rpx dashed #999999;width: 180rpx;height: 180rpx;">
							<view>
								<u-icon name="plus" size="28"></u-icon>
							</view>
							<view style="color: #999999;font-size: 30rpx;margin-top: 36rpx;">上传反面</view>
						</view>
					</u-upload>
					<view style="color: #3894FF;font-size: 28rpx;margin-top: 30rpx;">查看示例</view>
				</view>
			</view>


			<!-- 分割线 -->
			<view style="height: 1rpx;background-color: #E6E6E6;margin: 30rpx 24rpx 24rpx 24rpx;"></view>


			<!-- 擅长领域 -->
			<view style="display: flex;flex-direction: row;margin-left: 24rpx;">
				<view style="color: #4D4D4D;font-size: 30rpx;flex: 1;">擅长领域（选填）</view>
				<view>0/300</view>
			</view>

			<view style="margin: 20rpx 30rpx;">
				<u--textarea v-model="goodAt" class="input" maxlength="300"
					placeholder="请描述您的专业领域、擅长疾病；如：擅长高血压、 冠心病等疾病的专断和治疗；擅长CT诊断，由其对 心血管疾病对影像诊断。"></u--textarea>
			</view>

			<!-- 分割线 -->
			<view style="height: 1rpx;background-color: #E6E6E6;margin: 10rpx 24rpx 24rpx 24rpx;"></view>


			<!-- 个人简介 -->
			<view style="display: flex;flex-direction: row;margin-left: 24rpx;">
				<view style="color: #4D4D4D;font-size: 30rpx;flex: 1;">个人简介（选填）</view>
				<view>0/1000</view>
			</view>

			<view style="margin: 20rpx 30rpx;">
				<u--textarea v-model="goodAt" class="input" maxlength="300"
					placeholder="填写要求：\n 1.简介内容：从业年限，毕业学校，进修经历，学术， 科研成果，所获奖项，社会任职等 2.不包含敏感词汇，黄赌毒、反党、不文明用语 3.不虚假、不夸大"></u--textarea>
			</view>

			<!-- 分割线 -->
			<view style="height: 1rpx;background-color: #E6E6E6;margin: 10rpx 24rpx 24rpx 24rpx;"></view>
			<view
				style="display: flex;flex-direction: row;margin-left: 24rpx;background-color: white;">
				<image src="../../static/static/images/icon_blue.png" style="width: 28rpx;height: 28rpx;">
				</image>
				<view style="color: #3894FF;font-size: 24rpx;margin-left: 3rpx;">所有证件照仅用于认证，雅医互联网医院严格保证您等信息安全</view>
			</view>

			<!-- 底部按钮 下一步按钮-->
			<view
				style="width: 100vw;display: flex;flex-direction: row;align-items: center;justify-content: center;margin-top: 60rpx;">
				<view @click="goNext"
					style="color: white;background-color: #3894FF;width: 90vw;padding: 20rpx 0;border-radius: 8rpx;text-align: center;font-size: 30rpx;">
					提交资质认证</view>
			</view>
			
			<view style="height: 30rpx;"></view>

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
				goodAt: '',
				fileList1: [],
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

			// 删除图片
			deletePic(event) {
				this[`fileList${event.name}`].splice(event.index, 1)
			},
			// 新增图片
			async afterRead(event) {
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
					let item = this[`fileList${event.name}`][fileListLen]
					this[`fileList${event.name}`].splice(fileListLen, 1, Object.assign(item, {
						status: 'success',
						message: '',
						url: result
					}))
					fileListLen++
				}
			},
			uploadFilePromise(url) {
				return new Promise((resolve, reject) => {
					let a = uni.uploadFile({
						url: 'http://www.example.com/upload', // 仅为示例，非真实的接口地址
						filePath: url,
						name: 'file',
						formData: {
							user: 'test'
						},
						success: (res) => {
							setTimeout(() => {
								resolve(res.data.data)
							}, 1000)
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
					url: '/pages2/pages/mine/identify-result'
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
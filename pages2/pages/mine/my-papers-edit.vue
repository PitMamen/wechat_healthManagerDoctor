<template>
	<view class="content">

		<view style="width: 100vw;height: 20rpx;background-color: #F2F2F2;"></view>



		<view class="view-base">
			<!-- 	<view style="color: #1A1A1A;font-size: 32rpx;font-weight: bold;margin-left: 24rpx;">完成资质认证，开通问诊服务</view>

			<view class="view-head">
				<u-upload :fileList="fileList1" @afterRead="afterRead" @delete="deletePic" :maxCount="1" name="1">
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

			<view style="display: flex;flex-direction: row;align-items: center;margin-left: 24rpx;margin-top: 20rpx;">
				<image
					src="https://hmg.mclouds.org.cn/content-api/file/I20230830160747241CXMHU0IEPSV6U5-doctorM_20230830160445.png"
					style="width: 88rpx;height: 88rpx;border: 1rpx dashed #999999;" @click="goResult">
				</image>
				<image
					src="https://hmg.mclouds.org.cn/content-api/file/I20230830160814611MF3018AHTA5IGM-doctorF_20230830160445_1.png"
					style="width: 88rpx;height: 88rpx;border: 1rpx dashed #999999;margin-left: 20rpx;">
				</image>
			</view>

			<view style="height: 1rpx;background-color: #E6E6E6;margin: 30rpx 24rpx 24rpx 24rpx;"></view> -->
			<!-- 分割线 -->

			<!-- 身份证 -->
			<view style="display: flex;flex-direction: row;margin-left: 24rpx;">
				<view style="color: #4D4D4D;font-size: 30rpx;">身份证正反面</view>
				<view style="color: red;margin-top: 6rpx;">*</view>
			</view>

			<view style="display: flex;flex-direction: row;align-items: center;margin-left: 24rpx;margin-top: 20rpx;">
				<view style="display: flex;flex-direction: column;align-items: center;justify-content: center;">
					<u-upload :fileList="fileList2" @afterRead="afterRead" @delete="deletePic" :maxCount="1" name="2">
						<view
							style="display: flex;flex-direction: column;justify-content: center;align-items: center;border: 1rpx dashed #999999;width: 180rpx;height: 180rpx;">
							<view>
								<u-icon name="plus" size="28"></u-icon>
							</view>
							<view style="color: #999999;font-size: 30rpx;margin-top: 36rpx;">上传头像面</view>
						</view>
					</u-upload>
					<view @click="showExample(1)" style="color: #3894FF;font-size: 28rpx;margin-top: 30rpx;">查看示例</view>
				</view>


				<view
					style="margin-left: 40rpx;display: flex;flex-direction: column;align-items: center;justify-content: center;">
					<u-upload :fileList="fileList3" @afterRead="afterRead" @delete="deletePic" :maxCount="1" name="3">
						<view
							style="display: flex;flex-direction: column;justify-content: center;align-items: center;border: 1rpx dashed #999999;width: 180rpx;height: 180rpx;">
							<view>
								<u-icon name="plus" size="28"></u-icon>
							</view>
							<view style="color: #999999;font-size: 30rpx;margin-top: 36rpx;">上传国徽面</view>
						</view>
					</u-upload>
					<view @click="showExample(2)" style="color: #3894FF;font-size: 28rpx;margin-top: 30rpx;">查看示例</view>
				</view>
			</view>

			<!-- 分割线 -->
			<view style="height: 1rpx;background-color: #E6E6E6;margin: 30rpx 24rpx 24rpx 24rpx;"></view>

			<!-- 职称证 -->
			<view v-if="account.roleName=='doctor'" style="display: flex;flex-direction: row;margin-left: 24rpx;">
				<view style="color: #4D4D4D;font-size: 30rpx;">职称证</view>
				<view style="color: red;margin-top: 6rpx;">*</view>
			</view>

			<view v-if="account.roleName=='doctor'"
				style="display: flex;flex-direction: row;align-items: center;margin-left: 24rpx;margin-top: 20rpx;">
				<view style="display: flex;flex-direction: column;align-items: center;justify-content: center;">
					<u-upload :fileList="fileList4" @afterRead="afterRead" @delete="deletePic" :maxCount="1" name="4">
						<view
							style="display: flex;flex-direction: column;justify-content: center;align-items: center;border: 1rpx dashed #999999;width: 180rpx;height: 180rpx;">
							<view>
								<u-icon name="plus" size="28"></u-icon>
							</view>
							<view style="color: #999999;font-size: 30rpx;margin-top: 36rpx;">上传</view>
						</view>
					</u-upload>
					<view @click="showExample(3)" style="color: #3894FF;font-size: 28rpx;margin-top: 30rpx;">查看示例</view>
				</view>

				<!-- //new医生职称证需要两张，新增反面 -->
				<view
					style="margin-left: 40rpx;display: flex;flex-direction: column;align-items: center;justify-content: center;">
					<u-upload :fileList="fileList9" @afterRead="afterRead" @delete="deletePic" :maxCount="1" name="9">
						<view
							style="display: flex;flex-direction: column;justify-content: center;align-items: center;border: 1rpx dashed #999999;width: 180rpx;height: 180rpx;">
							<view>
								<u-icon name="plus" size="28"></u-icon>
							</view>
							<view style="color: #999999;font-size: 30rpx;margin-top: 36rpx;">上传反面</view>
						</view>
					</u-upload>
					<view @click="showExample(8)" style="color: #3894FF;font-size: 28rpx;margin-top: 30rpx;">查看示例</view>
				</view>
			</view>

			<!-- 分割线 -->
			<view v-if="account.roleName=='doctor'"
				style="height: 1rpx;background-color: #E6E6E6;margin: 30rpx 24rpx 24rpx 24rpx;"></view>

			<!-- 资格证 -->
			<view style="display: flex;flex-direction: row;margin-left: 24rpx;">
				<!-- <view style="color: #4D4D4D;font-size: 30rpx;">资格证正反面</view> -->
				<view style="color: #4D4D4D;font-size: 30rpx;">{{zigeName}}</view>
				<view style="color: red;margin-top: 6rpx;">*</view>
			</view>

			<view style="display: flex;flex-direction: row;align-items: center;margin-left: 24rpx;margin-top: 20rpx;">
				<view style="display: flex;flex-direction: column;align-items: center;justify-content: center;">
					<u-upload :fileList="fileList5" @afterRead="afterRead" @delete="deletePic" :maxCount="1" name="5">
						<view
							style="display: flex;flex-direction: column;justify-content: center;align-items: center;border: 1rpx dashed #999999;width: 180rpx;height: 180rpx;">
							<view>
								<u-icon name="plus" size="28"></u-icon>
							</view>
							<view style="color: #999999;font-size: 30rpx;margin-top: 36rpx;">上传正面</view>
						</view>
					</u-upload>
					<view @click="showExample(4)" style="color: #3894FF;font-size: 28rpx;margin-top: 30rpx;">查看示例</view>
				</view>


				<!-- //new技师的只要一张正面 -->
				<view v-if="account.roleName!='medTechnician'"
					style="margin-left: 40rpx;display: flex;flex-direction: column;align-items: center;justify-content: center;">
					<u-upload :fileList="fileList6" @afterRead="afterRead" @delete="deletePic" :maxCount="1" name="6">
						<view
							style="display: flex;flex-direction: column;justify-content: center;align-items: center;border: 1rpx dashed #999999;width: 180rpx;height: 180rpx;">
							<view>
								<u-icon name="plus" size="28"></u-icon>
							</view>
							<view style="color: #999999;font-size: 30rpx;margin-top: 36rpx;">上传反面</view>
						</view>
					</u-upload>
					<view @click="showExample(5)" style="color: #3894FF;font-size: 28rpx;margin-top: 30rpx;">查看示例</view>
				</view>
			</view>


			<!-- 分割线 -->
			<view style="height: 1rpx;background-color: #E6E6E6;margin: 30rpx 24rpx 24rpx 24rpx;"></view>

			<!-- 执业证 -->
			<view v-if="account.roleName=='doctor'|| account.roleName=='nurse'"
				style="display: flex;flex-direction: row;margin-left: 24rpx;">
				<!-- <view style="color: #4D4D4D;font-size: 30rpx;">执业证正反面</view> -->
				<view style="color: #4D4D4D;font-size: 30rpx;">{{zhiyeName}}</view>
				<view style="color: red;margin-top: 6rpx;">*</view>
			</view>

			<view v-if="account.roleName=='doctor'|| account.roleName=='nurse'"
				style="display: flex;flex-direction: row;align-items: center;margin-left: 24rpx;margin-top: 20rpx;">
				<view style="display: flex;flex-direction: column;align-items: center;justify-content: center;">
					<u-upload :fileList="fileList7" @afterRead="afterRead" @delete="deletePic" :maxCount="1" name="7">
						<view
							style="display: flex;flex-direction: column;justify-content: center;align-items: center;border: 1rpx dashed #999999;width: 180rpx;height: 180rpx;">
							<view>
								<u-icon name="plus" size="28"></u-icon>
							</view>
							<view style="color: #999999;font-size: 30rpx;margin-top: 36rpx;">上传正面</view>
						</view>
					</u-upload>
					<view @click="showExample(6)" style="color: #3894FF;font-size: 28rpx;margin-top: 30rpx;">查看示例</view>
				</view>


				<view
					style="margin-left: 40rpx;display: flex;flex-direction: column;align-items: center;justify-content: center;">
					<u-upload :fileList="fileList8" @afterRead="afterRead" @delete="deletePic" :maxCount="1" name="8">
						<view
							style="display: flex;flex-direction: column;justify-content: center;align-items: center;border: 1rpx dashed #999999;width: 180rpx;height: 180rpx;">
							<view>
								<u-icon name="plus" size="28"></u-icon>
							</view>
							<view style="color: #999999;font-size: 30rpx;margin-top: 36rpx;">上传反面</view>
						</view>
					</u-upload>
					<view @click="showExample(7)" style="color: #3894FF;font-size: 28rpx;margin-top: 30rpx;">查看示例</view>
				</view>
			</view>


			<!-- 			<view style="height: 1rpx;background-color: #E6E6E6;margin: 30rpx 24rpx 24rpx 24rpx;"></view>


			<view style="display: flex;flex-direction: row;margin-left: 24rpx;margin-right: 24rpx;">
				<view style="color: #4D4D4D;font-size: 30rpx;flex: 1;">擅长领域（选填）</view>
				<view>{{countExpert}}/300</view>
			</view>

			<view style="margin: 20rpx 30rpx;">
				<u--textarea @input="onInputChange(1)" v-model="doctorAuthInfo.expertInDisease" class="input"
					maxlength="300"
					placeholder="请描述您的专业领域、擅长疾病；如：擅长高血压、 冠心病等疾病的专断和治疗；擅长CT诊断，由其对 心血管疾病对影像诊断。"></u--textarea>
			</view>

			<view style="height: 1rpx;background-color: #E6E6E6;margin: 10rpx 24rpx 24rpx 24rpx;"></view>


			<view style="display: flex;flex-direction: row;margin-left: 24rpx;margin-right: 24rpx;">
				<view style="color: #4D4D4D;font-size: 30rpx;flex: 1;">个人简介（选填）</view>
				<view>{{countBrief}}/1000</view>
			</view>

			<view style="margin: 20rpx 30rpx;">
				<u--textarea @input="onInputChange(2)" v-model="doctorAuthInfo.doctorBrief" class="input"
					maxlength="1000"
					placeholder="填写要求：\n 1.简介内容：从业年限，毕业学校，进修经历，学术， 科研成果，所获奖项，社会任职等 2.不包含敏感词汇，黄赌毒、反党、不文明用语 3.不虚假、不夸大"></u--textarea>
			</view>

			<view style="height: 1rpx;background-color: #E6E6E6;margin: 10rpx 24rpx 24rpx 24rpx;"></view>
			<view style="display: flex;flex-direction: row;margin-left: 24rpx;background-color: white;">
				<image src="../../static/static/images/icon_blue.png" style="width: 28rpx;height: 28rpx;">
				</image>
				<view style="color: #3894FF;font-size: 24rpx;margin-left: 3rpx;">所有证件照仅用于认证，雅医互联网医院严格保证您等信息安全</view>
			</view> -->

			<!-- 底部按钮 下一步按钮-->
			<view
				style="width: 100vw;display: flex;flex-direction: row;align-items: center;justify-content: center;margin-top: 60rpx;">
				<view @click="goNext"
					style="color: white;background-color: #3894FF;width: 90vw;padding: 20rpx 0;border-radius: 8rpx;text-align: center;font-size: 30rpx;">
					提交</view>
			</view>

			<view style="height: 30rpx;"></view>

		</view>

		<!-- 选择器，参看yp-edit.vue -->
		<!-- 		<u-picker :show="showChooseHospital" :columns="columnsHospital" @cancel="cancelHospital"
			@confirm="confirmHospital" keyName="text"></u-picker> -->

		<u-modal :footer="null" :show="showImg" :title="title" :content='content' closeOnClickOverlay
			@close="() => showImg = false">
			<image :src="imgSrc" style="max-width: 80vw;max-height: 80vh;" mode="aspectFit">
			</image>
			<view slot="confirmButton">

			</view>
		</u-modal>

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
				// imgSrc: 'https://hmg.mclouds.org.cn/content-api/file/I20230831105355758RXFRVRZAKPAHAC-zige_Z.jpg',
				// imgSrc:'https://hmg.mclouds.org.cn/content-api/file/I20230831105045590J2K0MERVYNDDJV-shenfenzheng_Z.jpg',
				imgSrc: 'https://hmg.mclouds.org.cn/content-api/file/I20230831105218879DJJBP3PPFSZMLQ-zhiyezheng_Z.jpg',
				title: '',
				content: '',
				zigeName: '资格证正反面',
				zhiyeName: '执业证正反面',
				showImg: false,
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
				// fileList1: [],
				fileList2: [],
				fileList3: [],
				fileList4: [],
				fileList5: [],
				fileList6: [],
				fileList7: [],
				fileList8: [],
				//new
				fileList9: [],
				showChooseHospital: false,
				// countExpert: 0,
				// countBrief: 0,
				modifyData: undefined,
				doctorAuthInfo: {
					avatarUrl: "",

					// doctorBrief: "",
					// expertInDisease: "", //擅长

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
			//不同身份证件名称不一样
			if (this.account.roleName == 'nurse') {
				this.zigeName = '护士资格证正反面'
				this.zhiyeName = '护士执业证正反面'
			} else if (this.account.roleName == 'pharmacist') { //药剂师 pharmacist
				this.zigeName = '执业药师证正反面'
			} else if (this.account.roleName == 'medTechnician') { //技师 medTechnician
				this.zigeName = '执业服务资格证正反面'
			}

			this.headers.Authorization = uni.getStorageSync('bussinessToken')

			console.log('option****************', option)
			console.log('header****************', this.header)
			this.getIdentifyInfo()
		},
		methods: {

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
							// this.doctorAuthInfo.doctorBrief = baseInfo.doctorBrief
							// this.doctorAuthInfo.expertInDisease = baseInfo.expertInDisease

							// this.fileList1 = [{
							// 	url: baseInfo.avatarUrl,
							// 	status: 'success',
							// 	message: '',
							// }]
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
							//new
							if (baseInfo.titleF) {
								this.fileList9 = [{
									url: baseInfo.titleF,
									status: 'success',
									message: '',
								}]
							}
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

							// this.countExpert = (this.doctorAuthInfo.expertInDisease || '').length
							// this.countBrief = (this.doctorAuthInfo.doctorBrief || '').length

						} else { //新增的实名认证信息情况，
							// this.getProf()
						}

					} else {
						this.$u.toast(res.message)
					}

				}).finally(() => {
					uni.hideLoading();
				});

			},

			showExample(type) {
				switch (type) {
					//每个分支else内的都是医生的
					case 1:
						this.imgSrc =
							'https://hmg.mclouds.org.cn/content-api/file/I20230831105045590J2K0MERVYNDDJV-shenfenzheng_Z.jpg'
						break;
					case 2:
						this.imgSrc =
							'https://hmg.mclouds.org.cn/content-api/file/I202308311051102891UK4NNOY97UTVF-shenfenzheng_F.jpg'
						break;
					case 3: //职称证，医生独有
						this.imgSrc =
							'https://hmg.mclouds.org.cn/content-api/file/I20231127141604321AVSNTAWCSGQYFR-yishizhichengzhengzhuye_20231127141519.png'
						break;
					case 4: //资格证正面示例图片，医生 护士 药剂师 技师 都不一样,这里产品先提供的技师的，先改了技师的；所有示例图片默认都是医生的，原来就有
						if (this.account.roleName == 'medTechnician') { //技师的
							this.imgSrc =
								"https://hmg.mclouds.org.cn/content-api/file/I20231127144613569LPDL5BE8MASAIO-guojiazhiyezigezneirong_20231127144545.png"
						} else if (this.account.roleName == 'pharmacist') { //药剂师
							this.imgSrc =
								'https://hmg.mclouds.org.cn/content-api/file/I20231127141756273C9TWPFLQRWCVXN-yishizhiyezhengzhuye_20231127141734.png'
						} else { //医生的
							this.imgSrc =
								'https://hmg.mclouds.org.cn/content-api/file/I20230831105355758RXFRVRZAKPAHAC-zige_Z.jpg'
						}
						break;
					case 5: //资格证反面示例图片

						if (this.account.roleName == 'pharmacist') { //药剂师
							this.imgSrc =
								'https://hmg.mclouds.org.cn/content-api/file/I20231127141906876Q98XX5RFVMRKWU-yishizhiyezhenggerenxinxi_20231127141833.png'
						} else { //医生的
							this.imgSrc =
								'https://hmg.mclouds.org.cn/content-api/file/I202308311054214918W47T0XDA0UN8R-zige_F.jpg'
						}


						break;
					case 6: //执业证
						if (this.account.roleName == 'medTechnician') { //技师的
							this.imgSrc =
								'https://hmg.mclouds.org.cn/content-api/file/I20231127141756273C9TWPFLQRWCVXN-yishizhiyezhengzhuye_20231127141734.png'
						} else if (this.account.roleName == 'nurse') { //护士的
							this.imgSrc =
								'https://hmg.mclouds.org.cn/content-api/file/I202311271420116825GFPDNMN6BPQHV-hushizhiyezhengzhuce_20231127141943.png'
						} else {
							this.imgSrc =
								'https://hmg.mclouds.org.cn/content-api/file/I20231127141756273C9TWPFLQRWCVXN-yishizhiyezhengzhuye_20231127141734.png'
						}
						break;
					case 7: //执业证
						if (this.account.roleName == 'medTechnician') { //技师的
							this.imgSrc =
								'https://hmg.mclouds.org.cn/content-api/file/I20231127141906876Q98XX5RFVMRKWU-yishizhiyezhenggerenxinxi_20231127141833.png'
						} else if (this.account.roleName == 'nurse') { //护士的
							this.imgSrc =
								'https://hmg.mclouds.org.cn/content-api/file/I20231127142109125DMU6J4BRYHRKYY-hushizhiyezhenggerenxinxi_20231127142044.png'
						} else {
							this.imgSrc =
								'https://hmg.mclouds.org.cn/content-api/file/I20231127141906876Q98XX5RFVMRKWU-yishizhiyezhenggerenxinxi_20231127141833.png'
						}

						break;
					case 8: //new医生职称证反面 //职称证，医生独有
						this.imgSrc =
							'https://hmg.mclouds.org.cn/content-api/file/I20231127141708703MS0YWSVBIWJVXF-yishizhichengzhengfuye_20231127141646.png'
						break;
					default:
						break;
				}
				this.showImg = true
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
					uni.showLoading({
						title: '正在加载'
					});
					const result = await this.uploadFilePromise(lists[i].url)
					console.log('result----------------', result)
					let item = this[`fileList${event.name}`][fileListLen]
					this[`fileList${event.name}`].splice(fileListLen, 1, Object.assign(item, {
						status: 'success',
						message: '',
						url: result
					}))
					fileListLen++
					uni.hideLoading()
				}
				/**
				 * 上传后数据格式 fileList1
				 * 
[
  {
    "size": 33052,
    "type": "image",
    "url": "https://develop.mclouds.org.cn/content-api/file/I20230904094301844IMAPGTO4XYIJWB-InLsNzaoZBd22811ca4a580e009943c375ce108509bc.jpg",
    "thumb": "http://tmp/InLsNzaoZBd22811ca4a580e009943c375ce108509bc.jpg",
    "status": "success",
    "message": ""
  }
]
				 */
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
						},
						fail: (err) => {
							this.$u.toast('上传图片失败，' + err.errMsg)
							// console.error(err)
							// reject('上传附件失败，' + err.errMsg)
						},
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


			/**
			 * 		doctorAuthInfo: {
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
			 */
			goNext() {
				// console.log('this.fileList1', this.fileList1)
				// if (!this.fileList1[0] || !this.fileList1[0].url) {
				// 	this.$u.toast("请上传头像！")
				// 	return
				// } else {
				// 	this.doctorAuthInfo.avatarUrl = this.fileList1[0].url
				// }

				if (!this.fileList2[0] || !this.fileList2[0].url) {
					this.$u.toast("请上传身份证正面！")
					return
				} else {
					this.doctorAuthInfo.idcardZ = this.fileList2[0].url
				}

				if (!this.fileList3[0] || !this.fileList3[0].url) {
					this.$u.toast("请上传身份证反面！")
					return
				} else {
					this.doctorAuthInfo.idcardF = this.fileList3[0].url
				}

				//只有医生需要上传职称证
				if (this.account.roleName == 'doctor') {
					if (!this.fileList4[0] || !this.fileList4[0].url) {
						this.$u.toast("请上传职称证！")
						return
					} else {
						this.doctorAuthInfo.titleZ = this.fileList4[0].url
					}

					//new 仅医生身份有职称证，且增加反面
					if (!this.fileList9[0] || !this.fileList9[0].url) {
						this.$u.toast("请上传职称证反面！")
						return
					} else {
						this.doctorAuthInfo.titleF = this.fileList9[0].url
					}
				}

				//new 资格证
				if (!this.fileList5[0] || !this.fileList5[0].url) {
					this.$u.toast("请上传" + this.zigeName + "正面！")
					return
				} else {
					this.doctorAuthInfo.qualificationZ = this.fileList5[0].url
				}

				//new技师的只要一张正面 
				if (this.account.roleName != 'medTechnician') {
					if (!this.fileList6[0] || !this.fileList6[0].url) {
						this.$u.toast("请上传" + this.zigeName + "反面！")
						return
					} else {
						this.doctorAuthInfo.qualificationF = this.fileList6[0].url
					}
				}

				// //new 只有医生和护士需要上传执业证
				if (this.account.roleName == 'doctor' || this.account
					.roleName == 'nurse') {
					if (!this.fileList7[0] || !this.fileList7[0].url) {
						this.$u.toast("请上传" + this.zhiyeName + "正面！")
						return
					} else {
						this.doctorAuthInfo.practiceZ = this.fileList7[0].url
					}

					if (!this.fileList8[0] || !this.fileList8[0].url) {
						this.$u.toast("请上传" + this.zhiyeName + "反面！")
						return
					} else {
						this.doctorAuthInfo.practiceF = this.fileList8[0].url
					}
				}

				//判断是否上传完成  重要bug  图片没上传完成也可以点击提交，导致图片出错，因为图片没上传完成组件内部赋值给url的是手机本地的图片地址
				// if (this.fileList1.length > 0 && this.fileList1[0].url) {
				// 	if (this.fileList1[0].url.indexOf('wxfile://tmp') > -1) {
				// 		this.$u.toast("图片上传中，请等待上传完成！")
				// 		return
				// 	}
				// }
				if (this.fileList2.length > 0 && this.fileList2[0].url) {
					if (this.fileList2[0].url.indexOf('wxfile://tmp') > -1) {
						this.$u.toast("图片上传中，请等待上传完成！")
						return
					}
				}
				if (this.fileList3.length > 0 && this.fileList3[0].url) {
					if (this.fileList3[0].url.indexOf('wxfile://tmp') > -1) {
						this.$u.toast("图片上传中，请等待上传完成！")
						return
					}
				}
				if (this.fileList4.length > 0 && this.fileList4[0].url) {
					if (this.fileList4[0].url.indexOf('wxfile://tmp') > -1) {
						this.$u.toast("图片上传中，请等待上传完成！")
						return
					}
				}
				if (this.fileList5.length > 0 && this.fileList5[0].url) {
					if (this.fileList5[0].url.indexOf('wxfile://tmp') > -1) {
						this.$u.toast("图片上传中，请等待上传完成！")
						return
					}
				}
				if (this.fileList6.length > 0 && this.fileList6[0].url) {
					if (this.fileList6[0].url.indexOf('wxfile://tmp') > -1) {
						this.$u.toast("图片上传中，请等待上传完成！")
						return
					}
				}
				if (this.fileList7.length > 0 && this.fileList7[0].url) {
					if (this.fileList7[0].url.indexOf('wxfile://tmp') > -1) {
						this.$u.toast("图片上传中，请等待上传完成！")
						return
					}
				}
				if (this.fileList8.length > 0 && this.fileList8[0].url) {
					if (this.fileList8[0].url.indexOf('wxfile://tmp') > -1) {
						this.$u.toast("图片上传中，请等待上传完成！")
						return
					}
				}
				if (this.fileList9.length > 0 && this.fileList9[0].url) {
					if (this.fileList9[0].url.indexOf('wxfile://tmp') > -1) {
						this.$u.toast("图片上传中，请等待上传完成！")
						return
					}
				}


				uni.showLoading({
					title: '正在加载'
				});
				console.log('submitDoctorAuthInfo', JSON.stringify(this.doctorAuthInfo))
				uni.$u.http.post('/account-api/accountInfo/submitDoctorAuthInfo', this.doctorAuthInfo).then(res => {
					if (res.code == 0) {
						this.$u.toast("操作成功！")
						uni.navigateTo({
							url: '/pages2/pages/mine/identify-result?type=1&jumpFrom=2&useFor=1'
						})
					} else {
						this.$u.toast(res.message)
					}

				}).finally(() => {
					uni.hideLoading();
				});

			},

			goResult() {
				// uni.navigateTo({
				// 	url: '/pages2/pages/mine/identify-result?type=1&jumpFrom=2'
				// })
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

		.u-upload__deletable {
			width: 20rpx;
			height: 20rpx;
		}

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
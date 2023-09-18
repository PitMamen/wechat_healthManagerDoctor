<template>
	<view class="wrap">
		<view class="minheight">


			<view class="part zhenduan">
				<view class="title">
					<text>临床诊断</text>
				</view>
				<view class="content">
					<view class="list" v-if="info.medicalOrdersCaseList.length > 0">
						<view class="item" v-for="item in info.medicalOrdersCaseList" :key="item.diagnosisCode">
							<view class="name">{{ item.diagnosis }}</view>
							<u-icon name="close" color="#1A1A1A" size="28rpx" @click="caseDelete(item)"></u-icon>
						</view>
					</view>
					<view class="add-area">
						<view class="btn" @click="goAddDiag">
							<u-icon name="plus-circle-fill" color="#409EFF" size="40rpx"></u-icon>
							<view class="text">添加诊断</view>
						</view>
					</view>
				</view>
			</view>

			<view class="part yaoping">
				<view class="title">
					<text>药品信息</text>

				</view>
				<view class="content">
					<view class="list" v-if="info.medicalOrdersDetails.length > 0">
						<view class="item" v-for="item in info.medicalOrdersDetails" :key="item.id">
							<view class="row row1">
								<view class="name">
									{{ item.genericName || '~' }}&nbsp;&nbsp;&nbsp;&nbsp;{{ item.tradeName || '' }}
								</view>
								<view class="actions">
									<text class="edit" @click="ypEdit(item)">编辑</text>
									<text class="delete" @click="ypDelete(item)">删除</text>
								</view>
							</view>
							<view class="row row2">
								<view>规格：{{ item.specification || '~' }}</view>
							</view>
							<view class="row row3">
								<view>
									用法用量：{{item.useFrequencyName}}；{{item.useNum}}{{item.useUnit}}/1次；{{item.drugUsemethodName}}
								</view>
							</view>
							<view class="row row4">
								<u-icon name="minus-circle" color="#409EFF" size="36rpx" @click="subt(item)"></u-icon>
								<u--input v-model="item.num" type="number" color="#409EFF" fontSize="30rpx"
									border="none" inputAlign="center" @blur="blur(item, $event)"></u--input>
								<u-icon name="plus-circle" color="#409EFF" size="36rpx" @click="plus(item)"></u-icon>
							</view>
						</view>
					</view>
					<view class="add-area">
						<view class="btn" @click="ypAdd()">
							<u-icon name="plus-circle-fill" color="#409EFF" size="40rpx"></u-icon>
							<view class="text">添加药品</view>
						</view>
					</view>
				</view>
			</view>
			<view style="height: 150rpx;"></view>

		</view>



		<view v-if="id" class="fix">

			<view class="del-btn" @click="deleteMode()">删除模板</view>
			<view class="save-btn" @click="submit()">保 存</view>
		</view>
		<view v-else class="fix">

			<view class="save-btn2" @click="submit()">保 存</view>
		</view>

		<yp-edit ref="ypEdit" @edit="edit" />
		<add-diag ref="addDiag" @chang="handleChange" />
		<choose-template ref="chooseTemplate" @chang="handleTemp" />

	</view>
</template>

<script>
	import ypEdit from './component/yp-edit';
	import addDiag from './component/addDiag'
	import chooseTemplate from './component/chooseTemplate'

	export default {
		data() {
			return {
				options: {},
				account: {},
				flag: false,
				diagList: [],
				info: {
					medicalOrdersDetails: [],
					medicalOrdersCaseList: [],
					prescriptionInstruction: ''
				},
				id: '',
				preType: '', //'appPrePrescription':'consultOrderPrescription'
				pwd: '',
				show: false
			}
		},
		computed: {
			totalAmount() {
				const result = this.info.medicalOrdersDetails.reduce((sum, item) => {
					const amount = new Number((item.unitPrice * 1) * (item.num * 1)).toFixed(2) * 1;
					return sum + amount;
				}, 0);
				return new Number(result).toFixed(2) * 1;
			}
		},
		components: {
			ypEdit,
			addDiag,
			chooseTemplate
		},
		onLoad(options) {
			uni.removeStorageSync('cf-info');

			this.options = options;
			this.options.preType = this.options.preType || 'appPrePrescription';
			this.id = options.id
			this.account = uni.getStorageSync('account');

			if (this.id) {
				setTimeout(() => {
					this.getMedicalTempById(this.id)
				})

			}


		},

		onReady() {},
		onShow() {
			this.init();
		},
		methods: {
			init() {
				let info = uni.getStorageSync('cf-info');
				if (!info) {
					info = this.geneInfo();
				}
				this.info = info;
				uni.setStorageSync('cf-info', this.info);
			},
			geneInfo() {

				return {

					prescriptionInstruction: '',
					preType: this.options.preType,
					medicalOrdersDetails: [],
					medicalOrdersCaseList: [],
				};
			},
			getMedicalTempById(id) {
				uni.$u.http.get('/medical-api/medical/getMedicalTempById', {
					params: {
						id: id
					}
				}).then(res => {
					if (res.data.medicalOrdersTemplateDetail.length > 0) {
						res.data.medicalOrdersTemplateDetail.forEach(item => {
							item.genericName = item.drugName
							item.specification = item.drugSpec
							item.code = item.drugCode
							item.unitPrice = item.price
							item.valuationUnit = item.drugUnit

						})
					}
					let arr = res.data.diagnosis.split(',')
					let arr2 = res.data.diagnosisCode.split(',')
					let arr3 = []

					arr.forEach((item, index) => {
						arr3.push({
							diagnosis: arr[index],
							diagnosisCode: arr2[index]
						})
					})


					var info = {
						prescriptionInstruction: '',
						preType: this.options.preType,
						medicalOrdersDetails: res.data.medicalOrdersTemplateDetail || [],
						medicalOrdersCaseList: arr3,
					}
					this.info = info;
					uni.setStorageSync('cf-info', this.info);

				});

			},



			goAddDiag() {
				uni.setStorageSync('cf-info', this.info);
				this.$refs.addDiag.add(this.info.medicalOrdersCaseList)
			},

			handleChange(diagList) {
				this.init()
			},
			handleTemp() {
				this.init()
			},

			caseDelete(item) {
				const index = this.info.medicalOrdersCaseList.findIndex(target => {
					return target.diagnosisCode === item.diagnosisCode;
				});
				if (index >= 0) {
					this.info.medicalOrdersCaseList.splice(index, 1);
					this.$set(this.info, 'medicalOrdersCaseList', this.info.medicalOrdersCaseList);
				}
			},



			ypAdd() {
				uni.setStorageSync('cf-info', this.info);
				uni.navigateTo({
					url: `/pages2/pages/chufang2/yp-search?preType=${this.options.preType}&isFromTemplate=${true}`
				});
			},
			ypEdit(item) {
				this.$refs.ypEdit.set(item, this.options);
			},
			ypDelete(item) {
				const index = this.info.medicalOrdersDetails.findIndex(target => {
					return target.code === item.code;
				});
				if (index >= 0) {
					this.info.medicalOrdersDetails.splice(index, 1);
					this.$set(this.info, 'medicalOrdersDetails', this.info.medicalOrdersDetails);
				}
			},
			edit(item) {
				const index = this.info.medicalOrdersDetails.findIndex(target => {
					return target.code === item.code;
				});
				if (index < 0) {
					this.info.medicalOrdersDetails.push(item);
				} else {
					this.info.medicalOrdersDetails.splice(index, 1, item);
				}
				this.$set(this.info, 'medicalOrdersDetails', this.info.medicalOrdersDetails);
			},
			plus(item) {
				this.$set(item, 'num', item.num * 1 + 1);
			},
			subt(item) {
				if (item.num > 1) {
					this.$set(item, 'num', item.num * 1 - 1);
				} else {
					this.ypDelete(item);
				}
			},
			blur(item, value) {
				value = (value + '').trim();
				this.$set(item, 'num', value);
				if (value === '' || value === '0') {
					this.ypDelete(item);
				} else if (!/^[1-9][0-9]*$/.test(value)) {
					this.$set(item, 'num', 1);
					uni.showToast({
						title: '开药数量需要为大于0的整数',
						icon: 'none'
					});
				}
			},


			close(e) {
				this.pwd = '';
				this.show = false;
				this.flag = false;
			},
			change(e) {
				e = e + '';
				if (this.pwd.length >= 6) {
					return;
				}
				this.pwd = this.pwd + e;
				if (this.pwd.length === 6) {
					this.checkPwd();
				}
			},
			cancel(e) {
				this.close(e);
			},
			confirm(e) {
				this.close(e);
			},
			backspace(e) {
				if (this.pwd.length === 0) {
					return;
				}
				this.pwd = this.pwd.substring(0, this.pwd.length - 1);
			},

			//删除模板
			deleteMode() {
				if(!this.id){
					return
				}
				uni.showLoading({
					title: '删除中'
				});
				uni.$u.http.get('/medical-api/medical/delMedicalTempById', {
					params: {
						id: this.id
					}
				}).then(res => {
					
					uni.hideLoading();
					uni.removeStorageSync('cf-info');
					uni.showToast({
						title: '删除成功',
						icon: 'success'
					});
					setTimeout(()=>{
						uni.navigateBack()
					},1500)
				});

			
			},


			convert() {
				const info_ = JSON.parse(JSON.stringify(this.info));

				var reqData = {
					diagnosis: info_.medicalOrdersCaseList.map(item => {
						return item.diagnosis;
					}).join(','),
					diagnosisCode: info_.medicalOrdersCaseList.map(item => {
						return item.diagnosisCode;
					}).join(','),
					docId: this.account.user.userId,
					docName: this.account.user.userName,
					medicalOrdersTemplateDetail: info_.medicalOrdersDetails.map(item => {
						return {
							num: item.num,
							drugCode: item.code,
							useNum: item.useNum,
							useUnit: item.useUnit,
							price: item.unitPrice,
							useDays: item.useDays,
							drugName: item.genericName,
							drugUnit: item.packingUnit,
							drugSpec: item.specification,
							useFrequency: item.useFrequency,
							drugUsemethod: item.drugUsemethod,
							useFrequencyName: item.useFrequencyName,
							drugUsemethodName: item.drugUsemethodName,
							amount: new Number((item.unitPrice * 1) * (item.num * 1)).toFixed(2) * 1
						};
					}),
					templateType: this.options.preType
				}
				if (this.id) {
					reqData.id = this.id
				}

				return reqData;
			},


			submit() {

				if (this.info.medicalOrdersCaseList.length === 0) {
					uni.showToast({
						title: '请添加诊断',
						icon: 'none'
					});
					return;
				}
				if (this.info.medicalOrdersDetails.length === 0) {
					uni.showToast({
						title: '请添加药品',
						icon: 'none'
					});
					return;
				}
				if (this.flag) {
					return;
				}
				this.flag = true;
				this.doSubmit();
			},
			doSubmit() {
				uni.showLoading({
					title: '正在加载'
				});
				uni.$u.http.post(`/medical-api/medical/saveMedicalTemp`, this.convert()).then(res => {
					uni.hideLoading();
					uni.removeStorageSync('cf-info');
					uni.showToast({
						title: '保存成功',
						icon: 'success'
					});
					setTimeout(()=>{
						uni.navigateBack()
					},1500)
				}).finally(() => {
					this.show = false;
					this.flag = false;
				});
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #F5F5F5;
	}

	.fix {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 750rpx;
		padding: 25rpx 0;
		background: #F5F5F5;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;


		.del-btn {
			margin-left: 30rpx;
			width: 214rpx;
			font-size: 30rpx;
			font-weight: 400;
			color: #409EFF;
			line-height: 70rpx;
			text-align: center;
			background: #ffffff;
			border-radius: 10rpx;
			border: 1rpx solid #409EFF;
		}

		.save-btn {
			width: 410rpx;
			font-size: 30rpx;
			font-weight: 400;
			color: #FFFFFF;
			line-height: 70rpx;
			text-align: center;
			background: #409EFF;
			border-radius: 10rpx;
			margin-right: 30rpx;
			border: 1rpx solid #409EFF;
		}

		.save-btn2 {
			margin-left: 30rpx;
			width: 690rpx;
			font-size: 30rpx;
			font-weight: 400;
			color: #FFFFFF;
			line-height: 70rpx;
			text-align: center;
			background: #409EFF;
			border-radius: 10rpx;
			margin-right: 30rpx;
			border: 1rpx solid #409EFF;
		}
	}

	.button {
		position: fixed;

		width: 702rpx;

		left: 24rpx;
		bottom: 30rpx;

		color: #ffffff;
		background-color: #3894FF !important;

		border-color: #3894FF !important;
		border-radius: 10rpx;

	}

	.wrap {
		min-height: 100vh;
		background: #F5F5F5;

		.minheight {
			min-height: calc(100vh - 162rpx - 55rpx);
		}

		.part {
			margin-bottom: 10rpx;
			padding: 0 24rpx;

			.title {
				position: relative;
				font-size: 30rpx;
				font-weight: 500;
				color: #1A1A1A;
				line-height: 90rpx;

				.abs {
					position: absolute;
					display: flex;
					top: 0;
					right: 0;
					align-items: center;

					image {
						margin-right: 6rpx;
						width: 32rpx;
						height: 32rpx;
					}

					text {
						font-size: 28rpx;
						font-weight: 400;
						color: #409EFF;
					}
				}
			}

			.content {
				.add-area {
					margin-top: 20rpx;
					padding: 55rpx 0;
					background: #FFFFFF;
					border-radius: 4rpx;

					.btn {
						display: flex;
						justify-content: center;
						align-items: center;

						.u-icon {
							position: relative;
							margin-right: 6rpx;
							top: 2rpx;
						}

						.text {
							font-size: 30rpx;
							font-weight: 500;
							color: #1A1A1A;
							line-height: 38rpx;
						}
					}
				}
			}

			&.info {
				.content {
					.desc {
						display: flex;
						justify-content: space-between;
						align-items: center;
						padding: 30rpx 85rpx 35rpx 85rpx;
						background: #FFFFFF;
						border-radius: 4rpx;

						.column {
							width: 33.33%;
							font-size: 28rpx;
							font-weight: 400;
							color: #4D4D4D;
							line-height: 48rpx;

							&.middle {
								display: flex;
								flex-direction: column;
								align-items: center;
								text-align: center;
							}

							&.right {
								text-align: right;
							}

							.up {
								margin-bottom: 10rpx;
							}

							.down {
								.u-input {}

								.sex {
									display: flex;
									justify-content: space-between;
									align-items: center;

									.radio {
										position: relative;
										width: 66rpx;
										color: #1A1A1A;
										text-align: center;
										background: #EBEBEB;

										&.man {
											right: -10rpx;
											border-radius: 24rpx 0 0 24rpx;
										}

										&.woman {
											left: -10rpx;
											border-radius: 0 24rpx 24rpx 0;
										}

										&.active {
											z-index: 1;
											color: #FFFFFF;
											background: #409EFF;
											border-radius: 24rpx !important;
										}
									}
								}
							}
						}
					}
				}
			}

			&.zhenduan {
				.content {
					.list {
						padding: 42rpx 30rpx;
						background: #FFFFFF;
						border-radius: 4rpx;

						.item {
							display: inline-flex;
							justify-content: space-between;
							align-items: center;
							margin-right: 20rpx;
							margin-bottom: 20rpx;
							background: #F5F5F5;
							border-radius: 31rpx;

							.name {
								max-width: 540rpx;
								padding-left: 20rpx;
								font-size: 28rpx;
								font-weight: 400;
								color: #1A1A1A;
								line-height: 62rpx;
								white-space: nowrap;
								overflow: hidden;
								text-overflow: ellipsis;
							}

							.u-icon {
								padding: 10rpx 20rpx 10rpx 15rpx;
							}
						}
					}
				}
			}

			&.yaoping {
				.content {
					.list {
						.item {
							margin-bottom: 20rpx;
							padding: 15rpx 30rpx;
							background: #FFFFFF;
							border-radius: 4rpx;

							&:last-child {
								margin-bottom: 0;
							}

							.row {
								&.row1 {
									display: flex;
									justify-content: space-between;
									font-size: 30rpx;
									font-weight: 400;
									line-height: 60rpx;

									.name {
										max-width: 480rpx;
										color: #1A1A1A;
										white-space: nowrap;
										overflow: hidden;
										text-overflow: ellipsis;
									}

									.actions {
										color: #409EFF;

										.edit {
											margin-right: 40rpx;
										}

										.delete {}
									}
								}

								&.row2 {
									view {
										font-size: 24rpx;
										font-weight: 400;
										color: #999999;
										line-height: 54rpx;
									}
								}

								&.row3 {
									view {
										font-size: 24rpx;
										font-weight: 400;
										color: #4D4D4D;
										line-height: 54rpx;
									}
								}

								&.row4 {
									display: flex;
									justify-content: flex-end;
									align-items: center;
									margin-bottom: 15rpx;

									.u-icon {
										padding: 0 2rpx;
									}

									.u-input {
										max-width: 80rpx;
										font-size: 30rpx;
										font-weight: 400;
										color: #409EFF;
										line-height: 37rpx;
									}
								}
							}
						}
					}
				}
			}

			&.buchong {
				.content {
					.desc {
						padding: 20rpx;
						background: #FFFFFF;
						border-radius: 4rpx;

						.u-textarea {
							background-color: #F5F5F5;
							border: none;

							/deep/ .u-textarea__field {
								min-height: 70px;
							}

							/deep/ .u-textarea__count {
								background-color: #F5F5F5 !important;
							}
						}
					}

					.model {
						position: relative;
						margin-top: 20rpx;
						padding: 30rpx 20rpx;
						background: #FFFFFF;
						border-radius: 4rpx;

						.mask {
							position: absolute;
							top: 0;
							bottom: 0;
							left: 0;
							right: 0;
							z-index: 1;
						}

						.u-radio {
							/deep/ .u-radio__text {
								color: #1A1A1A !important;
							}
						}
					}
				}
			}
		}



		.wrap-keyboard {
			padding: 40rpx 24rpx;
			background: #FFFFFF;

			.tips {
				position: relative;
				margin-bottom: 40rpx;
				font-size: 36rpx;
				font-weight: 500;
				color: #1A1A1A;
				line-height: 54rpx;
				text-align: center;

				.close {
					position: absolute;
					top: 0;
					right: 0;
					font-size: 30rpx;
					font-weight: 400;
					color: #999999;
					line-height: 54rpx;
				}
			}

			.u-code-input {
				margin-bottom: 40rpx;
				justify-content: center;
			}
		}
	}
</style>
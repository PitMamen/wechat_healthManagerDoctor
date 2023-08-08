<template>
	<view class="wrap-diag">
		<u-popup :safeAreaInsetBottom="false" :safeAreaInsetTop="false" :mode="popupData.mode" :show="showPop"
			:round="popupData.round" :overlay="popupData.overlay" :borderRadius="popupData.borderRadius"
			:closeable="popupData.closeable" :closeOnClickOverlay="popupData.closeOnClickOverlay" @close="close"
			@open="open">
			<view class="wrap-pop" style="background: white;top:0">
				<!-- 的方法給發熱個人 -->
				<u-sticky style="background-color: white;top:0">
					<view class="pop-top">
						<view style="margin-left: 42%;flex: 1;font-size: 30rpx;">诊断</view>
						<u-icon @click="close" style="margin-right: 30rpx;" name="close" size="18"
							color="#909399"></u-icon>
					</view>
					<view class="inputs"><u-search  placeholder="搜索诊断" v-model="value" :show-action="false"
						@change="change"></u-search></view>
					
				</u-sticky>
				<!-- 搜索列表 -->
				<view class="result" v-if="listDiag.length > 0">
					<view class="item" v-for="item in listDiag" :key="item.diagnosisCode" @click="clickItem(item)">
						<view v-html="item.htmlName" style="flex:1;"></view>
						
						<view style="margin-right: 30rpx;color: #999999;">{{item.diagnosisCode}}</view>
					</view>
				</view>

				<!-- 常用列表 -->
				<view v-if="value.length==0"
					style="margin-top: 30rpx;color: #1A1A1A;font-size: 30rpx;font-weight: bold;">常用诊断</view>
				<view v-if="value.length==0" class="wrap-constant">
					<view class="cons-item" :class="{checked:item.isChecked}" v-for="item in listConstant"
						:key="item.diagnosisCode" @click="clickItemConstant(item)">{{item.diagnosis}}</view>
				</view>
			</view>

		</u-popup>
	</view>
</template>

<script>
	import {
		formatDate
	} from '../../../components/base/common.js';
	export default {

		data() {
			return {
				//搜索的列表
				listDiag: [],
				//常用列表
				listConstant: [],
				value: '',
				// diagItem: {},
				popupData: {
					overlay: true,
					mode: 'bottom',
					closeable: false,
					// round: 10,
					closeOnClickOverlay: true
				},
				//选中的列表
				diagList: [],
				showPop: false,
			}
		},
		onLoad(option) {

		},

		onReady() {},
		onShow() {
			// let temp = uni.getStorageSync('chufang_diagnosis') || {};
			// this.$set(this.diagItem, 'name', temp.diagnosis)
			// this.$set(this.diagItem, 'icd10Code', temp.diagnosisCode)
		},
		methods: {
			add(diagList) {
				this.showPop = true
				this.diagList = diagList || []

				console.log('add', JSON.stringify(diagList))
				this.getListConstant()
			},
			close() {
				if (this.diagList.length == 0) {
					uni.showToast({
						title: '请添加诊断',
						icon: 'none'
					});
				}
				const cfInfo = uni.getStorageSync('cf-info');
				cfInfo.medicalOrdersCaseList = this.diagList;
				uni.setStorageSync('cf-info', cfInfo);
				// console.log('add diagnosis', diagnosis)
				this.$emit('chang', JSON.parse(JSON.stringify(this.diagList)))
				this.showPop = false
			},
			open() {
				this.showPop = true
			},
			addDiag() {
				this.showPop = true
			},

			/**
			 * 搜索点击
			 * @param {Object} item
			 */
			clickItem(itemClick) {
				// this.diagItem = JSON.parse(JSON.stringify(item))
				// // uni.setStorageSync('chufang_diagnosis', this.diagItem);
				// uni.setStorageSync('chufang_diagnosis', {
				// 	diagnosis: this.diagItem.name,
				// 	diagnosisCode: this.diagItem.icd10Code
				// });
				let findItem = this.diagList.find((item) => item.diagnosisCode == itemClick.diagnosisCode)
				if (!findItem) {
					this.diagList.push({
						diagnosis: itemClick.diagnosis,
						diagnosisCode: itemClick.diagnosisCode,
					})
				}

				const cfInfo = uni.getStorageSync('cf-info');
				cfInfo.medicalOrdersCaseList = this.diagList;
				uni.setStorageSync('cf-info', cfInfo);

				this.$emit('chang', JSON.parse(JSON.stringify(this.diagList)))
				// this.close()
			},

			clickItemConstant(item) {
				item.isChecked = !item.isChecked
				if (item.isChecked) { //添加
					this.diagList.push({
						diagnosis: item.diagnosis,
						diagnosisCode: item.diagnosisCode,
					})
				} else { //删除
					this.diagList = this.diagList.filter(function(itemFi) {
						return itemFi.diagnosisCode != item.diagnosisCode
					})
				}
				console.log('add', JSON.stringify(this.diagList))
				const cfInfo = uni.getStorageSync('cf-info');
				cfInfo.medicalOrdersCaseList = this.diagList;
				uni.setStorageSync('cf-info', cfInfo);
				this.$emit('chang', JSON.parse(JSON.stringify(this.diagList)))
			},

			change() {
				this.value = this.value.trim();
				if (this.value.length > 0) {
					this.getList();
				} else {
					this.listDiag = [];
				}
			},


			getListConstant() {
				uni.$u.http.get('/medical-api/medical/getDocCommonUseDiagnosis', {}).then(res => {
					this.listConstant = res.data || [];
					this.listConstant.forEach((item) => {
						this.$set(item, 'isChecked', false)

						//处理常用的选中逻辑
						let findItem = this.diagList.find((itemIn) => item.diagnosisCode == itemIn
							.diagnosisCode)
						if (findItem) {
							this.$set(item, 'isChecked', true)
						}

					})

				});
			},

			getList() {
				uni.$u.http.get('/info-api/medicine/searchDiagnosis', {
					params: {
						keyWord: this.value.trim()
					}
				}).then(res => {
					res.data = res.data || {};
					let arr = []
					res.data.forEach((item) => {
						// this.$set(item, 'isChecked', false)
						arr.push({
							diagnosis: item.name,
							diagnosisCode: item.icdCode,
						})
					})
					// this.listDiag = res.data.rows || [];
					this.changeColor(arr)
				});

			},

			// 搜索部分文字变色
			changeColor(resultsList) {
				resultsList.map((item, index) => {
					if (this.value) {
						// 匹配关键字正则
						
						let replaceReg = new RegExp(this.value, 'g')
						// 高亮替换v-html值
						let replaceString = '<span class="search-text" style="color:#007BF5;">' + this.value +
							'</span>'
						if (item.diagnosis) {
							// resultsList[index].name = item.name.replace(replaceReg, replaceString)
							this.$set(item, 'htmlName', item.diagnosis.replace(replaceReg, replaceString))
						}
					}
				})
				console.log(resultsList)
				this.listDiag = []
				this.listDiag = resultsList
			},
		}
	}
</script>

<style>
	.wrap-diag {
		background: #F5F5F5;
		font-size: 30rpx;
		color: #1A1A1A;
		/* min-height: 100vh; */
	}

	.wrap-diag .wrap-pop {
		overflow-y: auto;
		width: 97%;
		padding: 24rpx 30rpx;
		height: 810rpx;
	}

	.wrap-diag .wrap-pop .pop-top {
		display: flex;
		padding: 0 30rpx 30rpx 30rpx;
		flex-direction: row;
	}

	.wrap-diag .wrap-pop .inputs {
		width: 97%;
		/* margin: 30rpx 0; */
	}

	.wrap-diag .wrap-pop .result {
		min-height: 600rpx;
		margin-top: 20rpx;
		/* border: 1px solid #CCCCCC; */
		border-radius: 4rpx;
	}

	.wrap-diag .wrap-pop .result .item {
		padding: 15rpx 40rpx;
		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: #1A1A1A;
		display: flex;
		flex-direction: row;
		line-height: 30rpx;
		/* border-bottom: 1px solid #CCCCCC; */
	}

	.wrap-diag .wrap-pop .wrap-constant {
		display: flex;
		/* margin-top: 20rpx; */
		flex-direction: row;
		flex-wrap: wrap;
		align-items: center;
	}

	.wrap-diag .wrap-pop .wrap-constant .cons-item {
		padding: 15rpx 30rpx;
		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: 400;
		margin-top: 30rpx;
		color: #1A1A1A;
		line-height: 30rpx;
		border-radius: 30rpx;
		margin-right: 20rpx;
		border: 1rpx solid #F2F2F2;
		background-color: #F2F2F2;
	}

	.wrap-diag .wrap-pop .wrap-constant .checked {
		padding: 15rpx 30rpx;
		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: #409EFF;
		line-height: 30rpx;
		border-radius: 30rpx;
		border: 1rpx solid #409EFF;
		margin-right: 20rpx;
		background-color: #F6FAFF;
	}
</style>
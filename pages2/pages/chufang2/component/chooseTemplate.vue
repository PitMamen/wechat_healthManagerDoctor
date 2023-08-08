<template>
	<view class="wrap-temp">
		<u-popup :safeAreaInsetBottom="false" :safeAreaInsetTop="false" :mode="popupData.mode" :show="showPop"
			:round="popupData.round" :overlay="popupData.overlay" :borderRadius="popupData.borderRadius"
			:closeable="popupData.closeable" :closeOnClickOverlay="popupData.closeOnClickOverlay" @close="close"
			@open="open">
			<view class="wrap-pop" style="">
				<!-- 的方法給發熱個人 -->
				<u-sticky style="background: white;top:0">
					<view class="pop-top">
						<view style="margin-left: 42%;flex: 1;font-size: 30rpx;font-weight: bold;">用药模版</view>
						<u-icon @click="close" style="margin-right: 30rpx;" name="close" size="18"
							color="#909399"></u-icon>
					</view>
					<view style="height: 1rpx;background-color: #E6E6E6;;"></view>
					<view class="btn-add">
						<view class="btn-add-wrap">
							<u-icon style="margin-right: 30rpx;" name="plus" size="18" color="#409EFF"></u-icon>
							<view style="margin-left: 10rpx;font-size: 30rpx;">添加模版</view>
						</view>
					</view>
				</u-sticky>
				<view style="height: 1rpx;background-color: #E6E6E6;margin-top: 30rpx;"></view>
				<!-- 搜索列表 -->
				<view class="result" v-if="listTemp.length > 0">
					<view class="item" v-for="item in listTemp" :key="item.diagnosisCode">
						<view class="temp-zhenduan">
							<view style="color: #999999;font-size: 28rpx;">诊断：</view>
							<view>{{item.diagnosis||''}}</view>
						</view>
						<view class="temp-medicine">
							<view style="color: #999999;font-size: 28rpx;">药品：</view>

							<view class="temp-medicine-wrap">
								<view class="temp-medicine-item" v-for="itemIn in item.medicalOrdersTemplateDetail"
									:key="itemIn.templateNo">
									<view style="flex: 1;font-size: 28rpx;color: #4D4D4D;">{{itemIn.drugName}}
										{{itemIn.drugSpec}}
									</view>
									<view style="font-size: 28rpx;color: #999999;">x{{itemIn.num}}</view>
								</view>
							</view>

						</view>
						<view class="temp-btn-wrap">
							<view style="flex: 1;"></view>
							<view class="btn" @click="clickItem(item)">选择</view>
						</view>
						<view style="height: 1rpx;background-color: #E6E6E6;margin-top: 30rpx"></view>
					</view>
				</view>
			</view>
		</u-popup>

		<u-modal class="wenzhen-modal" title="温馨提示" showCancelButton cancelText="取消" confirmText="确认" :show="showAsk"
			closeOnClickOverlay @confirm="goFill" @cancel="() => showAsk = false" @close="() => showAsk = false">
			<view>引用模版会覆盖当前的诊断和药品，确认使用？</view>
		</u-modal>
	</view>
</template>

<script>
	export default {

		data() {
			return {
				//搜索的列表
				listTemp: [],
				//常用列表
				value: '',
				item: {},
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
				showAsk: false,
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

				this.getList()
			},
			close() {
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
			clickItem(item) {
				this.item = item
				let cfInfo = uni.getStorageSync('cf-info');

				if ((cfInfo.medicalOrdersCaseList && cfInfo.medicalOrdersCaseList.length > 0) || (cfInfo
						.medicalOrdersDetails && cfInfo.medicalOrdersDetails.length > 0)) {
					this.showAsk = true
				} else {
					this.goFill()
				}

			},

			goFill() {
				let cfInfo = uni.getStorageSync('cf-info');
				let arr = this.item.diagnosis.split(',')
				let arr2 = this.item.diagnosisCode.split(',')
				let arr3 = []

				arr.forEach((item, index) => {
					arr3.push({
						diagnosis: arr[index],
						diagnosisCode: arr2[index]
					})
				})

				cfInfo.medicalOrdersCaseList = arr3

				this.item.medicalOrdersTemplateDetail.forEach((itemIn) => {
					// item.drugCode = item.code;
					// item.price = item.unitPrice;
					// item.drugName = item.genericName;
					// item.drugSpec = item.specification;
					// item.drugUnit = item.valuationUnit;

					this.$set(itemIn, 'code', itemIn.drugCode)
					this.$set(itemIn, 'unitPrice', itemIn.price)
					this.$set(itemIn, 'genericName', itemIn.drugName)
					this.$set(itemIn, 'specification', itemIn.drugSpec)
					this.$set(itemIn, 'valuationUnit', itemIn.drugUnit)

				})
				cfInfo.medicalOrdersDetails = this.item.medicalOrdersTemplateDetail
				uni.setStorageSync('cf-info', cfInfo);
				this.$emit('chang', '')
				this.showAsk = false
				this.close()
			},

			getList() {
				uni.$u.http.get('/medical-api/medical/getMyMedicalTemp', {}).then(res => {
					this.listTemp = res.data || {};
				});

			},
		}
	}
</script>

<style>
	.wrap-temp {
		background: #F5F5F5;
		font-size: 30rpx;
		color: #1A1A1A;
		/* min-height: 100vh; */
	}

	.wrap-temp .wrap-pop {
		overflow-y: auto;
		width: 100%;
		/* padding: 24rpx 30rpx; */
		/* padding: 24rpx 30rpx 24rpx 0; */
		height: 810rpx;
	}

	.wrap-temp .wrap-pop .pop-top {
		display: flex;
		padding: 30rpx 30rpx 30rpx 30rpx;
		flex-direction: row;
		background: white;
	}

	.wrap-temp .wrap-pop .btn-add {
		display: flex;
		flex-direction: row;
		padding-top: 30rpx;
		justify-content: center;
		background: white;
	}

	.wrap-temp .wrap-pop .btn-add .btn-add-wrap {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 20rpx 45rpx;
		color: #409EFF;
		background-color: #F6FAFF;
		border: 1rpx solid #409EFF;
		border-radius: 12rpx;
	}

	.wrap-temp .wrap-pop .input {
		width: 93%;
		/* margin: 30rpx 0; */
	}

	.wrap-temp .wrap-pop .result {
		min-height: 600rpx;
		margin-top: 20rpx;
		/* border: 1px solid #CCCCCC; */
		border-radius: 4rpx;
	}

	.wrap-temp .wrap-pop .result .item {
		/* padding: 15rpx 40rpx; */
		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: #1A1A1A;
		display: flex;
		flex-direction: column;
		line-height: 30rpx;
		/* border-bottom: 1px solid #CCCCCC; */
	}

	.wrap-temp .wrap-pop .result .item .temp-zhenduan {
		display: flex;
		margin-top: 30rpx;
		padding: 0 30rpx;
		flex-direction: row;
		align-items: center;
	}

	.wrap-temp .wrap-pop .result .item .temp-medicine {
		margin-top: 30rpx;
		padding: 0 30rpx;
		display: flex;
		flex-direction: row;
		/* align-items: center; */
	}

	.wrap-temp .wrap-pop .result .item .temp-medicine .temp-medicine-wrap {
		/* margin-top: 30rpx;
		padding: 0 30rpx; */
		display: flex;
		flex: 1;
		flex-direction: column;
		/* align-items: center; */
	}

	.wrap-temp .wrap-pop .result .item .temp-medicine .temp-medicine-wrap .temp-medicine-item {
		display: flex;
		/* margin-top: 30rpx; */
		margin-bottom: 30rpx;
		flex-direction: row;
		flex: 1;
		align-items: center;
	}

	.wrap-temp .wrap-pop .result .item .temp-btn-wrap {
		display: flex;
		flex-direction: row;
		/* margin-top: 30rpx; */
		padding: 0 30rpx;
		align-items: center;
	}

	.wrap-temp .wrap-pop .result .item .temp-btn-wrap .btn {
		padding: 13rpx 25rpx;
		font-size: 28rpx;
		color: #409EFF;
		background-color: #F6FAFF;
		border: 1rpx solid #409EFF;
		border-radius: 26rpx;
	}
</style>
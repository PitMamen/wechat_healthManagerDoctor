<template>
	<view class="wrap">
		<view class="wrap-search">
			<image src="/static/static/images/icon_dot.png" style="width: 26rpx;height: 26rpx;margin-left: 10rpx;">
			</image>
			<view style="margin-left: 20rpx;flex: 1;">
				<u-search v-model="searchName" placeholder="请输入患者姓名、电话查找" :show-action="false" @change="searchChange">
				</u-search>
			</view>
			<image :src="showCondition?'/static/static/images/icon_coned.png':'/static/static/images/icon_con.png'"
				style="width: 26rpx;height: 26rpx;margin-left: 20rpx;" @click="seeCondition">
			</image>
			<view style="font-size: 28rpx;" @click="seeCondition">筛选</view>
		</view>

		<view style="height: 20rpx;background: #F5F5F5;"></view>


		<view style="display: flex;flex-direction: column;flex: 1;" v-if="patientList.length === 0">
			<u-empty mode="data" icon="/static/img/icon_nodata.png"></u-empty>
			<view
				style="display: flex;flex-direction: row;align-items: center;justify-content: center;margin-top: 20rpx;">

				<view class="btn-nodata">清除筛查条件</view>
			</view>
		</view>

		<!-- 待选患者列表 -->
		<view class="wrap-patient" v-else>
			<view class="patient-item" v-for="(item, index) in patientList" :key="index">
				<view>
					<u-checkbox activeColor="#3894FF" :checked="item.isChecked" label="  " :name='index'
						@change="onChange(index)"></u-checkbox>
				</view>

				<view class="patient-item-right">
					<view class="right-row">
						<view style="color: #1A1A1A;font-size: 32rpx;font-weight: bold;">张三</view>
						<view style="width: 1rpx;height: 32rpx;background-color: #1A1A1A;margin-left: 15rpx;"></view>
						<view style="color: #1A1A1A;font-size: 32rpx;margin-left: 15rpx;font-weight: bold;">男</view>
						<view style="width: 1rpx;height: 32rpx;background-color: #1A1A1A;margin-left: 15rpx;"></view>
						<view style="color: #1A1A1A;font-size: 32rpx;margin-left: 15rpx;font-weight: bold;">42岁</view>
					</view>
					<view class="right-row" style="margin-top: 20rpx;">
						<view class="patient-tag">门诊患者</view>
						<view class="patient-tag" style="margin-left: 20rpx;">报到患者</view>
					</view>
					<view class="right-row" style="margin-top: 20rpx;">
						<view style="color: #999999;font-size: 28rpx;">病情描述：</view>
						<view style="color: #1A1A1A;font-size: 28rpx;">肚子疼，胀气</view>
					</view>
					<view class="right-row" style="margin-top: 20rpx;font-size: 28rpx;color: #4D4D4D;">2023-09-08</view>
				</view>
			</view>

		</view>

		<!-- 底部操作面板 -->
		<view class="wrap-bottom">
			<!-- <u-checkbox activeColor="#3894FF" :checked="item.isChecked" label="  " :name='index' -->
			<view style="padding: 20rpx;" @click="allClick">
				<u-checkbox activeColor="#3894FF" :checked="isAll" label="  " :name='index'
					@change="onChangeAll"></u-checkbox>
			</view>

			<view style="display: flex;flex-direction: column;flex: 1;">
				<view style="display: flex;flex-direction: row;font-size: 28rpx;">
					<view style="color: #999999;">全选</view>
					<view style="display: flex;flex-direction: row;align-items: center;margin-left: 20rpx;"
						@click="goUp">
						<view style="color: #1A1A1A;">已选:</view>
						<view style="margin-left: 10rpx;color: #3894FF;">2</view>
						<view style="margin-left: 10rpx;color: #1A1A1A;">人</view>
						<view style="margin-left: 10rpx;">
							<u-icon :name="isUp?'arrow-up':'arrow-down'" color="#409EFF" size="28rpx"></u-icon>
						</view>
					</view>

				</view>
				<view style="color: #999999;font-size: 24rpx;margin-top: 20rpx;">每次最多可选2000人</view>
			</view>
			<view class="btn-next">下一步</view>
		</view>


		<!-- 		<view class="wrap-submit">
			<view class="btn-sub" @click="showChose=true">保存</view>
		</view> -->

		<!-- 筛选弹窗，做了页面顶部一样搜索顶部结构 -->
		<u-overlay :show="showCondition" @click="showCondition = false">
			<view style="height: 100vh;">
				<view class="wrap-search" style="background-color: white;">
					<image src="/static/static/images/icon_dot.png"
						style="width: 26rpx;height: 26rpx;margin-left: 10rpx;">
					</image>
					<view style="margin-left: 20rpx;flex: 1;">
						<u-search v-model="searchName" placeholder="请输入患者姓名、电话查找" :show-action="false"
							@change="searchChange">
						</u-search>
					</view>
					<image
						:src="showCondition?'/static/static/images/icon_coned.png':'/static/static/images/icon_con.png'"
						style="width: 26rpx;height: 26rpx;margin-left: 20rpx;" @click="seeCondition">
					</image>
					<view style="font-size: 28rpx;" @click="seeCondition">筛选</view>
				</view>

				<view style="height: 20rpx;background: #F5F5F5;"></view>

				<!-- 患者标签 -->
				<view class="wrap-tags" style="background-color: white;">
					<view class="tags-top">
						<view style="height: 30rpx;width: 6rpx;background-color: #3894FF;"></view>
						<view style="font-size: 30rpx;color: #4D4D4D;margin-left: 18rpx;">患者标签</view>
					</view>
					<view class="view-tags">
						<view :class="item.isChecked?'tag-item':'tag-item-not'" v-for="(item, index) in tagsData"
							:key="index">{{item.name}}</view>
					</view>
				</view>

				<view style="background-color: white;height: 50rpx;"></view>

				<view class="con-btn" style="background-color: white;">
					<view class="btn-reset"> 重置</view>
					<view class="btn-confirm">确认</view>
				</view>


			</view>
		</u-overlay>

		<!-- 已选弹窗，做了页面底部一样的全选和下一步的底部结构 -->
		<u-overlay :show="showChose" @click="showChose = false">
			<view style="height: 100vh;display: flex;flex-direction: column;">
				<view style="flex: 1;"></view>
				<view
					style="display: flex;flex-direction: row;align-items: center;padding: 30rpx;background-color: white;">
					<view style="flex: 1;color: #1A1A1A;font-size: 30rpx;">
						<view style="margin-left: 45%;">已选患者</view>
					</view>
					<u-icon name="close" color="#1A1A1A" size="35rpx"></u-icon>
				</view>
				<!-- 已选患者列表 -->
				<view class="wrap-patient-chose" style="background-color: white;">
					<view class="patient-item" v-for="(item, index) in patientList" :key="index">
						<!-- 		<view>
							<u-checkbox activeColor="#3894FF" :checked="item.isChecked" label="  " :name='index'
								@change="onChange(index)"></u-checkbox>
						</view> -->

						<view class="patient-item-right">
							<view class="right-row">
								<view style="color: #1A1A1A;font-size: 30rpx;">张三</view>
								<view style="width: 1rpx;height: 32rpx;background-color: #1A1A1A;margin-left: 15rpx;">
								</view>
								<view style="color: #1A1A1A;font-size: 30rpx;margin-left: 15rpx;">男
								</view>
								<view style="width: 1rpx;height: 32rpx;background-color: #1A1A1A;margin-left: 15rpx;">
								</view>
								<view style="color: #1A1A1A;font-size: 30rpx;margin-left: 15rpx;">42岁
								</view>
							</view>
							<view class="right-row" style="margin-top: 20rpx;">
								<view class="patient-tag">门诊患者</view>
								<view class="patient-tag" style="margin-left: 20rpx;">报到患者</view>
							</view>
							<!-- 				<view class="right-row" style="margin-top: 20rpx;">
								<view style="color: #999999;font-size: 28rpx;">病情描述：</view>
								<view style="color: #1A1A1A;font-size: 28rpx;">肚子疼，胀气</view>
							</view>
							<view class="right-row" style="margin-top: 20rpx;font-size: 28rpx;color: #4D4D4D;">
								2023-09-08</view> -->
						</view>
					</view>

				</view>
				<!-- 底部操作面板 -->
				<view class="wrap-bottom" style="background-color: white;">
					<!-- <u-checkbox activeColor="#3894FF" :checked="item.isChecked" label="  " :name='index' -->
					<view style="padding: 20rpx;" @click="allClick">
						<u-checkbox activeColor="#3894FF" :checked="isAll" label="  " :name='index'
							@change="onChangeAll"></u-checkbox>
					</view>

					<view style="display: flex;flex-direction: column;flex: 1;">
						<view style="display: flex;flex-direction: row;font-size: 28rpx;">
							<view style="color: #999999;">全选</view>
							<view style="display: flex;flex-direction: row;align-items: center;margin-left: 20rpx;"
								@click="goUp">
								<view style="color: #1A1A1A;">已选:</view>
								<view style="margin-left: 10rpx;color: #3894FF;">2</view>
								<view style="margin-left: 10rpx;color: #1A1A1A;">人</view>
								<view style="margin-left: 10rpx;">
									<u-icon :name="isUp?'arrow-up':'arrow-down'" color="#409EFF" size="28rpx"></u-icon>
								</view>
							</view>

						</view>
						<view style="color: #999999;font-size: 24rpx;margin-top: 20rpx;">每次最多可选2000人</view>
					</view>
					<view class="btn-next">下一步</view>
				</view>

			</view>
		</u-overlay>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				info: {},
				patientList: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
				// patientList: [],
				patientListChose: [],
				searchName: '',
				isUp: true,
				isAll: false,
				showChose: false,
				showCondition: false,
				tagsData: [{
						name: '基本信息',
						isChecked: false,
						num: 1,
						id: 1
					},
					{
						name: '发热热',
						isChecked: false,
						num: 1,
						id: 2
					}, {
						name: '发热fr热',
						isChecked: true,
						num: 1,
						id: 3
					},
					{
						name: '发热热',
						isChecked: false,
						num: 1,
						id: 2
					}, {
						name: '发热fr热',
						isChecked: true,
						num: 1,
						id: 3
					},
					{
						name: '发热热',
						isChecked: false,
						num: 1,
						id: 2
					}, {
						name: '发热fr热',
						isChecked: true,
						num: 1,
						id: 3
					},


				],
			}
		},
		onLoad() {
			this.info = uni.getStorageSync('cashItem');
		},
		onReady() {},
		onShow() {},
		methods: {

			seeCondition() {
				this.showCondition = true
			},
			searchChange(name) {
				if (name) {
					this.getPatientList(name)
				}
			},

			getPatientList(name) {},


			/**
			 * isAll为true 全选  isAll为false 不全选
			 */
			allClick() {
				this.isAll = !this.isAll
				uni.showToast({
					title: this.isAll ? '全选了' : '取消全选',
					icon: 'success'
				});

			},

			onChangeAll() {
				this.isAll = !this.isAll
				uni.showToast({
					title: this.isAll ? '全选了' : '取消全选',
					icon: 'success'
				});

			},



			goUp() {
				this.isUp = !this.isUp
				this.showChose = !this.isUp
			},

			itemClick() {
				uni.navigateTo({
					url: `/pages3/pages/cash/out-info?id=${this.info.id}&types=提`
				});
			},

			onChange(index) {
				console.log("index------------------", index)
				console.log('onChange Before', this.tagsData[index].isChecked)
				this.tagsData[index].isChecked = !this.tagsData[index].isChecked
				console.log('onChange After', this.tagsData[index].isChecked)
			},

			onItemTap(item) {
				console.log('onItemTap Before', JSON.stringify(item))
				item.isChecked = !item.isChecked
				console.log('onItemTap After', JSON.stringify(item))
			}
		}
	}
</script>

<style lang="scss">
	.wrap {
		height: 100vh;
		display: flex;
		flex-direction: column;
		background: #fff;

		.wrap-search {
			display: flex;
			flex-direction: row;
			align-items: center;
			padding-left: 30rpx;
			padding-right: 30rpx;
			height: 120rpx;
		}

		.wrap-patient {
			flex: 1;
			// height: 80vh;
			display: flex;
			overflow-y: auto;
			flex-direction: column;

			.patient-item {
				display: flex;
				flex-direction: row;
				margin: 30rpx;
				border-bottom: 1rpx solid #E6E6E6;

				.patient-item-right {
					display: flex;
					flex-direction: column;
					margin-left: 20rpx;
					padding-bottom: 20rpx;

					.right-row {
						display: flex;
						flex-direction: row;
						align-items: center;

						.patient-tag {
							color: white;
							background-color: #65BEFE;
							padding: 10rpx 15rpx;
							font-size: 24rpx;
							border-radius: 5rpx;
						}
					}
				}
			}
		}

		.wrap-patient-chose {
			// flex: 1;
			// height: 80vh;
			max-height: 60vh;
			display: flex;
			overflow-y: auto;
			flex-direction: column;

			.patient-item {
				display: flex;
				flex-direction: row;
				background-color: #F5F5F5;
				margin: 0 30rpx 30rpx 30rpx;
				// margin: 30rpx;
				// border-bottom: 1rpx solid #E6E6E6;

				.patient-item-right {
					display: flex;
					flex-direction: column;
					padding: 20rpx;
					// margin-left: 20rpx;
					padding-bottom: 20rpx;

					.right-row {
						display: flex;
						flex-direction: row;
						align-items: center;

						.patient-tag {
							color: white;
							background-color: #65BEFE;
							padding: 10rpx 15rpx;
							font-size: 24rpx;
							border-radius: 5rpx;
						}
					}
				}
			}
		}

		.wrap-tags {
			display: flex;
			flex-direction: column;
			padding-left: 30rpx;
			padding-right: 30rpx;

			.tags-top {
				display: flex;
				flex-direction: row;
				align-items: center;
				padding-top: 20rpx;
				padding-bottom: 20rpx;
			}

			.view-tags {
				display: flex;
				flex-direction: row;
				align-items: center;
				flex-wrap: wrap;

				.tag-item {
					padding: 10rpx 30rpx;
					background-color: white;
					color: #3894FF;
					border-radius: 26rpx;
					font-size: 24rpx;
					margin-bottom: 10rpx;
					margin-right: 20rpx;
					border: 1rpx solid #3894FF;
				}

				.tag-item-not {
					padding: 10rpx 30rpx;
					background-color: #F5F5F5;
					color: #4D4D4D;
					border-radius: 26rpx;
					font-size: 24rpx;
					margin-bottom: 10rpx;
					margin-right: 20rpx;
					border: 1rpx solid #F5F5F5;
				}
			}
		}

		.con-btn {
			display: flex;
			flex-direction: row;
			align-items: center;

			.btn-reset {
				width: 50%;
				padding: 27rpx 0;
				text-align: center;
				box-sizing: border-box;
				border-top: 1px solid #E6E6E6;
				font-size: 30rpx;
				color: #1A1A1A;
			}

			.btn-confirm {
				width: 50%;
				padding: 27rpx 0;
				text-align: center;
				color: white;
				font-size: 30rpx;
				background: #3894FF;
			}
		}

		.wrap-bottom {
			height: 110rpx;
			display: flex;
			border-top: 1rpx solid #E6E6E6;
			flex-direction: row;
			align-items: center;
			padding: 30rpx;

			.btn-next {
				color: white;
				background-color: #3894FF;
				padding: 15rpx 35rpx;
				font-size: 30rpx;
				border-radius: 30rpx;
			}
		}

		.btn-nodata {
			color: white;
			background-color: #3894FF;
			padding: 15rpx 35rpx;
			font-size: 30rpx;
			border-radius: 30rpx;
		}


	}
</style>
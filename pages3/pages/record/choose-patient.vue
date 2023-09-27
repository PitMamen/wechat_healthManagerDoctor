<template>
	<view class="wrap">
		<view class="wrap-search">
			<!-- <image src="/static/static/images/icon_dot.png" style="width: 26rpx;height: 26rpx;margin-left: 10rpx;"> -->
			<!-- </image> -->
			<view style="margin-left: 20rpx;flex: 1;">
				<u-search v-model="searchName" placeholder="请输入患者姓名、电话查找" :show-action="false" @change="searchChange">
				</u-search>
			</view>
			<image :src="showCondition?'/static/static/images/icon_coned.png':'/static/static/images/icon_con.png'"
				style="width: 32rpx;height: 32rpx;margin-left: 20rpx;margin-right: 10rpx;" @click="seeCondition">
			</image>
			<view style="font-size: 28rpx;" @click="seeCondition">筛选</view>
		</view>

		<view style="height: 20rpx;background: #F5F5F5;"></view>


		<view style="display: flex;flex-direction: column;flex: 1;" @click="clearTags" v-if="patientList.length === 0">
			<u-empty mode="data" icon="/static/img/icon_nodata.png"></u-empty>
			<view
				style="display: flex;flex-direction: row;align-items: center;justify-content: center;margin-top: 20rpx;">

				<view class="btn-nodata">清除筛查条件</view>
			</view>
		</view>

		<!-- 待选患者列表 -->
		<view class="wrap-patient" v-else>
			<view class="patient-item" v-for="(item, index) in patientList" :key="index" @click="onChangePatient(item)">
				<view>
					<u-checkbox activeColor="#3894FF" :checked="item.isChecked" label="  " :name='index'
						@change="onChangePatient(item)"></u-checkbox>
				</view>

				<view class="patient-item-right">
					<view class="right-row">
						<view style="color: #1A1A1A;font-size: 32rpx;font-weight: bold;">{{item.user_name}}</view>
						<view style="width: 1rpx;height: 32rpx;background-color: #1A1A1A;margin-left: 15rpx;"></view>
						<view style="color: #1A1A1A;font-size: 32rpx;margin-left: 15rpx;font-weight: bold;">
							{{item.user_sex}}
						</view>
						<view style="width: 1rpx;height: 32rpx;background-color: #1A1A1A;margin-left: 15rpx;"></view>
						<view style="color: #1A1A1A;font-size: 32rpx;margin-left: 15rpx;font-weight: bold;">
							{{item.birthday}}岁
						</view>
					</view>
					<view class="right-row" style="margin-top: 20rpx;">
						<view class="patient-tag" style="margin-right: 20rpx;"
							v-for="(itemChild, indexChild) in item.tags" :key="index">{{itemChild}}</view>
						<!-- 	<view class="patient-tag">门诊患者</view>
						<view class="patient-tag" style="margin-left: 20rpx;">报到患者</view> -->
					</view>
					<view class="right-row" style="margin-top: 20rpx;">
						<view style="color: #999999;font-size: 28rpx;">病情描述：</view>
						<!-- 限制一行 -->
						<view
							style="color: #1A1A1A;font-size: 28rpx;	white-space: nowrap;text-overflow:ellipsis;overflow: hidden;">
							{{item.remark||'无'}}
						</view>
					</view>
					<view class="right-row" style="margin-top: 20rpx;font-size: 28rpx;color: #4D4D4D;">
						{{item.create_time}}
					</view>
				</view>
			</view>

		</view>

		<!-- 底部操作面板 -->
		<view class="wrap-bottom">
			<!-- <u-checkbox activeColor="#3894FF" :checked="item.isChecked" label="  " :name='index' -->
			<view style="padding: 20rpx;" @click="onChangeAll">
				<u-checkbox activeColor="#3894FF" :checked="isAll" label="  " :name='index'
					@change="onChangeAll"></u-checkbox>
			</view>

			<view style="display: flex;flex-direction: column;flex: 1;">
				<view style="display: flex;flex-direction: row;font-size: 28rpx;">
					<view style="color: #999999;">全选</view>
					<view style="display: flex;flex-direction: row;align-items: center;margin-left: 20rpx;"
						@click="goUp">
						<view style="color: #1A1A1A;">已选:</view>
						<view style="margin-left: 10rpx;color: #3894FF;">{{patientListChose.length}}</view>
						<view style="margin-left: 10rpx;color: #1A1A1A;">人</view>
						<view style="margin-left: 10rpx;">
							<u-icon :name="isUp?'arrow-up':'arrow-down'" color="#409EFF" size="28rpx"></u-icon>
						</view>
					</view>

				</view>
				<view style="color: #999999;font-size: 24rpx;margin-top: 20rpx;">每次最多可选2000人</view>
			</view>
			<view class="btn-next" @click="goNext" v-if="options.type=='ArticleMessage'">发送</view>
			<view class="btn-next" @click="goNext" v-else>下一步</view>
		</view>

		<!-- 筛选弹窗，做了页面顶部一样搜索顶部结构 -->
		<!-- <u-overlay :show="showCondition" @click="showCondition = false"> -->
		<u-overlay :show="showCondition">
			<view style="height: 100vh;">
				<!-- 弹窗的搜索元素 -->
				<view class="wrap-search" style="background-color: white;">
					<!-- <image src="/static/static/images/icon_dot.png"
						style="width: 26rpx;height: 26rpx;margin-left: 10rpx;">
					</image> -->
					<view style="margin-left: 20rpx;flex: 1;">
						<u-search v-model="searchName" placeholder="请输入患者姓名、电话查找" :show-action="false"
							@change="searchChange">
						</u-search>
					</view>
					<image
						:src="showCondition?'/static/static/images/icon_coned.png':'/static/static/images/icon_con.png'"
						style="width: 32rpx;height: 32rpx;margin-left: 20rpx;margin-right: 10rpx;"
						@click="seeCondition">
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
						<view @click="onTagClick(item)" :class="item.isChecked?'tag-item':'tag-item-not'"
							v-for="(item, index) in tagsData" :key="index">{{item.tags_name}}</view>
					</view>
				</view>

				<view style="background-color: white;height: 50rpx;"></view>

				<view class="con-btn" style="background-color: white;">
					<view class="btn-reset" @click="resetTags"> 重置</view>
					<view class="btn-confirm" @click="confirmTags">确认</view>
				</view>


			</view>
		</u-overlay>

		<!-- 已选弹窗，做了页面底部一样的全选和下一步的底部结构 -->
		<!-- <u-overlay :show="showChose" @click="showChose = false"> -->
		<u-overlay :show="showChose">
			<view style="height: 100vh;display: flex;flex-direction: column;">
				<view style="flex: 1;"></view>
				<view
					style="display: flex;flex-direction: row;align-items: center;padding: 30rpx;background-color: white;">
					<view style="flex: 1;color: #1A1A1A;font-size: 30rpx;">
						<view style="margin-left: 45%;">已选患者</view>
					</view>
					<u-icon name="close" color="#1A1A1A" size="35rpx" @click="closeChoseWindow"></u-icon>
				</view>
				<view style="background-color: white;padding-bottom: 30rpx;" v-if="patientListChose.length==0">
					<u-empty mode="data" icon="/static/img/icon_nodata.png"></u-empty>
				</view>
				<!-- 已选患者列表 -->
				<view v-else class="wrap-patient-chose" style="background-color: white;">
					<view class="patient-item" v-for="(item, index) in patientListChose" :key="index">

						<view class="patient-item-right">
							<view class="right-row">
								<view style="color: #1A1A1A;font-size: 30rpx;">{{item.user_name}}</view>
								<view style="width: 1rpx;height: 32rpx;background-color: #1A1A1A;margin-left: 15rpx;">
								</view>
								<view style="color: #1A1A1A;font-size: 30rpx;margin-left: 15rpx;">{{item.user_sex}}
								</view>
								<view style="width: 1rpx;height: 32rpx;background-color: #1A1A1A;margin-left: 15rpx;">
								</view>
								<view style="color: #1A1A1A;font-size: 30rpx;margin-left: 15rpx;">{{item.birthday}}
								</view>
							</view>
							<view class="right-row" style="margin-top: 20rpx;">
								<view class="patient-tag" style="margin-right: 20rpx;"
									v-for="(itemChild, indexChild) in item.tags" :key="index">{{itemChild}}</view>
							</view>

						</view>
						<u-icon name="close" color="#1A1A1A" size="30rpx" @click="deleteChose(item,index)"></u-icon>
					</view>

				</view>
				<!--已选弹窗的  底部操作面板 -->
				<view class="wrap-bottom" style="background-color: white;">
					<!-- <u-checkbox activeColor="#3894FF" :checked="item.isChecked" label="  " :name='index' -->
					<view style="padding: 20rpx;" @click="onChangeAll">
						<u-checkbox activeColor="#3894FF" :checked="isAll" label="  " :name='index'
							@change="onChangeAll"></u-checkbox>
					</view>

					<view style="display: flex;flex-direction: column;flex: 1;">
						<view style="display: flex;flex-direction: row;font-size: 28rpx;">
							<view style="color: #999999;">全选</view>
							<view style="display: flex;flex-direction: row;align-items: center;margin-left: 20rpx;"
								@click="goUp">
								<view style="color: #1A1A1A;">已选:</view>
								<view style="margin-left: 10rpx;color: #3894FF;">{{patientListChose.length}}</view>
								<view style="margin-left: 10rpx;color: #1A1A1A;">人</view>
								<view style="margin-left: 10rpx;">
									<u-icon :name="isUp?'arrow-up':'arrow-down'" color="#409EFF" size="28rpx"></u-icon>
								</view>
							</view>

						</view>
						<view style="color: #999999;font-size: 24rpx;margin-top: 20rpx;">每次最多可选2000人</view>
					</view>
					<view class="btn-next" @click="goNext" v-if="options.type=='ArticleMessage'">发送</view>
					<view class="btn-next" @click="goNext" v-else>下一步</view>
				</view>

			</view>
		</u-overlay>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				options: '',
				info: {},
				patientList: [],
				// patientList: [],
				patientListChose: [],
				patientsTemp: [],
				tagsIdChose: [],
				searchName: '',
				name: '',
				isUp: true,
				flag: false,
				isTagChose: false, //只有在筛选条件切换标签后，勾选全选才会生效
				isAll: false,
				// isReloaded: false, //每次重新获取患者列表的时候，需要在全选，全不选，单个选择的时候都做删除或者去重添加
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
		/**
		 * 整体的选中逻辑是，任何一种筛选条件都展示新的列表，勾选或全选都去重添加到已选或者删除已选
		 */
		onLoad(options) {
			this.options = options
			this.info = uni.getStorageSync('cashItem');
			this.getTagsList()
		},
		onReady() {},
		onShow() {
			this.getPatientList()
		},
		methods: {

			seeCondition() {
				this.showCondition = true
			},
			searchChange(name) {
				this.name = name
				this.getPatientList()
				// if (name) {
				// 	this.getPatientList()
				// }
			},

			resetTags() {
				this.tagsData.forEach((item) => {
					this.$set(item, 'isChecked', false)
				})
				this.tagsIdChose = []
			},

			clearTags() {
				this.resetTags()
				this.getPatientList()
			},

			confirmTags() {
				this.getPatientList()
				this.showCondition = false
			},

			onTagClick(item) {
				item.isChecked = !item.isChecked
				if (item.isChecked) {
					this.tagsIdChose.push(item.id)
					console.log('onTagClick choose', JSON.stringify(this.tagsIdChose))
					this.isTagChose = true
				} else {
					// this.tagsIdChose.push(item.id)

					this.tagsIdChose = this.tagsIdChose.filter(element => item.id != element)
					console.log('onTagClick unchoose', JSON.stringify(this.tagsIdChose))
				}
			},

			// 标签下的患者列表
			getPatientList() {
				uni.showLoading({
					title: '正在加载'
				});
				uni.$u.http.post(`/account-api/tdUserTags/getPatientListByTags`, {
					pageNo: 1,
					pageSize: 10000,
					tagsIds: this.tagsIdChose.length > 0 ? this.tagsIdChose.join(',') : '',
					queryStr: this.name,

				}).then(res => {
					uni.hideLoading();
					// if (res.code == 0 && res.data.records.length > 0) {
					if (res.code == 0) {
						console.log('getPatientList', JSON.stringify(res.data.records))
						this.patientList = res.data.records
						//展示已选的
						if (this.patientListChose.length > 0) {
							this.displayChecked()
						}
					}
				}).finally(() => {
					uni.hideLoading();
				});
			},

			// 标签列表
			getTagsList() {
				// uni.$u.http.post(`/account-api/tdUserTags/getUserTags`, {
				uni.$u.http.post(`/account-api/tdUserTags/getUserTagsDoctor`, {
					pageNo: 1,
					pageSize: 10000,
					tagsType: 2
					// userIds: 355, //TODO 调试测试代码，后期注释,不需要这个参数
				}).then(res => {
					if (res.code == 0) {
						this.tagsData = res.data.records
						this.resetTags()
					}
				}).finally(() => {});
			},

			onChangePatient(item) {

				item.isChecked = !item.isChecked
				if (!item.isChecked) { //取消了
					this.patientListChose = this.patientListChose.filter(element => item.patient_user_id != element
						.patient_user_id)
					if (this.isAll) {
						this.isAll = false
					}
				} else { //选中了  去重添加
					this.addPatientItem(item)
				}
				console.log('onChangePatient', JSON.stringify(this.patientListChose))
			},

			/**
			 * isAll为true 全选  isAll为false 不全选
			 */
			onChangeAll() {
				if (this.patientList.length == 0) {
					uni.$u.toast('患者列表为空');
					return
				}

				this.isAll = !this.isAll
				if (this.isAll) {
					this.patientList.forEach((item) => {
						this.$set(item, 'isChecked', true)
					})

					//勾选标签时需要清空已选
					if (this.tagsIdChose.length > 0 && this.isTagChose) {
						this.patientListChose = []
					}

					//去重添加
					this.patientList.forEach((item) => {
						this.addPatientItem(item)
					})

					this.isTagChose = false

				} else {
					this.patientList.forEach((item) => {
						this.$set(item, 'isChecked', false)
					})

					//找到后删除
					if (this.patientListChose.length > 0) {
						this.patientList.forEach((item) => {
							let haveIndex = this.patientListChose.findIndex((itemTemp,
								indexTemp) => {
								return itemTemp.patient_user_id == item.patient_user_id
							})
							if (haveIndex != -1) {
								this.patientListChose.splice(haveIndex, 1)
							}

						})
					}

				}

				this.isReloaded = false
			},

			deleteChose(item, index) {
				this.patientListChose.splice(index, 1)
				if (this.patientList.length > 0) {
					for (let num = 0; num < this.patientList.length; num++) {
						if (this.patientList[num].patient_user_id == item.patient_user_id) {
							this.patientList[num].isChecked = false
						}

					}
				}
			},


			addPatientItem(item) {
				if (this.patientListChose.length > 0) {
					let itemTemp = this.patientListChose.find((element) => element.patient_user_id == item.patient_user_id)
					if (!itemTemp) {
						this.patientListChose.push(JSON.parse(JSON.stringify(item)))
					}
				} else {
					this.patientListChose.push(JSON.parse(JSON.stringify(item)))
				}
			},

			displayChecked() {
				this.patientList.forEach((item) => {
					let itemTemp = this.patientListChose.find((element) => element.patient_user_id == item
						.patient_user_id)
					if (itemTemp) {
						item.isChecked = true
					}
				})
			},


			goUp() {
				this.isUp = !this.isUp
				this.showChose = !this.isUp
			},

			closeChoseWindow() {
				this.showChose = false
				this.isUp = true
			},

			goNext() {
				if (this.patientListChose.length == 0) {
					uni.$u.toast('请选择患者！');
					return
				}
				uni.setStorageSync('cache_chose_patients', this.patientListChose);
				//TODO 处理跳转
				uni.$u.toast('下一步');
				if (this.options.type == 'TextMessage') {
					//发送文字消息
					uni.navigateTo({
						url: './message-text'
					})
				} else if (this.options.type == 'ArticleMessage') {
					if (this.flag) {
						return;
					}
					this.flag = true;
					uni.showLoading({
						title: '发送中'
					});
					uni.$u.http.post('/medical-api/tlSendImMessageLog/addImMessageLog', {
						...uni.getStorageSync('articleMsgReq'),
						messageType: 2,
						sendUserIds: this.patientListChose.map(item => {
							return item.patient_user_id
						})
					}).then(res => {
						uni.hideLoading();
						uni.showToast({
							title: '发送成功',
							icon: 'success'
						});
						setTimeout(() => {
							uni.navigateBack({
								delta: 1
							});
						}, 1500);
					}).catch(err => {
						this.flag = false;
					});
				}
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
						flex-wrap: wrap;
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
				padding-right: 20rpx;
				// margin: 30rpx;
				// border-bottom: 1rpx solid #E6E6E6;

				.patient-item-right {
					display: flex;
					flex-direction: column;
					flex: 1;
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
				max-height: 50vh;
				overflow-y: auto;
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
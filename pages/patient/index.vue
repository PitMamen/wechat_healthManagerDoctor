<template>
	<view class="wrap">
		<u-sticky>
			<view class="wrap-search">
				<image src="/static/static/images/icon_dot.png" style="width: 26rpx;height: 26rpx;margin-left: 10rpx;">
				</image>
				<view style="margin-left: 20rpx;flex: 1;">
					<u-search v-model="searchName" placeholder="请输入患者姓名、电话查找" :show-action="false" @change="searchChange">
					</u-search>
				</view>
				<image :src="hasTagChecked?'/static/static/images/icon_coned.png':'/static/static/images/icon_con.png'"
					style="width: 26rpx;height: 26rpx;margin-left: 20rpx;margin-right: 10rpx;" @click="seeCondition">
				</image>
				<view :style="hasTagChecked?'font-size: 28rpx;color: #3894FF;':'font-size: 28rpx;color: #999999;'" @click="seeCondition">筛选</view>
			</view>
		</u-sticky>


		<view style="height: 20rpx;background: #F5F5F5;"></view>


		<view style="display: flex;flex-direction: column;flex: 1;" v-if="patientList.length === 0">
			<u-empty mode="data" icon="/static/img/icon_nodata.png" text=" "></u-empty>
			<view
				style="display: flex;flex-direction: row;align-items: center;justify-content: center;margin-top: 20rpx;">
				
				<view class="btn-nodata" @click="tagReset()">清除筛查条件</view>
			</view>
		</view>

		<!-- 待选患者列表 -->
		<view class="wrap-patient" v-else>
			<view class="patient-item" v-for="(item, index) in patientList" :key="index">
				

				<view class="patient-item-right">
					<view class="right-row">
						<view style="color: #1A1A1A;font-size: 32rpx;font-weight: bold;">{{item.user_name}}</view>
						<view style="width: 1rpx;height: 32rpx;background-color: #1A1A1A;margin-left: 15rpx;"></view>
						<view style="color: #1A1A1A;font-size: 32rpx;margin-left: 15rpx;font-weight: bold;">{{item.user_sex}}</view>
						<view style="width: 1rpx;height: 32rpx;background-color: #1A1A1A;margin-left: 15rpx;"></view>
						<view style="color: #1A1A1A;font-size: 32rpx;margin-left: 15rpx;font-weight: bold;">{{item.birthday}}岁</view>
					</view>
					<view class="right-row" style="margin-top: 20rpx;">
						<view class="patient-tag" v-for="(tagitem, tagindex) in item.tags">{{tagitem}}</view>
						
					</view>
					<view class="right-row" style="margin-top: 20rpx;">
						<view style="color: #999999;font-size: 28rpx;">病情描述：</view>
						<view class="des">{{item.remark || ''}}</view>
					</view>
					<view class="right-row" style="margin-top: 20rpx;font-size: 28rpx;color: #4D4D4D;">{{item.create_time}}</view>
				</view>
			</view>
			<u-loadmore v-if="patientList.length>0" :status="status" color="#999999" />
		</view>

		

		<!-- 筛选弹窗，做了页面顶部一样搜索顶部结构 -->
		<u-overlay :show="showCondition"   mask-click-able="false">
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
						:src="hasTagChecked?'/static/static/images/icon_coned.png':'/static/static/images/icon_con.png'"
						style="width: 26rpx;height: 26rpx;margin-left: 20rpx;margin-right: 10rpx;" @click="seeCondition">
					</image>
					<view :style="hasTagChecked?'font-size: 28rpx;color: #3894FF;':'font-size: 28rpx;color: #999999;'" @click="seeCondition">筛选</view>
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
							:key="index" @click="onTagChange(index)">{{item.name}}</view>
					</view>
				</view>

				<view style="background-color: white;height: 50rpx;"></view>

				<view class="con-btn" style="background-color: white;">
					<view class="btn-reset" @click="tagReset()"> 重置</view>
					<view class="btn-confirm" @click="tagConfrim()">确认</view>
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
				patientList: [],
				status: 'loadmore',
				isCompleted: false,
				requestData: {
					tagsIds: '1111',
					pageNo: 1,
					pageSize: 20,
				},
				patientListChose: [],
				searchName: '',
				isUp: true,
				isAll: false,
				showChose: false,
				showCondition: false,
				hasTagChecked:false,
				tagsData: [],
			}
		},
		onLoad() {
			this.info = uni.getStorageSync('cashItem');
			this.getTagList()
			this.getData(true)
		},
		onReady() {},
		onShow() {},
		//下拉刷新监听
		onPullDownRefresh() {
			console.log('refresh');
		
			this.getData(true)
		},
		//加载更多
		onReachBottom() {
			if (this.isCompleted) return;
			this.status = 'loading';
			this.getData(false)
		
		},
		methods: {
			//标签列表
			getTagList() {
				uni.$u.http.post('/account-api/tdUserTags/getUserTagsDoctor', 
				{
					"pageNo": 1,
					"pageSize": 99999,
				}
				).then(res => {
					var list= res.data.records || [];
					this.tagsData=(res.data.records || []).map((item)=>{
						return {
							name: item.tagsName,
							isChecked: false,
							id: item.id
						}
					})
					
				});
			
			},
			
			//患者列表
			getData(isRefresh) {
				if (isRefresh) {
					this.isCompleted = false
					this.requestData.pageNo = 1
					uni.showLoading({
						title: '加载中'
					})
				} else {
					this.requestData.pageNo = this.requestData.pageNo + 1
				}
				uni.$u.http.post('/account-api/tdUserTags/getPatientListByTags',
					this.requestData
				).then(res => {
					if (res.code === 0) {
						var list = res.data.records
			
						if (isRefresh) {
							this.patientList = list
						} else {
							this.patientList = [...this.patientList, ...list];
						}
			
			
						if (res.data.current >= res.data.pages) {
							this.isCompleted = true
							this.status = 'nomore';
			
						} else {
							this.status = 'loadmore';
						}
			
			
			
					}
					uni.stopPullDownRefresh();
					uni.hideLoading()
				})
			},
			//筛选按钮
			seeCondition() {
				this.showCondition = !this.showCondition
			},
			//标签选择
			onTagChange(index) {
				
				this.tagsData[index].isChecked = !this.tagsData[index].isChecked
				
			},
			//筛选重置
			tagReset(){
				this.showCondition =false
				this.hasTagChecked=false
				this.tagsData.forEach(item=>{
					item.isChecked=false
				})
				this.requestData.tagsIds=''
				this.getData(true)
			},
			//筛选确认
			tagConfrim(){
				this.showCondition =false
				this.requestData.tagsIds=this.tagsData.filter(item=>{
					return item.isChecked
				}).map(item=>{
					return item.id
				}).join(',')
				
				this.hasTagChecked=this.requestData.tagsIds && this.requestData.tagsIds.length>0
				
				this.getData(true)
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

			

			onItemTap(item) {
				console.log('onItemTap Before', JSON.stringify(item))
				item.isChecked = !item.isChecked
				console.log('onItemTap After', JSON.stringify(item))
			}
		}
	}
</script>

<style lang="scss">
	page{
		background: #fff;
	}
	
	.wrap {
		
		display: flex;
		flex-direction: column;
		

		.wrap-search {
			display: flex;
			flex-direction: row;
			align-items: center;
			padding-left: 30rpx;
			padding-right: 30rpx;
			height: 120rpx;
			background: white;
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
					
					padding-bottom: 20rpx;

					.right-row {
						display: flex;
						flex-direction: row;
						align-items: center;
						
						.des{
							font-size: 28rpx;
							color: #1A1A1A;
							line-height: 37rpx;
							width: 545rpx;
							overflow: hidden; 
							text-overflow: ellipsis; 
							display: -webkit-box;
							-webkit-line-clamp: 1; 
							-webkit-box-orient: vertical;
						}

						.patient-tag {
							color: white;
							background-color: #65BEFE;
							padding: 10rpx 15rpx;
							font-size: 24rpx;
							border-radius: 5rpx;
							margin-right: 20rpx;
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
							margin-right: 20rpx;
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
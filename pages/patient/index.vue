<template>
	<view class="wrap">
		<u-sticky v-if="account && account.accountId && account.bindStatus == 0">
			<view class="wrap-search">
				<image @click="showMenuBtn()" src="/static/static/images/icon_dot.png" style="width: 36rpx;height: 36rpx;padding-left: 30rpx;">
				</image>
				<view style="margin-left: 20rpx;flex: 1;">
					<u-search v-model="searchName" placeholder="请输入患者姓名、电话查找" :show-action="false" @change="onSearch">
					</u-search>
				</view>
				<image :src="hasTagChecked?'/static/static/images/icon_coned.png':'/static/static/images/icon_con.png'"
					style="width: 32rpx;height: 32rpx;margin-left: 20rpx;margin-right: 10rpx;" @click="seeCondition">
				</image>
				<view :style="hasTagChecked?'font-size: 28rpx;color: #3894FF;padding-right:30rpx':'font-size: 28rpx;color: #999999;padding-right:30rpx'" @click="seeCondition">筛选</view>
			</view>
		</u-sticky>

		<view class="identyView" v-else @click="goIdentify">
			<view class="identyitem">
				<view>您可以进行实名认证</view>
				<view style="margin-top: 33rpx;font-size: 28rpx;color: #AED3FF;">实名认证通过后可以使用更多功能</view>
			</view>
			<view class="identyright">
				<view>实名认证</view>
			</view>
		</view>
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
			<view class="patient-item" v-for="(item, index) in patientList" :key="index" @click="onPatientItemClick(item)">
				

				<view class="patient-item-right">
					<view class="right-row">
						<view style="color: #1A1A1A;font-size: 32rpx;font-weight: bold;">{{item.user_name}}</view>
						<view style="width: 1rpx;height: 32rpx;background-color: #1A1A1A;margin-left: 15rpx;"></view>
						<view style="color: #1A1A1A;font-size: 32rpx;margin-left: 15rpx;font-weight: bold;">{{item.user_sex}}</view>
						<view style="width: 1rpx;height: 32rpx;background-color: #1A1A1A;margin-left: 15rpx;"></view>
						<view style="color: #1A1A1A;font-size: 32rpx;margin-left: 15rpx;font-weight: bold;">{{item.birthday}}岁</view>
					</view>
					<view class="tag-row" style="margin-top: 20rpx;">
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
						style="width: 36rpx;height: 36rpx;padding-left: 30rpx;">
					</image>
					<view style="margin-left: 20rpx;flex: 1;">
						<u-search v-model="searchName" placeholder="请输入患者姓名、电话查找" :show-action="false" disabled>
						</u-search>
					</view>
					<image
						:src="hasTagChecked?'/static/static/images/icon_coned.png':'/static/static/images/icon_con.png'"
						style="width: 32rpx;height: 32rpx;margin-left: 20rpx;margin-right: 10rpx;" @click="seeCondition">
					</image>
					<view :style="hasTagChecked?'font-size: 28rpx;color: #3894FF;padding-right:30rpx':'font-size: 28rpx;color: #999999;padding-right:30rpx'" @click="seeCondition">筛选</view>
				</view>

				<view style="height: 20rpx;background: #F5F5F5;"></view>

				<!-- 患者标签 -->
				<scroll-view scroll-y="true" style="max-height: 70vh;">
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
				</scroll-view>
				
				

				<view class="con-btn" style="background-color: white;">
					<view class="btn-reset" @click="tagReset()"> 重置</view>
					<view class="btn-confirm" @click="tagConfrim()">确认</view>
				</view>


			</view>
		</u-overlay>

		<!-- 筛选弹窗，做了页面顶部一样搜索顶部结构 -->
		<u-overlay :show="showMenu"    :opacity="0"  @click="showMenu = false">
			<view style="height: 100vh;" >
				<view class="wrap-search" style="background-color: white;">
					<image @click="showMenuBtn()" src="/static/static/images/icon_dot.png"
						style="width: 36rpx;height: 36rpx;padding-left: 30rpx;">
					</image>
					<view style="margin-left: 20rpx;flex: 1;">
						<u-search v-model="searchName" placeholder="请输入患者姓名、电话查找" :show-action="false" disabled>
						</u-search>
					</view>
					<image
						:src="hasTagChecked?'/static/static/images/icon_coned.png':'/static/static/images/icon_con.png'"
						style="width: 32rpx;height: 32rpx;margin-left: 20rpx;margin-right: 10rpx;" >
					</image>
					<view :style="hasTagChecked?'font-size: 28rpx;color: #3894FF;padding-right:30rpx':'font-size: 28rpx;color: #999999;padding-right:30rpx'" >筛选</view>
				</view>
		
				
				
				<view class="menuview">
					<view class="menuitem" @click="onHZPQclick">
						<image class="menuicon"
							src="/static/img/biaoqian.png">
						</image>
						<view>患者标签</view>
					</view>
					<view class="menuitem" @click="onQFXXclick">
						<image class="menuicon"
							src="/static/img/qfxx.png">
						</image>
						<view>群发消息</view>
					</view>
					<view class="menuitem" @click="onJKXJclick">
						<image class="menuicon"
							src="/static/img/jiankangxuanjiao.png">
						</image>
						<view>健康宣教</view>
					</view>
					<view class="menuitem" @click="onWJPGclick">
						<image class="menuicon"
							src="/static/img/wenjuan.png">
						</image>
						<view>问卷评估</view>
					</view>
				</view>
		
		
			</view>
		</u-overlay>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				account: {
					user: {}
				},
				overlay:false,
				info: {},
				patientList: [],
				status: 'loadmore',
				isCompleted: false,
				requestData: {
					tagsIds: '', 
					queryStr:'',
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
				showMenu:false,
			}
		},
		onLoad() {
			this.account = uni.getStorageSync('account');
			this.getTagList()
			this.getData(true)
		},
		onReady() {},
		
		 //监听 TabBar 切换点击	 
		onTabItemTap(item) {
			console.log(item)
			this.getTagList()
			this.getData(true)
		},
		onShow() {},
	
		//加载更多
		onReachBottom() {
			if (this.isCompleted) return;
			this.status = 'loading';
			this.getData(false)
			
		},
		methods: {
			//标签列表
			getTagList() {
				
				if (!this.checkAuth()) {
					return
				}
				
				uni.$u.http.post('/account-api/tdUserTags/getUserTagsDoctor', 
				{
					"pageNo": 1,
					"pageSize": 99999,
				}
				).then(res => {
					var list= res.data.records || [];
					this.tagsData=(res.data.records || []).map((item)=>{
						return {
							name: item.tags_name,
							isChecked: false,
							id: item.id
						}
					})
					
				});
			
			},
			
			//患者列表
			getData(isRefresh) {
				
				if (!this.checkAuth()) {
					return
				}
				
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
						var list = res.data.records || []
						
						list.forEach(item=>{
							if(item.order){
                                item.order.docName = item.order.doctorName;
								item.order.rightsId=item.order.id
								item.order.id=item.order.chartId
								item.order.userInfo={
									userName:item.user_name,
									userSex:item.user_sex,
									userAge:item.birthday,
								}
							}
							
						})
			
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
			//搜索
			onSearch(value){
				
				this.requestData.queryStr=value || ''
				this.showCondition =false
				this.hasTagChecked=false
				this.tagsData.forEach(item=>{
					item.isChecked=false
				})
				this.requestData.tagsIds=''
				
				
				this.getData(true)
			},
			showMenuBtn(){
				this.showMenu=!this.showMenu
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
				this.requestData.queryStr=''
				this.searchName=''
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
				this.requestData.queryStr=''
				this.searchName=''
				this.getData(true)
			},
			
			//点击患者
			onPatientItemClick(item){
				if(!item.order){
					return
				}
				var taskItem=item.order
				
				uni.setStorageSync('taskItem', taskItem);
				console.log(uni.getStorageSync('taskItem'))
				if(taskItem.status.value === 3 ){					
					uni.navigateTo({
						url: `/pages2/pages/TUI-Chat-Group2/chat?conversationID=GROUP${taskItem.imGroupId}&tab=tab1`
					});
				}else {
					uni.navigateTo({
						url: `/pages2/pages/TUI-Group-History/chat?conversationID=GROUP${taskItem.imGroupId}&tab=tab1`
					});
				}
				
			},
			
			//点击患者标签
			onHZPQclick(){
				this.showMenu=false
				
				uni.navigateTo({
					url: '/pages3/pages/group/list'
				})
			},
			//点击群发消息
			onQFXXclick(){
				this.showMenu=false
				uni.navigateTo({
					url: '/pages3/pages/record/mass'
				})
			},
			//点击健康宣教
			onJKXJclick(){
				this.showMenu=false;
				uni.navigateTo({
					url: '/pages3/pages/group/note'
				});
			},
			//点击问卷评估
			onWJPGclick(){
				this.showMenu=false;
				uni.navigateTo({
					url: '/pages3/pages/group/paper'
				});
			},

			goIdentify() {
				uni.$u.http.get('/account-api/accountInfo/getDoctorAuthStatus', {
					params: {}
				}).then(res => {
					if (res.code == 0) {
						if (res.data.auditStatus == 1) { //审核中
							uni.navigateTo({
								url: '/pages2/pages/mine/identify-result?type=1&jumpFrom=1'
							})
						} else if (res.data.auditStatus == 3) { //审核不通过
							uni.navigateTo({
								url: '/pages2/pages/mine/identify-result?type=2&jumpFrom=1'
							})
						} else { // 0待完善   进去后查询数据来确定填充信息还是完全的新增
							uni.navigateTo({
								url: '/pages2/pages/mine/identify-base'
							})
						}
			
					} else {
						this.$u.toast(res.message)
					}
			
				}).finally(() => {
					uni.hideLoading();
				});
			},
			
			//检验是否认证
			checkAuth() {
				if (!this.account || !this.account.accountId || this.account.bindStatus !== 0) {
					//如果没有账号 或者 没有认证
					
					return false
				} else {
					return true
				}
			},
			
		}
	}
</script>

<style lang="scss">
	page{
		background: #fff;
	}
	.identyView{
		width: 690rpx;
		margin-left: 30rpx;
		margin-top: 20rpx;
		height: 208rpx;
		background: #3894FF;
		border-radius: 4rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		
		.identyitem{
			display: flex;
			flex-direction: column;		
			font-size: 32rpx;
			margin-left: 30rpx;
			color: #FFFFFF;
		}
		.identyright{
			width: 150rpx;
			height: 68rpx;
			background: #FFFFFF;
			border-radius: 34rpx;
			font-size: 28rpx;
			color: #3894FF;
			display: flex;
			flex-direction: row;	
			align-items: center;
			justify-content: center;
			margin-left: auto;
			margin-right: 30rpx;
		}
	}
	.wrap {
		
		display: flex;
		flex-direction: column;
		
		

		.wrap-search {
			display: flex;
			flex-direction: row;
			align-items: center;
			
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
						
						
					}
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
					.tag-row{
						display: flex;
						flex-direction: row;
						align-items: center;
						flex-wrap: wrap;
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
			min-height: 30vh;

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


		.menutip{
			width: 30rpx;
			height: 15rpx;
			margin-left: 39rpx;
			
		}
		.menuview{
			margin-left: 20rpx;
			width: 280rpx;
			
			background: #FFFFFF;
			box-shadow: 2rpx 6rpx 12rpx 0px #CCCCCC;
			border-radius: 4rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			
			.menuitem{
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: center;
				width: 280rpx;
				font-size: 30rpx;
				height: 90rpx;
				color: #4D4D4D;
				background-color: white;
			}:active { background-color: #F5F5F5; }
			.menuicon{
				width: 40rpx;
				height: 40rpx;
				margin-right: 26rpx;
			}
		}
	}
</style>

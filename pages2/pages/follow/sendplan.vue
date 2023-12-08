<template>
	<view class="wrap">
		<u-sticky>
			<view class="content">
				<view class="top-title">已发放的随访</view>
				<view style="margin-left: 20rpx;margin-right: 60rpx;margin-top: 30rpx;">
					<u-search v-model="userName" placeholder="搜索患者姓名" :show-action="false" @change="onSearch">
					</u-search>
				</view>

				<view class="tabs">
					<view class="item" style="padding-left: 30rpx;" :class="{active: status===''}"
						@click="tabClick('')">
						全部({{totalNum}})</view>
					<view class="item" :class="{active: status===1}" @click="tabClick(1)">进行中({{intNum}})</view>
					<view class="item" :class="{active: status===3}" @click="tabClick(3)">已完成({{overNum}})</view>
					<view class="item" style="padding-right: 60rpx;" :class="{active: status===5}" @click="tabClick(5)">
						已停止({{stopNum}})</view>
				</view>
			</view>

		</u-sticky>


		<view class="bottom-content">

			<view v-if="followDataList.length>0" class="kuang" v-for="(item, index) in followDataList" :key="index">
				<view class="content-row">
					<view style="color: #1A1A1A;font-size: 32rpx;margin-top: 30rpx;font-weight: bold;">{{item.planName}}
					</view>
					<view
						style="margin-left: auto;font-size: 30rpx;margin-top: 30rpx;color: #409EFF;padding-right: 28rpx;">
						{{item.statusName}}
					</view>
				</view>

				<view class="keshi">{{item.planSubjectName||'未知'}}</view>

				<view style="margin-top: 30rpx;margin-left: 30rpx;color: #1A1A1A;font-size: 30rpx;">
					{{item.userInfo.userName}} &nbsp;{{item.userInfo.userSex}}&nbsp; {{item.userInfo.userAge}} 岁
				</view>


				<view class="bottom-line"></view>


				<view class="bottom-right" @click="goDetail(item.bindId,item.planId,item.userId)">

					<view style="color: #999999;">查看详情</view>
					<view style="margin-left: 5rpx;color: #999999;">></view>

				</view>

				<u-empty class="empty" v-if="noData" mode="history" icon="/static/img/icon_nodata.png" text="暂无数据" />



			</view>






		</view>
	</view>








</template>

<script>
	export default {
		data() {
			return {
				userName: '',
				status: '',
				pageNo: 1,
				total: 0,
				noData: false,
				followDataList: [],

				totalNum: 0,
				stopNum: 0,
				overNum: 0,
				intNum: 0,

			}
		},



		onLoad(options) {

			this.qryMyExecFollowPlan('')
			this.qryCount()
		},






		methods: {
			onSearch(name) {
				this.qryMyExecFollowPlan(name)
			},

			tabClick(tab) {
				if (this.status === tab) {
					return;
				}
				this.status = tab;
				console.log("ddd:", this.status)
				this.pageNo = 1;
				this.total = 0;
				this.qryMyExecFollowPlan('')

			},


			// 去详情
			goDetail(bindid, planid, userid) {

				uni.navigateTo({
					url: '/pages2/pages/follow/detailplan?bindId=' + bindid + '&planId=' + planid + '&userId=' +userid
						
				})
			},

			// 查询随访数量
			qryCount() {
				uni.$u.http.post('/follow-api/docFollow/qryMyExecFollowPlanCount', {
					// userType: "execDoctor"
				}).then(res => {
					if (res.code === 0) {
						this.totalNum = res.data.totalNum
						this.stopNum = res.data.stopNum
						this.overNum = res.data.overNum
						this.intNum = res.data.intNum
					}

				})
			},

			//获取随访列表
			qryMyExecFollowPlan(userName) {
				uni.showLoading({
					title: '加载中...'
				});
				uni.$u.http.post('/follow-api/docFollow/qryMyExecFollowPlan', {
					status: this.status,
					pageSize: 1000,
					userName: userName,
					// userType: "execDoctor"
				}).then(res => {
					uni.hideLoading()
					if (res.code === 0) {
						this.followDataList = res.data.rows
						this.noData = this.followDataList.length == 0
					}

				})
			},



		}
	}
</script>

<style lang="scss">
	.wrap {
		width: 100%;
		height: 100%;
		background: #F5F5F5;
	}



	.content {
		height: 280rpx;
		width: 100%;
		background-color: #FFFFFF;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		margin-top: 10rpx;
		flex-wrap: wrap;
	}

	.bottom-content {
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: column;
		background-color: #F5F5F5;
		margin-top: 10rpx;
		flex-wrap: wrap;
	}

	.empty {
		margin-top: 300rpx !important;
	}


	.kuang {
		// width: 100%;
		height: 320rpx;
		background: #FFFFFF;
		border-radius: 4px;
		margin-left: 20rpx;
		margin-right: 30rpx;
		margin-top: 30rpx;
		margin-bottom: 24rpx;

		.content-row {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			overflow: hidden;
			margin-left: 34rpx;
		}

		.keshi {
			width: 150rpx;
			height: 42rpx;
			background: #EFF6FF;
			color: #367BF5;
			border: 1px solid #3894FF;
			border-radius: 2rpx;
			margin-left: 30rpx;
			margin-top: 15rpx;
			font-size: 22rpx;
			padding-left: 10rpx;
			padding-top: 10rpx;
			text-align: center;
		}


		.bottom-line {
			margin-top: 28rpx;
			margin-left: 31rpx;
			background: #E6E6E6;
			margin-right: 30rpx;
			height: 1rpx;
		}

		.bottom-right {
			width: 100%;
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			margin-top: 20rpx;
			margin-left: 74%;
			margin-right: 30rpx;
		}



	}



	.top-title {
		width: 100%;
		color: #4D4D4D;
		font-size: 30rpx;
		margin-top: 30rpx;
		margin-left: 25rpx;
	}

	.tabs {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx 0 5rpx 0;

		.item {
			font-size: 32rpx;
			font-weight: 400;
			color: #4D4D4D;
			line-height: 62rpx;
			// border-bottom: 5rpx solid transparent;

			&.active {
				color: #409EFF;
			}
		}
	}
</style>

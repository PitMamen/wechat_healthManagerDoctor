<template>
	<view>
		<view class="wrapview">
			<view class="titleview">
				<view class="titletag"></view>
				<view class="title">标签名称</view>
				<view class="changetitle" @click="btnchangeClick">更新名称</view>
				<view class="deltitle" @click="btndelClick">删除标签</view>
			</view>
			<view class="inputview">
				<u-input class="input" maxlength="15" placeholder="请输入标签名称，不超过15个字符" border="none" v-model="tagsName">

				</u-input>
			</view>

			<view class="line"></view>
		</view>

		<view class="wrapview">
			<view class="titleview">
				<view class="titletag"></view>
				<view class="title">标签患者</view>
			</view>
			<view class="userview" v-for="(item, index) in userList" :key="item.patient_user_id">
				<view class="usertitle">{{item.user_name}} ｜ {{item.user_sex}} ｜ {{item.birthday}}岁</view>
				<view class="item">
					<view class="tag" v-for="(tagitem, tagindex) in item.tags">{{tagitem}}</view>

				</view>
				<view class="item">
					<view class="bqms">病情描述:</view>
					<view class="bqmsvalue">{{item.remark || ''}}</view>
				</view>
				<view class="time">{{item.create_time}}</view>
				<view class="line2"></view>
			</view>
			<u-loadmore v-if="userList.length>0" :status="status" color="#999999" />
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				status: 'loadmore',
				isCompleted: false,
				requestData: {
					tagsIds: '',
					pageNo: 1,
					pageSize: 10,
				},
				tagsName: '',
				id: '',
				requestting: false,
				userList: []
			}
		},
		onLoad(options) {
			this.id = options.id
			this.tagsName = options.tagsName
			this.requestData.tagsIds = options.id
			this.getData(true)
		},
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
							this.userList = list
						} else {
							this.userList = [...this.userList, ...list];
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
			//修改
			btnchangeClick() {

				if (!this.tagsName) {
					uni.showToast({
						title: '请填写标签名称',
						icon: 'none'
					});
					return
				}
				if (this.requestting) {
					return
				}
				this.requestting = true
				uni.showLoading({
					title: '正在加载'
				});
				uni.$u.http.post('/account-api/tdUserTags/modifyUserTagsDoctor', {
					id: this.id,
					tagsName: this.tagsName,

				}).then(res => {

					uni.showToast({
						title: '修改成功',
						icon: 'success'
					});
					setTimeout(() => {
						uni.navigateBack()
					}, 1500)

				}).finally(() => {
					uni.hideLoading();
					this.requestting = false
				});;

			},
			//删除
			btndelClick() {
				if (this.requestting) {
					return
				}
				this.requestting = true

				uni.showLoading({
					title: '正在加载'
				});
				uni.$u.http.post('/account-api/tdUserTags/deleteUserTagsDoctor/' + this.id, {}).then(res => {

					uni.showToast({
						title: '已删除',
						icon: 'success'
					});
					setTimeout(() => {
						uni.navigateBack()
					}, 1500)

				}).finally(() => {
					uni.hideLoading();
					this.requestting = false
				});;

			},
		}
	}
</script>

<style>
	page {
		background-color: #F5F5F5;
	}

	.wrapview {
		width: 702rpx;
		margin-top: 30rpx;
		margin-left: 24rpx;
		margin-bottom: 30rpx;
		padding-top: 30rpx;
		padding-bottom: 30rpx;
		background: #FFFFFF;
		box-shadow: 0px 3rpx 6rpx 0px rgba(204, 204, 204, 0.35);
		border-radius: 4rpx;
		display: flex;
		flex-direction: column;

	}

	.titleview {
		display: flex;
		flex-direction: row;
		margin-left: 30rpx;
		margin-right: 30rpx;
		margin-bottom: 47rpx;
		align-items: center;
	}

	.titletag {
		width: 5rpx;
		height: 36rpx;
		background: #3894FF;
	}

	.title {
		font-size: 36rpx;
		margin-left: 12rpx;
		color: #1A1A1A;
		font-weight: bold;
	}

	.changetitle {
		font-size: 30rpx;
		margin-left: auto;
		color: #3894FF;

		margin-right: 32rpx;
	}

	.deltitle {
		font-size: 30rpx;

		color: #F21111;


	}

	.inputview {
		margin-left: 30rpx;
		margin-right: 30rpx;
		margin-bottom: 18rpx;
	}

	.input {

		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: rgba(62, 74, 89, 0.45);
		line-height: 36rpx;
	}

	.line {
		margin-left: 30rpx;
		width: 642rpx;
		height: 1rpx;
		background: #E6E6E6;
	}

	.line2 {

		width: 642rpx;
		height: 1rpx;
		background: #E6E6E6;
		margin-top: 20rpx;
		margin-bottom: 20rpx;
	}

	.wrap-submit {

		display: flex;
		flex-direction: column;
		margin-bottom: 30rpx;
		padding-left: 24rpx;
		padding-right: 24rpx;
		margin-top: 100rpx;

	}

	.btn-sub {
		width: 100%;
		border-radius: 8rpx;
		text-align: center;
		padding: 20rpx 0;
		font-size: 30rpx;
		color: white;
		background-color: #3894FF;

	}

	.userview {
		display: flex;
		flex-direction: column;
		margin-left: 30rpx;
		margin-right: 30rpx;

	}

	.item {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-bottom: 20rpx;
	}

	.usertitle {
		font-size: 32rpx;
		color: #1A1A1A;
		line-height: 37rpx;
		margin-bottom: 20rpx;
	}

	.tag {
		padding: 11rpx 14rpx;
		background: #65BEFE;
		border-radius: 4rpx;
		background-color: #65BEFE;
		font-size: 24rpx;
		color: #FFFFFF;
		margin-right: 20rpx;
	}

	.bqms {
		font-size: 28rpx;
		color: #999999;
		line-height: 37rpx;
		margin-right: 20rpx;
	}

	.bqmsvalue {
		font-size: 28rpx;
		color: #1A1A1A;
		line-height: 37rpx;
		width: 500rpx;
		overflow: hidden; 
		text-overflow: ellipsis; 
		display: -webkit-box;
		-webkit-line-clamp: 1; 
		-webkit-box-orient: vertical;
	}

	.time {
		font-size: 28rpx;

		color: #4D4D4D;
		line-height: 37rpx;
	}
</style>
<template>
	<view class="wrap">
		<view class="content">
			<view class="tags-item" :class="{notStyle: index==tagsData.length-1}" v-for="(item, index) in tagsData"
				:key="index" @click="onChange(item)">
				<view>
					<u-checkbox activeColor="#3894FF" :checked="item.isChecked" label="  " :name='index'
						@change="onChange(item)"></u-checkbox>
				</view>

				<view>{{item.tags_name}}</view>
				<view>（{{item.co}}）</view>
			</view>

		</view>

		<view style="flex: 1;"></view>

		<view style="height: 20rpx;"></view>
		<view class="wrap-submit" @click="saveUserTagsList">
			<view class="btn-sub">保存</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				info: {},
				userId: '',
				tagsList: [],
				userTags: [],
				tagsData: [
					// {
					// 	name: '基本信息',
					// 	isChecked: false,
					// 	num: 1,
					// 	id: 1
					// }
				],
			}
		},
		onLoad(options) {
			this.userId = options.userId
			console.log('______________________', this.userId)
			this.info = uni.getStorageSync('cashItem');
			this.getUserTagsList()
		},
		onReady() {},
		onShow() {},
		methods: {
			itemClick() {
				uni.navigateTo({
					url: `/pages3/pages/cash/out-info?id=${this.info.id}&types=提`
				});
			},

			//请求标签列表
			getUserTagsList() {
				let postData = {
					pageNo: 1,
					pageSize: 10000,
				}
				uni.$u.http.post('/account-api/tdUserTags/getUserTagsDoctor', postData).then(res => {
					this.tagsData = res.data.records || []
					this.tagsData.forEach((item) => {
						this.$set(item, 'isChecked', false)
					})

					this.getUserTagsInfo()
				})
			},

			//请求用户标签
			getUserTagsInfo() {
				let postData = {
					userId: this.userId,
				}
				uni.$u.http.post('/account-api/tdUserTags/getPatientTags', postData).then(res => {
					this.userTags = res.data.records || []

					if (this.userTags.length > 0) {
						this.userTags.forEach((item) => {
							for (let num = 0; num < this.tagsData.length; num++) {
								if (this.tagsData[num].id == item.tag_id) {
									this.tagsData[num].isChecked = true
									this.tagsList.push(this.tagsData[num].id)
								}
							}

						})
					}
				})
			},

			//添加用户到分组
			saveUserTagsList() {
				let postData = {
					tagsList: this.tagsList,
					userId: this.userId,
				}
				uni.$u.http.post('/account-api/tdUserTags/addPatientToTags', postData).then(res => {
					uni.$u.toast('操作成功！')
					uni.$emit('refreshTags', this.tagsList);
					uni.navigateBack({
						delta: 1
					});
				})
			},

			onChange(item) {
				console.log("index------------------", item)
				console.log('onChange Before', item.isChecked)
				item.isChecked = !item.isChecked
				console.log('onChange After', item.isChecked)

				if (item.isChecked) {
					this.tagsList.push(item.id)
				} else {
					this.tagsList = this.tagsList.filter(element => element != item.id)
				}

				console.log("tagsList------------------", this.tagsList)
				// console.log('onChange Before', this.tagsData[index].isChecked)
				// this.tagsData[index].isChecked = !this.tagsData[index].isChecked
				// console.log('onChange After', this.tagsData[index].isChecked)
			},

			// onItemTap(item) {
			// 	console.log('onItemTap Before', JSON.stringify(item))
			// 	item.isChecked = !item.isChecked
			// 	console.log('onItemTap After', JSON.stringify(item))
			// }
		}
	}
</script>

<style lang="scss">
	.wrap {
		height: 100vh;
		display: flex;
		flex-direction: column;
		background: #F5F5F5;
		box-sizing: border-box;
		padding: 30rpx 24rpx;

		.content {
			padding: 0 27rpx;
			border-radius: 5rpx;
			max-height: 80vh;
			overflow-y: auto;
			background-color: white;

			.tags-item {
				padding: 43rpx 0;
				display: flex;

				flex-direction: row;
				border-bottom: 1rpx #E6E6E6 solid;
				align-items: center;
				font-size: 30rpx;

				&.notStyle {
					border-bottom: none;
				}
			}

		}

		.wrap-submit {
			height: 6vh;
			display: flex;
			flex-direction: column;
			margin-bottom: 50px;
			padding-left: 50rpx;
			padding-right: 50rpx;

			.btn-sub {
				width: 100%;
				border-radius: 8rpx;
				text-align: center;
				padding: 20rpx 0;
				font-size: 30rpx;
				color: white;
				background-color: #3894FF;

			}
		}
	}
</style>
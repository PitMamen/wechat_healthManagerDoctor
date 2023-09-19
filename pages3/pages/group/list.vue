<template>
	<view class="wrap">
		<view class="content">
			<view class="tags-item" :class="{notStyle: index==tagsData.length-1}" v-for="(item, index) in tagsData"
				:key="index" @click="onItemTap(item)">
				
				<view>{{item.tagsName}}</view>
				
				<view style="display: flex;flex-direction: row;">
					<view>{{item.count}}人</view>
					<u-icon name="arrow-right" color="#333"
						style="width: 10px;height: 10px;float: right;margin-left: 10px;margin-top: 6.5px;"></u-icon>
				</view>
			</view>

		</view>

		<view style="flex: 1;"></view>

		<view style="height: 20rpx;"></view>
		<view class="wrap-submit" @click="btnClick">
			<view class="btn-sub">新建标签</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				info: {},
				tagsData: [],
			}
		},
		onLoad() {
			this.info = uni.getStorageSync('cashItem');
		},
		onReady() {},
		onShow() {
			this.getList()
		},
		methods: {
			getList() {
				uni.$u.http.post('/account-api/tdUserTags/getUserTagsDoctor', 
				{
					"pageNo": 1,
					"pageSize": 99999,
				}
				).then(res => {
					this.tagsData = res.data.records || [];
					
					
				});
			
			},
			btnClick() {
				uni.navigateTo({
					url: './add'
				});
			},

			
			onItemTap(item) {
				uni.navigateTo({
					url: './edit?tagsName='+item.tagsName+'&id='+item.id
				});
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #F5F5F5;
	}
	.wrap {
		height: 100vh;
		display: flex;
		flex-direction: column;
		background: #F5F5F5;
		box-sizing: border-box;
		padding: 30rpx 24rpx;

		.content {
			padding: 0 24rpx;
			border-radius: 5rpx;
			max-height: 90vh;
			overflow-y: auto;
			background-color: white;

			.tags-item {
				padding: 43rpx 0;
				display: flex;
				justify-content: space-between;
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
			
			display: flex;
			flex-direction: column;
			margin-bottom: 30rpx;
			padding-left: 24rpx;
			padding-right: 24rpx;

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
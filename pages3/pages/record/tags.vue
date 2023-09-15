<template>
	<view class="wrap">
		<view class="content">
			<view class="tags-item" :class="{notStyle: index==tagsData.length-1}" v-for="(item, index) in tagsData"
				:key="index" @click="onItemTap(item)">
				<view>
					<u-checkbox activeColor="#3894FF" :checked="item.isChecked" label="  " :name='index'
						@change="onChange(index)"></u-checkbox>
				</view>

				<view>{{item.name}}</view>
				<view>（{{item.num}}）</view>
			</view>

		</view>

		<view style="flex: 1;"></view>

		<view style="height: 20rpx;"></view>
		<view class="wrap-submit">
			<view class="btn-sub">保存</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				info: {},
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
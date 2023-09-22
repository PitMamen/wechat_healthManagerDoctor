<template>
	<view class="wrap" :class="{empty: list.length === 0}">
		<u-empty mode="data" style="padding-top: 300rpx;" icon="/pages2/static/img/icon_nodata.png" v-if="list.length === 0"></u-empty>
		<view class="list" v-else>
			<view class="part part2" v-for="item in list" :key="item.id" :class="{close: item.itemStatus === 0}">
				<view class="bigrow">
					<view class="row">
						<view class="title">{{ item.serviceItemName || '' }}</view>
						<view class="action">
							<u-switch
								v-model="item.itemStatus"
								class="switch"
								space="2"
								size="24"
								:activeValue="1"
								:inactiveValue="0"
								activeColor="#5A9CF8"
								inactiveColor="#E6E6E6"
							>
							</u-switch>
						</view>
					</view>
					<view class="desc">患者指定您进行图文问诊，您可以自主关闭（单次咨询限制时长最多24小时，医患沟通最多20回合）</view>
				</view>
				<view class="line"></view>
				<view class="row call">
					<view class="title">价格设置</view>
					<view class="action" @click="showCall(item)">
						<view class="value times">{{ item.saleAmount || 0 }}元</view>
						<u-icon class="icon" name="arrow-right" color="#999999" size="18"></u-icon>
					</view>
				</view>
			</view>
		</view>
		
		<view class="fixed" v-if="list.length > 0">
			<u-button
				class="button"
				type="primary"
				text="保 存"
				loadingText="保存中..."
				:loading="loading"
				@click="save"
			></u-button>
		</view>
		<u-picker
			keyName="label"
			title="请选择"
			:show="show"
			:columns="columns"
			@cancel="cancel"
			@confirm="confirm"
		></u-picker>
		<!-- <sides /> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: false,
				loading: false,
				columns: [
					[
						{
							id: 0.01,
							label: '0.01元'
						},
						{
							id: 4,
							label: '4元'
						},
						{
							id: 6,
							label: '6元'
						},
						{
							id: 8,
							label: '8元'
						},
						{
							id: 10,
							label: '10元'
						},
						{
							id: 12,
							label: '12元'
						},
						{
							id: 15,
							label: '15元'
						},
						{
							id: 20,
							label: '20元'
						},
						{
							id: 25,
							label: '25元'
						},
						{
							id: 30,
							label: '30元'
						},
						{
							id: 50,
							label: '50元'
						},
						{
							id: 60,
							label: '60元'
						},
						{
							id: 80,
							label: '80元'
						},
						{
							id: 100,
							label: '100元'
						},
						{
							id: 150,
							label: '150元'
						},
						{
							id: 400,
							label: '400元'
						}
					]
				],
				list: [],
				callItem: {}
			}
		},
		onLoad() {
			this.getList();
		},
		onReady() {
		},
		onShow() {
		},
		methods: {
			getList() {
				uni.showLoading({
					title:'正在加载'
				});
				uni.$u.http.get('/medical-api/commodityConfig/getPkgItemByDoc', {
					params: {
						projectType: '101'
					}
				}).then(res => {
					this.list = res.data || [];
				}).finally(() => {
					uni.hideLoading();
				});
			},
			save() {
				if (this.loading){
					return;
				}
				this.loading = true;
				uni.showLoading({
					title:'正在加载'
				});
				uni.$u.http.post('/medical-api/commodityConfig/editPkgItemList', this.list.map(item => {
					return {
						id: item.id,
						itemStatus: item.itemStatus,
						saleAmount: item.saleAmount
					}
				})).then(res => {
					uni.hideLoading();
					uni.showToast({
						title: '保存成功',
						icon: 'success'
					});
				}).catch(error => {
					uni.hideLoading();
				}).finally(() => {
					this.loading = false;
				});
			},
			showCall(item) {
				this.show = true;
				this.callItem = item;
			},
			cancel() {
				this.show = false;
			},
			confirm(e) {
				this.cancel();
				const saleAmount = e.value[0].id;
				this.$set(this.callItem, 'saleAmount', saleAmount);
			}
		}
	}
</script>

<style lang="scss">
	.wrap {
		min-height: 100vh;
		background: #FFFFFF;
		&.empty {
			background: #F2F2F2;
		}
		.list {
			margin-bottom: 180rpx;
			overflow: hidden;
			background: #F2F2F2;
		}
		.part {
			margin-bottom: 20rpx;
			background: #FFFFFF;
			&.part1 {
				margin-bottom: 0;
			}
			&.part2 {
				.bigrow {
					padding-top: 5rpx;
					padding-bottom: 30rpx;
					.desc {
						max-width: 580rpx;
						padding: 0 30rpx;
						font-size: 28rpx;
						font-weight: 400;
						color: #4D4D4D;
						line-height: 28rpx;
					}
				}
				.row {
					.title {
						color: #4D4D4D;
					}
					.action {
						.value {
							color: #4D4D4D;
							&.times {
								color: #5A9CF8;
							}
							&.inputs {
								max-width: 280rpx;
								.input {
									font-size: 28rpx;
									font-weight: 400;
									color: #999999;
									line-height: 40rpx;
								}
							}
						}
						.icon {
							color: #999999;
						}
						.switch {
							width: 78rpx;
							height: 40rpx;
						}
					}
				}
			}
			&.close {
				.line {
					display: none;
				}
				.call {
					display: none;
				}
				.price {
					display: none;
				}
			}
			.line {
				width: 702rpx;
				height: 1rpx;
				margin: 0 auto;
				background: #CCCCCC;
			}
			.row {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 25rpx 30rpx;
				.title {
					max-width: 580rpx;
					font-size: 32rpx;
					font-weight: 400;
					color: #1A1A1A;
					line-height: 40rpx;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
				.action {
					display: flex;
					align-items: center;
					justify-content: flex-end;
					.value {
						max-width: 250rpx;
						font-size: 28rpx;
						font-weight: 400;
						color: #1A1A1A;
						line-height: 40rpx;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}
					.icon {
						position: relative;
						right: -10rpx;
						margin-left: 10rpx;
						font-size: 28rpx;
						color: #1A1A1A;
						line-height: 40rpx;
					}
				}
			}
		}
		.fixed {
			position: fixed;
			width: 100%;
			height: 180rpx;
			padding: 0 24rpx;
			box-sizing: border-box;
			bottom: 0rpx;
			background: #FFFFFF;
			.button {
				position: absolute;
				width: 702rpx;
				height: 68rpx;
				left: 50%;
				bottom: 90rpx;
				transform: translateX(-50%);
			}
		}
	}
</style>

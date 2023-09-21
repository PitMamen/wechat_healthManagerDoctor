<template>
	<view class="wrap">
		<view class="list">
			<view class="part part2">
				<view class="row call">
					<view class="title">
						<view>报到后赠送追问次数</view>
						<view style="padding-top: 30rpx;font-size: 28rpx;color: #4D4D4D;">患者报到后赠送的免费追问次数</view>
					</view>
					<view class="action" @click="showCall()">
						<view class="value times">{{ info.limitNumsValue }}次</view>
						<u-icon class="icon" name="arrow-right" color="#999999" size="18"></u-icon>
					</view>
				</view>
				<view class="line"></view>
				<view class="row price">
					<view class="title">有效天数</view>
					<view class="action">
						<view class="value inputs">
							<u-input
								v-model.trim="info.expireValue"
								class="input"
								type="number"
								border="none"
								inputAlign="right"
								placeholder="请输入天数0～999"
							>
							</u-input>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="fixed">
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
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: false,
				loading: false,
				info: {
					expireUnit: '天',
					expireValue: '',
					limitNumsUnit: '条',
					limitNumsValue: 3
				},
				columns: [
					[
						{
							id: 1,
							label: '1次'
						},
						{
							id: 3,
							label: '3次'
						},
						{
							id: 5,
							label: '5次'
						}
					]
				],
				duty: '',
				list: [],
				callItem: {},
				weekNameMap: {
					'1': '周一',
					'2': '周二',
					'3': '周三',
					'4': '周四',
					'5': '周五',
					'6': '周六',
					'7': '周日'
				},
				userId: ((uni.getStorageSync('account') || {}).user || {}).userId
			}
		},
		onLoad() {
			// this.getList();
		},
		onReady() {
		},
		onShow() {
			// this.getDuty();
		},
		methods: {
			getDuty() {
				uni.$u.http.post(`/medical-api/tdArrangeWorkTime/getDocArrangeInfo`, {
					type: 1,
					userId: this.userId
				}).then(res => {
					const names = (res.data || []).map(item => {
						return this.weekNameMap[item.weekDay+''];
					});
					this.duty = names.join('、');
				});
			},
			getList() {
				uni.showLoading({
					title:'正在加载'
				});
				uni.$u.http.get('/medical-api/commodityConfig/getPkgItemByDoc', {
					params: {
						projectType: '102'
					}
				}).then(res => {
					this.list = res.data || [];
				}).finally(() => {
					uni.hideLoading();
				});
			},
			save() {
				if (!/^0|([1-9]\d*)$/.test(this.info.expireValue)
					|| parseFloat(this.info.expireValue)>999
					|| parseFloat(this.info.expireValue)===0){
					uni.showToast({
						title: '输入有误，有效天数为0~999',
						icon: 'none'
					});
					return;
				}
				if (this.loading){
					return;
				}
				this.loading = true;
				uni.showLoading({
					title:'正在加载'
				});
				uni.$u.http.post('/medical-api/commodityConfig/updateGuidePkgRules', this.info).then(res => {
					uni.hideLoading();
					uni.showToast({
						title: '保存成功',
						icon: 'success'
					});
					setTimeout(() => {
						uni.navigateBack({
							delta: 1
						});
					}, 2000);
				}).catch(error => {
					this.loading = false;
				}).finally(() => {
					// this.loading = false;
				});
			},
			goDuty() {
				uni.navigateTo({
					url: `/pages2/pages/config/duty?type=1`
				});
			},
			showCall() {
				this.show = true;
			},
			cancel() {
				this.show = false;
			},
			confirm(e) {
				this.cancel();
				const times = e.value[0].id;
				this.$set(this.info, 'limitNumsValue', times);
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
			padding-top: 20rpx;
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

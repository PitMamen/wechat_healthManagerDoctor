<template>
	<view :class="'text-message ' + (isMine ? 'my-text' : '')">
		<view v-for="(item, index) in renderDom" :key="index" class="message-body-span">
			<template v-if="isMine">
				<view class="wrap">
					<view class="content">
						<span class="message-body-span-text" v-if="item.name === 'span'">
							<view :class="{long: item.text.length > 16}">
								<u-tooltip
								    :text="item.text"
									:buttons="['提醒患者', '加入常用语']"
									direction="top"
									color="#1A1A1A"
									@click="clickHandler($event, item.text)"
								></u-tooltip>
							</view>
						</span>
					</view>
					<view class="tips" v-if="false">线上问诊不能代替面诊，此回复仅供参考</view>
				</view>
			</template>
			<template v-else>
				<span class="message-body-span-text" v-if="item.name === 'span'">{{ item.text }}</span>
			</template>
			<image v-if="item.name === 'img'" class="emoji-icon" :src="item.src"></image>
		</view>
	</view>
</template>

<script>
import { parseText } from '../../../base/message-facade';

export default {
	data() {
		return {
			renderDom: []
		};
	},
	options: {
		styleIsolation: 'shared'
	},
	components: {},
	props: {
		message: {
			type: Object
		},
		isMine: {
			type: Boolean,
			default: true
		}
	},
	watch: {
		message: {
			handler: function(newVal) {
				this.setData({
					renderDom: parseText(newVal)
				});
			},
			immediate: true,
			deep: true
		}
	},
	beforeMount() {},
	destroyed() {},
	methods: {
		clickHandler(index, value) {
			const taskItem = uni.getStorageSync('taskItem')
			if (index === 1){
				uni.$u.http.post(`/medical-api/remind/send`, {
					orderId: taskItem.orderId
				}).then(res => {
					uni.showToast({
						title: '提醒成功',
						icon: 'success'
					});
				});	
			}
			if (index === 2){
				uni.$u.http.post(`/medical-api/commonWords/add`, {
					words: value
				}).then(res => {
					uni.showToast({
						title: '加入成功',
						icon: 'success'
					});
				});
			}
		}
	}
};
</script>

<style>
@import './index.css';
</style>
<style lang="scss">
	.wrap {
		.content {
			padding: 20rpx 24rpx;
			.message-body-span-text {
				.long {
					.u-tooltip {
						flex-direction: column;
						.u-tooltip__wrapper {
							white-space: pre-wrap;
						}
					}
				}
			}
		}
		.tips {
			font-size: 24rpx;
			font-weight: 400;
			color: #FFFFFF;
			line-height: 82rpx;
			text-align: center;
			opacity: 0.8;
			border-top: 1rpx solid #FFFFFF;
		}
	}
</style>


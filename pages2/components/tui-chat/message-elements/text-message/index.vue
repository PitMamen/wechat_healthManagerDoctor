<template>
	<view :class="'text-message ' + (isMine ? 'my-text' : '')">
		<view v-for="(item, index) in renderDom" :key="index" class="message-body-span">
			<span class="message-body-span-text" v-if="item.name === 'span'">
				<u-tooltip
					:class="{long: item.text.length > 16}"
				    :text="item.text"
					:buttons="['提醒患者', '加入常用语']"
					direction="top"
					@click="clickHandler($event, item.text)"
				></u-tooltip>
			</span>
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
			const account = uni.getStorageSync('account')
			const taskItem = uni.getStorageSync('taskItem')
			if (index === 1){
				uni.$u.http.post('/health-api/sys/sysRemind', {
					eventType: 5,
					remindType: 'videoRemind',
					tradeId: taskItem.taskDetail.tradeId,
					userId: taskItem.taskDetail.userId
				}).then(res => {
					uni.$u.toast('提醒成功')
				})
			}
			if (index === 2){
				uni.$u.http.post('/health-api/medical/doctor/saveCaseCommonWords', {
					userId: account.user.userId,
					content: value,
					wordsType: 0
				}).then(res => {
					uni.$u.toast('加入成功')
				})
			}
		}
	}
};
</script>
<style>
@import './index.css';

.message-body-span-text >>> .u-tooltip.long {
	flex-direction: column;
}
.message-body-span-text >>> .u-tooltip.long .u-tooltip__wrapper {
	white-space: pre-wrap;
}
</style>

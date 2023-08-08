<template>
	<view v-show="display" class="tui-common-words-container">
		<view class="tui-common-words-box">
			<view class="tui-common-words-title">
				<view>快捷回复</view>
				<view style="color: #006EFF; font-family: PingFangSC-Regular; font-weight: normal;" class="tui-common-words-close" @tap="handleClose">关闭</view>
			</view>
			<view class="tui-search-bar">
				<image class="tui-searchcion" src="/pages2/static/static/assets/serach-icon.svg"></image>
				<input class="tui-search-bar-input" :value="words" placeholder="搜索快捷回复" @input="wordsInput" />
			</view>
			<scroll-view class="tui-common-words-list" scroll-y="true" enable-flex="true">
				<u-empty
					v-if="commonWordsMatch.length === 0"
					mode="data"
					icon="/pages2/static/static/images/data.png"
				></u-empty>
				<view v-for="(item, index) in commonWordsMatch" :key="index" class="tui-common-words-item" @tap="sendMessage" :data-words="item">{{ item }}</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			words: '',
			commonWordsList: [],
			commonWordsMatch: []
		};
	},

	components: {},
	props: {
		display: {
			type: Boolean,
			default: false
		}
	},
	watch: {
		display: {
			handler: function(newVal) {
				// this.setData({
				//   display: newVal
				// });
				if (newVal){
					this.getList()
				}
			},
			immediate: true
		}
	},
	methods: {
		handleClose() {
			this.$emit('close', {
				detail: {
					key: '1'
				}
			});
		},

		wordsInput(e) {
			(this.commonWordsMatch = []),
				this.commonWordsList.forEach(item => {
					if (item.indexOf(e.detail.value) > -1) {
						this.commonWordsMatch.push(item);
					}
				});
			this.setData({
				words: e.detail.value,
				commonWordsMatch: this.commonWordsMatch
			});
		},

		sendMessage(e) {
			this.$emit('sendMessage', {
				detail: {
					message: e.currentTarget.dataset.words
				}
			});
		},
		
		getList() {
			const account = uni.getStorageSync('account')
			uni.$u.http.post('/health-api/medical/doctor/qryCaseCommonWords', {
				userId: account.user.userId,
				wordsType: 0
			}).then(res => {
				res.data = res.data || []
				this.words = ''
				this.commonWordsList = res.data.map(item => item.content)
				this.commonWordsMatch = this.commonWordsList
			})
		}
	}
};
</script>
<style>
@import './index.css';
</style>

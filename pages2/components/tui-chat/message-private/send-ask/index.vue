<template>
	<view v-show="display" class="tui-common-words-container">
		<view class="tui-common-words-box">
			<view class="tui-common-words-title">
				<view>发送问卷</view>
				<view style="color: #006EFF; font-family: PingFangSC-Regular; font-weight: normal;" class="tui-common-words-close" @tap="handleClose">关闭</view>
			</view>
			<view class="tui-search-bar">
				<image class="tui-searchcion" src="/pages2/static/static/assets/serach-icon.svg"></image>
				<input class="tui-search-bar-input" :value="words" placeholder="搜索问卷" @input="wordsInput" />
			</view>
			<scroll-view class="tui-common-words-list" scroll-y="true" enable-flex="true">
				<u-empty
					v-if="commonWordsMatch.length === 0"
					mode="data"
					icon="/pages2/static/static/images/data.png"
				></u-empty>
				<u-cell-group v-else>
					<u-cell
						v-for="(item, index) in commonWordsMatch"
						:key="index"
					    :isLink="true"
					>
						<view slot="title" @tap="sendAsk(item)">{{ item.name }}</view>
						<view slot="value" @tap="preview(item)">预览</view>
					</u-cell>
				</u-cell-group>
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
					key: '3'
				}
			});
		},

		wordsInput(e) {
			(this.commonWordsMatch = []),
				this.commonWordsList.forEach(item => {
					if (item.name.indexOf(e.detail.value) > -1) {
						this.commonWordsMatch.push(item);
					}
				});
			this.setData({
				words: e.detail.value,
				commonWordsMatch: this.commonWordsMatch
			});
		},

		sendAsk(item) {
			this.$emit('sendAsk', {
				detail: {
					payload: {
						data: JSON.stringify({
							description: '问卷',
							id: item.id,
							name: item.name,
							type: 'CustomWenJuanMessage',
							url: item.questUrl,
							userId: item.userId
						}),
						extension: '',
						description: '问卷'
					}
				}
			});
		},
		
		preview(item) {
			const url = `${item.questUrl}?showsubmitbtn=hide`
			uni.navigateTo({
				url: `/pages2/pages/TUI-User-Center/webview/webview?url=${url}&nav=${item.name}`
			});
		},
		
		getList() {
			uni.$u.http.get(`/health-api/health/doctor/qryQuestByKeyWord?pageSize=999999&start=1`).then(res => {
				res.data = res.data || {}
				this.words = ''
				this.commonWordsList = res.data.list || []
				this.commonWordsMatch = this.commonWordsList
			})
		}
	}
};
</script>
<style>
@import './index.css';
</style>

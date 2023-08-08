<template>
	<view v-show="display" class="tui-common-words-container">
		<view class="tui-common-words-box">
			<view class="tui-common-words-title">
				<view>发送文章</view>
				<view style="color: #006EFF; font-family: PingFangSC-Regular; font-weight: normal;" class="tui-common-words-close" @tap="handleClose">关闭</view>
			</view>
			<view class="tui-search-bar">
				<image class="tui-searchcion" src="/pages2/static/static/assets/serach-icon.svg"></image>
				<input class="tui-search-bar-input" :value="words" placeholder="搜索文章" @input="wordsInput" />
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
						<view slot="title" @tap="sendNote(item)">{{ item.title }}</view>
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
					key: '2'
				}
			});
		},

		wordsInput(e) {
			(this.commonWordsMatch = []),
				this.commonWordsList.forEach(item => {
					if (item.title.indexOf(e.detail.value) > -1) {
						this.commonWordsMatch.push(item);
					}
				});
			this.setData({
				words: e.detail.value,
				commonWordsMatch: this.commonWordsMatch
			});
		},

		sendNote(item) {
			this.$emit('sendNote', {
				detail: {
					payload: {
						data: JSON.stringify({
							content: item.title,
							description: '文章',
							id: item.articleId,
							title: '文章内容',
							type: 'CustomArticleMessage',
							url: item.previewUrl
						}),
						extension: '',
						description: '文章'
					}
				}
			});
		},
		
		preview(item) {
			uni.navigateTo({
				url: `/pages2/pages/article/index?id=${item.articleId}`
			});
		},
		
		getList() {
			const account = uni.getStorageSync('account')
			uni.$u.http.get(`/health-api/health/patient/allArticlesPage?status=2&pageSize=999999&start=1`).then(res => {
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

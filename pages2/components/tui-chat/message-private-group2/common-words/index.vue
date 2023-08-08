<template>
	<view v-show="display" class="tui-common-words-container">
		<view class="tui-common-words-box">
			<view class="tui-common-words-title">
				<view class="desc">长按你发送的消息可添加为常用语，左滑可删除。（上限15条）</view>
				<u-icon class="tui-common-words-close" name="close" @tap="handleClose"></u-icon>
			</view>
			<view class="tui-search-bar">
				<u-search
					placeholder="搜索常用语"
					v-model="words"
					:show-action="false"
					@change="wordsInput"
				></u-search>
			</view>
			<scroll-view class="tui-common-words-list" scroll-y="true">
				<u-empty mode="data" style="padding-top: 150rpx;" v-if="commonWordsMatch.length === 0"></u-empty>
				<u-swipe-action v-else>
					<u-swipe-action-item
						v-for="item in commonWordsMatch"
						:key="item.id"
						:name="item.id"
						:options="options"
						@click="deleteClick"
					>
						<view class="tui-common-words-item" @tap="sendMessage" :data-words="item.words">{{ item.words }}</view>
					</u-swipe-action-item>
				</u-swipe-action>
			</scroll-view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			words: '',
			flag: false,
			options: [{
				text: '删除',
				style: {
					color: '#FFFFFF',
					backgroundColor: '#F02727'
				}
			}],
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
		
		deleteClick(event) {
			if (this.flag){
				return;
			}
			this.flag = true;
			uni.showLoading({
				title:'正在删除'
			});
			uni.$u.http.post(`/medical-api/commonWords/delete/${event.name}`).then(res => {
				uni.hideLoading();
				uni.showToast({
					title: '删除成功',
					icon: 'success'
				});
				setTimeout(() => {
					this.getList();
				}, 1000)
			}).catch(error => {
				uni.hideLoading();
			}).finally(() => {
				this.flag = false;
			});
		},

		wordsInput() {
			(this.commonWordsMatch = []),
				this.commonWordsList.forEach(item => {
					if (item.words.indexOf(this.words.trim()) > -1) {
						this.commonWordsMatch.push(item);
					}
				});
			this.setData({
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
			uni.showLoading({
				title:'正在加载'
			});
			uni.$u.http.post('/medical-api/commonWords/list', {
				words: ''
			}).then(res => {
				res.data = res.data || [];
				this.words = '';
				this.commonWordsList = res.data;
				this.commonWordsMatch = this.commonWordsList;
			}).finally(() => {
				uni.hideLoading();
			});
		}
	}
};
</script>
<style>
@import './index.css';
</style>

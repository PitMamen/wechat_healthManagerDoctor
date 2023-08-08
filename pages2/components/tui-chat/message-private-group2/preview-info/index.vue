<template>
	<view v-show="display" class="tui-common-words-container">
		<view class="tui-common-words-box">
			<view class="tui-common-words-title">
				<view>预诊信息</view>
				<view style="color: #006EFF; font-family: PingFangSC-Regular; font-weight: normal;" class="tui-common-words-close" @tap="handleClose">关闭</view>
			</view>
			
			<view class="tui-common-words-content">
				<view class="depart">
					<scroll-view scroll-y="true" enable-flex="true">
						<u-empty
							v-if="tables.length === 0"
							mode="data"
							icon="/pages2/static/static/images/data.png"
						></u-empty>
						<table v-else>
							<tr v-for="(item, index) in tables" :key="index" @tap="handlePreview(item)">
								<td>{{ item.keyName }}</td>
								<td>{{ (item.createTime || '').split(' ')[0] }}</td>
							</tr>
						</table>
					</scroll-view>
				</view>
			</view>
			
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			tables: []
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
					key: '0'
				}
			});
		},
		handlePreview(item) {
			const questUrl = `${questionURL}/r/${item.projectKey}?userId=${item.userId}`
			uni.navigateTo({
				url: `/pages2/pages/TUI-User-Center/webview/webview?url=${questUrl}&nav=${item.keyName}`
			});
		},
		getList() {
			const taskItem = uni.getStorageSync('taskItem')
			uni.$u.http.get(`/questionnaire-api/user/project/result/page?userId=${taskItem.taskDetail.userId}&current=1&size=999999`).then(res => {
				res.data = res.data || {}
				res.data.records = res.data.records || []
				this.tables = res.data.records
			})
		}
	}
};
</script>
<style>
@import './index.css';

.tui-common-words-content table {
	width: 100%;
	border-spacing: 0;
	font-size: 14px;
	line-height: 28px;
}
.tui-common-words-content table tr td {
	border-right: 1px solid #006EFF;
	border-bottom: 1px solid #006EFF;
}
.tui-common-words-content table tr:first-child td {
	border-top: 1px solid #006EFF;
}
.tui-common-words-content table tr td:first-child {
	border-left: 1px solid #006EFF;
}
.tui-common-words-content .depart >>> .uni-scroll-view-content {
	height: 80vh;
}
</style>

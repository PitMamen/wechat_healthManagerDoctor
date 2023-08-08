<template>
	<view v-show="display" class="tui-common-words-container">
		<view class="tui-common-words-box">
			<view class="tui-common-words-title">
				<view>病历夹</view>
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
								<td>{{ item.rightsName }}</td>
								<td>{{ $u.timeFormat(item.createTime, 'yyyy-mm-dd') }}</td>
							</tr>
						</table>
					</scroll-view>
				</view>
			</view>
			
		</view>
		<view>
			<u-modal
				class="wenzhen-modal"
				title="问诊小结"
				confirmText="确定"
				:show="show"
				closeOnClickOverlay
				@confirm="() => show = false"
				@close="() => show = false"
			>
				<u--form
					labelPosition="left"
					ref="form"
				>
					<u-form-item
						label="病情描述"
					>
						<view>{{ current.dealDetail.chiefComplaint }}</view>
					</u-form-item>
					<u-form-item
						label="处置建议"
					>
						<view>{{ current.dealDetail.treatment }}</view>
					</u-form-item>
					<u-form-item
						label="医生"
					>
						<view>{{ current.dealUserName }}</view>
					</u-form-item>
					<u-form-item
						label="日期"
					>
						<view>{{ $u.timeFormat(current.createTime, 'yyyy-mm-dd') }}</view>
					</u-form-item>
				</u--form>
			</u-modal>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			show: false,
			current: {
				dealUserName: '',
				createTime: new Date().getTime(),
				dealDetail: {
					chiefComplaint: '',
					treatment: ''
				}
			},
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
					key: '4'
				}
			});
		},
		handlePreview(item) {
			this.show = true
			this.current = item
		},
		getList() {
			const taskItem = uni.getStorageSync('taskItem')
			uni.$u.http.get(`/health-api/patient/qryRightsUserSummary?userId=${taskItem.taskDetail.userId}`).then(res => {
				this.tables = res.data || []
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
.tui-common-words-container>>> .wenzhen-modal .u-modal__content {
	flex-direction: column !important;
}
.tui-common-words-content .depart >>> .uni-scroll-view-content {
	height: 80vh;
}
</style>

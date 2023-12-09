<template>
	<view>
		<view v-if="renderDom[0].type === 'order'" :class="'custom-message ' + (isMine ? 'my-custom' : '')">
			<image class="custom-image" :src="renderDom[0].imageUrl"></image>
			<view class="custom-content">
				<view class="custom-content-title">{{ renderDom[0].title }}</view>
				<view class="custom-content-description">{{ renderDom[0].description }}</view>
				<view class="custom-content-price">{{ renderDom[0].price }}</view>
			</view>
		</view>
		<view v-if="renderDom[0].type === 'consultion'" :class="'custom-message ' + (isMine ? 'my-custom' : '')">
			<view class="custom-content">
				<view class="custom-content-title">{{ renderDom[0].title }}</view>
				<view v-for="(item, index) in renderDom[0].item" :key="index" class="custom-content-description" :id="item.key">{{ item.key }}</view>
				<view class="custom-content-description">{{ renderDom[0].description }}</view>
			</view>
		</view>
		<view v-if="renderDom[0].type === 'evaluation'" :class="'custom-message ' + (isMine ? 'my-custom' : '')">
			<view class="custom-content">
				<view class="custom-content-title">{{ renderDom[0].title }}</view>
				<view class="custom-content-score">
					<image v-for="(item, index) in renderDom[0].score" :key="index" class="score-star" src="/pages2/static/static/images/star.png"></image>
				</view>
				<view class="custom-content-description">{{ renderDom[0].description }}</view>
			</view>
		</view>
		<view v-if="renderDom[0].type === 'group_create'" :class="'custom-message ' + (isMine ? 'my-custom' : '')">
			<view class="custom-content-text">{{ renderDom[0].text }}</view>
		</view>
		<view v-if="renderDom[0].type === 'c2cCalling' || renderDom[0].type === 'groupCalling'" :class="'custom-message ' + (isMine ? 'my-custom' : '')">
			<view class="custom-content-text">{{ renderDom[0].text }}</view>
		</view>
		<view v-if="renderDom[0].type === 'notSupport'" class="message-body-span text-message">
			<view class="message-body-span-text">{{ renderDom[0].text }}</view>
		</view>
		
		<view v-if="renderDom[0].type === 'CustomIllnessMessage'" :class="'custom-message custom-message-wrap ' + (isMine ? 'my-custom' : '')">
			<view class="wrap">
				<view class="title">
					<image src="/pages2/static/static/images/group/icon_treat.png"></image>{{ renderDom[0].title }}
				</view>
				<view class="content content2">
					<view class="row nowrap"><text>患者信息：</text>{{ renderDom[0].userInfo }}</view>
					<view class="row nowrap"><text>病情描述：</text>{{ renderDom[0].content }}</view>
				</view>
				<view class="action" @tap="previewWenZhen(renderDom[0])">
					<view class="btn">点击查看</view>
				</view>
			</view>
		</view>
		<view v-if="renderDom[0].type === 'CustomChuFangMessage'" :class="'custom-message custom-message-wrap ' + (isMine ? 'my-custom' : '')">
			<view class="wrap2">
				<view class="top">
					<view class="title">处方笺</view>
					<view class="desc">诊断：{{ renderDom[0].cfInfo.medicalOrdersCase.diagnosis }}</view>
				</view>
				<view class="middle">
					<view class="left">
						<view>Rp</view>
					</view>
					<view class="right">
						<view class="list">
							<view class="item" v-for="item in renderDom[0].cfInfo.medicalOrdersDetails" :key="item.drugCode">
								<view class="name">
									<text>{{ item.drugName }}(</text>
									<text class="gray">{{ item.drugSpec }}</text>
									<text>)</text>
								</view>
								<view class="desc">{{item.useFrequencyName}}；{{item.useNum}}{{item.useUnit}}/1次；{{item.drugUsemethodName}}</view>
							</view>
						</view>
					</view>
				</view>
				<view class="bottom" @tap="previewChufang(renderDom[0])">
					<view class="action">查看处方详情</view>
				</view>
			</view>
		</view>
		<view v-if="renderDom[0].type === 'CustomAppointmentTimeMessage'" :class="'custom-message ' + (isMine ? 'my-custom' : '')">
			<view class="custom-content">
				<view class="custom-content-title">{{ renderDom[0].title }}</view>
				<view class="custom-content-content">
					<view v-for="(item, index) in renderDom[0].time.split(',')" :key="index">
						{{ `时间${['一','二','三'][index]}: ${item}` }}
					</view>
				</view>
				<view v-if="renderDom[0].title === '预约时间'" class="custom-content-action" @tap="cardTrigger(renderDom[0])">预约时间>></view>
			</view>
		</view>
		<view v-if="renderDom[0].type === 'CustomArticleMessage'" :class="'custom-message custom-message-wrap ' + (isMine ? 'my-custom' : '')">
			<view class="wrap">
				<view class="title">
					<image src="/pages2/static/static/images/group/icon_note.png"></image>{{ renderDom[0].title }}
				</view>
				<view class="content">
					<view class="row nowrap"><text>文章名称：</text>{{ renderDom[0].name }}</view>
				</view>
				<view class="action" @tap="previewArticle(renderDom[0].id)">
					<view class="btn">点击查看</view>
				</view>
			</view>
		</view>
		<view v-if="renderDom[0].type === 'CustomWenJuanMessage'" :class="'custom-message custom-message-wrap ' + (isMine ? 'my-custom' : '')">
			<view class="wrap">
				<view class="title">
					<image src="/pages2/static/static/images/group/icon_paper.png"></image>{{ renderDom[0].title }}
					<image src="/pages2/static/static/images/group/done.png" class="abs" v-if="renderDom[0].done"></image>
				</view>
				<view class="content">
					<view class="row nowrap"><text>问卷名称：</text>{{ renderDom[0].name }}</view>
				</view>
				<view class="action" @tap="preview(renderDom[0].url, renderDom[0].name)">
					<view class="btn">点击查看</view>
				</view>
			</view>
		</view>
		
		<view v-if="renderDom[0].type === 'CustomfollowMessage'"
			:class="'custom-message custom-message-wrap ' + (isMine ? 'my-custom' : '')">
			<view class="wrap">
				<view class="title">
					<image src="/pages2/static/static/images/group/suifangjh.png"></image>{{ renderDom[0].title }}
				</view>
				<view class="content" style="height: 140rpx;">
					<view style="color: #999999;margin-top: 30rpx;" class="row nowrap">为您推荐康复随访计划</view>
					<view style="margin-bottom: 20rpx;margin-top: 15rpx;" class="row nowrap">{{ renderDom[0].name }}
					</view>
				</view>
				<view class="action" @tap="goPlanDetail(renderDom[0].id)">
					<view class="btn">点击查看</view>
				</view>
			</view>
		</view>
		
		
		<view v-if="renderDom[0].type === 'CustomsummaryMessage'"
			:class="'custom-message custom-message-wrap ' + (isMine ? 'my-custom' : '')">
			<view class="wrap">
				<view class="title">
					<image src="/pages2/static/static/images/group/xiaojie.png"></image>{{ renderDom[0].title }}
				</view>
				<view class="content" style="height: 140rpx;">
				<view style="color: #1A1A1A;margin-top: 30rpx;" class="row nowrap"><text
						style="color: #999999;">随访计划:</text>{{ renderDom[0].planName }}</view>
				<view style="margin-bottom: 20rpx;margin-top: 15rpx;color: #1A1A1A" class="row nowrap"><text
						style="color: #999999;">小结:</text>{{ renderDom[0].name }}
				</view>
				</view>
				<view class="action" @tap="gosummary(renderDom[0].name)">
					<view class="btn">点击查看</view>
				</view>
			</view>
		</view>
		
		
		
		
		
		
		
		
		<view v-if="renderDom[0].type === 'CustomAnalyseMessage'" :class="'custom-message ' + (isMine ? 'my-custom' : '')">
			<view class="custom-content">
				<view class="custom-content-title">{{ renderDom[0].title }}</view>
				<view class="custom-content-content"><text style="color: #000000;">医生：</text>{{ renderDom[0].doctor }}</view>
				<view class="custom-content-content"><text style="color: #000000;">时间：</text>{{ renderDom[0].time }}</view>
				<view class="custom-content-action" @tap="modalTrigger(renderDom[0])">查看小结>></view>
			</view>
		</view>
		<view v-if="renderDom[0].type === 'CustomDoctorReceptionMessage'" :class="'custom-message ' + (isMine ? 'my-custom' : '')">
			<view class="custom-content">
				<view class="custom-content-title">{{ renderDom[0].title }}</view>
				<view class="custom-content-content"><text style="color: #000000;">医生：</text>{{ renderDom[0].doctor }}</view>
				<view class="custom-content-content"><text style="color: #000000;">时间：</text>{{ renderDom[0].time }}</view>
			</view>
		</view>
		<view v-if="renderDom[0].type === 'CustomDoctorRefuseMessage'" :class="'custom-message ' + (isMine ? 'my-custom' : '')">
			<view class="custom-content">
				<view class="custom-content-title">{{ renderDom[0].title }}</view>
				<view class="custom-content-content"><text style="color: #000000;">医生：</text>{{ renderDom[0].doctor }}</view>
				<view class="custom-content-content"><text style="color: #000000;">原因：</text>{{ renderDom[0].reason }}</view>
			</view>
		</view>
		<view v-if="renderDom[0].type === 'CustomDoctorChuFangMessage'" :class="'custom-message ' + (isMine ? 'my-custom' : '')">
			<view class="custom-content">
				<view class="custom-content-title">{{ renderDom[0].title }}</view>
				<view class="custom-content-content"><text style="color: #000000;">诊断结果：</text>{{ renderDom[0].diagnosis }}</view>
				<view class="custom-content-content"><text style="color: #000000;">用药建议：</text>{{ renderDom[0].suggestion }}</view>
				<view class="custom-content-action" @tap="previewChufang(renderDom[0])">查看详情>></view>
			</view>
		</view>
		<view v-if="renderDom[0].type === 'FengshikeIllnessMessage'" :class="'custom-message ' + (isMine ? 'my-custom' : '')">
			<view class="custom-content">
				<view class="custom-content-title">{{ renderDom[0].title }}</view>
				<view class="custom-content-content">{{ renderDom[0].content }}</view>
				<view class="custom-content-action" @tap="cardTrigger(renderDom[0])">查看详情>></view>
			</view>
		</view>
		<view v-if="renderDom[0].type === 'Fengshike2IllnessMessage'" :class="'custom-message ' + (isMine ? 'my-custom' : '')">
			<view class="custom-content">
				<view class="custom-content-title">{{ renderDom[0].title }}</view>
				<view class="custom-content-content">{{ renderDom[0].content }}</view>
				<view class="custom-content-action" @tap="cardTrigger(renderDom[0])">查看详情>></view>
			</view>
		</view>
		
		<view class="wenzhen">
			<u-modal
				class="wenzhen-modal"
				title="问诊小结"
				confirmText="确定"
				:show="showWenzhen"
				closeOnClickOverlay
				@confirm="() => showWenzhen = false"
				@close="() => showWenzhen = false"
			>
				<u--form
					labelPosition="left"
					ref="form"
				>
					<u-form-item
						label="病情描述"
					>
						<view>{{ wenzhen.chiefComplaint }}</view>
					</u-form-item>
					<u-form-item
						label="处置建议"
					>
						<view>{{ wenzhen.treatment }}</view>
					</u-form-item>
					<u-form-item
						label="医生"
					>
						<view>{{ wenzhen.doctor }}</view>
					</u-form-item>
					<u-form-item
						label="日期"
					>
						<view>{{ wenzhen.time }}</view>
					</u-form-item>
				</u--form>
			</u-modal>
		</view>
	</view>
</template>

<script>
import { formateTime } from '../../../base/common.js';

export default {
	data() {
		return {
			showWenzhen: false,
			wenzhen: {
				chiefComplaint: '',
				treatment: '',
				doctor: '',
				time: ''
			}
		};
	},
	components: {},
	props: {
		message: {
			type: Object,
			default: () => {}
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
					message: newVal,
					renderDom: this.parseCustom(newVal)
				});
			},
			immediate: true,
			deep: true
		}
	},
	methods: {
		// 解析音视频通话消息
		extractCallingInfoFromMessage(message) {
			const callingmessage = JSON.parse(message.payload.data);
			if (callingmessage.businessID !== 1) {
				return '';
			}
			const objectData = JSON.parse(callingmessage.data);
			switch (callingmessage.actionType) {
				case 1: {
					if (objectData.call_end >= 0 && !callingmessage.groupID) {
						return `通话时长：${formateTime(objectData.call_end)}`;
					}
					if (callingmessage.groupID) {
						return '结束群聊';
					}
					if (objectData.data && objectData.data.cmd === 'switchToAudio') {
						return '切换语音通话';
					}
					if (objectData.data && objectData.data.cmd === 'switchToVideo') {
						return '切换视频通话';
					}
					return '发起通话';
				}
				case 2:
					return '取消通话';
				case 3:
					if (objectData.data && objectData.data.cmd === 'switchToAudio') {
						return '切换语音通话';
					}
					if (objectData.data && objectData.data.cmd === 'switchToVideo') {
						return '切换视频通话';
					}
					return '已接听';
				case 4:
					return '拒绝通话';
				case 5:
					if (objectData.data && objectData.data.cmd === 'switchToAudio') {
						return '切换语音通话';
					}
					if (objectData.data && objectData.data.cmd === 'switchToVideo') {
						return '切换视频通话';
					}
					return '无应答';
				default:
					return '';
			}
		},
		parseCustom(message) {
			// 约定自定义消息的 data 字段作为区分，不解析的不进行展示
			if (message.payload.data === 'order') {
				const extension = JSON.parse(message.payload.extension);
				const renderDom = [
					{
						type: 'order',
						name: 'custom',
						title: extension.title || '',
						imageUrl: extension.imageUrl || '',
						price: extension.price || 0,
						description: message.payload.description
					}
				];
				return renderDom;
			} // 客服咨询

			if (message.payload.data === 'consultion') {
				const extension = JSON.parse(message.payload.extension);
				const renderDom = [
					{
						type: 'consultion',
						title: extension.title || '',
						item: extension.item || 0,
						description: extension.description
					}
				];
				return renderDom;
			} // 服务评价

			if (message.payload.data === 'evaluation') {
				const extension = JSON.parse(message.payload.extension);
				const renderDom = [
					{
						type: 'evaluation',
						title: message.payload.description,
						score: extension.score,
						description: extension.comment
					}
				];
				return renderDom;
			} // 群消息解析
			// 群消息解析
			if (message.payload.data === 'group_create') {
				const renderDom = [
					{
						type: 'group_create',
						text: message.payload.extension
					}
				];
				return renderDom;
			}
			
			
			
			const customData = JSON.parse(message.payload.data);
			if (customData.type === 'CustomIllnessMessage') {
				const renderDom = [
					{
						type: 'CustomIllnessMessage',
						title: message.payload.description,
						userInfo: customData.userInfo,
						content: customData.content,
						imageList: (customData.imageList || '').split(','),
						time: customData.time,
						rightsId: customData.rightsId,
						tradeId: customData.tradeId
					}
				];
				return renderDom;
			}
			if (customData.type === 'CustomChuFangMessage') {
				const renderDom = [
					{
						type: 'CustomChuFangMessage',
						title: message.payload.description,
						preNo: customData.preNo,
						cfInfo: customData.cfInfo
					}
				];
				return renderDom;
			}
			if (customData.type === 'FengshikeIllnessMessage') {
				const renderDom = [
					{
						type: 'FengshikeIllnessMessage',
						title: customData.title,
						content: customData.content,
						question1: customData.question1,
						question2: customData.question2,
						question3: customData.question3,
						imageList: (customData.imageList || '').split(','),
						time: customData.time,
						tradeId: customData.tradeId
					}
				];
				return renderDom;
			}
			if (customData.type === 'Fengshike2IllnessMessage') {
				const renderDom = [
					{
						type: 'Fengshike2IllnessMessage',
						title: customData.title,
						content: customData.content,
						question1: customData.question1,
						question2: customData.question2,
						question3: customData.question3,
						answer1: customData.answer1,
						answer2: customData.answer2,
						answer3: customData.answer3,
						imageList: (customData.imageList || '').split(','),
						time: customData.time,
						tradeId: customData.tradeId
					}
				];
				return renderDom;
			}
			if (customData.type === 'CustomAppointmentTimeMessage') {
				const renderDom = [
					{
						type: 'CustomAppointmentTimeMessage',
						title: message.payload.description,
						time: customData.time,
						tradeId: customData.tradeId
					}
				];
				return renderDom;
			}
			if (customData.type === 'CustomArticleMessage') {
				const renderDom = [
					{
						type: 'CustomArticleMessage',
						title: message.payload.description,
						id: customData.id,
						name: customData.content,
						url: customData.url
					}
				];
				return renderDom;
			}
			if (customData.type === 'CustomWenJuanMessage') {
				const renderDom = [
					{
						type: 'CustomWenJuanMessage',
						title: message.payload.description,
						name: customData.name,
						done: customData.done,
						url: customData.url
					}
				];
				return renderDom;
			}
			if (customData.type === 'CustomAnalyseMessage') {
				const renderDom = [
					{
						type: 'CustomAnalyseMessage',
						title: message.payload.description,
						chiefComplaint: customData.content,
						treatment: customData.msgDetailId,
						doctor: customData.dealName,
						time: customData.time
					}
				];
				return renderDom;
			}
			if (customData.type === 'CustomDoctorReceptionMessage') {
				const renderDom = [
					{
						type: 'CustomDoctorReceptionMessage',
						title: message.payload.description,
						doctor: customData.docName,
						time: (customData.time || '').split(' ')[0]
					}
				];
				return renderDom;
			}
			if (customData.type === 'CustomDoctorRefuseMessage') {
				const renderDom = [
					{
						type: 'CustomDoctorRefuseMessage',
						title: message.payload.description,
						doctor: customData.docName,
						reason: customData.reason
					}
				];
				return renderDom;
			}
			if (customData.type === 'CustomDoctorChuFangMessage') {
				const renderDom = [
					{
						type: 'CustomDoctorChuFangMessage',
						title: message.payload.description,
						preNo: customData.preNo,
						diagnosis: customData.diagnosis,
						suggestion: customData.suggestion
					}
				];
				return renderDom;
			}
			
			
			if (customData.type === 'CustomfollowMessage') {
				const renderDom = [{
					type: 'CustomfollowMessage',
					title: message.payload.description,
					id: customData.id,
					name: customData.name,
					url: customData.url
				}];
				return renderDom;
			}
			
			
			// 随访小结卡片
			if (customData.type === 'CustomsummaryMessage') {
				const renderDom = [{
					type: 'CustomsummaryMessage',
					title: message.payload.description,
					id: customData.id,
					name: customData.content,
					planName:customData.name,
					url: customData.url
				}];
				return renderDom;
			}
			
			
			
			
			
			// 音视频通话消息解析
			const callingmessage = JSON.parse(message.payload.data);

			if (callingmessage.businessID === 1) {
				if (message.conversationType === 'GROUP') {
					if (message.payload.data.actionType === 5) {
						message.nick = message.payload.data.inviteeList ? message.payload.data.inviteeList.join(',') : message.from;
					}
					const _text = this.extractCallingInfoFromMessage(message);
					const groupText = `${_text}`;
					const renderDom = [
						{
							type: 'groupCalling',
							text: groupText,
							userIDList: []
						}
					];
					return renderDom;
				}
				if (message.conversationType === 'C2C') {
					const c2cText = this.extractCallingInfoFromMessage(message);
					const renderDom = [
						{
							type: 'c2cCalling',
							text: c2cText
						}
					];
					return renderDom;
				}
			}

			if (message.payload.data === 'group_create') {
				const renderDom = [
					{
						type: 'group_create',
						text: message.payload.extension
					}
				];
				return renderDom;
			}

			return [
				{
					type: 'notSupport',
					text: '[自定义消息]'
				}
			];
		},
		
		cardTrigger(item) {
			switch (item.type) {
				case 'Fengshike2IllnessMessage':
					item.key = '8'
					this.$bus.$emit('cardTrigger', item);
					this.$bus.$emit('cardShow', item);
					break;
					
				case 'FengshikeIllnessMessage':
					item.key = '7'
					this.$bus.$emit('cardTrigger', item);
					this.$bus.$emit('cardShow', item);
					break;
				
				case 'CustomIllnessMessage':
					item.key = '6'
					this.$bus.$emit('cardTrigger', item);
					this.$bus.$emit('cardShow', item);
					break;
					
				case 'CustomAppointmentTimeMessage':
					item.key = '5';
					this.$bus.$emit('cardTrigger', item);
					this.$bus.$emit('cardShow', item);
					break;
					
				default:
					break;
			}
		},
		
		modalTrigger(item) {
			this.wenzhen = item;
			this.showWenzhen = true;
		},
		
		preview(url, title) {
			uni.navigateTo({
				url: `/pages2/pages/TUI-User-Center/webview/webview?url=${encodeURIComponent(url)}&nav=${title}`
			});
		},
		
		gosummary(content) {
			uni.showModal({
				title: '随访小结',
				content: content,
				success: function (res) {
					if (res.confirm) {
						// this.finish()
						// console.log('用户点击确定');
					} else if (res.cancel) {
						// console.log('用户点击取消');
					}
				}
			});
		},
		
		goPlanDetail(id) {
			uni.navigateTo({
				url: '/pages2/pages/follow/myfollowdetail?planId=' + id
			});
		},
		
		
		
		previewArticle(id) {
			uni.navigateTo({
				url: `/pages2/pages/article/index?id=${id}`
			});
		},
		previewChufang(item) {
			uni.navigateTo({
				url: `/pages2/pages/chufang2/cf-detail?preNo=${item.preNo}`
			});
		},
		previewWenZhen(item) {
			uni.navigateTo({
				url: `/pages2/pages/group/card?rightsId=${item.rightsId}&tradeId=${item.tradeId}`
			});
		}
	}
};
</script>

<style>
@import './index.css';

.wenzhen>>> .wenzhen-modal .u-modal__content {
	flex-direction: column !important;
}
</style>
<style lang="scss">
	.custom-message-wrap {
		width: 500rpx;
		background: #FFFFFF;
		box-shadow: 0rpx 2rpx 4rpx 0rpx rgba(204,204,204,0.35);
		&.custom-message {
			display: block;
			padding: 0;
			border: none;
			border-radius: 8rpx;
		}
		.wrap {
			.title {
				position: relative;
				display: flex;
				justify-content: flex-start;
				align-items: center;
				height: 62rpx;
				padding: 0 20rpx;
				font-size: 28rpx;
				font-weight: 500;
				color: #4D4D4D;
				line-height: 37rpx;
				background: #EFF6FF;
				image {
					width: 32rpx;
					height: 32rpx;
					margin-right: 16rpx;
					&.abs {
						position: absolute;
						top: 4rpx;
						right: 20rpx;
						width: 62rpx;
						height: 54rpx;
						margin-right: 0;
					}
				}
			}
			.content {
				display: flex;
				flex-direction: column;
				justify-content: space-evenly;
				height: 86rpx;
				padding: 0 20rpx;
				&.content2 {
					height: 140rpx;
				}
				.row {
					font-size: 28rpx;
					font-weight: 400;
					color: #1A1A1A;
					line-height: 37rpx;
					&.nowrap {
						max-width: 100%;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}
					text {
						color: #999999;
					}
				}
			}
			.action {
				display: flex;
				justify-content: center;
				align-items: center;
				height: 108rpx;
				border-top: 1rpx solid #E6E6E6;
				.btn {
					width: 168rpx;
					font-size: 28rpx;
					font-weight: 400;
					color: #FFFFFF;
					line-height: 48rpx;
					text-align: center;
					background: #3894FF;
					border-radius: 4rpx;
				}
			}
		}
		.wrap2 {
			padding: 20rpx 20rpx 20rpx 30rpx;
			.top {
				border-bottom: 1rpx solid #E6E6E6;
				.title {
					margin-bottom: 10rpx;
					font-size: 30rpx;
					font-weight: 400;
					color: #F02727;
					line-height: 50rpx;
				}
				.desc {
					margin-bottom: 20rpx;
					font-size: 28rpx;
					font-weight: 400;
					color: #999999;
					line-height: 48rpx;
				}
			}
			.middle {
				display: flex;
				justify-content: space-between;
				align-items: flex-start;
				padding-top: 22rpx;
				padding-bottom: 8rpx;
				border-bottom: 1rpx solid #E6E6E6;
				.left {
					margin-right: 20rpx;
					view {
						font-size: 30rpx;
						font-weight: 400;
						color: #F02727;
						line-height: 46rpx;
					}
				}
				.right {
					flex: 1;
					.list {
						.item {
							margin-bottom: 14rpx;
							.name {
								max-width: 400rpx;
								font-size: 30rpx;
								font-weight: 400;
								color: #1A1A1A;
								line-height: 46rpx;
								white-space: nowrap;
								overflow: hidden;
								text-overflow: ellipsis;
								.gray {
									color: #999999;
								}
							}
							.desc {
								max-width: 400rpx;
								font-size: 24rpx;
								font-weight: 400;
								color: #999999;
								line-height: 40rpx;
								white-space: nowrap;
								overflow: hidden;
								text-overflow: ellipsis;
							}
						}
					}
				}
			}
			.bottom {
				padding: 20rpx 0;
				overflow: hidden;
				.action {
					float: right;
					font-size: 30rpx;
					font-weight: 400;
					color: #999999;
					line-height: 46rpx;
				}
			}
		}
	}
</style>

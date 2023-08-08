<template>
	<view v-show="display" class="tui-common-words-container">
		<view class="tui-common-words-box">
			<view class="tui-common-words-title">
				<view>病情描述</view>
				<view style="color: #006EFF; font-family: PingFangSC-Regular; font-weight: normal;" class="tui-common-words-close" @tap="handleClose">关闭</view>
			</view>
			
			<view class="tui-common-words-content" v-if="model === 'model1'">
				<view class="depart">
					<view class="title">自述</view>
					<view class="content">{{ message.content || '' }}</view>
				</view>
				<view class="depart">
					<view class="title">图片资料</view>
					<view class="album">
						<u-album :urls="message.imageList"></u-album>
					</view>
				</view>
			</view>
			<view class="tui-common-words-content" v-else>
				<view class="depart">
					<view style="margin-bottom: 10rpx;">
						<text>就诊人：张三</text>
					</view>
					<view style="margin-bottom: 10rpx;">
						<text>性别：男</text>
						<text style="float: right;">年龄：40</text>
					</view>
					<view>
						<text>电话：18888888888</text>
					</view>
				</view>
				<view class="depart">
					<view class="title">病情简介</view>
					<view class="album">
						<u-album :urls="message.imageList"></u-album>
					</view>
				</view>
			</view>
			
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			model: 'model1'
		};
	},

	components: {},
	props: {
		display: {
			type: Boolean,
			default: false
		},
		message: {
			type: Object,
			default(){
				return {
					imageList: []
				}
			}
		}
	},
	watch: {
		display: {
			handler: function(newVal) {
				// this.setData({
				//   display: newVal
				// });
			},
			immediate: true
		}
	},
	methods: {
		handleClose() {
			this.$emit('close', {
				detail: {
					key: '6'
				}
			});
		},
	}
};
</script>
<style>
@import './index.css';
</style>

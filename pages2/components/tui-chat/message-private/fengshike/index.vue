<template>
	<view v-show="display" class="tui-common-words-container">
		<view class="tui-common-words-box">
			<view class="tui-common-words-title">
				<view>病情咨询</view>
				<view style="color: #006EFF; font-family: PingFangSC-Regular; font-weight: normal;" class="tui-common-words-close" @tap="handleClose">关闭</view>
			</view>
			
			<view class="tui-common-words-content">
				<view class="depart" v-if="message.question1">
					<view class="title">问题1:  {{ message.question1 }}</view>
					<view class="content">
						<u--textarea 
							v-model="answer1" 
							:autoHeight="true" 
							class="input" 
							maxlength="10000" 
							placeholder="请输入回复">
						</u--textarea>
					</view>
				</view>
				<view class="depart" v-if="message.question2">
					<view class="title">问题2:  {{ message.question2 }}</view>
					<view class="content">
						<u--textarea 
							v-model="answer2" 
							:autoHeight="true" 
							class="input" 
							maxlength="10000" 
							placeholder="请输入回复">
						</u--textarea>
					</view>
				</view>
				<view class="depart" v-if="message.question3">
					<view class="title">问题3:  {{ message.question3 }}</view>
					<view class="content">
						<u--textarea 
							v-model="answer3" 
							:autoHeight="true" 
							class="input" 
							maxlength="10000" 
							placeholder="请输入回复">
						</u--textarea>
					</view>
				</view>
				<view class="depart" v-if="message.imageList && message.imageList[0]">
					<view class="title">图片资料</view>
					<view class="album">
						<u-album :urls="message.imageList"></u-album>
					</view>
				</view>
				<view class="depart">
					<view class="submits">
						<text class="btn cancel" @click="handleClose()">取消</text>
						<text class="btn" @click="submit()">提交回复</text>
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
			answer1: '',
			answer2: '',
			answer3: ''
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
		submit() {
			this.answer1 = this.answer1.trim();
			this.answer2 = this.answer2.trim();
			this.answer3 = this.answer3.trim();
			if (this.message.question1){
				if (!this.answer1){
					uni.$u.toast('请输入问题1回复');
					return;
				}
			}
			if (this.message.question2){
				if (!this.answer2){
					uni.$u.toast('请输入问题2回复');
					return;
				}
			}
			if (this.message.question3){
				if (!this.answer3){
					uni.$u.toast('请输入问题3回复');
					return;
				}
			}
			this.$emit('sendCard', {
				detail: {
					payload: {
						data: JSON.stringify({
							...{},
							...this.message,
							...{
								type: 'Fengshike2IllnessMessage',
								title: '咨询回复',
								description: '咨询回复',
								content: '我已回复您的咨询问题',
								answer1: this.answer1,
								answer2: this.answer2,
								answer3: this.answer3,
								imageList: this.message.imageList.join(',')
							}
						}),
						extension: '',
						description: '咨询回复'
					}
				}
			});
			setTimeout(() => {
				this.$bus.$emit('wenzhenFinish', {});
			});
		},
		handleClose() {
			this.$emit('close', {
				detail: {
					key: '7'
				}
			});
		}
	}
};
</script>
<style>
@import './index.css';

.depart .input {
	text-indent: 0;
	min-height: 138rpx;
}

.depart .submits {
	display: flex;
	margin-top: 10rpx;
	justify-content: center;
}

.depart .submits .btn {
	display: inline-block;
	width: 208rpx;
	padding: 30rpx 0;
	font-size: 17px;
	font-family: PingFang SC;
	font-weight: 400;
	color: #FFFFFF;
	line-height: 17px;
	text-align: center;
	background: #007BF5;
	border-radius: 8rpx;
}

.depart .submits .btn.cancel {
	margin-right: 30rpx;
	background: #999999;
}
</style>

<template>
	<view :class="'audio-message ' + (isMine ? 'my-audio' : '')">
		<image class="audio-icon" src="../../../../static/static/images/group/audio-playing.gif" @click="handlePlayAudioMessage" v-if="play"></image>
		<image class="audio-icon" src="../../../../static/static/assets/audio-black.svg" @click="handlePlayAudioMessage" v-else></image>
		<view class="audio " @click="handlePlayAudioMessage" :style="'width: ' + lengths(message.payload.second) + 'rpx'">{{ message.payload.second? message.payload.second+'" ':'' }}</view>
	</view>
</template>

<script>
const app = getApp();

export default {
	data() {
		return {
			audio: {},
			play: false
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
					message: newVal
				});
			},
			immediate: true,
			deep: true
		}
	},

	beforeMount() {
		this.audio = uni.createInnerAudioContext();
		this.audio.onPlay(() => {
			console.log('开始播放');
			this.play = true;
		});
		this.audio.onPause(() => {
			console.log('停止播放onPause');
			this.play = false;
			app.globalData.preAudio = null;
		});
		this.audio.onStop(() => {
			console.log('停止播放onStop');
			this.play = false;
			app.globalData.preAudio = null;
		});
		this.audio.onEnded(() => {
			console.log('停止播放onEnded');
			this.play = false;
			app.globalData.preAudio = null;
		});
		this.audio.onError(e => {
			console.error(e, 'onError');
			// ios 音频播放无声，可能是因为系统开启了静音模式
			this.play = false;
			uni.showToast({
				icon: 'none',
				title: '该音频暂不支持播放'
			});
		});
	},

	methods: {
		lengths(senconds) {
			let length = 40;
			if (senconds){
				length = senconds / 60 * 418;
				if (length > 418){
					length = 418;
				}
				if (length < 40){
					length = 40;
				}
			}
			return length;
		},
		handlePlayAudioMessage() {
			if (app.globalData.preAudio){
				app.globalData.preAudio.stop();
			}
			app.globalData.preAudio = this.audio;
			this.audio.src = this.message.payload.url || this.message.payload.remoteAudioUrl;
			this.audio.play();
		}
	}
};
</script>

<style>
@import './index.css';
</style>

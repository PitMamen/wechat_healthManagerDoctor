<template>
	<view class="content">
		<view id="box">
			<u-navbar :is-back="true" :borderBottom='false' border-bottom='false' :back-icon-color='bacicon' :immersive='true'  title-size='32rpx' :title-color='tit_c' :title="text" :background="background">
				<view slot='right'>
					<view class="right" :style="{'color':textColor,'fontSize':textSize}">
						<text v-if="right=='text'">{{riText}}</text> 
						<slot v-else name="icon">
							
						</slot>
					</view>
				</view>
			</u-navbar>


		</view>

	</view>
</template>

<script>
	export default {
		props:{
			tit_c:{
				type: String,
				default: '#fff'
			},
			riText:{
				type: String,
				default: ''
			},
			textColor:{
				type: String,
				default: '#fff'
			},
			textSize:{
				type: String,
				default: '20rpx'
			},
			right:{
				type: String,
				default: 'text'
			},
			text:{
				type: String,
				default: '矿机二号'
			},
			background: {
				type: Object,
				default () {
					return {
						backgroundColor: '#1989FA'
					}
				}
			},
			bacicon:{
				type: String,
				default: '#fff'
			},
			
		},
		mounted() {
			console.log('----------');
			console.log(this.text); 
		}
	}
</script>

<style lang="scss" scoped>
	.right{
		margin-right: 20rpx;
	}
</style>

<template>
	<view v-show="show" class="wrap-rate-popup">
		<view class="box">
			<view class="head">
				<view class="title">患者的评价</view>
				<u-icon class="icon-close" name="close" @tap="close"></u-icon>
			</view>
			<view class="content" v-if="broadClassify === 2">
				<view class="item-rate">
					<view class="word">总体评价</view>
					<view class="rate"  style="margin-left: 90rpx;">						
						<u-rate
						   
							:count="5"
							:value="info.allAppraise"
							size="18"
							gutter="20"
							active-color="#F1A918"
							inactive-color="#F2F2F2"
							allowHalf
							readonly
						></u-rate>
					</view>
				</view>
				<view class="item-rate">
					<view class="word">医生评价</view>
					<view class="rate"  style="margin-left: 90rpx;">						
						<u-rate
						 
							:count="5"
							:value="info.doctorAppraise"
							size="18"
							gutter="20"
							active-color="#F1A918"
							inactive-color="#F2F2F2"
							allowHalf
							readonly
						></u-rate>
					</view>
				</view>
                <view class="item-rate">
					<view class="word">个案管理师评价</view>
					<view class="rate">						
						<u-rate
							:count="5"
							:value="info.managerAppraise"
							size="18"
							gutter="20"
							active-color="#F1A918"
							inactive-color="#F2F2F2"
							allowHalf
							readonly
						></u-rate>
					</view>
				</view>
				<view class="desc">{{ info.patientOpinion||'' }}</view>
			</view>
			<view class="content" v-else>
				<view class="item-rate">
					<view class="word">医生总评</view>
					<view class="rate">						
						<u-rate
							:count="5"
							:value="info.doctorAllAppraise"
							size="18"
							gutter="20"
							active-color="#F1A918"
							inactive-color="#F2F2F2"
							allowHalf
							readonly
						></u-rate>
					</view>
				</view>
				<view class="item-rate">
					<view class="word">服务质量</view>
					<view class="rate">						
						<u-rate
							:count="5"
							:value="info.serviceMass"
							size="18"
							gutter="20"
							active-color="#F1A918"
							inactive-color="#F2F2F2"
							allowHalf
							readonly
						></u-rate>
					</view>
				</view>
				<view class="item-rate">
					<view class="word">服务态度</view>
					<view class="rate">						
						<u-rate
							:count="5"
							:value="info.serviceManner"
							size="18"
							gutter="20"
							active-color="#F1A918"
							inactive-color="#F2F2F2"
							allowHalf
							readonly
						></u-rate>
					</view>
				</view>
				<view class="item-rate">
					<view class="word">系统使用</view>
					<view class="rate">						
						<u-rate
							:count="5"
							:value="info.systemUse"
							size="18"
							gutter="20"
							active-color="#F1A918"
							inactive-color="#F2F2F2"
							allowHalf
							readonly
						></u-rate>
					</view>
				</view>
				<view class="desc">{{ info.patientOpinion||'' }}</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			broadClassify: '',    //2 专科  1 在线咨询 
			show: false,
			info: {}
		};
	},
	components: {},
	props: {
	},
	watch: {
	},
	methods: {
		open(id, broadClassify) {
			this.broadClassify = broadClassify;
			
			console.log("ZZZZ:",this.broadClassify)
			this.show = true;
			
			this.getInfo(id);
		},
		close() {
			this.show = false;
		},
		getInfo(id) {
			uni.showLoading({
				title:'正在加载'
			});
			uni.$u.http.post(`/medical-api/tfUserAppraise/getAppraiseByOrderId/${id}`).then(res => {
				console.log("BBBB:",res.data)
				this.info = res.data || {};
				if(this.info.doctorAllAppraise==null){
					this.info.doctorAllAppraise = 0
				}
				if(this.info.serviceMass==null){
					this.info.serviceMass=0
				}
				if(this.info.serviceManner==null){
					this.info.serviceManner=0
				}
				if(this.info.systemUse==null){
					this.info.systemUse=0
				}
				
				// console.log("EEEE:",this.info.doctorAllAppraise,this.info.serviceMass,this.info.serviceManner,this.info.systemUse)
				
				
				
				
				
			}).finally(() => {
				uni.hideLoading();
			});
		}
	}
};
</script>

<style lang="scss">
	.wrap-rate-popup {
		position: fixed;
		width: 100vw;
		height: 100vh;
		z-index: 100;
		top: 0;
		background: rgba(0, 0, 0, 0.5);
		.box {
			position: absolute;
			width: 100%;
			bottom: 0;
			background: rgba(255, 255, 255, 1);
			padding-bottom: 55rpx;
			z-index: 200;
			.head {
				position: relative;
				padding: 20rpx 24rpx;
				border-bottom: 1rpx solid #E6E6E6;
				.title {
					font-size: 30rpx;
					font-weight: 400;
					color: #1A1A1A;
					line-height: 48rpx;
					text-align: center;
				}
				.icon-close {
					position: absolute;
					top: 28rpx;
					right: 24rpx;
					font-size: 30rpx;
					color: #999999;
					line-height: 48rpx;
				}
			}
			.content {
				padding: 15rpx 24rpx;
				.item-rate {
					display: flex;
					justify-content: flex-start;
					align-items: center;
					.word {
						margin-left: 6rpx;
						margin-right: 30rpx;
						font-size: 30rpx;
						font-weight: 400;
						color: #4D4D4D;
						line-height: 60rpx;
					}
					.rate {
						/deep/ .u-icon__icon {
							padding-left: 10rpx !important;
							padding-right: 10rpx !important;
							font-size: 45rpx !important;
							line-height: 45rpx !important;
						}
					}
				}
				.desc {
					max-height: 50vh;
					min-height: 160rpx;
					margin-top: 15rpx;
					padding: 12rpx 20rpx;
					font-size: 30rpx;
					font-weight: 400;
					color: #999999;
					line-height: 45rpx;
					overflow-y: auto;
					background: #F2F2F2;
					border-radius: 4rpx;
				}
			}
		}
	}
</style>

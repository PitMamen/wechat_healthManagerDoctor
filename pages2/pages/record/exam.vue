<template>
	<view>

		<view
			style="background-image: url('https://hmg.mclouds.org.cn/content-api/file/I20211014143935478K8JK9TVTJ7QWFG-20211014143717.png'); "
			class="top">
			<view class="top-h1">
				<view style="font-size: 36rpx;margin-right: 19rpx;">{{options.title}}</view>
			</view>
			<!-- <view class="top-h2">
				<view class="top-l">标本名称：{{options.title}}</view>
		 </view> -->
			<view class="top-h2">
				<view class="top-l">检验单号：{{detail.inspectId}}</view>
				<view>报告日期：{{options.reportTime}}</view>
			</view>
		</view>

		<view class="case-block">
			<view class="case-title">检验指标</view>
			<view class="case-content" v-if="!detail.items || detail.items.length == 0">无数据</view>
			<view v-else>
				<view class="row">
					<u-row>
						<u-col span="4">项目指标</u-col>
						<u-col span="4">检查结果</u-col>
						<u-col span="4">参考值</u-col>
					</u-row>
				</view>
				<view class="li" v-for="(item, index) in detail.items" :key="index">
					<u-row gutter="6">
						<u-col span="4">{{item.itemName}}</u-col>
						<u-col style="color:item.ycts == '1'|| item.ycts == '2'?'#999999':'#F21111' ;display: flex;flex-direction: row;" span="4">
							{{item.result}}
							<u-icon v-if="item.ycts == '3'" name="arrow-upward" color="#F21111" />
							<u-icon v-if="item.ycts == '4'" name="arrow-downward" color="#F21111" />
						</u-col>
						<u-col span="4">{{item.refRange}}</u-col>
					</u-row>
				</view>
			</view>

		</view>

	<!-- 	<view class="case-block">
			<view class="case-title">报告备注</view>
			<view class="case-content">{{detail.bgbz}}</view>
		</view>
		<view class="case-block">
			<view class="case-title">报告日期：{{options.reportTime || '-'}}</view>

		</view> -->
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				detail: {},
options:{}
			}
		},
		
		onLoad: function(options) { //option为object类型，会序列化上个页面传递的参数
		this.options=options
			const postData = {
				"reportId": options.reportId,
				"userId": options.userId,			
			}
			uni.$u.http.post('/health-api/his/report/inspectDetailForDoctor', postData)
				.then(res => {
					 res.data.items.forEach(item=>{
						 
						 var refRange = item.refRange.split("～")
						 if(item.result<refRange[0]){
							  item.ycts=4
							
						 }else if(item.result>refRange[1]){
							  item.ycts=3
							
						 }else{
							 item.ycts=1
							  
						 }
					 })
					this.$data.detail = res.data
				})
		},
		
		methods: {
			
			//毫秒时间戳->YYYY-MM-DD
			formatFullDate1(time) {
			
				if (time) {
					let date = new Date(time)
					var md = date.getMonth() + 1 + '-' + date.getDate()
					return date.getFullYear() + '-' + md
				}
			},
			formatDate(date){
				if (date) {
				    return date.substring(0, 4) + '-' + date.substring(4, 6) + '-' + date.substring(6, 8);
				  }
			}
		}
	}
</script>

<style>
	.top {
		padding: 26rpx 0 26rpx 26rpx;
		display: flex;
		flex-direction: column;
		color: white;
		font-size: 28rpx;
		background-color: #4180F1;
	}

	.top-h1 {
		display: flex;
		align-items: flex-end;
		flex-direction: row;
		margin-bottom: 30rpx;
	}

	.top-h2 {
		display: flex;
		align-items: flex-end;
		flex-direction: row;
		margin-bottom: 26rpx;
	}

	.top-l {
		width: 50%;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		padding-right: 10rpx;
	}

	.top-r {
		width: 320rpx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}




	.title-scroll {

		width: 100%;
		overflow: hidden;
		white-space: nowrap;
		padding-bottom: 20rpx;
		padding-top: 26rpx;

		display: flex;
		align-items: center;

	}

	.title {
		width: 168rpx;
		height: 56rpx;
		background: #F2F2F2;
		color: #141418;
		border-radius: 28rpx;
		font-size: 28rpx;
		line-height: 56rpx;
		text-align: center;
		overflow: hidden;
		margin-left: 20rpx;
		display: inline-block;
	}

	.active {
		color: #0379FF;
		box-sizing: border-box;
		border: 1px solid #0379FF;

	}

	.case-block {
		padding: 26rpx;

	}

	.case-title {
		color: #1A1A1A;
		font-size: 30rpx;
	}

	.case-content {
		color: #999999;
		font-size: 28rpx;
		margin-top: 20rpx;
	}

	.case-block2 {
		padding: 26rpx;
		border-bottom: 1px solid #E6E6E6
	}

	.row {
		background-color: #F4F6FA;
		font-size: 24rpx;
		padding: 18rpx 20rpx;
		margin-top: 30rpx;
	}

	.li {
		padding: 29rpx 20rpx;
		border-bottom: 0.5px solid #E6E6E6;
		color: #999999;
		font-size: 24rpx;
	}
</style>

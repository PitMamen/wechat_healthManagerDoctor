<template>
	<view class="wrapper">
		<view class="head" v-if="false">
			<view class="row">
				<view class="left">
					<text class="title">所属科室</text>
					{{ article.categoryName || '不详' }}
				</view>
				<view class="right">
					<text class="title">所属病种</text>
					{{ article.articleType || '不详' }}
				</view>
			</view>
			<view class="row">
				<view class="left">
					<text class="title">作者</text>
					{{ article.author || '不详' }}
				</view>
				<view class="right">
					<text class="title">创建时间</text>
					{{ article.createTime || '不详' }}
				</view>
			</view>
		</view>
		<view class="content" v-html="article.content"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				article: {
					content: ''
				}
			}
		},
		onLoad(options) {
			uni.$u.http.get(`/health-api/health/patient/articleById?id=${options.id}`).then(res => {
				this.article = res.data || {}
				uni.setNavigationBarTitle({
					title: this.article.title
				});
			});
		},
		onReady() {
		},
		onShow() {
		},
		methods: {
		}
	}
</script>

<style>
	.wrapper {
		padding: 0 20rpx;
	}
	.wrapper .head {
		padding: 20rpx 0;
		margin-bottom: 20rpx;
	}
	.wrapper .head .row {
		font-size: 14px;
		line-height: 24px;
		color: #909cad;
		overflow: hidden;
	}
	.wrapper .head .title {
		color: #000000;
		font-weight: bold;
	}
	.wrapper .head .left {
		float: left;
	}
	.wrapper .head .right {
		float: right;
	}
</style>

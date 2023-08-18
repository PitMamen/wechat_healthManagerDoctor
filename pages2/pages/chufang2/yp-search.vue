<template>
	<view class="wrap">
		<view class="head">
			<u-search
				placeholder="支持通用名/商品名/拼音首字母搜索"
				v-model="value"
				:show-action="false"
				@change="change"
			></u-search>
		</view>
		<view class="content">
			<view class="part part1" v-show="showPart === 'part1'">
				<scroll-view class="list" :scroll-y="true">
					<view class="item" v-for="item in list1" :key="item" @click="keyNameClick(item)">
						<view class="name" v-html="keyNameReplace(item)"></view>
					</view>
				</scroll-view>
			</view>
			<view class="part part2" v-show="showPart === 'part2'">
				<view class="title">常用药品</view>
				<u-empty
					mode="data"
					v-if="list2.length === 0"
					icon="/pages2/static/img/icon_nodata.png"
					style="height: calc(100vh - 60rpx - 32px - 60rpx - 120rpx - 10rpx);"
				></u-empty>
				<scroll-view class="list" :scroll-y="true" v-else>
					<view class="item" v-for="item in list2" :key="item.code">
						<view class="row name">{{ item.genericName || '~' }}&nbsp;&nbsp;&nbsp;&nbsp;{{ item.tradeName || '' }}</view>
						<view class="row desc">{{ item.specification || '~' }}&nbsp;&nbsp;&nbsp;&nbsp;{{ item.manufacturerName || '' }}</view>
						<view class="row price">¥{{ item.unitPrice || '~' }}</view>
						<view class="abs">
							<view class="add" @click="add(item)" v-if="!findItem(item)">添加</view>
							<view class="edit" v-else>
								<u-icon name="minus-circle" color="#409EFF" size="36rpx" @click="subt(item)"></u-icon>
								<u--input
									type="number"
									color="#409EFF"
									fontSize="30rpx"
									border="none"
									inputAlign="center"
									:value="findItem(item).num"
									@blur="blur(item, $event)"
									@input="input(item, $event)"
								></u--input>
								<u-icon name="plus-circle" color="#409EFF" size="36rpx" @click="plus(item)"></u-icon>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
			<view class="part part2 part3" v-show="showPart === 'part3'">
				<u-empty
					mode="data"
					v-if="list3.length === 0"
					icon="/pages2/static/img/icon_nodata.png"
					style="height: calc(100vh - 60rpx - 32px - 120rpx - 10rpx);"
				></u-empty>
				<scroll-view class="list" :scroll-y="true" v-else>
					<view class="item" v-for="item in list3" :key="item.code">
						<view class="row name">{{ item.genericName || '~' }}&nbsp;&nbsp;&nbsp;&nbsp;{{ item.tradeName || '' }}</view>
						<view class="row desc">{{ item.specification || '~' }}&nbsp;&nbsp;&nbsp;&nbsp;{{ item.manufacturerName || '' }}</view>
						<view class="row price">¥{{ item.unitPrice || '~' }}</view>
						<view class="abs">
							<view class="add" @click="add(item)" v-if="!findItem(item)">添加</view>
							<view class="edit" v-else>
								<u-icon name="minus-circle" color="#409EFF" size="36rpx" @click="subt(item)"></u-icon>
								<u--input
									type="number"
									color="#409EFF"
									fontSize="30rpx"
									border="none"
									inputAlign="center"
									:value="findItem(item).num"
									@blur="blur(item, $event)"
									@input="input(item, $event)"
								></u--input>
								<u-icon name="plus-circle" color="#409EFF" size="36rpx" @click="plus(item)"></u-icon>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		<view class="fix" v-show="showPart==='part2' || showPart==='part3'">
			<view class="left">
				<view class="total">
					<text>共计：</text>
					<text class="num">{{ list.length }}</text>
					<text>种</text>
				</view>
			</view>
			<view class="right">
				<view class="btn" @click="submit()">完成添加</view>
			</view>
		</view>
		
		<yp-edit ref="ypEdit" @edit="edit" />
	</view>
</template>

<script>
	import ypEdit from './component/yp-edit';
	
	export default {
		data() {
			return {
				showPart: 'part2',
				options: {},
				value: '',
				list: [],
				list1: [],
				list2: [],
				list3: []
			}
		},
		components: {
			ypEdit
		},
		onLoad(options) {
			const cfInfo = uni.getStorageSync('cf-info');
			this.list = cfInfo.medicalOrdersDetails;
			this.options = options;
			this.getList2();
		},
		onReady() {
		},
		onShow() {
		},
		methods: {
			getList1() {
				uni.showLoading({
					title:'正在加载'
				});
				uni.$u.http.post(`/info-api/medicine/searchByName`, {
					preType: this.options.preType,
					keyWord: this.value.trim()
				}).then(res => {
					this.list1 = res.data || [];
				}).finally(() => {
					uni.hideLoading();
				});
			},
			getList2() {
				uni.showLoading({
					title:'正在加载'
				});
				uni.$u.http.get(`/medical-api/medical/getDocCommonUseDrugs`, {
					params: {}
				}).then(res => {
					this.list2 = res.data || [];
				}).finally(() => {
					uni.hideLoading();
				});
			},
			getList3(value) {
				uni.showLoading({
					title:'正在加载'
				});
				uni.$u.http.post(`/info-api/medicine/search`, {
					preType: this.options.preType,
					keyWord: value.trim()
				}).then(res => {
					this.list3 = res.data || [];
				}).finally(() => {
					uni.hideLoading();
				});
			},
			add(item) {
				this.$refs.ypEdit.set(item, this.options);
			},
			edit(item) {
				const index = this.list.findIndex(target => {
					return target.code === item.code;
				});
				if (index < 0){
					this.list.push(item);
				}else {
					this.list.splice(index, 1, item);
				}
			},
			delete(item) {
				const index = this.list.findIndex(target => {
					return target.code === item.code;
				});
				if (index >= 0){
					this.list.splice(index, 1);
				}
			},
			plus(item) {
				const target = this.findItem(item);
				this.$set(target, 'num', target.num*1+1);
			},
			subt(item) {
				const target = this.findItem(item);
				if (target.num > 1){
					this.$set(target, 'num', target.num*1-1);
				}else {
					this.delete(item);
				}
			},
			input(item, value) {
				const target = this.findItem(item);
				this.$set(target, 'num', (value+'').trim());
			},
			blur(item, value) {
				value = (value+'').trim();
				const target = this.findItem(item);
				if (value==='' || value==='0'){
					this.delete(item);
				}else if (!/^[1-9][0-9]*$/.test(value)){
					this.$set(target, 'num', 1);
					uni.showToast({
						title: '开药数量需要为大于0的整数',
						icon: 'none'
					});
				}
			},
			findItem(item) {
				return this.list.find(target => {
					return target.code === item.code;
				});
			},
			change() {
				this.value = this.value.trim();
				if (this.value.length === 0){
					this.showPart = 'part2';
					this.list1 = [];
					this.getList2();
				}else {
					this.showPart = 'part1';
					this.getList1();
				}
			},
			keyNameClick(value) {
				this.showPart = 'part3';
				this.list3 = [];
				this.getList3(value);
			},
			keyNameReplace(source) {
				if (this.value.length === 0){
					return source;
				}
				const regexp = new RegExp(this.value, 'g');
				return source.replace(regexp, `<span class="key">${this.value}</span>`);
			},
			submit() {
				if (this.list.length === 0){
					uni.showToast({
						title: '请先添加药品',
						icon: 'error'
					});
					return;
				}
				uni.showLoading({
					title:'正在加载'
				});
				uni.$u.http.post(`/medical-api/medical/checkDrugStock`, {
					rightsId: uni.getStorageSync('taskItem').rightsId,
					drugInfos: this.list.map(item => {
						return {
							drugQty: item.num,
							drugCode: item.code
						};
					})
				}).then(res => {
					uni.hideLoading();
					const cfInfo = uni.getStorageSync('cf-info');
					cfInfo.medicalOrdersDetails = this.list;
					uni.setStorageSync('cf-info', cfInfo);
					uni.navigateBack({
						delta: 1
					});
				});
			}
		}
	}
</script>

<style lang="scss">
	.wrap {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		min-height: 100vh;
		background: #FFFFFF;
		.head {
			padding: 30rpx 24rpx;
			box-sizing: border-box;
		}
		.content {
			flex: 1;
			.part {
				.list {
					height: calc(100vh - 60rpx - 32px);
				}
				&.part1 {
					.list {
						padding: 0 24rpx;
						.item {
							margin-bottom: 40rpx;
							.name {
								font-size: 30rpx;
								font-weight: 400;
								color: #1A1A1A;
								line-height: 50rpx;
								white-space: nowrap;
								overflow: hidden;
								text-overflow: ellipsis;
								/deep/ .key {
									color: #409EFF;
								}
							}
						}
					}
				}
				&.part2 {
					.title {
						margin-bottom: 10rpx;
						padding: 0 24rpx;
						font-size: 30rpx;
						font-weight: 500;
						color: #1A1A1A;
						line-height: 50rpx;
					}
					.list {
						height: calc(100vh - 60rpx - 32px - 60rpx - 120rpx - 10rpx);
						.item {
							position: relative;
							padding: 15rpx 24rpx 20rpx 24rpx;
							border-bottom: 1rpx solid #E6E6E6;
							.row {
								font-weight: 400;
								white-space: nowrap;
								overflow: hidden;
								text-overflow: ellipsis;
								&.name {
									font-size: 30rpx;
									color: #1A1A1A;
									line-height: 60rpx;
								}
								&.desc {
									font-size: 24rpx;
									color: #999999;
									line-height: 54rpx;
								}
								&.price {
									font-size: 28rpx;
									color: #F40E0E;
									line-height: 58rpx;
								}
							}
							.abs {
								position: absolute;
								right: 24rpx;
								bottom: 22rpx;
								.add {
									width: 128rpx;
									font-size: 28rpx;
									font-weight: 400;
									color: #409EFF;
									line-height: 48rpx;
									text-align: center;
									background: #FFFFFF;
									border: 1rpx solid #409EFF;
									border-radius: 24rpx;
								}
								.edit {
										display: flex;
										justify-content: flex-end;
										align-items: center;
										margin-bottom: 8rpx;
										.u-icon {
											padding: 0 2rpx;
										}
										.u-input {
											max-width: 80rpx;
											font-size: 30rpx;
											font-weight: 400;
											color: #409EFF;
											line-height: 37rpx;
										}
								}
							}
						}
					}
				}
				&.part3 {
					.list {
						height: calc(100vh - 60rpx - 32px - 120rpx - 10rpx) !important;
					}
				}
			}
		}
		.fix {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			padding: 10rpx 24rpx 60rpx 0;
			.left {
				margin-right: 25rpx;
				.total {
					font-size: 30rpx;
					font-weight: 400;
					color: #1A1A1A;
					line-height: 37rpx;
					.num {
						color: #F40E0E;
					}
				}
			}
			.right {
				.btn {
					width: 214rpx;
					font-size: 30rpx;
					font-weight: 400;
					color: #FFFFFF;
					line-height: 58rpx;
					text-align: center;
					background: #409EFF;
					border-radius: 29rpx;
				}
			}
		}
	}
</style>

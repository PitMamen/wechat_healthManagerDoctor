<template>
	<u-popup
		closeable
		mode="bottom"
		:show="show"
		@close="close"
	>
		<view class="ypwrap">
			<view class="head">药品用法用量</view>
			<view class="row">
				<view class="left">药品名称</view>
				<view class="right flexend">
					<view class="name">{{ item.genericName || '~' }}</view>
				</view>
			</view>
			<view class="row">
				<view class="left">规格</view>
				<view class="right flexend">
					<view class="name">{{ item.specification || '~' }}</view>
				</view>
			</view>
			<view class="row">
				<view class="left">用药频率</view>
				<view class="right flexend" @click="show1 = true; hideKeyboard();">
					<view class="name gray" v-if="!item.useFrequency">请选择</view>
					<view class="name" v-else>{{ item.useFrequencyName || '~' }}</view>
					<u-icon name="arrow-right" color="#4D4D4D" size="36rpx"></u-icon>
				</view>
			</view>
			<view class="row" style="justify-content: flex-start;">
				<view class="left">单次剂量</view>
				
					
						<view class="edit flexend" style="width: 200rpx;margin-left: 200rpx;">
							<view class="iconclass" @click="subt('useNum')">
								<u-icon  name="minus-circle" color="#409EFF" size="40rpx" ></u-icon>
							</view>
							
							<u--input
							style="padding-left: 40rpx;padding-right: 40rpx; width: 80rpx !important;"
								type="digit"
								color="#409EFF"
								fontSize="30rpx"
								border="none"
								inputAlign="center"
								v-model="item.useNum"
								@blur="blur('useNum', $event)"
							></u--input>
							
							<view class="iconclass" @click="plus('useNum')">
								<u-icon name="plus-circle" color="#409EFF" size="40rpx" ></u-icon>
							</view>
						</view>
						<view class="select flexend" @click="show2 = true; hideKeyboard();" style="margin-left: auto;">
							<view class="name gray" v-if="!item.useUnit">请选择</view>
							<view class="name" v-else>{{ item.useUnit || '~' }}</view>
							<u-icon name="arrow-right" color="#4D4D4D" size="36rpx"></u-icon>
						</view>
					
				
			</view>
			<view class="row">
				<view class="left">给药途径</view>
				<view class="right flexend" @click="show3 = true; hideKeyboard();">
					<view class="name gray" v-if="!item.drugUsemethod">请选择</view>
					<view class="name" v-else>{{ item.drugUsemethodName || '~' }}</view>
					<u-icon name="arrow-right" color="#4D4D4D" size="36rpx"></u-icon>
				</view>
			</view>
			<view class="row" style="justify-content: flex-start;">
				<view class="left" >开药数量</view>
				
						<view class="edit flexend" style="width: 200rpx;margin-left: 100rpx;">
							
							<view class="iconclass" @click="subt('num')">
								<u-icon  name="minus-circle" color="#409EFF" size="40rpx" ></u-icon>
							</view>
							<u--input
								type="number"
								color="#409EFF"
								fontSize="30rpx"
								border="none"
								inputAlign="center"
								v-model="item.num"
								@blur="blur('num', $event)"
							></u--input>
							
							<view class="iconclass" @click="plus('num')">
								<u-icon name="plus-circle" color="#409EFF" size="40rpx" ></u-icon>
							</view>
						</view>
						<view class="btn"   @click="doShow4()">按天数计算</view>
				
			</view>
			<view class="bottom">
				<view class="btn" @click="submit()">确认</view>
			</view>
		</view>
		
		<u-picker :show="show1" :columns="list1" @cancel="cancel1" @confirm="confirm1"></u-picker>
		<u-picker :show="show2" :columns="list2" @cancel="cancel2" @confirm="confirm2"></u-picker>
		<u-picker :show="show3" :columns="list3" @cancel="cancel3" @confirm="confirm3"></u-picker>
		<u-picker :show="show4" :columns="list4" @cancel="cancel4" @confirm="confirm4"></u-picker>
	</u-popup>
</template>

<script>
	export default {
		data() {
			return {
				options: {},
				item: {},
				show: false,
				show1: false,
				show2: false,
				show3: false,
				show4: false,
				list1: [[]],
				list2: [[]],
				list3: [[]],
				list4: [[]]
			}
		},
		onLoad(options) {
		},
		onReady() {
		},
		onShow() {
		},
		methods: {
			set(item, options) {
				this.options = options;
				this.item = JSON.parse(JSON.stringify(item));
				this.$set(this.item, 'num', this.item.num||1);
				this.$set(this.item, 'useNum', this.item.useNum||1);
				this.show = true;
				this.getList1();
				this.getList2();
				this.getList3();
				this.getList4();
			},
			close() {
				this.show = false;
			},
			getList1() {
				uni.$u.http.get(`/info-api/medicine/getFreq`, {
					params: {
						preType: this.options.preType
					}
				}).then(res => {
					this.list1 = [(res.data||[]).map(item => {
						return {
							text: item.value,
							value: item.code
						};
					})];
				});
			},
			getList2() {
				uni.$u.http.get(`/info-api/medicine/getDrugUnit`, {
					params: {
						preType: this.options.preType,
						code: this.item.code
					}
				}).then(res => {
					this.list2 = [(res.data||[]).map(item => {
						return {
							text: item,
							value: item
						};
					})];
				});
			},
			getList3() {
				uni.$u.http.get(`/info-api/medicine/getInstr`, {
					params: {
						preType: this.options.preType
					}
				}).then(res => {
					this.list3 = [(res.data||[]).map(item => {
						return {
							text: item.value,
							value: item.code
						};
					})];
				});
			},
			getList4() {
				uni.$u.http.get(`/info-api/sysDictData/getByCode`, {
					params: {
						code: 'DRUG_USE_DAYS'
					}
				}).then(res => {
					this.list4 = [(res.data||[]).map(item => {
						return {
							text: item.value,
							value: item.code
						};
					})];
				});
			},
			getNum() {
				uni.showLoading({
					title:'正在加载'
				});
				uni.$u.http.get(`/info-api/medicine/calcDrugNum`, {
					params: {
						code: this.item.code,
						days: this.item.useDays,
						freq: this.item.useFrequency,
						num: this.item.useNum,
						unit: this.item.useUnit,
                        preType: this.options.preType
					}
				}).then(res => {
					this.$set(this.item, 'num', res.data);
				}).finally(() => {
					uni.hideLoading();
				});
			},
			doShow4() {
				if (!this.item.useFrequency){
					uni.showToast({
						title: '请先选择用药频率',
						icon: 'none'
					});
					return;
				}
				if (!this.item.useNum){
					uni.showToast({
						title: '请先输入单次剂量',
						icon: 'none'
					});
					return;
				}
				if (!this.item.useUnit){
					uni.showToast({
						title: '请先选择剂量单位',
						icon: 'none'
					});
					return;
				}
				this.show4 = true;
				this.hideKeyboard();
			},
			cancel1() {
				this.show1 = false;
			},
			cancel2() {
				this.show2 = false;
			},
			cancel3() {
				this.show3 = false;
			},
			cancel4() {
				this.show4 = false;
			},
			confirm1(e) {
				this.cancel1();
				this.$set(this.item, 'useFrequency', e.value[0].value);
				this.$set(this.item, 'useFrequencyName', e.value[0].text);
			},
			confirm2(e) {
				this.cancel2();
				this.$set(this.item, 'useUnit', e.value[0].value);
			},
			confirm3(e) {
				this.cancel3();
				this.$set(this.item, 'drugUsemethod', e.value[0].value);
				this.$set(this.item, 'drugUsemethodName', e.value[0].text);
			},
			confirm4(e) {
				this.cancel4();
				this.$set(this.item, 'useDays', e.value[0].value);
				this.getNum();
			},
			plus(key) {
				this.$set(this.item, key, this.item[key]*1+1);
			},
			subt(key) {
				const result = new Number(this.item[key]*1-1).toFixed(1)*1;
				if (result > 0){
					this.$set(this.item, key, result);
				}
			},
			blur(key, value) {
				value = (value+'').trim();
				this.$set(this.item, key, value);
				if (key === 'useNum'){
					if (!/^(([1-9][0-9]*)|([0]\.[1-9]|[1-9][0-9]*\.[1-9]))$/.test(value)){
						this.$set(this.item, key, 1);
						uni.showToast({
							title: '单次剂量需要为大于0的正数（支持小数点后1位）',
							icon: 'none'
						});
					}
				}
				if (key === 'num'){
					if (!/^[1-9][0-9]*$/.test(value)){
						this.$set(this.item, key, 1);
						uni.showToast({
							title: '开药数量需要为大于0的整数',
							icon: 'none'
						});
					}
				}
			},
			hideKeyboard() {
				uni.hideKeyboard();
			},
			submit() {
				if (!this.item.useFrequency){
					uni.showToast({
						title: '请先选择用药频率',
						icon: 'none'
					});
					return;
				}
				if (!this.item.useUnit){
					uni.showToast({
						title: '请先选择剂量单位',
						icon: 'none'
					});
					return;
				}
				if (!this.item.drugUsemethod){
					uni.showToast({
						title: '请先选择给药途径',
						icon: 'none'
					});
					return;
				}
				this.$emit('edit', this.item);
				this.close();
			}
		}
	}
</script>

<style lang="scss">
	.iconclass{
		display: flex;
		align-items: center;
		padding: 10rpx 20rpx;
	}
	.ypwrap {
		background: #FFFFFF;
		.flexend {
			display: flex;
			justify-content: flex-end;
			align-items: center;
		}
		.head {
			padding: 25rpx 0;
			font-size: 30rpx;
			font-weight: 500;
			color: #1A1A1A;
			line-height: 58rpx;
			text-align: center;
			border-bottom: 1rpx solid #E6E6E6;
		}
		.row {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 15rpx 30rpx;
			font-size: 30rpx;
			font-weight: 400;
			color: #4D4D4D;
			line-height: 58rpx;
			border-bottom: 1rpx solid #E6E6E6;
			.left {
				color: #4D4D4D;
			}
			.btn {
				margin-left: auto;
				width: 232rpx;
				font-size: 30rpx;
				font-weight: 400;
				color: #FFFFFF;
				line-height: 58rpx;
				text-align: center;
				background: #409EFF;
				border-radius: 29rpx;
				
			}
			.right {
				.name {
					max-width: 500rpx;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					color: #4D4D4D;
					&.gray {
						color: #999999;
					}
				}
				>.u-icon {
					position: relative;
					top: 2rpx;
					margin-left: 2rpx;
				}
				.flex {
					.edit {
						display: flex;
						flex-direction: row;
						
							.u-icon {
								padding: 6rpx;
							}
							.u-input {
								max-width: 80rpx !important;
								width: 80rpx !important;
								font-size: 30rpx;
								font-weight: 400;
								color: #409EFF;
								line-height: 37rpx;
							}
							.input {
								max-width: 80rpx !important;
								width: 80rpx !important;
								font-size: 30rpx;
								font-weight: 400;
								color: #409EFF;
								line-height: 37rpx;
							}
					}
					.select {
						margin-left: 80rpx;
						>.u-icon {
							position: relative;
							top: 2rpx;
							margin-left: 2rpx;
						}
					}
					
				}
			}
		}
		.bottom {
			padding: 48rpx 24rpx 40rpx 24rpx;
			.btn {
				height: 68rpx;
				font-size: 30rpx;
				font-weight: 400;
				color: #FFFFFF;
				line-height: 68rpx;
				text-align: center;
				background: #409EFF;
				border-radius: 8rpx;
			}
		}
	}
</style>

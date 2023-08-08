<template>
	<view v-show="display" class="tui-common-words-container">
		<view class="tui-common-words-box">
			<view class="tui-common-words-title">
				<view>设置咨询时间</view>
				<view style="color: #006EFF; font-family: PingFangSC-Regular; font-weight: normal;" class="tui-common-words-close" @tap="handleClose">关闭</view>
			</view>
			
			<view class="tui-common-words-content">
				<view class="depart">
					<view class="title">患者期望咨询时间</view>
					<text class="time">{{ message.time }}</text>
				</view>
				<view class="depart">
					<view class="title">咨询时间</view>
					<view>
						<u--form
							labelPosition="left"
							labelWidth="80px"
							:model="model"
							ref="form"
						>
							<u-form-item
								label="预约时间1"
								prop="time1"
								@click="show = true; hideKeyboard(); current = 'time1';"
							>
								<u--input
									v-model="model.time1"
									disabled
									disabledColor="#ffffff"
									placeholder="请设置预约时间"
									border="none"
									inputAlign="right"
								></u--input>
								<u-icon
									slot="right"
									name="arrow-right"
								></u-icon>
							</u-form-item>
							<u-form-item
								label="预约时间2"
								prop="time2"
								@click="show = true; hideKeyboard(); current = 'time2';"
							>
								<u--input
									v-model="model.time2"
									disabled
									disabledColor="#ffffff"
									placeholder="请设置预约时间"
									border="none"
									inputAlign="right"
								></u--input>
								<u-icon
									slot="right"
									name="arrow-right"
								></u-icon>
							</u-form-item>
							<u-form-item
								label="预约时间3"
								prop="time3"
								@click="show = true; hideKeyboard(); current = 'time3';"
							>
								<u--input
									v-model="model.time3"
									disabled
									disabledColor="#ffffff"
									placeholder="请设置预约时间"
									border="none"
									inputAlign="right"
								></u--input>
								<u-icon
									slot="right"
									name="arrow-right"
								></u-icon>
							</u-form-item>
						</u--form>
					</view>
				</view>
				<view class="depart" style="margin-top: 100rpx;">
					<view class="content">
						<p>温馨提示：</p>
						<p>1、您可以设置三个时间选择项推荐给患者，患者可以在您提供的方案中选择，如患者未选择您推荐的时间选项，客服会介入帮您协调时间</p>
						<p>2、如您仅设置1个时间项，系统将默认此时间为你的咨询时间</p>
					</view>
				</view>
				<view class="depart">
					<u-button
						type="primary"
						text="提交"
						customStyle="margin-top: 50px"
						@click="submit"
					></u-button>
				</view>
			</view>
			
		</view>
		<u-picker
			:show="show"
			:columns="columns2"
			@cancel="cancel"
			@confirm="confirm"
		></u-picker>
	</view>
</template>

<script>
export default {
	data() {
		return {
			show: false,
			current: '',
			model: {
				time1: '',
				time2: '',
				time3: ''
			},
			columns: [
				[
					'06:00-07:00',
					'07:00-08:00',
					'08:00-09:00',
					'09:00-10:00',
					'10:00-11:00',
					'11:00-12:00',
					'12:00-13:00',
					'13:00-14:00',
					'14:00-15:00',
					'15:00-16:00',
					'16:00-17:00',
					'17:00-18:00',
					'18:00-19:00',
					'19:00-20:00',
					'20:00-21:00',
					'21:00-22:00',
					'22:00-23:00',
					'23:00-24:00'
				]
			],
			columns2: [
				[]
			],
			rules: {
				time1: [{
					validator: (rule, value, callback) => {
						if (value){
							return true
						}
						return false
					},
					message: "请设置预约时间",
					trigger: ["change", "blur"]
				}],
				time2: [{
					validator: (rule, value, callback) => {
						if (value){
							return true
						}
						if (!this.model.time1 && !this.model.time3){
							return false
						}
						return true
					},
					message: "请设置预约时间",
					trigger: ["change", "blur"]
				}],
				time3: [{
					validator: (rule, value, callback) => {
						if (value){
							return true
						}
						if (!this.model.time1 && !this.model.time2){
							return false
						}
						return true
					},
					message: "请设置预约时间",
					trigger: ["change", "blur"]
				}]
			}
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
				return {}
			}
		}
	},
	watch: {
		show: {
			handler: function(newVal) {
				if (newVal){
					this.geneColumns2()
				}
			},
			immediate: true
		},
		display: {
			handler: function(newVal) {
				if (newVal){
					this.$nextTick(() => {
						this.$refs.form.setRules(this.rules)
					})
				}
			},
			immediate: true
		}
	},
	methods: {
		geneColumns2() {
			const hour = new Date().getHours();
			const innerArray = this.columns[0].filter(item => {
				const itemHour = parseInt(item.split(':')[0]);
				return itemHour >= hour;
			})
			this.columns2 = [innerArray];
		},
		handleClose() {
			this.$emit('close', {
				detail: {
					key: '5'
				}
			});
		},
		hideKeyboard() {
			uni.hideKeyboard()
		},
		confirm(e) {
			this.$set(this.model, this.current, e.value[0])
			this.cancel()
		},
		cancel() {
			this.show = false
		},
		submit() {
			// 如果有错误，会在catch中返回报错信息数组，校验通过则在then中返回true
			this.$refs.form.validate().then(res => {
				let time = this.model.time1
				if (this.model.time2) {
					time = time + ',' + this.model.time2
				}
				if (this.model.time3) {
					time = time + ',' + this.model.time3
				}
				this.$emit('sendTime', {
					detail: {
						payload: {
							data: JSON.stringify({
								...{},
								...this.message,
								...{
									time: time,
									description: '请选择时间',
								}
							}),
							extension: '',
							description: '请选择时间'
						}
					}
				})
			})
		}
	}
};
</script>
<style>
@import './index.css';
</style>

<template>
	<view class="wrap">
		<view class="minheight">
			<view class="part info">
				<view class="title">
					<text>患者信息</text>
					<view class="abs" @click="goChufangHistory">
						<image src="/pages2/static/static/images/chufang2/chufang.png"></image>
						<text>处方记录</text>
					</view>
				</view>
				<view class="content">
					<view class="desc">
						<view class="column left">
							<view class="up">姓名</view>
							<view class="down">
								<u--input
									v-model="info.userName"
									maxlength="20"
									border="none"
									inputAlign="left"
									@blur="nameBlur"
								></u--input>
							</view>
						</view>
						<view class="column middle">
							<view class="up">性别</view>
							<view class="down">
								<view class="sex">
									<view class="radio man" :class="{active: info.userSex==='男'}" @click="sexClick('男')">男</view>
									<view class="radio woman" :class="{active: info.userSex==='女'}" @click="sexClick('女')">女</view>
								</view>
							</view>
						</view>
						<view class="column right">
							<view class="up">年龄</view>
							<view class="down">
								<u--input
									v-model="info.userAge"
									type="number"
									maxlength="3"
									border="none"
									inputAlign="right"
									@blur="ageBlur"
								></u--input>
							</view>
						</view>
					</view>
				</view>
			</view>
			
			<view class="part zhenduan">
				<view class="title">
					<text>临床诊断</text>
				</view>
				<view class="content">
					<view class="list" v-if="info.medicalOrdersCaseList.length > 0">
						<view class="item" v-for="item in info.medicalOrdersCaseList" :key="item.diagnosisCode">
							<view class="name">{{ item.diagnosis }}</view>
							<u-icon name="close" color="#1A1A1A" size="28rpx" @click="caseDelete(item)"></u-icon>
						</view>
					</view>
					<view class="add-area">
						<view class="btn" @click="goAddDiag">
							<u-icon name="plus-circle-fill" color="#409EFF" size="40rpx"></u-icon>
							<view class="text">添加诊断</view>
						</view>
					</view>
				</view>
			</view>
			
			<view class="part yaoping">
				<view class="title">
					<text>药品信息</text>
					<view class="abs" @click="useTemp">
						<image src="/pages2/static/static/images/chufang2/moban.png"></image>
						<text>使用模版</text>
					</view>
				</view>
				<view class="content">
					<view class="list" v-if="info.medicalOrdersDetails.length > 0">
						<view class="item" v-for="item in info.medicalOrdersDetails" :key="item.code">
							<view class="row row1">
								<view class="name">{{ item.genericName || '~' }}&nbsp;&nbsp;&nbsp;&nbsp;{{ item.tradeName || '' }}</view>
								<view class="actions">
									<text class="edit" @click="ypEdit(item)">编辑</text>
									<text class="delete" @click="ypDelete(item)">删除</text>
								</view>
							</view>
							<view class="row row2">
								<view>规格：{{ item.specification || '~' }}</view>
							</view>
							<view class="row row3">
								<view>用法用量：{{item.useFrequencyName}}；{{item.useNum}}{{item.useUnit}}/1次；{{item.drugUsemethodName}}</view>
							</view>
							<view class="row row4">
								<u-icon name="minus-circle" color="#409EFF" size="36rpx" @click="subt(item)"></u-icon>
								<u--input
									v-model="item.num"
									type="number"
									color="#409EFF"
									fontSize="30rpx"
									border="none"
									inputAlign="center"
									@blur="blur(item, $event)"
								></u--input>
								<u-icon name="plus-circle" color="#409EFF" size="36rpx" @click="plus(item)"></u-icon>
							</view>
						</view>
					</view>
					<view class="add-area">
						<view class="btn" @click="ypAdd()">
							<u-icon name="plus-circle-fill" color="#409EFF" size="40rpx"></u-icon>
							<view class="text">添加药品</view>
						</view>
					</view>
				</view>
			</view>
			
			<view class="part buchong">
				<view class="title">
					<text>补充说明</text>
				</view>
				<view class="content">
					<view class="desc">
						<u--textarea
							v-model="info.prescriptionInstruction"
							count
							autoHeight
							maxlength="200"
							placeholder="请输入用药补充说明，如未列明的药物使用方法，或需额外说明的医嘱"
						></u--textarea>
					</view>
					<view class="model">
						<view class="mask" @click="radioClick()"></view>
						<u-radio-group v-model="info.templateFlag">
							<u-radio shape="circle" label="保存为【我的用药模版】" :name="1"></u-radio>
						</u-radio-group>
					</view>
				</view>
			</view>
		</view>
		
		<view class="fix">
			<view class="row">患者预计支付：<text class="price">¥{{ totalAmount }}</text></view>
			<view class="row">仅供参考，实际以患者下单为准</view>
			<view class="send-btn" @click="submit()">发送给患者</view>
		</view>
		
		<u-keyboard
			mode="number"
			tips="请输入6位数字密码"
			:show="show"
			:tooltip="false"
			:showTips="true"
			:showCancel="true"
			:showConfirm="true"
			:dotDisabled="true"
			@close="close"
			@change="change"
			@cancel="cancel"
			@confirm="confirm"
			@backspace="backspace"
		>
			<view class="wrap-keyboard">
				<view class="tips">
					<text>请输入6位数字密码</text>
					<text class="close" @click="close">取消</text>
				</view>
				<u-code-input
					dot
					disabledKeyboard
					v-model="pwd"
					:maxlength="6"
				></u-code-input>
			</view>
		</u-keyboard>
		
		<yp-edit ref="ypEdit" @edit="edit" />
		<add-diag ref="addDiag" @chang="handleChange" />
		<choose-template ref="chooseTemplate" @chang="handleTemp" />
		
	</view>
</template>

<script>
	import ypEdit from './component/yp-edit';
	import addDiag from './component/addDiag'
	import chooseTemplate from './component/chooseTemplate'
	
	export default {
		data() {
			return {
				options: {},
				flag: false,
				diagList:[],
				info: {
					medicalOrdersDetails: [],
					medicalOrdersCaseList: [],
					prescriptionInstruction:''
				},
				
				pwd: '',
				show: false
			}
		},
		computed: {
			totalAmount() {
				const result = this.info.medicalOrdersDetails.reduce((sum, item) => {
					const amount = new Number((item.unitPrice*1)*(item.num*1)).toFixed(2)*1;
					return sum + amount;
				}, 0);
				return new Number(result).toFixed(2) * 1;
			}
		},
		components: {
			ypEdit,
			addDiag,
			chooseTemplate
		},
		onLoad(options) {
			uni.removeStorageSync('cf-info');
			console.log('cf-add preType',this.options.preType)
			this.options = options;
			this.options.preType = this.options.preType || 'appPrePrescription';
		},
		onReady() {
		},
		onShow() {
			this.init();
		},
		methods: {
			init() {
				let info = uni.getStorageSync('cf-info');
				if (!info){
					info = this.geneInfo();
				}
				this.info = info;
				uni.setStorageSync('cf-info', this.info);
			},
			geneInfo() {
				const taskItem = uni.getStorageSync('taskItem');
				return {
					templateFlag: 0,
					prescriptionInstruction: '',
					preType: this.options.preType,
					medicalOrdersDetails: [],
					medicalOrdersCaseList: [],
					tradeId: taskItem.id,
					docId: taskItem.docId,
					docName: taskItem.docName,
					regRightsId: taskItem.rightsId,
					userId: taskItem.userInfo.userId,
					userAge: taskItem.userInfo.userAge,
					userSex: taskItem.userInfo.userSex,
					userName: taskItem.userInfo.userName
				};
			},
			nameBlur(value) {
				this.$set(this.info, 'userName', value.trim());
				if (!this.info.userName){
					uni.showToast({
						title: '请输入患者姓名',
						icon: 'none'
					});
				}
			},
			ageBlur(value) {
				this.$set(this.info, 'userAge', (value+'').trim());
				if (!/^[1-9][0-9]*$/.test(this.info.userAge) || (this.info.userAge*1<6||this.info.userAge*1>120)){
					uni.showToast({
						title: '年龄需要为6~120之间的整数',
						icon: 'none'
					});
				}
			},
			goChufangHistory(){
				uni.setStorageSync('cf-info', this.info);
				uni.navigateTo({
					url: `/pages2/pages/chufang2/cf-list`
				});
			},
			goAddDiag(){
				uni.setStorageSync('cf-info', this.info);
				this.$refs.addDiag.add(this.info.medicalOrdersCaseList)
			},
			useTemp(){
				uni.setStorageSync('cf-info', this.info);
				this.$refs.chooseTemplate.add(this.diagList)
			},
			handleChange(diagList){
				this.init()
			},
			handleTemp(){
			    this.init()
			},
			sexClick(sex) {
				this.$set(this.info, 'userSex', sex);
			},
			caseDelete(item) {
				const index = this.info.medicalOrdersCaseList.findIndex(target => {
					return target.diagnosisCode === item.diagnosisCode;
				});
				if (index >= 0){
					this.info.medicalOrdersCaseList.splice(index, 1);
					this.$set(this.info, 'medicalOrdersCaseList', this.info.medicalOrdersCaseList);
				}
			},
			ypAdd() {
				uni.setStorageSync('cf-info', this.info);
				uni.navigateTo({
					url: `/pages2/pages/chufang2/yp-search?preType=${this.options.preType}`
				});
			},
			ypEdit(item) {
				this.$refs.ypEdit.set(item, this.options);
			},
			ypDelete(item) {
				const index = this.info.medicalOrdersDetails.findIndex(target => {
					return target.code === item.code;
				});
				if (index >= 0){
					this.info.medicalOrdersDetails.splice(index, 1);
					this.$set(this.info, 'medicalOrdersDetails', this.info.medicalOrdersDetails);
				}
			},
			edit(item) {
				const index = this.info.medicalOrdersDetails.findIndex(target => {
					return target.code === item.code;
				});
				if (index < 0){
					this.info.medicalOrdersDetails.push(item);
				}else {
					this.info.medicalOrdersDetails.splice(index, 1, item);
				}
				this.$set(this.info, 'medicalOrdersDetails', this.info.medicalOrdersDetails);
			},
			plus(item) {
				this.$set(item, 'num', item.num*1+1);
			},
			subt(item) {
				if (item.num > 1){
					this.$set(item, 'num', item.num*1-1);
				}else {
					this.ypDelete(item);
				}
			},
			blur(item, value) {
				value = (value+'').trim();
				this.$set(item, 'num', value);
				if (value==='' || value==='0'){
					this.ypDelete(item);
				}else if (!/^[1-9][0-9]*$/.test(value)){
					this.$set(item, 'num', 1);
					uni.showToast({
						title: '开药数量需要为大于0的整数',
						icon: 'none'
					});
				}
			},
			radioClick() {
				if (this.info.templateFlag === 0){
					this.info.templateFlag = 1;
				}else {
					this.info.templateFlag = 0;
				}
				this.$set(this.info, 'templateFlag', this.info.templateFlag);
			},
			
			close(e) {
				this.pwd = '';
				this.show = false;
				this.flag = false;
			},
			change(e) {
				e = e + '';
				if (this.pwd.length >= 6){
					return;
				}
				this.pwd = this.pwd + e;
				if (this.pwd.length === 6){
					this.checkPwd();
				}
			},
			cancel(e) {
				this.close(e);
			},
			confirm(e) {
				this.close(e);
			},
			backspace(e) {
				if (this.pwd.length === 0){
					return;
				}
				this.pwd = this.pwd.substring(0, this.pwd.length - 1);
			},
			checkPwd() {
				uni.showLoading({
					title:'正在加载'
				});
				uni.$u.http.get(`/account-api/tdUserInfoCaAuthApplet/checkCaPassword`, {
					params: {
						password: this.pwd
					}
				}).then(res => {
					if (!res.data){
						this.flag = false;
						uni.hideLoading();
						uni.showToast({
							title: '密码错误',
							icon: 'error'
						});
						return;
					}
					uni.hideLoading();
					this.doSubmit();
				}).catch(err => {
					this.flag = false;
				});
			},
			
			convert() {
				const info_ = JSON.parse(JSON.stringify(this.info));
				info_.medicalOrdersCase = {
					diagnosis: info_.medicalOrdersCaseList.map(item => {
						return item.diagnosis;
					}).join(','),
					diagnosisCode: info_.medicalOrdersCaseList.map(item => {
						return item.diagnosisCode;
					}).join(',')
				};
                info_.medicalOrdersDetails = info_.medicalOrdersDetails.map(item => {
					return {
						num: item.num,
						drugCode: item.code,
						useNum: item.useNum,
						useUnit: item.useUnit,
						price: item.unitPrice,
						useDays: item.useDays,
						drugName: item.genericName,
						drugUnit: item.packingUnit,
						drugSpec: item.specification,
						useFrequency: item.useFrequency,
						drugUsemethod: item.drugUsemethod,
						useFrequencyName: item.useFrequencyName,
						drugUsemethodName: item.drugUsemethodName,
						amount: new Number((item.unitPrice*1)*(item.num*1)).toFixed(2)*1
					};
				});
				return info_;
			},
			sendCfCard(res) {
				const customMessage = {
					detail: {
						payload: {
							data: JSON.stringify({
								preNo: res.data.preNo,
								cfInfo: this.convert(),
								description: '处方卡',
								type: 'CustomChuFangMessage'
							}),
							extension: '',
							description: '处方卡'
						}
					}
				};
				const pages = getCurrentPages();
				const taskItem = uni.getStorageSync('taskItem');
				if (taskItem.serviceItemType===102 || taskItem.serviceItemType===103){
					uni.navigateBack({
						delta: 1
					});
					return;
				}
				if (pages.length > 1){
					const page = pages[pages.length - 1 - 1];
					if (page.route==='pages2/pages/TUI-Chat-Group/chat' || page.route==='pages2/pages/TUI-Chat-Group2/chat'){
						page.$vm.sendCustomMessage(customMessage);
						uni.navigateBack({
							delta: 1
						});
						return;
					}
				}
				if (true){
					uni.navigateTo({
						url: `/pages2/pages/TUI-Chat-Group2/chat?conversationID=GROUP${taskItem.imGroupId}`,
						success(res) {
							res.eventChannel.emit('sendCfCard_', customMessage);
						}
					});
					return;
				}
			},
			checkCa() {
				uni.showLoading({
					title:'正在加载'
				});
				uni.$u.http.get(`/info-api/sysConfigData/getConfig/CA_AUTH_FLAG`).then(res => {
					uni.hideLoading();
					this.pwd = '';
					this.show = res.data.value === '1';
					if (!this.show){
						this.doSubmit();
					}
				}).catch(err => {
					this.flag = false;
					uni.hideLoading();
				});
			},
			submit() {
				if (!this.info.userName){
					uni.showToast({
						title: '请输入患者姓名',
						icon: 'none'
					});
					return;
				}
				if (!/^[1-9][0-9]*$/.test(this.info.userAge) || (this.info.userAge*1<6||this.info.userAge*1>120)){
					uni.showToast({
						title: '年龄需要为6~120之间的整数',
						icon: 'none'
					});
					return;
				}
				if (this.info.medicalOrdersCaseList.length === 0){
					uni.showToast({
						title: '请添加诊断',
						icon: 'none'
					});
					return;
				}
				if (this.info.medicalOrdersDetails.length === 0){
					uni.showToast({
						title: '请添加药品',
						icon: 'none'
					});
					return;
				}
				if (this.flag){
					return;
				}
				this.flag = true;
				this.checkCa();
			},
			doSubmit() {
				uni.showLoading({
					title:'正在加载'
				});
				uni.$u.http.post(`/medical-api/medical/save`, this.convert()).then(res => {
                    uni.hideLoading();
					uni.removeStorageSync('cf-info');
					this.sendCfCard(res);
				}).finally(() => {
					this.show = false;
					this.flag = false;
				});
			}
		}
	}
</script>

<style lang="scss">
	.wrap {
		min-height: 100vh;
		background: #F5F5F5;
		.minheight {
			min-height: calc(100vh - 162rpx - 55rpx);
		}
		.part {
			margin-bottom: 10rpx;
			padding: 0 24rpx;
			.title {
				position: relative;
				font-size: 30rpx;
				font-weight: 500;
				color: #1A1A1A;
				line-height: 90rpx;
				.abs {
					position: absolute;
					display: flex;
					top: 0;
					right: 0;
					align-items: center;
					image {
						margin-right: 6rpx;
						width: 32rpx;
						height: 32rpx;
					}
					text {
						font-size: 28rpx;
						font-weight: 400;
						color: #409EFF;
					}
				}
			}
			.content {
				.add-area {
					margin-top: 20rpx;
					padding: 55rpx 0;
					background: #FFFFFF;
					border-radius: 4rpx;
					.btn {
						display: flex;
						justify-content: center;
						align-items: center;
						.u-icon {
							position: relative;
							margin-right: 6rpx;
							top: 2rpx;
						}
						.text {
							font-size: 30rpx;
							font-weight: 500;
							color: #1A1A1A;
							line-height: 38rpx;
						}
					}
				}
			}
			&.info {
				.content {
					.desc {
						display: flex;
						justify-content: space-between;
						align-items: center;
						padding: 30rpx 85rpx 35rpx 85rpx;
						background: #FFFFFF;
						border-radius: 4rpx;
						.column {
							width: 33.33%;
							font-size: 28rpx;
							font-weight: 400;
							color: #4D4D4D;
							line-height: 48rpx;
							&.middle {
								display: flex;
								flex-direction: column;
								align-items: center;
								text-align: center;
							}
							&.right {
								text-align: right;
							}
							.up {
								margin-bottom: 10rpx;
							}
							.down {
								.u-input {}
								.sex {
									display: flex;
									justify-content: space-between;
									align-items: center;
									.radio {
										position: relative;
										width: 66rpx;
										color: #1A1A1A;
										text-align: center;
										background: #EBEBEB;
										&.man {
											right: -10rpx;
											border-radius: 24rpx 0 0 24rpx;
										}
										&.woman {
											left: -10rpx;
											border-radius: 0 24rpx 24rpx 0;
										}
										&.active {
											z-index: 1;
											color: #FFFFFF;
											background: #409EFF;
											border-radius: 24rpx !important;
										}
									}
								}
							}
						}
					}
				}
			}
			&.zhenduan {
				.content {
					.list {
						padding: 42rpx 30rpx;
						background: #FFFFFF;
						border-radius: 4rpx;
						.item {
							display: inline-flex;
							justify-content: space-between;
							align-items: center;
							margin-right: 20rpx;
							margin-bottom: 20rpx;
							background: #F5F5F5;
							border-radius: 31rpx;
							.name {
								max-width: 540rpx;
								padding-left: 20rpx;
								font-size: 28rpx;
								font-weight: 400;
								color: #1A1A1A;
								line-height: 62rpx;
								white-space: nowrap;
								overflow: hidden;
								text-overflow: ellipsis;
							}
							.u-icon {
								padding: 10rpx 20rpx 10rpx 15rpx;
							}
						}
					}
				}
			}
			&.yaoping {
				.content {
					.list {
						.item {
							margin-bottom: 20rpx;
							padding: 15rpx 30rpx;
							background: #FFFFFF;
							border-radius: 4rpx;
							&:last-child {
								margin-bottom: 0;
							}
							.row {
								&.row1 {
									display: flex;
									justify-content: space-between;
									font-size: 30rpx;
									font-weight: 400;
									line-height: 60rpx;
									.name {
										max-width: 480rpx;
										color: #1A1A1A;
										white-space: nowrap;
										overflow: hidden;
										text-overflow: ellipsis;
									}
									.actions {
										color: #409EFF;
										.edit {
											margin-right: 40rpx;
										}
										.delete {}
									}
								}
								&.row2 {
									view {
										font-size: 24rpx;
										font-weight: 400;
										color: #999999;
										line-height: 54rpx;
									}
								}
								&.row3 {
									view {
										font-size: 24rpx;
										font-weight: 400;
										color: #4D4D4D;
										line-height: 54rpx;
									}
								}
								&.row4 {
									display: flex;
									justify-content: flex-end;
									align-items: center;
									margin-bottom: 15rpx;
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
			}
			&.buchong {
				.content {
					.desc {
						padding: 20rpx;
						background: #FFFFFF;
						border-radius: 4rpx;
						.u-textarea {
							background-color: #F5F5F5;
							border: none;
							/deep/ .u-textarea__field {
								min-height: 70px;
							}
							/deep/ .u-textarea__count {
								background-color: #F5F5F5 !important;
							}
						}
					}
					.model {
						position: relative;
						margin-top: 20rpx;
						padding: 30rpx 20rpx;
						background: #FFFFFF;
						border-radius: 4rpx;
						.mask {
							position: absolute;
							top: 0;
							bottom: 0;
							left: 0;
							right: 0;
							z-index: 1;
						}
						.u-radio {
							/deep/ .u-radio__text {
								color: #1A1A1A !important;
							}
						}
					}
				}
			}
		}
		.fix {
			position: relative;
			margin-top: 55rpx;
			padding: 25rpx 30rpx;
			background: #FFFFFF;
			.row {
				font-size: 28rpx;
				font-weight: 400;
				color: #999999;
				line-height: 58rpx;
				.price {
					color: #F40E0E;
				}
			}
			.send-btn {
				position: absolute;
				top: 50%;
				right: 30rpx;
				transform: translateY(-50%);
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
		.wrap-keyboard {
			padding: 40rpx 24rpx;
			background: #FFFFFF;
			.tips {
				position: relative;
				margin-bottom: 40rpx;
				font-size: 36rpx;
				font-weight: 500;
				color: #1A1A1A;
				line-height: 54rpx;
				text-align: center;
				.close {
					position: absolute;
					top: 0;
					right: 0;
					font-size: 30rpx;
					font-weight: 400;
					color: #999999;
					line-height: 54rpx;
				}
			}
			.u-code-input {
				margin-bottom: 40rpx;
				justify-content: center;
			}
		}
	}
</style>


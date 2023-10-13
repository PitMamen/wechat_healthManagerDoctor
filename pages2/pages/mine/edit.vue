<template>
	<view class="wrap">
		<view class="content">
			<view class="top">
				<view class="row" @click="avatarClick()">
					<view class="left">
						<image :src="info.avatarUrl||'/static/static/images/header.png'" mode="aspectFill"></image>
					</view>
					<view class="right">
						<view class="value gray">修改头像</view>
						<u-icon name="arrow-right" color="#999999" size="36rpx"></u-icon>
					</view>
				</view>
				<view class="row" @click="show1 = true; hideKeyboard();">
					<view class="left">
						<text>性别</text>
					</view>
					<view class="right">
						<view class="value">{{info.userSex||''}}</view>
						<u-icon name="arrow-right" color="#999999" size="36rpx"></u-icon>
					</view>
				</view>
				<view class="row" @click="show2 = true; hideKeyboard();">
					<view class="left">
						<text>出生日期</text>
					</view>
					<view class="right">
						<view class="value">{{info.birthday||''}}</view>
						<u-icon name="arrow-right" color="#999999" size="36rpx"></u-icon>
					</view>
				</view>
				<view class="row">
					<view class="left">
						<text>联系电话</text>
					</view>
					<view class="right">
						<u--input
							type="number"
							color="#1A1A1A"
							fontSize="28rpx"
							maxlength="11"
							border="none"
							inputAlign="right"
							placeholder="请输入您的联系电话"
							v-model="info.phone"
						></u--input>
					</view>
				</view>
				<view class="row">
					<view class="left">
						<text>身份证号</text>
					</view>
					<view class="right">
						<u--input
							type="idcard"
							color="#1A1A1A"
							fontSize="28rpx"
							maxlength="18"
							border="none"
							inputAlign="right"
							placeholder="请输入您的身份证号"
							v-model="info.identificationNo"
						></u--input>
					</view>
				</view>
				<view class="row">
					<view class="left">
						<text>邮箱地址</text>
					</view>
					<view class="right">
						<u--input
							type="text"
							color="#1A1A1A"
							fontSize="28rpx"
							maxlength="50"
							border="none"
							inputAlign="right"
							placeholder="请输入您的邮箱地址"
							v-model="info.email"
						></u--input>
					</view>
				</view>
			</view>
			<view class="bottom">
				<view class="desc">
					<view class="title">擅长领域</view>
					<view class="textarea">
						<u--textarea
							v-model="info.expertInDisease"
							count
							maxlength="120"
							placeholder="请填写您的擅长领域，以便患者了解您的详细信息"
						></u--textarea>
					</view>
				</view>
				<view class="desc">
					<view class="title">简介</view>
					<view class="textarea">
						<u--textarea
							v-model="info.doctorBrief"
							count
							maxlength="500"
							placeholder="请输入您的个人简介"
						></u--textarea>
					</view>
				</view>
			</view>
		</view>
		<view class="fix-btn">
			<view class="btn" @click="submit()">保存</view>
		</view>
		
		<u-datetime-picker
		    mode="date"
			:show="show2"
			:minDate="minDate"
			@close="close2"
			@cancel="close2"
			@confirm="confirm2"
		></u-datetime-picker>
		<u-picker :show="show1" :columns="list1" @cancel="cancel1" @confirm="confirm1"></u-picker>
	</view>
</template>

<script>
	import {
		baseURL
	} from '@/config/config';
	
	export default {
		data() {
			return {
				flag: false,
				show1: false,
				show2: false,
				info: {
					phone: '',
					email: '',
					userSex: '',
					birthday: '',
					avatarUrl: '',
					doctorBrief: '',
					expertInDisease: '',
					identificationNo: ''
				},
				list1: [[
					{text: '男',value: '男'},
					{text: '女',value: '女'},
					{text: '未知',value: '未知'}
				]],
				minDate: new Date('1900/01/01').getTime()
			}
		},
		onLoad() {
			this.getInfo();
		},
		onReady() {
		},
		onShow() {
		},
		methods: {
			getInfo() {
				uni.showLoading({
					title:'正在加载'
				});
				uni.$u.http.get('/account-api/accountInfo/getDoctorUserDetailPhone').then(res => {
					uni.hideLoading();
					this.info = {
						phone: res.data.phone,
						email: res.data.email,
						userSex: res.data.userSex,
						birthday: res.data.birthday,
						avatarUrl: res.data.avatarUrl,
						doctorBrief: res.data.doctorBrief,
						expertInDisease: res.data.expertInDisease,
						identificationNo: res.data.identificationNo
					};
				});
			},
			submit() {
				if (!this.info.userSex){
					uni.showToast({
						title: '请先选择性别',
						icon: 'none'
					});
					return;
				}
				if (!/^1[3,4,5,6,7,8,9][0-9]{9}$/.test(this.info.phone)){
					uni.showToast({
						title: '请先输入正确的联系电话',
						icon: 'none'
					});
					return;
				}
				if (!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(this.info.identificationNo)){
					uni.showToast({
						title: '请先输入正确的身份证号',
						icon: 'none'
					});
					return;
				}
				if (this.info.email
				&& !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(this.info.email)){
					uni.showToast({
						title: '请输入正确的邮箱地址',
						icon: 'none'
					});
					return;
				}
				if (this.info.doctorBrief && this.info.doctorBrief.length<10){
					uni.showToast({
						title: '简介：10~500字以内文本',
						icon: 'none'
					});
					return;
				}
				if (this.flag){
					return;
				}
				this.flag = true;
				uni.showLoading({
					title:'正在加载'
				});
				uni.$u.http.post(`/account-api/accountInfo/updateDoctorUserPhone`, {
					...this.info
				}).then(res => {
					uni.hideLoading();
					uni.showToast({
						title: '保存成功',
						icon: 'success'
					});
					setTimeout(() => {
						uni.navigateBack({
							delta: 1
						});
					}, 2000);
				}).catch(err => {
					this.flag = false;
				});
			},
			avatarClick() {
				this.hideKeyboard();
				uni.chooseImage({
					count: 1,
					sourceType: ['album', 'camera'],
					sizeType: ['original', 'compressed'],
					success: res => {
						if (res) {
							uni.showLoading({
								title:'正在加载'
							});
							uni.uploadFile({
								url: baseURL + '/content-api/fileUpload/uploadImgFile',
								filePath: res.tempFilePaths[0],
								name: 'file',
								header: {
									Authorization: uni.getStorageSync('bussinessToken')
								},
								success: res => {
									uni.hideLoading();
									const resp = JSON.parse(res.data);
									this.$set(this.info, 'avatarUrl', resp.data.fileLinkUrl);
								}
							});
						}
					},
					fail: err => {
						console.log('err', err);
					}
				});
			},
			hideKeyboard() {
				uni.hideKeyboard();
			},
			formatDate(date) {
				date = new Date(date);
				let myyear = date.getFullYear();
				let mymonth = date.getMonth() + 1;
				let myweekday = date.getDate();
				mymonth < 10 ? (mymonth = '0' + mymonth) : mymonth;
				myweekday < 10 ? (myweekday = '0' + myweekday) : myweekday;
				return `${myyear}${mymonth}${myweekday}`;
			},
			cancel1() {
				this.show1 = false;
			},
			close2() {
				this.show2 = false;
			},
			confirm1(e) {
				this.cancel1();
				this.$set(this.info, 'userSex', e.value[0].value);
			},
			confirm2(event) {
				this.close2();
				this.$set(this.info, 'birthday', this.formatDate(event.value));
			}
		}
	}
</script>

<style lang="scss">
	.wrap {
		min-height: 100vh;
		background: #FFFFFF;
		.content {
			background: #F2F2F2;
			.top {
				padding: 0 24rpx;
				background: #FFFFFF;
				.row {
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding: 20rpx 0;
					border-bottom: 1rpx solid #E6E6E6;
					&:last-child {
						border-bottom: 1rpx solid transparent;
					}
					.left {
						font-size: 32rpx;
						font-weight: 400;
						color: #1A1A1A;
						line-height: 52rpx;
						image {
							width: 88rpx;
							height: 88rpx;
							border-radius: 50%;
						}
					}
					.right {
						flex: 1;
						display: flex;
						align-items: center;
						justify-content: flex-end;
						.value {
							font-size: 28rpx;
							font-weight: 400;
							color: #1A1A1A;
							line-height: 48rpx;
							&.gray {
								color: #c0c4cc;
							}
						}
						.u-icon {
							position: relative;
							top: 2rpx;
							margin-left: 20rpx;
						}
					}
				}
			}
			.bottom {
				margin-top: 20rpx;
				padding: 0 24rpx;
				background: #FFFFFF;
				.desc {
					padding-top: 10rpx;
					.title {
						font-size: 32rpx;
						font-weight: 400;
						color: #1A1A1A;
						line-height: 72rpx;
					}
					.textarea {
						border: 1rpx solid #E6E6E6;
						.u-textarea {
							background-color: #FFFFFF;
							border: none;
							/deep/ .u-textarea__field {
								min-height: 100px;
							}
							/deep/ .u-textarea__count {
								background-color: #FFFFFF !important;
							}
						}
					}
				}
			}
		}
		.fix-btn {
			position: fixed;
			bottom: 90rpx;
			width: 100%;
			padding: 0 24rpx;
			box-sizing: border-box;
			.btn {
				font-size: 30rpx;
				font-weight: 400;
				color: #FFFFFF;
				line-height: 68rpx;
				text-align: center;
				background: #5A9CF8;
				border-radius: 8rpx;
			}
		}
	}
</style>

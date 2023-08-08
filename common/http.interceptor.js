import { baseURL } from '@/config/config';
const install = (Vue, vm) => {
	Vue.prototype.$u.http.setConfig((config) => {
		/* config 为默认全局配置*/
		config.baseURL = baseURL;
		// config.baseURL = `http://192.168.1.121`;
		// config.baseURL = `http://develop.mclouds.org.cn:8009`;
		config.timeout = 60000;
		config.header = {
			'Content-Type': 'application/json;charset=UTF-8'
			// 'Action': 'X-TC-Action'
		};
		return config
	})

	// 请求拦截，配置Token等参数
	Vue.prototype.$u.http.interceptors.request.use((config) => { // 可使用async await 做异步操作
		const token = uni.getStorageSync('bussinessToken');
		console.log('headerToken', token)
		config.header.Authorization = token;
		return config
	}, config => { // 可使用async await 做异步操作
		return Promise.reject(config)
	})

	// 响应拦截，判断状态码是否通过
	Vue.prototype.$u.http.interceptors.response.use((response) => {
		const code = response.data.code
		let success = response.data.success
		if (code === 200) {
			success = true
		}
		if (code === 0) {
			success = true
		}
		if (code === 10001) {
			uni.redirectTo({
				url: '/pages/login/login',
				success: () => {
					uni.showToast({
						title: response.data.message || '凭证超时，请重新登录',
						icon: 'none'
					});
				}
			});
		} else if (code === 10004) {
			uni.showToast({
				title: response.data.message,
				icon: 'none'
			});
			return Promise.reject(response.data);
		} else if (!success) {
			console.log('response', response.data.message)
			uni.showToast({
				title: response.data.message,
				icon: 'none'
			});
			return Promise.reject(response.data);
		} else {
			return response.data || {}
		}
	}, (response) => {
		return Promise.reject(response)
	})
}

export default {
	install
}

const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	configureWebpack: {
		externals: {
			'tim-wx-sdk': 'commonjs tim-wx-sdk',
		},
		plugins: [
			new CopyWebpackPlugin([
				{
					from: path.join(__dirname, '/miniprogram_npm'),
					to: path.join(__dirname, '/unpackage/dist/dev/mp-weixin/miniprogram_npm')
				},
				{
					from: path.join(__dirname, '/miniprogram_npm'),
					to: path.join(__dirname, '/unpackage/dist/build/mp-weixin/miniprogram_npm')
				},
				{
					from: path.join(__dirname, '/pages2/wxcomponents'),
					to: path.join(__dirname, '/unpackage/dist/dev/mp-weixin/pages2/wxcomponents')
				},
				{
					from: path.join(__dirname, '/pages2/wxcomponents'),
					to: path.join(__dirname, '/unpackage/dist/build/mp-weixin/pages2/wxcomponents')
				}
			])
		]
	}
};
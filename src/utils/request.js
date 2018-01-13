import wepy from 'wepy'
import config from '../config'
import Login from './login.js'
let server = config.env,
	accessToken = '';

function getServerUrl() {
	return `${config.apiBase}`;
}

function request(route, method, data, success, fail, other) {
	accessToken = wx.getStorageSync(server + 'token');
	let args = arguments;
	console.log('accessToken:' + accessToken);
	if (accessToken == '') {
		new Login().init();//登录
		return;
	}
	common_req.apply(null, args);//公共请求封装
}

function common_req() {
	let args = arguments;
	let noModal = false;
	if (!args[5] || !args[5].noToast) {
		wx.showToast({
			title: '加载中',
			icon: 'loading',
			duration: 10000,
			mask: true
		});
	}
	if (args[5] && args[5].noModal) {
		noModal = true;
	}
	
	if (args[2]) {
		args[2].thirdSessionKey = accessToken;
		args[2].service = args[0];
	}

	wx.request({
		url: getServerUrl(),
		method: args[1],
		data: args[2],
		header: {
			'content-type': 'application/x-www-form-urlencoded'
		},
		success: (res) => {
			wx.hideToast();
			if (args[5] && args[5].getCodeSts && res.data.ret != 200) {
				args[3].call(this, res.data);
				return;
			}
			if (res.data.ret == 200 && typeof args[3] == 'function') {
				args[3].call(this, res.data.data);
			} else if (res.data.ret == -10000) {
				wx.setStorageSync(server + 'token', '');
				new Login().init();//登录
				return;
			} else {//返回错误的情况
				if (res.data.msg && !noModal) {
					args[4] && args[4].call(this, res);
					wx.showModal({
						showCancel: false,
						content: res.data.msg
					})
				} else if (res.statusCode && res.statusCode == 500) {
					args[4].call(this, res);
				}
			}

		},
		fail: (err) => {
			wx.hideToast();
		}
	});
}

function userInfo() {
	return wx.getStorageSync(server + '_nickname');
}

module.exports = {
	systemInfo: wepy.getSystemInfoSync(),
	server,
	userInfo,
	getServerUrl,
	request
}
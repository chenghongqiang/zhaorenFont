import config from '../config'
import wepy from 'wepy'
let server = config.env;
let loginSts = !1;//是否在登录状态
//登录模块
function Login() {
	this.server = config.env;
	this.userInfo = {};//用户信息
}

var pt = Login.prototype;

pt.wechatapplogin = function (parm) {
	let that = this;
	if(parm.iv && parm.encryptedData && !wx.getStorageSync('_addUser')){
		let token = wx.getStorageSync(server + 'token');
		parm.thirdSessionKey = token;
		that.addUser(parm);
		return;
	}
	wx.request({
		url: `${config.apiBase}` + '?service=App.Find_User.UserLogin',
		data: parm,
		method: 'POST',
		header: {
			'content-type': 'application/x-www-form-urlencoded',
			'Accept': 'application/json'
		},
		success: function (resRes) {
			console.log('调用后端UserLogin接口成功', resRes);
			resRes.data = parseData(resRes.data);
			if (resRes.data.data.thirdSessionKey) {
				wx.setStorageSync(server + 'token', resRes.data.data.thirdSessionKey);
			} else {
				loginSts = !1;
				console.log('登录失败');
			}
		},
		fail: () => {
			loginSts = !1;//取消登录状态
		}
	})
}

pt.toLogin = function () {
	let that = this;
	console.log('调用微信login');
	wx.login({
		success: (res) => {
			if (!res || !res.code) {
				console.log('获取用户登录态失败！' + res.errMsg);
				return;
			}
			let code = res.code,
				parm = {
					code: code
				}

			let accessToken = wx.getStorageSync(server + 'token');
			if ( accessToken === '') {
				that.wechatapplogin(parm);
			}
		},
		fail: () => {
			wx.showToast({
				title: '微信服务器异常，请稍后重试！'
			})
		}
	});
}

pt.getUserInfo = function () {
	let that = this;
	that.toLogin((code) => {
		var userInfoStorage = wx.getStorageSync(config.env + "userInfo");
		if(!userInfoStorage) {
			wx.getUserInfo({
				success: (resInfo) => {
					console.log('resInfo',resInfo);
					let parm = {
						code: code,
						encryptedData: resInfo.encryptedData,
						iv: resInfo.iv,
						rawData: resInfo.rawData,
						signature: resInfo.signature
					};
					that.wechatapplogin(parm);
					wx.setStorageSync(config.env + 'userInfo', resInfo.userInfo);
				}
			})
		}

		console.log('info:' + userInfoStorage);
	});
}


pt.init = function () {
	let that = this;
	if (loginSts == !0) {
		return;
	}
	that.toLogin();
}

pt.addUser = function (parm) {
	let newParm = {
		iv:parm.iv,
		thirdSessionKey:parm.thirdSessionKey,
		encryptedData:parm.encryptedData,
		rawData: parm.rawData,
		signature: parm.signature
	}
	wx.request({
		url: `${config.apiBase}` + 'App.Find_User.InsertUserInfo',
		data: newParm,
		method: 'POST',
		header: {
			'content-type': 'application/x-www-form-urlencoded',
			'Accept': 'application/json'
		},
		success: function (resRes) {
			if(resRes && resRes.data && resRes.data.ret==200){
				console.log('addUser成功', resRes);
				wx.setStorageSync(server + '_addUser',true);
			}
		},
		fail: () => {
			wx.showToast({
				title: '系统故障，请联系管理员'
			})
		}
	})
}

function parseData(data) {
	if (typeof data == "object") {
		return data;
	}
	var str = data.slice(1).replace('\\', '');
	return JSON.parse(str);
}

module.exports = Login;
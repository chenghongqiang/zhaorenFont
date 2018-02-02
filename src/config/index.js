// 这里添加的属性，可以通过app.config 来访问
let config = {
    AppID: 'wxd035cd5461feb811',//AppID
    title: '找人',
    env:'prod',
    version: 'v1.0.0'
};

if (config.env == 'dev') {
    config.apiBase = "https://service.helpzhaoren.com";
} else {
    config.apiBase = "https://service.helpzhaoren.com";
}

module.exports = config;

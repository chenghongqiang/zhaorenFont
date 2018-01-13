// 匹配表单输入信息

function testRedPacket(redPacket) {//匹配大于0的整数
  var reg = /^[1-9]+[0-9]*$/; //匹配大于0的整数
  return reg.test(redPacket);
}

function testFind(Find) {//匹配大于6的位数
  var reg = /^[a-zA-Z0-9]{6,}$/; //匹配大于6的位数
  return reg.test(Find);
}

function testPhone(phone) {//匹配手机号码
  var reg = /^((1[0-9]{2})+\d{8})$/;
  return reg.test(phone);
}

function testName(name) {//匹配姓名
  var reg = /^[\u4e00-\u9fa5]+(.[\u4e00-\u9fa5]+)*$/; //匹配姓名
  return reg.test(name);
}

function trim(str) { //删除左右两端的空格 
  return str.replace(/(^\s*)|(\s*$)/g, "");
}

module.exports = {
  testRedPacket,
  testPhone,
  testName,
  trim
}

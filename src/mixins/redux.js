import wepy from 'wepy'
import config from '../config'
import request from '../utils/request.js'

let click_timestamp = 0;
let formIdRecord = {
  timestamp: 0,
  num: 0,
  formIdList: []
}

export default class extends wepy.mixin {
  saveFormId() {
    let e = this;
    if (!e || !e.detail || !e.detail.formId) {
      return;
    }
    let formId = e.detail.formId;
    if (formIdRecord.num === 0) {
      formIdRecord.timestamp = new Date().getTime();
    } else if (formIdRecord.num > 10) {
      let timestamp = new Date().getTime();
      let during = timestamp - formIdRecord.timestamp;
      if (during > 24 * 60 * 60 * 1000) {
        formIdRecord.num = 0;
        formIdRecord.timestamp = new Date().getTime();
      } else {
        return;
      }
    }
    formIdRecord.num++;
    request.request("App.Find_IntroSuccessRecord.SendModuleMsg", 'POST', {
      formId
    }, function () {
    }, function () {
    }, { 'noToast': true });
  }
  remslik(duringTime) {
    let during = duringTime ? duringTime : 1500;
    let timestamp = new Date().getTime();
    if (timestamp - click_timestamp > during) {
      click_timestamp = timestamp;
      return true;
    } else {
      return false;
    }
  }
}

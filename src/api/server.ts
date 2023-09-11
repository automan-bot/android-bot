import type { AxiosRequestConfig } from "axios";
import request from "../utils/request";
import { ErrListener } from "src/Model/GlobalModel";
const urlMap = {
  //get
  hello: "/hello",
  version: "/version",
  getActiveInfo: "/getActiveInfo",
  getDeviceId: "/getDeviceId",
  screenInfo: "/screenInfo",
  getSystemInfo: "/getSystemInfo",
  screenJson: "/screenJson",
  screenXml: "/screenXml",
  screenShotBase64: "/screenShotBase64",
  screenShot: "/screenShot",
  screenRotation: "/screenRotation",
  getAllContact: "/getAllContact",
  deleteContact: "/deleteContact",
  getClipText: "/getClipText",
  startRecoreScreen: "/startRecoreScreen",
  stopRecoreScreen: "/stopRecoreScreen",
  turnScreenOff: "/turnScreenOff",
  exit: "/exit",
  checkNotification: "/checkNotification",
  getIp: "/getIp",
  getAllSms: "/getAllSms",
  deleteSms: "/deleteSms",
  download: "/download",
  getDisplayName: "/getDisplayName",
  getTopActivity: "/getTopActivity",
  getStartActivity: "/getStartActivity",
  startPackage: "/startPackage",
  stopPackage: "/stopPackage",
  clearPackage: "/clearPackage",
  getAllPackage: "/getAllPackage",
  getPackageInfo: "/getPackageInfo",
  stopMusic: "/stopMusic",
  cancelAllNotifications: "/cancelAllNotifications",
  callPhone: "/callPhone",
  endCall: "/endCall",
  //post mutiparform
  upload: "/upload",
  //post
  active: "/active",
  inputText: "/inputText",
  execCmd: "/execCmd",
  inputChar: "/inputChar",
  pressKeyCode: "/pressKeyCode",
  insertContact: "/insertContact",
  gestures: "/gestures",
  gesture: "/gesture",
  emptyDir: "/emptyDir",
  delFile: "/delFile",
  sendSms: "/sendSms",
  listFile: "/listFile",
  setDisplayName: "/setDisplayName",
  playMusic: "/playMusic",
};
class ServerApi {
  private baseUrl: string;
  public urlMap = {};
  public isSsl: boolean;
  private mErrorListener: ErrListener;
  constructor(baseUrl: string, isSsl: boolean = false) {
    this.baseUrl = baseUrl;
    this.isSsl = isSsl;
    this.initUrlMap();
  }
  private initUrlMap() {
    let protocol = this.isSsl ? "https://" : "http://";
    Object.keys(urlMap).forEach((key) => {
      this.urlMap[key] = `${protocol}${this.baseUrl}/api${urlMap[key]}`;
    });
  }
  addErrorListener(listener: ErrListener) {
    this.mErrorListener = listener;
  }
  private async _request(prop: AxiosRequestConfig) {
    const res = await request(prop);
    if (res.data.code === 0 && this.mErrorListener) {
      this.mErrorListener(res.data.msg);
    }
    return res;
  }
  //get获取
  //欢迎信息
  hello(para = null) {
    return this._request({
      url: this.urlMap["hello"],
      method: "get",
      params: para,
    });
  }
  version(para = null) {
    return this._request({
      url: this.urlMap["version"],
      method: "get",
      params: para,
    });
  }
  getActiveInfo(para = null) {
    return this._request({
      url: this.urlMap["getActiveInfo"],
      method: "get",
      params: para,
    });
  }
  getDeviceId(para = null) {
    return this._request({
      url: this.urlMap["getDeviceId"],
      method: "get",
      params: para,
    });
  }
  screenInfo(para = null) {
    return this._request({
      url: this.urlMap["screenInfo"],
      method: "get",
      params: para,
    });
  }
  getSystemInfo(para = null) {
    return this._request({
      url: this.urlMap["getSystemInfo"],
      method: "get",
      params: para,
    });
  }
  screenJson(para = null) {
    return this._request({
      url: this.urlMap["screenJson"],
      method: "get",
      params: para,
    });
  }
  screenXml(para = null) {
    return this._request({
      url: this.urlMap["screenXml"],
      method: "get",
      params: para,
    });
  }
  screenShotBase64(para = null) {
    return this._request({
      url: this.urlMap["screenShotBase64"],
      method: "get",
      params: para,
    });
  }
  screenShot(para = null) {
    // return this.urlMap["screenShot"]
    return this._request({
      url: this.urlMap["screenShot"],
      method: "get",
      params: para,
      responseType: "arraybuffer",
    });
  }
  screenRotation(para = null) {
    return this._request({
      url: this.urlMap["screenRotation"],
      method: "get",
      params: para,
    });
  }
  getAllContact(para) {
    return this._request({
      url: this.urlMap["getAllContact"],
      method: "get",
      params: para,
    });
  }
  deleteContact(para) {
    return this._request({
      url: this.urlMap["deleteContact"],
      method: "get",
      params: para,
    });
  }
  getClipText(para = null) {
    return this._request({
      url: this.urlMap["getClipText"],
      method: "get",
      params: para,
    });
  }
  startRecoreScreen(para = null) {
    return this._request({
      url: this.urlMap["startRecoreScreen"],
      method: "get",
      params: para,
    });
  }
  stopRecoreScreen(para = null) {
    return this._request({
      url: this.urlMap["stopRecoreScreen"],
      method: "get",
      params: para,
    });
  }
  turnScreenOff(para = null) {
    return this._request({
      url: this.urlMap["turnScreenOff"],
      method: "get",
      params: para,
    });
  }
  exit(para) {
    return this._request({
      url: this.urlMap["exit"],
      method: "get",
      params: para,
    });
  }
  checkNotification(para = null) {
    return this._request({
      url: this.urlMap["checkNotification"],
      method: "get",
      params: para,
    });
  }
  getIp(para = null) {
    return this._request({
      url: this.urlMap["getIp"],
      method: "get",
      params: para,
    });
  }
  getAllSms(para = null) {
    return this._request({
      url: this.urlMap["getAllSms"],
      method: "get",
      params: para,
    });
  }
  deleteSms(para = null) {
    return this._request({
      url: this.urlMap["deleteSms"],
      method: "get",
      params: para,
    });
  }
  download(para = null) {
    return this._request({
      url: this.urlMap["download"],
      method: "get",
      params: para,
    });
  }
  downloadUrl() {
    return this.urlMap["download"];
  }
  getDisplayName(para = null) {
    return this._request({
      url: this.urlMap["getDisplayName"],
      method: "get",
      params: para,
    });
  }
  getTopActivity(para = null) {
    return this._request({
      url: this.urlMap["getTopActivity"],
      method: "get",
      params: para,
    });
  }
  getStartActivity(para = null) {
    return this._request({
      url: this.urlMap["getStartActivity"],
      method: "get",
      params: para,
    });
  }
  startPackage(para = null) {
    return this._request({
      url: this.urlMap["startPackage"],
      method: "get",
      params: para,
    });
  }
  stopPackage(para = null) {
    return this._request({
      url: this.urlMap["stopPackage"],
      method: "get",
      params: para,
    });
  }
  clearPackage(para = null) {
    return this._request({
      url: this.urlMap["clearPackage"],
      method: "get",
      params: para,
    });
  }
  getAllPackage(para = null) {
    return this._request({
      url: this.urlMap["getAllPackage"],
      method: "get",
      params: para,
    });
  }
  getPackageInfo(para = null) {
    return this._request({
      url: this.urlMap["getPackageInfo"],
      method: "get",
      params: para,
    });
  }
  stopMusic(para = null) {
    return this._request({
      url: this.urlMap["stopMusic"],
      method: "get",
      params: para,
    });
  }
  cancelAllNotifications(para = null) {
    return this._request({
      url: this.urlMap["cancelAllNotifications"],
      method: "get",
      params: para,
    });
  }
  callPhone(para = null) {
    return this._request({
      url: this.urlMap["callPhone"],
      method: "get",
      params: para,
    });
  }
  endCall(para = null) {
    return this._request({
      url: this.urlMap["endCall"],
      method: "get",
      params: para,
    });
  }

  //上传文件
  upload(para, config = {}) {
    return this._request({
      url: this.urlMap["upload"],
      method: "post",
      data: para,
      ...config,
    });
  }
  uploadUrl() {
    return this.urlMap["upload"];
  }
  //post提交
  active(para) {
    return this._request({
      url: this.urlMap["active"],
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      method: "post",
      data: para,
    });
  }
  inputText(para) {
    return this._request({
      url: this.urlMap["inputText"],
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      method: "post",
      data: para,
    });
  }
  execCmd(para) {
    return this._request({
      timeout: para.timeout * 1000 + 1000,
      url: this.urlMap["execCmd"],
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      method: "post",
      data: para,
    });
  }
  inputChar(para) {
    return this._request({
      url: this.urlMap["inputChar"],
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      method: "post",
      data: para,
    });
  }
  pressKeyCode(para) {
    return this._request({
      url: this.urlMap["pressKeyCode"],
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      method: "post",
      data: para,
    });
  }
  insertContact(para) {
    return this._request({
      url: this.urlMap["insertContact"],
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      method: "post",
      data: para,
    });
  }
  gestures(para) {
    return this._request({
      url: this.urlMap["gestures"],
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      method: "post",
      data: para,
    });
  }
  gesture(para) {
    return this._request({
      url: this.urlMap["gesture"],
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      method: "post",
      data: para,
    });
  }
  emptyDir(para) {
    return this._request({
      url: this.urlMap["emptyDir"],
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      method: "post",
      data: para,
    });
  }
  delFile(para) {
    return this._request({
      url: this.urlMap["emptyDir"],
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      method: "post",
      data: para,
    });
  }
  sendSms(para = null) {
    return this._request({
      url: this.urlMap["sendSms"],
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      method: "post",
      data: para,
    });
  }
  listFile(para) {
    return this._request({
      url: this.urlMap["listFile"],
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      method: "post",
      data: para,
    });
  }
  setDisplayName(para) {
    return this._request({
      url: this.urlMap["setDisplayName"],
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      method: "post",
      data: para,
    });
  }
  playMusic(para) {
    return this._request({
      url: this.urlMap["playMusic"],
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      method: "post",
      data: para,
    });
  }
}

export default ServerApi;

import ServerApi from "./api/server";
import {
  ActiveInfo,
  ErrListener,
  FileItem,
  IContact,
  IDeviceInfo,
  IFileItem,
  IGesture,
  IScreenInfo,
  ITopActivityInfo,
  IUIObject,
  ScreenInfo,
  ScreenRotation,
  ShortPackageInfo,
  TopActivityInfo,
} from "./Model/GlobalModel";
import { ScreenControl } from "./ScreenControl";
import { IWebSocket } from "./interface/IWebSocket";
import { PackageInfo } from "./Model/PackageInfo";

class Device {
  public url: string;
  public deviceId: string;
  public displayName: string;
  private serverApi: ServerApi;
  public mScreenControl: ScreenControl;
  constructor(url: string, isSsl: boolean = false) {
    this.url = url;
    this.serverApi = new ServerApi(url, isSsl);
    this.mScreenControl = new ScreenControl(url, isSsl);
    this.init();
  }
  private mErrorListener: ErrListener;
  addErrorListener(listener: ErrListener) {
    this.mErrorListener = listener;
    this.serverApi.addErrorListener(listener);
    this.mScreenControl.addErrorListener(listener);
  }

  setWebSocketClient(iWebSocket: IWebSocket) {
    this.mScreenControl.setWebSocktClient(iWebSocket);
  }
  async init() {
    this.deviceId = await this.getDeviceId();
    this.displayName = await this.getDisplayName();
  }
  async hello(): Promise<boolean> {
    try {
      let axiosResponse = await this.serverApi.hello(null);
      return !!axiosResponse.data;
    } catch (e) {
      return false;
    }
  }

  async version(): Promise<string> {
    let axiosResponse = await this.serverApi.version(null);
    return axiosResponse.data;
  }
  async getActiveInfo(): Promise<ActiveInfo> {
    let axiosResponse = await this.serverApi.getActiveInfo(null);
    return axiosResponse.data.data;
  }
  async getDeviceId(): Promise<string> {
    let axiosResponse = await this.serverApi.getDeviceId(null);
    return axiosResponse.data.data;
  }
  async startRecoreScreen(limit: number): Promise<boolean> {
    let axiosResponse = await this.serverApi.startRecoreScreen({ limit });
    return axiosResponse.data.data == "1";
  }
  async stopRecoreScreen(): Promise<boolean> {
    let axiosResponse = await this.serverApi.stopRecoreScreen(null);
    return axiosResponse.data.data == "1";
  }
  async screenInfo(): Promise<ScreenInfo> {
    let axiosResponse = await this.serverApi.screenInfo(null);
    return new ScreenInfo(axiosResponse.data.data as IScreenInfo);
  }

  async getSystemInfo(): Promise<IDeviceInfo> {
    let axiosResponse = await this.serverApi.getSystemInfo(null);
    return axiosResponse.data.data as IDeviceInfo;
  }

  async screenJson(): Promise<IUIObject> {
    let axiosResponse = await this.serverApi.screenJson(null);
    return axiosResponse.data.data as IUIObject;
  }

  async screenXml(): Promise<string> {
    let axiosResponse = await this.serverApi.screenXml(null);
    return axiosResponse.data.data;
  }

  async screenShotBase64(): Promise<string> {
    let axiosResponse = await this.serverApi.screenShotBase64(null);
    return axiosResponse.data.data;
  }

  //建议返回一个屏幕的url
  async screenShot(): Promise<Blob> {
    let axiosResponse = await this.serverApi.screenShot(null);
    return axiosResponse.data;
  }

  async screenRotation(): Promise<ScreenRotation> {
    let axiosResponse = await this.serverApi.screenRotation(null);
    return new ScreenRotation(axiosResponse.data.data as string);
  }
  //获取所有联系人
  async getAllContact(number: string = "*"): Promise<Array<IContact>> {
    let axiosResponse = await this.serverApi.getAllContact({ number });
    return axiosResponse.data.data as Array<IContact>;
  }
  //传*代表删除所有联系人
  async deleteContact(number: string): Promise<number> {
    let axiosResponse = await this.serverApi.deleteContact({
      number,
    });
    return Number(axiosResponse.data.data);
  }
  async getClipText(): Promise<string> {
    let axiosResponse = await this.serverApi.getClipText();
    return axiosResponse.data.data;
  }
  async clearText(): Promise<boolean> {
    let axiosResponse = await this.serverApi.clearText();
    return axiosResponse.data.data == "1";
  }
  async turnScreenOff(): Promise<boolean> {
    let axiosResponse = await this.serverApi.turnScreenOff();
    return axiosResponse.data.data == "1";
  }
  async turnScreenOn(): Promise<boolean> {
    let axiosResponse = await this.serverApi.turnScreenOn();
    return axiosResponse.data.data == "1";
  }
  async exit() {
    try {
      await this.serverApi.exit(null);
    } catch (e) {}
  }
  async checkNotification(): Promise<boolean> {
    let axiosResponse = await this.serverApi.checkNotification(null);
    return axiosResponse.data.data == "1";
  }
  async getIp(): Promise<string[]> {
    let axiosResponse = await this.serverApi.getIp(null);
    return axiosResponse.data.data as string[];
  }
  async getAllSms(number: string = "*"): Promise<string> {
    let axiosResponse = await this.serverApi.getAllSms({ number });
    return axiosResponse.data.data;
  }
  //非稳定接口有可能不可用
  async deleteSms(number: string = "*"): Promise<number> {
    let axiosResponse = await this.serverApi.deleteSms({ number });
    return Number(axiosResponse.data.data);
  }
  async download(path: string, savePath?: string): Promise<string> {
    let axiosResponse = await this.serverApi.download(null);
    return axiosResponse.data.data;
  }
  downloadUrl(path: string): string {
    return this.serverApi.downloadUrl() + "?path=" + encodeURIComponent(path);
  }
  async getDisplayName(): Promise<string> {
    let axiosResponse = await this.serverApi.getDisplayName(null);
    return axiosResponse.data.data;
  }
  async getTopActivity(): Promise<TopActivityInfo> {
    let axiosResponse = await this.serverApi.getTopActivity(null);
    return new TopActivityInfo(axiosResponse.data.data as ITopActivityInfo);
  }
  async getStartActivity(packageName: string): Promise<string> {
    let axiosResponse = await this.serverApi.getStartActivity({ packageName });
    return axiosResponse.data.data;
  }
  async startPackage(packageName: string): Promise<boolean> {
    let axiosResponse = await this.serverApi.startPackage({ packageName });
    return axiosResponse.data.data == "1";
  }
  async stopPackage(packageName: string): Promise<boolean> {
    let axiosResponse = await this.serverApi.stopPackage({ packageName });
    return axiosResponse.data.data == "1";
  }
  async clearPackage(packageName: string): Promise<boolean> {
    let axiosResponse = await this.serverApi.clearPackage({ packageName });
    return axiosResponse.data.data == "1";
  }
  async getAllPackage(): Promise<ShortPackageInfo[]> {
    let axiosResponse = await this.serverApi.getAllPackage(null);
    return axiosResponse.data.data;
  }
  async getPackageInfo(packageName: string): Promise<PackageInfo> {
    let axiosResponse = await this.serverApi.getPackageInfo({ packageName });
    return axiosResponse.data.data as PackageInfo;
  }
  async stopMusic(): Promise<boolean> {
    let axiosResponse = await this.serverApi.stopMusic(null);
    return axiosResponse.data.data == "1";
  }
  async cancelAllNotifications(): Promise<boolean> {
    let axiosResponse = await this.serverApi.cancelAllNotifications(null);
    return axiosResponse.data.data == "1";
  }
  async callPhone(number: string): Promise<string> {
    let axiosResponse = await this.serverApi.callPhone({ number });
    return axiosResponse.data.data;
  }
  async endCall(): Promise<boolean> {
    let axiosResponse = await this.serverApi.endCall(null);
    return axiosResponse.data.data == "1";
  }
  async stopAllScript(): Promise<boolean> {
    let axiosResponse = await this.serverApi.stopAllScript(null);
    return axiosResponse.data.data == "1";
  }

  async upload(formData: FormData | any, config): Promise<string> {
    let axiosResponse = await this.serverApi.upload(formData, config);
    return axiosResponse.data.data as string;
  }
  uploadUrl() {
    return this.serverApi.uploadUrl();
  }

  async active(value: string): Promise<boolean> {
    let axiosResponse = await this.serverApi.active({ value: value });
    return axiosResponse.data.data == "1";
  }
  async inputText(value: string): Promise<boolean> {
    let axiosResponse = await this.serverApi.inputText({ value: value });
    return axiosResponse.data.data == "1";
  }

  async inputChar(value: string): Promise<boolean> {
    let axiosResponse = await this.serverApi.inputChar({ value: value });
    return axiosResponse.data.data == "1";
  }
  async execCmd(shell: string, timeout = 5): Promise<string> {
    let axiosResponse = await this.serverApi.execCmd({
      value: shell,
      timeout,
    });
    return axiosResponse.data.data;
  }

  async pressKeyCode(keyCode: number): Promise<boolean> {
    let axiosResponse = await this.serverApi.pressKeyCode({ value: keyCode });
    return axiosResponse.data.data == "1";
  }

  async insertContact(name: string, phoneNumber: string): Promise<boolean> {
    let axiosResponse = await this.serverApi.insertContact({
      name,
      number: phoneNumber,
    });
    return axiosResponse.data.data == "1";
  }
  async click(x: number, y: number): Promise<boolean> {
    let axiosResponse = await this.serverApi.click({ x, y });
    return axiosResponse.data.data == "1";
  }
  async longClick(x: number, y: number): Promise<boolean> {
    let axiosResponse = await this.serverApi.longClick({ x, y });
    return axiosResponse.data.data == "1";
  }
  async press(x: number, y: number, duration: number): Promise<boolean> {
    let axiosResponse = await this.serverApi.press({ x, y, duration });
    return axiosResponse.data.data == "1";
  }

  async swipe(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    duration: number
  ): Promise<boolean> {
    let axiosResponse = await this.serverApi.swipe({
      x1,
      y1,
      x2,
      y2,
      duration,
    });
    return axiosResponse.data.data == "1";
  }

  async gestures(gestures: Array<IGesture>): Promise<boolean> {
    let axiosResponse = await this.serverApi.gestures(gestures);
    return axiosResponse.data.data == "1";
  }

  async gesture(gesture: IGesture): Promise<boolean> {
    let axiosResponse = await this.serverApi.gesture(gesture);
    return axiosResponse.data.data == "1";
  }

  async emptyDir(path: string): Promise<boolean> {
    let axiosResponse = await this.serverApi.emptyDir({ value: path });
    return axiosResponse.data.data == "1";
  }
  async delFile(path: string): Promise<boolean> {
    let axiosResponse = await this.serverApi.delFile({ value: path });
    return axiosResponse.data.data == "1";
  }
  async listFile(path: string): Promise<FileItem[]> {
    let axiosResponse = await this.serverApi.listFile({ value: path });
    return FileItem.convertFileItem(axiosResponse.data.data as IFileItem[]);
  }
  async sendSms(phoneNumber: string, content: string): Promise<boolean> {
    let axiosResponse = await this.serverApi.sendSms({
      phoneNumber,
      value: content,
    });
    return axiosResponse.data.data == "1";
  }
  async setDisplayName(displayName: string): Promise<boolean> {
    let axiosResponse = await this.serverApi.setDisplayName({
      value: displayName,
    });
    return axiosResponse.data.data == "1";
  }
  async playMusic(musicUrl: string): Promise<boolean> {
    let axiosResponse = await this.serverApi.playMusic({ value: musicUrl });
    return axiosResponse.data.data == "1";
  }

  async execScript(
    script: string,
    delay: number = 0,
    interval: number = 0,
    loopTimes: number = 1
  ): Promise<boolean> {
    let axiosResponse = await this.serverApi.execScript({
      script,
      delay,
      interval,
      loopTimes,
    });
    return axiosResponse.data.data == "1";
  }

  destory() {
    try {
      if (this.mScreenControl) {
        this.mScreenControl.destory();
      }
    } catch (e) {}
  }
}

export default Device;

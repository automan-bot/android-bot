import {
  IOnCloselistener,
  IOnErrorlistener,
  IOnMessagelistener,
  IOnOpenlistener,
  IWebSocket,
} from "./interface/IWebSocket";
import { timeout } from "./utils";
import {
  ClipTextChangeCallback,
  ErrListener,
  INotificationMessage,
  NotificationChangeCallback,
  ScreenChangeCallback,
  ScreenInfo,
  ScreenOrentationChangeCallback,
  ScreenRotation,
} from "./Model/GlobalModel";
enum ScreenState {
  STREAM_TYPE_INITIATIVE = 1,
  STREAM_TYPE_PASSIVE = 2,
  STREAM_TYPE_STOP = 0,
}
export class ScreenControl
  implements
    IOnOpenlistener,
    IOnCloselistener,
    IOnMessagelistener,
    IOnErrorlistener
{
  url: string;
  private mWs: IWebSocket;
  private mOrentationChangeListenr: ScreenOrentationChangeCallback;
  private mNotificationChangeListenr: NotificationChangeCallback;
  private mScreenChangeListenr: ScreenChangeCallback;
  private mClipTextChangeListenr: ClipTextChangeCallback;
  private isConnected: boolean = false;
  private isRetury: boolean = false;
  private isPassiveReceive: boolean = false;
  private isStartScreenStream: boolean = false;
  private mSale: number = 1.0;
  private mQuality: number = 50;
  private mFps: number = 50;
  private mRetryNumber: number = 10;
  private mCurrentState: ScreenState = ScreenState.STREAM_TYPE_STOP;
  private mErrorListener: ErrListener;

  constructor(url: string, isSsl: boolean = false) {
    let protocol = isSsl ? "wss://" : "ws://";
    this.url = `${protocol}${url}/api/screen`;
  }

  addErrorListener(listener: ErrListener) {
    this.mErrorListener = listener;
  }
  onError(err: string) {
    if (this.mErrorListener) this.mErrorListener(err);
  }

  setWebSocktClient(iWebSocket: IWebSocket) {
    this.mWs = iWebSocket.createWebSocket(this.url);
    this.mWs.addOnOpenListener(this);
    this.mWs.addOnCloseListener(this);
    this.mWs.addOnMessageListener(this);
    this.mWs.addOnErrorListener(this);
  }
  //意外断开后重试次数
  setRetryNumber(retryNumber: number) {
    this.mRetryNumber = retryNumber;
  }
  checkClientIsNull() {
    if (!this.mWs) {
      throw new Error(
        "请先调用setWebSocktClient方法，设置当前环境的websocket Client"
      );
    }
  }

  private buildPara(para) {
    return JSON.stringify(para);
  }
  private send(para: Object) {
    try {
      this.mWs.send(this.buildPara(para));
    } catch (e) {
      console.warn(e);
    }
  }
  private async waitForConnect(waitSecond = 5) {
    let waitTime = waitSecond * 1000;
    let i = 0;
    while (true) {
      if (i > waitTime || this.isConnected) {
        break;
      }
      await timeout(1000);
      i += 1000;
    }
    if (!this.isConnected) {
      this.onError("连接失败");
      throw new Error("连接失败");
    }
  }
  private async resetScreenStream() {
    this.checkClientIsNull();
    this.send({
      action: 101,
    });
    this.isStartScreenStream = false;
    this.mCurrentState = ScreenState.STREAM_TYPE_STOP;
    this.isPassiveReceive = true;
    await timeout(this.mFps + 200);
  }
  async startScreenStream(scale = 1.0, quality = 50, fps = 50) {
    await this.waitForConnect();
    this.setScreenStreamConfig(scale, quality, fps);
    await this.resetScreenStream();
    this.mCurrentState = ScreenState.STREAM_TYPE_INITIATIVE;
    this.send({
      action: 100,
    });
  }
  async startScreenStreamByPassive(scale = 1.0, quality = 50, fps = 50) {
    await this.waitForConnect();
    this.setScreenStreamConfig(scale, quality, fps);
    await this.resetScreenStream();
    this.isStartScreenStream = true;
    this.mCurrentState = ScreenState.STREAM_TYPE_PASSIVE;
    this.startRefreshScreenByPassive();
  }
  private async startRefreshScreenByPassive() {
    let timeOutIndex = 0;
    while (this.isConnected && this.isStartScreenStream) {
      if (this.isPassiveReceive || timeOutIndex > 5) {
        timeOutIndex = 0;
        this.isPassiveReceive = false;
        this.send({
          action: 103,
        });
      } else {
        timeOutIndex++;
      }
      await timeout(this.mFps);
    }
  }

  setScreenStreamConfig(scale = 1.0, quality = 50, fps = 50) {
    this.mSale = scale;
    this.mQuality = quality;
    this.mFps = fps;
    this.checkClientIsNull();
    this.send({
      action: 102,
      scale,
      quality,
      fps,
    });
  }

  stopScreenStream() {
    this.checkClientIsNull();
    this.send({
      action: 101,
    });
    this.isStartScreenStream = false;
    this.mCurrentState = ScreenState.STREAM_TYPE_STOP;
  }

  sendTouchDown(x: number, y: number) {
    this.checkClientIsNull();
    this.send({
      action: 1,
      touch_event: 0,
      x: x,
      y: y,
    });
  }

  sendTouchMove(x: number, y: number) {
    this.checkClientIsNull();
    this.send({
      action: 1,
      touch_event: 2,
      x: x,
      y: y,
    });
  }

  sendTouchUp(x: number, y: number) {
    this.checkClientIsNull();
    this.send({
      action: 1,
      touch_event: 1,
      x: x,
      y: y,
    });
  }

  pressKeyCode(keyCode: number) {
    this.checkClientIsNull();
    this.send({
      action: 4,
      value: keyCode,
    });
  }

  sendSpaceKey() {
    this.pressKeyCode(62);
  }

  sendBackSpaceKey() {
    this.pressKeyCode(67);
  }

  sendEnterKey() {
    this.pressKeyCode(66);
  }

  sendCtrlA() {
    this.checkClientIsNull();
    this.send({
      action: 5,
    });
  }

  sendInputText(value: string) {
    this.checkClientIsNull();
    this.send({
      action: 2,
      value: value,
    });
  }

  sendInputChar(value: string) {
    this.checkClientIsNull();
    this.send({
      action: 3,
      value: value,
    });
  }

  //发送心跳包
  async startHeartBeat() {
    while (this.isConnected) {
      try {
        this.mWs.send("");
      } catch (e) {}
      await timeout(500);
    }
  }
  reStoreState() {
    if (this.mCurrentState == ScreenState.STREAM_TYPE_INITIATIVE) {
      this.startScreenStream(this.mSale, this.mQuality, this.mFps);
    } else if (this.mCurrentState == ScreenState.STREAM_TYPE_PASSIVE) {
      this.startScreenStreamByPassive(this.mSale, this.mQuality, this.mFps);
    }
  }
  async retry() {
    if (this.isRetury) return;
    this.isRetury = true;
    for (let i = 0; i < this.mRetryNumber; i++) {
      console.log(`意外断开，正在进行第${i}次重试`);
      this.mWs.distory();
      this.setWebSocktClient(this.mWs);
      try {
        await this.waitForConnect();
        console.log("重连成功");
        this.isRetury = false;
        this.reStoreState();
        return;
      } catch (e) {
        continue;
      }
    }
    console.log("重试失败，将进行销毁");
    this.destory();
  }

  onclose() {
    console.log("websocket 关闭");
  }

  onerror(err: Error) {
    this.onError("websocket 出错：" + err.message);
    console.log("websocket 出错", err);
    this.retry();
  }

  addScreenOrentationChangeListener(func: ScreenOrentationChangeCallback) {
    this.mOrentationChangeListenr = func;
  }

  addNotificationChangeListener(func: NotificationChangeCallback) {
    this.mNotificationChangeListenr = func;
  }

  addScreenChangeListener(func: ScreenChangeCallback) {
    this.mScreenChangeListenr = func;
  }

  addClipTextChangeListener(func: ClipTextChangeCallback) {
    this.mClipTextChangeListenr = func;
  }

  onmessage(event: MessageEvent) {
    if (typeof event.data == "string") {
      let { action, value } = JSON.parse(event.data);
      switch (action) {
        case 1:
          // console.log("屏幕方向发生改变,当前方向:" + value);
          let screenInfo = new ScreenInfo(value);
          this.onScreenOrentationChange(screenInfo);
          break;
        case 2:
          this.onNotificationChange(value as INotificationMessage);
          break;
        case 3:
          this.onClipTextChange(value as string);
          break;
      }
    } else {
      this.isPassiveReceive = true;
      this.onScreenChange(event.data);
    }
  }
  private onNotificationChange(message: INotificationMessage) {
    if (this.mNotificationChangeListenr) {
      this.mNotificationChangeListenr(message);
    }
  }

  private onClipTextChange(message: string) {
    if (this.mClipTextChangeListenr) {
      this.mClipTextChangeListenr(message);
    }
  }

  private onScreenOrentationChange(screenInfo: ScreenInfo) {
    if (this.mOrentationChangeListenr) {
      this.mOrentationChangeListenr(
        screenInfo.width,
        screenInfo.height,
        screenInfo.rotation,
        screenInfo.isLandscape()
      );
    }
  }

  private onScreenChange(imageData) {
    if (this.mScreenChangeListenr) {
      if (imageData instanceof ArrayBuffer) {
        try {
          imageData = new Blob([imageData]);
        } catch (e) {}
      }
      this.mScreenChangeListenr(imageData);
    }
  }

  onopen() {
    this.isConnected = true;
    this.startHeartBeat();
  }

  destory() {
    this.isRetury = false;
    this.isConnected = false;
    this.mOrentationChangeListenr = null;
    this.mScreenChangeListenr = null;
    this.mNotificationChangeListenr = null;
    this.mCurrentState = ScreenState.STREAM_TYPE_STOP;
    if (this.mWs) {
      try {
        this.mWs.distory();
      } catch (e) {}
    }
  }
}

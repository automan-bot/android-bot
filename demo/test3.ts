import {
  AdbDevice,
  Device,
  NodeWebSocket,
  getDevicesList,
  getPackageList,
} from "../src/androidbot";

async function main2() {
  let device = new Device("192.168.7.120:18080");
  device.setWebSocketClient(new NodeWebSocket());
  let mScreenControl = device.mScreenControl;
  mScreenControl.addScreenOrentationChangeListener(function (
    width,
    height,
    rotation,
    isLandscape
  ) {
    console.log(
      "屏幕发生改变:" +
        `宽度：${width},高度：${height},是否横屏:${isLandscape},方向:${rotation}`
    );
  });

  mScreenControl.addScreenChangeListener(function (img) {
    console.log(img);
  });
  mScreenControl.addCloseListener(function (e) {
    console.log("异常断开");
  });
  mScreenControl.startScreenStreamByPassive(0.5, 50, 50);
}
main2();

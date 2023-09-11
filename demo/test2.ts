import { NotificationChangeCallback } from "./../src/Model/GlobalModel";
import { Device, NodeWebSocket } from "../src/androidbot";
async function main() {
  const device = new Device("192.168.7.119:18080");
  device.setWebSocketClient(new NodeWebSocket());
  device.mScreenControl.addScreenChangeListener(function (screenImg) {
    console.log("接收到新的屏幕图像：", screenImg);
  });
  device.mScreenControl.addNotificationChangeListener(function (
    notificationMessage
  ) {
    console.log("接收到新的通知：", notificationMessage);
  });
  device.mScreenControl.addClipTextChangeListener(function (text) {
    console.log("接收到粘贴板发生改变通知：", text);
  });
  // device.mScreenControl.startScreenStreamByPassive();
  device.mScreenControl.startScreenStream();

  device.addErrorListener(function (e) {
    console.log("错误信息", e);
  });
}

main();

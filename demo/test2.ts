import { NotificationChangeCallback } from "./../src/Model/GlobalModel";
import { Device, NodeWebSocket } from "../src/androidbot";
import FormData from "form-data";
import fs from "fs";
async function main() {
  const device = new Device("127.0.0.1:2033");
  /*  device.setWebSocketClient(new NodeWebSocket());
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
  }); */
  let formData = new FormData();
  formData.append("path", "/sdcard/Download/");
  formData.append(
    "file",
    fs.createReadStream("C:\\Users\\ZhaoYu\\Downloads\\nemu-cloner.apk")
  );
  const result_path = await device.upload(formData, {
    headers: formData.getHeaders(),
  });
}

main();

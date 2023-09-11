import { AdbDevice, NodeWebSocket } from "../src/androidbot";
import FormData from "form-data";
import fs from "fs";
async function main() {
  const devices = await AdbDevice.listWifiDevices();
  if (devices[0]) {
    let device = devices[0];
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
    /* mScreenControl.addScreenChangeListener(function (img) {
      console.log(img);
    });
    mScreenControl.startScreenStreamByPassive(); */
    /* let promise = await device.screenShot();
    console.log(promise);
    let formData = new FormData();
    formData.append(
      "file",
      fs.createReadStream("C:\\Users\\ZhaoYu\\Downloads\\release-linux-x64.zip")
    );
    const result_path = await device.upload(formData, {
      headers: formData.getHeaders(),
    });
    console.log(result_path); */
    /*let promise = await device.screenInfo();
        let b = await device.hello();
        let s = await device.version();
        let iScreenInfo = await device.screenInfo();
        let iDeviceInfo = await device.getSystemInfo();
        let iuiObject = await device.screenJson();
        let s1 = await device.screenXml();
        let s2 = await device.screenShotBase64();
        let screenRotation = await device.screenRotation();
        let iContacts = await device.getAllContact();
        let number = await device.deleteContact("13312341234");
        let number2 = await device.inputText("13312341234");*/
  }
  // console.log(devices)
}

main();

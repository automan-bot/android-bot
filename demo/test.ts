import {
  AdbDevice,
  NodeWebSocket,
  getDevicesList,
  getPackageList,
} from "../src/androidbot";

async function main2() {
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
    await device.execScript("console.show(true);console.log(`hello world`)");
    await device.stopAllScript();
    /*     await device.click(500, 500);
    await device.longClick(0.5, 0.5);
    await device.press(0.7, 0.7, 1000);
    await device.swipe(0.6, 0.2, 0.8, 0.8, 1000); */
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
async function main() {
  const list = await getDevicesList();
  const pslist = await getPackageList(list[0]);
  console.log(pslist);
}
main();

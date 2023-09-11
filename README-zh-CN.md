# 翻译

[中文](./README-zh-CN.md) | [英文-GPT](./README.md)

# android-bot

android-bot 是基于 AutoBot 得 JavaScript SDK，同时支持 浏览器环境 和 Node 环境，Node 环境下，支持自动扫描局域网客户端

[NPM](https://www.npmjs.com/package/android-bot)| [Github](https://github.com/automan-bot/android-bot)| [AutoBot 文档](https://doc.tntok.top)

### 目前已经实现了什么功能 API？

- 获取系统信息（型号信息，硬件信息...）
- 屏幕图像（支持 jpg，base64，支持 websocket 实时输出）
- 触控输入（单指手势，多指手势，支持 websocket 实时输入）
- 按键输入（按键模拟，文字输入，支持中文）
- 屏幕布局（支持 XML，JSON）
- 文件管理（上传，查询，删除）
- 剪切板管理（读取和修改）
- 应用管理（安装，卸载，清除数据，启动停止，详情查看）
- 联系人管理 (增删改查)
- 录制屏幕，熄屏控制，播放音乐，短信查询等
- 通知监听，剪切板监听等

### 它可以用来干什么？

- 局域网内无线投屏/实时控制,按键模拟，录制屏幕，布局分析，文件管理，应用管理，通讯录管理
- 通过 NodeJS，Python，Java，C++等语言，只需要调用 Http Api，即可开发譬如：远程投屏控制，自动化测试，自动化运营、批量处理、机器人、自动回复等等

### 支持浏览器和 NodeJS 环境

在 Node 环境下，支持局域网的网络发现，能自动扫描同个局域网下的设备，
在浏览器环境下，则需要获取设备的 ip 和端口，手动连接

## 使用方法

### 准备工作

需要设备安装 AutoBot APP，且成功运行服务，具体可以参考[AutoBot 官网](http://doc.tntok.top)->准备工作部分

重要的事情说三遍：

- 此库是基于 AutoBot 官方 Http API 和 WebSocket API 封装，请你务必先仔细阅读[AutoBot 文档](http://doc.tntok.top)
- 此库是基于 AutoBot 官方 Http API 和 WebSocket API 封装，请你务必先仔细阅读[AutoBot 文档](http://doc.tntok.top)
- 此库是基于 AutoBot 官方 Http API 和 WebSocket API 封装，请你务必先仔细阅读[AutoBot 文档](http://doc.tntok.top)

### 安装支持库

```
npm i android-bot -s
```

### 浏览器内使用

- 浏览器环境下由于不支持 udp，需要主动创建设备

```javascript
//引入库
import { BrowserWebSocket, Device } from "android-bot";

async function main() {
  //创建一个设备，设备的ip和端口来源于AutoBot APP，此处需要修改为你自己设备的ip和端口
  const device = new Device("192.168.1.100:18080");
  //获取屏幕信息
  let iScreenInfo = await device.screenInfo();
  //获取屏幕截图
  let screenImg = await device.screenShot();
  //获取系统信息
  let iDeviceInfo = await device.getSystemInfo();
  //获取屏幕ui布局的JSON格式
  let iuiObjectJSON = await device.screenJson();
  //获取屏幕ui布局的XML格式，可以使用
  let iuiObjectXML = await device.screenXml();
  //手势滑动（左滑）
  await device.gesture({
    duration: 200,
    points: [
      { x: 168, y: 558 },
      { x: 172, y: 562 },
      { x: 276, y: 562 },
      { x: 306, y: 560 },
      { x: 348, y: 552 },
      { x: 390, y: 548 },
      { x: 442, y: 540 },
      { x: 470, y: 540 },
      { x: 500, y: 538 },
      { x: 520, y: 538 },
      { x: 548, y: 538 },
      { x: 566, y: 538 },
      { x: 596, y: 540 },
    ],
  });
  //....
}

main();
```

### Node 使用

- Node 环境下，可以使用 AdbDevice 扫描局域网内的设备

```javascript
import { AdbDevice, NodeWebSocket, Device } from "android-bot";
import FormData from "form-data";
import fs from "fs";
async function main() {
  //node环境下可以自动扫描局域网内的设备
  const devices = await AdbDevice.listWifiDevices();
  if (devices[0]) {
    let device = devices[0];
    //使用Node环境下的websocket client
    device.setWebSocketClient(new NodeWebSocket());
    let mScreenControl = device.mScreenControl;
    //监听屏幕方向发生改变的消息
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
    //获取屏幕截图
    let screenImg = await device.screenShot();
    //获取系统信息
    let iDeviceInfo = await device.getSystemInfo();
    //获取屏幕ui布局的JSON格式
    let iuiObject = await device.screenJson();
  }
}

main();
```

### 实时屏幕图像

```javascript
//引入库
import { BrowserWebSocket, Device } from "android-bot";

async function main() {
  //创建一个设备，设备的 ip 和端口来源于 AutoBot APP
  const device = new Device("192.168.7.119:18080");

  //如果你需要实时；投屏控制（实时屏幕 jpg 图像流，实时触摸文本输入），通知监听，剪切板监听
  //那么你需要设置 websocket client，Node 环境下使用 NodeWebSocket，浏览器环境下你需要使用 BrowserWebSocket
  //mScreenControl 为实时信息的代理对象，你可以用来监听屏幕图像，通知，剪切版信息
  device.setWebSocketClient(new BrowserWebSocket());

  //接收到新的通知信息
  device.mScreenControl.addNotificationChangeListener(function (
    notificationMessage
  ) {
    console.log("接收到新的通知：", notificationMessage);
  });

  //接收到剪切板发生改变的信息
  device.mScreenControl.addClipTextChangeListener(function (text) {
    console.log("接收到粘贴板发生改变通知：", text);
  });

  //实时的屏幕图像回调，注意浏览器环境下 img 为 Blob，Node 环境下为 arrayBuffer
  device.mScreenControl.addScreenChangeListener(function (screenImg) {
    console.log("接收到新的屏幕图像：", screenImg);
  });

  //弱网环境下使用被动式屏幕帧，网络好的情况下可以使用主动式获取屏幕图像帧；
  //只有调用了下边2种方法，屏幕图像的回调才能收到消息
  //device.mScreenControl.startScreenStream();//主动式
  device.mScreenControl.startScreenStreamByPassive(); //被动式
}

main();
```

## 核心类

### Device

| function               | 含义                                   | 备注                                                                                                                    |
| ---------------------- | -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| addErrorListener       | 添加全局错误监听                       |
| setWebSocketClient     | 设置 websocket client                  | Node 环境下使用 NodeWebSocket，浏览器环境下你需要使用 BrowserWebSocket                                                  |
| hello                  | 欢迎信息                               |
| version                | 获取核心库版本                         |
| checkNotification      | 检查此设备是否能监听通知               | 监听通知需要 android 系统版本>=android9                                                                                 |
| getActiveInfo          | 获取设备的激活信息                     |                                                                                                                         |
| getDeviceId            | 获取设备的 DeviceId                    | 此 Id 有 AutoBot 生成，非 andorid id                                                                                    |
| startRecoreScreen      | 启动屏幕录像                           |
| stopRecoreScreen       | 停止屏幕录像                           |
| getSystemInfo          | 获取系统信息                           |
| screenInfo             | 屏幕信息                               |
| screenJson             | 屏幕 UI 布局的 json 格式               |
| screenXml              | 屏幕 Ui 布局的 XML 格式                |
| screenShotBase64       | 屏幕截图的 jpeg base64 格式            |
| screenShot             | 屏幕截图 jpeg 二进制                   |
| screenRotation         | 屏幕旋转方向                           |
| getAllContact          | 获取所有的联系人                       |
| insertContact          | 插入新的联系人                         |
| deleteContact          | 删除联系人                             |
| getClipText            | 获取粘贴板数据                         |
| turnScreenOff          | 开启熄屏控制模式                       |
| getIp                  | 获取设备的可用 IP                      |
| getAllSms              | 获取所有的短信，支持获取指定号码的短信 |
| deleteSms              | ~~删除短信~~                           | 此方法已弃用 ，由于 android 设备安全限制，请到短信应用删除短信                                                          |
| getTopActivity         | 获取设备顶层的活动 Activity 信息       |
| getStartActivity       | 根据包名获取启动类                     | 不传获取顶层 activity 的启动 activity 信息                                                                              |
| startPackage           | 根据包名启动应用                       |
| stopPackage            | 根据包名停止应用                       |
| clearPackage           | 根据包名清除应用数据                   |
| getAllPackage          | 获取设备应用所有应用列表               |
| getPackageInfo         | 根据包名获取详细的应用信息             |
| cancelAllNotifications | ~~移除所有的通知 ~~                    | 此方法已弃用                                                                                                            |
| callPhone              | 拨打电话                               |
| endCall                | 挂断电话                               |
| inputText              | 输入字符串，支持多种语言               |
| inputChar              | 输入字符仅支持 ACSII 码                |
| execCmd                | 执行 shell 命令                        |
| pressKeyCode           | 模拟按键                               | 查询对应的 keyCode 可以参考 adb 用法文档,也可以参考 android sdk 的 KeyEvent.java 类                                     |
| gesture                | 单指手势                               |
| gestures               | 多指手势                               |
| listFile               | 列出文件夹                             |
| upload                 | 上传一个文件                           |                                                                                                                         |
| uploadUrl              | 获取上传文件得 url                     | 需要构建一个 FormData 对象，file 为 file 对象，path 为要上传到得文件夹                                                  |
| delFile                | 删除一个文件或文件夹                   | 传入一个路径，文件夹：/sdcard/tmp，文件/sdcard/hello.txt                                                                |
| downloadUrl            | 获取一个文件得下载路径                 | 传入一个路径，获取下载链接，浏览器环境你可以直接打开这个链接进行下载，node 环境下你可以使用 download 库或其他一些下载库 |
| getDisplayName         | 获取设置的自定义设备名称               |
| setDisplayName         | 设置的自定义设备名称                   |
| playMusic              | 播放网络音乐                           | 传入一个音乐的 url 实现自定义播放网络音乐 ，此接口需要 android 版本>=9.0                                                |
| stopMusic              | 停止播放网络音乐                       | 停止正在播放的网络音乐 ，此接口需要 android 版本>=9.0                                                                   |
| exit                   | 停止 AutoBot 服务端                    | 注意，停止后你将无法调用任何接口，你需要重新在 AutoBot 端激活服务端                                                     |

### ScreenControl

| function                          | 含义                                                                             | 备注                                                                                                                                   |
| --------------------------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| startScreenStream                 | 通知服务端主动推送屏幕图像                                                       |
| startScreenStreamByPassive        | 被动式通知服务端推送屏幕图像                                                     | 弱网环境下，主动式推送屏幕图像会有较大的延迟，被动式会在接受到屏幕图像后，发送消息通知服务端传输新的屏幕图像，因此获取的屏幕图像更及时 |
| setScreenStreamConfig             | 设置屏幕图像的帧率，缩放和压缩比                                                 | 注意这里的 fps 为延迟多少 ms（毫秒）收取新的屏幕图像                                                                                   |
| stopScreenStream                  | 停止屏幕图像推送                                                                 |
| pressKeyCode                      | 模拟按键                                                                         | 和 Device 的 pressKeyCode 参数一致，不一样的是这里通过 websocket 发送数据，因此实时性更高                                              |
| sendSpaceKey                      | 发送空格按键                                                                     |                                                                                                                                        |
| sendBackSpaceKey                  | 发送退格按键                                                                     |                                                                                                                                        |
| sendInputText                     | 输入字符串，支持多种语言                                                         |                                                                                                                                        |
| sendInputChar                     | 输入字符仅支持 ACSII 码 ，按键模拟方式实现，支持屏幕密码解锁，支付密码输入等场景 |                                                                                                                                        |
| addScreenOrentationChangeListener | 添加屏幕方向发生改变的监听                                                       | 此通知会在初次链连接成功后就通知一次，方便你为渲染做好准备                                                                             |
| addNotificationChangeListener     | 添加通知消息发生改变的监听                                                       |                                                                                                                                        |
| addScreenChangeListener           | 添加屏幕图像的监听                                                               | 当你调用主动式（startScreenStream）或者被动式（startScreenStreamByPassive）通知服务端传输屏幕图像后，此监听才有数据返回                |
| addClipTextChangeListener         | 添加粘贴板发生改变的监听                                                         |                                                                                                                                        |

## FAQ

### 我使用了实例代码，为什么代码报错？

由于 Node 环境默认是不支持 websocket 的，需要通过第三方库来实现 WebSocket，因此 Node 环境下的 WebSocket 和浏览器环境下的 WebSocket 有少许不一样

- 因此，如果你的代码在浏览器环境运行请导入 BrowserWebSocket，在 Node 环境下请导入 NodeWebSocket，另外请一定不要导入多余的对象，比如在浏览器环境下错误的导入了 AdbDevice，NodeWebSocket

- Node 导入示例

```javascript
import { AdbDevice, NodeWebSocket, Device } from "android-bot";
```

- 浏览器导入示例

```javascript
import { BrowserWebSocket, Device } from "android-bot";
```

### 有些方法的参数我还是有疑问？

`android-bot`是对 AutoBot 的 Http API 和 WebSocket API 的封装，你可以查看对应的[AutoBot 官](http://doc.tntok.top)

## 二次开发

### 获取代码

```shell
git clone https://github.com/automan-bot/android-bot.git
npm i
```

### NPM scripts

- `demo_browser`:运行浏览器 demo
- `demo_node`:运行 Node 环境下 demo
- `dev`: 以监听模式监听 src/的文件改变，在 dist 下生成新的 Node 环境编译包
- `dev:browser`:以监听模式监听 src/的文件改变，在 dist 下生成浏览器环境编译包
- `build `: 编译生成 Node 环境和浏览器环境的编译包
- `clean `: 清空/dist 目录

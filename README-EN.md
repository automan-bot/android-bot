# Translation

[中文](./README.md) | [English-GPT](https://github.com/automan-bot/android-bot/blob/master/README-EN.md)

# android-bot

android-bot is a JavaScript SDK based on AutoBot. It supports both browser and Node.js environments. In Node.js, it can automatically scan LAN clients.

[NPM Homepage](https://www.npmjs.com/package/android-bot)| [Github Homepage](https://github.com/automan-bot/android-bot)| [AutoBot Documentation](https://mobile.tntok.top/autobot_doc)

### What functionality APIs have been implemented so far?

- Retrieve system information (model information, hardware information...)
- Screen images (support jpg, base64, and real-time output via WebSocket)
- Touch input (single-finger gestures, multi-finger gestures, real-time input via WebSocket)
- Key input (key simulation, text input, supports Chinese)
- Screen layout (support XML, JSON)
- File management (upload, query, delete)
- Clipboard management (read and modify)
- App management (install, uninstall, clear data, start/stop, view details)
- Contact management (add, delete, update, query)
- Screen recording, screen control, music playback, SMS query, and more
- Notification monitoring, clipboard monitoring, and more

### Success Stories

- [Tntok Screen Casting (A Screen Casting Tool That Can Be Used Without adb)](https://www.tntok.top)

### Related Cases

- [AutoJS PC Version (One-click Automation to Generate autox.js Code)](https://mobile.tntok.top/autojs)
- [Autox.js - Integrated autobot Version (Automation Without Accessibility Services)](https://github.com/automan-bot/AutoX)

### What can it be used for?

- Wireless screen projection/real-time control within the LAN, key simulation, screen recording, layout analysis, file management, app management, contact management
- Using languages like Node.js, Python, Java, C++, etc., you can develop remote screen control, automation testing, automation operations, batch processing, robots, automatic replies, and more, simply by calling the HTTP API.

### Supports Browser and Node.js Environments

In the Node.js environment, it supports LAN network discovery and can automatically scan devices on the same LAN. In a browser environment, you need to manually connect by obtaining the device's IP and port.

## Usage

### Preparation

You need to have the AutoBot app installed on your device and successfully running the service. For specific instructions, please refer to the [AutoBot official website](https://mobile.tntok.top/autobot_doc) -> Preparation section.

Important:

- This library is based on the official HTTP API and WebSocket API of AutoBot. Please read the [AutoBot documentation](https://mobile.tntok.top/autobot_doc) carefully.
- This library is based on the official HTTP API and WebSocket API of AutoBot. Please read the [AutoBot documentation](https://mobile.tntok.top/autobot_doc) carefully.
- This library is based on the official HTTP API and WebSocket API of AutoBot. Please read the [AutoBot documentation](https://mobile.tntok.top/autobot_doc) carefully.

### Installing the Supporting Library

```
npm i android-bot -s
```

### Using in a Browser

- In a browser environment, since UDP is not supported, you need to create a device actively.

```javascript
// Import the library
import { BrowserWebSocket, Device } from "android-bot";

async function main() {
  // Create a device; the IP and port of the device come from the AutoBot app. You should modify them to match your own device's IP and port.
  const device = new Device("192.168.1.100:18080");
  // Get screen information
  let iScreenInfo = await device.screenInfo();
  // Get a screen capture
  let screenImg = await device.screenShot();
  // Get system information
  let iDeviceInfo = await device.getSystemInfo();
  // Get the screen UI layout in JSON format
  let iuiObjectJSON = await device.screenJson();
  // Get the screen UI layout in XML format
  let iuiObjectXML = await device.screenXml();
  // Perform a swipe gesture (left swipe)
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

### Using in Node.js

- In a Node.js environment, you can use AdbDevice to scan devices on the local network.

```javascript
import { AdbDevice, NodeWebSocket, Device } from "android-bot";
import FormData from "form-data";
import fs from "fs";

async function main() {
  // In a Node.js environment, you can automatically scan devices on the local network
  const devices = await AdbDevice.listWifiDevices();
  if (devices[0]) {
    let device = devices[0];
    // Use the WebSocket client in a Node.js environment
    device.setWebSocketClient(new NodeWebSocket());
    let mScreenControl = device.mScreenControl;
    // Listen for screen orientation change messages
    mScreenControl.addScreenOrentationChangeListener(function (
      width,
      height,
      rotation,
      isLandscape
    ) {
      console.log(
        "Screen changed: " +
          `Width: ${width}, Height: ${height}, Landscape: ${isLandscape}, Rotation: ${rotation}`
      );
    });
    // Get a screen capture
    let screenImg = await device.screenShot();
    // Get system information
    let iDeviceInfo = await device.getSystemInfo();
    // Get the screen UI layout in JSON format
    let iuiObject = await device.screenJson();
  }
}

main();
```

### Real-time Screen Images

```javascript
// Import the library
import { BrowserWebSocket, Device } from "android-bot";

async function main() {
  // Create a device; the device's IP and port come from the AutoBot app
  const device = new Device("192.168.7.119:18080");

  // If you need real-time screen casting control (real-time screen jpg image stream, real-time touch text input), notification monitoring, and clipboard monitoring,
  // you need to set up the WebSocket client. In a Node environment, use NodeWebSocket; in a browser environment, use BrowserWebSocket.
  // mScreenControl is the proxy object for real-time information, which you can use to listen for screen images, notifications, and clipboard information.
  device.setWebSocketClient(new BrowserWebSocket());

  // Receive new notification information
  device.mScreenControl.addNotificationChangeListener(function (
    notificationMessage
  ) {
    console.log("Received new notification:", notificationMessage);
  });

  // Receive clipboard change information
  device.mScreenControl.addClipTextChangeListener(function (text) {
    console.log("Received clipboard change notification:", text);
  });

  // Real-time screen image callback; note that in a browser environment, img is a Blob, while in a Node environment, it's an ArrayBuffer
  device.mScreenControl.addScreenChangeListener(function (screenImg) {
    console.log("Received new screen image:", screenImg);
  });

  // In weak network conditions, use passive screen frames. In good network conditions, you can use active screen image frame retrieval.
  // The screen image callback can only receive messages if one of the following two methods is called:
  // device.mScreenControl.startScreenStream(); // Active
  device.mScreenControl.startScreenStreamByPassive(); // Passive
}

main();
```

### [More Examples](https://github.com/automan-bot/android-bot/tree/master/demo)

## Core Classes

### Device

| Function               | Description                                             | Notes                                                                                                                                                                                                 |
| ---------------------- | ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| addErrorListener       | Add global error listener                               |
| setWebSocketClient     | Set websocket client                                    | Use NodeWebSocket in Node environment; use BrowserWebSocket in browser environment                                                                                                                    |
| hello                  | Welcome message                                         |
| version                | Get core library version                                |
| checkNotification      | Check if the device can listen to notifications         | Requires Android system version >= Android 9                                                                                                                                                          |
| getDeviceId            | Get DeviceId                                            | This Id is generated by AutoBot, not the Android id                                                                                                                                                   |
| startRecordScreen      | Start screen recording                                  |
| stopRecordScreen       | Stop screen recording                                   |
| getSystemInfo          | Get system information                                  |
| screenInfo             | Screen information                                      |
| screenJson             | Screen UI layout in JSON format                         |
| screenXml              | Screen UI layout in XML format                          |
| screenShotBase64       | Screenshot in jpeg base64 format                        |
| screenShot             | Screenshot in jpeg binary format                        |
| screenRotation         | Screen rotation direction                               |
| getAllContact          | Get all contacts                                        |
| insertContact          | Insert a new contact                                    |
| deleteContact          | Delete a contact                                        |
| getClipText            | Get clipboard data                                      |
| setClipText            | Set clipboard data                                      |
| clearText              | Clear input field data                                  | Requires the input field to be focused, similar to ctrl+A and then performing delete                                                                                                                  |
| turnScreenOff          | Enable screen off control mode                          |
| getIp                  | Get all IPs of the device                               |
| getAllSms              | Get all SMS, supports fetching SMS of specified numbers |
| deleteSms              | ~~Delete SMS~~                                          | This method is deprecated due to Android device security restrictions. Please delete SMS in the messaging app                                                                                         |
| getTopActivity         | Get the top activity information                        |
| getStartActivity       | Get the startup class by package name                   | If not passed, retrieves the startup activity information of the top activity                                                                                                                         |
| startPackage           | Start an app by package name                            |
| stopPackage            | Stop an app by package name                             |
| clearPackage           | Clear app data by package name                          |
| getAllPackage          | Get a list of all apps on the device                    |
| getPackageInfo         | Get detailed app information by package name            |
| cancelAllNotifications | ~~Remove all notifications~~                            | This method is deprecated                                                                                                                                                                             |
| callPhone              | Make a phone call                                       |
| endCall                | End a phone call                                        |
| inputText              | Input a string, supports multiple languages             |
| inputChar              | Input characters, supports only ASCII codes             |
| execCmd                | Execute shell command                                   |
| pressKeyCode           | Simulate key press                                      | Refer to adb usage documentation for corresponding keyCode, or refer to android sdk's KeyEvent.java class                                                                                             |
| click                  | Click                                                   | Supports percentage coordinates and absolute coordinates                                                                                                                                              |
| longClick              | Long press                                              | Supports percentage coordinates and absolute coordinates                                                                                                                                              |
| press                  | Long press for x milliseconds                           | Supports percentage coordinates and absolute coordinates                                                                                                                                              |
| swipe                  | Swipe                                                   | Supports percentage coordinates and absolute coordinates                                                                                                                                              |
| gesture                | Single-finger gesture                                   |
| gestures               | Multi-finger gestures                                   |
| listFile               | List directory                                          |
| turnSafeModeOn         | Enable safe mode                                        | In safe mode, screen layout cannot be obtained, text search, selector search are unavailable, and websocket notifications will not be sent                                                            |
| turnSafeModeOff        | Disable safe mode                                       |
| isSafeMode             | Check if safe mode is enabled                           |
| upload                 | Upload a file                                           |
| uploadUrl              | Get file upload URL                                     | Requires constructing a FormData object, with file as the file object, and path as the target upload folder                                                                                           |
| delFile                | Delete a file or folder                                 | Pass a path, folder: /sdcard/tmp, file: /sdcard/hello.txt                                                                                                                                             |
| downloadUrl            | Get file download URL                                   | Pass a path to get the download link. In the browser environment, you can directly open this link for download. In the Node environment, you can use the download library or other download libraries |
| getDisplayName         | Get the custom device name                              |
| setDisplayName         | Set the custom device name                              |
| playMusic              | Play online music                                       | Pass a music URL to play custom online music. Requires Android version >= 9.0                                                                                                                         |
| stopMusic              | Stop playing online music                               | Stops currently playing online music. Requires Android version >= 9.0                                                                                                                                 |
| execScript             | Execute autox.js script                                 | Note that this function requires installing an autobot with an autox execution environment; otherwise, it will not run                                                                                |
| stopAllScript          | Stop all autox.js scripts                               | Note that this function requires installing an autobot with an autox execution environment; otherwise, it will not run                                                                                |
| exit                   | Stop AutoBot server                                     | Note that after stopping, you will not be able to call any interfaces. You need to reactivate the server on the AutoBot end                                                                           |

### ScreenControl

| Function                          | Description                                                                                                                                                  | Notes                                                                                                                                                                                                                                                    |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| startScreenStream                 | Notify the server to actively push screen images                                                                                                             |
| startScreenStreamByPassive        | Passive notification to the server to push screen images                                                                                                     | In a weak network environment, actively pushing screen images may have a significant delay, while passive notification will send a message to the server to transmit new screen images upon receiving them, so you can get the screen image more timely. |
| setScreenStreamConfig             | Set the frame rate, scale, and compression ratio of screen images                                                                                            | Note that the fps here is how long (in milliseconds) to wait before collecting new screen images.                                                                                                                                                        |
| stopScreenStream                  | Stop screen image push                                                                                                                                       |
| pressKeyCode                      | Simulate key presses                                                                                                                                         | The parameters are the same as pressKeyCode in Device, but here the data is sent via WebSocket, so it is more real-time.                                                                                                                                 |
| sendSpaceKey                      | Send the space key                                                                                                                                           |                                                                                                                                                                                                                                                          |
| sendBackSpaceKey                  | Send the backspace key                                                                                                                                       |                                                                                                                                                                                                                                                          |
| sendInputText                     | Input a string; supports multiple languages                                                                                                                  |                                                                                                                                                                                                                                                          |
| sendInputChar                     | Input a character, only supports ASCII codes; implemented as key simulation, supports screen password unlocking, payment password input, and other scenarios |                                                                                                                                                                                                                                                          |
| addScreenOrentationChangeListener | Add a listener for changes in screen orientation                                                                                                             | This notification is sent once after the initial connection is successful, to help you prepare for rendering.                                                                                                                                            |
| addNotificationChangeListener     | Add a listener for changes in notification messages                                                                                                          |                                                                                                                                                                                                                                                          |
| addScreenChangeListener           | Add a listener for screen image changes                                                                                                                      | This listener returns data only when you call active (startScreenStream) or passive (startScreenStreamByPassive) notification to the server to transmit screen images.                                                                                   |
| addClipTextChangeListener         | Add a listener for changes in the clipboard                                                                                                                  |                                                                                                                                                                                                                                                          |

## FAQ

### Why is the code reporting errors when I use the example code?

The Node.js environment does not natively support WebSocket and requires a third-party library to implement WebSocket functionality. Therefore, WebSocket in the Node.js environment differs slightly from WebSocket in the browser environment.

- So, if your code runs in a browser environment, please import BrowserWebSocket. In the Node.js environment, please import NodeWebSocket. Also, be sure not to import unnecessary objects. For example, if you incorrectly import AdbDevice or NodeWebSocket in a browser environment, it can lead to errors.

- Node.js import example:

```javascript
import { AdbDevice, NodeWebSocket, Device } from "android-bot";
```

- Browser import example:

```javascript
import { BrowserWebSocket, Device } from "android-bot";
```

### I still have questions about the parameters of some methods.

`android-bot` is a wrapper for the Http API and WebSocket API of AutoBot. You can refer to the corresponding [AutoBot documentation](https://mobile.tntok.top/autobot_doc).

## Custom Development

### Get the Code

```shell
git clone https://github.com/tntok/android-bot.git
npm i
```

### NPM scripts

- `demo_browser`: Run browser demo.
- `demo_node`: Run demo in the Node.js environment.
- `dev`: Watch for file changes in `src/`, generate new Node.js environment build in `dist` in a watch mode.
- `dev:browser`: Watch for file changes in `src/`, generate browser environment build in `dist` in a watch mode.
- `build`: Compile and generate builds for both Node.js and browser environments.
- `clean`: Empty the `/dist` directory.

### License

---

MIT License

---

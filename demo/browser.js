// import { BrowserWebSocket, Device } from "../dist/androidbot.browser";
import { BrowserWebSocket, Device } from "../src/browser";

let image = new Image();
let ctx = null;

function throttle(func, delay) {
  var timer = null;
  return function () {
    var context = this;
    var args = arguments;
    if (!timer) {
      timer = setTimeout(function () {
        func.apply(context, args);
        timer = null;
      }, delay);
    }
  };
}

function renderImage(imageData) {
  return new Promise((resolve, reject) => {
    if (imageData) {
      image.onload = function () {
        ctx.drawImage(image, 0, 0, ctx.canvas.width, ctx.canvas.height);
        resolve();
      };
      image.onerror = function (err) {
        reject(err);
      };
      image.src = imageData;
    } else {
      resolve();
    }
  });
}

let device;
let mScreenControl;

function connect() {
  let canvas = document.querySelector("#screen");
  let inputText = document.querySelector("#inputText");
  ctx = canvas.getContext("2d");
  canvas.width = 720;
  canvas.height = 1280;
  device = new Device("192.168.124.4:18080");
  let screenWidth;
  let screenHeight;
  function handleEvent(e) {
    if (e.offsetY < 0 || e.offsetX < 0) return;
    const domImg = canvas;
    let imgWidth = domImg.clientWidth;
    let imgHeight = domImg.clientHeight;
    let x1 = e.offsetX > imgWidth ? imgWidth : e.offsetX;
    let y1 = e.offsetY > imgHeight ? imgHeight : e.offsetY;
    /* let rX1 = screenWidth * (x1 / imgWidth);
    let rY1 = screenHeight * (y1 / imgHeight);
    rX1 = rX1 < 0 ? 0 : rX1;
    rY1 = rY1 < 0 ? 0 : rY1;
    if (rX1 == 0 || rY1 == 0) return;
    let x2 = parseInt(rX1);
    let y2 = parseInt(rY1); */
    let x2 = x1 / imgWidth;
    let y2 = y1 / imgHeight;
    return { x: x2, y: y2 };
  }

  device.setWebSocketClient(new BrowserWebSocket());
  mScreenControl = device.mScreenControl;

  mScreenControl.addScreenChangeListener(function (image) {
    var reader = new FileReader();
    reader.onload = function (evt) {
      if (evt.target.readyState == FileReader.DONE) {
        renderImage(evt.target.result);
      }
    };
    reader.readAsDataURL(image);
  });
  mScreenControl.addScreenOrentationChangeListener(function (
    width,
    height,
    rotation,
    isLandscape
  ) {
    screenWidth = width;
    screenHeight = height;
    if (isLandscape) {
      canvas.width = 1280;
      canvas.height = 720;
      canvas.classList.add("isLandscape");
    } else {
      canvas.width = 720;
      canvas.height = 1280;
      canvas.classList.remove("isLandscape");
    }
  });
  mScreenControl.startScreenStreamByPassive(1.0, 50, 50);

  inputText.addEventListener("compositionend", function (event) {
    mScreenControl.sendInputText(event.data);
    event.target.value = "";
  });
  inputText.addEventListener("input", function (event) {
    if (event.inputType == "insertText") {
      let value = event.data.trim();
      if (value) mScreenControl.sendInputChar(event.data);
      event.target.value = "";
    }
  });
  inputText.addEventListener("keydown", function (event) {
    switch (event.keyCode) {
      case 32:
        console.log("空格");
        //空格
        mScreenControl.sendSpaceKey();
        break;
      case 8:
        console.log("删除");
        //删除
        mScreenControl.sendBackSpaceKey();
        break;
    }
  });

  let isMouseDown = false;
  canvas.addEventListener("mousedown", function (e) {
    if (e.buttons == 1) {
      const result = handleEvent(e);
      if (result) {
        const { x, y } = result;
        mScreenControl.sendTouchDown(x, y);
      }
      isMouseDown = true;
    }
  });

  let lastPosition = {
    x: 0,
    y: 0,
  };
  const handleMove = function (e) {
    if (e.buttons == 1 && isMouseDown) {
      const result = handleEvent(e);
      if (result) {
        const { x, y } = result;
        lastPosition = result;
        mScreenControl.sendTouchMove(x, y);
      }
    }
  };
  const handleMove2 = throttle(handleMove, 5);

  canvas.addEventListener("mousemove", handleMove2);

  canvas.addEventListener("mouseup", function (e) {
    isMouseDown = false;
    const result = handleEvent(e);
    if (result) {
      const { x, y } = result;
      mScreenControl.sendTouchUp(x, y);
    }
    inputText.focus();
  });
  canvas.addEventListener("mouseout", function (e) {
    isMouseDown = false;
    const result = handleEvent(e) || lastPosition;
    if (result) {
      const { x, y } = result;
      mScreenControl.sendTouchUp(x, y);
    }
  });
}

async function closeConnect() {
  if (mScreenControl) {
    mScreenControl.stopScreenStream();
  }
}

window.onload = () => {
  window.connect = connect;
  window.closeConnect = closeConnect;
};

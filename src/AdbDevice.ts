import {
  activeWifiAdb,
  activeAutoBotServer,
  forward2PC,
  getDevicesList,
  getForwardList,
  getPort,
  removeForward,
  getForwardInfoByDeviceId,
  isInstallServer,
  ForwardInfo,
} from "src/utils/nodeUtils";
import Device from "./Device";
import { UdpScan } from "./core/UdpScan";
/* import { getDevicesList, getPort } from "./utils/nodeUtils";
import ServerApi from "./api/server";
import dgram from "dgram";
import { getNetworkInterface } from "./utils/netUtils"; */

class AdbDevice {
  adbId: string;
  url: string = "";
  constructor(adbId: string) {
    if (!adbId) {
      throw new Error("设备ID不能为空");
    }
    this.adbId = adbId;
  }
  static async listWifiDevices(scanCount = 3): Promise<Array<Device>> {
    const clients = await UdpScan.scanServer(scanCount);
    const devices = clients.map((client) => {
      return new Device(`${client.address}:${client.port}`);
    });
    return devices;
  }
  static listWifiDevicesAsync(
    listener: (device: Device) => void,
    scanCount = 3
  ): void {
    UdpScan.scanServerAsync(async (client) => {
      let device = new Device(`${client.address}:${client.port}`);
      await device.init();
      listener(device);
    }, scanCount);
  }
  static async listUsbDevices(): Promise<Array<Device>> {
    //获取所有的adb 设备
    const devices = await getDevicesList();
    //获取所有的端口转发信息
    const forwartList = await getForwardList();
    //获取所有已经转发设备的id
    const forwartIds = forwartList.map((item) => item.deviceId);
    //排除已有的转发设备,获取未转发的设备，进行转发
    const waitForwrtIds = devices.filter((item) => !forwartIds.includes(item));
    for (let wId of waitForwrtIds) {
      //获取一个可用的端口
      const newPort = await getPort(null);
      forward2PC(wId, newPort);
    }
    //重新获取所有的转发信息,返回所有的设备
    const forwartList2 = await getForwardList();
    const devices2 = forwartList2.map((item) => {
      return new Device(`127.0.0.1:${item.pcPort}}`);
    });
    return devices2;
  }
  static async activeAllServer(): Promise<void> {
    //获取所有的adb 设备
    const devices = await getDevicesList();
    for (let deviceId of devices) {
      try {
        await activeWifiAdb(deviceId);
        await activeAutoBotServer(deviceId);
      } catch (e) {}
    }
  }
}
export {
  AdbDevice,
  activeWifiAdb,
  activeAutoBotServer,
  forward2PC,
  getDevicesList,
  getForwardList,
  getPort,
  removeForward,
  getForwardInfoByDeviceId,
  isInstallServer,
  ForwardInfo,
};

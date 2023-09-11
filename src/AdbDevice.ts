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
    const scanServer = new UdpScan();
    const clients = await scanServer.scanServer(scanCount);
    const devices = clients.map((client) => {
      return new Device(`${client.address}:${client.port}`);
    });
    return devices;
  }
  static async listUsbDevices(): Promise<Array<Device>> {
    return null;
  }

  connect(url: string): Device {
    url = url || this.url;
    return new Device(url);
  }
}

export default AdbDevice;

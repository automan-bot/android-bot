import dgram from "dgram";
import { getNetworkInterface } from "../utils/netUtils";
import { getPort } from "../utils/nodeUtils";
import { timeout } from "../utils";

interface IClient {
  address: string;
  port: number;
}

export class UdpScan {
  static server: dgram.Socket = null;
  static port: number;
  static clients: IClient[] = [];
  private constructor() {}
  private static async createScanServer() {
    if (UdpScan.server != null) {
      return;
    }
    UdpScan.port = await getPort(null);
    const server = dgram.createSocket("udp4");
    UdpScan.server = server;
    server.on("error", (err) => {
      console.error(`server error:\n${err.stack}`);
      UdpScan.server = null;
      server.close();
    });
    server.on("listening", () => {
      const address = server.address();
      console.log(`UDP server listening on ${address.address}:${address.port}`);
    });
    server.on("message", (message, remote) => {
      UdpScan.clients.push({
        address: remote.address,
        port: remote.port,
      });
      console.log(
        `Received message from ${remote.address}:${remote.port}: ${message}`
      );
    });
    server.bind(UdpScan.port);
  }
  private static async waitForInitServer(waitSecond = 5) {
    let waitTime = waitSecond * 1000;
    let i = 0;
    while (true) {
      if (i > waitTime || UdpScan.server) {
        break;
      }
      await timeout(1000);
      i += 1000;
    }
    if (!UdpScan.server) {
      throw new Error("create server timeout");
    }
  }
  private static async sendBroadcast() {
    let ips = getNetworkInterface();
    const message = Buffer.from("Hello, clients!");
    for (let ip of ips) {
      UdpScan.server.send(
        message,
        0,
        message.length,
        18080,
        ip.broadcast,
        (err) => {
          if (err) {
            console.error("Error broadcasting message:", err);
          } else {
            console.log("Message broadcasted.");
          }
        }
      );
    }
  }
  public static async scanServer(scanCount: number = 3) {
    UdpScan.createScanServer();
    await UdpScan.waitForInitServer();
    UdpScan.clients = [];
    for (let i = 0; i < scanCount; i++) {
      await UdpScan.sendBroadcast();
      await timeout(3000);
    }
    const uniqueArray = UdpScan.clients.filter(
      (item, index, self) =>
        index ===
        self.findIndex(
          (t) => t.address === item.address && t.port === item.port
        )
    );
    UdpScan.clients = uniqueArray;
    return UdpScan.clients;
  }

  public static release() {
    if (UdpScan.server != null) {
      UdpScan.server.close();
    }
  }
}

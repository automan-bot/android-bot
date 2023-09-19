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
  clients: IClient[] = [];
  constructor() {
    this.createScanServer();
  }
  private async createScanServer() {
    if (UdpScan.server != null) {
      return;
    }
    UdpScan.port = await getPort(null);
    const server = dgram.createSocket("udp4");
    server.on("error", (err) => {
      console.error(`server error:\n${err.stack}`);
      UdpScan.server = null;
      server.close();
    });
    server.on("listening", () => {
      const address = server.address();
      console.log(`UDP server listening on ${address.address}:${address.port}`);
      UdpScan.server = server;
    });

    server.on("message", (message, remote) => {
      this.clients.push({
        address: remote.address,
        port: remote.port,
      });
      console.log(
        `Received message from ${remote.address}:${remote.port}: ${message}`
      );
    });
    server.bind(UdpScan.port);
  }
  private async waitForInitServer(waitSecond = 5) {
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
  private async sendBroadcast() {
    await this.waitForInitServer();
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
  public async scanServer(scanCount: number = 3) {
    this.clients = [];
    for (let i = 0; i < scanCount; i++) {
      await this.sendBroadcast();
      await timeout(3000);
    }
    const uniqueArray = this.clients.filter(
      (item, index, self) =>
        index ===
        self.findIndex(
          (t) => t.address === item.address && t.port === item.port
        )
    );
    this.clients = uniqueArray;
    return this.clients;
  }

  public release() {
    if (UdpScan.server != null) {
      UdpScan.server.close();
    }
  }
}

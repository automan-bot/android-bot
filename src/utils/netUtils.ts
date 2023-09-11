import os from "os";
export function getNetworkInterface() {
  const interfaces = os.networkInterfaces();
  const servers = [];
  for (let interfaceName in interfaces) {
    const iface = interfaces[interfaceName];
    for (let i = 0; i < iface.length; i++) {
      const { address, netmask, family } = iface[i];
      if (family === "IPv4" && !address.startsWith("127.")) {
        const broadcast = calculateBroadcastAddress(address, netmask);
        if (broadcast) {
          servers.push({
            broadcast,
            address,
            netmask,
          });
        }
      }
    }
  }
  return servers;
}

function calculateBroadcastAddress(ipAddress, subnetMask) {
  // 将IP地址和子网掩码转换为二进制
  const ipBinary = ipAddress
    .split(".")
    .map(Number)
    .reduce((acc, cur) => acc * 256 + cur);
  const subnetBinary = subnetMask
    .split(".")
    .map(Number)
    .reduce((acc, cur) => acc * 256 + cur);

  // 计算网络地址
  const networkBinary = ipBinary & subnetBinary;

  // 计算广播地址
  let broadcastBinary = networkBinary | ~subnetBinary;

  // 将二进制地址转换为IP地址格式
  const broadcastArray = [];
  for (let i = 0; i < 4; i++) {
    broadcastArray.unshift(broadcastBinary & 255);
    broadcastBinary = broadcastBinary >>> 8;
  }
  const broadcastAddress = broadcastArray.join(".");

  return broadcastAddress;
}

import { networkInterfaces } from "os";

export function getLocalIpAddress() {
  const nets = networkInterfaces();
  const results: { [key: string]: string[] } = {};

  for (const name of Object.keys(nets)) {
    const selectedNets = nets[name];
    if (selectedNets !== undefined) {
      for (const net of selectedNets) {
        if (net.family === "IPv4" && !net.internal) {
          if (!results[name]) {
            results[name] = [];
          }
          results[name].push(net.address);
        }
      }
    }
  }
  return results;
}

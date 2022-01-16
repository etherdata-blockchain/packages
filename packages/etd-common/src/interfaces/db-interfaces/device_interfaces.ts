import { ContainerInfo, ImageInfo } from "dockerode";
import { Web3DataInfo } from "../etd_interfaces";

interface Docker {
  images: ImageInfo[];
  containers: ContainerInfo[];
}

export interface DeviceDBInterface {
  isOnline?: boolean;
  lastSeen?: Date;
  name: string;
  user: string | null;
  adminVersion: string;
  data?: Web3DataInfo;
  docker?: Docker;
}

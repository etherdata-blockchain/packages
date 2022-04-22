import { ContainerInfo, ImageInfo } from "dockerode";
import { Web3DataInfoInterface } from "../etd_interfaces";

export interface ContainerInfoWithLog extends ContainerInfo {
  /**
   * Container's log. Might be undefined if container doesn't produce any log
   */
  logs?: string;
}

export interface DockerDataInterface {
  /**
   * Docker images' info
   */
  images: ImageInfo[];
  /**
   * Docker container's info
   */
  containers: ContainerInfoWithLog[];
}

export interface NetworkSettings {
  localIpAddress?: string;
  remoteIpAddress?: string;
}

export interface DeviceDBInterface {
  /**
   * Device's online status
   */
  isOnline?: boolean;
  /**
   * Last seen time. This will be set on server side.
   * DO NOT provide this field in your request, otherwise, it will be overwritten.
   */
  lastSeen?: Date;
  /**
   * Name of the device
   */
  name: string;
  /**
   * ID of the device
   */
  user: string | null;
  /**
   * Admin node's version
   */
  adminVersion: string;
  /**
   * Network info
   */
  networkSettings: NetworkSettings;
  /**
   * ETD Node's info
   */
  data?: Web3DataInfoInterface;
  /**
   * Device's docker info
   */
  docker?: DockerDataInterface;
}

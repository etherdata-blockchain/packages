import { DeviceRequest, MountConfig } from "dockerode";

/**
 * Stack to describe the structure of the container
 */
export interface ContainerStack {
  /**
   * Docker container's id. If this was sent by remote server used to create a new container,
   * then this field will be undefined
   */
  containerId?: string;
  /**
   * Docker container's name
   */
  containerName: string;
  /**
   * Related image
   */
  image: ImageStack;
  /**
   * Map of container's configuration. Similar to the docker's config
   */
  config?: DockerContainerConfig;
  /**
   * Log of container
   */
  runningLog?: string;
}

export interface ImageStack {
  /**
   * Image id. This field will be set during pulling. It will be undefined when receiving from the server.
   */
  imageId?: string;
  /**
   * Image name
   */
  image: string;
  /**
   * Image tag
   */
  tag: string;
}

interface HostConfig {
  AutoRemove?: boolean | undefined;
  Binds?: string[] | undefined;
  ContainerIDFile?: string | undefined;
  LogConfig?:
    | {
        Type: string;
        Config: any;
      }
    | undefined;
  NetworkMode?: string | undefined;
  PortBindings?: any;
  RestartPolicy?: any | undefined;
  VolumeDriver?: string | undefined;
  VolumesFrom?: any;
  Mounts?: MountConfig | undefined;
  CapAdd?: any;
  CapDrop?: any;
  Dns?: any[] | undefined;
  DnsOptions?: any[] | undefined;
  DnsSearch?: any[] | undefined;
  ExtraHosts?: any;
  GroupAdd?: string[] | undefined;
  IpcMode?: string | undefined;
  Cgroup?: string | undefined;
  Links?: any;
  OomScoreAdj?: number | undefined;
  PidMode?: string | undefined;
  Privileged?: boolean | undefined;
  PublishAllPorts?: boolean | undefined;
  ReadonlyRootfs?: boolean | undefined;
  SecurityOpt?: any;
  StorageOpt?: { [option: string]: string } | undefined;
  Tmpfs?: { [dir: string]: string } | undefined;
  UTSMode?: string | undefined;
  UsernsMode?: string | undefined;
  ShmSize?: number | undefined;
  Sysctls?: { [index: string]: string } | undefined;
  Runtime?: string | undefined;
  ConsoleSize?: number[] | undefined;
  Isolation?: string | undefined;
  MaskedPaths?: string[] | undefined;
  ReadonlyPaths?: string[] | undefined;
  CpuShares?: number | undefined;
  CgroupParent?: string | undefined;
  BlkioWeight?: number | undefined;
  BlkioWeightDevice?: any;
  BlkioDeviceReadBps?: any;
  BlkioDeviceWriteBps?: any;
  BlkioDeviceReadIOps?: any;
  BlkioDeviceWriteIOps?: any;
  CpuPeriod?: number | undefined;
  CpuQuota?: number | undefined;
  CpusetCpus?: string | undefined;
  CpusetMems?: string | undefined;
  Devices?: any;
  DeviceCgroupRules?: string[] | undefined;
  DeviceRequests?: DeviceRequest[] | undefined;
  DiskQuota?: number | undefined;
  KernelMemory?: number | undefined;
  Memory?: number | undefined;
  MemoryReservation?: number | undefined;
  MemorySwap?: number | undefined;
  MemorySwappiness?: number | undefined;
  OomKillDisable?: boolean | undefined;
  Init?: boolean | undefined;
  PidsLimit?: number | undefined;
  Ulimits?: any;
}

export interface DockerContainerConfig {
  Hostname?: string | undefined;
  Domainname?: string | undefined;
  User?: string | undefined;
  AttachStdin?: boolean | undefined;
  AttachStdout?: boolean | undefined;
  AttachStderr?: boolean | undefined;
  Tty?: boolean | undefined;
  OpenStdin?: boolean | undefined;
  StdinOnce?: boolean | undefined;
  Env?: string[] | undefined;
  Cmd?: string[] | undefined;
  Entrypoint?: string | string[] | undefined;
  Labels?: { [label: string]: string } | undefined;
  Volumes?: { [volume: string]: {} } | undefined;
  WorkingDir?: string | undefined;
  NetworkDisabled?: boolean | undefined;
  MacAddress?: boolean | undefined;
  ExposedPorts?: { [port: string]: {} } | undefined;
  StopSignal?: string | undefined;
  StopTimeout?: number | undefined;
  HostConfig?: HostConfig | undefined;
  NetworkingConfig?:
    | {
        EndpointsConfig?: any | undefined;
      }
    | undefined;
  abortSignal?: AbortSignal;
}

export interface UpdateTemplateDBInterface {
  name: string;
  /**
   * Update template's description
   */
  description: string;
  targetDeviceIds: string[];
  targetGroupIds: string[];
  /**
   * From client id.
   */
  from: string;
  imageStacks: ImageStack[];
  containerStacks: ContainerStack[];
}

interface UpdateImageStack {
  imageName: string;
  tags: { tag: string };
  /**
   * Image's object id
   */
  image: string;
  /**
   * Image tag's id
   */
  tag: string;
}

interface UpdateContainerStack {
  containerId?: string;
  containerName: string;
  image: UpdateImageStack;
  config?: DockerContainerConfig;
}

export interface UpdateTemplateWithDockerImageDBInterface {
  _id: string;
  name: string;
  description: string;
  targetDeviceIds: string[];
  targetGroupIds: string[];
  from: string;
  imageStacks: UpdateImageStack[];
  containerStacks: UpdateContainerStack[];
}

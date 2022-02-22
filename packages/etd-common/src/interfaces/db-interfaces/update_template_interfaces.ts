/**
 * Stack to describe the structure of the container
 */
export interface ContainerStack {
  containerId?: string;
  containerName: string;
  image: ImageStack;
  config?: DockerContainerConfig;
}

export interface ImageStack {
  imageId?: string;
  image: string;
  tag: string;
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
  HostConfig?: any | undefined;
  NetworkingConfig?:
    | {
        EndpointsConfig?: any | undefined;
      }
    | undefined;
  abortSignal?: AbortSignal;
}

export interface UpdateTemplateDBInterface {
  name: string;
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
  targetDeviceIds: string[];
  targetGroupIds: string[];
  from: string;
  imageStacks: UpdateImageStack[];
  containerStacks: UpdateContainerStack[];
}

import {
  ContainerStack,
  DockerContainerConfig,
  ImageStack,
} from "@etherdata-blockchain/docker-plan";

export interface UpdateTemplateDBInterface extends Document {
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

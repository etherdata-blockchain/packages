import { interfaces } from "@etherdata-blockchain/common";

type ContainerStack = interfaces.db.ContainerStack;

export class Container {
  /**
   * List of containers to be created
   */
  containers: ContainerStack[];

  private readonly originContainers: ContainerStack[];

  /**
   * List of containers to be removed
   */
  containersRemoved: ContainerStack[] = [];

  constructor(containers: ContainerStack[]) {
    this.containers = JSON.parse(JSON.stringify(containers));
    this.originContainers = JSON.parse(JSON.stringify(containers));
    this.containersRemoved = [];
  }

  /**
   * Update current container list
   * If there is an existing image, then remove the old one and update with the latest one
   * @param container
   */
  update(container: ContainerStack): void {
    const foundContainerIndex = this.containers.findIndex(
      (c) => c.containerName === container.containerName
    );
    if (foundContainerIndex > -1) {
      const foundInRemoved = this.containersRemoved.find(
        (c) => c.containerName === container.containerName
      );

      const inOriginContainer = this.originContainers.find(
        (c) => c.containerName === container.containerName
      );

      if (!foundInRemoved && inOriginContainer) {
        this.containersRemoved.push(this.containers[foundContainerIndex]);
      }
      this.containers[foundContainerIndex] = container;
    } else {
      const sameContainerName = this.containers.find(
        (c) => container.containerName === c.containerName
      );

      if (sameContainerName === undefined) {
        this.containers.push(container);
      }
    }
  }

  /**
   * Remove container from container stack
   * @param container
   */
  remove(container: ContainerStack): void {
    const index = this.containers.findIndex(
      (c) =>
        c.image.image === container.image.image &&
        c.image.tag === container.image.tag
    );
    if (index > -1) {
      this.containers.splice(index, 1);
      this.containersRemoved.push(container);
    } else {
      throw Error(`Container <${container.containerName}> not found`);
    }
  }
}

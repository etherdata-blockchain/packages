import Docker, { Image } from "dockerode";
import { ImageStack } from "../stack/image";
import { ContainerStack } from "../stack/container";

export default class DockerService {
  docker: Docker;

  constructor(docker?: Docker) {
    this.docker = docker ?? new Docker();
  }

  /**
   * Pull images
   * @param newImages a list of images
   * @param rollback is rollback
   */
  async pullImages(newImages: ImageStack[], rollback: boolean = false) {
    // eslint-disable-next-line no-console
    console.log(`Start images pulling process (Total: ${newImages.length})`);
    for (const nim of newImages) {
      try {
        const image: Image = await this.docker.pull(`${nim.image}:${nim.tag}`);
        nim.imageId = image.id;
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(
          `Cannot pull image ${nim.image} because ${e}. Rolling back.`
        );
        if (!rollback) {
          await this.removeImages(
            newImages.filter((i) => i.imageId !== undefined),
            true
          );
        }

        throw e;
      }
    }
  }

  /**
   * Remove list of images
   * @param removedImages a list of images
   * @param rollback is rollback?
   */
  // eslint-disable-next-line no-unused-vars
  async removeImages(removedImages: ImageStack[], rollback: boolean = false) {
    // eslint-disable-next-line no-console
    console.log(
      `Start images removal process (Total: ${removedImages.length})`
    );

    for (const rmi of removedImages) {
      try {
        const image = this.docker.getImage(`${rmi.image}:${rmi.tag}`);
        await image.remove();
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(`Cannot remove image ${rmi.image} because ${e}`);
        throw e;
      }
    }
  }

  /**
   * Remove list of containers
   * @param removeContainers
   * @param rollback is rollback?
   */
  async removeContainers(
    removeContainers: ContainerStack[],
    // eslint-disable-next-line no-unused-vars
    rollback: boolean = false
  ) {
    // eslint-disable-next-line no-console
    console.log(
      `Starting container removal process (Total: ${removeContainers.length})`
    );
    for (const rmc of removeContainers) {
      try {
        const container = this.docker.getContainer(rmc.containerId!);
        await container.remove({ force: true });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(
          `Cannot remove container ${rmc.containerName} because ${e}`
        );
        throw e;
      }
    }
  }

  /**
   * Create list of containers
   * @param newContainers a list of images
   * @param rollback is rollback?
   */
  async createContainers(
    newContainers: ContainerStack[],
    rollback: boolean = false
  ) {
    // eslint-disable-next-line no-console
    console.log(
      `Starting container creation process (Total: ${newContainers.length})`
    );

    for (const newContainer of newContainers) {
      try {
        const container = await this.docker.createContainer({
          name: newContainer.containerName,
          Image: `${newContainer.image.image}:${newContainer.image.tag}`,
          ...newContainer.config,
        });
        newContainer.containerId = container.id;
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(
          `Cannot remove container ${newContainer.containerName} because ${e}. Rolling back.`
        );
        if (!rollback) {
          await this.removeContainers(
            newContainers.filter((c) => c.containerId !== undefined),
            true
          );
        }
        throw e;
      }
    }
  }
}

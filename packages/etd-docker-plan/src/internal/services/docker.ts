import Docker, { Image } from "dockerode";
import { interfaces } from "@etherdata-blockchain/common";
import { sleep } from "../executionPlan/execution_plan";
import { Configurations } from "../const/configurations";
import { enums } from "@etherdata-blockchain/common";

type ImageStack = interfaces.db.ImageStack;
type ContainerStack = interfaces.db.ContainerStack;

export interface SearchResult {
  exist: boolean;
  missing: ImageStack[];
  found: ImageStack[];
}

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
        await image.remove({ force: true });
      } catch (e: any) {
        if (e.statusCode === 404) {
          continue;
        }
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
   * @param useLog
   */
  async removeContainers(
    removeContainers: ContainerStack[],
    // eslint-disable-next-line no-unused-vars
    rollback: boolean = false,
    useLog: boolean = true
  ) {
    if (useLog) {
      // eslint-disable-next-line no-console
      console.log(
        `Starting container removal process (Total: ${removeContainers.length})`
      );
    }

    for (const rmc of removeContainers) {
      try {
        const container = this.docker.getContainer(rmc.containerId!);
        await container.remove({ force: true });
      } catch (e: any) {
        //if we cannot find this container
        if (e.statusCode === 404) {
          continue;
        }
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
   * @param useLog
   */
  async createContainers(
    newContainers: ContainerStack[],
    rollback: boolean = false,
    useLog: boolean = true
  ) {
    if (useLog) {
      // eslint-disable-next-line no-console
      console.log(
        `Starting container creation process (Total: ${newContainers.length})`
      );
    }

    for (const newContainer of newContainers) {
      try {
        const container = await this.docker.createContainer({
          name: newContainer.containerName,
          Image: `${newContainer.image.image}:${newContainer.image.tag}`,
          ...newContainer.config,
        });
        await container.start();
        // check for container status
        await sleep(Configurations.awaitTime);
        const inspectResult = await container.inspect();
        const lastLogBuffer = await container.logs({
          stdout: true,
          stderr: true,
          follow: false,
        });
        const lastLog = lastLogBuffer.toString();
        if (!inspectResult.State.Running) {
          if (inspectResult.State.ExitCode !== enums.ExitCode.success) {
            throw new Error(
              `Container is not running with exit code ${inspectResult.State.ExitCode} and reason ${lastLog}`
            );
          }
          newContainer.runningLog = lastLog;
        }
        newContainer.containerId = container.id;
      } catch (e: any) {
        // if there is a container before, get that container and remove it
        if (e.statusCode === 409) {
          await this.removeContainers(
            [{ containerId: newContainer.containerName, ...newContainer }],
            false,
            false
          );
          await this.createContainers([newContainer], false, false);
          continue;
        }

        // eslint-disable-next-line no-console
        console.log(
          `Cannot create container ${newContainer.containerName} because ${e}. Rolling back.`
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

  /**
   * Search images by images stacks
   * @param images
   */
  async searchImages(images: ImageStack[]): Promise<SearchResult> {
    console.log(`Searching for images (Total: ${images.length})`);
    const results = await this.docker.listImages();

    const missing: ImageStack[] = [];
    const found: ImageStack[] = [];
    for (const image of images) {
      const key = `${image.image}:${image.tag}`;
      const options: any = {
        filters: {
          reference: [key],
        },
      };
      const foundImages = (await this.docker.listImages(options)) as any;
      if (foundImages.length === 0) {
        missing.push(image);
      } else {
        found.push(image);
      }
    }

    return {
      exist: missing.length === 0,
      missing,
      found,
    };
  }
}

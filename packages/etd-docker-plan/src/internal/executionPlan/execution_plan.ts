import { Stack } from "../stack/stack";
import DockerService, { SearchResult } from "../services/docker";
import { configs, utils, interfaces } from "@etherdata-blockchain/common";
import { Configurations } from "../const/configurations";
import Logger from "@etherdata-blockchain/logger";

type ImageStack = interfaces.db.ImageStack;
type ContainerStack = interfaces.db.ContainerStack;

export interface ExecutionPlanInterface {
  update_time: string;
  remove: {
    containers: ContainerStack[];
    images: ImageStack[];
  };
  create: {
    containers: ContainerStack[];
    images: ImageStack[];
  };
}

export interface ApplyResult {
  success: boolean;
  error?: string;
}

/**
 * Async sleep
 * @param ms
 */
export function sleep(ms: number) {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

export class ExecutionPlan {
  executionPlan?: ExecutionPlanInterface;

  dockerService: DockerService;

  constructor(dockerService: DockerService) {
    this.dockerService = dockerService;
  }

  create(stack: Stack) {
    stack.validate();

    this.executionPlan = {
      update_time: new Date().toISOString(),
      remove: {
        containers: stack.getRemovedContainers(),
        images: stack.getRemovedImages(),
      },
      create: {
        containers: stack.stacks!.containers,
        images: stack.stacks!.images,
      },
    };

    Logger.info(
      `Execution plan:\n${JSON.stringify(this.executionPlan, undefined, 4)}`
    );
  }

  /**
   * Apply is success.
   * @return success
   */
  async apply(): Promise<ApplyResult> {
    if (this.executionPlan === undefined) {
      throw Error("You need to create an execution plan first");
    }
    try {
      // Pull new images
      const newImages = this.executionPlan.create.images;
      await this.dockerService.pullImages(newImages);
      // Make sure all images are downloaded
      let failedTimes = 0;
      let searchResult!: SearchResult;

      while (failedTimes < configs.Configurations.maximumRetiresAllowed) {
        searchResult = await this.dockerService.searchImages(newImages);
        if (searchResult.exist) {
          break;
        }
        Logger.info("Waiting images to be found...");
        failedTimes += 1;
        await sleep(Configurations.awaitTime);
      }
      if (!searchResult.exist) {
        return {
          success: false,
          error: `Missing images ${JSON.stringify(
            searchResult.missing,
            null,
            2
          )}`,
        };
      }

      // Remove old containers
      const removeContainers = this.executionPlan.remove.containers;
      await this.dockerService.removeContainers(removeContainers);
      // Remove old images;
      const removeImages = this.executionPlan?.remove.images;
      await this.dockerService.removeImages(removeImages);
      // Create new containers
      const newContainers = this.executionPlan.create.containers;
      await this.dockerService.createContainers(newContainers);
      return {
        success: true,
      };
    } catch (e) {
      return {
        success: false,
        error: `${e}`,
      };
    }
  }
}

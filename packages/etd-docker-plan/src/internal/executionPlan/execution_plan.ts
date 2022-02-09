import { Stack } from "../stack/stack";
import { ContainerStack } from "../stack/container";
import { ImageStack } from "../stack/image";
import DockerService from "../services/docker";

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

export class ExecutionPlan {
  executionPlan?: ExecutionPlanInterface;

  dockerService: DockerService;

  constructor(dockerService: DockerService) {
    this.dockerService = dockerService;
  }

  create(stack: Stack) {
    if (stack.stacks === undefined) {
      throw Error(
        "You need to create/load a stack before creating an execution plan"
      );
    }

    for (const container of stack.getRemovedContainers()) {
      if (container.containerId === undefined) {
        throw new Error(
          `Container ${container.containerName}'s id should not be null`
        );
      }
    }

    this.executionPlan = {
      update_time: new Date().toISOString(),
      remove: {
        containers: stack.getRemovedContainers(),
        images: stack.getRemovedImages(),
      },
      create: {
        containers: stack.stacks.containers,
        images: stack.stacks.images,
      },
    };

    // eslint-disable-next-line no-console
    console.log(
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

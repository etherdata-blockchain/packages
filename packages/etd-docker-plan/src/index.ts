import { Stack, StackInterface } from "./internal/stack/stack";
import {
  ApplyResult,
  ExecutionPlan,
} from "./internal/executionPlan/execution_plan";
import DockerService from "./internal/services/docker";
import { Image } from "./internal/stack/image";
import { Container } from "./internal/stack/container";
import { interfaces } from "@etherdata-blockchain/common";

type ImageStack = interfaces.db.ImageStack;
type ContainerStack = interfaces.db.ContainerStack;
type DockerContainerConfig = interfaces.db.DockerContainerConfig;

export class DockerPlan {
  stack: Stack;

  executionPlan: ExecutionPlan;

  constructor(dockerService: DockerService) {
    this.stack = new Stack();
    this.executionPlan = new ExecutionPlan(dockerService);
  }

  /**
   * Create a execution plan. The following logic will be applied.
   * If an image is defined, then it will try to pull that image every time this method is called.
   * In other words, we will always pull the latest image no matter what. However, no image deletion process
   * will begin.
   *
   * If you delete the image from the stack, then it will start the deletion process.
   *
   * Containers will be recreated every time you start executing the execution plan.
   * @param stack
   */
  async create(stack: StackInterface): Promise<void> {
    this.stack.readPreviousStack();
    this.stack.updateStack(stack);
    this.executionPlan.create(this.stack);
  }

  async apply(): Promise<ApplyResult> {
    const success = await this.executionPlan.apply();
    if (success.success) {
      this.stack.writeStack();
    } else {
      console.log(success.error);
    }
    return success;
  }
}

export type {
  Image,
  ImageStack,
  Container,
  ContainerStack,
  DockerContainerConfig,
};

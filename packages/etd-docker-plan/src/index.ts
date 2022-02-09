import { Stack, StackInterface } from "./internal/stack/stack";
import {
  ApplyResult,
  ExecutionPlan,
} from "./internal/executionPlan/execution_plan";
import DockerService from "./internal/services/docker";
import { ImageStack, Image } from "./internal/stack/image";
import {
  ContainerStack,
  Container,
  DockerContainerConfig,
} from "./internal/stack/container";

export class DockerPlan {
  stack: Stack;

  executionPlan: ExecutionPlan;

  constructor(dockerService: DockerService) {
    this.stack = new Stack();
    this.executionPlan = new ExecutionPlan(dockerService);
  }

  async create(stack: StackInterface): Promise<void> {
    this.stack.readPreviousStack();
    this.stack.updateStack(stack);
    this.executionPlan.create(this.stack);
  }

  async apply(): Promise<ApplyResult> {
    const success = await this.executionPlan.apply();
    if (success.success) {
      this.stack.writeStack();
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

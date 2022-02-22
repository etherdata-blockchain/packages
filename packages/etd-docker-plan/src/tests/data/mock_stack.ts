import { StackInterface } from "../../internal/stack/stack";
import { MockImageStacks } from "./mock_image_stack";
import { MockContainers } from "./mock_container_stack";

export const MockStack: StackInterface = {
  images: [MockImageStacks[0], MockImageStacks[2]],
  containers: [MockContainers[0], MockContainers[2]],
  update_time: new Date().toISOString(),
};

export const MockStack2: StackInterface = {
  images: [MockImageStacks[0], MockImageStacks[2]],
  containers: [MockContainers[0], MockContainers[5]],
  update_time: new Date().toISOString(),
};

/**
 * Removed mock imaged 0 and container 0
 */
export const MockUpdateStack: StackInterface = {
  update_time: new Date().toISOString(),
  images: [MockImageStacks[2]],
  containers: [MockContainers[2]],
};

/**
 * Removed mock image 0, 2 and container 0, 2
 * Add image 3 and container 3
 */
export const MockCompletelyUpdateStack: StackInterface = {
  update_time: new Date().toISOString(),
  images: [MockImageStacks[3]],
  containers: [MockContainers[3]],
};

export const MockCompletelyUpdateStack2: StackInterface = {
  update_time: new Date().toISOString(),
  images: [MockImageStacks[3]],
  containers: [MockContainers[6]],
};

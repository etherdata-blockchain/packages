import { ContainerStack } from "../../internal/stack/container";
import { MockImageStacks } from "./mock_image_stack";

export const MockContainers: ContainerStack[] = [
  {
    containerId: "1",
    containerName: "mock_container",
    image: MockImageStacks[0],
  },
  {
    containerId: "2",
    containerName: "mock_container_1",
    image: MockImageStacks[2],
  },
  {
    containerId: "2",
    containerName: "mock_container_1",
    image: MockImageStacks[3],
  },
  {
    containerId: "2",
    containerName: "mock_container_1",
    image: MockImageStacks[4],
  },
  {
    containerId: "3",
    containerName: "mock_container_2",
    image: MockImageStacks[4],
  },
];

export const MockContainersNoId: ContainerStack[] = [
  {
    containerName: "mock_container",
    image: MockImageStacks[0],
  },
  {
    containerName: "mock_container_1",
    image: MockImageStacks[2],
  },
  {
    containerName: "mock_container_1",
    image: MockImageStacks[3],
  },
  {
    containerName: "mock_container_1",
    image: MockImageStacks[4],
  },
  {
    containerName: "mock_container_2",
    image: MockImageStacks[4],
  },
];

export const MockContainerId = "mock_container_id";

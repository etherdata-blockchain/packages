import { Container } from "../../internal/stack/container";
import { MockContainers } from "../data/mock_container_stack";
import { MockImageStacks } from "../data/mock_image_stack";

describe("Given a container", () => {
  test("When there is no container", () => {
    const container = new Container([]);
    container.update(MockContainers[0]);
    expect(container.containers.length).toBe(1);
    expect(container.containersRemoved.length).toBe(0);
  });

  test("When there is a container with same image name but different tag", () => {
    const container = new Container([MockContainers[0]]);
    container.update({
      containerName: MockContainers[0].containerName,
      image: MockImageStacks[1],
    });
    expect(container.containers.length).toBe(1);
    expect(container.containersRemoved.length).toBe(1);
  });

  test("When there is a container and with different image name and different tag", () => {
    const container = new Container([MockContainers[0]]);
    container.update(MockContainers[1]);
    expect(container.containers.length).toBe(2);
    expect(container.containersRemoved.length).toBe(0);
  });

  test("When there are two containers and update both of them", () => {
    const container = new Container([MockContainers[0], MockContainers[1]]);
    container.update({
      ...MockContainers[0],
      image: MockImageStacks[1],
    });

    container.update({
      ...MockContainers[1],
      image: MockImageStacks[3],
    });

    expect(container.containers.length).toBe(2);
    expect(container.containersRemoved.length).toBe(2);
  });

  test("When there are two containers and update both of them multiple times", () => {
    const container = new Container([MockContainers[0], MockContainers[1]]);
    container.update({
      ...MockContainers[0],
      image: MockImageStacks[1],
    });

    container.update({
      ...MockContainers[1],
      image: MockImageStacks[3],
    });

    container.update({
      ...MockContainers[1],
      image: MockImageStacks[4],
    });

    expect(container.containers.length).toBe(2);
    expect(container.containersRemoved.length).toBe(2);
  });

  test("When start with empty and add multiple times", () => {
    const container = new Container([]);
    MockContainers.forEach((c) => {
      container.update(c);
    });

    expect(container.containersRemoved.length).toBe(0);
    expect(container.containers.length).toBe(3);
  });

  test("When updating same container multiple times", () => {
    const container = new Container([]);
    container.update(MockContainers[0]);
    container.update(MockContainers[0]);
    container.update(MockContainers[0]);
    expect(container.containersRemoved.length).toBe(0);
    expect(container.containers.length).toBe(1);
    expect(container.containers[0]).toStrictEqual(MockContainers[0]);
  });

  test("When creating multiple containers with same image", () => {
    const container = new Container([]);
    container.update(MockContainers[3]);
    container.update(MockContainers[4]);
    expect(container.containers.length).toBe(2);
    expect(container.containersRemoved.length).toBe(0);
  });
});

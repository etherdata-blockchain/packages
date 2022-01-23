import yaml from "yaml";
import fs from "fs";
import { Stack } from "../../internal/stack/stack";
import { MockImageStacks } from "../data/mock_image_stack";
import { MockContainers } from "../data/mock_container_stack";
import {
  MockCompletelyUpdateStack,
  MockStack,
  MockUpdateStack,
} from "../data/mock_stack";
import { Configurations } from "../../internal/const/configurations";

jest.mock("fs");

describe("Given a stack object", () => {
  test("When no stack defined before", () => {
    const stack = new Stack();
    stack.updateStack({
      images: MockImageStacks,
      containers: MockContainers,
      update_time: new Date().toISOString(),
    });

    expect(stack.getRemovedContainers().length).toBe(0);
    expect(stack.getRemovedImages().length).toBe(0);
    expect(stack.stacks).toBeDefined();

    expect(stack.stacks!.images.length).toBe(2);
    expect(stack.stacks!.containers.length).toBe(3);
  });

  test("When a stack is defined and load new stack", () => {
    const stack = new Stack();
    stack.stacks = JSON.parse(JSON.stringify(MockStack));

    expect(stack.getRemovedImages().length).toBe(0);
    expect(stack.getRemovedContainers().length).toBe(0);

    stack.updateStack(JSON.parse(JSON.stringify(MockUpdateStack)));
    expect(stack.getRemovedImages().length).toBe(1);
    expect(stack.getRemovedContainers().length).toBe(2);

    expect(stack.getRemovedImages()[0]).toStrictEqual(MockImageStacks[0]);
    expect(stack.getRemovedContainers()[0]).toStrictEqual(MockContainers[0]);
  });

  test("When a stack is defined and load complete new stack", () => {
    const stack = new Stack();
    stack.stacks = JSON.parse(JSON.stringify(MockStack));

    expect(stack.getRemovedImages().length).toBe(0);
    expect(stack.getRemovedContainers().length).toBe(0);

    stack.updateStack(JSON.parse(JSON.stringify(MockCompletelyUpdateStack)));
    expect(stack.getRemovedImages().length).toBe(2);
    expect(stack.getRemovedContainers().length).toBe(2);

    expect(stack.getRemovedImages()[0]).toStrictEqual(MockImageStacks[0]);
    expect(stack.getRemovedImages()[1]).toStrictEqual(MockImageStacks[2]);

    expect(stack.getRemovedContainers()[0]).toStrictEqual(MockContainers[0]);
    expect(stack.getRemovedContainers()[1]).toStrictEqual(MockContainers[2]);

    expect(stack.stacks!.images.length).toBe(1);
    expect(stack.stacks!.containers.length).toBe(1);

    expect(stack.stacks!.images[0]).toStrictEqual(MockImageStacks[3]);
    expect(stack.stacks!.containers[0]).toStrictEqual(MockContainers[3]);
  });

  test("when reading yaml file", () => {
    const stack = new Stack();
    jest.spyOn(fs, "existsSync").mockReturnValue(true);
    jest.spyOn(fs, "readFileSync").mockReturnValue(yaml.stringify(MockStack));
    stack.readPreviousStack();
    expect(stack.stacks).toStrictEqual(MockStack);
  });

  test("when saving data to the disk", () => {
    const stack = new Stack();
    stack.stacks = MockStack;
    const spy = jest.spyOn(fs, "writeFileSync");
    stack.writeStack();
    expect(spy).toBeCalledWith(
      Configurations.defaultStackPosition,
      yaml.stringify(MockStack)
    );
  });
});

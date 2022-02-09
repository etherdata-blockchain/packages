import { Stack } from "../../internal/stack/stack";
import { MockCompletelyUpdateStack, MockStack } from "../data/mock_stack";
import { ExecutionPlan } from "../../internal/executionPlan/execution_plan";
import DockerService from "../../internal/services/docker";
import { MockContainersNoId } from "../data/mock_container_stack";

jest.mock("../../internal/services/docker", () =>
  jest.fn().mockImplementation(() => ({
    pullImages: jest.fn(),
    removeImages: jest.fn(),
    removeContainers: jest.fn(),
    createContainers: jest.fn(),
  }))
);

describe("Given an execution plan object", () => {
  let successDockerService: DockerService;

  beforeAll(() => {
    successDockerService = new DockerService();
  });

  beforeEach(() => {
    // @ts-ignore
    // eslint-disable-next-line no-unused-expressions
    DockerService.mockClear;
  });

  test("When creating an execution plan with only create", () => {
    const stack = new Stack();
    stack.updateStack(MockStack);

    const executionPlan = new ExecutionPlan(successDockerService);
    executionPlan.create(stack);
    expect(executionPlan.executionPlan?.remove.containers.length).toBe(0);
    expect(executionPlan.executionPlan?.remove.images.length).toBe(0);

    expect(executionPlan.executionPlan?.create.containers.length).toBe(2);
    expect(executionPlan.executionPlan?.create.images.length).toBe(2);
  });

  test("When creating an execution plan with remove and create", () => {
    const stack = new Stack();
    stack.updateStack(MockStack);
    stack.updateStack(MockCompletelyUpdateStack);

    const executionPlan = new ExecutionPlan(successDockerService);
    executionPlan.create(stack);
    expect(executionPlan.executionPlan?.remove.containers.length).toBe(2);
    expect(executionPlan.executionPlan?.remove.images.length).toBe(2);

    expect(executionPlan.executionPlan?.create.containers.length).toBe(1);
    expect(executionPlan.executionPlan?.create.images.length).toBe(1);
  });

  test("When calling apply execution plan successfully", async () => {
    const stack = new Stack();
    stack.updateStack(MockStack);
    stack.updateStack(MockCompletelyUpdateStack);

    const executionPlan = new ExecutionPlan(successDockerService);
    executionPlan.create(stack);
    const result = await executionPlan.apply();
    expect(result.success).toBeTruthy();
    // @ts-ignore
    expect(successDockerService.pullImages.mock.calls.length).toBe(1);
    // @ts-ignore
    expect(successDockerService.createContainers.mock.calls.length).toBe(1);
    // @ts-ignore
    expect(successDockerService.removeContainers.mock.calls.length).toBe(1);
    // @ts-ignore
    expect(successDockerService.removeImages.mock.calls.length).toBe(1);
  });

  test("When calling create execution plan without stacks", () => {
    const stack = new Stack();
    const executionPlan = new ExecutionPlan(successDockerService);
    expect(() => executionPlan.create(stack)).toThrow();
  });

  test("When calling create execution plan with containers without container ids", () => {
    const stack = new Stack();
    stack.updateStack({
      images: [],
      update_time: new Date().toISOString(),
      containers: [MockContainersNoId[0]],
    });

    stack.updateStack({
      images: [],
      update_time: new Date().toISOString(),
      containers: [MockContainersNoId[2]],
    });
    const executionPlan = new ExecutionPlan(successDockerService);
    expect(() => executionPlan.create(stack)).toThrow();
  });

  test("When calling apply execution plan without creating first", () => {
    const executionPlan = new ExecutionPlan(successDockerService);
    expect(executionPlan.apply()).rejects.toThrow();
  });
});

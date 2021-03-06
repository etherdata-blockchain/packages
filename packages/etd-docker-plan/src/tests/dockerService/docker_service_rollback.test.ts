import Docker from "dockerode";
import { when } from "jest-when";
import DockerService from "../../internal/services/docker";
import { MockImageId, MockImageStacks } from "../data/mock_image_stack";
import { MockErrors } from "../data/mock_error_msg";
import {
  MockContainerId,
  MockContainers,
  MockContainersNoId,
} from "../data/mock_container_stack";
import { Configurations } from "../../internal/const/configurations";

jest.mock("dockerode");

describe("Given a docker service with error", () => {
  afterEach(() => {
    // @ts-ignore
    Docker.mockClear();
  });

  beforeAll(() => {
    Configurations.awaitTime = 0;
  });

  test("When calling pulling images and then rollback", async () => {
    const mockRemove = jest.fn();

    const image = {
      remove: mockRemove,
      id: MockImageId,
    };

    const mockPull = jest
      .fn()
      .mockResolvedValueOnce(image)
      .mockRejectedValueOnce(new Error(MockErrors.mockPullingError));

    // @ts-ignore
    Docker.mockImplementation(() => ({
      pull: mockPull,
      getImage: jest.fn().mockReturnValue(image),
    }));

    const dockerService = new DockerService();
    await expect(
      dockerService.pullImages([MockImageStacks[0], MockImageStacks[1]])
    ).rejects.toThrow();
    expect(mockRemove).toBeCalledTimes(1);
  });

  test("When calling creating containers and then rollback", async () => {
    const mockRemove = jest.fn();

    const container = {
      remove: mockRemove,
      start: jest.fn(),
      inspect: jest.fn().mockResolvedValue({
        State: {
          Running: true,
        },
      }),
      id: MockContainerId,
      logs: jest.fn().mockResolvedValue(Buffer.from("mock_data")),
    };

    const mockCreate = jest
      .fn()
      .mockResolvedValueOnce(container)
      .mockRejectedValueOnce(new Error(MockErrors.mockContainerCreationError));

    // @ts-ignore
    Docker.mockImplementation(() => ({
      createContainer: mockCreate,
      getContainer: jest.fn().mockReturnValue(container),
    }));

    const dockerService = new DockerService();
    await expect(
      dockerService.createContainers([
        MockContainersNoId[0],
        MockContainersNoId[2],
      ])
    ).rejects.toThrow();
    expect(mockRemove).toBeCalledTimes(1);
  });

  test("When calling removing containers with error", async () => {
    // @ts-ignore
    Docker.mockImplementation(() => ({
      getContainer: jest
        .fn()
        .mockResolvedValueOnce(
          new Error(MockErrors.mockContainerDeletionError)
        ),
    }));

    const dockerService = new DockerService();
    await expect(
      dockerService.removeContainers([MockContainers[0], MockContainers[2]])
    ).rejects.toThrow();
  });

  test("When calling removing images with error", async () => {
    // @ts-ignore
    Docker.mockImplementation(() => ({
      getImage: jest
        .fn()
        .mockResolvedValueOnce(
          new Error(MockErrors.mockContainerDeletionError)
        ),
    }));

    const dockerService = new DockerService();
    await expect(
      dockerService.removeImages([MockImageStacks[0], MockImageStacks[2]])
    ).rejects.toThrow();
  });
});

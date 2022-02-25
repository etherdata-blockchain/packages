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
import { ExitCode } from "@etherdata-blockchain/common/dist/enums";
import { Configurations } from "../../internal/const/configurations";

jest.mock("dockerode");

describe("Given a docker service", () => {
  afterEach(() => {
    // @ts-ignore
    Docker.mockClear();
  });

  beforeAll(() => {
    Configurations.awaitTime = 0;
  });

  test("When calling creating containers and container exited without error", async () => {
    const mockRemove = jest.fn();

    const container = {
      remove: mockRemove,
      start: jest.fn(),
      inspect: jest.fn().mockResolvedValue({
        State: {
          Running: false,
          ExitCode: ExitCode.success,
        },
      }),
      id: MockContainerId,
      logs: jest.fn().mockResolvedValue(Buffer.from("mock_data")),
    };
    const mockCreate = jest.fn().mockResolvedValue(container);

    // @ts-ignore
    Docker.mockImplementation(() => ({
      createContainer: mockCreate,
      getContainer: jest.fn().mockReturnValue(container),
    }));

    const dockerService = new DockerService();
    const containers = [MockContainersNoId[0], MockContainersNoId[2]];
    await expect(
      dockerService.createContainers(containers)
    ).resolves.not.toThrow();

    expect(containers[0].runningLog).toBe("mock_data");
  });

  test("When calling creating containers and container exited with error", async () => {
    const mockRemove = jest.fn();

    const container = {
      remove: mockRemove,
      start: jest.fn(),
      inspect: jest.fn().mockResolvedValue({
        State: {
          Running: false,
          ExitCode: ExitCode.error,
        },
      }),
      id: MockContainerId,
      logs: jest.fn().mockResolvedValue(Buffer.from("mock_data")),
    };
    const mockCreate = jest.fn().mockResolvedValue(container);

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
    ).rejects.toThrow(
      "Container is not running with exit code 1 and reason is\nmock_data"
    );
  });
});

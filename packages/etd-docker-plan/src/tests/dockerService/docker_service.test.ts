import Docker from "dockerode";
import DockerService from "../../internal/services/docker";
import { MockContainerId, MockContainers } from "../data/mock_container_stack";
import { MockImageStacks } from "../data/mock_image_stack";

const container = {
  id: MockContainerId,
  stop: jest.fn(),
  remove: jest.fn(),
  start: jest.fn(),
};

const image = {
  id: MockContainerId,
  remove: jest.fn(),
};

jest.mock("dockerode", () =>
  jest.fn().mockImplementation(() => ({
    createContainer: jest.fn().mockReturnValue(container),
    getImage: jest.fn().mockReturnValue(image),
    getContainer: jest.fn().mockReturnValue(container),
    pull: jest.fn().mockReturnValue(image),
  }))
);
describe("Given a docker service while docker works as expected", () => {
  let docker: Docker;
  beforeEach(() => {
    // @ts-ignore
    // eslint-disable-next-line no-unused-expressions
    Docker.mockClear();
  });

  beforeAll(() => {
    docker = new Docker();
  });

  test("When calling create images with an empty container provided", async () => {
    const dockerService = new DockerService(docker);
    await expect(dockerService.createContainers([])).resolves.not.toThrow();
  });

  test("When calling create containers with some container provided", async () => {
    const dockerService = new DockerService(docker);
    const containers = [MockContainers[0], MockContainers[1]];
    await expect(
      dockerService.createContainers(containers)
    ).resolves.not.toThrow();
    expect(containers[0].containerId).toBe(MockContainerId);
    expect(containers[1].containerId).toBe(MockContainerId);
  });

  test("When calling pull images with an empty image provided", async () => {
    const dockerService = new DockerService(docker);
    await expect(dockerService.pullImages([])).resolves.not.toThrow();
  });

  test("When calling pull images with some images provided", async () => {
    const dockerService = new DockerService(docker);
    const images = [MockImageStacks[0], MockImageStacks[1]];
    await expect(dockerService.pullImages(images)).resolves.not.toThrow();
  });

  test("When calling remove images with an empty image provided", async () => {
    const dockerService = new DockerService(docker);
    await expect(dockerService.removeImages([])).resolves.not.toThrow();
  });

  test("When calling remove images with some images provided", async () => {
    const dockerService = new DockerService(docker);
    const images = [MockImageStacks[0], MockImageStacks[1]];
    await expect(dockerService.pullImages(images)).resolves.not.toThrow();
  });

  test("When calling remove containers with an empty container provided", async () => {
    const dockerService = new DockerService(docker);
    await expect(dockerService.removeImages([])).resolves.not.toThrow();
  });

  test("When calling remove containers with no container found", async () => {
    const mockRemove = jest.fn().mockRejectedValue({
      statusCode: 404,
    });
    const mockDocker = jest.fn().mockImplementation(() => ({
      getContainer: jest.fn().mockImplementation(() => ({
        remove: mockRemove,
      })),
    }));

    const dockerService = new DockerService(new mockDocker() as any);
    await expect(
      dockerService.removeContainers([MockContainers[0]])
    ).resolves.not.toThrow();
    expect(mockRemove).toBeCalledTimes(1);
  });

  test("When calling create containers while exists", async () => {
    const mockRemove = jest.fn();
    const mockStart = jest.fn();
    const mockCreate = jest
      .fn()
      .mockRejectedValueOnce({
        statusCode: 409,
      })
      .mockResolvedValue({
        start: mockStart,
      });

    const mockDocker = jest.fn().mockImplementation(() => ({
      getContainer: jest.fn().mockImplementation(() => ({
        remove: mockRemove,
      })),
      createContainer: mockCreate,
    }));

    const dockerService = new DockerService(new mockDocker() as any);
    await expect(
      dockerService.createContainers([MockContainers[0]])
    ).resolves.not.toThrow();
    expect(mockCreate).toBeCalledTimes(2);
    expect(mockStart).toBeCalledTimes(1);
    expect(mockRemove).toBeCalledTimes(1);
  });

  test("When calling remove images with some containers provided", async () => {
    const dockerService = new DockerService(docker);
    const containers = [MockContainers[0], MockContainers[1]];
    await expect(
      dockerService.removeContainers(containers)
    ).resolves.not.toThrow();
  });
});

import Docker from "dockerode";
import DockerService from "../../internal/services/docker";
import { DockerPlan } from "../../index";
import { StackInterface } from "../../internal/stack/stack";
import * as fs from "fs";
import { interfaces } from "@etherdata-blockchain/common";

type ImageStack = interfaces.db.ImageStack;
type ContainerStack = interfaces.db.ContainerStack;

describe("Given a docker plan", () => {
  const imageName = "hello-world";
  const tag = "latest";
  const containerName = "test-container";
  let docker: Docker;

  beforeAll(() => {
    docker = new Docker();
  });

  afterAll(() => {
    if (fs.existsSync("stack.lock.yaml")) {
      fs.unlinkSync("stack.lock.yaml");
    }
  });

  afterEach(async () => {
    const allContainers = await docker.listContainers();
    for (const container of allContainers) {
      if (container.Names.includes(containerName)) {
        const rmc = await docker.getContainer(container.Id);
        await rmc.remove();
      }
    }

    try {
      const image = await docker.getImage(`${imageName}:${tag}`);
      await image.remove();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log("Skipping");
    }
  });

  test("When creating a simple hello world docker", async () => {
    const dockerService = new DockerService(docker);
    const plan = new DockerPlan(dockerService);
    const image: ImageStack = {
      image: imageName,
      tag,
    };

    const container: ContainerStack = {
      containerName,
      image,
    };

    const stacks: StackInterface = {
      update_time: new Date().toISOString(),
      images: [image],
      containers: [container],
    };
    await plan.create(stacks);
    await plan.apply();

    const imageFound = await docker.getImage(`${imageName}:${tag}`);
    const containerFound = await docker.getContainer(
      plan.executionPlan.executionPlan?.create.containers[0].containerId!
    );
    // @ts-ignore
    expect(imageFound.name).toBeDefined();
    // @ts-ignore
    expect(containerFound).toBeDefined();
  });
});

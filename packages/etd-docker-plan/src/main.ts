import Docker from "dockerode";
import { DockerPlan } from "./index";
import DockerService from "./internal/services/docker";
import { StackInterface } from "./internal/stack/stack";
import { interfaces } from "@etherdata-blockchain/common";

type ImageStack = interfaces.db.ImageStack;
type ContainerStack = interfaces.db.ContainerStack;

(async () => {
  const docker = new Docker();
  const dockerService = new DockerService(docker);
  const plan = new DockerPlan(dockerService);
  const image: ImageStack = {
    image: "hello-world",
    tag: "latest",
  };

  const container: ContainerStack = {
    containerName: "test",
    image,
  };

  const container2: ContainerStack = {
    containerName: "test2",
    image,
    config: {
      Env: ["hello=world"],
    },
  };

  const stacks: StackInterface = {
    update_time: new Date().toISOString(),
    images: [image],
    containers: [container, container2],
  };
  await plan.create(stacks);
  await plan.apply();
})();

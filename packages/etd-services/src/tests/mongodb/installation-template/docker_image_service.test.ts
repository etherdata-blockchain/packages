import { mockData } from "@etherdata-blockchain/common";
import { schema } from "@etherdata-blockchain/storage-model";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { DockerImageService } from "../../../mongodb/services/installation-template/docker_image_service";

describe("Given a docker image service", () => {
  let dbServer: MongoMemoryServer;
  const oldEnv = process.env;
  let templateId: string | undefined = undefined;

  beforeAll(async () => {
    dbServer = await MongoMemoryServer.create();
    await mongoose.connect(
      dbServer.getUri().concat(mockData.MockConstant.mockDatabaseName)
    );
  });

  afterEach(async () => {
    await schema.DockerImageModel.deleteMany({});
  });

  afterAll(async () => {
    await dbServer.stop();
    await mongoose.disconnect();
  });

  test("When creating a docker image with webhook data", async () => {
    const service = new DockerImageService();
    const result = await service.createWithDockerWebhookData(
      mockData.MockWebHookData as any
    );

    expect(await service.count()).toBe(1);
  });

  test("When creating a docker image with webhook data", async () => {
    const service = new DockerImageService();
    await service.create(mockData.MockDockerImage as any, {
      upsert: false,
    });
    await service.create(mockData.MockDockerImage2 as any, {
      upsert: false,
    });

    await service.create(mockData.MockDockerImage3 as any, {
      upsert: false,
    });

    let result = await service.search("test");
    expect(result.length).toBe(3);

    result = await service.search("");
    expect(result.length).toBe(3);

    result = await service.search("abc");
    expect(result.length).toBe(0);
  });
});

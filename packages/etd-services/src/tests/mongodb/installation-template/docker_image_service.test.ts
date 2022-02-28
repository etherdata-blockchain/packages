import { interfaces, mockData } from "@etherdata-blockchain/common";
import { schema } from "@etherdata-blockchain/storage-model";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { DockerImageService } from "../../../mongodb";

describe("Given a docker image service", () => {
  let dbServer: MongoMemoryServer;

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

  test("When creating a docker image with webhook data and empty tag", async () => {
    const service = new DockerImageService();
    const data: interfaces.DockerWebhookInterface = {
      callback_url: "",
      push_data: {
        tag: "",
        pushed_at: 1000,
        images: [],
        pusher: "mock_user",
      },
      repository: {
        comment_count: 0,
        date_created: new Date().getDate(),
        description: "",
        full_description: "",
        dockerfile: "",
        is_official: false,
        is_private: true,
        is_trusted: true,
        name: "test",
        repo_name: mockData.MockDockerImage.imageName,
        repo_url: "mock",
        owner: "mock_user",
        namespace: "",
        status: "ok",
        star_count: 0,
      },
    };

    await service.createWithDockerWebhookData(data);
    expect(await service.count()).toBe(0);
  });

  test("When creating a docker image with webhook data", async () => {
    const service = new DockerImageService();
    const data: interfaces.DockerWebhookInterface = {
      callback_url: "",
      push_data: {
        tag: "1.0",
        pushed_at: 1000,
        images: [],
        pusher: "mock_user",
      },
      repository: {
        comment_count: 0,
        date_created: new Date().getDate(),
        description: "",
        full_description: "",
        dockerfile: "",
        is_official: false,
        is_private: true,
        is_trusted: true,
        name: "test",
        repo_name: mockData.MockDockerImage.imageName,
        repo_url: "mock",
        owner: "mock_user",
        namespace: "",
        status: "ok",
        star_count: 0,
      },
    };

    await service.createWithDockerWebhookData(data);
    expect(await service.count()).toBe(1);
  });

  test("When creating a docker image with webhook data with existing tag", async () => {
    const service = new DockerImageService();
    const data: interfaces.DockerWebhookInterface = {
      callback_url: "",
      push_data: {
        tag: "v1.1",
        pushed_at: 1000,
        images: [],
        pusher: "mock_user",
      },
      repository: {
        comment_count: 0,
        date_created: new Date().getDate(),
        description: "",
        full_description: "",
        dockerfile: "",
        is_official: false,
        is_private: true,
        is_trusted: true,
        name: "test",
        repo_name: mockData.MockDockerImage.imageName,
        repo_url: "mock",
        owner: "mock_user",
        namespace: "",
        status: "ok",
        star_count: 0,
      },
    };
    await service.create(mockData.MockDockerImage as any, {
      upsert: false,
    });

    await service.createWithDockerWebhookData(data);
    expect(await service.count()).toBe(1);

    let result = await service.search("test");
    expect(result[0].tags.length).toBe(2);
  });

  test("When creating a docker image with webhook data with existing tag", async () => {
    const service = new DockerImageService();
    const data: interfaces.DockerWebhookInterface = {
      callback_url: "",
      push_data: {
        tag: "v1.1",
        pushed_at: 1000,
        images: [],
        pusher: "mock_user",
      },
      repository: {
        comment_count: 0,
        date_created: new Date().getDate(),
        description: "",
        full_description: "",
        dockerfile: "",
        is_official: false,
        is_private: true,
        is_trusted: true,
        name: "test",
        repo_name: mockData.MockDockerImage.imageName,
        repo_url: "mock",
        owner: "mock_user",
        namespace: "",
        status: "ok",
        star_count: 0,
      },
    };

    await service.createWithDockerWebhookData(data);
    await service.createWithDockerWebhookData(data);
    await service.createWithDockerWebhookData(data);

    expect(await service.count()).toBe(1);

    let result = await service.search("test");
    expect(result[0].tags.length).toBe(1);
  });

  test("When creating a docker image with webhook data", async () => {
    const service = new DockerImageService();
    await service.create(mockData.MockDockerImage as any, {
      upsert: false,
    });
    await service.create(mockData.MockDockerImage2 as any, {
      upsert: false,
    });

    let result = await service.search("test");
    expect(result.length).toBe(2);

    result = await service.search("");
    expect(result.length).toBe(2);

    result = await service.search("abc");
    expect(result.length).toBe(0);
  });
});

import { mockData } from "@etherdata-blockchain/common";
import { schema } from "@etherdata-blockchain/storage-model";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { DockerImageService, UpdateTemplateService } from "../../../mongodb";

describe("Given a update-script-script plugin", () => {
  let dbServer: MongoMemoryServer;

  beforeAll(async () => {
    dbServer = await MongoMemoryServer.create();
    await mongoose.connect(dbServer.getUri().concat("etd"));
  });

  afterEach(async () => {
    await schema.UpdateScriptModel.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await dbServer.stop();
  });

  test("When calling getUpdateTemplateWithDockerImage", async () => {
    //getUpdateTemplateWithDockerImage
    const data = (
      await schema.DockerImageModel.create(mockData.MockDockerImage)
    ).toJSON();

    const imageId = data._id;
    const tagId = data.tags[0]._id;

    const mockUpdateScriptData = JSON.parse(
      JSON.stringify(mockData.MockUpdateScriptData)
    );

    mockUpdateScriptData.imageStacks[0].tag = tagId;
    mockUpdateScriptData.imageStacks[0].image = imageId;

    mockUpdateScriptData.containerStacks[0].image.image = imageId;
    mockUpdateScriptData.containerStacks[0].image.tag = tagId;

    const createdData = await schema.UpdateScriptModel.create(
      mockUpdateScriptData
    );
    expect(createdData.imageStacks[0].image).toBe(imageId);
    expect(createdData.containerStacks[0].image.image).toBe(imageId);

    expect(createdData.imageStacks[0].tag).toBe(tagId);
    expect(createdData.containerStacks[0].image.tag).toBe(tagId);

    const plugin = new UpdateTemplateService();
    const result = (await plugin.getUpdateTemplateWithDockerImage(
      createdData._id.toString()
    ))!;

    expect(result._id).toStrictEqual(createdData._id);
    expect(result.targetGroupIds).toStrictEqual(createdData.targetGroupIds);
    expect(result.targetDeviceIds).toStrictEqual(createdData.targetDeviceIds);
    expect(result.imageStacks[0].imageName).toStrictEqual(
      mockData.MockDockerImage.imageName
    );
    expect(result.imageStacks[0].image).toBeDefined();
    expect(result.imageStacks[0].tag).toBeDefined();
    expect(result.imageStacks[0].tags.tag).toStrictEqual(
      mockData.MockDockerImage.tags[0].tag
    );
    expect(result.containerStacks[0].image.tag).toBeDefined();
    expect(result.containerStacks[0].image.image).toBeDefined();
    expect(result.containerStacks[0].image.imageName).toBeDefined();
    expect(result.containerStacks[0].image.tags.tag).toBeDefined();
  });

  test("When calling getUpdateTemplateWithDockerImage if no image exists", async () => {
    const data = (
      await schema.DockerImageModel.create(mockData.MockDockerImage)
    ).toJSON();

    const imageId = data._id;
    const tagId = data.tags[0]._id;

    const mockUpdateScriptData = JSON.parse(
      JSON.stringify(mockData.MockUpdateScriptData)
    );

    mockUpdateScriptData.imageStacks[0].tag = tagId;
    mockUpdateScriptData.imageStacks[0].image = imageId;

    mockUpdateScriptData.containerStacks[0].image.image = imageId;
    mockUpdateScriptData.containerStacks[0].image.tag = tagId;
    mockUpdateScriptData.containerStacks[0].containerName = "mock_name";

    const createdData = await schema.UpdateScriptModel.create(
      mockUpdateScriptData
    );

    await schema.DockerImageModel.findOneAndDelete({ _id: data._id });
    const dockerImagePlugin = new DockerImageService();
    await dockerImagePlugin.delete(imageId);

    const plugin = new UpdateTemplateService();
    const result = (await plugin.getUpdateTemplateWithDockerImage(
      createdData._id.toString()
    ))!;
    expect(result).toBeDefined();
    expect(result.imageStacks.length).toBe(0);
    expect(result.containerStacks.length).toBe(1);
    expect(result.containerStacks[0].image).toBeUndefined();
  });

  test("When calling getUpdateTemplateWithDockerImage if some images doesn't exist", async () => {
    const data = (
      await schema.DockerImageModel.create(mockData.MockDockerImage)
    ).toJSON();
    const data2 = (
      await schema.DockerImageModel.create(mockData.MockDockerImage2)
    ).toJSON();

    const imageId = data._id;
    const tagId = data.tags[0]._id;

    const imageId2 = data2._id;
    const tagId2 = data.tags[0]._id;

    const mockUpdateScriptData = JSON.parse(
      JSON.stringify(mockData.MockUpdateScriptData2)
    );

    mockUpdateScriptData.imageStacks[0].tag = tagId;
    mockUpdateScriptData.imageStacks[0].image = imageId;

    mockUpdateScriptData.imageStacks[1].tag = tagId2;
    mockUpdateScriptData.imageStacks[1].image = imageId2;

    mockUpdateScriptData.containerStacks[0].image.image = imageId;
    mockUpdateScriptData.containerStacks[0].image.tag = tagId;

    mockUpdateScriptData.containerStacks[1].image.image = imageId2;
    mockUpdateScriptData.containerStacks[1].image.tag = tagId2;

    const createdData = await schema.UpdateScriptModel.create(
      mockUpdateScriptData
    );

    const dockerImagePlugin = new DockerImageService();
    await dockerImagePlugin.delete(imageId);

    const plugin = new UpdateTemplateService();
    const result = (await plugin.getUpdateTemplateWithDockerImage(
      createdData._id
    ))!;
    expect(result).toBeDefined();
    expect(result.imageStacks.length).toBe(1);
    expect(result.containerStacks[0].image).toBeUndefined();
  });

  test("When calling getUpdateTemplateWithDockerImage if container stacks is empty", async () => {
    const data = (
      await schema.DockerImageModel.create(mockData.MockDockerImage)
    ).toJSON();
    const data2 = (
      await schema.DockerImageModel.create(mockData.MockDockerImage2)
    ).toJSON();

    const imageId = data._id;
    const tagId = data.tags[0]._id;

    const imageId2 = data2._id;
    const tagId2 = data2.tags[0]._id;

    const mockUpdateScriptData = JSON.parse(
      JSON.stringify(mockData.MockUpdateScriptData2)
    );

    mockUpdateScriptData.imageStacks[0].tag = tagId;
    mockUpdateScriptData.imageStacks[0].image = imageId;

    mockUpdateScriptData.imageStacks[1].tag = tagId2;
    mockUpdateScriptData.imageStacks[1].image = imageId2;

    mockUpdateScriptData.containerStacks = [];

    const createdData = await schema.UpdateScriptModel.create(
      mockUpdateScriptData
    );

    const plugin = new UpdateTemplateService();
    const result = (await plugin.getUpdateTemplateWithDockerImage(
      createdData._id
    ))!;
    expect(result).toBeDefined();
    expect(result.imageStacks.length).toBe(2);
    expect(result.containerStacks.length).toBe(0);

    expect(result.imageStacks[0].imageName).toBeDefined();
    expect(result.imageStacks[0].tags.tag).toBeDefined();

    expect(result.imageStacks[1].imageName).toBeDefined();
    expect(result.imageStacks[1].tags.tag).toBeDefined();
  });

  test("When calling getUpdateTemplateWithDockerImage update", async () => {
    const data = (
      await schema.DockerImageModel.create(mockData.MockDockerImage)
    ).toJSON();
    const data2 = (
      await schema.DockerImageModel.create(mockData.MockDockerImage2)
    ).toJSON();

    const imageId = data._id;
    const tagId = data.tags[0]._id;

    const imageId2 = data2._id;
    const tagId2 = data2.tags[0]._id;

    const mockUpdateScriptData = JSON.parse(
      JSON.stringify(mockData.MockUpdateScriptData2)
    );

    mockUpdateScriptData.imageStacks[0].tag = tagId;
    mockUpdateScriptData.imageStacks[0].image = imageId;

    mockUpdateScriptData.imageStacks[1].tag = tagId2;
    mockUpdateScriptData.imageStacks[1].image = imageId2;

    mockUpdateScriptData.containerStacks = [];

    const createdData = await schema.UpdateScriptModel.create(
      mockUpdateScriptData
    );

    const plugin = new UpdateTemplateService();
    await plugin.patch(createdData);

    const result = (await plugin.getUpdateTemplateWithDockerImage(
      createdData._id
    ))!;
    expect(result).toBeDefined();
    expect(result.imageStacks.length).toBe(2);
    expect(result.containerStacks.length).toBe(0);

    expect(result.imageStacks[0].imageName).toBeDefined();
    expect(result.imageStacks[0].tags.tag).toBeDefined();

    expect(result.imageStacks[1].imageName).toBeDefined();
    expect(result.imageStacks[1].tags.tag).toBeDefined();
  });
});

import { mockData, utils } from "@etherdata-blockchain/common";
import { schema } from "@etherdata-blockchain/storage-model";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { InstallationService } from "../../../mongodb";

describe("Given a installation template service", () => {
  let dbServer: MongoMemoryServer;
  const oldEnv = process.env;
  let templateId: string | undefined = undefined;

  beforeAll(async () => {
    dbServer = await MongoMemoryServer.create();
    await mongoose.connect(
      dbServer.getUri().concat(mockData.MockConstant.mockDatabaseName)
    );
  });

  beforeEach(async () => {
    const service = new InstallationService();
    const dockerImage = await schema.DockerImageModel.create(
      mockData.MockDockerImage
    );
    const deepCopiedTemplate = JSON.parse(
      JSON.stringify(mockData.MockInstallationTemplateData)
    );
    deepCopiedTemplate.services[0].service.image.image = dockerImage._id;
    deepCopiedTemplate.services[0].service.image.tag = dockerImage.tags[0]._id;

    const template = await service.createWithValidation(deepCopiedTemplate, {
      upsert: false,
    });
    templateId = `${template!._id}`;
  });

  afterEach(async () => {
    await schema.InstallationTemplateModel.deleteMany({});
    await schema.DockerImageModel.deleteMany({});
  });

  afterAll(async () => {
    await dbServer.stop();
    await mongoose.disconnect();
  });

  test("When getting a installation template", async () => {
    const service = new InstallationService();
    const result = await service.getTemplateWithDockerImages(templateId!);
    expect(result!.template_tag).toBe(
      mockData.MockInstallationTemplateData.template_tag
    );
    expect(result!.description).toBe(
      mockData.MockInstallationTemplateData.description
    );
    expect(result!.version).toBe(mockData.MockInstallationTemplateData.version);
  });

  test("When generating a docker-compose file", async () => {
    const service = new InstallationService();
    const template = await service.getTemplateWithDockerImages(templateId!);
    const result = service.generateDockerComposeFile(template!);
    const parsedResult = utils.yaml.parse(result);
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
    expect(parsedResult.description).toBeUndefined();
  });

  test("When calling generating env file", () => {
    const service = new InstallationService();
    const result = service.generateEnvFile({ hello: "world", welcome: "back" });
    expect(result).toContain("hello=world\nwelcome=back");
  });
});

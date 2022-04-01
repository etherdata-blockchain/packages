import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { mockData, utils } from "@etherdata-blockchain/common";
import { InstallationTemplateModel } from "../db-schema";

describe("Given a docker image service", () => {
  let dbServer: MongoMemoryServer;

  beforeAll(async () => {
    dbServer = await MongoMemoryServer.create();
    await mongoose.connect(
      dbServer.getUri().concat(mockData.MockConstant.mockDatabaseName)
    );
  });

  afterEach(async () => {
    await InstallationTemplateModel.deleteMany({});
  });

  afterAll(async () => {
    await dbServer.stop();
    await mongoose.disconnect();
  });

  test("When creating a installation template with description", async () => {
    const data = {
      version: "3.0",
      services: [
        {
          name: "worker",
          service: {
            image: {
              image: utils.newObjectId(),
              imageName: "mock_image",
              tags: [],
              tag: utils.newObjectId(),
            },
            network_mode: "host",
            environment: [],
            labels: [],
            restart: "always",
            volumes: [],
          },
        },
      ],
      template_tag: "hello",
      description: "Hello world",
      created_by: "mock_user",
    };
    const resultId = await InstallationTemplateModel.create(data);
    const returnData = await InstallationTemplateModel.findOne({
      _id: resultId,
    });
    expect(returnData.description).toBeDefined();
  });
});

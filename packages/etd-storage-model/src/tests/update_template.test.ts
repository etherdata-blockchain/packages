import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import {
  interfaces,
  mockData,
  schema,
  utils,
} from "@etherdata-blockchain/common";
import { InstallationTemplateModel, UpdateScriptModel } from "../db-schema";

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

  test("When creating a update template with description", async () => {
    const data: interfaces.db.UpdateTemplateDBInterface = {
      name: "update template",
      description: "mock_template",
      targetDeviceIds: [],
      targetGroupIds: [],
      from: "mock_user",
      imageStacks: [],
      containerStacks: [],
    };
    const resultId = await UpdateScriptModel.create(data);
    const returnData = await UpdateScriptModel.findOne({
      _id: resultId,
    });
    expect(returnData!.description).toBe("mock_template");
  });
});

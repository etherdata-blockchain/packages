import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { interfaces, mockData, utils } from "@etherdata-blockchain/common";
import { DeviceModel, InstallationTemplateModel } from "../db-schema";
import { DeviceDBInterface } from "@etherdata-blockchain/common/dist/interfaces/db-interfaces";

describe("Given a device status", () => {
  let dbServer: MongoMemoryServer;

  beforeAll(async () => {
    dbServer = await MongoMemoryServer.create();
    await mongoose.connect(
      dbServer.getUri().concat(mockData.MockConstant.mockDatabaseName)
    );
  });

  afterEach(async () => {
    await DeviceModel.deleteMany({});
  });

  afterAll(async () => {
    await dbServer.stop();
    await mongoose.disconnect();
  });

  test("When creating a status", async () => {
    const data = {
      name: "mock_device",
      id: "mock_device_id",
      user: null,
      adminVersion: "1.12.5",
      networkSettings: {
        localIpAddress: "192.168.1.1",
        remoteIpAddress: "192.168.2.2",
      },
    };
    const resultId = await DeviceModel.create(data);
    const returnData = await DeviceModel.findOne({
      _id: resultId,
    });
    expect(returnData.networkSettings).toStrictEqual({
      localIpAddress: "192.168.1.1",
      remoteIpAddress: "192.168.2.2",
    });
  });
});

import moment from "moment";
import { configs, mockData } from "@etherdata-blockchain/common";
import { schema } from "@etherdata-blockchain/storage-model";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

import jwt from "jsonwebtoken";
import { DeviceRegistrationService } from "../../../mongodb";
import { StorageManagementService } from "../../../mongodb";

jest.mock("../../../mongodb/services/device/storage_management_item_service");

describe("Given a device plugin", () => {
  let dbServer: MongoMemoryServer;

  beforeAll(async () => {
    dbServer = await MongoMemoryServer.create();
    await mongoose.connect(dbServer.getUri().concat("etd"));
    process.env = {
      ...process.env,
      PUBLIC_SECRET: mockData.MockConstant.mockTestingSecret,
    };
  });

  afterEach(async () => {
    await schema.StorageItemModel.collection.deleteMany({});
    await schema.DeviceModel.collection.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await dbServer.stop();
  });

  test("When calling get item by id", async () => {
    const device = await schema.DeviceModel.create({
      name: "a",
      id: "a",
      adminVersion: "1.0.0",
      lastSeen: moment(),
    });
    expect(device._id).toBeDefined();

    const plugin = new DeviceRegistrationService();
    const pluginResult = await plugin.get("a");
    expect(pluginResult?.name).toBe("a");
    expect(pluginResult?.id).toBeDefined();
    expect(pluginResult?.isOnline).toBeTruthy();
  });

  test("When calling list all items", async () => {
    await new schema.DeviceModel({
      name: "a",
      id: "a",
      adminVersion: "1.0.0",
      lastSeen: moment()
        .subtract(configs.Configurations.maximumNotSeenDuration * 2, "seconds")
        .toDate(),
    }).save();

    await new schema.DeviceModel({
      name: "b",
      id: "b",
      adminVersion: "1.0.0",
      lastSeen: new Date(),
    }).save();

    await new schema.DeviceModel({
      name: "c",
      id: "c",
      adminVersion: "1.0.0",
    }).save();

    const plugin = new DeviceRegistrationService();
    const pluginResult = await plugin.list(
      configs.Configurations.defaultPaginationStartingPage,
      200
    );
    expect(pluginResult?.results.length).toBe(3);
    expect(pluginResult?.count).toBe(3);
    expect(pluginResult?.results[0].isOnline).toBeFalsy();
    expect(pluginResult?.results[1].isOnline).toBeTruthy();
    expect(pluginResult?.results[2].isOnline).toBeFalsy();
  });

  test("When calling online devices count", async () => {
    await schema.DeviceModel.create(mockData.MockDeviceStatus);
    await schema.DeviceModel.create(mockData.MockDeviceStatus2);

    const plugin = new DeviceRegistrationService();
    const count = await plugin.getOnlineDevicesCount();
    expect(count).toBe(1);
  });

  test("When creating device with docker logs", async () => {
    await schema.DeviceModel.create(mockData.MockDeviceStatusWithDocker);

    const plugin = new DeviceRegistrationService();
    const result = await plugin.list(1, 1);
    expect(result!.count).toBe(1);
    expect(result!.results[0].docker!.containers[0].logs).toBeDefined();
  });

  test("When calling list of admin versions", async () => {
    await new schema.DeviceModel(mockData.MockAdminVersion1).save();

    await new schema.DeviceModel(mockData.MockAdminVersion2).save();

    await new schema.DeviceModel(mockData.MockAdminVersion3).save();

    const plugin = new DeviceRegistrationService();
    const result = await plugin.getListOfAdminVersions();
    expect(result.length).toBe(3);
  });

  test("When calling list of admin versions v2", async () => {
    await new schema.DeviceModel(mockData.MockAdminVersion1).save();

    await new schema.DeviceModel(mockData.MockAdminVersion2).save();

    await new schema.DeviceModel(mockData.MockAdminVersion2).save();

    const plugin = new DeviceRegistrationService();
    const result = await plugin.getListOfAdminVersions();
    expect(result.length).toBe(2);
  });

  test("When calling auth with previous provided correct key", async () => {
    const plugin = new DeviceRegistrationService();
    const token = jwt.sign(
      { user: mockData.MockConstant.mockTestingUser },
      mockData.MockConstant.mockTestingSecret
    );
    const result = await plugin.auth(mockData.MockDeviceID, token);
    expect(result[0]).toBeTruthy();
  });

  test("When calling auth with previous provided incorrect key", async () => {
    //@ts-ignore
    StorageManagementService.mockImplementation(() => {
      return {
        auth: jest.fn(() => Promise.resolve(true)),
      };
    });

    const plugin = new DeviceRegistrationService();
    const token = jwt.sign(
      { user: mockData.MockConstant.mockTestingUser },
      mockData.MockConstant.mockInvalidTestingSecret
    );
    const result = await plugin.auth(mockData.MockDeviceID, token);
    expect(result[0]).toBeTruthy();
  });
});

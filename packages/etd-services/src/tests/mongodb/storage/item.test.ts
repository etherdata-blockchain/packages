import { mockData } from "@etherdata-blockchain/common";
import { schema } from "@etherdata-blockchain/storage-model";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { StorageManagementService } from "../../../mongodb";

describe("Given a storage item", () => {
  let dbServer: MongoMemoryServer;

  beforeAll(async () => {
    dbServer = await MongoMemoryServer.create();
    await mongoose.connect(dbServer.getUri().concat("etd"));
  });

  afterEach(async () => {
    await schema.StorageItemModel.deleteMany({});
    await schema.DeviceModel.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await dbServer.stop();
  });

  test("When calling get devices by user", async () => {
    await schema.StorageItemModel.create(mockData.MockStorageItem);
    await schema.StorageItemModel.create(mockData.MockStorageItem2);
    await schema.StorageItemModel.create(mockData.MockStorageItem3);
    await schema.DeviceModel.create(mockData.MockDeviceStatus);
    await schema.DeviceModel.create(mockData.MockDeviceStatus2);

    const plugin = new StorageManagementService();
    const results = await plugin.getDevicesByUser(
      1,
      mockData.MockStorageUserId
    );
    expect(results.count).toBe(2);
    expect(results.results.length).toBe(2);
    expect(results.currentPage).toBe(1);

    expect(results.results[0].deviceStatus.adminVersion).toBe(
      mockData.MockDeviceStatus.adminVersion
    );
  });

  test("When calling item by id", async () => {
    await schema.StorageItemModel.create(mockData.MockStorageItem);
    await schema.StorageItemModel.create(mockData.MockStorageItem2);
    await schema.DeviceModel.create(mockData.MockDeviceStatus);
    await schema.DeviceModel.create(mockData.MockDeviceStatus2);

    const plugin = new StorageManagementService();
    const result = await plugin.getDeviceByID(mockData.MockStorageItem.qr_code);
    const result2 = await plugin.getDeviceByID(
      mockData.MockStorageItem2.qr_code
    );

    expect(result.qr_code).toBe(mockData.MockStorageItem.qr_code);
    expect(result.deviceStatus.isOnline).toBeTruthy();

    expect(result2.qr_code).toBe(mockData.MockStorageItem2.qr_code);
    expect(result2.deviceStatus.isOnline).toBeFalsy();
  });

  test("When search device by id", async () => {
    await schema.StorageItemModel.create(mockData.MockStorageItem);
    await schema.StorageItemModel.create(mockData.MockStorageItem2);
    await schema.DeviceModel.create(mockData.MockDeviceStatus);
    await schema.DeviceModel.create(mockData.MockDeviceStatus2);

    const plugin = new StorageManagementService();
    const result = await plugin.search(mockData.MockStorageItem.qr_code);

    expect(result[0].qr_code).toBe(mockData.MockStorageItem.qr_code);
    expect(result).toHaveLength(1);
  });

  test("When calling auth", async () => {
    await schema.StorageItemModel.create(mockData.MockStorageItem);

    const plugin = new StorageManagementService();
    const authorized = plugin.auth(mockData.MockStorageItem.qr_code);
    expect(authorized).toBeTruthy();
  });
});

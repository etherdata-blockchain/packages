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

  test("When search device by local ip address", async () => {
    await schema.StorageItemModel.create(mockData.MockStorageItem);
    await schema.StorageItemModel.create(mockData.MockStorageItem2);
    await schema.StorageItemModel.create(mockData.MockStorageItem3);
    await schema.DeviceModel.create(mockData.MockDeviceStatus);
    await schema.DeviceModel.create(mockData.MockDeviceStatus2);
    await schema.DeviceModel.create(mockData.MockDeviceStatus3);

    const plugin = new StorageManagementService();
    const result = await plugin.search(
      mockData.MockDeviceStatus.networkSettings.localIpAddress
    );

    expect(result[0].status!.networkSettings.localIpAddress).toBe(
      mockData.MockDeviceStatus.networkSettings.localIpAddress
    );

    expect(result[1].status!.networkSettings.localIpAddress).toBe(
      mockData.MockDeviceStatus3.networkSettings.localIpAddress
    );
    expect(result).toHaveLength(2);
  });

  test("When search device by local remote address", async () => {
    await schema.StorageItemModel.create(mockData.MockStorageItem);
    await schema.StorageItemModel.create(mockData.MockStorageItem2);
    await schema.StorageItemModel.create(mockData.MockStorageItem3);
    await schema.DeviceModel.create(mockData.MockDeviceStatus);
    await schema.DeviceModel.create(mockData.MockDeviceStatus2);
    await schema.DeviceModel.create(mockData.MockDeviceStatus3);

    const plugin = new StorageManagementService();
    const result = await plugin.search(
      mockData.MockDeviceStatus.networkSettings.remoteIpAddress
    );

    expect(result[0].status!.networkSettings.localIpAddress).toBe(
      mockData.MockDeviceStatus.networkSettings.localIpAddress
    );

    expect(result[1].status!.networkSettings.localIpAddress).toBe(
      mockData.MockDeviceStatus2.networkSettings.localIpAddress
    );
    expect(result).toHaveLength(2);
  });

  test("When calling get device ids by user", async () => {
    const id1 = await schema.StorageItemModel.create(mockData.MockStorageItem);
    const id2 = await schema.StorageItemModel.create(mockData.MockStorageItem2);
    const id3 = await schema.StorageItemModel.create(mockData.MockStorageItem3);

    const service = new StorageManagementService();
    const result = await service.getDeviceIdsByUser(mockData.MockStorageUserId);
    expect(result).toHaveLength(2);
    expect(result[0]).toBe(id1.qr_code);
    expect(result[1]).toBe(id2.qr_code);
  });

  test("When calling get device ids by user", async () => {
    const service = new StorageManagementService();
    const result = await service.getDeviceIdsByUser(mockData.MockStorageUserId);
    expect(result).toHaveLength(0);
  });

  test("When calling register devices by user", async () => {
    const id1 = await schema.StorageItemModel.create(mockData.MockStorageItem);
    const id2 = await schema.StorageItemModel.create(mockData.MockStorageItem2);
    const id3 = await schema.StorageItemModel.create(mockData.MockStorageItem3);

    const service = new StorageManagementService();
    await service.registerDevicesByUser(mockData.MockStorageUserId2, [
      id1.qr_code,
      id2.qr_code,
      id3.qr_code,
    ]);
    const result = await service.getDeviceIdsByUser(
      mockData.MockStorageUserId2
    );
    expect(result).toHaveLength(3);
  });

  test("When calling unregister devices by user", async () => {
    const id1 = await schema.StorageItemModel.create(mockData.MockStorageItem);
    const id2 = await schema.StorageItemModel.create(mockData.MockStorageItem2);
    const id3 = await schema.StorageItemModel.create(mockData.MockStorageItem3);

    const service = new StorageManagementService();
    await service.unregisterDevicesByUser(mockData.MockStorageUserId2);
    const result = await service.getDeviceIdsByUser(
      mockData.MockStorageUserId2
    );
    expect(result).toHaveLength(0);
  });
});

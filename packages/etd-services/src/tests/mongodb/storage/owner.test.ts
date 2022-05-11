import moment from "moment";
import { configs, mockData } from "@etherdata-blockchain/common";
import { schema } from "@etherdata-blockchain/storage-model";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { StorageManagementOwnerService } from "../../../mongodb";

describe("Given a storage owner", () => {
  let dbServer: MongoMemoryServer;

  beforeAll(async () => {
    dbServer = await MongoMemoryServer.create();
    await mongoose.connect(dbServer.getUri().concat("etd"));
  });

  afterEach(async () => {
    await schema.StorageItemModel.deleteMany({});
    await schema.DeviceModel.deleteMany({});
    await schema.StorageOwnerModel.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await dbServer.stop();
  });

  test("When calling get list of users", async () => {
    const now = moment();
    const past = moment().subtract(
      configs.Configurations.maximumNotSeenDuration * 2,
      "seconds"
    );

    await schema.StorageOwnerModel.create(mockData.MockUser);
    await schema.StorageOwnerModel.create(mockData.MockUser2);
    await schema.StorageItemModel.create(mockData.MockStorageItem);
    await schema.StorageItemModel.create(mockData.MockStorageItem2);

    mockData.MockDeviceStatus.lastSeen = now;
    mockData.MockDeviceStatus2.lastSeen = past;

    await schema.DeviceModel.create(mockData.MockDeviceStatus);
    await schema.DeviceModel.create(mockData.MockDeviceStatus2);
    const plugin = new StorageManagementOwnerService();
    const result = await plugin.getListOfUsers(1);
    expect(result.count).toBe(2);
    expect(result.totalPage).toBe(1);
    expect(result.results.length).toBe(2);

    const user1 = result.results.find(
      (r) => r.user_id === mockData.MockUser.user_id
    );
    const user2 = result.results.find(
      (r) => r.user_id === mockData.MockUser2.user_id
    );
    expect(user1!.totalCount).toBe(2);
    expect(user1!.onlineCount).toBe(1);

    expect(user2!.totalCount).toBe(0);
    expect(user2!.onlineCount).toBe(0);
  });

  test("When calling get list of users with only one active user", async () => {
    const now = moment();

    await schema.StorageOwnerModel.create(mockData.MockUser);
    await schema.StorageItemModel.create(mockData.MockStorageItem);

    mockData.MockDeviceStatus.lastSeen = now
      .subtract(
        Math.floor(configs.Configurations.maximumNotSeenDuration * 0.5),
        "seconds"
      )
      .toDate() as any;

    await schema.DeviceModel.create(mockData.MockDeviceStatus);
    const plugin = new StorageManagementOwnerService();
    const result = await plugin.getListOfUsers(1);
    expect(result.count).toBe(1);
    expect(result.totalPage).toBe(1);
    expect(result.results.length).toBe(1);

    const user1 = result.results.find(
      (r) => r.user_id === mockData.MockUser.user_id
    );
    expect(user1!.totalCount).toBe(1);
    expect(user1!.onlineCount).toBe(1);
  });

  test("When calling get list of users without any active user", async () => {
    const now = moment();

    await schema.StorageOwnerModel.create(mockData.MockUser);
    await schema.StorageItemModel.create(mockData.MockStorageItem);

    mockData.MockDeviceStatus.lastSeen = now
      .subtract(
        Math.floor(configs.Configurations.maximumNotSeenDuration * 2),
        "seconds"
      )
      .toDate() as any;

    await schema.DeviceModel.create(mockData.MockDeviceStatus);
    const plugin = new StorageManagementOwnerService();
    const result = await plugin.getListOfUsers(1);
    expect(result.count).toBe(1);
    expect(result.totalPage).toBe(1);
    expect(result.results.length).toBe(1);

    const user1 = result.results.find(
      (r) => r.user_id === mockData.MockUser.user_id
    );
    expect(user1!.totalCount).toBe(1);
    expect(user1!.onlineCount).toBe(0);
  });

  test("When calling list of users without any user", async () => {
    const plugin = new StorageManagementOwnerService();
    const result = await plugin.getListOfUsers(1);
    expect(result.results.length).toBe(0);
  });

  test("When calling get owner by device id", async () => {
    const service = new StorageManagementOwnerService();
    const result = await service.getOwnerByDevice(mockData.MockDeviceID);
    expect(result).toBeUndefined();
  });

  test("When calling get owner by device id", async () => {
    await schema.StorageOwnerModel.create(mockData.MockUser);
    await schema.StorageOwnerModel.create(mockData.MockUser2);
    await schema.StorageItemModel.create(mockData.MockStorageItem);
    await schema.StorageItemModel.create(mockData.MockStorageItem2);
    const service = new StorageManagementOwnerService();
    const result = await service.getOwnerByDevice(
      mockData.MockStorageItem.qr_code
    );
    expect(result).toBeDefined();
    expect(result!.user_name).toBe(mockData.MockUser.user_name);
    expect(result!.user_id).toBe(mockData.MockUser.user_id);
  });

  test("When calling get devices by owner ids", async () => {
    await schema.StorageOwnerModel.create(mockData.MockUser);
    await schema.StorageOwnerModel.create(mockData.MockUser2);
    await schema.StorageItemModel.create(mockData.MockStorageItem);
    await schema.StorageItemModel.create(mockData.MockStorageItem2);
    const service = new StorageManagementOwnerService();
    let result = await service.getDeviceIdsByOwnerIdsOrNames([
      mockData.MockUser2.user_id,
    ]);
    expect(result).toHaveLength(0);
  });

  test("When calling get devices by owner ids", async () => {
    await schema.StorageOwnerModel.create(mockData.MockUser);
    await schema.StorageOwnerModel.create(mockData.MockUser2);
    await schema.StorageItemModel.create(mockData.MockStorageItem);
    await schema.StorageItemModel.create(mockData.MockStorageItem2);
    const service = new StorageManagementOwnerService();
    let result = await service.getDeviceIdsByOwnerIdsOrNames([
      mockData.MockUser.user_id,
    ]);
    expect(result).toHaveLength(2);
    expect(result).toStrictEqual([
      mockData.MockStorageItem.qr_code,
      mockData.MockStorageItem2.qr_code,
    ]);
  });

  test("When calling get devices by owner ids", async () => {
    await schema.StorageOwnerModel.create(mockData.MockUser);
    await schema.StorageOwnerModel.create(mockData.MockUser2);
    await schema.StorageItemModel.create(mockData.MockStorageItem);
    await schema.StorageItemModel.create(mockData.MockStorageItem2);
    const service = new StorageManagementOwnerService();
    let result = await service.getDeviceIdsByOwnerIdsOrNames([]);
    expect(result).toHaveLength(0);
  });

  test("When calling get devices by owner ids", async () => {
    await schema.StorageOwnerModel.create(mockData.MockUser);
    await schema.StorageOwnerModel.create(mockData.MockUser2);
    await schema.StorageItemModel.create(mockData.MockStorageItem);
    await schema.StorageItemModel.create(mockData.MockStorageItem2);
    const service = new StorageManagementOwnerService();
    let result = await service.getDeviceIdsByOwnerIdsOrNames([
      mockData.MockUser.user_name,
    ]);
    expect(result).toHaveLength(2);
  });

  test("When calling get devices by owner ids", async () => {
    await schema.StorageOwnerModel.create(mockData.MockUser);
    await schema.StorageOwnerModel.create(mockData.MockUser2);
    await schema.StorageItemModel.create(mockData.MockStorageItem);
    await schema.StorageItemModel.create(mockData.MockStorageItem2);
    const service = new StorageManagementOwnerService();
    let result = await service.getDeviceIdsByOwnerIdsOrNames([
      mockData.MockUser2.user_name,
    ]);
    expect(result).toHaveLength(0);
  });

  test("When calling get devices by owner ids", async () => {
    await schema.StorageOwnerModel.create(mockData.MockUser);
    await schema.StorageOwnerModel.create(mockData.MockUser2);
    await schema.StorageItemModel.create(mockData.MockStorageItem);
    await schema.StorageItemModel.create(mockData.MockStorageItem2);
    const service = new StorageManagementOwnerService();
    let result = await service.getDeviceIdsByOwnerIdsOrNames([
      mockData.MockUser.user_name,
      mockData.MockUser.user_id,
    ]);
    expect(result).toHaveLength(2);
  });

  test("When calling get devices by owner ids", async () => {
    await schema.StorageOwnerModel.create(mockData.MockUser);
    await schema.StorageOwnerModel.create(mockData.MockUser2);
    await schema.StorageItemModel.create(mockData.MockStorageItem);
    await schema.StorageItemModel.create(mockData.MockStorageItem2);
    const service = new StorageManagementOwnerService();
    let result = await service.getDeviceIdsByOwnerIdsOrNames([
      mockData.MockUser.user_id,
      mockData.MockUser2.user_id,
    ]);
    expect(result).toHaveLength(2);
    expect(result).toStrictEqual([
      mockData.MockStorageItem.qr_code,
      mockData.MockStorageItem2.qr_code,
    ]);
  });

  test("When calling get owner by device id", async () => {
    await schema.StorageOwnerModel.create(mockData.MockUser);
    await schema.StorageOwnerModel.create(mockData.MockUser2);
    await schema.StorageItemModel.create(mockData.MockStorageItem);
    await schema.StorageItemModel.create(mockData.MockStorageItem2);
    await schema.StorageItemModel.create(mockData.MockStorageItem3);
    const service = new StorageManagementOwnerService();
    let result = await service.getOwnerByDevice(
      mockData.MockStorageItem.qr_code
    );
    expect(result).toBeDefined();
    expect(result!.user_name).toBe(mockData.MockUser.user_name);
    expect(result!.user_id).toBe(mockData.MockUser.user_id);

    result = await service.getOwnerByDevice(mockData.MockStorageItem3.qr_code);
    expect(result).toBeDefined();
    expect(result!.user_name).toBe(mockData.MockUser2.user_name);
    expect(result!.user_id).toBe(mockData.MockUser2.user_id);
  });

  test("When calling search", async () => {
    await schema.StorageOwnerModel.create(mockData.MockUser);
    await schema.StorageOwnerModel.create(mockData.MockUser2);
    const service = new StorageManagementOwnerService();
    let result = await service.search(mockData.MockUser.user_name);
    expect(result).toHaveLength(2);

    result = await service.search(mockData.MockUser2.user_name);
    expect(result).toHaveLength(1);

    result = await service.search("");
    expect(result).toHaveLength(0);

    result = await service.search(mockData.MockUser2.user_id);
    expect(result).toHaveLength(1);

    result = await service.search(mockData.MockUser.user_id);
    expect(result).toHaveLength(2);
  });

  test("When calling search with some symbols", async () => {
    await schema.StorageOwnerModel.create({
      user_name: "mock_user_1",
      user_id: "+852-12345",
    });
    await schema.StorageOwnerModel.create({
      user_name: "mock_user_2",
      user_id: "+852-67890",
    });

    await schema.StorageOwnerModel.create({
      user_name: "某人姓名",
      user_id: "+852-12456",
    });

    const service = new StorageManagementOwnerService();
    let result = await service.search("+852-12");
    expect(result).toHaveLength(2);

    result = await service.search("某人");
    expect(result).toHaveLength(1);

    result = await service.search("");
    expect(result).toHaveLength(0);

    result = await service.search("+852-67890");
    expect(result).toHaveLength(1);
  });
});

import moment from "moment";
import { configs, mockData } from "@etherdata-blockchain/common";
import { schema } from "@etherdata-blockchain/storage-model";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { StorageManagementOwnerService } from "../../../mongodb/services/device/storage_management_owner_service";

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

  test("When calling list of users without any user", async () => {
    const plugin = new StorageManagementOwnerService();
    const result = await plugin.getListOfUsers(1);
    expect(result.results.length).toBe(0);
  });
});

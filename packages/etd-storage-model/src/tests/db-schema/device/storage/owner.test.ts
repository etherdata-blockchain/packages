import { mockData } from "@etherdata-blockchain/common";
import { schema } from "@etherdata-blockchain/storage-model";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { StorageOwnerGroupModel } from "../../../../db-schema";
import {MockStorageUserGroupId} from "@etherdata-blockchain/common/dist/mockdata";

describe("Given a storage owner", () => {
  let dbServer: MongoMemoryServer;

  beforeAll(async () => {
    dbServer = await MongoMemoryServer.create();
    await mongoose.connect(dbServer.getUri().concat("etd")); // etd表示的为数据库中集合的名称
  });

  afterEach(async () => {
    await schema.StorageOwnerModel.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await dbServer.stop();
  });

  test("test for saving documents of StorageOwnerModel", async () => {

    const resultId1 = await schema.StorageOwnerModel.create(mockData.MockUser);
    const resultId2 = await schema.StorageOwnerModel.create(mockData.MockUser2);

    const resultData1 = await schema.StorageOwnerModel.findOne({
      _id: resultId1,
    });
    const resultData2 = await schema.StorageOwnerModel.findOne({
      _id: resultId2,
    });
    expect(resultData1!.user_name).toBe("test");
    expect(resultData2!.user_name).toBe("test_2");
  });

  test("test for saving documents of StorageOwnerGroupModel", async () => {

    const resultId1 = await StorageOwnerGroupModel.create(mockData.MockUserGroup1);
    const resultId2 = await StorageOwnerGroupModel.create(mockData.MockUserGroup2);

    const resultData1 = await StorageOwnerGroupModel.findOne({
      _id: resultId1,
    });
    const resultData2 = await StorageOwnerGroupModel.findOne({
      _id: resultId2,
    });
    expect(resultData1!.group_id).toBe(mockData.MockStorageUserGroupId);
    expect(resultData2!.group_id).toBe(mockData.MockStorageUserGroupId2);
  });
});

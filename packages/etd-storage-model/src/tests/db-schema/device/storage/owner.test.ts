import { mockData } from "@etherdata-blockchain/common";
import { schema } from "@etherdata-blockchain/storage-model";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import {MockUserGroup1, MockUserGroup2} from "@etherdata-blockchain/common/mockdata";

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

    await schema.StorageOwnerModel.create(mockData.MockUser);
    await schema.StorageOwnerModel.create(mockData.MockUser2);

    const insertedOwner = schema.StorageOwnerModel.find({});
    expect(insertedOwner[0]).toEqual(mockData.MockUser);
    expect(insertedOwner[1]).toEqual(mockData.MockUser2);
  });

  test("test for saving documents of StorageOwnerGroupModel", async () => {

    await schema.StorageOwnerGroupModel.create(mockData.MockUserGroup1);
    await schema.StorageOwnerGroupModel.create(mockData.MockUserGroup2);

    const insertedOwnerGroup = schema.StorageOwnerGroupModel.find({});
    expect(insertedOwnerGroup[0]).toEqual(mockData.MockUser);
    expect(insertedOwnerGroup[1]).toEqual(mockData.MockUser2);
  });
});

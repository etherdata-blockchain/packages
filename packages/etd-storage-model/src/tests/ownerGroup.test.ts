import { MongoMemoryServer } from "mongodb-memory-server";
import mogoose from "mongoose";
import { 
    interfaces,
    mockData,
} from "@etherdata-blockchain/common";
import { StorageOwnerGroupModel } from "../db-schema";
import mongoose from "mongoose";

describe("Given onwer group storage situation", () => {
  let dbServer: MongoMemoryServer;

  beforeAll(async () => {
    dbServer = await MongoMemoryServer.create();
    await mongoose.connect(
      dbServer.getUri().concat(mockData.MockConstant.mockDatabaseName)
    );
  });

  afterEach(async () => {
    await StorageOwnerGroupModel.deleteMany({});
  });

  afterAll(async () => {
    await dbServer.stop();
    await mongoose.disconnect();
  });

  test("When creating a owner group orm", async () => {
    const data: interfaces.db.StorageUserGroupDBInterface = {
      usergroup_name: "user group name",
      usergroup_id: "user group id",
    };
    const resultId = await StorageOwnerGroupModel.create(data);
    const returnData = await StorageOwnerGroupModel.findOne({
      _id: resultId,
    });
    expect(returnData!.usergroup_name).toBe("user group name");
    expect(returnData!.usergroup_id).toBe("user group id");
  })
})
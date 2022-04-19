import { MongoMemoryServer } from "mongodb-memory-server";
import mogoose from "mongoose";
import { 
    interfaces,
    mockData,
} from "@etherdata-blockchain/common";
import { StorageOwnerGroupModel, StorageOwnerModel } from "../db-schema";
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
    await StorageOwnerModel.deleteMany({});
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
  });

  test("get Users by Group_id", async () => {
    const userData: interfaces.db.StorageUserDBInterface = {
      user_name: "user name",
      user_id: "user id",
      coinbase: "coinbase",
      group_id: "1",
    };
    const groupData: interfaces.db.StorageUserGroupDBInterface = {
      usergroup_name: "user group name",
      usergroup_id: "1",
    };
    await StorageOwnerGroupModel.create(groupData);
    await StorageOwnerModel.create(userData);
    const pipeline: any[] = [
      {
        $lookup: {
          from: "storage_management_owner",
          localField: "usergroup_id",
          foreignField: "group_id",
          as: "user",
        },
      },
    ];

    const returnData: any = await StorageOwnerGroupModel.aggregate(pipeline).exec();
    expect(returnData[0]!.user[0].coinbase).toBe(userData.coinbase);
    expect(returnData[0]!.user[0].user_id).toBe(userData.user_id);
    expect(returnData[0]!.user[0].user_name).toBe(userData.user_name);
  });
})
import { MongoMemoryServer } from "mongodb-memory-server";
import mogoose from "mongoose";
import { 
    interfaces,
    mockData,
} from "@etherdata-blockchain/common";
import { StorageOwnerModel } from "../db-schema";
import mongoose from "mongoose";

describe("Given onwer storage situation", () => {
  let dbServer: MongoMemoryServer;

  beforeAll(async () => {
    dbServer = await MongoMemoryServer.create();
    await mongoose.connect(
      dbServer.getUri().concat(mockData.MockConstant.mockDatabaseName)
    );
  });

  afterEach(async () => {
    await StorageOwnerModel.deleteMany({});
  });

  afterAll(async () => {
    await dbServer.stop();
    await mongoose.disconnect();
  });

  test("When creating a owner orm", async () => {
    const data: interfaces.db.StorageUserDBInterface = {
      user_name: "user name",
      user_id: "user id",
      coinbase: "coinbase",
      group_id: "group_id",
    };
    const resultId = await StorageOwnerModel.create(data);
    const returnData = await StorageOwnerModel.findOne({
      _id: resultId,
    });
    expect(returnData!.user_name).toBe("user name");
    expect(returnData!.user_id).toBe("user id");
    expect(returnData!.coinbase).toBe("coinbase");
    expect(returnData!.group_id).toBe("group_id");
  });
})
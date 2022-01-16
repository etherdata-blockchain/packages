import { utils } from "@etherdata-blockchain/common";
import { schema } from "@etherdata-blockchain/storage-model";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import moment from "moment";

describe("Given a general service", () => {
  let dbServer: MongoMemoryServer;

  beforeAll(async () => {
    dbServer = await MongoMemoryServer.create();
    await mongoose.connect(dbServer.getUri().concat("etd"));
  });

  afterEach(async () => {
    await schema.DeviceModel.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await dbServer.stop();
  });

  test("When calling get item by utils new object id", async () => {
    const device = await schema.DeviceModel.create({
      name: "a",
      id: "a",
      adminVersion: "1.0.0",
      lastSeen: moment(),
    });

    const strId = device._id.toString();
    const newObjectId = utils.newObjectId(strId);
    const foundDevice = await schema.DeviceModel.findOne({
      _id: newObjectId,
    }).exec();

    expect(foundDevice).toBeDefined();
  });
});

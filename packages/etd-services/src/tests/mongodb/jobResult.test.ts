import { schema } from "@etherdata-blockchain/storage-model";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { StorageManagementService } from "../../mongodb/services/device/storage_management_item_service";
import { JobResultService } from "../../mongodb/services/job/job_result_service";

jest.mock("../../mongodb/services/device/storage_management_item_service");

describe("Job Result Test", () => {
  let dbServer: MongoMemoryServer;

  beforeAll(async () => {
    dbServer = await MongoMemoryServer.create();
    await mongoose.connect(dbServer.getUri().concat("etd"));
  });

  afterEach(async () => {
    await schema.JobResultModel.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await dbServer.stop();
  });

  test("Get a result", async () => {
    //@ts-ignore
    StorageManagementService.mockImplementation(() => {
      return {
        findDeviceById: jest.fn(() => Promise.resolve({ a: "a" })),
      };
    });
    await new schema.JobResultModel({
      jobId: 1,
      deviceID: "1",
      time: new Date(2020, 4, 1),
      from: "a",
      command: {
        type: "rpc",
        value: ["blockNumber"],
      },
      result: "0",
      success: true,
      commandType: "",
    }).save();

    const plugin = new JobResultService();
    const result = await plugin.getResults("a");
    expect(result).toBeDefined();
    expect(result?.length).toBe(1);
    expect(await schema.JobResultModel.count()).toBe(0);
  });

  test("Get no result", async () => {
    await schema.JobResultModel.createCollection();
    const plugin = new JobResultService();
    const result = await plugin.getResults("a");
    expect(result?.length).toBe(0);
    expect(await schema.JobResultModel.count()).toBe(0);
  });

  test("Get a result 2", async () => {
    await new schema.JobResultModel({
      deviceID: "1",
      jobId: 1,
      time: new Date(2020, 4, 1),
      from: "a",
      command: {
        type: "rpc",
        value: ["blockNumber"],
      },
      result: "0",
      success: true,
      commandType: "",
    }).save();

    await new schema.JobResultModel({
      jobId: 1,
      deviceID: "1",
      time: new Date(2020, 5, 1),
      from: "a",
      command: {
        type: "rpc",
        value: ["blockNumber"],
      },
      result: "0",
      success: true,
    }).save();

    const plugin = new JobResultService();
    const result = await plugin.getResults("a");
    expect(result?.length).toBe(2);
    expect(await schema.JobResultModel.count()).toBe(0);
  });
});

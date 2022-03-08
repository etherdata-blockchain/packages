import {
  enums,
  interfaces,
  configs,
  mockData,
} from "@etherdata-blockchain/common";
import { schema } from "@etherdata-blockchain/storage-model";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { StorageManagementService } from "../../mongodb";
import { JobResultService } from "../../mongodb";

jest.mock("../../mongodb/services/device/storage_management_item_service");

describe("Job Result Test", () => {
  let dbServer: MongoMemoryServer;

  /**
   * Job doesn't exceed limit
   */
  const pendingJob1: interfaces.db.PendingJobDBInterface<any> = {
    targetDeviceId: mockData.MockDeviceID,
    from: "admin",
    task: {
      type: enums.JobTaskType.Web3,
      value: {},
    },
    createdAt: "",
    retrieved: false,
    tries: configs.Configurations.maximumRetiresAllowed - 1,
  };

  /**
   * Job exceeds tries' limit
   */
  const pendingJob2: interfaces.db.PendingJobDBInterface<any> = {
    targetDeviceId: mockData.MockDeviceID,
    from: "admin",
    task: {
      type: enums.JobTaskType.Web3,
      value: {},
    },
    createdAt: "",
    retrieved: false,
    tries: configs.Configurations.maximumRetiresAllowed + 1,
  };

  /**
   * Job is success
   */
  const jobResult1: interfaces.db.JobResultDBInterface = {
    jobId: "",
    time: new Date(),
    deviceID: "",
    from: "admin",
    command: undefined,
    result: undefined,
    success: true,
    commandType: enums.JobTaskType.Web3,
  };

  /**
   * Job is failed
   */
  const jobResult2: interfaces.db.JobResultDBInterface = {
    jobId: "",
    time: new Date(),
    deviceID: "",
    from: "admin",
    command: undefined,
    result: undefined,
    success: false,
    commandType: enums.JobTaskType.Web3,
  };

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

  test("When submitting a result while tries exceeds limit", async () => {
    const job = await schema.PendingJobModel.create(pendingJob2);
    jobResult1.jobId = job._id;
    const jobService = new JobResultService();
    const { success } = await jobService.submitResult(jobResult1, job);
    expect(success).toBeFalsy();
  });

  test("When submitting a result while tries exceeds limit", async () => {
    const job = await schema.PendingJobModel.create(pendingJob2);
    jobResult1.jobId = job._id;
    const jobService = new JobResultService();
    const { success } = await jobService.submitResult(jobResult2, job);
    expect(success).toBeFalsy();
  });

  test("When submitting a result while tries doesn't exceed limit", async () => {
    const job = await schema.PendingJobModel.create(pendingJob1);
    jobResult1.jobId = job._id;
    const jobService = new JobResultService();
    const { success } = await jobService.submitResult(jobResult1, job);
    expect(success).toBeTruthy();
  });

  test("When submitting a result while tries doesn't exceed limit", async () => {
    const job = await schema.PendingJobModel.create(pendingJob1);
    jobResult1.jobId = job._id;
    const jobService = new JobResultService();
    const { success } = await jobService.submitResult(jobResult2, job);
    expect(success).toBeTruthy();
  });

  test("When submitting a result while tries doesn't exceed limit", async () => {
    let job = await schema.PendingJobModel.create(pendingJob1);
    jobResult1.jobId = job._id;
    const jobService = new JobResultService();
    let result = await jobService.submitResult(jobResult2, job);
    expect(result.success).toBeTruthy();
    let job2 = await schema.PendingJobModel.findOne({ _id: job._id });
    result = await jobService.submitResult(jobResult2, job2!);
    expect(result.success).toBeFalsy();
  });
});

import { schema } from "@etherdata-blockchain/storage-model";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { StorageManagementService } from "../../mongodb/services/device/storage_management_item_service";
import { JobResultService } from "../../mongodb/services/job/job_result_service";
import { PendingJobService } from "../../mongodb/services/job/pending_job_service";

describe("Given a pending job", () => {
  let dbServer: MongoMemoryServer;
  beforeAll(async () => {
    dbServer = await MongoMemoryServer.create();
    await mongoose.connect(dbServer.getUri().concat("etd"));
  });

  afterEach(async () => {
    await schema.PendingJobModel.collection.drop();
  });

  afterAll(() => {
    dbServer.stop();
  });

  test("When getting a job", async () => {
    await new schema.PendingJobModel({
      targetDeviceId: "1",
      time: new Date(2020, 5, 1),
      from: "a",
      task: {
        type: "rpc",
        value: [],
      },
    }).save();

    const plugin = new PendingJobService();
    let job = await plugin.getJob("1");
    expect(job).toBeDefined();
    expect(await schema.PendingJobModel.count()).toBe(1);

    job = await plugin.getJob("1");
    expect(job).toBeUndefined();
    expect(await schema.PendingJobModel.count()).toBe(1);
  });

  test("When getting no job", async () => {
    await schema.PendingJobModel.createCollection();
    const plugin = new PendingJobService();
    const job = await plugin.getJob("1");
    expect(job).not.toBeDefined();
    expect(await schema.PendingJobModel.count()).toBe(0);
  });

  test("When getting a job", async () => {
    await new schema.PendingJobModel({
      targetDeviceId: "1",
      time: new Date(2020, 4, 1),
      from: "a",
      task: {
        type: "rpc",
        value: [],
      },
    }).save();

    await new schema.PendingJobModel({
      targetDeviceId: "1",
      from: "a",
      task: {
        type: "rpc",
        value: [],
      },
    }).save();

    const plugin = new PendingJobService();
    const job = await plugin.getJob("1");
    expect(job).toBeDefined();
    expect(await schema.PendingJobModel.count()).toBe(2);
  });
});

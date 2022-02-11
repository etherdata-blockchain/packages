import { enums, interfaces } from "@etherdata-blockchain/common";
import { schema } from "@etherdata-blockchain/storage-model";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { PendingJobService } from "../../mongodb";
import { JobTaskType } from "@etherdata-blockchain/common/dist/enums";

describe("Given a pending job", () => {
  const job1: interfaces.db.PendingJobDBInterface<enums.UpdateTemplateValueType> =
    {
      targetDeviceId: "device-1",
      from: "admin",
      task: {
        type: enums.JobTaskType.UpdateTemplate,
        value: {
          templateId: "1",
        },
      },
      createdAt: "",
      retrieved: false,
    };

  const job2: interfaces.db.PendingJobDBInterface<enums.UpdateTemplateValueType> =
    {
      targetDeviceId: "device-2",
      from: "admin",
      task: {
        type: enums.JobTaskType.UpdateTemplate,
        value: {
          templateId: "1",
        },
      },
      createdAt: "",
      retrieved: false,
    };

  const job3: interfaces.db.PendingJobDBInterface<enums.UpdateTemplateValueType> =
    {
      targetDeviceId: "device-3",
      from: "admin",
      task: {
        type: enums.JobTaskType.UpdateTemplate,
        value: {
          templateId: "1",
        },
      },
      createdAt: "",
      retrieved: true,
    };

  const job4: interfaces.db.PendingJobDBInterface<enums.UpdateTemplateValueType> =
    {
      targetDeviceId: "device-3",
      from: "admin",
      task: {
        type: enums.JobTaskType.UpdateTemplate,
        value: {
          templateId: "1",
        },
      },
      createdAt: "",
      retrieved: false,
    };

  const job5: interfaces.db.PendingJobDBInterface<enums.UpdateTemplateValueType> =
    {
      targetDeviceId: "device-3",
      from: "admin",
      task: {
        type: enums.JobTaskType.Web3,
        value: {
          templateId: "1",
        },
      },
      createdAt: "",
      retrieved: false,
    };

  const job6: interfaces.db.PendingJobDBInterface<enums.UpdateTemplateValueType> =
    {
      targetDeviceId: "device-3",
      from: "admin",
      task: {
        type: enums.JobTaskType.UpdateTemplate,
        value: {
          templateId: "2",
        },
      },
      createdAt: "",
      retrieved: false,
    };

  let dbServer: MongoMemoryServer;
  beforeAll(async () => {
    dbServer = await MongoMemoryServer.create();
    await mongoose.connect(dbServer.getUri().concat("etd"));
  });

  afterEach(async () => {
    await schema.PendingJobModel.collection.drop();
  });

  afterAll(async () => {
    await dbServer.stop();
    await mongoose.disconnect();
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

  test("When calling getNumberOfNotRetrievedJobs", async () => {
    await schema.PendingJobModel.insertMany([job1, job2, job3]);
    const service = new PendingJobService();
    const result = await service.getNumberOfNotRetrievedJobs({
      "task.type": JobTaskType.UpdateTemplate,
    });
    expect(result).toBe(2);
  });

  test("When calling getNumberOfNotRetrievedJobs", async () => {
    await schema.PendingJobModel.insertMany([job1, job2, job5]);
    const service = new PendingJobService();
    const result = await service.getNumberOfNotRetrievedJobs({
      "task.type": JobTaskType.UpdateTemplate,
    });
    expect(result).toBe(2);
  });

  test("When calling getNumberOfNotRetrievedJobs", async () => {
    await schema.PendingJobModel.insertMany([job1, job2, job5]);
    const service = new PendingJobService();
    const result = await service.getNumberOfNotRetrievedJobs({
      "task.type": JobTaskType.Web3,
    });
    expect(result).toBe(1);
  });

  test("When calling getNumberOfNotRetrievedJobs", async () => {
    await schema.PendingJobModel.insertMany([job1, job2, job4]);
    const service = new PendingJobService();
    const result = await service.getNumberOfNotRetrievedJobs({
      "task.type": JobTaskType.UpdateTemplate,
    });
    expect(result).toBe(3);
  });

  test("When calling getNumberOfNotRetrievedJobs", async () => {
    await schema.PendingJobModel.insertMany([job3, job4]);
    const service = new PendingJobService();
    const result = await service.getNumberOfNotRetrievedJobs({
      "task.type": JobTaskType.UpdateTemplate,
    });
    expect(result).toBe(1);
  });

  test("When calling getNumberOfNotRetrievedJobs", async () => {
    await schema.PendingJobModel.insertMany([job4, job6]);
    const service = new PendingJobService();
    const result = await service.getNumberOfNotRetrievedJobs({
      "task.type": JobTaskType.UpdateTemplate,
      "task.value.templateId": "2",
    });
    expect(result).toBe(1);
  });
});

import { mockData } from "@etherdata-blockchain/common";
import { schema } from "@etherdata-blockchain/storage-model";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { PendingJobService } from "../../mongodb/services/job/pending_job_service";

describe("Given a general service", () => {
  let dbServer: MongoMemoryServer;

  beforeAll(async () => {
    dbServer = await MongoMemoryServer.create();
    await mongoose.connect(dbServer.getUri().concat("etd"));
  });

  afterEach(async () => {
    await schema.PendingJobModel.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await dbServer.stop();
  });

  test("When calling create function on service", async () => {
    const service = new PendingJobService();
    await service.create(mockData.MockPendingJob as any, { upsert: false });
    expect(await service.count()).toBe(1);
  });

  test("When calling patch function on service", async () => {
    const service = new PendingJobService();
    const created = await service.create(mockData.MockPendingJob as any, {
      upsert: true,
    });
    expect(created).toBeDefined();
    expect(await service.count()).toBe(1);
    await service.patch({ ...mockData.MockPendingJob, from: "tester" } as any);
    const result = await service.get(created!._id);
    expect(result!.from).toBe("tester");
  });

  test("When calling filter function on service", async () => {
    const service = new PendingJobService();
    await service.patch({ ...mockData.MockPendingJob, from: "tester" } as any);
    const result = await service.filter({ from: "tester" }, 1, 1);
    expect(result!.count).toBe(1);
  });

  test("When calling pagination function on page number 0", async () => {
    const service = new PendingJobService();
    await service.patch(mockData.MockPendingJob as any);
    await expect(
      service.filter({ from: "tester" }, 0, 1)
    ).rejects.toThrowError();
  });
});

import { interfaces, mockData, utils } from "@etherdata-blockchain/common";
import { schema } from "@etherdata-blockchain/storage-model";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { ExecutionPlanService } from "../../../mongodb";

describe("Given a execution plan service", () => {
  let dbServer: MongoMemoryServer;

  beforeAll(async () => {
    dbServer = await MongoMemoryServer.create();
    await mongoose.connect(dbServer.getUri().concat("etd"));
  });

  afterEach(async () => {
    await schema.ExecutionPlanModel.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await dbServer.stop();
  });

  test("When calling get execution plan", async () => {
    const service = new ExecutionPlanService();
    const id = utils.newObjectId();
    const id2 = utils.newObjectId();

    const data: interfaces.db.ExecutionPlanDBInterface = {
      createdAt: new Date(),
      updateTemplate: id,
      isDone: false,
      isError: false,
      name: mockData.MockExecutionPlanName,
      description: mockData.MockExecutionPlanDescription,
    };

    const data2: interfaces.db.ExecutionPlanDBInterface = {
      createdAt: new Date(),
      updateTemplate: id,
      isDone: false,
      isError: false,
      name: mockData.MockExecutionPlanName2,
      description: mockData.MockExecutionPlanDescription2,
    };

    const data3: interfaces.db.ExecutionPlanDBInterface = {
      createdAt: new Date(),
      updateTemplate: id2,
      isDone: false,
      isError: false,
      name: mockData.MockExecutionPlanName3,
      description: mockData.MockExecutionPlanDescription3,
    };

    await service.create(data as any, { upsert: false });
    await service.create(data2 as any, { upsert: false });
    await service.create(data3 as any, { upsert: false });

    let result = await service.getPlans(id.toHexString());
    let result2 = await service.getPlans(id2.toHexString());
    expect(result?.length).toBe(2);
    expect(result2?.length).toBe(1);

    await service.delete(id.toHexString());
    result = await service.getPlans(id.toHexString());
    expect(result?.length).toBe(0);
  });
});

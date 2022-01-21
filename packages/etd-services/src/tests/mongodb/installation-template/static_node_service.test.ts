import { mockData } from "@etherdata-blockchain/common";
import { schema } from "@etherdata-blockchain/storage-model";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { StaticNodeService } from "../../../mongodb/services/installation-template/static_node_service";

describe("Given a installation template service", () => {
  let dbServer: MongoMemoryServer;
  const oldEnv = process.env;
  let templateId: string | undefined = undefined;

  beforeAll(async () => {
    dbServer = await MongoMemoryServer.create();
    await mongoose.connect(
      dbServer.getUri().concat(mockData.MockConstant.mockDatabaseName)
    );
  });

  afterEach(async () => {
    await schema.StaticNodeModel.deleteMany({});
  });

  afterAll(async () => {
    await dbServer.stop();
    await mongoose.disconnect();
  });

  test("When getting a static nodes json", async () => {
    const service = new StaticNodeService();
    const nodes = [mockData.MockStaticNode, mockData.MockStaticNode2];
    expect(service.staticNodesToJSON(nodes as any[])).toContain(
      `["${mockData.MockStaticNode.nodeURL}","${mockData.MockStaticNode2.nodeURL}"]`
    );
  });

  test("When getting a static nodes json", async () => {
    const service = new StaticNodeService();
    const nodes: any[] = [];
    expect(service.staticNodesToJSON(nodes as any[])).toContain(`[]`);
  });
});

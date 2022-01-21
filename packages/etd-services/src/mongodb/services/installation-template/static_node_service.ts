import { schema } from "@etherdata-blockchain/storage-model";
import { enums } from "@etherdata-blockchain/common";
import { Model } from "mongoose";
import { BaseMongoDBService } from "../../db_service";

/**
 * Static node service
 */
export class StaticNodeService extends BaseMongoDBService<schema.IStaticNode> {
  serviceName = enums.DBServiceName.staticNode;
  protected model: Model<schema.IStaticNode> = schema.StaticNodeModel;

  /**
   * Generate a static-nodes.json from static nodes
   * @param nodes
   */
  staticNodesToJSON(nodes: schema.IStaticNode[]): string {
    const result = nodes.map((n) => n.nodeURL);
    return JSON.stringify(result);
  }
}

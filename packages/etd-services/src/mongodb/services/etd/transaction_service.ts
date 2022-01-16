import { schema } from "@etherdata-blockchain/storage-model";
import { enums } from "@etherdata-blockchain/common";
import { Query } from "mongoose";
import { BaseMongoDBService } from "../../db_service";

/**
 * Transaction db plugin
 */
export class TransactionDBPlugin extends BaseMongoDBService<schema.ITransaction> {
  serviceName: enums.DBServiceName = enums.DBServiceName.transaction;
  protected model = schema.TransactionModel;

  // eslint-disable-next-line require-jsdoc
  protected performList(): Query<schema.ITransaction[], schema.ITransaction[]> {
    //@ts-ignore
    return this.model.find({}).sort({ time: -1 });
  }
}

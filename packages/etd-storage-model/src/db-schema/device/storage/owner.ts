/**
 * Create a storage owner orm
 */
import mongoose, { Document, model, Model, Schema } from "mongoose";
import { enums, interfaces } from "@etherdata-blockchain/common";

export interface IStorageOwner
  extends Document,
    interfaces.db.StorageUserDBInterface {
  onlineCount?: number;
  totalCount?: number;
}

export const storageOwnerSchema = new Schema<IStorageOwner>(
  {
    user_id: { type: "string", index: true, unique: true },
    user_name: "string",
    coinbase: "string",
  },
  { collection: "storage_management_owner", toJSON: { virtuals: true } }
);

/**
 *
 */
export const StorageOwnerModel: Model<IStorageOwner> =
  mongoose.models.storage_owner ??
  model<IStorageOwner>(enums.ModelName.storageOwner, storageOwnerSchema);

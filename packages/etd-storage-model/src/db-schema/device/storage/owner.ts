/**
 * Create a storage owner orm
 */
import mongoose, {
  Document, model, Model, Schema,
} from "mongoose";
import { enums, interfaces } from "@etherdata-blockchain/common";

export interface IStorageOwner
    extends Document,
        interfaces.db.StorageUserDBInterface {
    onlineCount?: number;
    totalCount?: number;
}

export interface IStorageOwnerGroup
    extends Document{
    group_id: string;
    group_name: string;
    group_intro: string;
}

export const storageOwnerSchema = new Schema<IStorageOwner>(
  {
    user_id: { type: "string", index: true, unique: true },
    group_id: { type: "string", index: true, unique: true },
    user_name: "string",
    coinbase: "string",
  },
  { collection: "storage_management_owner", toJSON: { virtuals: true } },
);

export const storageOwnerGroupSchema = new Schema<IStorageOwnerGroup>(
  {
    group_id: { type: "string", index: true, unique: true },
    group_name: "string",
    group_intro: "string",
  },
  { collection: "storage_management_owner_group", toJSON: { virtuals: true } },
);

/**
 *
 */
export const StorageOwnerModel: Model<IStorageOwner> = mongoose.models[enums.ModelName.storageOwner]
?? model<IStorageOwner>(enums.ModelName.storageOwner, storageOwnerSchema);

export const storageOwnerGroupModel: Model<IStorageOwnerGroup> = mongoose.models[enums.ModelName.storageOwnerGroup]
?? model<IStorageOwnerGroup>(enums.ModelName.storageOwnerGroup, storageOwnerGroupSchema)
/**
 * Create a storage ownerGroup orm
 */
 import mongoose, { Document, model, Model, Schema } from "mongoose";
 import { enums, interfaces } from "@etherdata-blockchain/common";
 
 export interface IStorageOwnerGroup 
   extends Document,
     interfaces.db.StorageUserGroupDBInterface {
   allUserOnlineCount?: number;
   allUserTotalCount?: number;
 }
 
 export const storageOwnerGroupSchema = new Schema<IStorageOwnerGroup>(
   {
     usergroup_name: { type: "string", index: true, unique: true },
     usergroup_id: "string",
   },
   { collection: "storage_management_owner_group", toJSON: { virtuals: true } }
 );
 
 /**
  *
  */
 export const StorageOwnerGroupModel: Model<IStorageOwnerGroup> =
   mongoose.models[enums.ModelName.storageOwnerGroup] ??
   model<IStorageOwnerGroup>(enums.ModelName.storageOwnerGroup, storageOwnerGroupSchema);
 
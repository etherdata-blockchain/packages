/**
 * Create a storage orm
 */
import mongoose, { Document, model, Model, Schema } from "mongoose";
import { enums, interfaces } from "@etherdata-blockchain/common";
import { IDevice } from "../device";

export interface IStorageItem
  extends Document,
    interfaces.db.StorageItemDBInterface {
  deviceStatus: IDevice;
}

export const storageItemSchema = new Schema<IStorageItem>(
  {
    qr_code: { type: "string", unique: true },
    owner_id: { type: "string" },
  },
  { collection: "storage_management_item", toJSON: { virtuals: true } }
);

storageItemSchema.virtual("deviceStatus", {
  localField: "qr_code",
  foreignField: "id",
  ref: "device",
  justOne: true,
});

/**
 *
 */
export const StorageItemModel: Model<IStorageItem> =
  mongoose.models[enums.ModelName.storageItem] ??
  model<IStorageItem>(enums.ModelName.storageItem, storageItemSchema);

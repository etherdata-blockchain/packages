/**
 * Create a user object for mongoose ORM.
 *
 * This file contains the user dbSchema for mongodb user collection
 */
import mongoose, { Document, model, Schema } from "mongoose";
import moment from "moment";
import { configs, interfaces } from "@etherdata-blockchain/common";

export interface IDevice extends Document, interfaces.db.DeviceDBInterface {}

export const deviceSchema = new Schema<IDevice>({
  name: { type: String, required: true },
  id: { type: String, required: true },
  user: { type: String, required: false },
  lastSeen: { type: Date, required: false },
  data: { type: Object, required: false },
  adminVersion: { type: String, required: true },
  docker: { type: Object, required: false },
});

deviceSchema.virtual("isOnline").get(function () {
  // @ts-ignore
  if (!this.lastSeen) {
    return false;
  }

  const now = moment();
  // @ts-ignore
  const lastSeen = moment(this.lastSeen);
  const diff = now.diff(lastSeen, "seconds");
  return Math.abs(diff) < configs.Configurations.maximumNotSeenDuration;
});

/**
 * A user model. Mongoose will use this model to do CRUD operations.
 */
export const DeviceModel =
  mongoose.models.device ?? model<IDevice>("device", deviceSchema);

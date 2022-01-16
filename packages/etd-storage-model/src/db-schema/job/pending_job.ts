/**
 * Create a user object for mongoose ORM.
 *
 * This file contains the user dbSchema for mongodb user collection
 */
import mongoose, { Document, model, Model, Schema } from "mongoose";
import { enums, interfaces } from "@etherdata-blockchain/common";

export interface IPendingJob<T>
  extends Document,
    interfaces.db.PendingJobDBInterface<enums.AnyValueType> {}

export const pendingJobSchema = new Schema<IPendingJob<enums.AnyValueType>>(
  {
    targetDeviceId: { type: String, required: true },
    from: { type: String, required: true },
    task: {
      type: { type: String, required: true },
      value: { type: Schema.Types.Mixed, required: true },
    },
    retrieved: { type: "boolean", default: false },
  },
  { timestamps: true, autoIndex: true }
);

/**
 * Pending job model
 */
export const PendingJobModel: Model<IPendingJob<enums.AnyValueType>> =
  mongoose.models.pending_job ??
  model<IPendingJob<enums.AnyValueType>>(
    enums.ModelName.pendingJob,
    pendingJobSchema
  );

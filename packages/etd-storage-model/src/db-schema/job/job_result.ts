/**
 * Create a user object for mongoose ORM.
 *
 * This file contains the user dbSchema for mongodb user collection
 */
import mongoose, { Document, model, Model, Schema } from "mongoose";
import { enums, interfaces } from "@etherdata-blockchain/common";

export interface IJobResult
  extends Document,
    interfaces.db.JobResultDBInterface {}

export const jobResultSchema = new Schema<IJobResult>({
  jobId: { type: String, required: true },
  time: { type: Date, required: true },
  deviceID: { type: String, required: true },
  from: { type: String, required: true },
  command: { type: Schema.Types.Mixed, required: true },
  result: { type: Schema.Types.Mixed, required: true },
  success: { type: Boolean, required: true },
  commandType: { type: String, required: false },
});

/**
 * Job Result Model
 */
export const JobResultModel: Model<IJobResult> =
  mongoose.models.job_result ??
  model<IJobResult>(enums.ModelName.jobResult, jobResultSchema);

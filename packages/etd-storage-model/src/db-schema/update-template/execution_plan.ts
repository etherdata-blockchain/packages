/**
 * Create a update script of device for mongoose ORM.
 */
import mongoose, { Document, model, Model, Schema } from "mongoose";
import { enums, interfaces } from "@etherdata-blockchain/common";

export interface IExecutionPlan
  extends Document,
    interfaces.db.ExecutionPlanDBInterface {}

export const ExecutionPlanSchema = new Schema<IExecutionPlan>(
  {
    updateTemplate: {
      type: mongoose.Types.ObjectId,
      ref: enums.ModelName.updateScript,
    },
    isDone: "boolean",
    isError: "boolean",
    name: "string",
    description: "string",
  },
  { timestamps: true, autoIndex: true }
);

/**
 * Execution plan model
 */
export const ExecutionPlanModel: Model<IExecutionPlan> =
  mongoose.models[enums.ModelName.executionPlan] ??
  model<IExecutionPlan>(enums.ModelName.executionPlan, ExecutionPlanSchema);

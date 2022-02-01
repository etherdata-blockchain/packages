/**
 * Create static node object used in the installation-template script generation
 */
import mongoose, { Document, model, Schema } from "mongoose";
import { enums, interfaces } from "@etherdata-blockchain/common";

export interface IStaticNode
  extends Document,
    interfaces.db.StaticNodeDBInterface {}

export const staticNodeSchema = new Schema<IStaticNode>({
  nodeName: { type: "String", required: true },
  nodeURL: { type: "string", required: true },
});

export const StaticNodeModel =
  mongoose.models[enums.ModelName.staticNode] ??
  model<IStaticNode>(enums.ModelName.staticNode, staticNodeSchema);

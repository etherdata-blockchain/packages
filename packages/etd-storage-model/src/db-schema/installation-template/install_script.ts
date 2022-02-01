/**
 * Create template for install script
 */
import mongoose, { Document, model, Schema } from "mongoose";
import { enums, interfaces } from "@etherdata-blockchain/common";

export interface IService
  extends Document,
    interfaces.db.InstallationTemplateServiceDBInterface {}

export interface IInstallationTemplate
  extends Document,
    interfaces.db.InstallationTemplateDBInterface {}

const serviceSchema = new Schema<{
  name: string;
  service: IService;
}>({
  name: String,
  service: {
    image: {
      image: { type: Schema.Types.ObjectId, required: true },
      tag: { type: Schema.Types.ObjectId, required: true },
    },
    restart: "String",
    environment: ["String"],
    network_mode: "String",
    volumes: ["String"],
    labels: ["String"],
  },
});

export const installationTemplateSchema = new Schema<IInstallationTemplate>(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
      required: true,
      auto: true,
    },
    template_tag: { type: String, unique: true },
    services: [serviceSchema],
    created_by: "string",
    version: "string",
  },
  { timestamps: true }
);

export const InstallationTemplateModel =
  mongoose.models[enums.ModelName.installationTemplate] ??
  model<IInstallationTemplate>(
    enums.ModelName.installationTemplate,
    installationTemplateSchema
  );

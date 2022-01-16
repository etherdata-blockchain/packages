/**
 * Create a user object for mongoose ORM.
 *
 * This file contains the user dbSchema for mongodb user collection
 */
import mongoose, { Document, model, Schema } from "mongoose";
import { enums, interfaces } from "@etherdata-blockchain/common";

export interface ITransaction
  extends Document,
    interfaces.db.ETDTransactionDBInterface {}

export const transactionSchema = new Schema<ITransaction>({
  hash: { type: String, required: true },
  from: { type: String, required: true },
  gas: { type: Number, required: true },
  gasPrice: { type: String, required: true },
  lowercaseFrom: { type: String, required: true },
  lowercaseTo: { type: String, required: true },
  time: { type: String, required: true },
});

/**
 * A transaction model. Mongoose will use this model to do CRUD operations.
 */
export const TransactionModel =
  mongoose.models.transaction ??
  model<ITransaction>(enums.ModelName.transaction, transactionSchema);

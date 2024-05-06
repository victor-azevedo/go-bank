import mongoose, { ObjectId } from "mongoose";

export interface Transaction {
  accountOriginId: ObjectId;
  accountDestinyId?: ObjectId;
  type: ETransactionType;
  value: number;
  createdAt?: Date;
}

export enum ETransactionType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
  TRANSFER = "transfer",
}

export interface TransactionDocument extends Transaction, mongoose.Document {}

const transactionSchema: mongoose.Schema<TransactionDocument> = new mongoose.Schema({
  accountOriginId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserModel",
    required: true,
  },
  accountDestinyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserModel",
  },
  type: {
    type: String,
    required: true,
    enum: Object.values(ETransactionType),
  },
  value: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

export const transactionModel = mongoose.model<TransactionDocument>("TransactionModel", transactionSchema);

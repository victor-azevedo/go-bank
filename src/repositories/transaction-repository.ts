import { Types } from "mongoose";
import { ETransactionType, transactionModel } from "../models";

async function create(accountOriginId: string, value: number, type: ETransactionType, accountDestinyId?: string) {
  if (accountDestinyId)
    return await transactionModel.create({
      accountOriginId: new Types.ObjectId(accountOriginId),
      accountDestinyId: new Types.ObjectId(accountDestinyId),
      value,
      type,
    });
  else
    return await transactionModel.create({
      accountOriginId,
      value,
      type,
    });
}

async function findAllByAccountId(accountId: string) {
  return await transactionModel.find({
    $or: [{ accountOriginId: new Types.ObjectId(accountId) }, { accountDestinyId: new Types.ObjectId(accountId) }],
  });
}

export const transactionRepository = {
  create,
  findAllByAccountId,
};

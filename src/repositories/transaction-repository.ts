import { Types } from "mongoose";
import { ETransactionType, TransactionDocument, transactionModel } from "../models";

interface CreateTransactionRepositoryParam {
  accountOriginId: string;
  value: number;
  type: ETransactionType;
  accountDestinyId?: string;
}

async function create({ accountOriginId, value, type, accountDestinyId }: CreateTransactionRepositoryParam) {
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
  return await transactionModel
    .find({
      $or: [{ accountOriginId: new Types.ObjectId(accountId) }, { accountDestinyId: new Types.ObjectId(accountId) }],
    })
    .select({ _id: 0, accountOriginId: 1, accountDestinyId: 1, type: 1, value: 1, createdAt: 1 });
}

export interface TransactionRepository {
  create: (params: CreateTransactionRepositoryParam) => Promise<TransactionDocument>;
  findAllByAccountId: (accountId: string) => Promise<TransactionDocument[]>;
}

export const transactionRepository: TransactionRepository = {
  create,
  findAllByAccountId,
};

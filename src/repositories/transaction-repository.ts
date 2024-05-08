import { Types } from "mongoose";
import { PaginationParams, PaginationResponse } from "../interfaces";
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

async function findAllByAccountId({ accountId, page, limit }: FindAllParams) {
  const skip = (page - 1) * limit;

  const transactions = await transactionModel
    .find({
      $or: [{ accountOriginId: new Types.ObjectId(accountId) }, { accountDestinyId: new Types.ObjectId(accountId) }],
    })
    .select({ _id: 0, accountOriginId: 1, accountDestinyId: 1, type: 1, value: 1, createdAt: 1 })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalTransactions = await transactionModel.countDocuments({
    $or: [{ accountOriginId: new Types.ObjectId(accountId) }, { accountDestinyId: new Types.ObjectId(accountId) }],
  });

  const totalPages = Math.ceil(totalTransactions / limit);

  return {
    transactions,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: totalTransactions,
      nextPage: page < totalPages ? `/transactions?page=${page + 1}&limit=${limit}` : null,
      prevPage: page > 1 ? `/transactions?page=${page - 1}&limit=${limit}` : null,
    },
  };
}

interface FindAllParams extends PaginationParams {
  accountId: string;
}

export interface TransactionResponse {
  transactions: TransactionDocument[];
  pagination: PaginationResponse;
}

export interface TransactionRepository {
  create: (params: CreateTransactionRepositoryParam) => Promise<TransactionDocument>;
  findAllByAccountId: (params: FindAllParams) => Promise<TransactionResponse>;
}

export const transactionRepository: TransactionRepository = {
  create,
  findAllByAccountId,
};

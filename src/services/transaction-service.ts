import { NotFoundError } from "../errors";
import { ETransactionType } from "../models";
import { accountRepository, transactionRepository, TransactionResponse } from "../repositories";

interface CreateTransactionServiceParam {
  accountOriginId: string;
  value: number;
  type: ETransactionType;
  accountDestinyId?: string;
}

async function create({ accountOriginId, value, type, accountDestinyId }: CreateTransactionServiceParam) {
  await transactionRepository.create({ accountOriginId, value, type, accountDestinyId });
  return;
}

async function findAllByUserId({ userId, page, limit }: FindAllServiceParams) {
  const userAccount = await accountRepository.findByUserId(userId);
  if (!userAccount) throw new NotFoundError("Account not found");

  const userTransactions = await transactionRepository.findAllByAccountId({ accountId: userAccount.id, page, limit });

  return userTransactions;
}

interface FindAllServiceParams {
  userId: string;
  page: number;
  limit: number;
}

export interface TransactionService {
  create: (params: CreateTransactionServiceParam) => Promise<void>;
  findAllByUserId: (params: FindAllServiceParams) => Promise<TransactionResponse>;
}

export const transactionService: TransactionService = {
  create,
  findAllByUserId,
};

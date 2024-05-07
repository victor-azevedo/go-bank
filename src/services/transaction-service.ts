import { NotFoundError } from "../errors";
import { ETransactionType, TransactionDocument } from "../models";
import { accountRepository, transactionRepository } from "../repositories";

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

async function findAllByUserId(userId: string) {
  const userAccount = await accountRepository.findByUserId(userId);
  if (!userAccount) throw new NotFoundError("Account not found");

  const userTransactions = await transactionRepository.findAllByAccountId(userAccount.id);

  return userTransactions;
}

export interface TransactionService {
  create: (params: CreateTransactionServiceParam) => Promise<void>;
  findAllByUserId: (userId: string) => Promise<TransactionDocument[]>;
}

export const transactionService: TransactionService = {
  create,
  findAllByUserId,
};

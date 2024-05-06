import { transactionRepository } from "../repositories";
import { ETransactionType } from "../models";

async function create(accountOriginId: string, value: number, type: ETransactionType, accountDestinyId?: string) {
  await transactionRepository.create(accountOriginId, value, type, accountDestinyId);
  return;
}

async function findAllByAccountId(accountOriginId: string) {
  const userTransactions = await transactionRepository.findAllByAccountId(accountOriginId);

  return userTransactions;
}

export const transactionService = {
  create,
  findAllByAccountId,
};

import { accountRepository, transactionRepository } from "../repositories";
import { ETransactionType } from "../models";
import { NotFoundError } from "../errors";

async function create(accountOriginId: string, value: number, type: ETransactionType, accountDestinyId?: string) {
  await transactionRepository.create(accountOriginId, value, type, accountDestinyId);
  return;
}

async function findAllByUserId(userId: string) {
  const userAccount = await accountRepository.findByUserId(userId);
  if (!userAccount) throw new NotFoundError("Account not found");

  const userTransactions = await transactionRepository.findAllByAccountId(userAccount.id);

  return userTransactions;
}

export const transactionService = {
  create,
  findAllByUserId,
};

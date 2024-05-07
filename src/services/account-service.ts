import { ConflictError, NotFoundError } from "../errors";
import { ETransactionType } from "../models";
import { accountRepository } from "../repositories";
import { addValueToBalance, subtractValueToBalance } from "../utils";
import { transactionService } from "./transaction-service";

export async function create(userId: string) {
  const userAccount = await accountRepository.findByUserId(userId);
  if (userAccount) throw new ConflictError("User Account already");

  const { accountNumber } = await accountRepository.create(userId);
  return { accountNumber };
}

export async function getAccount(userId: string) {
  const userAccount = await accountRepository.findByUserId(userId);
  if (!userAccount) throw new NotFoundError();

  const { accountNumber, balance } = userAccount;
  return { accountNumber, balance };
}

interface DepositParams {
  userId: string;
  value: number;
}

interface DepositResult {
  accountNumber: number | undefined;
  balance: number | undefined;
}

export async function deposit({ userId, value }: DepositParams) {
  const userAccount = await accountRepository.findByUserId(userId);
  if (!userAccount) throw new NotFoundError();

  const newBalance = addValueToBalance({ balanceFloat: userAccount.balance, valueFloat: value });
  await accountRepository.updateBalanceByAccountId({ id: userAccount.id, balance: newBalance });

  await transactionService.create({ accountOriginId: userAccount.id, value, type: ETransactionType.DEPOSIT });

  const accountUpdated = await accountRepository.findByUserId(userId);
  return { accountNumber: accountUpdated?.accountNumber, balance: accountUpdated?.balance };
}

interface WithdrawParams extends DepositParams {}
interface WithdrawResult extends DepositResult {}

export async function withdraw({ userId, value }: WithdrawParams) {
  const userAccount = await accountRepository.findByUserId(userId);
  if (!userAccount) throw new NotFoundError();

  const newBalance = subtractValueToBalance({ balanceFloat: userAccount.balance, valueFloat: value });
  await accountRepository.updateBalanceByAccountId({ id: userAccount.id, balance: newBalance });

  await transactionService.create({ accountOriginId: userAccount.id, value, type: ETransactionType.WITHDRAW });

  const accountUpdated = await accountRepository.findByUserId(userId);
  return { accountNumber: accountUpdated?.accountNumber, balance: accountUpdated?.balance };
}

interface TransferParams extends DepositParams {
  accountNumberDestiny: number;
}
interface TransferResult extends DepositResult {}

export async function transfer({ userId, accountNumberDestiny, value }: TransferParams) {
  const originAccount = await accountRepository.findByUserId(userId);
  if (!originAccount) throw new NotFoundError();

  const destinyAccount = await accountRepository.findByAccountNumber(accountNumberDestiny);
  if (!destinyAccount) throw new NotFoundError("Account destiny not found");

  if (originAccount.accountNumber == destinyAccount.accountNumber)
    throw new ConflictError("Accounts must be different");

  const newBalanceOrigin = subtractValueToBalance({ balanceFloat: originAccount.balance, valueFloat: value });
  const newBalanceDestiny = addValueToBalance({ balanceFloat: destinyAccount.balance, valueFloat: value });

  await accountRepository.transfer({ originAccount, newBalanceOrigin, destinyAccount, newBalanceDestiny });

  await transactionService.create({
    accountOriginId: originAccount.id,
    value,
    type: ETransactionType.TRANSFER,
    accountDestinyId: destinyAccount.id,
  });

  const accountUpdated = await accountRepository.findByUserId(userId);
  return { accountNumber: accountUpdated?.accountNumber, balance: accountUpdated?.balance };
}

export interface AccountService {
  create: (userId: string) => Promise<{ accountNumber: number }>;
  getAccount: (userId: string) => Promise<{ accountNumber: number; balance: number }>;
  deposit: (params: DepositParams) => Promise<DepositResult>;
  withdraw: (params: WithdrawParams) => Promise<WithdrawResult>;
  transfer: (params: TransferParams) => Promise<TransferResult>;
}

export const accountService: AccountService = {
  create,
  getAccount,
  deposit,
  withdraw,
  transfer,
};

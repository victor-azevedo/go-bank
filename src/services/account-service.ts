import { accountRepository } from "../repositories";
import { BadRequestError, ConflictError, NotFoundError } from "../errors";
import { AccountDocument, ETransactionType } from "../models";
import { transactionService } from "./transaction-service";

async function create(userId: string) {
  const userAccount = await accountRepository.findByUserId(userId);
  if (userAccount) throw new ConflictError("User Account already");

  const { accountNumber } = await accountRepository.create(userId);
  return { accountNumber };
}

async function getAccount(userId: string) {
  const userAccount = await accountRepository.findByUserId(userId);
  if (!userAccount) throw new NotFoundError();

  const { accountNumber, balance } = userAccount;
  return { accountNumber, balance };
}

async function deposit(userId: string, value: number) {
  const userAccount = await accountRepository.findByUserId(userId);
  if (!userAccount) throw new NotFoundError();

  const newBalance = depositInAccount(userAccount, value);
  await accountRepository.updateBalanceByAccountId(userAccount.id, newBalance);

  await transactionService.create(userAccount.id, value, ETransactionType.DEPOSIT);

  const accountUpdated = await accountRepository.findByUserId(userId);
  return { accountNumber: accountUpdated?.accountNumber, balance: accountUpdated?.balance };
}

async function withdraw(userId: string, value: number) {
  const userAccount = await accountRepository.findByUserId(userId);
  if (!userAccount) throw new NotFoundError();

  const newBalance = withdrawInAccount(userAccount, value);
  await accountRepository.updateBalanceByAccountId(userAccount.id, newBalance);

  await transactionService.create(userAccount.id, value, ETransactionType.WITHDRAW);

  const accountUpdated = await accountRepository.findByUserId(userId);
  return { accountNumber: accountUpdated?.accountNumber, balance: accountUpdated?.balance };
}

async function transfer(userId: string, accountNumberDestiny: number, value: number) {
  const originAccount = await accountRepository.findByUserId(userId);
  if (!originAccount) throw new NotFoundError();

  const destinyAccount = await accountRepository.findByAccountNumber(accountNumberDestiny);
  if (!destinyAccount) throw new NotFoundError("Account destiny not found");

  if (originAccount.accountNumber == destinyAccount.accountNumber)
    throw new ConflictError("Accounts must be different");

  const newBalanceOrigin = withdrawInAccount(originAccount, value);
  const newBalanceDestiny = depositInAccount(destinyAccount, value);

  await accountRepository.transfer(originAccount, newBalanceOrigin, destinyAccount, newBalanceDestiny);

  await transactionService.create(originAccount.id, value, ETransactionType.TRANSFER, destinyAccount.id);

  const accountUpdated = await accountRepository.findByUserId(userId);
  return { accountNumber: accountUpdated?.accountNumber, balance: accountUpdated?.balance };
}

function depositInAccount(account: AccountDocument, value: number) {
  const newBalance = account.balance + value;
  return newBalance;
}

function withdrawInAccount(account: AccountDocument, value: number) {
  if (value > account.balance) throw new BadRequestError("Insufficient balance");

  const newBalance = account.balance - value;
  return newBalance;
}

export const accountService = {
  create,
  getAccount,
  deposit,
  withdraw,
  transfer,
};

import { ClientSession, startSession, Types } from "mongoose";
import { AccountDocument, accountModel } from "../models";

async function create(userId: string) {
  return await accountModel.create({ userId: new Types.ObjectId(userId) });
}

async function findByUserId(userId: string) {
  return await accountModel.findOne({ userId: new Types.ObjectId(userId) });
}

async function findByAccountNumber(accountNumber: number) {
  return await accountModel.findOne({ accountNumber });
}

interface UpdateBalanceParams {
  id: string;
  balance: number;
}

async function updateBalanceByAccountId({ id, balance }: UpdateBalanceParams) {
  return await accountModel.findOneAndUpdate({ _id: new Types.ObjectId(id) }, { balance });
}

interface TransferParams {
  originAccount: AccountDocument;
  newBalanceOrigin: number;
  destinyAccount: AccountDocument;
  newBalanceDestiny: number;
}

async function transfer({ originAccount, newBalanceOrigin, destinyAccount, newBalanceDestiny }: TransferParams) {
  let session: ClientSession | undefined = undefined;

  try {
    session = await startSession();
    session.startTransaction();

    await accountRepository.updateBalanceByAccountId({ id: originAccount.id, balance: newBalanceOrigin });

    await accountRepository.updateBalanceByAccountId({ id: destinyAccount.id, balance: newBalanceDestiny });

    await session.commitTransaction();
  } catch (error) {
    console.log(error);
    if (session) await session.abortTransaction();
    throw error;
  } finally {
    if (session) session.endSession();
  }
}

export interface AccountRepository {
  create: (userId: string) => Promise<AccountDocument>;
  findByUserId: (userId: string) => Promise<AccountDocument | null>;
  findByAccountNumber: (accountNumber: number) => Promise<AccountDocument | null>;
  updateBalanceByAccountId: (params: UpdateBalanceParams) => Promise<AccountDocument | null>;
  transfer: (params: TransferParams) => Promise<void>;
}

export const accountRepository: AccountRepository = {
  create,
  findByUserId,
  findByAccountNumber,
  updateBalanceByAccountId,
  transfer,
};

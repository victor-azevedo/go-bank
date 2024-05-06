import { Types, ClientSession, startSession } from "mongoose";
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

async function updateBalanceByAccountId(id: string, balance: number) {
  return await accountModel.findOneAndUpdate({ _id: new Types.ObjectId(id) }, { balance });
}

async function transfer(
  originAccount: AccountDocument,
  newBalanceOrigin: number,
  destinyAccount: AccountDocument,
  newBalanceDestiny: number,
) {
  let session: ClientSession | undefined = undefined;

  try {
    session = await startSession();
    session.startTransaction();

    await accountRepository.updateBalanceByAccountId(originAccount.id, newBalanceOrigin);

    await accountRepository.updateBalanceByAccountId(destinyAccount.id, newBalanceDestiny);

    await session.commitTransaction();
  } catch (error) {
    console.log(error);
    if (session) await session.abortTransaction();
    throw error;
  } finally {
    if (session) session.endSession();
  }
}

export const accountRepository = {
  create,
  findByUserId,
  findByAccountNumber,
  updateBalanceByAccountId,
  transfer,
};

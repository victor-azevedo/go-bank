import { NextFunction, Response } from "express";
import httpStatus from "http-status";
import { ApplicationRequest } from "../interfaces";
import { accountService } from "../services";

async function create(req: ApplicationRequest, res: Response, next: NextFunction) {
  const userId = req.userId;

  await accountService.create(userId);
  return res.sendStatus(httpStatus.CREATED);
}

async function getAccount(req: ApplicationRequest, res: Response, next: NextFunction) {
  const userId = req.userId;

  const response = await accountService.getAccount(userId);

  return res.status(httpStatus.OK).send(response);
}

async function deposit(req: ApplicationRequest, res: Response, next: NextFunction) {
  const userId = req.userId;
  const { value } = req.body;

  const response = await accountService.deposit({ userId, value: value as number });

  return res.status(httpStatus.OK).send(response);
}

async function withdraw(req: ApplicationRequest, res: Response, next: NextFunction) {
  const userId = req.userId;
  const { value } = req.body;

  const response = await accountService.withdraw({ userId, value: value as number });

  return res.status(httpStatus.OK).send(response);
}

async function transfer(req: ApplicationRequest, res: Response, next: NextFunction) {
  const userId = req.userId;
  const { accountNumberDestiny, value } = req.body;

  const response = await accountService.transfer({
    userId,
    accountNumberDestiny: accountNumberDestiny as number,
    value: value as number,
  });

  return res.status(httpStatus.OK).send(response);
}

export const accountController = {
  create,
  getAccount,
  deposit,
  withdraw,
  transfer,
};

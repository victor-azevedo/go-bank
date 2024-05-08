import { NextFunction, Response } from "express";
import httpStatus from "http-status";
import { ApplicationRequest } from "../interfaces";
import { transactionService } from "../services";

async function getAllUserTransactions(req: ApplicationRequest, res: Response, next: NextFunction) {
  const userId = req.userId;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const response = await transactionService.findAllByUserId({ userId, page, limit });
  return res.status(httpStatus.OK).send(response);
}

export const transactionController = {
  getAllUserTransactions,
};

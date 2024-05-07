import { NextFunction, Response } from "express";
import httpStatus from "http-status";
import { ApplicationRequest } from "../interfaces";
import { transactionService } from "../services";

async function getAllUserTransactions(req: ApplicationRequest, res: Response, next: NextFunction) {
  const userId = req.userId;

  const response = await transactionService.findAllByUserId(userId);
  return res.status(httpStatus.OK).send(response);
}

export const transactionController = {
  getAllUserTransactions,
};

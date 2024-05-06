import { Router } from "express";
import { transactionController } from "../controllers";
import { authenticateToken } from "../middlewares";

const transactionRouter = Router();

transactionRouter.get("/", authenticateToken, transactionController.getAllUserTransactions);

export { transactionRouter };

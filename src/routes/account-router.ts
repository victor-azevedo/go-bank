import { Router } from "express";
import { accountController } from "../controllers";
import { authenticateToken } from "../middlewares";
import { validateBody } from "../middlewares/";
import { accountDepositOrWithdrawSchema, transferSchema } from "../schemas";

const accountRouter = Router();

accountRouter.post("/", authenticateToken, accountController.create);
accountRouter.get("/", authenticateToken, accountController.getAccount);
accountRouter.post("/transfer", validateBody(transferSchema), authenticateToken, accountController.transfer);
accountRouter.post(
  "/deposit",
  validateBody(accountDepositOrWithdrawSchema),
  authenticateToken,
  accountController.deposit,
);
accountRouter.post(
  "/withdraw",
  validateBody(accountDepositOrWithdrawSchema),
  authenticateToken,
  accountController.withdraw,
);

export { accountRouter };

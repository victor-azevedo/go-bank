import { Router } from "express";
import { accountController } from "../controllers";
import { authenticateToken } from "../middlewares";

const accountRouter = Router();

accountRouter.post("/", authenticateToken, accountController.create);
accountRouter.get("/", authenticateToken, accountController.getAccount);
accountRouter.post("/deposit", authenticateToken, accountController.deposit);
accountRouter.post("/withdraw", authenticateToken, accountController.withdraw);
accountRouter.post("/transfer", authenticateToken, accountController.transfer);

export { accountRouter };

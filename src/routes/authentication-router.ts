import { Router } from "express";
import { authenticationController } from "../controllers/";

const authRouter = Router();

authRouter.post("/sign-up", authenticationController.signUp);
authRouter.post("/sign-in", authenticationController.signIn);

export { authRouter };

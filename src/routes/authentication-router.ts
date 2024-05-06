import { Router } from "express";
import { authenticationController } from "../controllers/";
import { validateBody } from "../middlewares";
import { signInSchema, signUpSchema } from "../schemas";

const authRouter = Router();

authRouter.post("/sign-up", validateBody(signUpSchema), authenticationController.signUp);
authRouter.post("/sign-in", validateBody(signInSchema), authenticationController.signIn);

export { authRouter };

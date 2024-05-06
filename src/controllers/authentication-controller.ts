import { NextFunction, Request, Response } from "express";
import { SignIn, SignUp } from "../interfaces/";
import { authenticationService } from "../services/";
import httpStatus from "http-status";

async function signUp(req: Request, res: Response, next: NextFunction) {
  const userDataSignUp = req.body as SignUp;

  await authenticationService.signUp(userDataSignUp);
  return res.sendStatus(httpStatus.CREATED);
}

async function signIn(req: Request, res: Response) {
  const userSignInBody = req.body as SignIn;

  const token = await authenticationService.signIn(userSignInBody);
  return res.status(httpStatus.OK).send({ token });
}

export const authenticationController = {
  signUp,
  signIn,
};

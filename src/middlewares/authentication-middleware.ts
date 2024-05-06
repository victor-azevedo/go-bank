import { NextFunction, Response } from "express";
import * as jwt from "jsonwebtoken";
import { UnauthorizedError } from "../errors/";
import { ApplicationRequest } from "../interfaces/";
import { jwtConfig } from "../config";

export async function authenticateToken(req: ApplicationRequest, _res: Response, next: NextFunction) {
  const authHeader = req.header("Authorization");
  if (!authHeader) throw new UnauthorizedError("Bearer token not provided");

  const token = authHeader.split(" ")[1];
  if (!token) throw new UnauthorizedError("Bearer token not provided");

  try {
    const { userId } = jwt.verify(token, jwtConfig.secretKey!) as jwt.JwtPayload;

    req.userId = userId;
    return next();
  } catch (err) {
    throw new UnauthorizedError();
  }
}

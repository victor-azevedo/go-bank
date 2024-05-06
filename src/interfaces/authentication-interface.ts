import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface ApplicationRequest extends Request, JwtPayload {}

export interface SignUp {
  name: string;
  cpf: string;
  password: string;
}

export interface SignIn {
  cpf: string;
  password: string;
}

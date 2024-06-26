import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { jwtConfig } from "../config/";
import { ConflictError, NotFoundError, UnauthorizedError } from "../errors/";
import { SignIn, SignUp } from "../interfaces/";
import { userRepository } from "../repositories/";

export async function signUp(params: SignUp) {
  const { name, cpf, password } = params;

  const userExist = await userRepository.findByCpf(cpf);
  if (userExist) throw new ConflictError(`CPF already registered ${cpf}`);

  const passwordHash = bcrypt.hashSync(password, 10);

  await userRepository.create({ name, cpf, password: passwordHash });

  return;
}

export async function signIn(params: SignIn) {
  const { cpf, password } = params;

  const user = await userRepository.findByCpf(cpf);
  if (!user) throw new NotFoundError(`Not found ${cpf}`);

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new UnauthorizedError("Invalid credentials");

  const token = createToken(user.id);

  return token;
}

export function createToken(userId: string) {
  return jwt.sign({ userId }, jwtConfig.secretKey, {
    expiresIn: jwtConfig.expireIn,
  });
}

export interface AuthenticationService {
  signUp: (params: SignUp) => Promise<void>;
  signIn: (params: SignIn) => Promise<string>;
}

export const authenticationService = {
  signUp,
  signIn,
};

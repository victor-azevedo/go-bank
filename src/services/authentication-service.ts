import bcrypt from "bcrypt";
import { ConflictError, NotFoundError, UnauthorizedError } from "../errors/";
import { SignIn, SignUp } from "../interfaces/";
import { userRepository } from "../repositories/";
import * as jwt from "jsonwebtoken";
import { jwtConfig } from "../config/";

async function signUp(params: SignUp) {
  const { name, cpf, password } = params;

  const userExist = await userRepository.findByCpf(cpf);
  if (userExist) throw new ConflictError(`CPF already registered ${cpf}`);

  const passwordHash = bcrypt.hashSync(password, 10);

  await userRepository.create({ name, cpf, password: passwordHash });

  return;
}

async function signIn(params: SignIn) {
  const { cpf, password } = params;

  const user = await userRepository.findByCpf(cpf);
  if (!user) throw new NotFoundError(`Not found ${cpf}`);

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new UnauthorizedError("Invalid credentials");

  const token = jwt.sign({ userId: user.id }, jwtConfig.secretKey, {
    expiresIn: jwtConfig.expireIn,
  });

  return token;
}

export const authenticationService = {
  signUp,
  signIn,
};

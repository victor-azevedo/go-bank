import { User, UserDocument, userModel } from "../models/";

async function create(user: User) {
  return await userModel.create(user);
}

async function findByCpf(cpf: string) {
  return await userModel.findOne({ cpf });
}

export interface UserRepository {
  create: (user: User) => Promise<UserDocument>;
  findByCpf: (cpf: string) => Promise<UserDocument | null>;
}

export const userRepository: UserRepository = {
  create,
  findByCpf,
};

import { User, userModel } from "../models/";

async function create(user: User) {
  return await userModel.create(user);
}

async function findByCpf(cpf: string) {
  return await userModel.findOne({
    cpf,
  });
}

export const userRepository = {
  create,
  findByCpf,
};

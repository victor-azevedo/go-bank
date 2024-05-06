import { User, userModel } from "../models/";

async function create(user: User) {
  const doc = await userModel.create(user);
  return;
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

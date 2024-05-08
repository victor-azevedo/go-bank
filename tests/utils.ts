import mongoose from "mongoose";
import request from "supertest";
import app from "../src/app";
import { SignUp } from "../src/interfaces";
import { accountModel, transactionModel, userModel } from "../src/models";

export const clearDatabase = async () => {
  await mongoose.connection.dropDatabase();
};

export const clearUserCollection = async () => {
  await userModel.deleteMany({});
};

export const clearAccountCollection = async () => {
  await accountModel.deleteMany({});
};

export const clearTransactionCollection = async () => {
  await transactionModel.deleteMany({});
};

export async function createUser(mockSignUp: SignUp) {
  await request(app).post("/auth/sign-up").send(mockSignUp);
  return;
}

export async function createUserAndGetToken(mockSignUp: SignUp) {
  await request(app).post("/auth/sign-up").send(mockSignUp);
  const { cpf, password } = { ...mockSignUp };
  const resp = await request(app).post("/auth/sign-in").send({ cpf, password });
  return resp.body.token;
}

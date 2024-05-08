import httpStatus from "http-status";
import mongoose from "mongoose";
import request from "supertest";
import app, { init } from "../../src/app";
import { invalidToken, mockOperation1, mockSignUp1 } from "../mocks";
import { clearAccountCollection, clearDatabase, createUserAndGetToken } from "../utils";

let token1: string;

describe("Transaction routes", () => {
  beforeAll(async () => {
    await init();
    await clearDatabase();

    token1 = await createUserAndGetToken(mockSignUp1);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe("GET /transaction", () => {
    afterEach(async () => {
      await clearAccountCollection();
    });

    test("should return status code 401 if user is not logged-in", async () => {
      const expectedStatusCode = httpStatus.UNAUTHORIZED;

      const response = await request(app).get("/transaction").set("Authorization", `Bearer ${invalidToken}`);

      expect(response.status).toEqual(expectedStatusCode);
    });

    test("should return status code 200 if the logged-in user successfully get transactions", async () => {
      const expectedStatusCode = httpStatus.OK;
      await request(app).post("/account").set("Authorization", `Bearer ${token1}`);

      const response = await request(app).get("/transaction").set("Authorization", `Bearer ${token1}`);

      expect(response.status).toEqual(expectedStatusCode);
      expect(response.body).toHaveProperty("transactions");
      expect(response.body).toHaveProperty("pagination");
      expect(response.body.transactions).toHaveLength(0);
    });

    test("should return correct transaction object if the logged-in user successfully get transactions", async () => {
      await request(app).post("/account").set("Authorization", `Bearer ${token1}`);
      await request(app).post("/account/deposit").set("Authorization", `Bearer ${token1}`).send(mockOperation1);

      const response = await request(app).get("/transaction").set("Authorization", `Bearer ${token1}`);

      const firstTransaction = response.body.transactions[0];

      expect(firstTransaction).toHaveProperty("accountOriginId");
      expect(firstTransaction).toHaveProperty("type");
      expect(firstTransaction).toHaveProperty("value");
      expect(firstTransaction).toHaveProperty("createdAt");

      expect(firstTransaction.type).toBe("deposit");
      expect(firstTransaction.value).toBe(mockOperation1.value);
    });

    test("should return correct pagination object if the logged-in user successfully get transactions", async () => {
      await request(app).post("/account").set("Authorization", `Bearer ${token1}`);

      const TOTAL_DEPOSIT = 30;

      for (let i = 0; i < TOTAL_DEPOSIT; i++) {
        await request(app).post("/account/deposit").set("Authorization", `Bearer ${token1}`).send(mockOperation1);
      }

      const response = await request(app).get("/transaction").set("Authorization", `Bearer ${token1}`);

      const pagination = response.body.pagination;

      expect(pagination).toHaveProperty("currentPage");
      expect(pagination).toHaveProperty("totalPages");
      expect(pagination).toHaveProperty("totalItems");
      expect(pagination).toHaveProperty("nextPage");
      expect(pagination).toHaveProperty("prevPage");

      expect(pagination.currentPage).toBe(1);
      expect(pagination.totalPages).toBe(Math.ceil(TOTAL_DEPOSIT / 10));
      expect(pagination.totalItems).toBe(TOTAL_DEPOSIT);
      expect(pagination.prevPage).toBeNull();
    });

    test("should return status code 404 if user account already registered", async () => {
      const expectedStatusCode = httpStatus.NOT_FOUND;

      const response = await request(app).get("/transaction").set("Authorization", `Bearer ${token1}`);

      expect(response.status).toEqual(expectedStatusCode);
    });
  });
});

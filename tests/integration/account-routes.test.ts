import httpStatus from "http-status";
import mongoose from "mongoose";
import request from "supertest";
import app, { init } from "../../src/app";
import { invalidToken, mockOperation1, mockSignUp1, mockSignUp2, mockTransfer1 } from "../mocks";
import { clearAccountCollection, clearDatabase, createUserAndGetToken } from "../utils";

let token1: string;
let token2: string;
let accountNumberDestiny: number;

describe("Account routes", () => {
  beforeAll(async () => {
    await init();
    await clearDatabase();

    token1 = await createUserAndGetToken(mockSignUp1);
    token2 = await createUserAndGetToken(mockSignUp2);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe("POST /account", () => {
    afterEach(async () => {
      await clearAccountCollection();
    });

    test("should return status code 401 if user is not logged-in", async () => {
      const expectedStatusCode = httpStatus.UNAUTHORIZED;

      const response = await request(app).post("/account").set("Authorization", `Bearer ${invalidToken}`);

      expect(response.status).toEqual(expectedStatusCode);
    });

    test("should return status code 201 if the logged-in user successfully creates a account", async () => {
      const expectedStatusCode = httpStatus.CREATED;

      const response = await request(app).post("/account").set("Authorization", `Bearer ${token1}`);

      expect(response.status).toEqual(expectedStatusCode);
    });

    test("should return status code 409 if user account already registered", async () => {
      const expectedStatusCode = httpStatus.CONFLICT;
      await request(app).post("/account").set("Authorization", `Bearer ${token1}`);

      const response = await request(app).post("/account").set("Authorization", `Bearer ${token1}`);

      expect(response.status).toEqual(expectedStatusCode);
    });
  });

  describe("GET /account", () => {
    afterEach(async () => {
      await clearAccountCollection();
    });

    test("should return status code 401 if user is not logged-in", async () => {
      const expectedStatusCode = httpStatus.UNAUTHORIZED;

      const response = await request(app).get("/account").set("Authorization", `Bearer ${invalidToken}`);

      expect(response.status).toEqual(expectedStatusCode);
    });

    test("Should return status code 200 if the logged-in user successfully get a account", async () => {
      const expectedStatusCode = httpStatus.OK;
      await request(app).post("/account").set("Authorization", `Bearer ${token1}`);

      const response = await request(app).get("/account").set("Authorization", `Bearer ${token1}`);

      expect(response.status).toEqual(expectedStatusCode);
      expect(response.body).toHaveProperty("accountNumber");
      expect(response.body).toHaveProperty("balance");
    });

    test("should return status code 404 if user does not have an account", async () => {
      const expectedStatusCode = httpStatus.NOT_FOUND;

      const response = await request(app).get("/account").set("Authorization", `Bearer ${token1}`);

      expect(response.status).toEqual(expectedStatusCode);
    });
  });

  describe("POST /account/deposit", () => {
    afterEach(async () => {
      await clearAccountCollection();
    });

    test("should return status code 401 if user is not logged-in", async () => {
      const expectedStatusCode = httpStatus.UNAUTHORIZED;

      const response = await request(app)
        .post("/account/deposit")
        .set("Authorization", `Bearer ${invalidToken}`)
        .send(mockOperation1);

      expect(response.status).toEqual(expectedStatusCode);
    });

    test("should return status code 200 if the logged-in user successfully creates a deposit", async () => {
      const expectedStatusCode = httpStatus.OK;
      await request(app).post("/account").set("Authorization", `Bearer ${token1}`);
      const resGetAccount = await request(app).get("/account").set("Authorization", `Bearer ${token1}`);
      const expectedAccountNumber = resGetAccount.body.accountNumber;
      const prevBalance = resGetAccount.body.balance;

      const response = await request(app)
        .post("/account/deposit")
        .set("Authorization", `Bearer ${token1}`)
        .send(mockOperation1);

      expect(response.status).toEqual(expectedStatusCode);
      expect(response.body).toHaveProperty("accountNumber");
      expect(response.body).toHaveProperty("balance");

      expect(response.body.accountNumber).toBe(expectedAccountNumber);
      expect(response.body.balance).toBe(prevBalance + mockOperation1.value);
    });

    test("should return status code 404 if user does not have an account", async () => {
      const expectedStatusCode = httpStatus.NOT_FOUND;

      const response = await request(app)
        .post("/account/deposit")
        .set("Authorization", `Bearer ${token1}`)
        .send(mockOperation1);

      expect(response.status).toEqual(expectedStatusCode);
    });

    test("should return status code 422 if invalid body", async () => {
      const expectedStatusCode = httpStatus.UNPROCESSABLE_ENTITY;
      await request(app).post("/account").set("Authorization", `Bearer ${token1}`);

      const response = await request(app)
        .post("/account/deposit")
        .set("Authorization", `Bearer ${token1}`)
        .send({ value: 234.2342342 });

      expect(response.status).toEqual(expectedStatusCode);
    });
  });

  describe("POST /account/withdraw", () => {
    afterEach(async () => {
      await clearAccountCollection();
    });

    test("should return status code 401 if user is not logged-in", async () => {
      const expectedStatusCode = httpStatus.UNAUTHORIZED;

      const response = await request(app)
        .post("/account/withdraw")
        .set("Authorization", `Bearer ${invalidToken}`)
        .send(mockOperation1);

      expect(response.status).toEqual(expectedStatusCode);
    });

    test("should return status code 200 if the logged-in user successfully creates a withdraw", async () => {
      const expectedStatusCode = httpStatus.OK;
      await request(app).post("/account").set("Authorization", `Bearer ${token1}`);
      const resGetAccount = await request(app)
        .post("/account/deposit")
        .set("Authorization", `Bearer ${token1}`)
        .send(mockOperation1);
      const expectedAccountNumber = resGetAccount.body.accountNumber;
      const prevBalance = resGetAccount.body.balance;

      const response = await request(app)
        .post("/account/withdraw")
        .set("Authorization", `Bearer ${token1}`)
        .send(mockOperation1);

      expect(response.status).toEqual(expectedStatusCode);
      expect(response.body).toHaveProperty("accountNumber");
      expect(response.body).toHaveProperty("balance");

      expect(response.body.accountNumber).toBe(expectedAccountNumber);
      expect(response.body.balance).toBe(prevBalance - mockOperation1.value);
    });

    test("should return status code 400 if user does not have suficiente founds", async () => {
      const expectedStatusCode = httpStatus.BAD_REQUEST;
      await request(app).post("/account").set("Authorization", `Bearer ${token1}`);

      const response = await request(app)
        .post("/account/withdraw")
        .set("Authorization", `Bearer ${token1}`)
        .send(mockOperation1);

      expect(response.status).toEqual(expectedStatusCode);
    });

    test("should return status code 404 if user does not have an account", async () => {
      const expectedStatusCode = httpStatus.NOT_FOUND;

      const response = await request(app)
        .post("/account/withdraw")
        .set("Authorization", `Bearer ${token1}`)
        .send(mockOperation1);

      expect(response.status).toEqual(expectedStatusCode);
    });

    test("should return status code 422 if invalid body", async () => {
      const expectedStatusCode = httpStatus.UNPROCESSABLE_ENTITY;
      await request(app).post("/account").set("Authorization", `Bearer ${token1}`);

      const response = await request(app)
        .post("/account/withdraw")
        .set("Authorization", `Bearer ${token1}`)
        .send({ value: 0.111 });

      expect(response.status).toEqual(expectedStatusCode);
    });
  });

  describe("POST /account/transfer", () => {
    beforeEach(async () => {
      await request(app).post("/account").set("Authorization", `Bearer ${token2}`);
      const res = await request(app).get("/account").set("Authorization", `Bearer ${token2}`);
      accountNumberDestiny = res.body.accountNumber;
    });

    afterEach(async () => {
      await clearAccountCollection();
    });

    test("should return status code 401 if user is not logged-in", async () => {
      const expectedStatusCode = httpStatus.UNAUTHORIZED;

      const response = await request(app)
        .post("/account/transfer")
        .set("Authorization", `Bearer ${invalidToken}`)
        .send(mockTransfer1);

      expect(response.status).toEqual(expectedStatusCode);
    });

    test("should return status code 200 if the logged-in user successfully creates a transfer", async () => {
      const expectedStatusCode = httpStatus.OK;
      await request(app).post("/account").set("Authorization", `Bearer ${token1}`);
      const resAccountDeposit = await request(app)
        .post("/account/deposit")
        .set("Authorization", `Bearer ${token1}`)
        .send(mockOperation1);
      const expectedAccountNumber = resAccountDeposit.body.accountNumber;
      const prevBalance = resAccountDeposit.body.balance;

      const response = await request(app)
        .post("/account/transfer")
        .set("Authorization", `Bearer ${token1}`)
        .send({ ...mockTransfer1, accountNumberDestiny });

      expect(response.status).toEqual(expectedStatusCode);
      expect(response.body).toHaveProperty("accountNumber");
      expect(response.body).toHaveProperty("balance");

      expect(response.body.accountNumber).toBe(expectedAccountNumber);
      expect(response.body.balance).toBe(prevBalance - mockTransfer1.value);
    });

    test("should return status code 200 if account's destiny receive value", async () => {
      await request(app).post("/account").set("Authorization", `Bearer ${token1}`);
      await request(app).post("/account/deposit").set("Authorization", `Bearer ${token1}`).send(mockOperation1);
      await request(app)
        .post("/account/transfer")
        .set("Authorization", `Bearer ${token1}`)
        .send({ ...mockTransfer1, accountNumberDestiny });

      const response = await request(app).get("/account").set("Authorization", `Bearer ${token2}`);

      expect(response.body).toHaveProperty("accountNumber");
      expect(response.body).toHaveProperty("balance");

      expect(response.body.accountNumber).toBe(accountNumberDestiny);
      expect(response.body.balance).toBe(mockTransfer1.value);
    });

    test("should return status code 400 if user does not have suficiente founds", async () => {
      const expectedStatusCode = httpStatus.BAD_REQUEST;
      await request(app).post("/account").set("Authorization", `Bearer ${token1}`);

      const response = await request(app)
        .post("/account/transfer")
        .set("Authorization", `Bearer ${token1}`)
        .send(mockTransfer1);

      expect(response.status).toEqual(expectedStatusCode);
    });

    test("should return status code 404 if user does not have an account", async () => {
      const expectedStatusCode = httpStatus.NOT_FOUND;

      const response = await request(app)
        .post("/account/transfer")
        .set("Authorization", `Bearer ${token1}`)
        .send(mockTransfer1);

      expect(response.status).toEqual(expectedStatusCode);
    });

    test("should return status code 404 if the account's destiny does not exist", async () => {
      const expectedStatusCode = httpStatus.NOT_FOUND;
      await request(app).post("/account").set("Authorization", `Bearer ${token1}`);
      await request(app).post("/account/deposit").set("Authorization", `Bearer ${token1}`).send(mockOperation1);

      const response = await request(app)
        .post("/account/transfer")
        .set("Authorization", `Bearer ${token1}`)
        .send({ ...mockTransfer1, accountNumberDestiny: 999999999 });

      expect(response.status).toEqual(expectedStatusCode);
    });

    test("should return status code 409 if the user transfers funds to their own account.", async () => {
      const expectedStatusCode = httpStatus.CONFLICT;
      await request(app).post("/account").set("Authorization", `Bearer ${token1}`);
      const resGetAccount = await request(app).get("/account").set("Authorization", `Bearer ${token1}`);
      const accountNumber = resGetAccount.body.accountNumber;

      const response = await request(app)
        .post("/account/transfer")
        .set("Authorization", `Bearer ${token1}`)
        .send({ ...mockTransfer1, accountNumberDestiny: accountNumber });

      expect(response.status).toEqual(expectedStatusCode);
    });

    test("should return status code 422 if invalid body", async () => {
      const expectedStatusCode = httpStatus.UNPROCESSABLE_ENTITY;
      await request(app).post("/account").set("Authorization", `Bearer ${token1}`);

      const response = await request(app)
        .post("/account/transfer")
        .set("Authorization", `Bearer ${token1}`)
        .send(mockOperation1);

      expect(response.status).toEqual(expectedStatusCode);
    });
  });
});

import httpStatus from "http-status";
import mongoose from "mongoose";
import request from "supertest";
import app, { init } from "../../src/app";
import { invalidCpf, mockSignIn1, mockSignUp1, validCpf2 } from "../mocks";
import { clearDatabase, clearUserCollection } from "../utils";

describe("Authentication routes", () => {
  beforeAll(async () => {
    await init();
    await clearDatabase();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe("POST /auth/sing-up", () => {
    afterEach(async () => {
      await clearUserCollection();
    });

    test("should return status code 201 if user created successfully", async () => {
      const expectedStatusCode = httpStatus.CREATED;

      const response = await request(app).post("/auth/sign-up").send(mockSignUp1);

      expect(response.status).toEqual(expectedStatusCode);
    });

    test("should return status code 409 if user already registered", async () => {
      const expectedStatusCode = httpStatus.CONFLICT;

      await request(app).post("/auth/sign-up").send(mockSignUp1);
      const response = await request(app).post("/auth/sign-up").send(mockSignUp1);

      expect(response.status).toEqual(expectedStatusCode);
    });

    test("should return status code 422 if invalid body", async () => {
      const expectedStatusCode = httpStatus.UNPROCESSABLE_ENTITY;

      const response = await request(app)
        .post("/auth/sign-up")
        .send({ ...mockSignUp1, cpf: invalidCpf });

      expect(response.status).toEqual(expectedStatusCode);
    });
  });

  describe("POST /auth/sing-in", () => {
    beforeAll(async () => {
      await request(app).post("/auth/sign-up").send(mockSignUp1);
    });

    test("should return status code 200 if user login successfully", async () => {
      const expectedStatusCode = httpStatus.OK;

      const response = await request(app).post("/auth/sign-in").send(mockSignIn1);

      expect(response.body).toHaveProperty("token");
      expect(typeof response.body.token).toBe("string");
      expect(response.status).toEqual(expectedStatusCode);
    });

    test("should return status code 404 if user is not registered", async () => {
      const expectedStatusCode = httpStatus.NOT_FOUND;

      const response = await request(app)
        .post("/auth/sign-in")
        .send({ ...mockSignIn1, cpf: validCpf2 });

      expect(response.status).toEqual(expectedStatusCode);
    });

    test("should return status code 422 if invalid body", async () => {
      const expectedStatusCode = httpStatus.UNPROCESSABLE_ENTITY;

      const response = await request(app)
        .post("/auth/sign-in")
        .send({ ...mockSignIn1, cpf: invalidCpf });

      expect(response.status).toEqual(expectedStatusCode);
    });
  });
});

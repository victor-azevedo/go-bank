import httpStatus from "http-status";
import request from "supertest";
import app from "../../src/app";

describe("/health", () => {
  test("should return status code 200", async () => {
    const expectedStatusCode = httpStatus.OK;

    const response = await request(app).get("/health");

    expect(response.status).toEqual(expectedStatusCode);
  });
});

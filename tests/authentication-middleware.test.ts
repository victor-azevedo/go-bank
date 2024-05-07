import { NextFunction, Response } from "express";
import { UnauthorizedError } from "../src/errors";
import { ApplicationRequest } from "../src/interfaces";
import { authenticateToken } from "../src/middlewares";
import { createToken } from "../src/services";

describe("authenticateToken middleware", () => {
  let req: any;
  let res: Partial<Response>;
  let next: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    req = { header: jest.fn((name: string) => undefined) };
    res = {};
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should throw UnauthorizedError if Bearer token is not provided", () => {
    req.header.mockReturnValueOnce("Bearer");
    expect(() => authenticateToken(req as ApplicationRequest, res as Response, next)).toThrow(UnauthorizedError);
    expect(next).not.toHaveBeenCalled();
  });

  test("should throw UnauthorizedError if token verification fails", () => {
    req.header.mockReturnValueOnce("Bearer invalidToken");

    jest.mock("jsonwebtoken", () => ({
      ...jest.requireActual("jsonwebtoken"),
      verify: jest.fn().mockReturnValue(() => {
        throw new Error();
      }),
    }));

    expect(() => authenticateToken(req as ApplicationRequest, res as Response, next)).toThrow(UnauthorizedError);
    expect(next).not.toHaveBeenCalled();
  });

  test("should set userId in request object and call next if token is valid", () => {
    const userId = "someUserId";
    const token = createToken(userId);
    req.header.mockReturnValueOnce(`Bearer ${token}`);

    jest.mock("jsonwebtoken", () => ({
      ...jest.requireActual("jsonwebtoken"),
      verify: jest.fn().mockReturnValue({ userId }),
    }));

    authenticateToken(req as ApplicationRequest, res as Response, next);
    expect(req.userId).toEqual(userId);
    expect(next).toHaveBeenCalledTimes(1);
  });
});

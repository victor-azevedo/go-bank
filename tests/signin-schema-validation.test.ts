import { NextFunction, Request, Response } from "express";
import { UnprocessableEntityError } from "../src/errors";
import { validateBody } from "../src/middlewares";
import { signInSchema } from "../src/schemas";

describe("SingInSchema", () => {
  const VALID_CPF = "02775520014";

  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.MockedFunction<NextFunction>;
  beforeEach(() => {
    req = { body: {} };
    res = {};
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  test("should return next function to valid body", () => {
    req = {
      body: {
        cpf: VALID_CPF,
        password: "GoBank123",
      },
    };

    const middleware = validateBody(signInSchema);

    middleware(req as Request, res as Response, next);
    expect(next).toHaveBeenCalledTimes(1);
  });

  test("should throw UnprocessableEntityError if has no cpf", () => {
    req = {
      body: {
        password: "GoBank123",
      },
    };

    const middleware = validateBody(signInSchema);

    expect(() => middleware(req as Request, res as Response, next)).toThrow(UnprocessableEntityError);
    expect(next).not.toHaveBeenCalled();
  });

  test("should throw UnprocessableEntityError if no password", () => {
    req = {
      body: {
        cpf: VALID_CPF,
      },
    };

    const middleware = validateBody(signInSchema);

    expect(() => middleware(req as Request, res as Response, next)).toThrow(UnprocessableEntityError);
    expect(next).not.toHaveBeenCalled();
  });

  test("should throw UnprocessableEntityError if password has less than 8 characters", () => {
    req = {
      body: {
        password: "GoB123",
      },
    };

    const middleware = validateBody(signInSchema);

    expect(() => middleware(req as Request, res as Response, next)).toThrow(UnprocessableEntityError);
    expect(next).not.toHaveBeenCalled();
  });
});

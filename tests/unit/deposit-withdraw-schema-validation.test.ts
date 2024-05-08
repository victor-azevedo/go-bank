import { NextFunction, Request, Response } from "express";
import { UnprocessableEntityError } from "../../src/errors";
import { validateBody } from "../../src/middlewares";
import { accountDepositOrWithdrawSchema } from "../../src/schemas";

describe("SingInSchema", () => {
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
  test("should return next function to valid body, integer value", () => {
    req = {
      body: {
        value: 5,
      },
    };

    const middleware = validateBody(accountDepositOrWithdrawSchema);

    middleware(req as Request, res as Response, next);
    expect(next).toHaveBeenCalledTimes(1);
  });

  test("should return next function to valid body, float 1 decimal value", () => {
    req = {
      body: {
        value: 5.0,
      },
    };

    const middleware = validateBody(accountDepositOrWithdrawSchema);

    middleware(req as Request, res as Response, next);
    expect(next).toHaveBeenCalledTimes(1);
  });

  test("should return next function to valid body, float 2 decimal value", () => {
    req = {
      body: {
        value: 5.0,
      },
    };

    const middleware = validateBody(accountDepositOrWithdrawSchema);

    middleware(req as Request, res as Response, next);
    expect(next).toHaveBeenCalledTimes(1);
  });

  test("should throw UnprocessableEntityError if no value", () => {
    req = {
      body: {},
    };

    const middleware = validateBody(accountDepositOrWithdrawSchema);

    expect(() => middleware(req as Request, res as Response, next)).toThrow(UnprocessableEntityError);
    expect(next).not.toHaveBeenCalled();
  });

  test("should throw UnprocessableEntityError if value is null", () => {
    req = {
      body: {
        value: null,
      },
    };

    const middleware = validateBody(accountDepositOrWithdrawSchema);

    expect(() => middleware(req as Request, res as Response, next)).toThrow(UnprocessableEntityError);
    expect(next).not.toHaveBeenCalled();
  });

  test("should throw UnprocessableEntityError if value more than 2 decimals", () => {
    req = {
      body: {
        value: 5.111,
      },
    };

    const middleware = validateBody(accountDepositOrWithdrawSchema);

    expect(() => middleware(req as Request, res as Response, next)).toThrow(UnprocessableEntityError);
    expect(next).not.toHaveBeenCalled();
  });
});

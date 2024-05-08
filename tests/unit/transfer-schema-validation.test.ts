import { NextFunction, Request, Response } from "express";
import { UnprocessableEntityError } from "../../src/errors";
import { validateBody } from "../../src/middlewares";
import { transferSchema } from "../../src/schemas";

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
        accountNumberDestiny: 1,
        value: 5,
      },
    };

    const middleware = validateBody(transferSchema);

    middleware(req as Request, res as Response, next);
    expect(next).toHaveBeenCalledTimes(1);
  });

  test("should return next function to valid body, float 1 decimal value", () => {
    req = {
      body: {
        accountNumberDestiny: 1,
        value: 5.0,
      },
    };

    const middleware = validateBody(transferSchema);

    middleware(req as Request, res as Response, next);
    expect(next).toHaveBeenCalledTimes(1);
  });

  test("should return next function to valid body, float 2 decimal value", () => {
    req = {
      body: {
        accountNumberDestiny: 1,
        value: 5.0,
      },
    };

    const middleware = validateBody(transferSchema);

    middleware(req as Request, res as Response, next);
    expect(next).toHaveBeenCalledTimes(1);
  });

  test("should throw UnprocessableEntityError if no accountNumberDestiny", () => {
    req = {
      body: {
        value: 5.0,
      },
    };

    const middleware = validateBody(transferSchema);

    expect(() => middleware(req as Request, res as Response, next)).toThrow(UnprocessableEntityError);
    expect(next).not.toHaveBeenCalled();
  });

  test("should throw UnprocessableEntityError if no value", () => {
    req = {
      body: {
        accountNumberDestiny: 1,
      },
    };

    const middleware = validateBody(transferSchema);

    expect(() => middleware(req as Request, res as Response, next)).toThrow(UnprocessableEntityError);
    expect(next).not.toHaveBeenCalled();
  });

  test("should throw UnprocessableEntityError if accountNumberDestiny is not integer", () => {
    req = {
      body: {
        accountNumberDestiny: 1.5,
        value: 5,
      },
    };

    const middleware = validateBody(transferSchema);

    expect(() => middleware(req as Request, res as Response, next)).toThrow(UnprocessableEntityError);
    expect(next).not.toHaveBeenCalled();
  });

  test("should throw UnprocessableEntityError if value more than 2 decimals", () => {
    req = {
      body: {
        accountNumberDestiny: 1,
        value: 5.111,
      },
    };

    const middleware = validateBody(transferSchema);

    expect(() => middleware(req as Request, res as Response, next)).toThrow(UnprocessableEntityError);
    expect(next).not.toHaveBeenCalled();
  });
});

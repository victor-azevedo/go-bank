import { NextFunction, Request, Response } from "express";
import { UnprocessableEntityError } from "../src/errors";
import { validateBody } from "../src/middlewares";
import { signUpSchema } from "../src/schemas";

describe("SingUpSchema", () => {
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
        name: "Jose",
        cpf: VALID_CPF,
        password: "GoBank123",
      },
    };

    const middleware = validateBody(signUpSchema);

    middleware(req as Request, res as Response, next);
    expect(next).toHaveBeenCalledTimes(1);
  });

  test("should throw UnprocessableEntityError if name has less than 3 characters", () => {
    req = {
      body: {
        name: "Jo",
        cpf: VALID_CPF,
        password: "GoBank123",
      },
    };

    const middleware = validateBody(signUpSchema);

    expect(() => middleware(req as Request, res as Response, next)).toThrow(UnprocessableEntityError);
    expect(next).not.toHaveBeenCalled();
  });

  test("should throw UnprocessableEntityError if cpf has less than 11 digits", () => {
    req = {
      body: {
        name: "Jose",
        cpf: "027755200",
        password: "GoBank123",
      },
    };

    const middleware = validateBody(signUpSchema);

    expect(() => middleware(req as Request, res as Response, next)).toThrow(UnprocessableEntityError);
    expect(next).not.toHaveBeenCalled();
  });

  test("should throw UnprocessableEntityError if cpf has more than 11 digits", () => {
    req = {
      body: {
        name: "Jose",
        cpf: "027755200143",
        password: "GoBank123",
      },
    };

    const middleware = validateBody(signUpSchema);

    expect(() => middleware(req as Request, res as Response, next)).toThrow(UnprocessableEntityError);
    expect(next).not.toHaveBeenCalled();
  });

  test("should throw UnprocessableEntityError if password has less than 8 characters", () => {
    req = {
      body: {
        name: "Jose",
        cpf: VALID_CPF,
        password: "GoB123",
      },
    };

    const middleware = validateBody(signUpSchema);

    expect(() => middleware(req as Request, res as Response, next)).toThrow(UnprocessableEntityError);
    expect(next).not.toHaveBeenCalled();
  });

  test("should throw UnprocessableEntityError if password has no number", () => {
    req = {
      body: {
        name: "Jose",
        cpf: VALID_CPF,
        password: "GoBanking",
      },
    };

    const middleware = validateBody(signUpSchema);

    expect(() => middleware(req as Request, res as Response, next)).toThrow(UnprocessableEntityError);
    expect(next).not.toHaveBeenCalled();
  });

  test("should throw UnprocessableEntityError if password has no lowercase letter", () => {
    req = {
      body: {
        name: "Jose",
        cpf: VALID_CPF,
        password: "GOBANK123",
      },
    };

    const middleware = validateBody(signUpSchema);

    expect(() => middleware(req as Request, res as Response, next)).toThrow(UnprocessableEntityError);
    expect(next).not.toHaveBeenCalled();
  });

  test("should throw UnprocessableEntityError if password has no uppercase letter", () => {
    req = {
      body: {
        name: "Jose",
        cpf: VALID_CPF,
        password: "gobank123",
      },
    };

    const middleware = validateBody(signUpSchema);

    expect(() => middleware(req as Request, res as Response, next)).toThrow(UnprocessableEntityError);
    expect(next).not.toHaveBeenCalled();
  });
});

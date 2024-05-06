import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { AnySchema } from "joi";

export function validateBody<T>(schema: AnySchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false, convert: false });

    if (!error) {
      next();
    } else {
      return res.status(httpStatus.UNPROCESSABLE_ENTITY).send(invalidDataError(error.details.map((d) => d.message)));
    }
  };
}

interface InvalidDataError {
  message: string;
  details: string[];
}

function invalidDataError(details: string[]): InvalidDataError {
  return {
    message: "Invalid data",
    details,
  };
}

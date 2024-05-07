import { NextFunction, Request, Response } from "express";
import { AnySchema } from "joi";
import { UnprocessableEntityError } from "../errors";

export function validateBody<T>(schema: AnySchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false, convert: false });

    if (error) throw new UnprocessableEntityError({ details: error.details.map((d) => d.message) });

    next();
  };
}

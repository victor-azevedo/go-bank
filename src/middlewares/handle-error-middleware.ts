import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { ApplicationError } from "../errors/";

export const handleApplicationError = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.log(err);

  if (err instanceof ApplicationError) {
    return res.status(err.statusCode).send({
      message: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : {},
    });
  }

  if (err.name === "ValidationError") {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : {},
    });
  }

  return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
    message: "Internal server error",
    stack: process.env.NODE_ENV === "development" ? err.stack : {},
  });
};

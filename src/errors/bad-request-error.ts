import httpStatus from "http-status";
import { ApplicationError } from "./application-error";

export class BadRequestError extends ApplicationError {
  constructor(message = "Bad Request") {
    super({ message, statusCode: httpStatus.BAD_REQUEST });
  }
}

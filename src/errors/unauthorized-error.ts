import httpStatus from "http-status";
import { ApplicationError } from "./application-error";

export class UnauthorizedError extends ApplicationError {
  constructor(message = "Unauthorized Error") {
    super({ message, statusCode: httpStatus.UNAUTHORIZED });
  }
}

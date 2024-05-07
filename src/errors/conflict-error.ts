import httpStatus from "http-status";
import { ApplicationError } from "./application-error";

export class ConflictError extends ApplicationError {
  constructor(message = "Conflict Error") {
    super({ message, statusCode: httpStatus.CONFLICT });
  }
}

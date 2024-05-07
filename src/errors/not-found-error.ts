import httpStatus from "http-status";
import { ApplicationError } from "./application-error";

export class NotFoundError extends ApplicationError {
  constructor(message = "Not Found Error") {
    super({ message, statusCode: httpStatus.NOT_FOUND });
  }
}

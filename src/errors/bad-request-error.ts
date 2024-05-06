import httpStatus from "http-status";
import { ApplicationError } from "./application-error";

export class BadRequestError extends ApplicationError {
  constructor(message?: string) {
    super(message || "Bad Request", httpStatus.BAD_REQUEST);
  }
}

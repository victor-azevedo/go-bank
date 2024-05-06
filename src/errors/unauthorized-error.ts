import httpStatus from "http-status";
import { ApplicationError } from "./application-error";

export class UnauthorizedError extends ApplicationError {
  constructor(message?: string) {
    super(message || "Unauthorized Error", httpStatus.UNAUTHORIZED);
  }
}

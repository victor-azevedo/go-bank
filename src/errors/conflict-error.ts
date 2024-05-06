import httpStatus from "http-status";
import { ApplicationError } from "./application-error";

export class ConflictError extends ApplicationError {
  constructor(message?: string) {
    super(message || "Conflict Error", httpStatus.CONFLICT);
  }
}

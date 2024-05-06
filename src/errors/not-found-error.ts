import httpStatus from "http-status";
import { ApplicationError } from "./application-error";

export class NotFoundError extends ApplicationError {
  constructor(message?: string) {
    super(message || "Not Found Error", httpStatus.NOT_FOUND);
  }
}

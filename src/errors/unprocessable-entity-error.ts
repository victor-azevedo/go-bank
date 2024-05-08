import httpStatus from "http-status";
import { ApplicationError } from "./application-error";

export class UnprocessableEntityError extends ApplicationError {
  constructor({ message = "Unprocessable Entity", details }: { message?: string; details?: string[] }) {
    super({ message, statusCode: httpStatus.UNPROCESSABLE_ENTITY, details });
  }
}

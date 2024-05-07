export class ApplicationError extends Error {
  private _statusCode: number;
  private _details: string[];

  constructor({ message, statusCode, details }: ApplicationErrorParams) {
    super(message);
    this._statusCode = statusCode;
    this._details = details || [];
  }

  get statusCode(): number {
    return this._statusCode;
  }

  get details(): string[] {
    return this._details;
  }
}

export interface ApplicationErrorParams {
  message: string;
  statusCode: number;
  details?: string[];
}

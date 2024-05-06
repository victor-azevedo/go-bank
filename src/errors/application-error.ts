export class ApplicationError extends Error {
  private _statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this._statusCode = statusCode;
  }

  get statusCode(): number {
    return this._statusCode;
  }
}

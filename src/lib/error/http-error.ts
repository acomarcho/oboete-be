export class HttpError extends Error {
  private statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }

  getStatusCode() {
    return this.statusCode;
  }

  getMessage() {
    return this.message;
  }
}

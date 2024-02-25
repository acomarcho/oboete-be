export class HttpResponse<T> {
  private data: T;
  private error: any;

  constructor(data: T, error: any = null) {
    this.data = data;
    this.error = error;
  }

  toJson() {
    return {
      data: this.data,
      error: this.error,
    };
  }
}

export class HttpResponse<T> {
	private data: T;
	private error: Error | null;

	constructor(data: T, error: Error | null = null) {
		this.data = data;
		this.error = error;
	}

	toJson() {
		return {
			data: this.data,
			error: this.error?.message,
		};
	}
}

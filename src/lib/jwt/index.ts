import jwt from "jsonwebtoken";

export type JwtOptions = {
	expiresIn: string;
};

export interface JwtInterface {
	verify(token: string, secret: string): string | jwt.JwtPayload;
	sign(
		payload: string | Buffer | object,
		secret: string,
		options?: JwtOptions,
	): string;
}

export class Jwt implements JwtInterface {
	verify(token: string, secret: string) {
		return jwt.verify(token, secret);
	}

	sign(
		payload: string | Buffer | object,
		secret: string,
		options?: JwtOptions | undefined,
	) {
		return jwt.sign(payload, secret, options);
	}
}

export class MockJwt implements JwtInterface {
	verify(token: string, secret: string): string | jwt.JwtPayload {
		throw new Error("Method not implemented.");
	}
	sign(
		payload: string | Buffer | object,
		secret: string,
		options?: JwtOptions | undefined,
	): string {
		throw new Error("Method not implemented.");
	}
}

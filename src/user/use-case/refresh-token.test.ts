import { StatusCodes } from "http-status-codes";
import _jwt from "jsonwebtoken";
import { HttpError } from "../../lib/error/http-error";
import { Jwt, JwtOptions, MockJwt } from "../../lib/jwt";
import { MockUserDataAccess } from "../data-access/mock";
import { UserEntity } from "../entity";
import { RefreshTokenUseCase } from "./refresh-token";

let refreshTokenUseCase: RefreshTokenUseCase;

test("should throw invalid refresh token because of invalid jwt", () => {
	refreshTokenUseCase = new RefreshTokenUseCase(
		new MockUserDataAccess(),
		new Jwt(),
	);

	expect(async () => {
		await refreshTokenUseCase.execute({ refreshToken: "invalidToken" });
	}).rejects.toThrow(
		new HttpError(StatusCodes.UNAUTHORIZED, "Invalid refresh token!"),
	);
});

test("should throw invalid refresh token because of user not found", () => {
	class TestJwt extends MockJwt {
		verify(token: string, secret: string): string | _jwt.JwtPayload {
			return {
				userId: "mock",
			};
		}
	}

	class TestDataAccess extends MockUserDataAccess {
		async getUserById(id: string): Promise<UserEntity | null> {
			return null;
		}
	}

	refreshTokenUseCase = new RefreshTokenUseCase(
		new TestDataAccess(),
		new TestJwt(),
	);

	expect(async () => {
		await refreshTokenUseCase.execute({ refreshToken: "invalidToken" });
	}).rejects.toThrow(
		new HttpError(StatusCodes.UNAUTHORIZED, "Invalid refresh token!"),
	);
});

test("should throw invalid refresh token because of non matching token", () => {
	class TestJwt extends MockJwt {
		verify(token: string, secret: string): string | _jwt.JwtPayload {
			return {
				userId: "mock",
			};
		}
	}

	class TestDataAccess extends MockUserDataAccess {
		async getUserById(id: string): Promise<UserEntity | null> {
			return new UserEntity({
				id: "mock",
				username: "mock",
				email: "mock",
				hashedPassword: "mock",
			});
		}

		async getUserTokenByUserId(userId: string): Promise<string> {
			return "refreshToken";
		}
	}

	refreshTokenUseCase = new RefreshTokenUseCase(
		new TestDataAccess(),
		new TestJwt(),
	);

	expect(async () => {
		await refreshTokenUseCase.execute({ refreshToken: "invalidToken" });
	}).rejects.toThrow(
		new HttpError(StatusCodes.UNAUTHORIZED, "Invalid refresh token!"),
	);
});

test("should be successful", async () => {
	class TestJwt extends MockJwt {
		verify(token: string, secret: string): string | _jwt.JwtPayload {
			return {
				userId: "mock",
			};
		}

		sign(
			payload: string | Buffer | object,
			secret: string,
			options?: JwtOptions,
		): string {
			return "mock";
		}
	}

	class TestDataAccess extends MockUserDataAccess {
		async getUserById(id: string): Promise<UserEntity | null> {
			return new UserEntity({
				id: "mock",
				username: "mock",
				email: "mock",
				hashedPassword: "mock",
			});
		}

		async getUserTokenByUserId(userId: string): Promise<string> {
			return "refreshToken";
		}
	}

	refreshTokenUseCase = new RefreshTokenUseCase(
		new TestDataAccess(),
		new TestJwt(),
	);

	const executeResult = await refreshTokenUseCase.execute({
		refreshToken: "refreshToken",
	});

	expect(executeResult).toHaveProperty("accessToken");
});

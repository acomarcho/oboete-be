import { StatusCodes } from "http-status-codes";
import { HttpError } from "../../lib/error/http-error";
import { UserDataAccessInterface } from "../data-access-interface";
import { MockUserDataAccess } from "../data-access/mock";
import { UserEntity } from "../entity";
import { RefreshTokenUseCase } from "./refresh-token";

class MockRefreshTokenUserDataAccess extends MockUserDataAccess {
	async getUserById(id: string): Promise<UserEntity | null> {
		if (id === "mock") {
			return new UserEntity({
				id: "mock",
				username: "mock",
				email: "mock@mock.com",
				hashedPassword: "mock",
			});
		}

		return null;
	}

	async getUserTokenByUserId(userId: string): Promise<string> {
		return "mockToken";
	}
}

let userDataAccess: UserDataAccessInterface;
let refreshTokenUseCase: RefreshTokenUseCase;

beforeAll(() => {
	userDataAccess = new MockRefreshTokenUserDataAccess();
	refreshTokenUseCase = new RefreshTokenUseCase(userDataAccess);
});

test("should throw invalid refresh token because of invalid jwt", () => {
	expect(async () => {
		await refreshTokenUseCase.execute({ refreshToken: "invalidToken" });
	}).rejects.toThrow(
		new HttpError(StatusCodes.UNAUTHORIZED, "Invalid refresh token!"),
	);
});

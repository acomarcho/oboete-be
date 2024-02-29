import { StatusCodes } from "http-status-codes";
import { HttpError } from "../../lib/error/http-error";
import { UserDataAccessInterface } from "../data-access-interface";
import { MockUserDataAccess } from "../data-access/mock";
import { UserEntity } from "../entity";
import { LoginUseCase } from "./login";
import { LogOutUseCase } from "./logout";

class MockLoginUserDataAccess extends MockUserDataAccess {
	async getUserById(id: string): Promise<UserEntity | null> {
		if (id === "mockId") {
			return new UserEntity({
				id: "mockId",
				username: "mock",
				email: "mock@mock.com",
				hashedPassword:
					"$2a$12$oIs5wWD34v8RRMYVsvsQWOhjcI9tS91rL2fQKu/X4egSARmdfltTq",
			});
		}

		return null;
	}

	async deleteUserToken(userId: string): Promise<boolean> {
		return true;
	}
}

let userDataAccess: UserDataAccessInterface;
let logoutUseCase: LogOutUseCase;

beforeAll(() => {
	userDataAccess = new MockLoginUserDataAccess();
	logoutUseCase = new LogOutUseCase(userDataAccess);
});

test("should throw invalid credentials", () => {
	expect(async () => {
		await logoutUseCase.execute({ userId: "invalidId" });
	}).rejects.toThrow(
		new HttpError(StatusCodes.BAD_REQUEST, "Invalid credentials!"),
	);
});

test("should successfully log out", async () => {
	const result = await logoutUseCase.execute({ userId: "mockId" });

	expect(result).toBe(true);
});

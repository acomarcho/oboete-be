import { StatusCodes } from "http-status-codes";
import { HttpError } from "../../lib/error/http-error";
import { UserDataAccessInterface } from "../data-access-interface";
import { MockUserDataAccess } from "../data-access/mock";
import { UserEntity } from "../entity";
import { LoginUseCase } from "./login";

class MockLoginUserDataAccess extends MockUserDataAccess {
	async getUserByUsername(username: string): Promise<UserEntity | null> {
		if (username === "mock") {
			return new UserEntity({
				username: "mock",
				email: "mock@mock.com",
				hashedPassword:
					"$2a$12$oIs5wWD34v8RRMYVsvsQWOhjcI9tS91rL2fQKu/X4egSARmdfltTq",
			});
		}

		return null;
	}
	async getUserByEmail(email: string): Promise<UserEntity | null> {
		if (email === "mock@mock.com") {
			return new UserEntity({
				username: "mock",
				email: "mock@mock.com",
				hashedPassword:
					"$2a$12$oIs5wWD34v8RRMYVsvsQWOhjcI9tS91rL2fQKu/X4egSARmdfltTq",
			});
		}

		return null;
	}
	async upsertUserToken(userId: string, token: string): Promise<string> {
		return "sample token";
	}
}

let userDataAccess: UserDataAccessInterface;
let loginUseCase: LoginUseCase;

beforeAll(() => {
	userDataAccess = new MockLoginUserDataAccess();
	loginUseCase = new LoginUseCase(userDataAccess);
});

test("should throw invalid credentials because of invalid usernameOrEmail", () => {
	expect(async () => {
		await loginUseCase.execute({
			usernameOrEmail: "kobokanaeru",
			password: "kobokanaeru",
		});
	}).rejects.toThrow(
		new HttpError(StatusCodes.BAD_REQUEST, "Invalid credentials!"),
	);
});

test("should throw invalid credentials because of wrong password", () => {
	expect(async () => {
		await loginUseCase.execute({
			usernameOrEmail: "mock",
			password: "kobokanaeru",
		});
	}).rejects.toThrow(
		new HttpError(StatusCodes.BAD_REQUEST, "Invalid credentials!"),
	);
});

test("should successfully log in", async () => {
	const res = await loginUseCase.execute({
		usernameOrEmail: "mock",
		password: "mock",
	});

	expect(res).toHaveProperty("tokens");
	expect(res).toHaveProperty("user");
});

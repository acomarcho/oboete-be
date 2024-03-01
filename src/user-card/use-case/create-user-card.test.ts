import { StatusCodes } from "http-status-codes";
import moment from "moment";
import { HttpError } from "../../lib/error/http-error";
import { MockUserDataAccess } from "../../user/data-access/mock";
import { UserEntity } from "../../user/entity";
import { MockUserCardDataAccess } from "../data-access/mock";
import { UserCardEntity } from "../entity";
import { CreateUserCardUseCase } from "./create-user-card";

let createUserCardUseCase: CreateUserCardUseCase;

test("should throw an error because of user not found", () => {
	class TestUserCardDataAccess extends MockUserCardDataAccess {
		async insertUserCard(userCard: UserCardEntity): Promise<UserCardEntity> {
			return new UserCardEntity({
				userId: "mock",
				content: "mock",
				status: 0,
				lastReviewedAt: null,
				createdAt: moment(),
				updatedAt: moment(),
			});
		}
	}

	class TestUserDataAccess extends MockUserDataAccess {
		async getUserById(id: string): Promise<UserEntity | null> {
			return null;
		}
	}

	createUserCardUseCase = new CreateUserCardUseCase({
		userCardDataAccess: new TestUserCardDataAccess(),
		userDataAccess: new TestUserDataAccess(),
	});

	expect(async () => {
		await createUserCardUseCase.execute({
			userId: "mock",
			content: "mock",
		});
	}).rejects.toThrow(new HttpError(StatusCodes.UNAUTHORIZED, "User not found"));
});

test("should be successful", async () => {
	class TestUserCardDataAccess extends MockUserCardDataAccess {
		async insertUserCard(userCard: UserCardEntity): Promise<UserCardEntity> {
			return new UserCardEntity({
				userId: "mock",
				content: "mock",
				status: 0,
				lastReviewedAt: null,
				createdAt: moment(),
				updatedAt: moment(),
			});
		}
	}

	class TestUserDataAccess extends MockUserDataAccess {
		async getUserById(id: string): Promise<UserEntity | null> {
			return new UserEntity({
				id: "mock",
				username: "mock",
				email: "mock",
				hashedPassword: "mock",
			});
		}
	}

	createUserCardUseCase = new CreateUserCardUseCase({
		userCardDataAccess: new TestUserCardDataAccess(),
		userDataAccess: new TestUserDataAccess(),
	});

	const result = await createUserCardUseCase.execute({
		userId: "mock",
		content: "mock",
	});

	expect(result).toHaveProperty("userCard");
});

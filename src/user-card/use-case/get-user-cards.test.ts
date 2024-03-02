import { StatusCodes } from "http-status-codes";
import moment from "moment";
import { HttpError } from "../../lib/error/http-error";
import { MockUserDataAccess } from "../../user/data-access/mock";
import { UserEntity } from "../../user/entity";
import { GetUserCardsFilter } from "../data-access-interface";
import { MockUserCardDataAccess } from "../data-access/mock";
import { UserCardEntity, UserCardStatus } from "../entity";
import { GetUserCardsUseCase } from "./get-user-cards";

let getUserCardsUseCase: GetUserCardsUseCase;

test("should throw user not found", () => {
	class TestUserDataAccess extends MockUserDataAccess {
		async getUserById(id: string): Promise<UserEntity | null> {
			return null;
		}
	}

	getUserCardsUseCase = new GetUserCardsUseCase({
		userCardDataAccess: new MockUserCardDataAccess(),
		userDataAccess: new TestUserDataAccess(),
	});

	expect(async () => {
		await getUserCardsUseCase.execute({
			userId: "mock",
		});
	}).rejects.toThrow(new HttpError(StatusCodes.UNAUTHORIZED, "User not found"));
});

test("should return empty array", async () => {
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

	class TestUserCardDataAccess extends MockUserCardDataAccess {
		async getUserCards(filter: GetUserCardsFilter): Promise<UserCardEntity[]> {
			return [];
		}
	}

	getUserCardsUseCase = new GetUserCardsUseCase({
		userCardDataAccess: new TestUserCardDataAccess(),
		userDataAccess: new TestUserDataAccess(),
	});

	const result = await getUserCardsUseCase.execute({
		userId: "mock",
	});

	expect(result).toEqual([]);
});

test("should return cards", async () => {
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

	class TestUserCardDataAccess extends MockUserCardDataAccess {
		async getUserCards(filter: GetUserCardsFilter): Promise<UserCardEntity[]> {
			return [
				new UserCardEntity({
					id: "mock",
					userId: "mock",
					content: "mock",
					status: UserCardStatus.ToReviewImmediately,
					lastReviewedAt: null,
					createdAt: moment(),
					updatedAt: moment(),
				}),
			];
		}
	}

	getUserCardsUseCase = new GetUserCardsUseCase({
		userCardDataAccess: new TestUserCardDataAccess(),
		userDataAccess: new TestUserDataAccess(),
	});

	const result = await getUserCardsUseCase.execute({
		userId: "mock",
	});

	expect(result[0]).toHaveProperty("content");
});

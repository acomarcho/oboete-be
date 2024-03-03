import { StatusCodes } from "http-status-codes";
import moment from "moment";
import { HttpError } from "../../lib/error/http-error";
import { MockUserDataAccess } from "../../user/data-access/mock";
import { UserEntity } from "../../user/entity";
import { MockUserCardDataAccess } from "../data-access/mock";
import { UserCardEntity, UserCardStatus } from "../entity";
import { ReviewUserCardUseCase } from "./review-user-card";

describe("getTargetStatus method", () => {
	const reviewUserCardUseCase = new ReviewUserCardUseCase({
		userCardDataAccess: new MockUserCardDataAccess(),
		userDataAccess: new MockUserDataAccess(),
	});

	it("should return ToReviewImmediately", () => {
		const mockUserCard = new UserCardEntity({
			id: "mock",
			userId: "mock",
			content: "mock",
			status: UserCardStatus.ToReviewInTwoDays,
			lastReviewedAt: null,
			createdAt: moment(),
			updatedAt: moment(),
		});

		expect(reviewUserCardUseCase.getTargetStatus(mockUserCard, -1)).toBe(
			UserCardStatus.ToReviewImmediately,
		);
	});

	it("should return ToReviewInTwoDays", () => {
		const mockUserCard = new UserCardEntity({
			id: "mock",
			userId: "mock",
			content: "mock",
			status: UserCardStatus.ToReviewInTwoDays,
			lastReviewedAt: null,
			createdAt: moment(),
			updatedAt: moment(),
		});

		expect(reviewUserCardUseCase.getTargetStatus(mockUserCard, 0)).toBe(
			UserCardStatus.ToReviewInTwoDays,
		);
	});

	it("should return ToReviewInFourDays", () => {
		const mockUserCard = new UserCardEntity({
			id: "mock",
			userId: "mock",
			content: "mock",
			status: UserCardStatus.ToReviewInTwoDays,
			lastReviewedAt: null,
			createdAt: moment(),
			updatedAt: moment(),
		});

		expect(reviewUserCardUseCase.getTargetStatus(mockUserCard, 1)).toBe(
			UserCardStatus.ToReviewInFourDays,
		);
	});

	it("should return ToReviewInOneWeek", () => {
		const mockUserCard = new UserCardEntity({
			id: "mock",
			userId: "mock",
			content: "mock",
			status: UserCardStatus.ToReviewInOneWeek,
			lastReviewedAt: null,
			createdAt: moment(),
			updatedAt: moment(),
		});

		expect(reviewUserCardUseCase.getTargetStatus(mockUserCard, 1)).toBe(
			UserCardStatus.ToReviewInOneWeek,
		);
	});
});

describe("execute method", () => {
	it("should throw user not found", () => {
		class TestUserDataAccess extends MockUserDataAccess {
			async getUserById(id: string): Promise<UserEntity | null> {
				return null;
			}
		}

		const reviewUserCardUseCase = new ReviewUserCardUseCase({
			userCardDataAccess: new MockUserCardDataAccess(),
			userDataAccess: new TestUserDataAccess(),
		});

		expect(async () => {
			await reviewUserCardUseCase.execute({
				userId: "mock",
				userCardId: "mock",
				statusChange: -1,
			});
		}).rejects.toThrow(
			new HttpError(StatusCodes.UNAUTHORIZED, "User not found"),
		);
	});

	it("should throw user card not found", () => {
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
			async getUserCardById(
				userCardId: string,
			): Promise<UserCardEntity | null> {
				return null;
			}
		}

		const reviewUserCardUseCase = new ReviewUserCardUseCase({
			userCardDataAccess: new TestUserCardDataAccess(),
			userDataAccess: new TestUserDataAccess(),
		});

		expect(async () => {
			await reviewUserCardUseCase.execute({
				userId: "mock",
				userCardId: "mock",
				statusChange: -1,
			});
		}).rejects.toThrow(
			new HttpError(StatusCodes.UNAUTHORIZED, "User card not found"),
		);
	});

	it("should throw unauthorized access to user card", () => {
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
			async getUserCardById(
				userCardId: string,
			): Promise<UserCardEntity | null> {
				return new UserCardEntity({
					id: "mock",
					userId: "mockDifferentId",
					content: "mock",
					status: UserCardStatus.ToReviewInTwoDays,
					lastReviewedAt: null,
					createdAt: moment(),
					updatedAt: moment(),
				});
			}
		}

		const reviewUserCardUseCase = new ReviewUserCardUseCase({
			userCardDataAccess: new TestUserCardDataAccess(),
			userDataAccess: new TestUserDataAccess(),
		});

		expect(async () => {
			await reviewUserCardUseCase.execute({
				userId: "mock",
				userCardId: "mock",
				statusChange: -1,
			});
		}).rejects.toThrow(
			new HttpError(
				StatusCodes.UNAUTHORIZED,
				"Unauthorized access to user card",
			),
		);
	});

	it("should be successful", async () => {
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
			async getUserCardById(
				userCardId: string,
			): Promise<UserCardEntity | null> {
				return new UserCardEntity({
					id: "mock",
					userId: "mock",
					content: "mock",
					status: UserCardStatus.ToReviewInTwoDays,
					lastReviewedAt: null,
					createdAt: moment(),
					updatedAt: moment(),
				});
			}

			async updateUserCard(userCard: UserCardEntity): Promise<UserCardEntity> {
				return userCard;
			}
		}

		const reviewUserCardUseCase = new ReviewUserCardUseCase({
			userCardDataAccess: new TestUserCardDataAccess(),
			userDataAccess: new TestUserDataAccess(),
		});

		const res = await reviewUserCardUseCase.execute({
			userId: "mock",
			userCardId: "mock",
			statusChange: -1,
		});

		expect(res.getId()).toBe("mock");
	});
});

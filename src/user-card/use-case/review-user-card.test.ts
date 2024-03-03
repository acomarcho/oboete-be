import moment from "moment";
import { MockUserDataAccess } from "../../user/data-access/mock";
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

import { StatusCodes } from "http-status-codes";
import moment from "moment";
import { HttpError } from "../../lib/error/http-error";
import { UserDataAccessInterface } from "../../user/data-access-interface";
import { UserCardDataAccessInterface } from "../data-access-interface";
import { UserCardStatus } from "../entity";

export class GetUserCardsUseCase {
	private userCardDataAccess: UserCardDataAccessInterface;
	private userDataAccess: UserDataAccessInterface;

	constructor({
		userCardDataAccess,
		userDataAccess,
	}: {
		userCardDataAccess: UserCardDataAccessInterface;
		userDataAccess: UserDataAccessInterface;
	}) {
		this.userCardDataAccess = userCardDataAccess;
		this.userDataAccess = userDataAccess;
	}

	async execute({ userId }: { userId: string }) {
		const user = await this.userDataAccess.getUserById(userId);
		if (user === null) {
			throw new HttpError(StatusCodes.UNAUTHORIZED, "User not found");
		}

		const userCards = await this.userCardDataAccess.getUserCards({
			userId: userId,
		});

		return userCards.map((userCard) => {
			const lastReviewedAt = userCard.getLastReviewedAt();
			let dueReviewAt = moment();

			if (userCard.getStatus() === UserCardStatus.ToReviewInOneDay) {
				if (lastReviewedAt === null) {
					dueReviewAt = moment().add(1, "d");
				} else {
					dueReviewAt = lastReviewedAt.add(1, "d");
				}
			} else if (userCard.getStatus() === UserCardStatus.ToReviewInTwoDays) {
				if (lastReviewedAt === null) {
					dueReviewAt = moment().add(2, "d");
				} else {
					dueReviewAt = lastReviewedAt.add(2, "d");
				}
			} else if (userCard.getStatus() === UserCardStatus.ToReviewInFourDays) {
				if (lastReviewedAt === null) {
					dueReviewAt = moment().add(4, "d");
				} else {
					dueReviewAt = lastReviewedAt.add(4, "d");
				}
			} else if (userCard.getStatus() === UserCardStatus.ToReviewInOneWeek) {
				if (lastReviewedAt === null) {
					dueReviewAt = moment().add(7, "d");
				} else {
					dueReviewAt = lastReviewedAt.add(7, "d");
				}
			}

			return {
				id: userCard.getId(),
				content: userCard.getContent(),
				status: userCard.getStatus(),
				createdAt: userCard.getCreatedAt(),
				updatedAt: userCard.getUpdatedAt(),
				dueReviewAt: dueReviewAt,
			};
		});
	}
}

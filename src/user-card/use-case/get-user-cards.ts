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
			return {
				id: userCard.getId(),
				content: userCard.getContent(),
				status: userCard.getStatus(),
				createdAt: userCard.getCreatedAt(),
				updatedAt: userCard.getUpdatedAt(),
				dueReviewAt: userCard.getDueReviewAt(),
			};
		});
	}
}

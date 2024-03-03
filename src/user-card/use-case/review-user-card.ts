import { StatusCodes } from "http-status-codes";
import moment from "moment";
import { HttpError } from "../../lib/error/http-error";
import { UserDataAccessInterface } from "../../user/data-access-interface";
import { UserCardDataAccessInterface } from "../data-access-interface";
import { UserCardEntity, UserCardStatus } from "../entity";

export class ReviewUserCardUseCase {
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

	async execute({
		userId,
		userCardId,
		statusChange,
	}: { userId: string; userCardId: string; statusChange: number }) {
		const user = await this.userDataAccess.getUserById(userId);
		if (user === null) {
			throw new HttpError(StatusCodes.UNAUTHORIZED, "User not found");
		}

		const userCard = await this.userCardDataAccess.getUserCardById(userCardId);

		if (userCard === null) {
			throw new HttpError(StatusCodes.BAD_REQUEST, "User card not found");
		}

		if (userCard.getUserId() !== user.getId()) {
			throw new HttpError(
				StatusCodes.UNAUTHORIZED,
				"Unauthorized access to user card",
			);
		}

		const updatedUserCard = new UserCardEntity({
			id: userCard.getId(),
			userId: userCard.getUserId(),
			content: userCard.getContent(),
			status: this.getTargetStatus(userCard, statusChange),
			lastReviewedAt: moment(),
			createdAt: userCard.getCreatedAt(),
			updatedAt: userCard.getUpdatedAt(),
		});

		await this.userCardDataAccess.updateUserCard(updatedUserCard);

		return updatedUserCard;
	}

	getTargetStatus(userCard: UserCardEntity, statusChange: number) {
		let targetStatus: number;
		if (statusChange === -1) {
			targetStatus = UserCardStatus.ToReviewImmediately;
		} else if (statusChange === 0) {
			targetStatus = userCard.getStatus();
		} else {
			targetStatus = Math.min(
				userCard.getStatus() + 1,
				UserCardStatus.ToReviewInOneWeek,
			);
		}

		return targetStatus;
	}
}

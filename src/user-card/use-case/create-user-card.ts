import { StatusCodes } from "http-status-codes";
import moment from "moment";
import { HttpError } from "../../lib/error/http-error";
import { UserDataAccessInterface } from "../../user/data-access-interface";
import { UserCardDataAccessInterface } from "../data-access-interface";
import { UserCardEntity, UserCardStatus } from "../entity";

export class CreateUserCardUseCase {
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
		content,
	}: {
		userId: string;
		content: string;
	}) {
		const user = await this.userDataAccess.getUserById(userId);
		if (user === null) {
			throw new HttpError(StatusCodes.UNAUTHORIZED, "User not found");
		}

		const insertedUserCard = await this.userCardDataAccess.insertUserCard(
			new UserCardEntity({
				userId,
				content,
				status: UserCardStatus.ToReviewInOneDay,
				lastReviewedAt: null,
				createdAt: moment(),
				updatedAt: moment(),
			}),
		);

		return {
			userCard: insertedUserCard,
		};
	}
}

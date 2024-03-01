import moment from "moment";
import { UserCardDataAccessInterface } from "../data-access-interface";
import { UserCardEntity, UserCardStatus } from "../entity";

export class CreateUserCardUseCase {
	private userCardDataAccess: UserCardDataAccessInterface;

	constructor(userCardDataAccess: UserCardDataAccessInterface) {
		this.userCardDataAccess = userCardDataAccess;
	}

	async execute({
		userId,
		content,
	}: {
		userId: string;
		content: string;
	}) {
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

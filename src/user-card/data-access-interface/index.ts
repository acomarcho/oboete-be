import { UserCardEntity } from "../entity";

export type GetUserCardsFilter = {
	userId: string;
	dueReviewAt?: moment.Moment;
};

export interface UserCardDataAccessInterface {
	insertUserCard(userCard: UserCardEntity): Promise<UserCardEntity>;
	getUserCards(filter: GetUserCardsFilter): Promise<UserCardEntity[]>;
}

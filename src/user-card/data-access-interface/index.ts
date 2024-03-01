import { UserCardEntity } from "../entity";

export type GetUserCardsFilter = {
	userId: string;
};

export interface UserCardDataAccessInterface {
	insertUserCard(userCard: UserCardEntity): Promise<UserCardEntity>;
	getUserCards(filter: GetUserCardsFilter): Promise<UserCardEntity[]>;
}

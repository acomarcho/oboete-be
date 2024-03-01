import { UserCardEntity } from "../entity";

export interface UserCardDataAccessInterface {
	insertUserCard(userCard: UserCardEntity): Promise<UserCardEntity>;
}

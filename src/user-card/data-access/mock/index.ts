import {
	GetUserCardsFilter,
	UserCardDataAccessInterface,
} from "../../data-access-interface";
import { UserCardEntity } from "../../entity";

export class MockUserCardDataAccess implements UserCardDataAccessInterface {
	getUserCards(filter: GetUserCardsFilter): Promise<UserCardEntity[]> {
		throw new Error("Method not implemented.");
	}
	insertUserCard(userCard: UserCardEntity): Promise<UserCardEntity> {
		throw new Error("Method not implemented.");
	}
}

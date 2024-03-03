import {
	GetUserCardsFilter,
	UserCardDataAccessInterface,
} from "../../data-access-interface";
import { UserCardEntity } from "../../entity";

export class MockUserCardDataAccess implements UserCardDataAccessInterface {
	getUserCardById(userCardId: string): Promise<UserCardEntity | null> {
		throw new Error("Method not implemented.");
	}
	updateUserCard(userCard: UserCardEntity): Promise<UserCardEntity> {
		throw new Error("Method not implemented.");
	}
	getUserCards(filter: GetUserCardsFilter): Promise<UserCardEntity[]> {
		throw new Error("Method not implemented.");
	}
	insertUserCard(userCard: UserCardEntity): Promise<UserCardEntity> {
		throw new Error("Method not implemented.");
	}
}

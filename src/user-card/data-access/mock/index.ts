import { UserCardDataAccessInterface } from "../../data-access-interface";
import { UserCardEntity } from "../../entity";

export class MockUserCardDataAccess implements UserCardDataAccessInterface {
	insertUserCard(userCard: UserCardEntity): Promise<UserCardEntity> {
		throw new Error("Method not implemented.");
	}
}

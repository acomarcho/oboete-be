import { UserDataAccessInterface } from "../../data-access-interface";
import { UserEntity } from "../../entity";

export class MockUserDataAccess implements UserDataAccessInterface {
	getUserById(id: string): Promise<UserEntity | null> {
		throw new Error("Method not implemented.");
	}
	insertUser(user: UserEntity): Promise<UserEntity> {
		throw new Error("Method not implemented.");
	}
	getUserByUsername(username: string): Promise<UserEntity | null> {
		throw new Error("Method not implemented.");
	}
	getUserByEmail(email: string): Promise<UserEntity | null> {
		throw new Error("Method not implemented.");
	}
}

import { UserEntity } from "../entity";

export interface UserDataAccessInterface {
	insertUser(user: UserEntity): Promise<UserEntity>;
	getUserById(id: string): Promise<UserEntity | null>;
	getUserByUsername(username: string): Promise<UserEntity | null>;
	getUserByEmail(email: string): Promise<UserEntity | null>;
	upsertUserToken(userId: string, token: string): Promise<string>;
	deleteUserToken(userId: string): Promise<boolean>;
}

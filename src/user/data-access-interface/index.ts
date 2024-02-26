import { UserEntity } from "../entity";

export interface UserDataAccessInterface {
	insertUser(user: UserEntity): Promise<UserEntity>;
	getUserByUsername(username: string): Promise<UserEntity | null>;
	getUserByEmail(email: string): Promise<UserEntity | null>;
}

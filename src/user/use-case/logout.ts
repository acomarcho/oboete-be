import { StatusCodes } from "http-status-codes";
import { HttpError } from "../../lib/error/http-error";
import { UserDataAccessInterface } from "../data-access-interface";

export class LogOutUseCase {
	private userDataAccess: UserDataAccessInterface;

	constructor(userDataAccess: UserDataAccessInterface) {
		this.userDataAccess = userDataAccess;
	}

	async execute({ userId }: { userId: string }) {
		const user = await this.userDataAccess.getUserById(userId);

		if (user === null) {
			throw new HttpError(StatusCodes.BAD_REQUEST, "Invalid credentials!");
		}

		try {
			await this.userDataAccess.deleteUserToken(userId);
		} catch {
			throw new HttpError(
				StatusCodes.BAD_REQUEST,
				"You have been logged out already!",
			);
		}

		return true;
	}
}

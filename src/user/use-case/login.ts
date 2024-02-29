import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { HttpError } from "../../lib/error/http-error";
import { UserDataAccessInterface } from "../data-access-interface";

export class LoginUseCase {
	private userDataAccess: UserDataAccessInterface;

	constructor(userDataAccess: UserDataAccessInterface) {
		this.userDataAccess = userDataAccess;
	}

	async execute({
		usernameOrEmail,
		password,
	}: {
		usernameOrEmail: string;
		password: string;
	}) {
		const userByEmail =
			await this.userDataAccess.getUserByEmail(usernameOrEmail);
		const userByUsername =
			await this.userDataAccess.getUserByUsername(usernameOrEmail);
		const user = userByEmail || userByUsername;

		if (user === null) {
			throw new HttpError(StatusCodes.BAD_REQUEST, "Invalid credentials!");
		}

		const isPasswordCorrect = await bcrypt.compare(
			password,
			user.getHashedPassword(),
		);

		if (!isPasswordCorrect) {
			throw new HttpError(StatusCodes.BAD_REQUEST, "Invalid credentials!");
		}

		const refreshToken = await jwt.sign(
			{
				userId: user.getId(),
			},
			process.env.REFRESH_SECRET || "secret",
			{
				expiresIn: "30d",
			},
		);
		const accessToken = await jwt.sign(
			{
				userId: user.getId(),
				username: user.getUsername(),
			},
			process.env.ACCESS_SECRET || "secret",
			{
				expiresIn: "5m",
			},
		);

		await this.userDataAccess.upsertUserToken(user.getId(), refreshToken);

		return {
			refreshToken,
			accessToken,
		};
	}
}

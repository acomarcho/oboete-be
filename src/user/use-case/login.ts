import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import { HttpError } from "../../lib/error/http-error";
import { JwtInterface } from "../../lib/jwt";
import { UserDataAccessInterface } from "../data-access-interface";

export class LoginUseCase {
	private userDataAccess: UserDataAccessInterface;
	private jwt: JwtInterface;

	constructor(userDataAccess: UserDataAccessInterface, jwt: JwtInterface) {
		this.userDataAccess = userDataAccess;
		this.jwt = jwt;
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

		const refreshToken = this.jwt.sign(
			{
				userId: user.getId(),
			},
			process.env.REFRESH_SECRET || "secret",
			{
				expiresIn: "30d",
			},
		);
		const accessToken = this.jwt.sign(
			{
				userId: user.getId(),
			},
			process.env.ACCESS_SECRET || "secret",
			{
				expiresIn: "5m",
			},
		);

		await this.userDataAccess.upsertUserToken(user.getId(), refreshToken);

		return {
			tokens: {
				refreshToken,
				accessToken,
			},
			user: {
				id: user.getId(),
				username: user.getUsername(),
				email: user.getEmail(),
			},
		};
	}
}

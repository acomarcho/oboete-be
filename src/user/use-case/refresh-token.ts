import { StatusCodes } from "http-status-codes";
import Joi from "joi";
import jwt from "jsonwebtoken";
import { HttpError } from "../../lib/error/http-error";
import { UserDataAccessInterface } from "../data-access-interface";

export class RefreshTokenUseCase {
	private userDataAccess: UserDataAccessInterface;

	constructor(userDataAccess: UserDataAccessInterface) {
		this.userDataAccess = userDataAccess;
	}

	async execute({ refreshToken }: { refreshToken: string }) {
		try {
			const decodedToken = jwt.verify(
				refreshToken,
				process.env.REFRESH_SECRET || "secret",
			);

			type jwtToken = {
				userId: string;
			};
			const tokenSchema = Joi.object<jwtToken>({
				userId: Joi.string().required(),
			});
			const { value: parsedToken, error } = tokenSchema.validate(decodedToken);

			if (error) {
				throw new Error("Invalid refresh token!");
			}

			const user = await this.userDataAccess.getUserById(parsedToken.userId);
			if (!user) {
				throw new Error("Invalid refresh token!");
			}

			const accessToken = await jwt.sign(
				{
					userId: user.getId(),
				},
				process.env.ACCESS_SECRET || "secret",
				{
					expiresIn: "5m",
				},
			);

			return {
				accessToken,
			};
		} catch {
			throw new HttpError(StatusCodes.UNAUTHORIZED, "Invalid refresh token!");
		}
	}
}

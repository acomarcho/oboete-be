import { StatusCodes } from "http-status-codes";
import Joi from "joi";
import { HttpError } from "../../lib/error/http-error";
import { JwtInterface } from "../../lib/jwt";
import { UserDataAccessInterface } from "../data-access-interface";

export class RefreshTokenUseCase {
	private userDataAccess: UserDataAccessInterface;
	private jwt: JwtInterface;

	constructor(userDataAccess: UserDataAccessInterface, jwt: JwtInterface) {
		this.userDataAccess = userDataAccess;
		this.jwt = jwt;
	}

	async execute({ refreshToken }: { refreshToken: string }) {
		try {
			const decodedToken = this.jwt.verify(
				refreshToken,
				process.env.REFRESH_SECRET || "secret",
			);

			type jwtToken = {
				userId: string;
			};
			const tokenSchema = Joi.object<jwtToken>({
				userId: Joi.string().required(),
			}).unknown(true);
			const { value: parsedToken, error } = tokenSchema.validate(decodedToken);

			if (error) {
				throw new HttpError(StatusCodes.UNAUTHORIZED, "Invalid refresh token!");
			}

			const user = await this.userDataAccess.getUserById(parsedToken.userId);
			if (!user) {
				throw new HttpError(StatusCodes.UNAUTHORIZED, "Invalid refresh token!");
			}

			const userToken = await this.userDataAccess.getUserTokenByUserId(
				user.getId(),
			);
			if (refreshToken !== userToken) {
				throw new HttpError(StatusCodes.UNAUTHORIZED, "Invalid refresh token!");
			}

			const accessToken = this.jwt.sign(
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
		} catch (error) {
			throw new HttpError(StatusCodes.UNAUTHORIZED, "Invalid refresh token!");
		}
	}
}

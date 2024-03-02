import express from "express";
import { StatusCodes } from "http-status-codes";
import { HttpError } from "../../lib/error/http-error";
import { handleError } from "../../lib/http-helper/handle-error";
import { HttpResponse } from "../../lib/response";
import isAuthenticated from "../../middleware/auth";
import { RequestWithUserId } from "../../types/express";
import { LoginUseCase } from "../use-case/login";
import { LogOutUseCase } from "../use-case/logout";
import { RefreshTokenUseCase } from "../use-case/refresh-token";
import { RegisterUseCase } from "../use-case/register";
import { loginSchema, registerSchema } from "./request";

export class UserController {
	private router;
	private registerUseCase;
	private loginUseCase;
	private logoutUseCase;
	private refreshTokenUseCase;

	constructor({
		registerUseCase,
		loginUseCase,
		logoutUseCase,
		refreshTokenUseCase,
	}: {
		registerUseCase: RegisterUseCase;
		loginUseCase: LoginUseCase;
		logoutUseCase: LogOutUseCase;
		refreshTokenUseCase: RefreshTokenUseCase;
	}) {
		this.registerUseCase = registerUseCase;
		this.loginUseCase = loginUseCase;
		this.logoutUseCase = logoutUseCase;
		this.refreshTokenUseCase = refreshTokenUseCase;

		this.router = express.Router();

		this.router.post("/register", async (req, res) => {
			try {
				const { value: registerBody, error } = registerSchema.validate(
					req.body,
				);

				if (error) {
					throw new HttpError(StatusCodes.BAD_REQUEST, error.message);
				}

				const { username, email, password } = registerBody;
				const registeredUser = await this.registerUseCase.execute({
					username,
					email,
					password,
				});

				return res.status(StatusCodes.OK).json(
					new HttpResponse({
						user: {
							username: registeredUser.getUsername(),
							email: registeredUser.getEmail(),
						},
					}).toJson(),
				);
			} catch (error) {
				return handleError(res, error);
			}
		});

		this.router.post("/login", async (req, res) => {
			try {
				const { value: loginBody, error } = loginSchema.validate(req.body);

				if (error) {
					throw new HttpError(StatusCodes.BAD_REQUEST, error.message);
				}

				const { usernameOrEmail, password } = loginBody;
				const loginData = await this.loginUseCase.execute({
					usernameOrEmail: usernameOrEmail,
					password: password,
				});

				res.cookie("refreshToken", loginData.tokens.refreshToken, {
					httpOnly: true,
				});
				res.cookie("accessToken", loginData.tokens.accessToken, {
					httpOnly: true,
				});

				return res.status(StatusCodes.OK).json(
					new HttpResponse({
						tokens: {
							refreshToken: loginData.tokens.refreshToken,
							accessToken: loginData.tokens.accessToken,
						},
						user: {
							id: loginData.user.id,
							username: loginData.user.username,
							email: loginData.user.email,
						},
					}).toJson(),
				);
			} catch (error) {
				return handleError(res, error);
			}
		});

		this.router.post(
			"/logout",
			isAuthenticated,
			async (req: RequestWithUserId, res) => {
				try {
					if (!req.userId) {
						throw new HttpError(
							StatusCodes.UNAUTHORIZED,
							"You are not authenticated, cannot log out.",
						);
					}

					const success = await this.logoutUseCase.execute({
						userId: req.userId,
					});

					res.clearCookie("accessToken");
					res.clearCookie("refreshToken");

					return res.status(StatusCodes.OK).json(
						new HttpResponse({
							success,
						}).toJson(),
					);
				} catch (error) {
					return handleError(res, error);
				}
			},
		);

		this.router.post("/refresh", async (req, res) => {
			try {
				if (!req.cookies.refreshToken) {
					throw new HttpError(
						StatusCodes.UNAUTHORIZED,
						"Invalid refresh token",
					);
				}

				const token = await this.refreshTokenUseCase.execute({
					refreshToken: req.cookies.refreshToken,
				});

				res.cookie("accessToken", token.accessToken, { httpOnly: true });

				return res.status(StatusCodes.OK).json(
					new HttpResponse({
						accessToken: token.accessToken,
					}).toJson(),
				);
			} catch (error) {
				return handleError(res, error);
			}
		});
	}

	getRouter() {
		return this.router;
	}
}

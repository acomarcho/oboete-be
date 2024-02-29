import express from "express";
import { StatusCodes } from "http-status-codes";
import { HttpError } from "../../lib/error/http-error";
import { HttpResponse } from "../../lib/response";
import { LoginUseCase } from "../use-case/login";
import { RegisterUseCase } from "../use-case/register";
import { loginSchema, registerSchema } from "./request";

export class UserController {
	private router;
	private registerUseCase;
	private loginUseCase;

	constructor({
		registerUseCase,
		loginUseCase,
	}: { registerUseCase: RegisterUseCase; loginUseCase: LoginUseCase }) {
		this.registerUseCase = registerUseCase;
		this.loginUseCase = loginUseCase;

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
				if (error instanceof HttpError) {
					console.log(error);
					return res
						.status(error.getStatusCode())
						.json(
							new HttpResponse(null, new Error(error.getMessage())).toJson(),
						);
				}
				if (error instanceof Error) {
					return res
						.status(StatusCodes.INTERNAL_SERVER_ERROR)
						.json(new HttpResponse(null, new Error(error.message)).toJson());
				}
				return res
					.status(StatusCodes.INTERNAL_SERVER_ERROR)
					.json(
						new HttpResponse(null, new Error("Internal server error")).toJson(),
					);
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

				res.cookie("refresh-token", loginData.tokens.refreshToken, {
					httpOnly: true,
				});
				res.cookie("access-token", loginData.tokens.accessToken, {
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
				if (error instanceof HttpError) {
					console.log(error);
					return res
						.status(error.getStatusCode())
						.json(
							new HttpResponse(null, new Error(error.getMessage())).toJson(),
						);
				}
				if (error instanceof Error) {
					return res
						.status(StatusCodes.INTERNAL_SERVER_ERROR)
						.json(new HttpResponse(null, new Error(error.message)).toJson());
				}
				return res
					.status(StatusCodes.INTERNAL_SERVER_ERROR)
					.json(
						new HttpResponse(null, new Error("Internal server error")).toJson(),
					);
			}
		});
	}

	getRouter() {
		return this.router;
	}
}

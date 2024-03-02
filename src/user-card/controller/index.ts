import express from "express";
import { StatusCodes } from "http-status-codes";
import moment from "moment";
import { HttpError } from "../../lib/error/http-error";
import { handleError } from "../../lib/http-helper/handle-error";
import { HttpResponse } from "../../lib/response";
import isAuthenticated from "../../middleware/auth";
import { RequestWithUserId } from "../../types/express";
import { CreateUserCardUseCase } from "../use-case/create-user-card";
import { GetUserCardsUseCase } from "../use-case/get-user-cards";
import { createUserCardSchema, getUserCardsSchema } from "./request";

export class UserCardController {
	private router;
	private createUserCardUseCase;
	private getUserCardsUseCase;

	constructor({
		createUserCardUseCase,
		getUserCardsUseCase,
	}: {
		createUserCardUseCase: CreateUserCardUseCase;
		getUserCardsUseCase: GetUserCardsUseCase;
	}) {
		this.createUserCardUseCase = createUserCardUseCase;
		this.getUserCardsUseCase = getUserCardsUseCase;

		this.router = express.Router();

		this.router.post(
			"/",
			isAuthenticated,
			async (req: RequestWithUserId, res) => {
				try {
					if (!req.userId) {
						throw new HttpError(
							StatusCodes.UNAUTHORIZED,
							"You are not authenticated.",
						);
					}

					const { value: requestData, error } = createUserCardSchema.validate(
						req.body,
					);
					if (error) {
						throw new HttpError(StatusCodes.BAD_REQUEST, error.message);
					}

					const insertedUserCard = await this.createUserCardUseCase.execute({
						userId: req.userId,
						content: requestData.content,
					});

					return res.status(StatusCodes.OK).json(
						new HttpResponse({
							userCard: insertedUserCard,
						}).toJson(),
					);
				} catch (error) {
					return handleError(res, error);
				}
			},
		);

		this.router.get(
			"/",
			isAuthenticated,
			async (req: RequestWithUserId, res) => {
				try {
					if (!req.userId) {
						throw new HttpError(
							StatusCodes.UNAUTHORIZED,
							"You are not authenticated.",
						);
					}

					const { value: requestData, error } = getUserCardsSchema.validate(
						req.query,
					);
					if (error) {
						throw new HttpError(StatusCodes.BAD_REQUEST, error.message);
					}

					const userCards = await this.getUserCardsUseCase.execute({
						userId: req.userId,
						dueReviewAt: requestData.dueReviewAt
							? moment(requestData.dueReviewAt)
							: undefined,
					});

					return res.status(StatusCodes.OK).json(
						new HttpResponse({
							userCards,
						}).toJson(),
					);
				} catch (error) {
					return handleError(res, error);
				}
			},
		);
	}

	getRouter() {
		return this.router;
	}
}

import Joi from "joi";

export type CreateUserCardRequest = {
	content: string;
};
export const createUserCardSchema = Joi.object<CreateUserCardRequest>({
	content: Joi.string().required(),
});

export type GetUserCardsRequest = {
	dueReviewAt?: Date;
};
export const getUserCardsSchema = Joi.object<GetUserCardsRequest>({
	dueReviewAt: Joi.date(),
});

export type ReviewUserCardRequest = {
	statusChange: number;
};
export const reviewUserCardSchema = Joi.object<ReviewUserCardRequest>({
	statusChange: Joi.number().required().min(-1).max(1),
});

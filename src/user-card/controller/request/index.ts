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

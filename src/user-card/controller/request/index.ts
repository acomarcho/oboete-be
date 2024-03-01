import Joi from "joi";

export type CreateUserCardRequest = {
	content: string;
};

export const createUserCardSchema = Joi.object<CreateUserCardRequest>({
	content: Joi.string().required(),
});
